import * as admin from 'firebase-admin';
import { embeddingService } from './embeddingService';
import { aiService } from './aiService';

function getDb() {
    return admin.firestore();
}

export const chatService = {
    askAI: async (question: string, provider: string = 'gemini') => {
        // 1. Generate embedding for query (always using Gemini for embeddings)
        const queryEmbedding = await embeddingService.generateEmbedding(question);

        // 2. Search similar chunks (safe when collection is empty or chunks invalid)
        const chunks = await searchSimilarChunks(queryEmbedding);

        // 3. Build context (empty context is OK; AI will say it didn't find in manual)
        const context = chunks.length > 0
            ? chunks.map(c => c.content).join('\n\n---\n\n')
            : '(Nenhum trecho relevante encontrado na base de manuais.)';

        // 4. Get AI response using the selected provider
        const answer = await aiService.getChatResponse(context, question, provider);

        return answer ?? 'Não foi possível obter uma resposta. Tente novamente.';
    }
};

async function searchSimilarChunks(queryVector: number[]) {
    const db = getDb();
    const snapshot = await db.collection('document_chunks').limit(50).get();
    const rawChunks = snapshot.docs.map(doc => doc.data() as { content?: string; embedding?: number[] });

    // Only use chunks that have valid content and embedding of same dimension
    const validChunks = rawChunks.filter(
        (chunk): chunk is { content: string; embedding: number[] } =>
            typeof chunk.content === 'string' &&
            Array.isArray(chunk.embedding) &&
            chunk.embedding.length === queryVector.length
    );

    if (validChunks.length === 0) return [];

    return validChunks
        .map(chunk => ({
            ...chunk,
            similarity: cosineSimilarity(queryVector, chunk.embedding)
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5);
}

function cosineSimilarity(v1: number[], v2: number[]): number {
    let dot = 0;
    let mag1 = 0;
    let mag2 = 0;
    for (let i = 0; i < v1.length; i++) {
        dot += v1[i] * v2[i];
        mag1 += v1[i] * v1[i];
        mag2 += v2[i] * v2[i];
    }
    return dot / (Math.sqrt(mag1) * Math.sqrt(mag2));
}
