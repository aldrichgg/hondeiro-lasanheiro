import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/AuthContext';
import { ChatService } from '../services/ChatService';
import { ChatMessage } from '../types';
import { Send, Bot, User as UserIcon, Loader2, Info } from 'lucide-react';
import { clsx } from 'clsx';

export const ChatPage = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (user) {
            const unsubscribe = ChatService.subscribeToMessages(user.uid, setMessages);
            return unsubscribe;
        }
    }, [user]);

    useEffect(() => {
        scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !user || loading) return;

        const text = input;
        setInput('');
        setLoading(true);

        try {
            await ChatService.sendMessage(user.uid, text);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto space-y-4">
            <header className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Bot className="text-blue-400" size={24} />
                        Assistente CivicAI
                    </h1>
                    <p className="text-sm text-zinc-500">Baseado em manuais técnicos de 1992 a 2000.</p>
                </div>
                <div className="flex items-center gap-2 p-2 bg-zinc-900 rounded-lg text-zinc-400 text-xs">
                    <Info size={14} />
                    Modo Especialista Ativo
                </div>
            </header>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar"
            >
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-60">
                        <div className="h-20 w-20 bg-zinc-900 rounded-3xl flex items-center justify-center text-zinc-700">
                            <MessageSquare size={40} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-medium text-white">Como posso ajudar hoje?</h3>
                            <p className="text-zinc-500 max-w-sm">Pergunte sobre diagramas elétricos, torque de motor ou códigos de erro.</p>
                        </div>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={clsx(
                            "flex gap-4 w-full",
                            msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                        )}
                    >
                        <div className={clsx(
                            "h-10 w-10 shrink-0 rounded-xl flex items-center justify-center border",
                            msg.role === 'user' ? "bg-zinc-800 border-zinc-700 text-zinc-300" : "bg-blue-600/10 border-blue-500/20 text-blue-400"
                        )}>
                            {msg.role === 'user' ? <UserIcon size={18} /> : <Bot size={18} />}
                        </div>
                        <div className={clsx(
                            "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
                            msg.role === 'user' ? "bg-zinc-900 text-white" : "bg-zinc-900/50 border border-zinc-800/50 text-zinc-200"
                        )}>
                            {msg.content}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex gap-4 opacity-50">
                        <div className="h-10 w-10 shrink-0 rounded-xl flex items-center justify-center border bg-blue-600/10 border-blue-500/20 text-blue-400">
                            <Bot size={18} className="animate-pulse" />
                        </div>
                        <div className="p-4 rounded-2xl text-sm bg-zinc-900/50 border border-zinc-800/50 flex items-center gap-3">
                            <Loader2 size={16} className="animate-spin" />
                            Processando conhecimento técnico...
                        </div>
                    </div>
                )}
            </div>

            <form
                onSubmit={handleSend}
                className="relative group pt-4"
            >
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ex: Qual o torque do cabeçote do D16Y8?"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-6 pr-14 text-white focus:outline-none focus:border-blue-500/50 shadow-2xl transition-all"
                />
                <button
                    type="submit"
                    className="absolute right-3 top-[calc(50%+8px)] -translate-y-1/2 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 group-hover:scale-105"
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

// Helper for empty state icon
const MessageSquare = ({ size, className }: { size: number, className?: string }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);
