import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const aiService = {
    getChatResponse: async (context: string, question: string) => {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `Você é um assistente técnico especializado em Honda Civic (1992-2000). 
          Use o seguinte contexto técnico extraído de manuais para responder à pergunta do usuário. 
          Se a resposta não estiver no contexto, diga que não encontrou essa informação específica no manual, mas forneça dicas gerais se apropriado.
          
          Contexto:
          ${context}`
                },
                { role: 'user', content: question }
            ],
            temperature: 0.3,
        });

        return response.choices[0].message.content;
    }
};
