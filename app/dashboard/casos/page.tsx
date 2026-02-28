
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircle, Eye, ChevronRight, FolderHeart, Search, Filter, ArrowUpDown } from 'lucide-react'
import { FASES_INFO, type FaseProceso } from '@/lib/case-workflow'
import ExpedientesSearch from '@/components/expedientes-search'
import { Suspense } from 'react'

const RIESGO_CONFIG: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    SIN_RIESGO: { bg: 'bg-slate-50', text: 'text-slate-600', dot: 'bg-slate-400', label: 'Sin Riesgo' },
    BAJO: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Bajo' },
    MODERADO: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Moderado' },
    ALTO: { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500', label: 'Alto' },
    CRITICO: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500', label: 'Crítico' },
}

const FASE_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
    RECEPCION: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
    VALORACION: { bg: 'bg-violet-50', text: 'text-violet-700', dot: 'bg-violet-500' },
    MEDIDAS: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
    SEGUIMIENTO: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    CIERRE: { bg: 'bg-slate-50', text: 'text-slate-600', dot: 'bg-slate-400' },
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
        <div className="space-y-6 max-w-[1400px] mx-auto">
            {/* Breadcrumb + Header */}
            <div>
                <div className="flex items-center space-x-2 text-slate-400 text-sm mb-3 font-medium">
                    <span>Inicio</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span className="text-[#7C3AED]">Expedientes</span>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-3">
                            <div className="p-2 bg-violet-50 rounded-xl">
                                <FolderHeart className="h-5 w-5 text-[#7C3AED]" />
                            </div>
                            Expedientes
                        </h1>
                        <p className="text-slate-500 text-sm mt-1 ml-12">Gestión de casos — Ruta de Atención Integral</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard/recepcion/nuevo-caso">
                            <Button className="bg-[#7C3AED] hover:bg-[#6D28D9] gap-2 rounded-xl font-semibold text-sm shadow-lg shadow-violet-500/20 transition-all hover:-translate-y-0.5 px-5 py-2.5">
                                <PlusCircle size={16} />
                                Radicar Nuevo Caso
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Search Bar + Stats */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Suspense fallback={
                    <div className="flex-1 max-w-md h-10 bg-slate-100 rounded-xl animate-pulse" />
                }>
                    <ExpedientesSearch />
                </Suspense>
                <div className="flex items-center gap-2 text-sm text-slate-500 flex-shrink-0">
                    <span className="font-bold text-slate-800">{total}</span>
                    {searchQuery ? (
                        <span>resultados para "<span className="font-medium text-violet-600">{searchQuery}</span>"</span>
                    ) : (
                        <span>expedientes encontrados</span>
                    )}
                </div>
            </div>

            {/* Table Card */}
            <Card className="border border-slate-100 shadow-sm rounded-xl overflow-hidden">
                <CardContent className="p-0">
                    {/* Desktop Table — hidden on mobile */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-100">
                                    <th className="text-left px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">Radicado</th>
                                    <th className="text-left px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">Víctima</th>
                                    <th className="text-left px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">Tipología</th>
                                    <th className="text-left px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">Fase</th>
                                    <th className="text-left px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">Riesgo</th>
                                    <th className="text-left px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">Fecha</th>
                                    <th className="text-right px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {(!expedientes || expedientes.length === 0) ? (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-16 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
                                                    {searchQuery ? (
                                                        <Search className="h-6 w-6 text-slate-300" />
                                                    ) : (
                                                        <FolderHeart className="h-6 w-6 text-slate-300" />
                                                    )}
                                                </div>
                                                {searchQuery ? (
                                                    <>
                                                        <p className="text-slate-500 font-medium mb-1">No se encontraron expedientes</p>
                                                        <p className="text-slate-400 text-xs">Intenta con otro nombre o número de documento</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p className="text-slate-500 font-medium mb-1">No hay expedientes registrados</p>
                                                        <p className="text-slate-400 text-xs">Los casos radicados aparecerán aquí</p>
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
                                            <tr key={exp.id} className="hover:bg-violet-50/30 transition-colors group">
                                                <td className="px-5 py-4">
                                                    <span className="font-mono font-bold text-[#7C3AED] text-xs bg-violet-50 px-2.5 py-1 rounded-md">{exp.radicado}</span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 flex-shrink-0">
                                                            {victima?.nombres ? victima.nombres.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : '??'}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-semibold text-slate-800 text-sm truncate">{victima?.nombres || '—'}</p>
                                                            <p className="text-[11px] text-slate-400 font-mono">{victima?.documento || ''}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="text-xs text-slate-600 font-medium">{exp.tipologia_violencia || '—'}</span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold ${faseConfig.bg} ${faseConfig.text}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${faseConfig.dot}`}></span>
                                                        {FASES_INFO[faseKey]?.nombre || faseKey}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold ${riesgoConfig.bg} ${riesgoConfig.text}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${riesgoConfig.dot}`}></span>
                                                        {riesgoConfig.label}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="text-xs text-slate-500 font-medium">
                                                        {new Date(exp.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    <Link href={`/dashboard/casos/${exp.id}`}>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="gap-1.5 text-[#7C3AED] hover:text-[#6D28D9] hover:bg-violet-50 rounded-lg font-semibold text-xs"
                                                        >
                                                            <Eye size={14} />
                                                            Ver
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
                                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
                                        {searchQuery ? (
                                            <Search className="h-6 w-6 text-slate-300" />
                                        ) : (
                                            <FolderHeart className="h-6 w-6 text-slate-300" />
                                        )}
                                    </div>
                                    {searchQuery ? (
                                        <>
                                            <p className="text-slate-500 font-medium mb-1">No se encontraron expedientes</p>
                                            <p className="text-slate-400 text-xs">Intenta con otro nombre o documento</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-slate-500 font-medium mb-1">No hay expedientes</p>
                                            <p className="text-slate-400 text-xs">Los casos radicados aparecerán aquí</p>
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
                                        <div className="p-4 hover:bg-violet-50/30 transition-colors active:bg-violet-50">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-mono font-bold text-[#7C3AED] text-xs bg-violet-50 px-2 py-0.5 rounded">{exp.radicado}</span>
                                                <span className="text-[10px] text-slate-400">
                                                    {new Date(exp.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}
                                                </span>
                                            </div>
                                            <p className="font-semibold text-slate-800 text-sm truncate">{victima?.nombres || '—'}</p>
                                            {victima?.documento && (
                                                <p className="text-[11px] text-slate-400 font-mono mb-2">Doc: {victima.documento}</p>
                                            )}
                                            <div className="flex items-center gap-2 flex-wrap mt-1">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${faseConfig.bg} ${faseConfig.text}`}>
                                                    <span className={`w-1 h-1 rounded-full ${faseConfig.dot}`}></span>
                                                    {FASES_INFO[faseKey]?.nombre || faseKey}
                                                </span>
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${riesgoConfig.bg} ${riesgoConfig.text}`}>
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
