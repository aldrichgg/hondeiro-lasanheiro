import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/AuthContext';
import { ChatService } from '../services/ChatService';
import type { ChatMessage, ChatSession } from '../types';
import {
    Send,
    Bot,
    User as UserIcon,
    Info,
    Trash2,
    Plus,
    MessageSquare as MsgIcon,
    ChevronRight,
    Search
} from 'lucide-react';
import { clsx } from 'clsx';

export const ChatPage = () => {
    const { user } = useAuth();
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Subscribe to sessions
    useEffect(() => {
        if (user) {
            const unsubscribe = ChatService.subscribeToSessions(user.uid, (data) => {
                setSessions(data);
                // If no session selected, select the most recent one
                if (data.length > 0 && !currentSessionId) {
                    setCurrentSessionId(data[0].id);
                }
            });
            return unsubscribe;
        }
    }, [user]);

    // Subscribe to messages of current session
    useEffect(() => {
        if (currentSessionId) {
            const unsubscribe = ChatService.subscribeToMessages(currentSessionId, setMessages);
            return unsubscribe;
        } else {
            setMessages([]);
        }
    }, [currentSessionId]);

    useEffect(() => {
        scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
    }, [messages]);

    const handleNewChat = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const id = await ChatService.createSession(user.uid);
            setCurrentSessionId(id);
        } catch (error) {
            console.error('Error creating session:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
        e.stopPropagation();
        if (!window.confirm('Excluir esta conversa permanentemente?')) return;

        try {
            await ChatService.deleteSession(sessionId);
            if (currentSessionId === sessionId) {
                setCurrentSessionId(sessions.find(s => s.id !== sessionId)?.id || null);
            }
        } catch (error) {
            console.error('Error deleting session:', error);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !user || loading) return;

        let sessionId = currentSessionId;
        if (!sessionId) {
            sessionId = await ChatService.createSession(user.uid, input.substring(0, 30) + '...');
            setCurrentSessionId(sessionId);
        }

        const text = input;
        setInput('');
        setLoading(true);

        try {
            await ChatService.sendMessage(user.uid, sessionId, text);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex bg-zinc-950 rounded-3xl border border-zinc-800/50 overflow-hidden h-[calc(100vh-140px)] shadow-2xl">
            {/* Sidebar Histórico */}
            <aside className={clsx(
                "bg-zinc-900/50 border-r border-zinc-800/50 transition-all duration-300 flex flex-col",
                sidebarOpen ? "w-80" : "w-0 overflow-hidden"
            )}>
                <div className="p-6 flex-1 flex flex-col min-w-[320px]">
                    <button
                        onClick={handleNewChat}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl border border-zinc-700/50 transition-all mb-6 font-medium group"
                    >
                        <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                        Nova Conversa
                    </button>

                    <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar -mr-4 pr-4">
                        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-4">Histórico Recente</p>
                        {sessions.map(session => (
                            <div
                                key={session.id}
                                onClick={() => setCurrentSessionId(session.id)}
                                className={clsx(
                                    "group relative p-3 rounded-xl cursor-pointer transition-all flex items-center gap-3 border",
                                    currentSessionId === session.id
                                        ? "bg-blue-600/10 border-blue-500/30 text-white"
                                        : "hover:bg-zinc-800/50 border-transparent text-zinc-400 hover:text-zinc-200"
                                )}
                            >
                                <div className={clsx(
                                    "p-2 rounded-lg",
                                    currentSessionId === session.id ? "bg-blue-500/20 text-blue-400" : "bg-zinc-800 text-zinc-500"
                                )}>
                                    <MsgIcon size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{session.title}</p>
                                    <p className="text-[10px] opacity-40">
                                        {new Date(session.lastMessageAt?.toMillis() || Date.now()).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => handleDeleteSession(e, session.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:text-red-400 text-zinc-500 transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                        {sessions.length === 0 && (
                            <div className="py-8 text-center space-y-2 opacity-30">
                                <Search size={24} className="mx-auto" />
                                <p className="text-xs">Nenhum histórico</p>
                            </div>
                        )}
                    </div>

                    <div className="pt-6 mt-6 border-t border-zinc-800">
                        <div className="flex items-center gap-4 p-3 bg-zinc-900 rounded-2xl border border-zinc-800">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-xs font-bold">
                                {user?.email?.[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{user?.email?.split('@')[0]}</p>
                                <p className="text-[10px] text-zinc-500 font-medium">Conta CivicAI Free</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Chat Area */}
            <main className="flex-1 flex flex-col min-w-0 relative">
                {/* Botão de Toggle Sidebar (quando fechada) */}
                {!sidebarOpen && (
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="absolute left-4 top-4 z-20 p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white"
                    >
                        <ChevronRight size={18} />
                    </button>
                )}

                <div className="flex flex-col h-full bg-gradient-to-b from-transparent to-zinc-950/30">
                    <header className="flex items-center justify-between p-6 border-b border-zinc-800/50 bg-zinc-900/20 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 ring-1 ring-blue-500/20">
                                <Bot size={28} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white leading-tight">CivicAI Technical Expert</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50" />
                                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Base de Dados v1.0.4</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 rounded-lg border border-zinc-700/50 text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
                                <Info size={12} /> RAG Ativo
                            </div>
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2.5 text-zinc-500 hover:text-white transition-colors bg-zinc-800/50 rounded-xl border border-zinc-700/50"
                            >
                                <MsgIcon size={18} />
                            </button>
                        </div>
                    </header>

                    {/* Messages Body */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar"
                    >
                        {!currentSessionId && messages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 max-w-md mx-auto">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-blue-600 blur-3xl opacity-20 rounded-full" />
                                    <div className="relative h-24 w-24 bg-zinc-900 rounded-[2.5rem] flex items-center justify-center text-blue-400 border border-zinc-800 shadow-2xl">
                                        <Bot size={48} />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-2xl font-bold text-white">Pronto para acelerar?</h3>
                                    <p className="text-zinc-400 text-sm leading-relaxed">
                                        Inicie uma nova conversa para consultar diagramas elétricos, torques, códigos DTC e procedimentos de serviço ORIGINAIS.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 w-full pt-4">
                                    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-left hover:border-blue-500/30 transition-all cursor-pointer opacity-80" onClick={() => setInput('Qual o esquema da ECU P28?')}>
                                        <p className="text-xs font-bold text-blue-400 mb-2 uppercase">Diagrama</p>
                                        <p className="text-xs text-zinc-500">Esquema da ECU P28</p>
                                    </div>
                                    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-left hover:border-blue-500/30 transition-all cursor-pointer opacity-80" onClick={() => setInput('Folga de válvulas motor D16Y8')}>
                                        <p className="text-xs font-bold text-blue-400 mb-2 uppercase">Mecânica</p>
                                        <p className="text-xs text-zinc-500">Folga de válvulas D16</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={clsx(
                                    "flex gap-6 w-full group animate-in fade-in slide-in-from-bottom-2",
                                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                <div className={clsx(
                                    "h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center border shadow-lg transition-all",
                                    msg.role === 'user'
                                        ? "bg-zinc-800 border-zinc-700 text-zinc-300 group-hover:border-zinc-600"
                                        : "bg-gradient-to-br from-blue-600 to-indigo-600 border-blue-400/20 text-white shadow-blue-600/10"
                                )}>
                                    {msg.role === 'user' ? <UserIcon size={22} /> : <Bot size={22} />}
                                </div>
                                <div className={clsx(
                                    "max-w-[75%] space-y-2",
                                    msg.role === 'user' ? "text-right" : "text-left"
                                )}>
                                    <div className={clsx(
                                        "p-5 rounded-3xl text-[13px] leading-relaxed relative",
                                        msg.role === 'user'
                                            ? "bg-blue-600 text-white shadow-xl shadow-blue-600/5 rounded-tr-none"
                                            : "bg-zinc-900 text-zinc-200 border border-zinc-800/80 rounded-tl-none"
                                    )}>
                                        {msg.content}
                                    </div>
                                    <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-2">
                                        {msg.role === 'user' ? 'Você' : 'Honda Expert AI'} • {new Date(msg.createdAt?.toMillis() || Date.now()).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex gap-6 animate-in fade-in duration-300">
                                <div className="h-12 w-12 shrink-0 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                                    <Bot size={22} className="animate-spin-slow" />
                                </div>
                                <div className="p-5 rounded-3xl rounded-tl-none bg-zinc-900 border border-zinc-800/80 flex items-center gap-4">
                                    <div className="flex gap-1">
                                        <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce" />
                                    </div>
                                    <p className="text-xs font-medium text-zinc-500">IA está consultando manuais de serviço...</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <footer className="p-6 bg-zinc-950/50 backdrop-blur-xl border-t border-zinc-800/50 relative z-10">
                        <form onSubmit={handleSend} className="max-w-4xl mx-auto relative flex gap-4">
                            <div className="relative flex-1 group">
                                <div className="absolute inset-0 bg-blue-500/5 blur-xl group-focus-within:bg-blue-500/10 transition-all rounded-full" />
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={currentSessionId ? "Faça uma pergunta técnica..." : "Para começar, mande um 'Olá' ou sua dúvida..."}
                                    disabled={loading}
                                    className="w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl py-4 pl-6 pr-14 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 shadow-2xl transition-all relative z-10 disabled:opacity-50"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 z-20">
                                    <button
                                        type="submit"
                                        disabled={loading || !input.trim()}
                                        className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:shadow-none hover:scale-105 active:scale-95"
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </footer>
                </div>
            </main>
        </div>
    );
};


