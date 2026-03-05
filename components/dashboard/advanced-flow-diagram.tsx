
'use client'

import React from 'react'
import {
    Clock,
    Info,
    TrendingUp
} from 'lucide-react'

interface FlowData {
    recepcion: {
        sexual: number
        fisica: number
        psicologica: number
        economica: number
        menores: number
    }
    valoracion: {
        psicologia: number
        social: number
    }
    cierre: {
        fiscalia: number
        medidas: number
        conciliacion: number
        archivo: number
    }
}

export default function AdvancedFlowDiagram({ data }: { data: FlowData }) {
    return (
        <div className="w-full rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4" style={{ color: '#ff7a59' }} />
                        <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#ff7a59' }}>Análisis Operativo</span>
                    </div>
                    <h3 className="text-base font-bold text-white">
                        Flujo Procesal de Casos
                    </h3>
                    <p className="text-xs font-medium mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Distribución de expedientes por fase del proceso.</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <LegendItem color="bg-red-400" label="Crítico" />
                    <LegendItem color="bg-amber-400" label="En Proceso" />
                    <LegendItem color="bg-emerald-400" label="Resuelto" />
                </div>
            </div>

            {/* Diagram Container - Scrollable on mobile */}
            <div className="overflow-x-auto px-5 py-6 scrollbar-hide">
                <div className="min-w-[850px] lg:min-w-full relative h-[480px] flex items-stretch">

                    {/* STAGE 1: RECEPCIÓN */}
                    <div className="w-[170px] flex flex-col z-10">
                        <StageTitle label="Recepción" />
                        <div className="flex-1 flex flex-col gap-3 justify-between py-1">
                            <FlowBlock count={data.recepcion.sexual} label="Abuso Sexual" isCritical dot="bg-red-400" />
                            <FlowBlock count={data.recepcion.fisica} label="V. Física" dot="bg-orange-300" />
                            <FlowBlock count={data.recepcion.psicologica} label="V. Psicológica" dot="bg-amber-300" />
                            <FlowBlock count={data.recepcion.economica} label="V. Económica" dot="bg-[#2B463C]/20" />
                            <FlowBlock count={data.recepcion.menores} label="Otros / Vulnerables" dot="bg-[#2B463C]/15" />
                        </div>
                    </div>

                    {/* SVG CONNECTIONS 1-2 */}
                    <div className="flex-1 relative">
                        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                            <path d="M 0 45 C 60 45, 60 135, 150 135" fill="none" stroke="url(#g1)" strokeWidth="10" className="opacity-25" />
                            <path d="M 0 135 C 60 135, 60 155, 150 155" fill="none" stroke="url(#g2)" strokeWidth="14" className="opacity-20" />
                            <path d="M 0 230 C 60 230, 60 195, 150 195" fill="none" stroke="url(#g3)" strokeWidth="16" className="opacity-20" />
                            <path d="M 0 325 C 60 325, 60 270, 150 270" fill="none" stroke="url(#g4)" strokeWidth="10" className="opacity-18" />
                            <path d="M 0 415 C 60 415, 60 310, 150 310" fill="none" stroke="url(#g5)" strokeWidth="12" className="opacity-15" />
                            <defs>
                                <linearGradient id="g1" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stopColor="#ef4444" /><stop offset="100%" stopColor="#f59e0b" /></linearGradient>
                                <linearGradient id="g2" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stopColor="#fb923c" /><stop offset="100%" stopColor="#f59e0b" /></linearGradient>
                                <linearGradient id="g3" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stopColor="#f59e0b" /><stop offset="100%" stopColor="#fbbf24" /></linearGradient>
                                <linearGradient id="g4" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stopColor="#94a3b8" /><stop offset="100%" stopColor="#94a3b8" /></linearGradient>
                                <linearGradient id="g5" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stopColor="#cbd5e1" /><stop offset="100%" stopColor="#94a3b8" /></linearGradient>
                            </defs>
                        </svg>
                        {/* Bottleneck indicator */}
                        <div className="absolute top-[36%] left-1/2 -translate-x-1/2 p-1.5 rounded-lg shadow-sm animate-bounce" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
                            <Clock size={14} className="text-red-400" />
                        </div>
                    </div>

                    {/* STAGE 2: VALORACIÓN */}
                    <div className="w-[170px] flex flex-col z-10">
                        <StageTitle label="Valoración Técnica" />
                        <div className="flex-1 flex flex-col gap-8 justify-center py-1">
                            <BigBlock count={data.valoracion.psicologia} label="Psicología" sub="Promedio: 5 días" status="Saturado" isCritical />
                            <BigBlock count={data.valoracion.social} label="Trabajo Social" sub="Promedio: 2 días" />
                        </div>
                    </div>

                    {/* SVG CONNECTIONS 2-3 */}
                    <div className="flex-1 relative">
                        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                            <path d="M 0 140 C 60 140, 60 80, 150 80" fill="none" stroke="#ef4444" strokeWidth="12" className="opacity-25" />
                            <path d="M 0 210 C 60 210, 60 215, 150 215" fill="none" stroke="#f59e0b" strokeWidth="22" className="opacity-20" />
                            <path d="M 0 340 C 60 340, 60 330, 150 330" fill="none" stroke="#10b981" strokeWidth="14" className="opacity-20" />
                            <path d="M 0 360 C 60 360, 60 430, 150 430" fill="none" stroke="#cbd5e1" strokeWidth="8" className="opacity-20" />
                        </svg>
                    </div>

                    {/* STAGE 3: CIERRE */}
                    <div className="w-[185px] flex flex-col z-10">
                        <StageTitle label="Cierre / Resultados" />
                        <div className="flex-1 flex flex-col gap-5 justify-between py-1">
                            <FinalBlock count={data.cierre.fiscalia} label="Fiscalía (Penal)" dot="bg-red-400" />
                            <FinalBlock count={data.cierre.medidas} label="Medidas de Protección" dot="bg-emerald-400" />
                            <FinalBlock count={data.cierre.conciliacion} label="Conciliación" dot="bg-amber-300" />
                            <FinalBlock count={data.cierre.archivo} label="Incumplimiento / Archivo" dot="bg-[#2B463C]/15" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Footer */}
            <div className="mx-5 mb-5 flex items-center gap-3 p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="p-2 rounded-lg flex-shrink-0" style={{ background: 'rgba(255,122,89,0.1)', color: '#ff7a59' }}>
                    <Info size={16} />
                </div>
                <p className="text-xs font-medium leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    El grosor de las líneas representa el volumen de casos. Los nodos en <span className="font-semibold" style={{ color: '#ff7a59' }}>coral</span> indican procesos que exceden el tiempo máximo legal (&gt; 48h).
                </p>
            </div>
        </div>
    )
}

