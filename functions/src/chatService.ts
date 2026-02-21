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

        // 2. Search similar chunks
        const chunks = await searchSimilarChunks(queryEmbedding);

        // 3. Build context
        const context = chunks.map(c => c.content).join('\n\n---\n\n');

        // 4. Get AI response using the selected provider
        const answer = await aiService.getChatResponse(context, question, provider);

        return answer;
    }
};

async function searchSimilarChunks(queryVector: number[]) {
    const db = getDb();
    const snapshot = await db.collection('document_chunks').limit(5).get();
    const chunks = snapshot.docs.map(doc => doc.data() as { content: string, embedding: number[] });

    // Manual cosine similarity if native vector search isn't available
    return chunks
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
