import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import pdf from 'pdf-parse';
import { embeddingService } from './embeddingService';

admin.initializeApp();
const db = admin.firestore();

export const processDocument = functions.storage.object().onFinalizing(async (object) => {
    const filePath = object.name;
    if (!filePath || !filePath.endsWith('.pdf')) {
        console.log('Not a PDF. Skipping.');
        return;
    }

    const bucket = admin.storage().bucket(object.bucket);
    const file = bucket.file(filePath);
    const [buffer] = await file.download();

    // 1. Extract text
    const data = await pdf(buffer);
    const text = data.text;

    // 2. Split into chunks (simple overlapping chunks)
    const chunks = chunkText(text, 1000, 200);

    // 3. Create document record
    const docRef = await db.collection('documents').add({
        title: filePath.split('/').pop(),
        fileUrl: `https://storage.googleapis.com/${object.bucket}/${filePath}`,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 4. Generate embeddings and save chunks
    const batch = db.batch();
    for (const content of chunks) {
        const embedding = await embeddingService.generateEmbedding(content);
        const chunkRef = db.collection('document_chunks').doc();
        batch.set(chunkRef, {
            documentId: docRef.id,
            content,
            embedding,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    }

    await batch.commit();
    console.log(`Document ${filePath} processed. ${chunks.length} chunks created.`);
});

function chunkText(text: string, size: number, overlap: number): string[] {
    const chunks: string[] = [];
    let start = 0;
    while (start < text.length) {
        chunks.push(text.slice(start, start + size));
        start += size - overlap;
    }
    return chunks;
}
