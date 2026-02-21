import {
    collection,
    getDocs,
    query,
    orderBy,
    doc,
    deleteDoc
} from 'firebase/firestore';
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import type { Document } from '../types';

export const LibraryService = {
    uploadFile: async (file: File) => {
        let folder = 'outro';
        if (file.type.includes('pdf')) folder = 'pdf';
        else if (file.type.includes('image')) folder = 'imagens';
        else if (file.type.includes('audio')) folder = 'audios';
        else if (file.type.includes('video')) folder = 'videos';

        const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        return {
            name: file.name,
            url: downloadURL
        };
    },

    getDocuments: async () => {
        try {
            // Priority query with ordering
            const q = query(collection(db, 'documents'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Document));
        } catch (error) {
            console.error('Error fetching documents with ordering:', error);
            // Fallback query without ordering (in case index is missing)
            try {
                const q = query(collection(db, 'documents'));
                const querySnapshot = await getDocs(q);
                return querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Document));
            } catch (innerError) {
                console.error('Error fetching documents fallback:', innerError);
                throw innerError;
            }
        }
    },

    deleteFile: async (id: string, fileUrl: string) => {
        // 1. Delete from Firestore
        await deleteDoc(doc(db, 'documents', id));

        // 2. Delete from Storage (if possible to extract path)
        try {
            // URL format: https://firebasestorage.googleapis.com/v0/b/[BUCKET]/o/[PATH]?alt=media&token=[TOKEN]
            const decodedUrl = decodeURIComponent(fileUrl);
            const pathStart = decodedUrl.indexOf('/o/') + 3;
            const pathEnd = decodedUrl.indexOf('?');
            const storagePath = decodedUrl.substring(pathStart, pathEnd);

            if (storagePath) {
                const storageRef = ref(storage, storagePath);
                await deleteObject(storageRef);
            }
        } catch (error) {
            console.error('Error deleting file from storage:', error);
            // We don't throw here to avoid blocking UI if only storage deletion fails
        }
    }
};
