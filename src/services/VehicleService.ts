import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    getDocs,
    onSnapshot,
    serverTimestamp,
    limit,
    orderBy,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Vehicle } from '../types';

const COLLECTION = 'vehicles';

/**
 * Cria um veículo. MVP: cada usuário pode ter no máximo um veículo.
 * @throws Se o usuário já possuir um veículo
 */
export async function createVehicle(data: Omit<Vehicle, 'id' | 'createdAt'>): Promise<string> {
    const existing = await getUserVehicle(data.userId);
    if (existing) {
        throw new Error('Você já possui um veículo cadastrado. Edite ou exclua o atual para cadastrar outro.');
    }
    const docRef = await addDoc(collection(db, COLLECTION), {
        ...data,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}

/**
 * Retorna o veículo do usuário, ou null se não houver (MVP: 1 por usuário).
 */
export async function getUserVehicle(userId: string): Promise<Vehicle | null> {
    const q = query(
        collection(db, COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(1)
    );
    const snapshot = await getDocs(q);
    const first = snapshot.docs[0];
    if (!first) return null;
    return { id: first.id, ...first.data() } as Vehicle;
}

/**
 * Atualiza um veículo existente.
 */
export async function updateVehicle(id: string, data: Partial<Omit<Vehicle, 'id' | 'userId' | 'createdAt'>>): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, data as Record<string, unknown>);
}

/**
 * Remove um veículo.
 */
export async function deleteVehicle(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
}

/**
 * Inscreve-se em tempo real na lista de veículos do usuário (MVP: 0 ou 1).
 */
export function subscribeToUserVehicle(userId: string, callback: (vehicle: Vehicle | null) => void): () => void {
    const q = query(
        collection(db, COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(1)
    );
    return onSnapshot(q, (snapshot) => {
        const first = snapshot.docs[0];
        if (!first) {
            callback(null);
            return;
        }
        callback({ id: first.id, ...first.data() } as Vehicle);
    });
}

export const VehicleService = {
    createVehicle,
    getUserVehicle,
    updateVehicle,
    deleteVehicle,
    subscribeToUserVehicle,
};
