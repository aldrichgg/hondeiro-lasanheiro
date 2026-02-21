import {
    LayoutDashboard,
    Car,
    MessageSquare,
    BookOpen,
    Settings,
    ShieldCheck,
    Store
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useAuth } from '../hooks/AuthContext';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: MessageSquare, label: 'Chat IA', href: '/chat' },
    { icon: Car, label: 'Meu Veículo', href: '/vehicle' },
    { icon: BookOpen, label: 'Biblioteca', href: '/library' },
    { icon: Store, label: 'Vendedores', href: '/sellers' },
    { icon: ShieldCheck, label: 'Segurança', href: '/security' },
    { icon: Settings, label: 'Ajustes', href: '/settings' },
];

export const Sidebar = () => {
    const { userProfile } = useAuth();

    const items = [...navItems];
    if (userProfile?.isAdmin) {
        items.push({ icon: Settings, label: 'Painel Admin', href: '/admin' });
    }

    return (
        <aside className="hidden lg:flex flex-col w-64 border-r border-zinc-800 bg-zinc-950 transition-all duration-300 ease-in-out h-[calc(100vh-64px)] overflow-y-auto">
            <div className="p-6 pt-6 flex-1">
                <div className="space-y-1">
                    {items.map((item) => (
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

            <div className="p-6 border-t border-zinc-900">
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
