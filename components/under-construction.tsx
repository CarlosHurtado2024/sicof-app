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
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-full blur-3xl scale-150 animate-pulse" />
                <div className="relative bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 group">
                    <Construction className="w-16 h-16 text-blue-600 group-hover:rotate-12 transition-transform duration-500" />
                    <div className="absolute -top-3 -right-3 bg-white border border-slate-100 p-2.5 rounded-2xl shadow-xl animate-bounce [animation-duration:3s]">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                    </div>
                </div>
            </div>

            {/* Text Content */}
            <div className="max-w-md space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-40" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
                    </span>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">En Desarrollo</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase">
                    {title}
                </h1>

                <p className="text-slate-500 leading-relaxed text-sm sm:text-base font-medium">
                    {message}
                </p>
            </div>

            {/* Progress bar decorative */}
            <div className="mt-10 w-64 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
                <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full w-[65%] animate-pulse" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">65% de progreso completado</p>

            {/* Actions */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 shadow-lg shadow-slate-200/50 active:scale-95"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                </button>

                <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-xl shadow-blue-500/20 active:scale-95"
                >
                    Inicio
                </button>
            </div>

            {/* Decorative Brand footer */}
            <div className="mt-20 opacity-30 flex items-center gap-3">
                <SicofLogoIcon className="w-7 h-7" />
                <span className="font-black tracking-tight text-xl text-slate-900 uppercase">Komi</span>
            </div>
        </div>
    )
}
