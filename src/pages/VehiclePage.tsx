import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/AuthContext';
import { VehicleService } from '../services/VehicleService';
import type { Vehicle } from '../types';
import { Car, Plus, Save, Trash2, Pencil, X, Loader2 } from 'lucide-react';

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
        <div className="space-y-6 md:space-y-8 max-w-4xl">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">Meu Veículo</h1>
                    <p className="text-zinc-400 mt-1 text-sm md:text-base">Perfil do seu Honda Civic para respostas personalizadas.</p>
                </div>
                {!isFormOpen && !vehicle && (
                    <button
                        onClick={openCreate}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all w-full sm:w-auto text-sm"
                    >
                        <Plus size={18} />
                        Cadastrar veículo
                    </button>
                )}
            </header>

            {isFormOpen && (
                <form
                    onSubmit={handleSubmit}
                    className="glass p-8 rounded-3xl space-y-6 border border-zinc-800/50"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white">
                            {editingId ? 'Editar veículo' : 'Novo veículo'}
                        </h2>
                        <button type="button" onClick={closeForm} className="p-2 text-zinc-500 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Modelo</label>
                            <input
                                type="text"
                                value={formData.model}
                                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:border-blue-500/50 outline-none"
                                placeholder="Ex: Civic Sedan"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Ano</label>
                            <input
                                type="number"
                                min={1992}
                                max={2000}
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:border-blue-500/50 outline-none"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Motor</label>
                            <input
                                type="text"
                                value={formData.engine}
                                onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:border-blue-500/50 outline-none"
                                placeholder="Ex: D16Y8, B16A2"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Transmissão</label>
                            <select
                                value={formData.transmission}
                                onChange={(e) =>
                                    setFormData({ ...formData, transmission: e.target.value as Vehicle['transmission'] })
                                }
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:border-blue-500/50 outline-none"
                            >
                                <option value="Manual">Manual</option>
                                <option value="Automatic">Automático</option>
                            </select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-zinc-400">Apelido</label>
                            <input
                                type="text"
                                value={formData.nickname}
                                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:border-blue-500/50 outline-none"
                                placeholder="Ex: Black Beauty"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {loading ? 'Salvando...' : 'Salvar'}
                        </button>
                        <button type="button" onClick={closeForm} className="px-6 py-3 border border-zinc-700 text-zinc-400 rounded-xl hover:bg-zinc-800">
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            {vehicle && !isFormOpen && (
                <div className="glass p-5 md:p-6 rounded-3xl border border-zinc-800/50 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 md:h-14 md:w-14 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 shrink-0">
                                <Car size={24} className="md:w-7 md:h-7" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-lg md:text-xl font-bold text-white truncate">{vehicle.nickname}</h3>
                                <p className="text-zinc-500 text-sm">
                                    {vehicle.model} · {vehicle.year}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:self-start">
                            <button
                                onClick={() => openEdit(vehicle)}
                                className="flex-1 sm:flex-none p-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                                title="Editar"
                            >
                                <Pencil size={18} />
                                <span className="sm:hidden text-sm font-medium">Editar</span>
                            </button>
                            <button
                                onClick={() => vehicle.id && handleDelete(vehicle.id)}
                                className="flex-1 sm:flex-none p-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:text-red-400 hover:border-red-500/30 transition-colors flex items-center justify-center gap-2"
                                title="Excluir"
                            >
                                <Trash2 size={18} />
                                <span className="sm:hidden text-sm font-medium">Excluir</span>
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/50">
                            <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-1">Motor</p>
                            <p className="text-sm font-medium text-zinc-200">{vehicle.engine}</p>
                        </div>
                        <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/50">
                            <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-1">Câmbio</p>
                            <p className="text-sm font-medium text-zinc-200">{vehicle.transmission}</p>
                        </div>
                        <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/50">
                            <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-1">Modelo</p>
                            <p className="text-sm font-medium text-zinc-200">{vehicle.model}</p>
                        </div>
                        <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/50">
                            <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-1">Cadastrado em</p>
                            <p className="text-sm font-medium text-zinc-200">{formatDate(vehicle.createdAt)}</p>
                        </div>
                    </div>
                </div>
            )}

            {!vehicle && !isFormOpen && (
                <div className="glass border-2 border-dashed border-zinc-800 p-12 rounded-3xl text-center space-y-4">
                    <Car size={48} className="mx-auto text-zinc-600" />
                    <div>
                        <h3 className="text-lg font-semibold text-white">Nenhum veículo cadastrado</h3>
                        <p className="text-sm text-zinc-500 mt-1">Cadastre seu Honda para receber respostas personalizadas no chat.</p>
                    </div>
                    <button onClick={openCreate} className="text-blue-400 font-semibold hover:underline">
                        Cadastrar veículo
                    </button>
                </div>
            )}
        </div>
    );
};
