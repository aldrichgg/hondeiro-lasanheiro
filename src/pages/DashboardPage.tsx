import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    collection,
    query,
    where,
    onSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/AuthContext';
import {
    MessageSquare,
    Car,
    ArrowRight,
    Loader2
} from 'lucide-react';

export const DashboardPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [stats, setStats] = useState({
        vehicles: 0,
        chats: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
    }, [user]);

    useEffect(() => {
        if (!user) return;

        const unsubscribeVehicles = onSnapshot(
            query(collection(db, 'vehicles'), where('userId', '==', user.uid)),
            (snapshot) => setStats(prev => ({ ...prev, vehicles: snapshot.size }))
        );

        const unsubscribeSessions = onSnapshot(
            query(collection(db, 'chat_sessions'), where('userId', '==', user.uid)),
            (snapshot) => setStats(prev => ({ ...prev, chats: snapshot.size }))
        );

        setLoading(false);

        return () => {
            unsubscribeVehicles();
            unsubscribeSessions();
        };
    }, [user]);

    // loadStats is no longer used but we'll remove it or its call

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white">Bem-vindo ao CivicAI</h1>
                <p className="text-zinc-400 mt-2">Sua central de especialistas para Honda Civic 92-00.</p>
            </header>

            {/* Stats / Quick Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div onClick={() => navigate('/vehicle')} className="glass p-6 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-blue-500/30 transition-all">
                    <div className="space-y-1">
                        <p className="text-zinc-500 text-sm font-medium">Veículos Cadastrados</p>
                        {loading ? <Loader2 size={16} className="animate-spin text-zinc-500" /> : <p className="text-2xl font-bold text-white">{stats.vehicles}</p>}
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                        <Car size={24} />
                    </div>
                </div>

                <div onClick={() => navigate('/chat')} className="glass p-6 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-emerald-500/30 transition-all">
                    <div className="space-y-1">
                        <p className="text-zinc-500 text-sm font-medium">Consultas IA</p>
                        {loading ? <Loader2 size={16} className="animate-spin text-zinc-500" /> : <p className="text-2xl font-bold text-white">{stats.chats}</p>}
                    </div>
                    <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        <MessageSquare size={24} />
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

        </div>
    );
};
