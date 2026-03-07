
import { TriageForm } from '@/components/module-recepcion/triage-form'
import { ChevronRight, ClipboardList } from 'lucide-react'

export default function NuevoCasoPage() {
    return (
        <div className="space-y-6 max-w-[1400px] mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-white/35 text-sm font-medium">
                <span>Inicio</span>
                <ChevronRight className="h-3.5 w-3.5" />
                <span>Recepción</span>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-[#ff7a59]">Nuevo Caso</span>
            </div>

            {/* Header */}
            <div className="flex items-start gap-4">
                <div className="p-3 bg-[#ff7a59]/10 border border-[#ff7a59]/20 rounded-xl flex-shrink-0">
                    <ClipboardList className="h-6 w-6 text-[#ff7a59]" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Registro de Caso y Triaje</h1>
                    <p className="text-white/40 text-sm mt-1">Módulo 1 — Recepción y Caracterización de Víctimas</p>
                </div>
            </div>

            {/* Separator */}
            <div className="h-px bg-white/[0.08]"></div>

            {/* Form */}
            <div className="flex justify-center">
                <TriageForm />
            </div>
        </div>
    )
}
