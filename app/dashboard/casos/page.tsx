
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircle, Eye, ChevronRight, FolderHeart, Search, Filter, ArrowUpDown } from 'lucide-react'
import { FASES_INFO, type FaseProceso } from '@/lib/case-workflow'
import ExpedientesSearch from '@/components/expedientes-search'
import { Suspense } from 'react'

const RIESGO_CONFIG: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    SIN_RIESGO: { bg: 'bg-gray-50 border border-gray-100', text: 'text-gray-400', dot: 'bg-gray-200', label: 'Sin Riesgo' },
    BAJO: { bg: 'bg-emerald-50 border border-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Bajo' },
    MODERADO: { bg: 'bg-amber-50 border border-amber-100', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Moderado' },
    ALTO: { bg: 'bg-[#F28C73]/10 border border-[#F28C73]/20', text: 'text-[#D96C53]', dot: 'bg-[#F28C73]', label: 'Alto' },
    CRITICO: { bg: 'bg-red-50 border border-red-100', text: 'text-red-700', dot: 'bg-red-500', label: 'Crítico' },
}

const FASE_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
    RECEPCION: { bg: 'bg-gray-50 border border-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
    VALORACION: { bg: 'bg-[#F28C73]/5 border border-[#F28C73]/10', text: 'text-[#F28C73]', dot: 'bg-[#F28C73]' },
    MEDIDAS: { bg: 'bg-amber-50 border border-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
    SEGUIMIENTO: { bg: 'bg-emerald-50 border border-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    CIERRE: { bg: 'bg-gray-50', text: 'text-gray-400', dot: 'bg-gray-200' },
}

interface PageProps {
    searchParams: Promise<{ q?: string }>
}

export default async function CasosListPage({ searchParams }: PageProps) {
    const { q } = await searchParams
    const supabase = await createClient()
    const searchQuery = q?.trim() || ''

    // Build the query
    let query = supabase
        .from('expedientes')
        .select(`
            *,
            personas (id, tipo, nombres, documento)
        `)
        .order('created_at', { ascending: false })
        .limit(50)

    const { data: allExpedientes } = await query

    // Filter on the client side after fetching (since we need to search across the `personas` relation)
    let expedientes = allExpedientes || []

    if (searchQuery) {
        const lowerQ = searchQuery.toLowerCase()
        expedientes = expedientes.filter((exp: any) => {
            // Search in radicado
            if (exp.radicado?.toLowerCase().includes(lowerQ)) return true

            // Search in personas (names and documents)
            if (exp.personas?.some((p: any) =>
                p.nombres?.toLowerCase().includes(lowerQ) ||
                p.documento?.toLowerCase().includes(lowerQ)
            )) return true

            return false
        })
    }

    const total = expedientes?.length || 0

    return (
        <div className="space-y-8 max-w-[1400px] mx-auto pb-10">
            {/* Breadcrumb + Header */}
            <div className="animate-fade-in-up">
                <div className="flex items-center space-x-2 text-gray-400 text-[10px] mb-6 font-bold uppercase tracking-widest">
                    <Link href="/dashboard" className="hover:text-[#F28C73] transition-colors">Panel Control</Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-[#F28C73]">Expedientes Vigentes</span>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
                    <div>
                        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-gray-900 font-display flex items-center gap-5">
                            <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                                <FolderHeart className="h-7 w-7 text-[#F28C73]" />
                            </div>
                            Gestión de Expedientes
                        </h1>
                        <p className="text-gray-400 text-sm mt-4 font-medium max-w-xl">Control detallado y seguimiento de la Ruta de Atención Integral (Ley 1257 de 2008)</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard/recepcion">
                            <Button className="bg-[#F28C73] text-white hover:bg-[#D96C53] gap-3 px-8 h-14 rounded-lg font-bold text-xs uppercase tracking-widest shadow-sm transition-all hover:scale-105 active:scale-95">
                                <PlusCircle className="h-5 w-5" />
                                Nueva Radicación
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Search Bar + Stats */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <Suspense fallback={
                    <div className="flex-1 max-w-md h-12 bg-gray-50 rounded-lg animate-pulse" />
                }>
                    <div className="flex-1 max-w-md">
                        <ExpedientesSearch />
                    </div>
                </Suspense>
                <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold tracking-widest uppercase px-5 py-3 bg-gray-50 rounded-lg border border-gray-100 italic">
                    <span className="text-[#F28C73] font-black">{total}</span>
                    {searchQuery ? (
                        <span>resultados para "<span className="text-gray-900">{searchQuery}</span>"</span>
                    ) : (
                        <span>expedientes en curso</span>
                    )}
                </div>
            </div>

            {/* Table Card */}
            <Card className="border border-gray-100 shadow-sm rounded-xl overflow-hidden bg-white">
                <CardContent className="p-0">
                    {/* Desktop Table — hidden on mobile */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="text-left px-8 py-5 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Radicado</th>
                                    <th className="text-left px-8 py-5 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Causa / Víctima</th>
                                    <th className="text-left px-8 py-5 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Tipología</th>
                                    <th className="text-left px-8 py-5 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Estado</th>
                                    <th className="text-left px-8 py-5 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Riesgo</th>
                                    <th className="text-left px-8 py-5 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Apertura</th>
                                    <th className="text-right px-8 py-5 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {(!expedientes || expedientes.length === 0) ? (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-16 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-3">
                                                    {searchQuery ? (
                                                        <Search className="h-6 w-6 text-slate-300" />
                                                    ) : (
                                                        <FolderHeart className="h-6 w-6 text-slate-300" />
                                                    )}
                                                </div>
                                                {searchQuery ? (
                                                    <>
                                                        <p className="text-slate-400 font-medium mb-1">No se encontraron expedientes</p>
                                                        <p className="text-slate-300 text-xs">Intenta con otro nombre o número de documento</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p className="text-slate-400 font-medium mb-1">No hay expedientes registrados</p>
                                                        <p className="text-slate-300 text-xs">Los casos radicados aparecerán aquí</p>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    expedientes.map((exp: any) => {
                                        const victima = exp.personas?.find((p: any) => p.tipo === 'VICTIMA')
                                        const faseKey = exp.fase_proceso as FaseProceso || 'RECEPCION'
                                        const faseConfig = FASE_CONFIG[faseKey] || FASE_CONFIG.RECEPCION
                                        const riesgoConfig = RIESGO_CONFIG[exp.nivel_riesgo] || RIESGO_CONFIG.SIN_RIESGO
                                        return (
                                            <tr key={exp.id} className="hover:bg-gray-50/50 transition-all duration-300 group">
                                                <td className="px-8 py-6">
                                                    <span className="font-mono font-bold text-gray-900 text-[11px] bg-white border border-gray-100 px-3 py-2 rounded-lg shadow-sm tracking-tight">{exp.radicado}</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-lg bg-[#F28C73]/5 border border-[#F28C73]/10 flex items-center justify-center text-xs font-bold text-[#F28C73] flex-shrink-0 shadow-sm group-hover:bg-[#F28C73] group-hover:text-white transition-all duration-500">
                                                            {victima?.nombres ? victima.nombres.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : '??'}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-gray-900 text-sm group-hover:text-[#F28C73] transition-colors truncate">{victima?.nombres || '—'}</p>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{victima?.documento || ''}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="text-[10px] text-gray-500 font-bold bg-gray-50/50 px-2 py-1 rounded-md border border-gray-100 uppercase tracking-tighter">{exp.tipologia_violencia || '—'}</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-[0.1em] ${faseConfig.bg} ${faseConfig.text}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${faseConfig.dot} ${faseKey !== 'CIERRE' ? 'animate-pulse' : ''}`}></span>
                                                        {FASES_INFO[faseKey]?.nombre || faseKey}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-[0.1em] ${riesgoConfig.bg} ${riesgoConfig.text}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${riesgoConfig.dot}`}></span>
                                                        {riesgoConfig.label}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 pr-10">
                                                    <span className="text-[10px] text-gray-400 font-bold bg-gray-50/50 px-2 py-1 rounded-md border border-gray-100">
                                                        {new Date(exp.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <Link href={`/dashboard/casos/${exp.id}`}>
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            className="h-9 gap-2 px-5 bg-white text-gray-600 hover:bg-gray-900 hover:text-white border border-gray-100 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all shadow-sm active:scale-95"
                                                        >
                                                            Detalles
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-slate-100">
                        {(!expedientes || expedientes.length === 0) ? (
                            <div className="px-4 py-12 text-center">
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-3">
                                        {searchQuery ? (
                                            <Search className="h-6 w-6 text-slate-300" />
                                        ) : (
                                            <FolderHeart className="h-6 w-6 text-slate-300" />
                                        )}
                                    </div>
                                    {searchQuery ? (
                                        <>
                                            <p className="text-slate-400 font-medium mb-1">No se encontraron expedientes</p>
                                            <p className="text-slate-300 text-xs">Intenta con otro nombre o documento</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-slate-400 font-medium mb-1">No hay expedientes</p>
                                            <p className="text-slate-300 text-xs">Los casos radicados aparecerán aquí</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            expedientes.map((exp: any) => {
                                const victima = exp.personas?.find((p: any) => p.tipo === 'VICTIMA')
                                const faseKey = exp.fase_proceso as FaseProceso || 'RECEPCION'
                                const faseConfig = FASE_CONFIG[faseKey] || FASE_CONFIG.RECEPCION
                                const riesgoConfig = RIESGO_CONFIG[exp.nivel_riesgo] || RIESGO_CONFIG.SIN_RIESGO
                                return (
                                    <Link key={exp.id} href={`/dashboard/casos/${exp.id}`} className="block">
                                        <div className={`p-4 hover:bg-slate-50 transition-all duration-200 active:bg-slate-100 border-l-[3px] ${riesgoConfig === RIESGO_CONFIG.CRITICO ? 'border-l-red-500' :
                                            riesgoConfig === RIESGO_CONFIG.ALTO ? 'border-l-orange-500' :
                                                riesgoConfig === RIESGO_CONFIG.MODERADO ? 'border-l-amber-500' :
                                                    riesgoConfig === RIESGO_CONFIG.BAJO ? 'border-l-emerald-500' :
                                                        'border-l-transparent'
                                            }`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-mono font-bold text-blue-700 text-xs bg-blue-50 px-2 py-0.5 rounded">{exp.radicado}</span>
                                                <span className="text-[10px] text-slate-400">
                                                    {new Date(exp.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}
                                                </span>
                                            </div>
                                            <p className="font-bold text-slate-800 text-sm truncate">{victima?.nombres || '—'}</p>
                                            {victima?.documento && (
                                                <p className="text-[11px] text-slate-400 font-mono mb-2">Doc: {victima.documento}</p>
                                            )}
                                            <div className="flex items-center gap-2 flex-wrap mt-1">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${faseConfig.bg} ${faseConfig.text}`}>
                                                    <span className={`w-1 h-1 rounded-full ${faseConfig.dot}`}></span>
                                                    {FASES_INFO[faseKey]?.nombre || faseKey}
                                                </span>
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${riesgoConfig.bg} ${riesgoConfig.text}`}>
                                                    <span className={`w-1 h-1 rounded-full ${riesgoConfig.dot}`}></span>
                                                    {riesgoConfig.label}
                                                </span>
                                                {exp.tipologia_violencia && (
                                                    <span className="text-[10px] text-slate-500 font-medium">{exp.tipologia_violencia}</span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
