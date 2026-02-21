import {
    LayoutDashboard,
    Car,
    MessageSquare,
    BookOpen,
    Settings,
    ShieldCheck,
    X
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useUI } from '../hooks/UIContext';
import { useEffect } from 'react';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: MessageSquare, label: 'Chat IA', href: '/chat' },
    { icon: Car, label: 'Meu Veículo', href: '/vehicle' },
    { icon: BookOpen, label: 'Biblioteca', href: '/library' },
    { icon: ShieldCheck, label: 'Segurança', href: '/security' },
    { icon: Settings, label: 'Ajustes', href: '/settings' },
];

export const Sidebar = () => {
    const { isSidebarOpen, closeSidebar } = useUI();
    const location = useLocation();

    // Close sidebar on navigation (mobile)
    useEffect(() => {
        closeSidebar();
    }, [location.pathname, closeSidebar]);

    return (
        <aside className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-[calc(100vh-64px)]",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            <div className="flex items-center justify-between p-6 lg:hidden">
                <span className="text-xl font-bold gradient-text">CivicAI</span>
                <button
                    onClick={closeSidebar}
                    className="p-2 text-zinc-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="p-6 pt-2 lg:pt-6">
                <div className="space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                                isActive
                                    ? "bg-zinc-900 text-white border border-zinc-800 shadow-sm"
                                    : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50"
                            )}
                        >
                            <item.icon size={18} className={cn(
                                "transition-colors",
                                "group-hover:text-blue-400"
                            )} />
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            </div>

            <div className="mt-auto p-6 border-t border-zinc-900">
                <div className="glass p-4 rounded-xl space-y-2">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Suporte Técnico</p>
                    <p className="text-[10px] text-zinc-500 leading-relaxed">
                        Consulte manuais e tire dúvidas com a IA CivicAI.
                    </p>
                </div>
            </div>
        </aside>
    );
};
