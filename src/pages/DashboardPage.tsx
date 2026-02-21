import { useNavigate } from 'react-router-dom';
import {
    MessageSquare,
    Car,
    BookOpen,
    ArrowRight,
    TrendingUp,
    AlertCircle
} from 'lucide-react';

export const DashboardPage = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white">Bem-vindo ao CivicAI</h1>
                <p className="text-zinc-400 mt-2">Sua central de especialistas para Honda Civic 92-00.</p>
            </header>

            {/* Stats / Quick Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-blue-500/30 transition-all">
                    <div className="space-y-1">
                        <p className="text-zinc-500 text-sm font-medium">Veículos Cadastrados</p>
                        <p className="text-2xl font-bold text-white">1</p>
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                        <Car size={24} />
                    </div>
                </div>

                <div className="glass p-6 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-emerald-500/30 transition-all">
                    <div className="space-y-1">
                        <p className="text-zinc-500 text-sm font-medium">Consultas IA</p>
                        <p className="text-2xl font-bold text-white">24</p>
                    </div>
                    <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        <MessageSquare size={24} />
                    </div>
                </div>

                <div className="glass p-6 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-amber-500/30 transition-all">
                    <div className="space-y-1">
                        <p className="text-zinc-500 text-sm font-medium">Manuais Disponíveis</p>
                        <p className="text-2xl font-bold text-white">12</p>
                    </div>
                    <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-all">
                        <BookOpen size={24} />
                    </div>
                </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass p-8 rounded-3xl space-y-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 text-blue-500/5 group-hover:text-blue-500/10 transition-colors">
                        <MessageSquare size={160} />
                    </div>

                    <div className="space-y-4 relative z-10">
                        <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                            <MessageSquare size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Chat Técnico IA</h2>
                        <p className="text-zinc-400 max-w-sm">
                            Tire dúvidas sobre manutenção, torque de parafusos, diagramas elétricos e muito mais.
                        </p>
                        <button
                            onClick={() => navigate('/chat')}
                            className="flex items-center gap-2 text-blue-400 font-semibold hover:gap-3 transition-all"
                        >
                            Iniciar Conversa <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

                <div className="glass p-8 rounded-3xl space-y-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 text-emerald-500/5 group-hover:text-emerald-500/10 transition-colors">
                        <Car size={160} />
                    </div>

                    <div className="space-y-4 relative z-10">
                        <div className="h-12 w-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
                            <Car size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Gerenciar Veículo</h2>
                        <p className="text-zinc-400 max-w-sm">
                            Configure as especificações do seu Civic para receber diagnósticos mais precisos.
                        </p>
                        <button
                            onClick={() => navigate('/vehicle')}
                            className="flex items-center gap-2 text-emerald-400 font-semibold hover:gap-3 transition-all"
                        >
                            Ver Detalhes <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Notifications / Alerts Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <TrendingUp className="text-blue-400" size={20} />
                    Atividade Recente
                </h3>
                <div className="space-y-2">
                    {[1, 2].map(i => (
                        <div key={i} className="glass p-4 rounded-xl flex items-center gap-4 hover:bg-zinc-900/50 transition-colors">
                            <div className="h-10 w-10 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-500">
                                <AlertCircle size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-zinc-200">Manual de Oficina (D16Y8) processado com sucesso.</p>
                                <p className="text-xs text-zinc-500">Há 2 horas</p>
                            </div>
                            <button className="text-zinc-500 hover:text-white">
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