function StageTitle({ label }: { label: string }) {
    return <h4 className="text-[10px] font-semibold uppercase tracking-widest text-center mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</h4>
}

function FlowBlock({ count, label, isCritical = false, dot }: { count: number; label: string; isCritical?: boolean; dot: string }) {
    return (
        <div className={`w-40 px-4 py-3 rounded-xl flex flex-col items-center justify-center relative transition-all hover:shadow-md ${isCritical ? 'border-red-500/30' : ''}`}
            style={{ background: isCritical ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isCritical ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.08)'}` }}>
            <span className={`text-xl font-bold ${isCritical ? 'text-red-400' : 'text-white'}`}>{count}</span>
            <span className={`text-[10px] font-medium text-center mt-0.5 leading-tight`} style={{ color: isCritical ? 'rgba(248,113,113,0.8)' : 'rgba(255,255,255,0.4)' }}>{label}</span>
            <div className={`absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full shadow-sm ${dot}`} style={{ border: '2px solid #111821' }} />
        </div>
    )
}

function BigBlock({ count, label, sub, status, isCritical = false }: { count: number; label: string; sub: string; status?: string; isCritical?: boolean }) {
    return (
        <div className="w-42 px-4 py-8 rounded-xl flex flex-col items-center justify-center relative transition-all"
            style={{ background: isCritical ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isCritical ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.08)'}` }}>
            {status && (
                <span className={`absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider shadow-sm`}
                    style={{ background: '#111821', border: `1px solid ${isCritical ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.1)'}`, color: isCritical ? '#f87171' : 'rgba(255,255,255,0.4)' }}>
                    {status}
                </span>
            )}
            <div className={`absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full shadow-sm ${isCritical ? 'bg-red-300' : 'bg-white/15'}`} style={{ border: '2px solid #111821' }} />
            <span className={`text-2xl font-bold ${isCritical ? 'text-red-400' : 'text-white'}`}>{count}</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</span>
            <div className="mt-2 text-[10px] font-medium px-2.5 py-1 rounded-md" style={{ color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>{sub}</div>
            <div className={`absolute -right-1.5 top-1/3 w-3 h-3 rounded-full shadow-sm ${isCritical ? 'bg-red-400' : 'bg-emerald-300'}`} style={{ border: '2px solid #111821' }} />
            <div className={`absolute -right-1.5 top-2/3 w-3 h-3 rounded-full shadow-sm ${isCritical ? 'bg-amber-300' : 'bg-emerald-200'}`} style={{ border: '2px solid #111821' }} />
        </div>
    )
}

function FinalBlock({ count, label, dot }: { count: number; label: string; dot: string }) {
    return (
        <div className="w-44 px-4 py-4 rounded-xl flex flex-col items-center justify-center relative transition-all hover:shadow-md"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className={`absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full shadow-sm ${dot}`} style={{ border: '2px solid #111821' }} />
            <span className="text-xl font-bold text-white">{count}</span>
            <span className="text-[10px] font-medium text-center mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
        </div>
    )
}

function LegendItem({ color, label }: { color: string; label: string }) {
    return (
        <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${color}`} />
            <span className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</span>
        </div>
    )
}
