import {
    Settings,
    Cog,
    Activity,
    Zap,
    Wind,
    Paintbrush,
    Gauge,
    Wrench,
    FileText
} from 'lucide-react';

export const LIBRARY_CATEGORIES = [
    { id: 'all', label: 'Todos', icon: FileText },
    { id: 'mecanica', label: 'Mecânica', icon: Cog },
    { id: 'suspensao', label: 'Suspensão', icon: Activity },
    { id: 'cambio', label: 'Câmbio', icon: Settings },
    { id: 'eletrica', label: 'Elétrica', icon: Zap },
    { id: 'performance', label: 'Performance', icon: Gauge },
    { id: 'climatizacao', label: 'Ar Condicionado', icon: Wind },
    { id: 'estetica', label: 'Estética & Pintura', icon: Paintbrush },
    { id: 'manutencao', label: 'Manutenção Preventiva', icon: Wrench },
] as const;

export type CategoryId = (typeof LIBRARY_CATEGORIES)[number]['id'];
