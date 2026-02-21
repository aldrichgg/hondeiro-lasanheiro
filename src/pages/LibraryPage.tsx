import { useState, useEffect, useCallback } from 'react';
import { LibraryService } from '../services/LibraryService';
import type { Document } from '../types';
import { BookOpen, Search, Loader2, FileText, Calendar } from 'lucide-react';

function formatDocDate(value: unknown): string {
    if (!value) return '—';
    if (typeof (value as { toDate?: () => Date }).toDate === 'function') {
        return (value as { toDate: () => Date }).toDate().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    }
    if (value instanceof Date) {
        return value.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    }
    return String(value);
}

export const LibraryPage = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState('');

    const loadDocuments = useCallback(async () => {
        setLoading(true);
        try {
            const list = searchKeyword.trim()
                ? await LibraryService.searchDocuments(searchKeyword)
                : await LibraryService.getDocuments();
            setDocuments(list);
        } catch (err) {
            console.error(err);
            setDocuments([]);
        } finally {
            setLoading(false);
        }
    }, [searchKeyword]);

    useEffect(() => {
        loadDocuments();
    }, [loadDocuments]);

    return (
        <div className="space-y-8 max-w-5xl">
            <header>
                <h1 className="text-3xl font-bold text-white">Biblioteca Técnica</h1>
                <p className="text-zinc-400 mt-1">Manuais e documentos para Honda Civic 92–00.</p>
            </header>

            <div className="relative">
                <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5 pointer-events-none"
                    aria-hidden
                />
                <input
                    type="search"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Buscar por palavra-chave no título..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder:text-zinc-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all"
                    aria-label="Buscar documentos"
                />
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <Loader2 size={32} className="animate-spin text-blue-500" />
                </div>
            ) : documents.length === 0 ? (
                <div className="glass border-2 border-dashed border-zinc-800 p-12 rounded-3xl text-center space-y-4">
                    <BookOpen size={48} className="mx-auto text-zinc-600" />
                    <div>
                        <h3 className="text-lg font-semibold text-white">Nenhum documento encontrado</h3>
                        <p className="text-sm text-zinc-500 mt-1">
                            {searchKeyword.trim()
                                ? 'Tente outro termo de busca.'
                                : 'Ainda não há documentos na biblioteca.'}
                        </p>
                    </div>
                </div>
            ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {documents.map((doc) => (
                        <li key={doc.id}>
                            <article className="glass p-5 rounded-2xl border border-zinc-800/50 hover:border-zinc-700 transition-all h-full flex flex-col">
                                <div className="flex items-start gap-3">
                                    <div className="h-10 w-10 shrink-0 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400">
                                        <FileText size={20} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-semibold text-white truncate" title={doc.title}>
                                            {doc.title}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1.5 text-zinc-500 text-sm">
                                            <Calendar size={14} aria-hidden />
                                            <time dateTime={typeof doc.createdAt === 'object' && doc.createdAt && 'toDate' in doc.createdAt ? (doc.createdAt as { toDate: () => Date }).toDate().toISOString() : ''}>
                                                {formatDocDate(doc.createdAt)}
                                            </time>
                                        </div>
                                    </div>
                                </div>
                                {doc.fileUrl && (
                                    <a
                                        href={doc.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        Abrir documento
                                    </a>
                                )}
                            </article>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
