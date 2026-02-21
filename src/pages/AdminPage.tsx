import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AdminService } from '../services/AdminService';
import { LibraryService } from '../services/LibraryService';
import { SellerService } from '../services/SellerService';
import type { Vehicle, Document, Seller } from '../types';
import {
    LayoutDashboard,
    Car,
    BookOpen,
    Store,
    Trash2,
    Plus,
    Loader2,
    ShieldCheck
} from 'lucide-react';
import { LIBRARY_CATEGORIES } from '../constants/libraryCategories';
import { SparklesCore } from '../components/ui/Sparkles';
import { Button } from '../components/ui/MovingBorder';
import { BentoGridItem } from '../components/ui/BentoGrid';
import { cn } from '../lib/utils';

type TabId = 'vehicles' | 'library' | 'sellers';

export const AdminPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabParam = searchParams.get('tab') as TabId;
    const [activeTab, setActiveTab] = useState<TabId>(tabParam || 'vehicles');
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingNew, setIsAddingNew] = useState(false);

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [sellers, setSellers] = useState<Seller[]>([]);

    const [pendingDocument, setPendingDocument] = useState<Partial<Document>>({
        title: '',
        category: 'mecanica',
        type: 'pdf',
        description: ''
    });

    const [pendingSeller, setPendingSeller] = useState<Partial<Seller>>({
        name: '',
        specialty: '',
        location: '',
        verified: true
    });

    useEffect(() => {
        if (tabParam && tabParam !== activeTab) {
            setActiveTab(tabParam);
            setIsAddingNew(false);
        }
    }, [tabParam, activeTab]);

    const handleTabChange = (tabId: TabId) => {
        setSearchParams({ tab: tabId });
        setActiveTab(tabId);
        setIsAddingNew(false);
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'vehicles') {
                const data = await AdminService.getAllVehicles();
                setVehicles(data);
            } else if (activeTab === 'library') {
                const data = await LibraryService.getDocuments();
                setDocuments(data);
            } else if (activeTab === 'sellers') {
                const data = await SellerService.getSellers();
                setSellers(data);
            }
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const handleAddDocument = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await AdminService.addDocument({
                title: pendingDocument.title!,
                category: pendingDocument.category!,
                type: (pendingDocument.type as any) || 'outro',
                fileUrl: '#',
                description: pendingDocument.description || ''
            });
            setIsAddingNew(false);
            setPendingDocument({ title: '', category: 'mecanica', type: 'pdf', description: '' });
            fetchData();
        } catch (error) {
            console.error('Add document error:', error);
            alert('Erro ao adicionar documento');
        }
    };

    const handleAddSeller = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await AdminService.addSeller({
                name: pendingSeller.name!,
                specialty: pendingSeller.specialty!,
                location: pendingSeller.location || 'A definir',
                rating: 5.0,
                contactUrl: '#',
                verified: pendingSeller.verified || false
            });
            setIsAddingNew(false);
            setPendingSeller({ name: '', specialty: '', location: '', verified: true });
            fetchData();
        } catch (error) {
            console.error('Add seller error:', error);
            alert('Erro ao adicionar vendedor');
        }
    };

    const handleDeleteVehicle = async (id: string) => {
        if (!window.confirm('Tem certeza que deseja remover este veículo?')) return;
        await AdminService.deleteVehicle(id);
        fetchData();
    };

    const handleDeleteDoc = async (id: string) => {
        if (!window.confirm('Tem certeza que deseja remover este post?')) return;
        await AdminService.deleteDocument(id);
        fetchData();
    };

    const handleDeleteSeller = async (id: string) => {
        if (!window.confirm('Tem certeza que deseja remover este vendedor?')) return;
        await AdminService.deleteSeller(id);
        fetchData();
    };

    const navTabs = [
        { id: 'vehicles', label: 'Veículos', icon: Car },
        { id: 'library', label: 'Biblioteca', icon: BookOpen },
        { id: 'sellers', label: 'Vendedores', icon: Store },
    ];

    return (
        <div className="relative min-h-screen w-full bg-zinc-950 p-4 md:p-8 overflow-hidden">
            <div className="w-full absolute inset-0 h-full pointer-events-none">
                <SparklesCore
                    id="tsparticlesadmin"
                    background="transparent"
                    minSize={0.4}
                    maxSize={1.0}
                    particleDensity={70}
                    className="w-full h-full"
                    particleColor="#FFFFFF"
                />
            </div>

            <div className="relative z-10 space-y-8 max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white flex items-center gap-4 tracking-tight">
                            <LayoutDashboard className="text-blue-500" size={36} />
                            Gerenciamento
                        </h1>
                        <p className="text-zinc-500 mt-2 font-medium">Controle total sobre os dados da plataforma CivicAI.</p>
                    </div>

                    <div className="flex gap-2 p-1.5 bg-zinc-900/50 border border-zinc-800 rounded-2xl backdrop-blur-md">
                        {navTabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id as TabId)}
                                className={cn(
                                    "flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all text-sm whitespace-nowrap",
                                    activeTab === tab.id
                                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20'
                                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                                )}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <BentoGridItem
                        title="Total Veículos"
                        description={`${vehicles.length} usuários cadastrados`}
                        header={<div className="h-full w-full bg-gradient-to-br from-blue-500/10 to-transparent flex items-center justify-center"><Car size={40} className="text-blue-500/50" /></div>}
                        className="bg-zinc-900/50"
                    />
                    <BentoGridItem
                        title="Posts Biblioteca"
                        description={`${documents.length} guias técnicos`}
                        header={<div className="h-full w-full bg-gradient-to-br from-emerald-500/10 to-transparent flex items-center justify-center"><BookOpen size={40} className="text-emerald-500/50" /></div>}
                        className="bg-zinc-900/50"
                    />
                    <BentoGridItem
                        title="Vendedores"
                        description={`${sellers.length} parceiros premium`}
                        header={<div className="h-full w-full bg-gradient-to-br from-orange-500/10 to-transparent flex items-center justify-center"><Store size={40} className="text-orange-500/50" /></div>}
                        className="bg-zinc-900/50"
                    />
                </div>

                <div className="min-h-[400px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <Loader2 className="animate-spin text-blue-500" size={48} />
                            <p className="text-zinc-500 font-medium animate-pulse">Carregando informações...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {activeTab === 'vehicles' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {vehicles.map(vehicle => (
                                            <div key={vehicle.id} className="bg-zinc-900/50 p-5 rounded-2xl border border-zinc-800 hover:border-blue-500/30 transition-all flex justify-between items-start group backdrop-blur-sm">
                                                <div>
                                                    <h3 className="font-bold text-white uppercase">{vehicle.nickname || vehicle.model}</h3>
                                                    <p className="text-zinc-400 text-sm">{vehicle.model} {vehicle.year}</p>
                                                    <div className="flex gap-2 mt-2">
                                                        <span className="px-2 py-0.5 bg-zinc-800/50 rounded text-[10px] text-zinc-500 border border-zinc-700 uppercase font-black">{vehicle.engine}</span>
                                                    </div>
                                                </div>
                                                <button onClick={() => handleDeleteVehicle(vehicle.id!)} className="p-2 text-zinc-500 hover:text-red-500 transition-colors bg-zinc-950/50 rounded-lg opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'library' && (
                                <div className="space-y-6">
                                    <div className="flex justify-end">
                                        <Button borderRadius="0.75rem" onClick={() => setIsAddingNew(true)} className="bg-emerald-600 text-white font-bold px-6 py-2">
                                            <div className="flex items-center gap-2"><Plus size={18} /> Novo Post</div>
                                        </Button>
                                    </div>

                                    {isAddingNew && (
                                        <div className="bg-zinc-900/80 p-8 rounded-3xl border border-emerald-500/20 backdrop-blur-xl animate-in slide-in-from-top duration-300">
                                            <form onSubmit={handleAddDocument} className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <input type="text" required value={pendingDocument.title} onChange={e => setPendingDocument({ ...pendingDocument, title: e.target.value })} className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none" placeholder="Título" />
                                                    <select value={pendingDocument.category} onChange={e => setPendingDocument({ ...pendingDocument, category: e.target.value })} className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none">
                                                        {LIBRARY_CATEGORIES.filter(c => c.id !== 'all').map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                                                    </select>
                                                    <textarea className="md:col-span-2 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none h-24" value={pendingDocument.description} onChange={e => setPendingDocument({ ...pendingDocument, description: e.target.value })} placeholder="Descrição" />
                                                </div>
                                                <div className="flex gap-4">
                                                    <button type="submit" className="flex-1 bg-emerald-600 py-3 rounded-xl font-bold">Publicar</button>
                                                    <button type="button" onClick={() => setIsAddingNew(false)} className="px-6 bg-zinc-800 py-3 rounded-xl font-bold">Cancelar</button>
                                                </div>
                                            </form>
                                        </div>
                                    )}

                                    <div className="grid gap-4">
                                        {documents.map(doc => (
                                            <div key={doc.id} className="bg-zinc-900/50 p-5 rounded-2xl border border-zinc-800 flex justify-between items-center group backdrop-blur-sm">
                                                <div className="flex items-center gap-4">
                                                    <BookOpen className="text-emerald-500" />
                                                    <div>
                                                        <h3 className="font-bold text-white">{doc.title}</h3>
                                                        <p className="text-zinc-500 text-xs uppercase">{doc.category}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleDeleteDoc(doc.id)} className="p-2 text-zinc-500 hover:text-red-500 bg-zinc-950/50 rounded-lg"><Trash2 size={16} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'sellers' && (
                                <div className="space-y-6">
                                    <div className="flex justify-end">
                                        <Button borderRadius="0.75rem" onClick={() => setIsAddingNew(true)} className="bg-blue-600 text-white font-bold px-6 py-2">
                                            <div className="flex items-center gap-2"><Plus size={18} /> Novo Vendedor</div>
                                        </Button>
                                    </div>

                                    {isAddingNew && (
                                        <div className="bg-zinc-900/80 p-8 rounded-3xl border border-blue-500/20 backdrop-blur-xl animate-in slide-in-from-top duration-300">
                                            <form onSubmit={handleAddSeller} className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <input type="text" required value={pendingSeller.name} onChange={e => setPendingSeller({ ...pendingSeller, name: e.target.value })} className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="Nome" />
                                                    <input type="text" required value={pendingSeller.specialty} onChange={e => setPendingSeller({ ...pendingSeller, specialty: e.target.value })} className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="Especialidade" />
                                                </div>
                                                <div className="flex gap-4">
                                                    <button type="submit" className="flex-1 bg-blue-600 py-3 rounded-xl font-bold">Salvar</button>
                                                    <button type="button" onClick={() => setIsAddingNew(false)} className="px-6 bg-zinc-800 py-3 rounded-xl font-bold">Cancelar</button>
                                                </div>
                                            </form>
                                        </div>
                                    )}

                                    <div className="grid gap-4">
                                        {sellers.map(seller => (
                                            <div key={seller.id} className="bg-zinc-900/50 p-5 rounded-2xl border border-zinc-800 flex justify-between items-center group backdrop-blur-sm">
                                                <div className="flex items-center gap-4">
                                                    <Store className="text-blue-500" />
                                                    <div>
                                                        <h3 className="font-bold text-white">{seller.name}</h3>
                                                        <p className="text-zinc-500 text-xs">{seller.specialty}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => handleDeleteSeller(seller.id)} className="p-2 text-zinc-500 hover:text-red-500 bg-zinc-950/50 rounded-lg"><Trash2 size={16} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <footer className="pt-12 border-t border-zinc-900">
                    <div className="bg-zinc-900/30 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-sm border border-zinc-800/50">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="text-blue-500" size={24} />
                            <p className="text-zinc-500 text-sm font-medium">Ações realizadas neste painel impactam o banco de dados em tempo real.</p>
                        </div>
                        <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">CivicAI Administrative Suite v1.2</p>
                    </div>
                </footer>
            </div>
        </div>
    );
};
