import {
    collection,
    getDocs,
    query,
    orderBy
} from 'firebase/firestore';
import {
    ref,
    uploadBytes,
    getDownloadURL
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
    }
};
