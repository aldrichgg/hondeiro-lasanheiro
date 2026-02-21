import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/AuthContext';
import { VehicleService } from '../services/VehicleService';
import { Vehicle } from '../types';
import { Car, Plus, Save, Trash2, Settings2 } from 'lucide-react';

export const VehiclePage = () => {
    const { user } = useAuth();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<Omit<Vehicle, 'id' | 'userId' | 'createdAt'>>({
        model: 'Civic',
        year: 1998,
        engine: 'D16Y8',
        transmission: 'Manual',
        nickname: 'Meu Projeto',
    });

    useEffect(() => {
        if (user) {
            loadVehicles();
        }
    }, [user]);

    const loadVehicles = async () => {
        if (user) {
            const data = await VehicleService.getUserVehicles(user.uid);
            setVehicles(data);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        try {
            await VehicleService.addVehicle({ ...formData, userId: user.uid });
            setIsAdding(false);
            loadVehicles();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Meu Veículo</h1>
                    <p className="text-zinc-400 mt-1">Gerencie as configurações do seu Honda.</p>
                </div>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
                    >
                        <Plus size={18} />
                        Cadastrar Novo
                    </button>
                )}
            </header>

            {isAdding && (
                <form onSubmit={handleSubmit} className="glass p-8 rounded-3xl space-y-6 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Modelo</label>
                            <input
                                type="text"
                                value={formData.model}
                                onChange={e => setFormData({ ...formData, model: e.target.value })}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                placeholder="Civic Sedan"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Ano</label>
                            <input
                                type="number"
                                value={formData.year}
                                onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Motor</label>
                            <input
                                type="text"
                                value={formData.engine}
                                onChange={e => setFormData({ ...formData, engine: e.target.value })}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                placeholder="D16Y8 / B16A2"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Transmissão</label>
                            <select
                                value={formData.transmission}
                                onChange={e => setFormData({ ...formData, transmission: e.target.value as any })}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                            >
                                <option value="Manual">Manual</option>
                                <option value="Automatic">Automático</option>
                            </select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-zinc-400">Apelido do Projeto</label>
                            <input
                                type="text"
                                value={formData.nickname}
                                onChange={e => setFormData({ ...formData, nickname: e.target.value })}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                                placeholder="Ex: Black Beauty"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4 pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            <Save size={18} />
                            {loading ? 'Salvando...' : 'Salvar Veículo'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsAdding(false)}
                            className="px-6 border border-zinc-800 hover:bg-zinc-900 text-zinc-400 rounded-xl transition-all"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vehicles.map(vehicle => (
                    <div key={vehicle.id} className="glass p-6 rounded-2xl space-y-4 group">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                    <Car size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">{vehicle.nickname}</h3>
                                    <p className="text-zinc-500 text-sm">{vehicle.model} - {vehicle.year}</p>
                                </div>
                            </div>
                            <button className="p-2 text-zinc-600 hover:text-red-400 transition-colors">
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/50">
                                <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-1">Motor</p>
                                <p className="text-sm text-zinc-200">{vehicle.engine}</p>
                            </div>
                            <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/50">
                                <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-1">Câmbio</p>
                                <p className="text-sm text-zinc-200">{vehicle.transmission}</p>
                            </div>
                        </div>

                        <button className="w-full mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-zinc-500 hover:text-white transition-colors py-2 border border-dashed border-zinc-800 rounded-lg hover:border-zinc-700">
                            <Settings2 size={14} />
                            Editar Especificações
                        </button>
                    </div>
                ))}

                {vehicles.length === 0 && !isAdding && (
                    <div className="md:col-span-2 glass border-dashed border-2 border-zinc-800 p-12 rounded-3xl text-center space-y-4 opacity-50">
                        <Car size={48} className="mx-auto text-zinc-700" />
                        <div className="space-y-1">
                            <h3 className="text-lg font-medium text-white">Nenhum veículo cadastrado</h3>
                            <p className="text-sm text-zinc-500">Cadastre seu Honda para receber dicas personalizadas.</p>
                        </div>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="text-blue-400 text-sm font-semibold hover:underline"
                        >
                            Adicionar agora
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
