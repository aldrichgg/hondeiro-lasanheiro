import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Document } from '../types';

const COLLECTION = 'documents';

/**
 * Lista todos os documentos da biblioteca técnica, opcionalmente filtrados por categoria.
 */
export async function getDocuments(categoryId?: string): Promise<Document[]> {
    const q = query(
        collection(db, COLLECTION),
        orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Document[];

    if (categoryId && categoryId !== 'all') {
        return docs.filter(doc => doc.category === categoryId);
    }

    return docs;
}

/**
 * Busca documentos por palavra-chave no título (case-insensitive).
 */
export async function searchDocuments(keyword: string, categoryId?: string): Promise<Document[]> {
    const all = await getDocuments(categoryId);
    if (!keyword.trim()) return all;
    const lower = keyword.trim().toLowerCase();
    return all.filter((doc) => doc.title.toLowerCase().includes(lower));
}

export const LibraryService = {
    getDocuments,
    searchDocuments,
};
