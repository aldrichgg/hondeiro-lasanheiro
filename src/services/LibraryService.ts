import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Document } from '../types';

const COLLECTION = 'documents';

/**
 * Lista todos os documentos da biblioteca técnica, ordenados por data (mais recente primeiro).
 */
export async function getDocuments(): Promise<Document[]> {
    const q = query(
        collection(db, COLLECTION),
        orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Document[];
}

/**
 * Busca documentos por palavra-chave no título (case-insensitive).
 * Se keyword estiver vazio, retorna todos (equivalente a getDocuments).
 */
export async function searchDocuments(keyword: string): Promise<Document[]> {
    const all = await getDocuments();
    if (!keyword.trim()) return all;
    const lower = keyword.trim().toLowerCase();
    return all.filter((doc) => doc.title.toLowerCase().includes(lower));
}

export const LibraryService = {
    getDocuments,
    searchDocuments,
};
