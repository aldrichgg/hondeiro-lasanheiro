import { useState, useEffect } from 'react';
import { LibraryService } from '../services/LibraryService';
import type { Document } from '../types';
import { BookOpen, Upload, FileText, CheckCircle2, Loader2, ArrowUpRight, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

export const LibraryPage = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'pdf' | 'imagem' | 'audio' | 'video'>('all');

    useEffect(() => {
        loadDocs();
    }, []);

    const loadDocs = async () => {
        try {
            setError(null);
            const data = await LibraryService.getDocuments();
            setDocuments(data);
        } catch (err: any) {
            setError('Não foi possível carregar os documentos. Verifique as permissões.');
            console.error(err);
        }
    };

    const handleFileUpload = async (file: File) => {
        if (!file) return;
        setUploading(true);
        setError(null);
        try {
            await LibraryService.uploadFile(file);
            // Wait for Cloud Function processing
            setTimeout(loadDocs, 6000);
        } catch (error) {
            console.error(error);
            setError('Falha no upload do arquivo.');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string, fileUrl: string) => {
        if (!window.confirm('Tem certeza que deseja excluir este arquivo?')) return;

        try {
            await LibraryService.deleteFile(id, fileUrl);
            setDocuments(prev => prev.filter(d => d.id !== id));
        } catch (err) {
            console.error(err);
            setError('Erro ao excluir o arquivo.');
        }
    };

    const filteredDocuments = documents.filter(doc => filter === 'all' || doc.type === filter);

    const getIcon = (type: string) => {
        switch (type) {
            case 'imagem': return <Upload size={20} className="text-purple-400" />;
            case 'video': return <Upload size={20} className="text-red-400" />;
            case 'audio': return <Upload size={20} className="text-green-400" />;
            default: return <FileText size={20} className="text-blue-400" />;
        }
    };

    return (
        <div className="space-y-8 max-w-5xl">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Biblioteca Técnica</h1>
                    <p className="text-zinc-400 mt-1">Gerencie manuais, fotos e vídeos de serviço.</p>
                </div>
                <button
                    onClick={loadDocs}
                    className="p-2 text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-sm bg-zinc-900/50 rounded-lg border border-zinc-800"
                >
                    <Loader2 className={cn("h-4 w-4", { "animate-spin": uploading })} />
                    Atualizar
                </button>
            </header>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upload Area */}
                <div className="lg:col-span-1 space-y-4">
                    <label className={cn(
                        "group relative flex flex-col items-center justify-center h-64 w-full border-2 border-dashed rounded-3xl transition-all cursor-pointer overflow-hidden",
                        {
                            "border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-blue-500/50": !dragActive,
                            "border-blue-500 bg-blue-500/5": dragActive
                        }
                    )}
                        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                        onDragLeave={() => setDragActive(false)}
                        onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files[0]) handleFileUpload(e.dataTransfer.files[0]); }}
                    >
                        <input
                            type="file"
                            className="hidden"
                            accept=".pdf,image/*,video/*,audio/*"
                            onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                            disabled={uploading}
                        />

                        <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
                            {uploading ? (
                                <>
                                    <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold text-white">Enviando Arquivo...</p>
                                        <p className="text-xs text-zinc-500">Categorizando mídia...</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="h-12 w-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                        <Upload size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold text-zinc-300">Upload de Arquivo</p>
                                        <p className="text-xs text-zinc-500">PDF, Imagens, Vídeos ou Áudios</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </label>

                    <div className="glass p-5 rounded-2xl border-blue-500/10 bg-blue-500/[0.02] space-y-3">
                        <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                            <CheckCircle2 size={14} />
                            Dica de IA
                        </h4>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                            Documentos PDF são processados para alimentar a inteligência do Chat Técnico.
                        </p>
                    </div>
                </div>

                {/* Document List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex flex-wrap gap-2 p-1 bg-zinc-900/50 rounded-xl border border-zinc-800 w-fit">
                        {[
                            { id: 'all', label: 'Todos' },
                            { id: 'pdf', label: 'PDFs' },
                            { id: 'imagem', label: 'Fotos' },
                            { id: 'video', label: 'Vídeos' },
                            { id: 'audio', label: 'Áudios' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setFilter(tab.id as any)}
                                className={cn(
                                    "px-4 py-1.5 rounded-lg text-xs font-medium transition-all outline-none",
                                    filter === tab.id
                                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                                        : "text-zinc-500 hover:text-zinc-300"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {filteredDocuments.map(doc => (
                            <div key={doc.id} className="glass p-4 rounded-xl flex items-center gap-4 hover:border-zinc-700 transition-all group">
                                <div className="h-10 w-10 bg-zinc-900 rounded-lg flex items-center justify-center transition-colors">
                                    {getIcon(doc.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-white truncate">{doc.title}</h4>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">
                                        {doc.type} • {doc.createdAt ? new Date(doc.createdAt?.seconds * 1000).toLocaleDateString() : 'pendente'}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <a
                                        href={doc.fileUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-2 text-zinc-600 hover:text-blue-400 transition-colors bg-zinc-900/50 rounded-lg hover:bg-blue-500/10"
                                        title="Abrir arquivo"
                                    >
                                        <ArrowUpRight size={18} />
                                    </a>
                                    <button
                                        onClick={() => handleDelete(doc.id, doc.fileUrl)}
                                        className="p-2 text-zinc-600 hover:text-red-400 transition-colors bg-zinc-900/50 rounded-lg hover:bg-red-500/10"
                                        title="Excluir"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {filteredDocuments.length === 0 && (
                            <div className="glass border-dashed border-2 border-zinc-900 p-20 rounded-3xl text-center space-y-3 opacity-40">
                                <BookOpen size={40} className="mx-auto text-zinc-800" />
                                <p className="text-sm text-zinc-500">Nenhum arquivo encontrado nesta categoria.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
