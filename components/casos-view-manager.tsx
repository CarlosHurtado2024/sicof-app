'use client'

import { useState } from 'react'
import { LayoutGrid, Table as TableIcon, Calendar, MoreVertical, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { FASES_INFO, type FaseProceso } from '@/lib/case-workflow'

interface CasosViewManagerProps {
    expedientes: any[]
    FASE_CONFIG: Record<string, { bg: string; text: string; dot: string }>
    RIESGO_CONFIG: Record<string, { bg: string; text: string; dot: string; label: string }>
}

const RIESGO_COLORS = {
    CRITICO: {
        bg: 'bg-[#D2A292]/20',
        border: 'border-[#D2A292]/30',
        icon: 'text-[#D2A292]',
        badge: 'bg-red-100 text-red-400',
        label: 'EX'
    },
    ALTO: {
        bg: 'bg-[#D2A292]/20',
        border: 'border-[#D2A292]/30',
        icon: 'text-[#D2A292]',
        badge: 'bg-red-100 text-red-400',
        label: 'AL'
    },
    MODERADO: {
        bg: 'bg-[#9CACB9]/20',
        border: 'border-[#9CACB9]/30',
        icon: 'text-[#9CACB9]',
        badge: 'bg-yellow-100 text-yellow-600',
        label: 'MD'
    },
    BAJO: {
        bg: 'bg-[#B4C4B4]/20',
        border: 'border-[#B4C4B4]/30',
        icon: 'text-[#B4C4B4]',
        badge: 'bg-green-100 text-green-600',
        label: 'LV'
    },
    SIN_RIESGO: {
        bg: 'bg-gray-100/20',
        border: 'border-gray-200/30',
        icon: 'text-gray-400',
        badge: 'bg-gray-100 text-gray-400',
        label: 'SR'
    }
}

export default function CasosViewManager({ expedientes, FASE_CONFIG, RIESGO_CONFIG }: CasosViewManagerProps) {
    const [viewMode, setViewMode] = useState<'folders' | 'table'>('folders')

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Controls Bar */}
            <div className="flex flex-wrap justify-between gap-4 items-end mb-2">
                <div className="flex flex-col gap-1">
                    <h2 className="text-white tracking-tight text-lg font-bold uppercase">Expedientes Digitales</h2>
                    <p className="text-white/35 text-[10px] font-medium uppercase tracking-[0.2em]">Gestión en vista isométrica</p>
                </div>

                <div className="flex items-center gap-2">
                    {/* View Switcher */}
                    <div className="flex items-center bg-white/[0.03] border border-white/[0.1] rounded-lg p-1 shadow-sm mr-1">
                        <button
                            onClick={() => setViewMode('folders')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'folders' ? 'bg-[#ff7a59] text-white shadow-md' : 'text-white/35 hover:text-white'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-[#ff7a59] text-white shadow-md' : 'text-white/35 hover:text-white'}`}
                        >
                            <TableIcon className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="hidden lg:flex gap-2">
                        <button className="flex h-10 items-center justify-center gap-x-1.5 rounded-lg bg-white/[0.03] border border-white/[0.1] px-4 shadow-sm hover:bg-gray-50 transition-all font-medium text-[10px] uppercase tracking-widest text-white">
                            <Calendar className="w-3.5 h-3.5 text-[#ff7a59]" />
                            <span>Fecha: Todos</span>
                        </button>
                    </div>
                </div>
            </div>

            {viewMode === 'folders' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {expedientes.map((exp: any) => {
                        const victima = exp.personas?.find((p: any) => p.tipo === 'VICTIMA')
                        const riesgo = exp.nivel_riesgo || 'SIN_RIESGO'
                        const config = RIESGO_COLORS[riesgo as keyof typeof RIESGO_COLORS] || RIESGO_COLORS.SIN_RIESGO

                        return (
                            <Link key={exp.id} href={`/dashboard/casos/${exp.id}`}>
                                <div className="group relative bg-white/[0.03] rounded-[1.5rem] p-4 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] transition-all duration-500 border border-white/[0.08] flex flex-col h-60 cursor-pointer hover:-translate-y-1">
                                    <div className={`absolute top-4 right-4 z-10 flex items-center justify-center size-7 rounded-full ${config.badge} font-bold text-[8px] shadow-sm tracking-tighter`}>
                                        {config.label}
                                    </div>

                                    <div className={`flex-1 w-full ${config.bg} rounded-2xl rounded-tr-[3rem] relative overflow-hidden flex flex-col items-center justify-center border ${config.border} shadow-inner transition-transform duration-700 group-hover:scale-[1.01]`}>
                                        <div className="absolute -top-4 -right-4 size-20 bg-white/20 rounded-full blur-xl" />

                                        <div className="relative mb-3">
                                            <div className="absolute inset-x-0 bottom-0 h-3 bg-black/5 blur-md rounded-full transform translate-y-1 scale-x-75 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            <svg className={`w-12 h-12 ${config.icon} transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-105`} fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-2 12H4V8h16v10z" />
                                            </svg>
                                        </div>

                                        {/* Label Card */}
                                        <div className="bg-white/[0.03] px-3 py-1.5 rounded-xl shadow-[0_5px_15px_-5px_rgba(0,0,0,0.1)] border border-white/[0.08] mt-1 max-w-[85%] text-center transform -rotate-1 group-hover:rotate-0 transition-all duration-500">
                                            <p className="text-white text-[10px] font-semibold truncate uppercase tracking-tight">{victima?.nombres || 'Sin Nombre'}</p>
                                            <p className="text-white/25 text-[8px] font-medium mt-0.5 tracking-widest">{exp.radicado}</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex justify-between items-end px-1">
                                        <div className="space-y-0.5">
                                            <p className="text-[8px] text-white/25 font-medium uppercase tracking-widest">
                                                Act: {new Date(exp.updated_at || exp.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}
                                            </p>
                                            <p className={`text-[9px] ${config.icon} font-semibold uppercase tracking-tighter truncate max-w-[100px]`}>
                                                {exp.tipologia_violencia || 'General'}
                                            </p>
                                        </div>
                                        <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-white/15 group-hover:bg-[#ff7a59] group-hover:text-white transition-all duration-300">
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            ) : (
                <Card className="border border-white/[0.08] shadow-sm rounded-[1.5rem] overflow-hidden bg-white/80 backdrop-blur-xl">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-[11px]">
                                <thead>
                                    <tr className="bg-white/[0.05] border-b border-white/[0.08]">
                                        <th className="text-left px-5 py-3.5 font-semibold text-white/35 text-[9px] uppercase tracking-[0.2em]">Radicado</th>
                                        <th className="text-left px-5 py-3.5 font-semibold text-white/35 text-[9px] uppercase tracking-[0.2em]">Víctima</th>
                                        <th className="text-left px-5 py-3.5 font-semibold text-white/35 text-[9px] uppercase tracking-[0.2em]">Tipo</th>
                                        <th className="text-left px-5 py-3.5 font-semibold text-white/35 text-[9px] uppercase tracking-[0.2em]">Estado</th>
                                        <th className="text-left px-5 py-3.5 font-semibold text-white/35 text-[9px] uppercase tracking-[0.2em]">Riesgo</th>
                                        <th className="text-right px-5 py-3.5 font-semibold text-white/35 text-[9px] uppercase tracking-[0.2em]">Ok</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.05]">
                                    {expedientes.map((exp: any) => {
                                        const victima = exp.personas?.find((p: any) => p.tipo === 'VICTIMA')
                                        const faseKey = exp.fase_proceso as FaseProceso || 'RECEPCION'
                                        const faseConfig = FASE_CONFIG[faseKey] || FASE_CONFIG.RECEPCION
                                        const riesgoConfig = RIESGO_CONFIG[exp.nivel_riesgo] || RIESGO_CONFIG.SIN_RIESGO
                                        return (
                                            <tr key={exp.id} className="hover:bg-white/[0.03] transition-all duration-300 group">
                                                <td className="px-5 py-3">
                                                    <span className="font-mono font-bold text-white text-[9px] bg-white/[0.03] border border-white/[0.08] px-1.5 py-0.5 rounded-md tracking-tight">{exp.radicado}</span>
                                                </td>
                                                <td className="px-5 py-3 font-semibold text-white">{victima?.nombres || '—'}</td>
                                                <td className="px-5 py-3 text-white/50 italic">{exp.tipologia_violencia || '—'}</td>
                                                <td className="px-5 py-3">
                                                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[8px] font-semibold uppercase tracking-widest ${faseConfig.bg} ${faseConfig.text}`}>
                                                        {FASES_INFO[faseKey]?.nombre || faseKey}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[8px] font-semibold uppercase tracking-widest ${riesgoConfig.bg} ${riesgoConfig.text}`}>
                                                        {riesgoConfig.label}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3 text-right">
                                                    <Link href={`/dashboard/casos/${exp.id}`}>
                                                        <ChevronRight className="w-3.5 h-3.5 ml-auto text-white/15 group-hover:text-[#ff7a59]" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Pagination Improvised */}
            <div className="flex items-center justify-center gap-1.5 mt-8 py-4">
                <button className="flex size-9 items-center justify-center text-white/35 hover:text-white bg-white/[0.03] rounded-xl border border-white/[0.08] shadow-sm transition-all active:scale-95">
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="size-9 flex items-center justify-center text-white font-black text-xs rounded-xl bg-[#ff7a59] shadow-md shadow-black/10 transition-all">1</button>
                <button className="size-9 flex items-center justify-center text-white font-black text-xs rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-gray-50 transition-all">2</button>
                <button className="size-9 flex items-center justify-center text-white font-black text-xs rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-gray-50 transition-all">3</button>
                <button className="flex size-9 items-center justify-center text-white/35 hover:text-white bg-white/[0.03] rounded-xl border border-white/[0.08] shadow-sm transition-all active:scale-95">
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
