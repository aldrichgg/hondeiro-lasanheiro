import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { useUI } from '../hooks/UIContext';
import { FloatingDock } from '../components/ui/FloatingDock';
import {
    IconLayoutDashboard,
    IconMessageChatbot,
    IconCar,
    IconBook,
    IconBuildingStore,
    IconSettings
} from '@tabler/icons-react';
import { useAuth } from '../hooks/AuthContext';

export const MainLayout = () => {
    const { isSidebarOpen, closeSidebar } = useUI();
    const { userProfile } = useAuth();

    const navLinks = [
        {
            title: "Dashboard",
            icon: <IconLayoutDashboard className="h-full w-full" />,
            href: "/",
        },
        {
            title: "Chat IA",
            icon: <IconMessageChatbot className="h-full w-full" />,
            href: "/chat",
        },
        {
            title: "Veículo",
            icon: <IconCar className="h-full w-full" />,
            href: "/vehicle",
        },
        {
            title: "Biblioteca",
            icon: <IconBook className="h-full w-full" />,
            href: "/library",
        },
        {
            title: "Sellers",
            icon: <IconBuildingStore className="h-full w-full" />,
            href: "/sellers",
        },
    ];

    if (userProfile?.isAdmin) {
        navLinks.push({
            title: "Admin",
            icon: <IconSettings className="h-full w-full" />,
            href: "/admin",
        });
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col w-full overflow-x-hidden">
            <Navbar />
            <div className="flex flex-1 relative">
                {/* Backdrop for mobile */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
                        onClick={closeSidebar}
                    />
                )}

                <Sidebar />
                <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)] lg:px-12 pb-32 lg:pb-8">
                    <Outlet />
                </main>

                {/* Floating Dock (Mobile) */}
                <div className="lg:hidden fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
                    <FloatingDock
                        items={navLinks}
                        mobileClassName="translate-y-0"
                    />
                </div>
            </div>
        </div>
    );
};
