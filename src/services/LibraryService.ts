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
    uploadPDF: async (file: File) => {
        const storageRef = ref(storage, `documents/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        // The Cloud Function will be triggered by storage upload or manually.
        // However, the prompt says "Usuario envia PDF -> 1 salva no Firebase Storage -> 2 Cloud Function extrai texto".
        // We should also record the document in Firestore to show it in the UI.
        return {
            name: file.name,
            url: downloadURL
        };
    },

    getDocuments: async () => {
        const q = query(collection(db, 'documents'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Document));
    }
};
