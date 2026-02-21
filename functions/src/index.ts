import * as functions from 'firebase-functions';
import { chatService } from './chatService';
import { processDocument } from './documentProcessor';
import cors from 'cors';

const corsHandler = cors({ origin: true });

export const askAI = functions.https.onRequest((req, res) => {
    return corsHandler(req, res, async () => {
        try {
            const { question } = req.body.data || req.body;
            if (!question) {
                res.status(400).send({ data: { error: 'Question is required' } });
                return;
            }

            const answer = await chatService.askAI(question);
            res.send({ data: { answer } });
        } catch (error: any) {
            console.error('Error in askAI:', error);
            res.status(500).send({ data: { error: error.message } });
        }
    });
});

export { processDocument };
