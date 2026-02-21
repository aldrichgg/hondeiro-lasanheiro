import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthService } from '../services/AuthService';
import { LogIn, Mail, Lock, Car } from 'lucide-react';
import { SparklesCore } from '../components/ui/Sparkles';
import { Button } from '../components/ui/MovingBorder';
import { TextGenerateEffect } from '../components/ui/TextGenerateEffect';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await AuthService.login(email, password);
            navigate('/');
        } catch (err: any) {
            setError('Credenciais inválidas ou erro no servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="w-full absolute inset-0 h-screen">
                <SparklesCore
                    id="tsparticleslogin"
                    background="transparent"
                    minSize={0.6}
                    maxSize={1.4}
                    particleDensity={50}
                    className="w-full h-full"
                    particleColor="#3b82f6"
                />
            </div>

            <div className="w-full max-w-md space-y-8 relative z-10">
                <div className="text-center space-y-4">
                    <div className="inline-flex p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl shadow-2xl backdrop-blur-xl">
                        <Car size={32} className="text-blue-400" />
                    </div>
                    <div className="flex flex-col items-center">
                        <TextGenerateEffect words="CivicAI" className="text-4xl font-bold tracking-tight text-white mb-0" />
                        <p className="text-zinc-400 mt-1">Inteligência para o seu Honda Civic 92-00</p>
                    </div>
                </div>

                <form onSubmit={handleLogin} className="bg-zinc-900/40 border border-zinc-800 backdrop-blur-xl p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl">
                    {error && (
                        <div className="p-3 text-sm bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300 ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-light"
                                    placeholder="seu@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300 ml-1">Senha</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-light"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        borderRadius="1rem"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 flex items-center justify-center gap-2 group disabled:opacity-50"
                        containerClassName="w-full"
                    >
                        {loading ? 'Entrando...' : (
                            <div className="flex items-center gap-2">
                                <span>Acessar Plataforma</span>
                                <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        )}
                    </Button>

                    <p className="text-center text-sm text-zinc-500">
                        Não tem uma conta?{' '}
                        <Link to="/register" className="text-blue-400 hover:text-blue-300 transition-colors">Criar agora</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};
