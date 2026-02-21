import { useAuth } from '../hooks/AuthContext';
import { BackgroundBeams } from '../components/ui/BackgroundBeams';
import { SparklesCore } from '../components/ui/Sparkles';
import { BentoGrid, BentoGridItem } from '../components/ui/BentoGrid';
import { TextGenerateEffect } from '../components/ui/TextGenerateEffect';
import { Meteors } from '../components/ui/Meteors';
import {
    MessageSquare,
    Car,
    BookOpen,
    Store
} from 'lucide-react';

export const DashboardPage = () => {
    const { userProfile } = useAuth();

    const items = [
        {
            title: "Chat IA CivicAI",
            description: "Tire dúvidas técnicas sobre seu Honda Civic em segundos.",
            header: (
                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-blue-500/20 to-emerald-500/20 border border-white/[0.1] items-center justify-center overflow-hidden relative">
                    <Meteors number={10} />
                    <MessageSquare className="w-12 h-12 text-blue-400 opacity-50" />
                </div>
            ),
            icon: <MessageSquare className="h-4 w-4 text-neutral-500" />,
            className: "md:col-span-2",
            href: "/chat",
        },
        {
            title: "Meu Veículo",
            description: "Gerencie as informações do seu carro.",
            header: (
                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/[0.1] items-center justify-center">
                    <Car className="w-12 h-12 text-purple-400 opacity-50" />
                </div>
            ),
            icon: <Car className="h-4 w-4 text-neutral-500" />,
            className: "md:col-span-1",
            href: "/vehicle",
        },
        {
            title: "Biblioteca Técnica",
            description: "Acesse manuais e guias especializados.",
            header: (
                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/[0.1] items-center justify-center">
                    <BookOpen className="w-12 h-12 text-zinc-400 opacity-50" />
                </div>
            ),
            icon: <BookOpen className="h-4 w-4 text-neutral-500" />,
            className: "md:col-span-1",
            href: "/library",
        },
        {
            title: "Vendedores Autorizados",
            description: "Encontre peças e serviços de confiança.",
            header: (
                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-white/[0.1] items-center justify-center">
                    <Store className="w-12 h-12 text-orange-400 opacity-50" />
                </div>
            ),
            icon: <Store className="h-4 w-4 text-neutral-500" />,
            className: "md:col-span-2",
            href: "/sellers",
        },
    ];

    return (
        <div className="relative min-h-full w-full bg-zinc-950 flex flex-col items-center justify-start p-4 md:p-8 overflow-hidden">
            <div className="w-full absolute inset-0 h-screen">
                <SparklesCore
                    id="tsparticlesfullpage"
                    background="transparent"
                    minSize={0.6}
                    maxSize={1.4}
                    particleDensity={100}
                    className="w-full h-full"
                    particleColor="#FFFFFF"
                />
            </div>

            <div className="relative z-10 w-full max-w-7xl">
                <div className="mb-12 text-left">
                    <TextGenerateEffect words={`Bem-vindo ao CivicAI, ${userProfile?.displayName || 'Usuário'}`} />
                    <p className="text-zinc-400 mt-2 max-w-2xl">
                        Sua central inteligente para manutenção, suporte e performance do seu Honda Civic.
                    </p>
                </div>

                <BentoGrid className="max-w-7xl mx-auto">
                    {items.map((item, i) => (
                        <BentoGridItem
                            key={i}
                            title={item.title}
                            description={item.description}
                            header={item.header}
                            icon={item.icon}
                            className={item.className}
                            href={item.href}
                        />
                    ))}
                </BentoGrid>
            </div>

            <BackgroundBeams className="opacity-40" />
        </div>
    );
};
