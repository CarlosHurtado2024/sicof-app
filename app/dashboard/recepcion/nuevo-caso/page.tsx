
import { TriageForm } from '@/components/module-recepcion/triage-form'
import { ChevronRight, ClipboardList } from 'lucide-react'

export default function NuevoCasoPage() {
    return (
        <div className="space-y-6 max-w-[1400px] mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-slate-400 text-sm font-medium">
                <span>Inicio</span>
                <ChevronRight className="h-3.5 w-3.5" />
                <span>Recepción</span>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-[#7C3AED]">Nuevo Caso</span>
            </div>

            {/* Header */}
            <div className="flex items-start gap-4">
                <div className="p-3 bg-violet-50 rounded-xl flex-shrink-0">
                    <ClipboardList className="h-6 w-6 text-[#7C3AED]" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">Registro de Caso y Triaje</h1>
                    <p className="text-slate-500 text-sm mt-1">Módulo 1 — Recepción y Caracterización de Víctimas</p>
                </div>
            </div>

            {/* Separator */}
            <div className="h-px bg-slate-100"></div>

            {/* Form */}
            <div className="flex justify-center">
                <TriageForm />
            </div>
        </div>
    )
}
