import { useState, useEffect } from 'react';
import { SellerService } from '../services/SellerService';
import type { Seller } from '../types';
import {
    Store,
    Search,
    Loader2,
    CheckCircle2,
    ShieldCheck
} from 'lucide-react';
import { SparklesCore } from '../components/ui/Sparkles';
import { HoverEffect } from '../components/ui/HoverEffect';

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
                    // Fallback para demonstração
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

    const hoverItems = filteredSellers.map(seller => ({
        title: seller.name,
        description: `${seller.specialty} • ${seller.location}`,
        link: seller.contactUrl,
    }));

    return (
        <div className="relative min-h-screen w-full bg-zinc-950 p-4 md:p-8 overflow-hidden">
            <div className="w-full absolute inset-0 h-full pointer-events-none">
                <SparklesCore
                    id="tsparticlessellers"
                    background="transparent"
                    minSize={0.6}
                    maxSize={1.4}
                    particleDensity={40}
                    className="w-full h-full"
                    particleColor="#3b82f6"
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-8">
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
                        <div className="flex items-center gap-2 text-sm text-zinc-500 bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800 w-fit backdrop-blur-md">
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
                        placeholder="Buscar vendedor ou especialidade..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-zinc-500 focus:border-blue-500/50 outline-none transition-all"
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
                    <div className="bg-zinc-900/40 border border-zinc-800 p-16 rounded-3xl text-center space-y-6">
                        <div className="h-20 w-20 bg-zinc-900/50 rounded-full flex items-center justify-center mx-auto border border-zinc-800 text-zinc-600">
                            <Store size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white">Nenhum vendedor encontrado</h3>
                    </div>
                ) : (
                    <HoverEffect items={hoverItems} />
                )}
            </div>
        </div>
    );
};
