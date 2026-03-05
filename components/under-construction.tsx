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
            <div className="relative mb-10">
                <div className="absolute inset-0 bg-[#ff7a59]/5 rounded-full blur-3xl scale-150 animate-pulse" />
                <div className="relative bg-white/[0.03] p-10 rounded-2xl shadow-sm border border-gray-100 group">
                    <Construction className="w-16 h-16 text-[#ff7a59] group-hover:rotate-12 transition-transform duration-500" />
                    <div className="absolute -top-3 -right-3 bg-white/[0.03] border border-gray-100 p-2.5 rounded-lg shadow-md animate-bounce [animation-duration:3s]">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                    </div>
                </div>
            </div>

            {/* Text Content */}
            <div className="max-w-md space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff7a59]/5 border border-[#ff7a59]/10 mb-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff7a59] opacity-40" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff7a59]" />
                    </span>
                    <span className="text-[10px] font-black text-[#ff7a59] uppercase tracking-[0.2em]">En Desarrollo</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight font-display">
                    {title}
                </h1>

                <p className="text-gray-500 leading-relaxed text-sm sm:text-base font-medium">
                    {message}
                </p>
            </div>

            {/* Progress bar decorative */}
            <div className="mt-12 w-64 bg-gray-100 rounded-full h-2 overflow-hidden border border-gray-200/30">
                <div className="h-full bg-[#ff7a59] rounded-full w-[65%] animate-pulse" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-4">65% de progreso completado</p>

            {/* Actions */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-500 bg-white/[0.03] border border-gray-100 hover:bg-gray-50 transition-all duration-300 shadow-sm active:scale-95"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                </button>

                <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest text-white bg-[#ff7a59] hover:bg-[#D96C53] transition-all duration-300 shadow-sm active:scale-95"
                >
                    Inicio
                </button>
            </div>

            {/* Decorative Brand footer */}
            <div className="mt-20 opacity-30 flex items-center gap-3">
                <SicofLogoIcon className="w-6 h-6" />
                <span className="font-bold tracking-tight text-lg text-gray-900 uppercase font-display">Komi</span>
            </div>
        </div>
    )
}
