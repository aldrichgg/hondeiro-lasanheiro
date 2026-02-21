import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { useUI } from '../hooks/UIContext';

export const MainLayout = () => {
    const { isSidebarOpen, closeSidebar } = useUI();

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col">
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
                <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)] lg:px-12">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
