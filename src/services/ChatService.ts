import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { db } from '../lib/firebase';
import type { ChatMessage } from '../types';

const functions = getFunctions();
const askAICallable = httpsCallable(functions, 'askAI');

export const ChatService = {
    sendMessage: async (userId: string, content: string) => {
        // Add user message to Firestore
        await addDoc(collection(db, 'chat_messages'), {
            userId,
            role: 'user',
            content,
            createdAt: serverTimestamp()
        });

        // Call Cloud Function for RAG
        const result = await askAICallable({ question: content });
        const responseData = result.data as { answer: string };

        // Add assistant response to Firestore
        await addDoc(collection(db, 'chat_messages'), {
            userId,
            role: 'assistant',
            content: responseData.answer,
            createdAt: serverTimestamp()
        });

        return responseData.answer;
    },

    subscribeToMessages: (userId: string, callback: (messages: ChatMessage[]) => void) => {
        const q = query(
            collection(db, 'chat_messages'),
            where('userId', '==', userId),
            orderBy('createdAt', 'asc')
        );

        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as ChatMessage));
            callback(messages);
        });
    }
};
