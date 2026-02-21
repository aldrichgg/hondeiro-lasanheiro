export interface UserProfile {
    uid: string;
    email: string;
    createdAt: any;
}

export interface Vehicle {
    id?: string;
    userId: string;
    model: string;
    year: number;
    engine: string;
    transmission: 'Manual' | 'Automatic';
    nickname: string;
    createdAt: any;
}

export interface Document {
    id: string;
    title: string;
    fileUrl: string;
    createdAt: any;
}

export interface DocumentChunk {
    id: string;
    documentId: string;
    content: string;
    embedding: number[];
    createdAt: any;
}

export interface ChatMessage {
    id?: string;
    userId: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt: any;
}
