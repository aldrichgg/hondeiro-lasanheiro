import { useAuth } from '../hooks/AuthContext';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { ChatKit, useChatKit } from '@openai/chatkit-react';
import { Bot } from 'lucide-react';

const functions = getFunctions();
const createChatKitSessionCallable = httpsCallable<Record<string, never>, { client_secret: string }>(
    functions,
    'createChatKitSession'
);

async function getClientSecret(_existing: string | null): Promise<string> {
    const result = await createChatKitSessionCallable({});
    const secret = result.data?.client_secret;
    if (!secret) throw new Error('Sessão ChatKit não retornou client_secret.');
    return secret;
}

export const ChatPage = () => {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-140px)] text-zinc-500">
                Faça login para usar o chat.
            </div>
        );
    }

    const { control } = useChatKit({
        api: {
            getClientSecret,
        },
    });

    return (
        <div className="flex flex-col bg-zinc-950 rounded-2xl md:rounded-3xl border border-zinc-800/50 overflow-hidden h-[calc(100vh-160px)] md:h-[calc(100vh-160px)] shadow-2xl pb-20 md:pb-0">
            <header className="flex items-center gap-3 md:gap-4 p-4 md:p-6 border-b border-zinc-800/50 bg-zinc-900/20 shrink-0">
                <div className="h-10 w-10 md:h-12 md:w-12 bg-blue-600/10 rounded-xl md:rounded-2xl flex items-center justify-center text-blue-400 ring-1 ring-blue-500/20">
                    <Bot size={24} className="md:w-7 md:h-7" />
                </div>
                <div>
                    <h2 className="text-base md:text-lg font-bold text-white leading-tight">Hondeiro Lasanheiro</h2>
                    <p className="text-[9px] md:text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">
                        Especialista Honda Civic 92–00 • ChatKit
                    </p>
                </div>
            </header>
            <div className="flex-1 min-h-0">
                <ChatKit control={control} className="h-full w-full min-h-[400px]" />
            </div>
        </div>
    );
};
