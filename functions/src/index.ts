import 'dotenv/config';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    admin.initializeApp();
}

import { onCall, HttpsError } from 'firebase-functions/v2/https';

const CHATKIT_WORKFLOW_ID = 'wf_69992083730c8190ba39f1f3c891ae7d05e26fe333697b8d';
const CHATKIT_SESSIONS_URL = 'https://api.openai.com/v1/chatkit/sessions';

/**
 * Cria uma sessão ChatKit para o usuário autenticado.
 * O frontend usa o client_secret para conectar o widget ao workflow Hondeiro Lasanheiro.
 * Documentação: https://developers.openai.com/api/docs/guides/chatkit
 */
export const createChatKitSession = onCall({ region: 'us-central1' }, async (request) => {
    if (!request.auth?.uid) {
        throw new HttpsError('unauthenticated', 'Usuário deve estar autenticado.');
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new HttpsError('failed-precondition', 'OPENAI_API_KEY não configurada.');
    }

    try {
        const res = await fetch(CHATKIT_SESSIONS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'OpenAI-Beta': 'chatkit_beta=v1',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                workflow: { id: CHATKIT_WORKFLOW_ID },
                user: request.auth.uid,
            }),
        });

        if (!res.ok) {
            const errText = await res.text();
            console.error('ChatKit session error:', res.status, errText);
            throw new HttpsError('internal', `Erro ao criar sessão ChatKit: ${res.status}`);
        }

        const data = (await res.json()) as { client_secret?: string };
        const clientSecret = data?.client_secret;
        if (!clientSecret) {
            throw new HttpsError('internal', 'Resposta ChatKit sem client_secret.');
        }

        return { client_secret: clientSecret };
    } catch (e: unknown) {
        if (e instanceof HttpsError) throw e;
        const message = e instanceof Error ? e.message : 'Erro ao criar sessão.';
        console.error('createChatKitSession:', e);
        throw new HttpsError('internal', message);
    }
});
