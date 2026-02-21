import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { FloatingDock } from '../components/ui/FloatingDock';
import {
    LayoutDashboard,
    MessageSquare,
    Car,
    BookOpen,
    Store,
    Settings
} from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';

export const MainLayout = () => {
    const { userProfile } = useAuth();

    const navLinks = [
        {
            title: "Dashboard",
            icon: <LayoutDashboard className="h-full w-full" />,
            href: "/",
        },
        {
            title: "Chat IA",
            icon: <MessageSquare className="h-full w-full" />,
            href: "/chat",
        },
        {
            title: "Veículo",
            icon: <Car className="h-full w-full" />,
            href: "/vehicle",
        },
        {
            title: "Biblioteca",
            icon: <BookOpen className="h-full w-full" />,
            href: "/library",
        },
        {
            title: "Sellers",
            icon: <Store className="h-full w-full" />,
            href: "/sellers",
        },
    ];

    if (userProfile?.isAdmin) {
        navLinks.push({
            title: "Admin",
            icon: <Settings className="h-full w-full" />,
            href: "/admin",
        });
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col w-full overflow-x-hidden">
            <Navbar />
            <div className="flex flex-1 relative">
                <Sidebar />
                <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)] lg:px-12 pb-24 lg:pb-8">
                    <Outlet />
                </main>

                {/* Floating Dock (Mobile) */}
                <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                    <FloatingDock
                        items={navLinks}
                        mobileClassName="translate-y-0"
                    />
                </div>
            </div>
        </div>
    );
};
