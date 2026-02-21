import { useState, useEffect, useCallback } from 'react';
import { LibraryService } from '../services/LibraryService';
import type { Document } from '../types';
import {
    Search,
    Loader2,
    FileText,
    ArrowUpRight,
    Filter
} from 'lucide-react';
import { LIBRARY_CATEGORIES, type CategoryId } from '../constants/libraryCategories';

function formatDocDate(value: unknown): string {
    if (!value) return '—';
    if (typeof (value as { toDate?: () => Date }).toDate === 'function') {
        const date = (value as { toDate: () => Date }).toDate();
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    }
    if (value instanceof Date) {
        return value.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    }
    return String(value);
}

export const LibraryPage = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');

    const loadDocuments = useCallback(async () => {
        setLoading(true);
        try {
            const list = searchKeyword.trim()
                ? await LibraryService.searchDocuments(searchKeyword, selectedCategory)
                : await LibraryService.getDocuments(selectedCategory);
            setDocuments(list);
        } catch (err) {
            console.error(err);
            setDocuments([]);
        } finally {
            setLoading(false);
        }
    }, [searchKeyword, selectedCategory]);

    useEffect(() => {
        loadDocuments();
    }, [loadDocuments]);

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <header className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-white tracking-tight">Biblioteca Técnica</h1>
                        <p className="text-zinc-400 mt-2 text-lg">O conhecimento definitivo para o seu Honda Civic (92–00).</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-500 bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800 w-fit">
                        <FileText size={16} className="text-blue-400" />
                        <span>{documents.length} documentos encontrados</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Filters - Desktop */}
                <aside className="hidden lg:block space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                            <Filter size={14} />
                            Categorias
                        </h3>
                        <nav className="flex flex-col gap-1">
                            {LIBRARY_CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat.id
                                        ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                                        : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent"
                                        }`}
                                >
                                    <cat.icon size={18} />
                                    {cat.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>

                <div className="lg:col-span-3 space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Mobile Category Selector */}
                        <div className="lg:hidden overflow-x-auto pb-2 scrollbar-hide">
                            <div className="flex gap-2 whitespace-nowrap">
                                {LIBRARY_CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat.id
                                            ? "bg-blue-600 text-white shadow-lg"
                                            : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                                            }`}
                                    >
                                        <cat.icon size={16} />
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Search Input */}
                        <div className="relative flex-1">
                            <Search
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5"
                                aria-hidden
                            />
                            <input
                                type="search"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                placeholder="O que você está procurando hoje?"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-zinc-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all shadow-inner"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <div className="text-center space-y-4">
                                <Loader2 size={40} className="animate-spin text-blue-500 mx-auto" />
                                <p className="text-zinc-500 animate-pulse">Consultando acervo técnico...</p>
                            </div>
                        </div>
                    ) : documents.length === 0 ? (
                        <div className="glass border-2 border-dashed border-zinc-800 p-16 rounded-3xl text-center space-y-6">
                            <div className="h-20 w-20 bg-zinc-900/50 rounded-full flex items-center justify-center mx-auto border border-zinc-800">
                                <Search size={32} className="text-zinc-600" />
                            </div>
                            <div className="max-w-xs mx-auto">
                                <h3 className="text-xl font-bold text-white">Ops! Nada encontramos</h3>
                                <p className="text-zinc-500 mt-2">
                                    Não há documentos para essa busca ou categoria no momento. Tente expandir sua pesquisa.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {documents.map((doc) => {
                                const CategoryIcon = LIBRARY_CATEGORIES.find(c => c.id === doc.category)?.icon || FileText;
                                return (
                                    <article
                                        key={doc.id}
                                        className="group relative bg-zinc-900/40 border border-zinc-800/50 rounded-3xl overflow-hidden hover:bg-zinc-900/60 hover:border-zinc-700/50 transition-all duration-300 flex flex-col"
                                    >
                                        <div className="p-6 space-y-4 flex-1">
                                            <div className="flex items-center justify-between">
                                                <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                                                    {LIBRARY_CATEGORIES.find(c => c.id === doc.category)?.label || 'Outros'}
                                                </div>
                                                <time className="text-[11px] text-zinc-500 font-medium">
                                                    {formatDocDate(doc.createdAt)}
                                                </time>
                                            </div>

                                            <div className="space-y-2">
                                                <h3 className="text-xl font-bold text-zinc-100 group-hover:text-white transition-colors leading-tight">
                                                    {doc.title}
                                                </h3>
                                                <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed">
                                                    {doc.description || "Explore os detalhes técnicos e as especificações completas deste componente para garantir a melhor performance do seu Civic."}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="px-6 py-4 bg-zinc-900/50 border-t border-zinc-800/50 flex items-center justify-between group-hover:bg-zinc-800/50 transition-colors">
                                            <div className="flex items-center gap-2 text-zinc-500">
                                                <CategoryIcon size={14} />
                                                <span className="text-[11px] font-medium uppercase tracking-tight">Dados Técnicos</span>
                                            </div>
                                            {doc.fileUrl && (
                                                <a
                                                    href={doc.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                                                >
                                                    LER AGORA
                                                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                                </a>
                                            )}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
