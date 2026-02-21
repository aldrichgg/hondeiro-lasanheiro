import { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    ChevronLeft,
    LogOut,
    Car,
    BookOpen,
    Store,
    Settings,
    Menu,
    X
} from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';
import { Navigate } from 'react-router-dom';

export const AdminLayout = () => {
    const { userProfile, loading } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    if (loading) return null;

    // Safety check for admin role
    if (!userProfile?.isAdmin) {
        return <Navigate to="/" replace />;
    }

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
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
                <Link
                    to="/admin?tab=vehicles"
                    onClick={() => setIsMenuOpen(false)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold border transition-all ${!window.location.search || window.location.search.includes('vehicles') ? 'bg-zinc-800/50 text-white border-zinc-700/50' : 'text-zinc-400 border-transparent hover:text-white hover:bg-zinc-800/30'}`}
                >
                    <LayoutDashboard size={18} className="text-blue-400" />
                    Dashboard
                </Link>
                <div className="pt-4 pb-2 px-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                    Gestão
                </div>
                <div className="space-y-1">
                    <Link
                        to="/admin?tab=vehicles"
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2 hover:text-white transition-colors cursor-pointer text-sm ${window.location.search.includes('vehicles') ? 'text-white font-bold' : 'text-zinc-400'}`}
                    >
                        <Car size={16} /> Veículos
                    </Link>
                    <Link
                        to="/admin?tab=library"
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2 hover:text-white transition-colors cursor-pointer text-sm ${window.location.search.includes('library') ? 'text-white font-bold' : 'text-zinc-400'}`}
                    >
                        <BookOpen size={16} /> Biblioteca
                    </Link>
                    <Link
                        to="/admin?tab=sellers"
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2 hover:text-white transition-colors cursor-pointer text-sm ${window.location.search.includes('sellers') ? 'text-white font-bold' : 'text-zinc-400'}`}
                    >
                        <Store size={16} /> Vendedores
                    </Link>
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
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col lg:flex-row">
            {/* Mobile Header */}
            <header className="lg:hidden flex items-center justify-between p-4 bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                        <Settings size={18} />
                    </div>
                    <span className="font-bold text-white tracking-tight">Painel Admin</span>
                </div>
                <button
                    onClick={toggleMenu}
                    className="p-2 text-zinc-400 hover:text-white transition-colors bg-zinc-800 rounded-lg"
                >
                    {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </header>

            {/* Admin Sidebar (Desktop) */}
            <aside className="hidden lg:flex w-64 border-r border-zinc-800 bg-zinc-900/30 flex-col p-6 sticky top-0 h-screen">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Context (Drawer) */}
            {isMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <aside className="fixed left-0 top-0 bottom-0 w-[280px] bg-zinc-900 border-r border-zinc-800 z-50 p-6 lg:hidden animate-in slide-in-from-left duration-300">
                        <SidebarContent />
                    </aside>
                </>
            )}

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-zinc-950 to-zinc-950 p-6 md:p-12">
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
