import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

let genAIInstance: GoogleGenerativeAI | null = null;
let openaiInstance: OpenAI | null = null;

function getGenAI() {
    if (!genAIInstance) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error('GEMINI_API_KEY is not set');
        genAIInstance = new GoogleGenerativeAI(apiKey);
    }
    return genAIInstance;
}

function getOpenAI() {
    if (!openaiInstance) {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) throw new Error('OPENAI_API_KEY is not set');
        openaiInstance = new OpenAI({ apiKey });
    }
    return openaiInstance;
}

export const aiService = {
    getChatResponse: async (context: string, question: string, provider: string = 'gemini') => {
        const systemPrompt = `Você é um assistente técnico especializado em Honda Civic (1992-2000). 
      Use o seguinte contexto técnico extraído de manuais para responder à pergunta do usuário. 
      Se a resposta não estiver no contexto, diga que não encontrou essa informação específica no manual, mas forneça dicas gerais se apropriado.
      
      Contexto:
      ${context}`;

        if (provider === 'openai') {
            const openai = getOpenAI();
            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: question }
                ],
                temperature: 0.3,
            });
            const content = response.choices[0]?.message?.content;
            if (content == null) throw new Error('Resposta vazia da OpenAI');
            return content;
        } else {
            const genAI = getGenAI();
            const model = genAI.getGenerativeModel({
                model: 'gemini-1.5-flash',
                systemInstruction: systemPrompt
            });

            const result = await model.generateContent(question);
            const response = await result.response;
            const text = response.text?.();
            if (text == null) throw new Error('Resposta vazia ou bloqueada do Gemini');
            return text;
        }
    }
};
