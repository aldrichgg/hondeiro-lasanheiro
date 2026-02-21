import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const MainLayout = () => {
    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col">
            <Navbar />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-8 overflow-y-auto max-h-[calc(100vh-64px)] lg:px-12">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
