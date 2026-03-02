'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Construction, Sparkles } from 'lucide-react'
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
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center animate-fade-in-up">
            {/* Icon Area */}
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1B2A4A]/10 to-cyan-500/10 rounded-full blur-3xl scale-150 animate-pulse" />
                <div className="relative bg-white p-7 rounded-3xl shadow-lg border border-slate-100 group">
                    <Construction className="w-14 h-14 text-[#1B2A4A] group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute -top-2 -right-2 bg-gradient-to-br from-[#1B2A4A] to-[#2C4A7C] p-2 rounded-xl shadow-lg shadow-slate-900/20 animate-bounce [animation-duration:2s]">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                </div>
            </div>

            {/* Text Content */}
            <div className="max-w-md space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 mb-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1B2A4A] opacity-40" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1B2A4A]" />
                    </span>
                    <span className="text-xs font-bold text-[#1B2A4A] uppercase tracking-wider">Próximamente</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {title}
                </h1>

                <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
                    {message}
                </p>
            </div>

            {/* Progress bar decorative */}
            <div className="mt-8 w-48 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#1B2A4A] to-cyan-500 rounded-full w-[65%] animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-medium">65% completado</p>

            {/* Actions */}
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 shadow-sm hover:-translate-y-0.5"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                </button>

                <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-[#1B2A4A] hover:bg-[#142035] transition-all duration-300 shadow-lg shadow-slate-900/15 hover:-translate-y-0.5"
                >
                    Ir al Panel Principal
                </button>
            </div>

            {/* Decorative Brand footer */}
            <div className="mt-16 opacity-20 flex items-center gap-2 grayscale">
                <SicofLogoIcon className="w-6 h-6" />
                <span className="font-bold tracking-tighter text-lg">Komi</span>
            </div>
        </div>
    )
}
