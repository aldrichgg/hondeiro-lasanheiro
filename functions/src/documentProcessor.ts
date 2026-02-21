import { onObjectFinalized } from 'firebase-functions/v2/storage';
import * as admin from 'firebase-admin';
import pdf from 'pdf-parse';
import { embeddingService } from './embeddingService';

// Helper for lazy database access
function getDb() {
    return admin.firestore();
}

export const processDocument = onObjectFinalized(async (event) => {
    const object = event.data;
    const filePath = object.name;

    if (!filePath) return;

    const db = getDb();
    const fileName = filePath.split('/').pop() || 'unnamed';

    // Determine type based on folder
    let type: 'pdf' | 'imagem' | 'audio' | 'video' | 'outro' = 'outro';
    if (filePath.startsWith('pdf/')) type = 'pdf';
    else if (filePath.startsWith('imagens/')) type = 'imagem';
    else if (filePath.startsWith('audios/')) type = 'audio';
    else if (filePath.startsWith('videos/')) type = 'video';
    else if (filePath.startsWith('documents/')) type = 'pdf'; // Legacy support

    // 1. Create document record with type
    const docData: any = {
        title: fileName,
        fileUrl: `https://storage.googleapis.com/${object.bucket}/${filePath}`,
        type: type,
        contentType: object.contentType,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('documents').add(docData);

    // 2. Only process PDF for AI/Embeddings
    if (type === 'pdf' || (type === 'outro' && filePath.endsWith('.pdf'))) {
        try {
            const bucket = admin.storage().bucket(object.bucket);
            const file = bucket.file(filePath);
            const [buffer] = await file.download();

            // Extract text
            const data = await pdf(buffer);
            const text = data.text;

            // Split into chunks
            const chunks = chunkText(text, 1000, 200);

            // Generate embeddings and save chunks
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
            console.log(`PDF ${filePath} processed for AI. ${chunks.length} chunks created.`);
        } catch (error) {
            console.error(`Error processing PDF ${filePath} for AI:`, error);
        }
    } else {
        console.log(`File ${filePath} recorded as type: ${type}. No AI processing needed.`);
    }
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
