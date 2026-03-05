"use client"

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
    Search, User, UserX, Phone, MapPin, Calendar, FileText,
    Shield, AlertTriangle, ChevronRight, ChevronLeft, ArrowRight, Baby,
    Users, Filter, X, Eye, ArrowLeft
} from 'lucide-react'

type Persona = {
    id: string
    nombres: string
    documento: string
    tipo: string
    telefono: string | null
    genero: string | null
    datos_demograficos: any
    expediente: {
        id: string
        radicado: string
        nivel_riesgo?: string
        fase_proceso?: string
    } | null
}

type FilterType = 'TODOS' | 'VICTIMA' | 'AGRESOR' | 'MENOR' | 'ALTO_RIESGO' | 'CON_MEDIDAS'

const FILTERS: { key: FilterType; label: string; icon: React.ReactNode }[] = [
    { key: 'TODOS', label: 'Todos', icon: <Users className="w-3.5 h-3.5" /> },
    { key: 'VICTIMA', label: 'Víctimas', icon: <User className="w-3.5 h-3.5" /> },
    { key: 'AGRESOR', label: 'Agresores', icon: <UserX className="w-3.5 h-3.5" /> },
    { key: 'MENOR', label: 'Menores', icon: <Baby className="w-3.5 h-3.5" /> },
    { key: 'ALTO_RIESGO', label: 'Alto Riesgo', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    { key: 'CON_MEDIDAS', label: 'Con Medidas', icon: <Shield className="w-3.5 h-3.5" /> },
]

function getInitials(name: string): string {
    return name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '??'
}

function isMinor(p: Persona): boolean {
    const birthDate = p.datos_demograficos?.fecha_nacimiento
    if (!birthDate) return false
    const age = Math.floor((Date.now() - new Date(birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    return age < 18
}

function getRiskLevel(p: Persona): string {
    return p.expediente?.nivel_riesgo || 'SIN_RIESGO'
}

interface Props {
    personas: Persona[]
    searchQuery: string
}

export default function PersonasViewManager({ personas, searchQuery }: Props) {
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [activeFilter, setActiveFilter] = useState<FilterType>('TODOS')
    const [localSearch, setLocalSearch] = useState(searchQuery)
    const [mobileShowDetail, setMobileShowDetail] = useState(false)

    const handleSelectPerson = (id: string) => {
        setSelectedId(id)
        setMobileShowDetail(true)
    }

    const handleBackToList = () => {
        setMobileShowDetail(false)
    }

    const filtered = useMemo(() => {
        let result = personas

        // Text search
        if (localSearch.trim()) {
            const q = localSearch.toLowerCase()
            result = result.filter(p =>
                p.nombres?.toLowerCase().includes(q) ||
                p.documento?.toLowerCase().includes(q)
            )
        }

        // Category filter
        switch (activeFilter) {
            case 'VICTIMA':
                result = result.filter(p => p.tipo === 'VICTIMA')
                break
            case 'AGRESOR':
                result = result.filter(p => p.tipo === 'AGRESOR')
                break
            case 'MENOR':
                result = result.filter(p => isMinor(p))
                break
            case 'ALTO_RIESGO':
                result = result.filter(p => ['CRITICO', 'ALTO'].includes(getRiskLevel(p)))
                break
            case 'CON_MEDIDAS':
                result = result.filter(p => p.expediente?.fase_proceso && p.expediente.fase_proceso !== 'ARCHIVADO')
                break
        }

        return result
    }, [personas, localSearch, activeFilter])

    const selected = useMemo(() => {
        if (!selectedId) return null
        return personas.find(p => p.id === selectedId) || null
    }, [selectedId, personas])

    const riskConfig: Record<string, { color: string; bg: string; label: string }> = {
        CRITICO: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', label: 'Crítico' },
        ALTO: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', label: 'Alto' },
        MODERADO: { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', label: 'Moderado' },
        BAJO: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Bajo' },
        SIN_RIESGO: { color: 'text-white/40', bg: 'bg-white/5 border-white/10', label: 'Sin evaluar' },
    }

    return (
        <div className="flex h-[calc(100vh-5rem)] sm:h-[calc(100vh-5rem)] rounded-xl sm:border border-white/[0.08] bg-white/[0.02] overflow-hidden relative">
            {/* ════════ LEFT PANEL — Contact List ════════ */}
            <div className={`w-full sm:w-[340px] flex-shrink-0 border-r border-white/[0.06] flex flex-col bg-white/[0.02] ${mobileShowDetail ? 'hidden sm:flex' : 'flex'}`}>
                {/* Header */}
                <div className="px-4 pt-4 pb-2">
                    <h2 className="text-lg font-bold text-white mb-3">Personas</h2>

                    {/* Search */}
                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o documento..."
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm bg-white/[0.05] border border-white/[0.08] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ff7a59]/40 focus:border-[#ff7a59]/40 placeholder:text-white/25 text-white"
                        />
                        {localSearch && (
                            <button
                                onClick={() => setLocalSearch('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-white/30 hover:text-white rounded-full"
                            >
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
                                    : 'bg-white/[0.04] text-white/45 border border-white/[0.08] hover:border-[#ff7a59]/30 hover:text-[#ff7a59]'
                                    }`}
                            >
                                {f.icon}
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Count */}
                <div className="px-4 py-2 text-[11px] text-white/25 font-medium border-b border-white/[0.06]">
                    {filtered.length} {filtered.length === 1 ? 'persona' : 'personas'}
                </div>

                {/* Contact List */}
                <div className="flex-1 overflow-y-auto">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                            <div className="w-12 h-12 rounded-full bg-white/[0.05] flex items-center justify-center mb-3">
                                <Search className="w-5 h-5 text-white/15" />
                            </div>
                            <p className="text-sm text-white/50 font-medium">Sin resultados</p>
                            <p className="text-xs text-white/25 mt-1">Prueba con otro filtro o búsqueda</p>
                        </div>
                    ) : (
                        filtered.map((p) => {
                            const initials = getInitials(p.nombres)
                            const isSelected = selectedId === p.id
                            const risk = getRiskLevel(p)
                            const riskDot = risk === 'CRITICO' || risk === 'ALTO' ? 'bg-red-400' : risk === 'MODERADO' ? 'bg-amber-400' : 'bg-transparent'

                            return (
                                <button
                                    key={p.id}
                                    onClick={() => handleSelectPerson(p.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all border-b border-white/[0.04] ${isSelected
                                        ? 'bg-[#ff7a59]/10 border-l-2 border-l-[#ff7a59]'
                                        : 'hover:bg-white/[0.04] border-l-2 border-l-transparent'
                                        }`}
                                >
                                    {/* Avatar */}
                                    <div className="relative flex-shrink-0">
                                        <div className={`w-11 h-11 rounded-full flex items-center justify-center text-xs font-semibold ${p.tipo === 'VICTIMA' ? 'bg-blue-500/15 text-blue-400' : 'bg-red-500/15 text-red-400'}`}>
                                            {initials}
                                        </div>
                                        {riskDot !== 'bg-transparent' && (
                                            <span className={`absolute -top-0.5 -right-0.5 w-3 h-3 ${riskDot} rounded-full border-2 border-[#111821]`} />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className={`text-sm truncate ${isSelected ? 'font-semibold text-white' : 'font-medium text-white/75'}`}>
                                                {p.nombres || '—'}
                                            </p>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${p.tipo === 'VICTIMA' ? 'bg-blue-500/15 text-blue-400' : 'bg-red-500/15 text-red-400'}`}>
                                                {p.tipo === 'VICTIMA' ? 'Víctima' : 'Agresor'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-white/30 truncate mt-0.5">
                                            {p.documento || 'Sin documento'} {p.expediente ? `• ${p.expediente.radicado}` : ''}
                                        </p>
                                    </div>
                                </button>
                            )
                        })
                    )}
                </div>
            </div>

            {/* ════════ RIGHT PANEL — Person Detail ════════ */}
            <div className={`flex-1 flex flex-col bg-transparent overflow-y-auto ${mobileShowDetail ? 'flex' : 'hidden sm:flex'} ${mobileShowDetail ? 'absolute inset-0 z-10 sm:relative sm:inset-auto sm:z-auto bg-[#0a1118]' : ''}`}>
                {!selected ? (
                    /* Empty state */
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                        <div className="w-20 h-20 rounded-full bg-white/[0.04] flex items-center justify-center mb-4">
                            <Users className="w-8 h-8 text-white/10" />
                        </div>
                        <h3 className="text-lg font-semibold text-white/50 mb-1">Selecciona una persona</h3>
                        <p className="text-sm text-white/25 max-w-xs">
                            Elige una persona de la lista para ver sus datos demográficos, expedientes y detalles de contacto.
                        </p>
                    </div>
                ) : (
                    /* Person Detail */
                    <>
                        {/* Detail Header */}
                        <div className="border-b border-white/[0.06] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between bg-white/[0.02]">
                            {/* Mobile Back Button */}
                            <button
                                onClick={handleBackToList}
                                className="sm:hidden flex items-center gap-1 text-white/50 hover:text-white mr-3 -ml-1 p-1"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-base font-semibold ${selected.tipo === 'VICTIMA' ? 'bg-blue-500/15 text-blue-400' : 'bg-red-500/15 text-red-400'}`}>
                                    {getInitials(selected.nombres)}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">{selected.nombres}</h2>
                                    <p className="text-sm text-white/35">
                                        {selected.documento || 'Sin documento'}
                                        <span className={`ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium ${selected.tipo === 'VICTIMA' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' : 'bg-red-500/15 text-red-400 border border-red-500/20'}`}>
                                            {selected.tipo === 'VICTIMA' ? <User className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                                            {selected.tipo === 'VICTIMA' ? 'Víctima' : 'Agresor'}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <Link
                                href={`/dashboard/personas/${selected.id}`}
                                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#ff7a59] text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-[#ff6b47] transition-colors shadow-sm"
                            >
                                <Eye className="w-4 h-4" />
                                <span className="hidden sm:inline">Ver Expediente</span>
                                <span className="sm:hidden">Ver</span>
                            </Link>
                        </div>

                        {/* Detail Body */}
                        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-4xl">

                                {/* Información Personal */}
                                <div className="bg-white/[0.03] rounded-xl p-5 border border-white/[0.08]">
                                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                        <User className="w-4 h-4 text-[#ff7a59]" />
                                        Información Personal
                                    </h3>
                                    <div className="space-y-3">
                                        <DetailRow label="Nombre completo" value={selected.nombres} />
                                        <DetailRow label="Documento" value={selected.documento} />
                                        <DetailRow label="Género" value={selected.genero === 'M' ? 'Masculino' : selected.genero === 'F' ? 'Femenino' : selected.genero || '—'} />
                                        <DetailRow label="Edad" value={
                                            selected.datos_demograficos?.fecha_nacimiento
                                                ? `${Math.floor((Date.now() - new Date(selected.datos_demograficos.fecha_nacimiento).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} años`
                                                : '—'
                                        } />
                                        <DetailRow label="Estado civil" value={selected.datos_demograficos?.estado_civil || '—'} />
                                        <DetailRow label="Escolaridad" value={selected.datos_demograficos?.escolaridad || '—'} />
                                        <DetailRow label="Ocupación" value={selected.datos_demograficos?.ocupacion || '—'} />
                                    </div>
                                </div>

                                {/* Contacto */}
                                <div className="bg-white/[0.03] rounded-xl p-5 border border-white/[0.08]">
                                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-[#ff7a59]" />
                                        Contacto
                                    </h3>
                                    <div className="space-y-3">
                                        <DetailRow label="Teléfono" value={selected.telefono} />
                                        <DetailRow label="Dirección" value={selected.datos_demograficos?.direccion || '—'} />
                                        <DetailRow label="Barrio" value={selected.datos_demograficos?.barrio || '—'} />
                                        <DetailRow label="Municipio" value={selected.datos_demograficos?.municipio || '—'} />
                                        <DetailRow label="Departamento" value={selected.datos_demograficos?.departamento || '—'} />
                                    </div>
                                </div>

                                {/* Expediente Vinculado */}
                                <div className="bg-white/[0.03] rounded-xl p-5 border border-white/[0.08]">
                                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-[#ff7a59]" />
                                        Expediente Vinculado
                                    </h3>
                                    {selected.expediente ? (
                                        <div className="space-y-3">
                                            <DetailRow label="Radicado" value={selected.expediente.radicado} highlight />
                                            <DetailRow label="Fase del proceso" value={selected.expediente.fase_proceso?.replace(/_/g, ' ') || '—'} />
                                            <div>
                                                <p className="text-[11px] text-white/30 font-medium mb-1">Nivel de riesgo</p>
                                                {(() => {
                                                    const r = riskConfig[selected.expediente.nivel_riesgo || 'SIN_RIESGO'] || riskConfig.SIN_RIESGO
                                                    return (
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${r.bg} ${r.color}`}>
                                                            <AlertTriangle className="w-3 h-3" />
                                                            {r.label}
                                                        </span>
                                                    )
                                                })()}
                                            </div>
                                            <Link
                                                href={`/dashboard/casos/${selected.expediente.id}`}
                                                className="inline-flex items-center gap-1.5 text-xs text-[#ff7a59] hover:text-[#2B463C] font-medium mt-2 transition-colors"
                                            >
                                                Ir al expediente <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-white/25">Sin expediente vinculado</p>
                                    )}
                                </div>

                                {/* Datos Adicionales */}
                                <div className="bg-white/[0.03] rounded-xl p-5 border border-white/[0.08]">
                                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-[#ff7a59]" />
                                        Datos Adicionales
                                    </h3>
                                    <div className="space-y-3">
                                        <DetailRow label="Etnia" value={selected.datos_demograficos?.etnia || '—'} />
                                        <DetailRow label="Discapacidad" value={selected.datos_demograficos?.discapacidad || 'No registra'} />
                                        <DetailRow label="EPS" value={selected.datos_demograficos?.eps || '—'} />
                                        <DetailRow label="Régimen" value={selected.datos_demograficos?.regimen_salud || '—'} />
                                    </div>
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
