'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
    Search, X, Users, FolderHeart, ArrowLeft, Eye, ArrowRight,
    AlertTriangle, Shield, Calendar, FileText, User, UserX,
    ChevronRight, Scale, ClipboardList, HeartPulse, CheckCircle,
    Phone, Gavel
} from 'lucide-react'
import { FASES_INFO, type FaseProceso } from '@/lib/case-workflow'

type FilterType = 'TODOS' | 'RECEPCION' | 'VALORACION' | 'MEDIDAS' | 'SEGUIMIENTO' | 'CIERRE' | 'ALTO_RIESGO'

const FILTERS: { key: FilterType; label: string; icon: React.ReactNode }[] = [
    { key: 'TODOS', label: 'Todos', icon: <FolderHeart className="w-3.5 h-3.5" /> },
    { key: 'RECEPCION', label: 'Recepción', icon: <ClipboardList className="w-3.5 h-3.5" /> },
    { key: 'VALORACION', label: 'Valoración', icon: <HeartPulse className="w-3.5 h-3.5" /> },
    { key: 'MEDIDAS', label: 'Medidas', icon: <Shield className="w-3.5 h-3.5" /> },
    { key: 'SEGUIMIENTO', label: 'Seguimiento', icon: <Eye className="w-3.5 h-3.5" /> },
    { key: 'CIERRE', label: 'Cierre', icon: <CheckCircle className="w-3.5 h-3.5" /> },
    { key: 'ALTO_RIESGO', label: 'Alto Riesgo', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
]

const FASE_BADGE: Record<string, { bg: string; text: string }> = {
    RECEPCION: { bg: 'bg-white/5 border border-slate-200', text: 'text-slate-600' },
    VALORACION: { bg: 'bg-amber-500/10 border border-amber-500/20', text: 'text-amber-400' },
    MEDIDAS: { bg: 'bg-orange-50 border border-orange-100', text: 'text-orange-600' },
    SEGUIMIENTO: { bg: 'bg-emerald-500/10 border border-emerald-500/20', text: 'text-emerald-400' },
    CIERRE: { bg: 'bg-white/5 border border-white/10', text: 'text-white/40' },
}

const RIESGO_BADGE: Record<string, { color: string; bg: string; label: string }> = {
    CRITICO: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', label: 'Crítico' },
    ALTO: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', label: 'Alto' },
    MODERADO: { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', label: 'Moderado' },
    BAJO: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Bajo' },
    SIN_RIESGO: { color: 'text-white/40', bg: 'bg-white/5 border-white/10', label: 'Sin evaluar' },
}

function getRiskDot(riesgo: string): string {
    if (riesgo === 'CRITICO' || riesgo === 'ALTO') return 'bg-red-400'
    if (riesgo === 'MODERADO') return 'bg-amber-400'
    if (riesgo === 'BAJO') return 'bg-emerald-400'
    return 'bg-transparent'
}

interface Props {
    expedientes: any[]
    searchQuery: string
}

export default function ExpedientesViewManager({ expedientes, searchQuery }: Props) {
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [activeFilter, setActiveFilter] = useState<FilterType>('TODOS')
    const [localSearch, setLocalSearch] = useState(searchQuery)
    const [mobileShowDetail, setMobileShowDetail] = useState(false)

    const handleSelect = (id: string) => {
        setSelectedId(id)
        setMobileShowDetail(true)
    }

    const handleBack = () => {
        setMobileShowDetail(false)
    }

    const filtered = useMemo(() => {
        let result = expedientes

        if (localSearch.trim()) {
            const q = localSearch.toLowerCase()
            result = result.filter((exp: any) =>
                exp.radicado?.toLowerCase().includes(q) ||
                exp.personas?.some((p: any) =>
                    p.nombres?.toLowerCase().includes(q) ||
                    p.documento?.toLowerCase().includes(q)
                )
            )
        }

        switch (activeFilter) {
            case 'RECEPCION':
            case 'VALORACION':
            case 'MEDIDAS':
            case 'SEGUIMIENTO':
            case 'CIERRE':
                result = result.filter((exp: any) => exp.fase_proceso === activeFilter)
                break
            case 'ALTO_RIESGO':
                result = result.filter((exp: any) => ['CRITICO', 'ALTO'].includes(exp.nivel_riesgo))
                break
        }

        return result
    }, [expedientes, localSearch, activeFilter])

    const selected = useMemo(() => {
        if (!selectedId) return null
        return expedientes.find((e: any) => e.id === selectedId) || null
    }, [selectedId, expedientes])

    const selectedVictima = selected?.personas?.find((p: any) => p.tipo === 'VICTIMA')
    const selectedAgresor = selected?.personas?.find((p: any) => p.tipo === 'AGRESOR')

    return (
        <div className="flex h-[calc(100vh-5rem)] bg-white/[0.03] rounded-xl sm:border border-white/[0.08] shadow-sm overflow-hidden relative">
            {/* ═══════ LEFT PANEL — Expedientes List ═══════ */}
            <div className={`w-full sm:w-[360px] flex-shrink-0 border-r border-white/[0.08] flex flex-col bg-white/[0.02] ${mobileShowDetail ? 'hidden sm:flex' : 'flex'}`}>
                {/* Header */}
                <div className="px-4 pt-4 pb-2">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-bold text-white">Expedientes</h2>
                        <Link
                            href="/dashboard/recepcion"
                            className="text-[10px] font-semibold text-white bg-[#ff7a59] hover:bg-[#ff7a59] px-3 py-1.5 rounded-lg transition-colors"
                        >
                            + Nuevo
                        </Link>
                    </div>

                    {/* Search */}
                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                            type="text"
                            placeholder="Buscar radicado, nombre o documento..."
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm bg-white/[0.03] border border-white/[0.08] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ff7a59]/40 focus:border-[#ff7a59]/40 placeholder:text-white/20"
                        />
                        {localSearch && (
                            <button onClick={() => setLocalSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-white/25 hover:text-white">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Filter Chips */}
                    <div className="flex flex-wrap gap-1.5">
                        {FILTERS.map(f => (
                            <button
                                key={f.key}
                                onClick={() => setActiveFilter(f.key)}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${activeFilter === f.key
                                    ? 'bg-[#ff7a59] text-white shadow-sm'
                                    : 'bg-white/[0.03] text-white/45 border border-white/[0.08] hover:border-[#ff7a59]/30 hover:text-[#ff7a59]'
                                    }`}
                            >
                                {f.icon}
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Count */}
                <div className="px-4 py-2 text-[11px] text-white/25 font-medium border-b border-white/[0.08]">
                    {filtered.length} {filtered.length === 1 ? 'expediente' : 'expedientes'}
                </div>

                {/* Expedientes List */}
                <div className="flex-1 overflow-y-auto">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                            <div className="w-12 h-12 rounded-full bg-white/[0.04] flex items-center justify-center mb-3">
                                <FolderHeart className="w-5 h-5 text-white/12" />
                            </div>
                            <p className="text-sm text-white/45 font-medium">Sin resultados</p>
                            <p className="text-xs text-white/20 mt-1">Prueba con otro filtro o búsqueda</p>
                        </div>
                    ) : (
                        filtered.map((exp: any) => {
                            const victima = exp.personas?.find((p: any) => p.tipo === 'VICTIMA')
                            const isSelected = selectedId === exp.id
                            const fase = exp.fase_proceso || 'RECEPCION'
                            const faseStyle = FASE_BADGE[fase] || FASE_BADGE.RECEPCION
                            const riesgo = exp.nivel_riesgo || 'SIN_RIESGO'
                            const riskDot = getRiskDot(riesgo)

                            return (
                                <button
                                    key={exp.id}
                                    onClick={() => handleSelect(exp.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all border-b border-white/[0.04] ${isSelected
                                        ? 'bg-[#ff7a59]/8 border-l-2 border-l-[#ff7a59]'
                                        : 'hover:bg-white/80 border-l-2 border-l-transparent'
                                        }`}
                                >
                                    {/* Folder Icon */}
                                    <div className="relative flex-shrink-0">
                                        <div className="w-11 h-11 rounded-full bg-white/[0.04] flex items-center justify-center">
                                            <FolderHeart className="w-5 h-5 text-[#ff7a59]/60" />
                                        </div>
                                        {riskDot !== 'bg-transparent' && (
                                            <span className={`absolute -top-0.5 -right-0.5 w-3 h-3 ${riskDot} rounded-full border-2 border-[#111821]`} />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className={`text-sm truncate ${isSelected ? 'font-semibold text-white' : 'font-medium text-white/70'}`}>
                                                {victima?.nombres || 'Sin víctima'}
                                            </p>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${faseStyle.bg} ${faseStyle.text}`}>
                                                {FASES_INFO[fase as FaseProceso]?.nombre?.split(' ')[0] || fase}
                                            </span>
                                        </div>
                                        <p className="text-xs text-white/30 truncate mt-0.5">
                                            {exp.radicado} • {exp.tipologia_violencia || 'General'}
                                        </p>
                                    </div>
                                </button>
                            )
                        })
                    )}
                </div>
            </div>

            {/* ═══════ RIGHT PANEL — Expediente Detail ═══════ */}
            <div className={`flex-1 flex flex-col bg-white/[0.03] overflow-y-auto ${mobileShowDetail ? 'flex' : 'hidden sm:flex'} ${mobileShowDetail ? 'absolute inset-0 z-10 sm:relative sm:inset-auto sm:z-auto' : ''}`}>
                {!selected ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                        <div className="w-20 h-20 rounded-full bg-white/[0.04] flex items-center justify-center mb-4">
                            <FolderHeart className="w-8 h-8 text-white/[0.1]" />
                        </div>
                        <h3 className="text-lg font-semibold text-white/50 mb-1">Selecciona un expediente</h3>
                        <p className="text-sm text-white/25 max-w-xs">
                            Elige un expediente de la lista para ver los detalles del caso, personas involucradas y estado del proceso.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Detail Header */}
                        <div className="border-b border-white/[0.08] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between bg-white/[0.02]">
                            {/* Mobile Back */}
                            <button onClick={handleBack} className="sm:hidden flex items-center gap-1 text-white/50 hover:text-white mr-3 -ml-1 p-1">
                                <ArrowLeft className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                                    <FolderHeart className="w-6 h-6 text-[#ff7a59]" />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-base sm:text-lg font-bold text-white truncate">{selected.radicado}</h2>
                                    <p className="text-xs sm:text-sm text-white/35 truncate">
                                        {selectedVictima?.nombres || 'Sin víctima'}
                                        {(() => {
                                            const fase = selected.fase_proceso || 'RECEPCION'
                                            const s = FASE_BADGE[fase] || FASE_BADGE.RECEPCION
                                            return (
                                                <span className={`ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium ${s.bg} ${s.text}`}>
                                                    {FASES_INFO[fase as FaseProceso]?.nombre || fase}
                                                </span>
                                            )
                                        })()}
                                    </p>
                                </div>
                            </div>
                            <Link
                                href={`/dashboard/casos/${selected.id}`}
                                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#ff7a59] text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-[#ff7a59] transition-colors shadow-sm flex-shrink-0"
                            >
                                <Eye className="w-4 h-4" />
                                <span className="hidden sm:inline">Abrir Caso</span>
                                <span className="sm:hidden">Abrir</span>
                            </Link>
                        </div>

                        {/* Detail Body */}
                        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-4xl">

                                {/* Información del Caso */}
                                <div className="bg-white/[0.02] rounded-xl p-5 border border-white/[0.08]">
                                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-[#ff7a59]" />
                                        Información del Caso
                                    </h3>
                                    <div className="space-y-3">
                                        <DetailRow label="Radicado" value={selected.radicado} highlight />
                                        <DetailRow label="Tipología" value={selected.tipologia_violencia || '—'} />
                                        <DetailRow label="Tipo de violencia" value={selected.tipo_violencia || '—'} />
                                        <DetailRow label="Fecha de radicación" value={
                                            selected.created_at
                                                ? new Date(selected.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })
                                                : '—'
                                        } />
                                        <DetailRow label="Última actualización" value={
                                            selected.updated_at
                                                ? new Date(selected.updated_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })
                                                : '—'
                                        } />
                                    </div>
                                </div>

                                {/* Estado del Proceso */}
                                <div className="bg-white/[0.02] rounded-xl p-5 border border-white/[0.08]">
                                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                        <Scale className="w-4 h-4 text-[#ff7a59]" />
                                        Estado del Proceso
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-[11px] text-white/30 font-medium mb-1">Fase actual</p>
                                            {(() => {
                                                const fase = selected.fase_proceso || 'RECEPCION'
                                                const s = FASE_BADGE[fase] || FASE_BADGE.RECEPCION
                                                return (
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${s.bg} ${s.text}`}>
                                                        {FASES_INFO[fase as FaseProceso]?.nombre || fase}
                                                    </span>
                                                )
                                            })()}
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-white/30 font-medium mb-1">Nivel de riesgo</p>
                                            {(() => {
                                                const r = RIESGO_BADGE[selected.nivel_riesgo || 'SIN_RIESGO'] || RIESGO_BADGE.SIN_RIESGO
                                                return (
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${r.bg} ${r.color}`}>
                                                        <AlertTriangle className="w-3 h-3" />
                                                        {r.label}
                                                    </span>
                                                )
                                            })()}
                                        </div>
                                        <DetailRow label="Modalidad" value={selected.modalidad || '—'} />
                                        <DetailRow label="Contexto" value={selected.contexto || '—'} />
                                    </div>
                                </div>

                                {/* Víctima */}
                                <div className="bg-white/[0.02] rounded-xl p-5 border border-white/[0.08]">
                                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                        <User className="w-4 h-4 text-blue-400" />
                                        Víctima
                                    </h3>
                                    {selectedVictima ? (
                                        <div className="space-y-3">
                                            <DetailRow label="Nombre" value={selectedVictima.nombres} />
                                            <DetailRow label="Documento" value={selectedVictima.documento} />
                                            {selectedVictima.telefono && (
                                                <DetailRow label="Teléfono" value={selectedVictima.telefono} />
                                            )}
                                            <Link
                                                href={`/dashboard/personas/${selectedVictima.id}`}
                                                className="inline-flex items-center gap-1.5 text-xs text-[#ff7a59] hover:text-white font-medium mt-1 transition-colors"
                                            >
                                                Ver perfil completo <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-white/25">Sin víctima registrada</p>
                                    )}
                                </div>

                                {/* Agresor */}
                                <div className="bg-white/[0.02] rounded-xl p-5 border border-white/[0.08]">
                                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                        <UserX className="w-4 h-4 text-red-400" />
                                        Agresor / Denunciado
                                    </h3>
                                    {selectedAgresor ? (
                                        <div className="space-y-3">
                                            <DetailRow label="Nombre" value={selectedAgresor.nombres} />
                                            <DetailRow label="Documento" value={selectedAgresor.documento} />
                                            {selectedAgresor.telefono && (
                                                <DetailRow label="Teléfono" value={selectedAgresor.telefono} />
                                            )}
                                            <Link
                                                href={`/dashboard/personas/${selectedAgresor.id}`}
                                                className="inline-flex items-center gap-1.5 text-xs text-[#ff7a59] hover:text-white font-medium mt-1 transition-colors"
                                            >
                                                Ver perfil completo <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-white/25">Sin agresor registrado</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

function DetailRow({ label, value, highlight = false }: { label: string; value: string | null | undefined; highlight?: boolean }) {
    return (
        <div>
            <p className="text-[11px] text-white/30 font-medium mb-0.5">{label}</p>
            <p className={`text-sm ${highlight ? 'text-[#ff7a59] font-semibold' : 'text-white/70'}`}>
                {value || '—'}
            </p>
        </div>
    )
}
