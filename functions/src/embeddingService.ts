import { GoogleGenerativeAI } from '@google/generative-ai';

let genAIInstance: GoogleGenerativeAI | null = null;

function getGenAI() {
    if (!genAIInstance) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not set');
        }
        genAIInstance = new GoogleGenerativeAI(apiKey);
    }
    return genAIInstance;
}

export const embeddingService = {
    generateEmbedding: async (text: string) => {
        const genAI = getGenAI();
        const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });

        const result = await model.embedContent(text);
        const embedding = result.embedding;

        return embedding.values;
    }
};
