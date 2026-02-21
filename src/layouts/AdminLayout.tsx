
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    ChevronLeft,
    LogOut,
    Car,
    BookOpen,
    Store,
    Settings,
} from 'lucide-react';
import {
    IconLayoutDashboard,
    IconCar,
    IconBook,
    IconBuildingStore,
    IconLogout,
    IconArrowLeft,
} from '@tabler/icons-react';
import { useAuth } from '../hooks/AuthContext';
import { Navigate } from 'react-router-dom';
import { FloatingDock } from '../components/ui/FloatingDock';

export const AdminLayout = () => {
    const { userProfile, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    if (loading) return null;

    // Safety check for admin role
    if (!userProfile?.isAdmin) {
        return <Navigate to="/" replace />;
    }

    const dockLinks = [
        {
            title: "Dashboard",
            icon: <IconLayoutDashboard className="h-full w-full" />,
            href: "/admin?tab=vehicles",
        },
        {
            title: "Veículos",
            icon: <IconCar className="h-full w-full" />,
            href: "/admin?tab=vehicles",
        },
        {
            title: "Biblioteca",
            icon: <IconBook className="h-full w-full" />,
            href: "/admin?tab=library",
        },
        {
            title: "Vendedores",
            icon: <IconBuildingStore className="h-full w-full" />,
            href: "/admin?tab=sellers",
        },
        {
            title: "Voltar",
            icon: <IconArrowLeft className="h-full w-full" />,
            href: "/",
        },
        {
            title: "Sair",
            icon: <IconLogout className="h-full w-full" />,
            href: "/",
        },
    ];

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
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold border transition-all ${!location.search || location.search.includes('vehicles') ? 'bg-zinc-800/50 text-white border-zinc-700/50' : 'text-zinc-400 border-transparent hover:text-white hover:bg-zinc-800/30'}`}
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
                        className={`flex items-center gap-3 px-4 py-2 hover:text-white transition-colors cursor-pointer text-sm ${location.search.includes('vehicles') ? 'text-white font-bold' : 'text-zinc-400'}`}
                    >
                        <Car size={16} /> Veículos
                    </Link>
                    <Link
                        to="/admin?tab=library"
                        className={`flex items-center gap-3 px-4 py-2 hover:text-white transition-colors cursor-pointer text-sm ${location.search.includes('library') ? 'text-white font-bold' : 'text-zinc-400'}`}
                    >
                        <BookOpen size={16} /> Biblioteca
                    </Link>
                    <Link
                        to="/admin?tab=sellers"
                        className={`flex items-center gap-3 px-4 py-2 hover:text-white transition-colors cursor-pointer text-sm ${location.search.includes('sellers') ? 'text-white font-bold' : 'text-zinc-400'}`}
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
        <div className="min-h-screen bg-zinc-950 flex flex-col lg:flex-row w-full overflow-x-hidden">
            {/* Mobile Header */}
            <header className="lg:hidden flex items-center justify-between px-6 h-16 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                        <Settings size={18} />
                    </div>
                    <span className="font-bold text-white tracking-tight">CivicAI</span>
                </div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest px-2 py-1 rounded-md bg-zinc-800/50 border border-zinc-700/50">Admin</div>
            </header>

            {/* Admin Sidebar (Desktop) */}
            <aside className="hidden lg:flex w-64 border-r border-zinc-800 bg-zinc-900/30 flex-col p-6 sticky top-0 h-screen">
                <SidebarContent />
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-zinc-950 to-zinc-950 p-6 md:p-12 pb-32 lg:pb-12 w-full">
                <div className="max-w-6xl mx-auto w-full">
                    <Outlet />
                </div>
            </main>

            {/* Floating Dock (Mobile) */}
            <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                <FloatingDock
                    items={dockLinks}
                    mobileClassName="translate-y-0"
                />
            </div>
        </div>
    );
};

