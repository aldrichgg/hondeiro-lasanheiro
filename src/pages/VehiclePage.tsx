import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/AuthContext';
import { VehicleService } from '../services/VehicleService';
import type { Vehicle } from '../types';
import { Car, Plus, Save, Trash2, Pencil, X, Loader2 } from 'lucide-react';
import { SparklesCore } from '../components/ui/Sparkles';
import { Button } from '../components/ui/MovingBorder';
import { BentoGridItem } from '../components/ui/BentoGrid';

const emptyForm: Omit<Vehicle, 'id' | 'userId' | 'createdAt'> = {
    model: 'Civic',
    year: new Date().getFullYear(),
    engine: 'D16Y8',
    transmission: 'Manual',
    nickname: 'Meu Civic',
};

function formatDate(value: unknown): string {
    if (!value) return '—';
    if (typeof (value as { toDate?: () => Date }).toDate === 'function') {
        return (value as { toDate: () => Date }).toDate().toLocaleDateString('pt-BR');
    }
    if (value instanceof Date) return value.toLocaleDateString('pt-BR');
    return String(value);
}

export const VehiclePage = () => {
    const { user } = useAuth();
    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Omit<Vehicle, 'id' | 'userId' | 'createdAt'>>(emptyForm);

    useEffect(() => {
        if (!user) return;
        const unsubscribe = VehicleService.subscribeToUserVehicle(user.uid, setVehicle);
        return unsubscribe;
    }, [user]);

    const openCreate = () => {
        setFormData(emptyForm);
        setEditingId(null);
        setIsFormOpen(true);
    };

    const openEdit = (v: Vehicle) => {
        setFormData({
            model: v.model,
            year: v.year,
            engine: v.engine,
            transmission: v.transmission,
            nickname: v.nickname,
        });
        setEditingId(v.id ?? null);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        try {
            if (editingId) {
                await VehicleService.updateVehicle(editingId, formData);
            } else {
                await VehicleService.createVehicle({ ...formData, userId: user.uid });
            }
            closeForm();
        } catch (err) {
            console.error(err);
            alert(err instanceof Error ? err.message : 'Erro ao salvar.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Excluir este veículo? Esta ação não pode ser desfeita.')) return;
        try {
            await VehicleService.deleteVehicle(id);
            closeForm();
        } catch (err) {
            console.error(err);
            alert('Erro ao excluir.');
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-zinc-950 p-4 md:p-8 overflow-hidden">
            <div className="w-full absolute inset-0 h-full pointer-events-none">
                <SparklesCore
                    id="tsparticlesvehicle"
                    background="transparent"
                    minSize={0.6}
                    maxSize={1.4}
                    particleDensity={30}
                    className="w-full h-full"
                    particleColor="#FFFFFF"
                />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto space-y-8">
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Meu Veículo</h1>
                        <p className="text-zinc-500 mt-1 font-medium">Perfil do seu Honda Civic para respostas personalizadas.</p>
                    </div>
                    {!isFormOpen && !vehicle && (
                        <Button
                            borderRadius="1rem"
                            onClick={openCreate}
                            className="bg-blue-600 text-white font-bold px-6 py-3"
                        >
                            <div className="flex items-center gap-2">
                                <Plus size={18} />
                                Cadastrar veículo
                            </div>
                        </Button>
                    )}
                </header>

                {isFormOpen && (
                    <div className="bg-zinc-900/40 border border-zinc-800 backdrop-blur-xl p-8 rounded-3xl space-y-6 shadow-2xl animate-in slide-in-from-top duration-300">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">
                                {editingId ? 'Editar veículo' : 'Novo veículo'}
                            </h2>
                            <button type="button" onClick={closeForm} className="p-2 text-zinc-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-500 uppercase tracking-widest px-1">Modelo</label>
                                    <input
                                        type="text"
                                        value={formData.model}
                                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none transition-all"
                                        placeholder="Ex: Civic Sedan"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-500 uppercase tracking-widest px-1">Ano</label>
                                    <input
                                        type="number"
                                        min={1992}
                                        max={2030}
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-500 uppercase tracking-widest px-1">Motor</label>
                                    <input
                                        type="text"
                                        value={formData.engine}
                                        onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none transition-all"
                                        placeholder="Ex: D16Y8, B16A2"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-500 uppercase tracking-widest px-1">Transmissão</label>
                                    <select
                                        value={formData.transmission}
                                        onChange={(e) =>
                                            setFormData({ ...formData, transmission: e.target.value as Vehicle['transmission'] })
                                        }
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none transition-all"
                                    >
                                        <option value="Manual">Manual</option>
                                        <option value="Automatic">Automático</option>
                                    </select>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-zinc-500 uppercase tracking-widest px-1">Apelido</label>
                                    <input
                                        type="text"
                                        value={formData.nickname}
                                        onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 outline-none transition-all"
                                        placeholder="Ex: Black Beauty"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <Button
                                    borderRadius="1rem"
                                    className="flex-1 bg-blue-600 text-white font-bold py-3"
                                    containerClassName="flex-1"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                        {loading ? 'Salvando...' : 'Salvar Veículo'}
                                    </div>
                                </Button>
                                <button type="button" onClick={closeForm} className="px-8 bg-zinc-800 text-zinc-300 rounded-2xl font-bold hover:bg-zinc-700 transition-colors">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {vehicle && !isFormOpen && (
                    <div className="space-y-6">
                        <div className="bg-zinc-900/40 border border-zinc-800 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex items-center gap-6">
                                <div className="h-16 w-16 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10">
                                    <Car size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white">{vehicle.nickname}</h3>
                                    <p className="text-zinc-500 font-medium">Modelo {vehicle.year} · {vehicle.model}</p>
                                </div>
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                                <button onClick={() => openEdit(vehicle)} className="flex-1 md:flex-none p-3 bg-zinc-800 text-zinc-300 rounded-xl hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2 font-bold border border-zinc-700/50"><Pencil size={18} /> Editar</button>
                                <button onClick={() => vehicle.id && handleDelete(vehicle.id)} className="flex-1 md:flex-none p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 font-bold border border-red-500/20"><Trash2 size={18} /> Excluir</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <BentoGridItem
                                title="Motorização"
                                description={vehicle.engine}
                                className="bg-zinc-900/50 min-h-0 py-4"
                                header={<div className="h-8 mb-2 flex items-center text-xs font-black uppercase tracking-widest text-zinc-600">Spec Técnica</div>}
                            />
                            <BentoGridItem
                                title="Câmbio"
                                description={vehicle.transmission}
                                className="bg-zinc-900/50 min-h-0 py-4"
                                header={<div className="h-8 mb-2 flex items-center text-xs font-black uppercase tracking-widest text-zinc-600">Configuração</div>}
                            />
                            <BentoGridItem
                                title="Versão"
                                description={vehicle.model}
                                className="bg-zinc-900/50 min-h-0 py-4"
                                header={<div className="h-8 mb-2 flex items-center text-xs font-black uppercase tracking-widest text-zinc-600">Catálogo</div>}
                            />
                            <BentoGridItem
                                title="Data Cadastro"
                                description={formatDate(vehicle.createdAt)}
                                className="bg-zinc-900/50 min-h-0 py-4"
                                header={<div className="h-8 mb-2 flex items-center text-xs font-black uppercase tracking-widest text-zinc-600">Registro</div>}
                            />
                        </div>
                    </div>
                )}

                {!vehicle && !isFormOpen && (
                    <div className="bg-zinc-900/30 border-2 border-dashed border-zinc-800 p-16 rounded-[2.5rem] text-center space-y-6">
                        <div className="h-20 w-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto border border-zinc-800 text-zinc-700">
                            <Car size={40} />
                        </div>
                        <div className="max-w-xs mx-auto">
                            <h3 className="text-xl font-bold text-white">Nenhum veículo ativo</h3>
                            <p className="text-zinc-500 mt-2 font-medium">Cadastre seu Honda para desbloquear diagnósticos e guias personalizados.</p>
                        </div>
                        <Button borderRadius="1rem" onClick={openCreate} className="bg-blue-600 text-white font-bold px-8 py-3 mx-auto">
                            Começar Perfil
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
