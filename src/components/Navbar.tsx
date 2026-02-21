import { LogOut, Bell } from 'lucide-react';
import { AuthService } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await AuthService.logout();
        navigate('/login');
    };

    return (
        <nav className="h-16 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold gradient-text">CivicAI</h1>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 text-zinc-400 hover:text-white transition-colors">
                    <Bell size={20} />
                </button>
                <div className="h-8 w-[1px] bg-zinc-800 mx-2" />
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium">Honda Owner</p>
                        <p className="text-xs text-zinc-500">Premium Plan</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 bg-zinc-900 rounded-full border border-zinc-800 text-zinc-400 hover:text-red-400 transition-all hover:border-red-900/50"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </nav>
    );
};
