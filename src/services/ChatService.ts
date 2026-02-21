import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    getDocs,
    writeBatch,
    doc
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { db } from '../lib/firebase';
import type { ChatMessage, ChatSession } from '../types';

const functions = getFunctions();
const askAICallable = httpsCallable(functions, 'askAI');

export const ChatService = {
    sendMessage: async (userId: string, sessionId: string, content: string, provider: string = 'gemini') => {
        // Add user message to Firestore
        await addDoc(collection(db, 'chat_messages'), {
            userId,
            sessionId,
            role: 'user',
            content,
            createdAt: serverTimestamp()
        });

        // Call Cloud Function for RAG with selected provider
        const result = await askAICallable({ question: content, provider });
        const responseData = result.data as { answer: string };

        // Add assistant response to Firestore
        await addDoc(collection(db, 'chat_messages'), {
            userId,
            sessionId,
            role: 'assistant',
            content: responseData.answer,
            createdAt: serverTimestamp()
        });

        return responseData.answer;
    },

    subscribeToSessions: (userId: string, callback: (sessions: ChatSession[]) => void, onError?: (error: any) => void) => {
        const q = query(
            collection(db, 'chat_sessions'),
            where('userId', '==', userId),
            orderBy('lastMessageAt', 'desc')
        );

        return onSnapshot(q, (snapshot) => {
            const sessions = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as ChatSession));
            callback(sessions);
        }, onError);
    },

    subscribeToMessages: (userId: string, sessionId: string, callback: (messages: ChatMessage[]) => void, onError?: (error: any) => void) => {
        const q = query(
            collection(db, 'chat_messages'),
            where('userId', '==', userId),
            where('sessionId', '==', sessionId),
            orderBy('createdAt', 'asc')
        );

        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as ChatMessage));
            callback(messages);
        }, onError);
    },

    createSession: async (userId: string, title: string = 'Nova Conversa') => {
        const docRef = await addDoc(collection(db, 'chat_sessions'), {
            userId,
            title,
            createdAt: serverTimestamp(),
            lastMessageAt: serverTimestamp()
        });
        return docRef.id;
    },

    deleteSession: async (userId: string, sessionId: string) => {
        const batch = writeBatch(db);

        // Delete session doc
        batch.delete(doc(db, 'chat_sessions', sessionId));

        // Delete all messages in session (filtering by userId for security)
        const q = query(
            collection(db, 'chat_messages'),
            where('userId', '==', userId),
            where('sessionId', '==', sessionId)
        );
        const snapshot = await getDocs(q);
        snapshot.docs.forEach((d) => batch.delete(d.ref));

        await batch.commit();
    },

    clearChat: async (userId: string) => {
        // This now probably should clear ALL sessions or be removed in favor of deleteSession
        const q = query(collection(db, 'chat_sessions'), where('userId', '==', userId));
        const snapshot = await getDocs(q);

        for (const sessionDoc of snapshot.docs) {
            await ChatService.deleteSession(userId, sessionDoc.id);
        }
    }
};
