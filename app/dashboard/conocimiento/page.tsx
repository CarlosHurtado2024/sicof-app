import { Metadata } from "next"
import KnowledgeBaseClient from "@/components/komi-ai/knowledge-base"

export const metadata: Metadata = {
    title: "Base de Conocimiento Legal | SICOF",
    description: "Consulta documentos y lineamientos legales de la Comisaría de Familia con IA.",
}

export default function KnowledgeBasePage() {
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2 text-shadow-sm">
                Base de Conocimiento Legal
            </h1>
            <p className="text-white/60 text-sm mb-6 max-w-2xl">
                Sube leyes, decretos y lineamientos en PDF. Pregúntale a Komi Legal y te responderá basándose estrictamente en estos documentos.
            </p>
            <KnowledgeBaseClient />
        </div>
    )
}
