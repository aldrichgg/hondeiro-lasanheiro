import { useState, useEffect } from 'react';
import { SellerService } from '../services/SellerService';
import type { Seller } from '../types';
import {
    Store,
    Search,
    Loader2,
    MapPin,
    Star,
    ExternalLink,
    CheckCircle2,
    ShieldCheck
} from 'lucide-react';

export const SellersPage = () => {
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadSellers = async () => {
            try {
                const data = await SellerService.getSellers();
                if (data.length > 0) {
                    setSellers(data);
                } else {
                    // Fallback para demonstração se não houver dados no Firestore
                    setSellers([
                        {
                            id: '1',
                            name: 'Honda Parts BR',
                            specialty: 'Peças Genuínas Honda',
                            location: 'São Paulo, SP',
                            rating: 4.9,
                            contactUrl: 'https://wa.me/5511999999999',
                            verified: true,
                            createdAt: new Date()
                        },
                        {
                            id: '2',
                            name: 'Civic Performance Shop',
                            specialty: 'Turbos e Importados',
                            location: 'Curitiba, PR',
                            rating: 4.8,
                            contactUrl: 'https://wa.me/5511988888888',
                            verified: true,
                            createdAt: new Date()
                        },
                        {
                            id: '3',
                            name: 'Jhow Autoparts',
                            specialty: 'Suspensão e Freios',
                            location: 'São José dos Campos, SP',
                            rating: 5.0,
                            contactUrl: 'https://wa.me/5512997776655',
                            verified: true,
                            createdAt: new Date()
                        }
                    ]);
                }
            } catch (error) {
                console.error('Error loading sellers:', error);
            } finally {
                setLoading(false);
            }
        };
        loadSellers();
    }, []);

    const filteredSellers = sellers.filter(seller =>
        seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 max-w-6xl mx-auto p-4 md:p-0">
            <header className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                                Parceiros CivicAI
                            </span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-white tracking-tight">Vendedores Autorizados</h1>
                        <p className="text-zinc-400 mt-2 text-lg">
                            Compre com segurança através dos nossos parceiros verificados pela comunidade.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-500 bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800 w-fit">
                        <ShieldCheck size={16} className="text-emerald-400" />
                        <span>100% Verificados</span>
                    </div>
                </div>
            </header>

            <div className="relative max-w-2xl">
                <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5 pointer-events-none"
                    aria-hidden
                />
                <input
                    type="search"
                    placeholder="Buscar vendedor ou especialidade (ex: Peças, Turbos...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-zinc-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all shadow-inner"
                />
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <div className="text-center space-y-4">
                        <Loader2 size={40} className="animate-spin text-blue-500 mx-auto" />
                        <p className="text-zinc-500 animate-pulse">Consultando lista de confiança...</p>
                    </div>
                </div>
            ) : filteredSellers.length === 0 ? (
                <div className="glass border-2 border-dashed border-zinc-800 p-16 rounded-3xl text-center space-y-6">
                    <div className="h-20 w-20 bg-zinc-900/50 rounded-full flex items-center justify-center mx-auto border border-zinc-800 text-zinc-600">
                        <Store size={32} />
                    </div>
                    <div className="max-w-xs mx-auto">
                        <h3 className="text-xl font-bold text-white">Nenhum vendedor encontrado</h3>
                        <p className="text-zinc-500 mt-2">
                            Tente buscar por um termo diferente ou limpe sua pesquisa.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSellers.map((seller) => (
                        <article
                            key={seller.id}
                            className="group relative bg-zinc-900/40 border border-zinc-800/50 rounded-3xl overflow-hidden hover:bg-zinc-900/60 hover:border-zinc-700/50 transition-all duration-300 flex flex-col h-full"
                        >
                            <div className="p-6 space-y-4 flex-1">
                                <div className="flex justify-between items-start">
                                    <div className="h-16 w-16 bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-600 group-hover:scale-105 transition-transform overflow-hidden border border-zinc-700/30">
                                        {seller.logoUrl ? (
                                            <img src={seller.logoUrl} alt={seller.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <Store size={32} />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 bg-zinc-950/50 px-2 py-1 rounded-lg border border-zinc-800">
                                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                        <span className="text-xs font-bold text-zinc-300">{seller.rating.toFixed(1)}</span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                            {seller.name}
                                        </h3>
                                        {seller.verified && (
                                            <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                                        )}
                                    </div>
                                    <p className="text-sm font-medium text-blue-400/80">
                                        {seller.specialty}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-zinc-500">
                                    <MapPin size={14} />
                                    <span>{seller.location}</span>
                                </div>
                            </div>

                            <div className="p-4 bg-zinc-900/50 border-t border-zinc-800/50 flex gap-3">
                                <a
                                    href={seller.contactUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-all"
                                >
                                    Ver Catálogo
                                </a>
                                <a
                                    href={seller.contactUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all"
                                    title="Contactar"
                                >
                                    <ExternalLink size={18} />
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};
