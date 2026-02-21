import { Outlet, useNavigate, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    ChevronLeft,
    LogOut,
    Car,
    BookOpen,
    Store,
    Settings
} from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';
import { Navigate } from 'react-router-dom';

export const AdminLayout = () => {
    const { userProfile, loading } = useAuth();
    const navigate = useNavigate();

    if (loading) return null;

    // Safety check for admin role
    if (!userProfile?.isAdmin) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex">
            {/* Admin Sidebar */}
            <aside className="w-64 border-r border-zinc-800 bg-zinc-900/30 flex flex-col p-6">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                        <Settings size={22} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight">CivicAI</h1>
                        <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Painel Admin</p>
                    </div>
                </div>

                <nav className="space-y-2 flex-1">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-zinc-800/50 text-white rounded-xl text-sm font-semibold border border-zinc-700/50 transition-all">
                        <LayoutDashboard size={18} className="text-blue-400" />
                        Dashboard
                    </button>
                    {/* These could be links to sub-admin routes if we had them */}
                    <div className="pt-4 pb-2 px-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                        Gestão
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3 px-4 py-2 text-zinc-400 hover:text-white transition-colors cursor-pointer text-sm">
                            <Car size={16} /> Veículos
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 text-zinc-400 hover:text-white transition-colors cursor-pointer text-sm">
                            <BookOpen size={16} /> Biblioteca
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 text-zinc-400 hover:text-white transition-colors cursor-pointer text-sm">
                            <Store size={16} /> Vendedores
                        </div>
                    </div>
                </nav>

                <div className="mt-auto space-y-4">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm px-4"
                    >
                        <ChevronLeft size={16} /> Voltar ao App
                    </Link>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full flex items-center justify-center gap-2 py-3 border border-zinc-800 rounded-xl text-sm font-bold text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all shadow-sm"
                    >
                        <LogOut size={16} /> Sair
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-zinc-950 to-zinc-950 p-8 md:p-12">
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
