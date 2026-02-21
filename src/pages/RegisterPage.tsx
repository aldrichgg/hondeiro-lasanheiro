import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthService } from '../services/AuthService';
import { UserPlus, Mail, Lock, Car } from 'lucide-react';
import { SparklesCore } from '../components/ui/Sparkles';
import { Button } from '../components/ui/MovingBorder';
import { TextGenerateEffect } from '../components/ui/TextGenerateEffect';

export const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await AuthService.register(email, password, displayName);
            navigate('/');
        } catch (err: any) {
            setError('Erro ao criar conta. Tente outro email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="w-full absolute inset-0 h-screen">
                <SparklesCore
                    id="tsparticlesregister"
                    background="transparent"
                    minSize={0.6}
                    maxSize={1.4}
                    particleDensity={50}
                    className="w-full h-full"
                    particleColor="#10b981"
                />
            </div>

            <div className="w-full max-w-md space-y-8 relative z-10">
                <div className="text-center space-y-4">
                    <div className="inline-flex p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl shadow-2xl backdrop-blur-xl">
                        <Car size={32} className="text-emerald-400" />
                    </div>
                    <div className="flex flex-col items-center">
                        <TextGenerateEffect words="CivicAI" className="text-4xl font-bold tracking-tight text-white mb-0" />
                        <p className="text-zinc-400 mt-1">Comece a cuidar melhor do seu Civic hoje</p>
                    </div>
                </div>

                <form onSubmit={handleRegister} className="bg-zinc-900/40 border border-zinc-800 backdrop-blur-xl p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl">
                    {error && (
                        <div className="p-3 text-sm bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300 ml-1">Nome Completo</label>
                            <div className="relative group">
                                <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all font-light"
                                    placeholder="Seu nome"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300 ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all font-light"
                                    placeholder="seu@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300 ml-1">Senha</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all font-light"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300 ml-1">Confirmar Senha</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all font-light"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        borderRadius="1rem"
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 flex items-center justify-center gap-2 group disabled:opacity-50"
                        containerClassName="w-full"
                    >
                        {loading ? 'Criando conta...' : (
                            <div className="flex items-center gap-2">
                                <span>Criar Conta</span>
                                <UserPlus size={18} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        )}
                    </Button>

                    <p className="text-center text-sm text-zinc-500">
                        Já tem uma conta?{' '}
                        <Link to="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors">Entrar</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};
