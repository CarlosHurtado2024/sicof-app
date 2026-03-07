import { BotMessageSquare } from 'lucide-react'
import KomiAIChat from '@/components/komi-ai/chat'

export const metadata = {
    title: 'Komi AI — Asistente Inteligente',
    description: 'Consulta datos del sistema en tiempo real usando lenguaje natural.',
}

export default function KomiAIPage() {
    return (
        <div className="max-w-[1200px] mx-auto h-screen sm:h-auto overflow-hidden">
            <KomiAIChat />
        </div>
    )
}
