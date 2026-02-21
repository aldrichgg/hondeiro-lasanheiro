import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    getDocs
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Vehicle } from '../types';

export const VehicleService = {
    addVehicle: async (vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => {
        return await addDoc(collection(db, 'vehicles'), {
            ...vehicle,
            createdAt: new Date() // Use regular date for simplicity if serverTimestamp is not used
        });
    },

    updateVehicle: async (id: string, vehicle: Partial<Vehicle>) => {
        const docRef = doc(db, 'vehicles', id);
        await updateDoc(docRef, vehicle);
    },

    deleteVehicle: async (id: string) => {
        await deleteDoc(doc(db, 'vehicles', id));
    },

    getUserVehicles: async (userId: string) => {
        const q = query(collection(db, 'vehicles'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Vehicle));
    }
};
