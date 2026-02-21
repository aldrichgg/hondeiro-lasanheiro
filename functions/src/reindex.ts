import * as admin from 'firebase-admin';
import { embeddingService } from './embeddingService';

export const reindexKnowledgeBase = async () => {
    const db = admin.firestore();
    const chunksSnapshot = await db.collection('document_chunks').get();

    console.log(`Starting re-indexing of ${chunksSnapshot.size} chunks...`);

    let successCount = 0;
    let errorCount = 0;

    // Process in batches to avoid timeouts and memory issues
    const chunks = chunksSnapshot.docs;

    for (const chunkDoc of chunks) {
        try {
            const data = chunkDoc.data();
            const newEmbedding = await embeddingService.generateEmbedding(data.content);

            await chunkDoc.ref.update({
                embedding: newEmbedding,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                provider: 'google-gemini-3'
            });

            successCount++;
            if (successCount % 10 === 0) console.log(`Processed ${successCount}/${chunks.length} chunks...`);
        } catch (error) {
            console.error(`Error re-indexing chunk ${chunkDoc.id}:`, error);
            errorCount++;
        }
    }

    return {
        total: chunksSnapshot.size,
        success: successCount,
        errors: errorCount
    };
};
