import OpenAI from 'openai';

let openaiInstance: OpenAI | null = null;

function getOpenAI() {
    if (!openaiInstance) {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error('OPENAI_API_KEY is not set');
        }
        openaiInstance = new OpenAI({ apiKey });
    }
    return openaiInstance;
}

export const embeddingService = {
    generateEmbedding: async (text: string) => {
        const openai = getOpenAI();
        const response = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: text,
            encoding_format: 'float',
        });

        return response.data[0].embedding;
    }
};
