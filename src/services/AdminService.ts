import {
    collection,
    getDocs,
    doc,
    deleteDoc,
    addDoc,
    updateDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Vehicle, Document, Seller } from '../types';

export const AdminService = {
    // Vehicles
    getAllVehicles: async (): Promise<Vehicle[]> => {
        const snapshot = await getDocs(collection(db, 'vehicles'));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Vehicle[];
    },
    deleteVehicle: async (id: string) => {
        await deleteDoc(doc(db, 'vehicles', id));
    },

    // Library
    addDocument: async (data: Omit<Document, 'id' | 'createdAt'>) => {
        const docRef = await addDoc(collection(db, 'documents'), {
            ...data,
            createdAt: new Date()
        });
        return docRef.id;
    },
    updateDocument: async (id: string, data: Partial<Document>) => {
        await updateDoc(doc(db, 'documents', id), data);
    },
    deleteDocument: async (id: string) => {
        await deleteDoc(doc(db, 'documents', id));
    },

    // Sellers
    addSeller: async (data: Omit<Seller, 'id' | 'createdAt'>) => {
        const docRef = await addDoc(collection(db, 'sellers'), {
            ...data,
            createdAt: new Date()
        });
        return docRef.id;
    },
    updateSeller: async (id: string, data: Partial<Seller>) => {
        await updateDoc(doc(db, 'sellers', id), data);
    },
    deleteSeller: async (id: string) => {
        await deleteDoc(doc(db, 'sellers', id));
    }
};
