'use client'

import { useRouter } from 'next/navigation'
import { Hammer, ArrowLeft, Construction, Timer } from 'lucide-react'
import { SicofLogoIcon } from './sicof-logo'

interface UnderConstructionProps {
    title?: string
    message?: string
}

export default function UnderConstruction({
    title = "Funcionalidad en Construcción",
    message = "Estamos trabajando para brindarle la mejor experiencia en este módulo. Esta sección estará disponible muy pronto."
}: UnderConstructionProps) {
    const router = useRouter()

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center animate-in fade-in zoom-in duration-500">
            {/* Icon Area */}
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-slate-300 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <div className="relative bg-white p-6 rounded-3xl shadow-xl border border-slate-200">
                    <Construction className="w-16 h-16 text-[#1B2A4A]" />
                    <div className="absolute -top-2 -right-2 bg-amber-400 p-1.5 rounded-lg shadow-lg rotate-12">
                        <Timer className="w-5 h-5 text-white" />
                    </div>
                </div>
            </div>

            {/* Text Content */}
            <div className="max-w-md space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 mb-2">
                    <Hammer className="w-4 h-4 text-[#1B2A4A]" />
                    <span className="text-xs font-bold text-[#1B2A4A] uppercase tracking-wider">Próximamente</span>
                </div>

                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {title}
                </h1>

                <p className="text-slate-500 leading-relaxed font-medium">
                    {message}
                </p>
            </div>

            {/* Actions */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Regresar a la vista anterior
                </button>

                <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-[#1B2A4A] hover:bg-[#142035] transition-all duration-200 shadow-lg shadow-slate-300"
                >
                    Ir al Panel Principal
                </button>
            </div>

            {/* Decorative Brand footer */}
            <div className="mt-16 opacity-30 flex items-center gap-2 grayscale">
                <SicofLogoIcon className="w-6 h-6" />
                <span className="font-bold tracking-tighter text-lg">Komi</span>
            </div>
        </div>
    )
}
