import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Seller } from '../types';

const COLLECTION = 'sellers';

/**
 * Lista todos os vendedores autorizados, ordenados por nome.
 */
export async function getSellers(): Promise<Seller[]> {
    const q = query(
        collection(db, COLLECTION),
        where('verified', '==', true),
        orderBy('name', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Seller[];
}

export const SellerService = {
    getSellers,
};
