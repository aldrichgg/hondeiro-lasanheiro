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
    type: 'pdf' | 'imagem' | 'audio' | 'video' | 'outro';
    createdAt: any;
}

export interface DocumentChunk {
    id: string;
    documentId: string;
    content: string;
    embedding: number[];
    createdAt: any;
}

export interface ChatSession {
    id: string;
    userId: string;
    title: string;
    createdAt: any;
    lastMessageAt: any;
}

export interface ChatMessage {
    id?: string;
    userId: string;
    sessionId: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt: any;
}
