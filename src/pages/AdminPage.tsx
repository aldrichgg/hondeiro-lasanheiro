import { useState, useEffect } from 'react';
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
    Edit,
    Loader2,
    CheckCircle2,
    ShieldCheck
} from 'lucide-react';

type TabId = 'vehicles' | 'library' | 'sellers';

export const AdminPage = () => {
    const [activeTab, setActiveTab] = useState<TabId>('vehicles');
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    // Data states
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [sellers, setSellers] = useState<Seller[]>([]);

    // Form states
    const [newDoc, setNewDoc] = useState<Partial<Document>>({
        title: '',
        category: 'MECANICA',
        type: 'pdf',
        description: ''
    });
    const [newSeller, setNewSeller] = useState<Partial<Seller>>({
        name: '',
        specialty: '',
        location: '',
        verified: true
    });

    const loadData = async () => {
        setLoading(true);
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
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const handleAddDocument = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await AdminService.addDocument({
                title: newDoc.title!,
                category: newDoc.category!,
                type: newDoc.type as any || 'outro',
                fileUrl: '#',
                description: newDoc.description || ''
            });
            setIsAdding(false);
            setNewDoc({ title: '', category: 'MECANICA', type: 'pdf', description: '' });
            loadData();
        } catch (err) {
            alert('Erro ao adicionar documento');
        }
    };

    const handleAddSeller = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await AdminService.addSeller({
                name: newSeller.name!,
                specialty: newSeller.specialty!,
                location: newSeller.location || 'A definir',
                rating: 5.0,
                contactUrl: '#',
                verified: newSeller.verified || false
            });
            setIsAdding(false);
            setNewSeller({ name: '', specialty: '', location: '', verified: true });
            loadData();
        } catch (err) {
            alert('Erro ao adicionar vendedor');
        }
    };

    const handleDeleteVehicle = async (id: string) => {
        if (!confirm('Tem certeza que deseja remover este veículo?')) return;
        await AdminService.deleteVehicle(id);
        loadData();
    };

    const handleDeleteDoc = async (id: string) => {
        if (!confirm('Tem certeza que deseja remover este post?')) return;
        await AdminService.deleteDocument(id);
        loadData();
    };

    const handleDeleteSeller = async (id: string) => {
        if (!confirm('Tem certeza que deseja remover este vendedor?')) return;
        await AdminService.deleteSeller(id);
        loadData();
    };

    const tabs = [
        { id: 'vehicles', label: 'Veículos', icon: Car },
        { id: 'library', label: 'Biblioteca', icon: BookOpen },
        { id: 'sellers', label: 'Vendedores', icon: Store },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white flex items-center gap-4 tracking-tight">
                        <LayoutDashboard className="text-blue-500" size={36} />
                        Gerenciamento
                    </h1>
                    <p className="text-zinc-500 mt-2 font-medium">Controle total sobre os dados da plataforma CivicAI.</p>
                </div>

                <div className="flex gap-2 p-1.5 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id as TabId);
                                setIsAdding(false);
                            }}
                            className={`
                                flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all text-sm
                                ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20'
                                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}
                            `}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            {/* Content Area */}
            <div className="min-h-[600px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <Loader2 className="animate-spin text-blue-500" size={48} />
                        <p className="text-zinc-500 font-medium animate-pulse">Carregando informações...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="glass p-6 rounded-3xl border border-zinc-800/50 flex flex-col justify-between h-32 relative overflow-hidden group">
                                <Car className="absolute -right-4 -bottom-4 text-white/5 group-hover:text-blue-500/10 transition-all duration-700" size={120} />
                                <span className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Total Veículos</span>
                                <span className="text-4xl font-black text-white">{vehicles.length}</span>
                            </div>
                            <div className="glass p-6 rounded-3xl border border-zinc-800/50 flex flex-col justify-between h-32 relative overflow-hidden group">
                                <BookOpen className="absolute -right-4 -bottom-4 text-white/5 group-hover:text-blue-500/10 transition-all duration-700" size={120} />
                                <span className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Posts Biblioteca</span>
                                <span className="text-4xl font-black text-white">{documents.length}</span>
                            </div>
                            <div className="glass p-6 rounded-3xl border border-zinc-800/50 flex flex-col justify-between h-32 relative overflow-hidden group">
                                <Store className="absolute -right-4 -bottom-4 text-white/5 group-hover:text-blue-500/10 transition-all duration-700" size={120} />
                                <span className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Vendedores</span>
                                <span className="text-4xl font-black text-white">{sellers.length}</span>
                            </div>
                        </div>

                        {activeTab === 'vehicles' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Car className="text-blue-500" size={20} />
                                        Veículos Cadastrados
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {vehicles.map(vehicle => (
                                        <div key={vehicle.id} className="bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/50 hover:border-zinc-700/50 hover:bg-zinc-900/60 transition-all flex justify-between items-start group shadow-sm">
                                            <div className="space-y-1">
                                                <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{vehicle.nickname || vehicle.model}</h3>
                                                <p className="text-zinc-400 text-sm font-medium">{vehicle.model} {vehicle.year}</p>
                                                <div className="flex gap-2 mt-2">
                                                    <span className="px-2 py-0.5 bg-zinc-800 rounded text-[10px] text-zinc-400 font-bold border border-zinc-700/50 uppercase">{vehicle.engine}</span>
                                                    <span className="px-2 py-0.5 bg-zinc-800 rounded text-[10px] text-zinc-400 font-bold border border-zinc-700/50 uppercase">{vehicle.transmission}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteVehicle(vehicle.id!)}
                                                className="p-2.5 text-zinc-500 hover:text-red-500 transition-all bg-zinc-950/50 rounded-xl border border-zinc-800 opacity-0 group-hover:opacity-100"
                                                title="Remover veículo"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    {vehicles.length === 0 && (
                                        <div className="col-span-full py-20 text-center glass rounded-3xl border border-zinc-800/50">
                                            <p className="text-zinc-600 font-medium">Nenhum veículo encontrado no sistema.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'library' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        <BookOpen className="text-emerald-500" size={20} />
                                        Gestão de Biblioteca
                                    </h2>
                                    {!isAdding && (
                                        <button
                                            onClick={() => setIsAdding(true)}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all text-sm shadow-lg shadow-emerald-900/20"
                                        >
                                            <Plus size={18} /> Novo Post Técnico
                                        </button>
                                    )}
                                </div>

                                {isAdding && (
                                    <form onSubmit={handleAddDocument} className="glass p-8 rounded-3xl border-2 border-emerald-500/20 space-y-6 animate-in slide-in-from-top duration-300">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-lg font-bold text-white">Criar Nova Postagem</h3>
                                            <button type="button" onClick={() => setIsAdding(false)} className="text-zinc-500 hover:text-white transition-colors">Fechar</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Título</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={newDoc.title}
                                                    onChange={e => setNewDoc({ ...newDoc, title: e.target.value })}
                                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                                    placeholder="Ex: Torque de Cabeçote D16"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Categoria</label>
                                                <select
                                                    value={newDoc.category}
                                                    onChange={e => setNewDoc({ ...newDoc, category: e.target.value })}
                                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                                >
                                                    <option value="MECANICA">Mecânica</option>
                                                    <option value="SUSPENSAO">Suspensão</option>
                                                    <option value="ELETRICA">Elétrica</option>
                                                    <option value="PERFORMANCE">Performance</option>
                                                </select>
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Descrição</label>
                                                <textarea
                                                    value={newDoc.description}
                                                    onChange={e => setNewDoc({ ...newDoc, description: e.target.value })}
                                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none h-24"
                                                    placeholder="Resumo do conteúdo técnico..."
                                                />
                                            </div>
                                        </div>
                                        <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-500 shadow-xl shadow-emerald-900/30 transition-all flex items-center justify-center gap-2">
                                            Publicar na Biblioteca <CheckCircle2 size={18} />
                                        </button>
                                    </form>
                                )}

                                <div className="grid gap-4">
                                    {documents.map(doc => (
                                        <div key={doc.id} className="bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/50 hover:border-zinc-700/50 transition-all flex justify-between items-center group">
                                            <div className="flex items-center gap-5">
                                                <div className="h-12 w-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-all">
                                                    <BookOpen size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors">{doc.title}</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold">{doc.category}</span>
                                                        <span className="text-[10px] text-zinc-600 font-bold">•</span>
                                                        <span className="text-[10px] text-zinc-600 font-bold uppercase">{doc.type}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="p-2.5 text-zinc-500 hover:text-white transition-all bg-zinc-950/50 rounded-xl border border-zinc-800">
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteDoc(doc.id)}
                                                    className="p-2.5 text-zinc-500 hover:text-red-500 transition-all bg-zinc-950/50 rounded-xl border border-zinc-800"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {documents.length === 0 && <p className="text-zinc-600 text-center py-20 glass rounded-3xl border border-zinc-800/50">Nenhum post técnico cadastrado.</p>}
                                </div>
                            </div>
                        )}

                        {activeTab === 'sellers' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Store className="text-blue-400" size={20} />
                                        Marketplace de Parceiros
                                    </h2>
                                    {!isAdding && (
                                        <button
                                            onClick={() => setIsAdding(true)}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-all text-sm shadow-lg shadow-blue-900/20"
                                        >
                                            <Plus size={18} /> Novo Vendedor
                                        </button>
                                    )}
                                </div>

                                {isAdding && (
                                    <form onSubmit={handleAddSeller} className="glass p-8 rounded-3xl border-2 border-blue-500/20 space-y-6 animate-in slide-in-from-top duration-300">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-lg font-bold text-white">Adicionar Novo Parceiro</h3>
                                            <button type="button" onClick={() => setIsAdding(false)} className="text-zinc-500 hover:text-white transition-colors">Fechar</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Nome da Empresa/Pessoa</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={newSeller.name}
                                                    onChange={e => setNewSeller({ ...newSeller, name: e.target.value })}
                                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                                    placeholder="Ex: Jhow Autopeças"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Especialidade</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={newSeller.specialty}
                                                    onChange={e => setNewSeller({ ...newSeller, specialty: e.target.value })}
                                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                                    placeholder="Ex: Peças Originais Honda"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Localização</label>
                                                <input
                                                    type="text"
                                                    value={newSeller.location}
                                                    onChange={e => setNewSeller({ ...newSeller, location: e.target.value })}
                                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                                    placeholder="Ex: São Paulo, SP"
                                                />
                                            </div>
                                            <div className="space-y-2 flex flex-col justify-center gap-2">
                                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Selo de Verificado</label>
                                                <label className="flex items-center gap-3 cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        checked={newSeller.verified}
                                                        onChange={e => setNewSeller({ ...newSeller, verified: e.target.checked })}
                                                        className="h-5 w-5 rounded-lg accent-blue-600 bg-zinc-900 border-zinc-800"
                                                    />
                                                    <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">Vendedor de confiança verificado</span>
                                                </label>
                                            </div>
                                        </div>
                                        <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 shadow-xl shadow-blue-900/30 transition-all flex items-center justify-center gap-2">
                                            Adicionar ao Marketplace <CheckCircle2 size={18} />
                                        </button>
                                    </form>
                                )}

                                <div className="grid gap-4">
                                    {sellers.map(seller => (
                                        <div key={seller.id} className="bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/50 hover:border-zinc-700/50 transition-all flex justify-between items-center group">
                                            <div className="flex items-center gap-5">
                                                <div className="h-12 w-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500 group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-all">
                                                    <Store size={24} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">{seller.name}</h3>
                                                        {seller.verified && <CheckCircle2 size={14} className="text-blue-500 shadow-blue-500/20" />}
                                                    </div>
                                                    <p className="text-zinc-500 text-xs font-medium">{seller.specialty} • {seller.location}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="p-2.5 text-zinc-500 hover:text-white transition-all bg-zinc-950/50 rounded-xl border border-zinc-800">
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteSeller(seller.id)}
                                                    className="p-2.5 text-zinc-500 hover:text-red-500 transition-all bg-zinc-950/50 rounded-xl border border-zinc-800"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {sellers.length === 0 && <p className="text-zinc-600 text-center py-20 glass rounded-3xl border border-zinc-800/50">Nenhum vendedor parceiro cadastrado.</p>}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <footer className="pt-12 border-t border-zinc-900">
                <div className="glass p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="text-blue-500" size={24} />
                        <p className="text-zinc-500 text-sm font-medium">
                            Ações realizadas neste painel impactam o banco de dados em tempo real. Pense duas vezes antes de excluir.
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">CivicAI Administrative Suite v1.1</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};
