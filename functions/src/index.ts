import 'dotenv/config';
import * as admin from 'firebase-admin';

// Initialize admin at the very beginning
if (!admin.apps.length) {
    admin.initializeApp();
}

import { onRequest } from 'firebase-functions/v2/https';
import { chatService } from './chatService';
import { processDocument } from './documentProcessor';
import { reindexKnowledgeBase } from './reindex';

// Gen 2 functions automatically load .env files from the functions directory
export const askAI = onRequest({ cors: true, region: 'us-central1' }, async (req, res) => {
    try {
        console.log('Incoming request to askAI. Provider check:', !!process.env.GEMINI_API_KEY ? 'Gemini OK' : 'Gemini MISSING');

        const { question, provider } = req.body.data || req.body;
        if (!question) {
            res.status(400).send({ data: { error: 'Question is required' } });
            return;
        }

        const answer = await chatService.askAI(question, provider);
        res.send({ data: { answer } });
    } catch (error: any) {
        console.error('Error in askAI:', error);
        res.status(500).send({ data: { error: error.message } });
    }
});

export const reindexSettings = onRequest({ cors: true, region: 'us-central1' }, async (req, res) => {
    try {
        const result = await reindexKnowledgeBase();
        res.send({ data: result });
    } catch (error: any) {
        console.error('Error in reindexSettings:', error);
        res.status(500).send({ data: { error: error.message } });
    }
});

export { processDocument };
