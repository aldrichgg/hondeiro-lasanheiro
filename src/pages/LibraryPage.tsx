import { useState, useEffect } from 'react';
import { LibraryService } from '../services/LibraryService';
import type { Document } from '../types';
import { BookOpen, Upload, FileText, CheckCircle2, Loader2, ArrowUpRight } from 'lucide-react';
import { cn } from '../lib/utils';

export const LibraryPage = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        loadDocs();
    }, []);

    const loadDocs = async () => {
        const data = await LibraryService.getDocuments();
        setDocuments(data);
    };

    const handleFileUpload = async (file: File) => {
        if (!file || file.type !== 'application/pdf') return;
        setUploading(true);
        try {
            await LibraryService.uploadPDF(file);
            // Wait a bit for the Cloud Function and Firestore update
            setTimeout(loadDocs, 3000);
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
        }
    };

    return (
        <div className="space-y-8 max-w-5xl">
            <header>
                <h1 className="text-3xl font-bold text-white">Biblioteca Técnica</h1>
                <p className="text-zinc-400 mt-1">Acervo de manuais e guias de serviço processados pela IA.</p>
            </header>

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
                        <input type="file" className="hidden" accept=".pdf" onChange={onFileChange} disabled={uploading} />

                        <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
                            {uploading ? (
                                <>
                                    <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold text-white">Enviando PDF...</p>
                                        <p className="text-xs text-zinc-500">Isso pode levar alguns segundos.</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="h-12 w-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                        <Upload size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold text-zinc-300">Upload de Manual</p>
                                        <p className="text-xs text-zinc-500">Arraste um PDF ou clique para selecionar</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </label>

                    <div className="glass p-5 rounded-2xl border-blue-500/10 bg-blue-500/[0.02] space-y-3">
                        <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                            <CheckCircle2 size={14} />
                            Dica de Expert
                        </h4>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                            PDFs com texto pesquisável (OCR) geram respostas muito mais precisas da nossa Inteligência Artificial.
                        </p>
                    </div>
                </div>

                {/* Document List */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2 px-2">
                        <BookOpen size={16} />
                        Documentos Recentes
                    </h3>

                    <div className="grid grid-cols-1 gap-3">
                        {documents.map(doc => (
                            <div key={doc.id} className="glass p-4 rounded-xl flex items-center gap-4 hover:border-zinc-700 transition-all group">
                                <div className="h-10 w-10 bg-zinc-900 rounded-lg flex items-center justify-center text-zinc-500 group-hover:text-blue-400 transition-colors">
                                    <FileText size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-white truncate">{doc.title}</h4>
                                    <p className="text-xs text-zinc-500">Processado em {new Date(doc.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                                </div>
                                <a
                                    href={doc.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 text-zinc-600 hover:text-white transition-colors"
                                >
                                    <ArrowUpRight size={18} />
                                </a>
                            </div>
                        ))}

                        {documents.length === 0 && (
                            <div className="glass border-dashed border-2 border-zinc-900 p-20 rounded-3xl text-center space-y-3 opacity-40">
                                <FileText size={40} className="mx-auto text-zinc-800" />
                                <p className="text-sm text-zinc-500">Nenhum documento na biblioteca.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
