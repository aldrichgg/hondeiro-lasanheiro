import { LogOut, Bell } from 'lucide-react';
import { AuthService } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await AuthService.logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <nav className="h-16 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold gradient-text select-none">CivicAI</h1>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 text-zinc-400 hover:text-white transition-colors" aria-label="Notificações">
                    <Bell size={20} />
                </button>
                <div className="h-8 w-[1px] bg-zinc-800 mx-2" />
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-zinc-200">Honda Owner</p>
                        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">Premium Plan</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className={cn(
                            "p-2 bg-zinc-900 rounded-full border border-zinc-800 text-zinc-400",
                            "hover:text-red-400 hover:border-red-900/50 transition-all active:scale-95"
                        )}
                        title="Sair"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </nav>
    );
};
