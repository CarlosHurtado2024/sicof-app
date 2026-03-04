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
        CRITICO: { color: 'text-red-600', bg: 'bg-red-50 border-red-100', label: 'Crítico' },
        ALTO: { color: 'text-red-500', bg: 'bg-red-50 border-red-100', label: 'Alto' },
        MODERADO: { color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100', label: 'Moderado' },
        BAJO: { color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100', label: 'Bajo' },
        SIN_RIESGO: { color: 'text-slate-400', bg: 'bg-slate-50 border-slate-100', label: 'Sin evaluar' },
    }

    return (
        <div className="flex h-[calc(100vh-5rem)] sm:h-[calc(100vh-5rem)] bg-white rounded-xl sm:border border-[#2B463C]/5 shadow-sm overflow-hidden relative">
            {/* ════════ LEFT PANEL — Contact List ════════ */}
            <div className={`w-full sm:w-[340px] flex-shrink-0 border-r border-[#2B463C]/5 flex flex-col bg-[#FAFAF8] ${mobileShowDetail ? 'hidden sm:flex' : 'flex'}`}>
                {/* Header */}
                <div className="px-4 pt-4 pb-2">
                    <h2 className="text-lg font-bold text-[#2B463C] mb-3">Personas</h2>

                    {/* Search */}
                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2B463C]/25" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o documento..."
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#2B463C]/8 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#F28C73]/40 focus:border-[#F28C73]/40 placeholder:text-[#2B463C]/25"
                        />
                        {localSearch && (
                            <button
                                onClick={() => setLocalSearch('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-[#2B463C]/30 hover:text-[#2B463C] rounded-full"
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
                                    ? 'bg-[#F28C73] text-white shadow-sm'
                                    : 'bg-white text-[#2B463C]/50 border border-[#2B463C]/8 hover:border-[#F28C73]/30 hover:text-[#F28C73]'
                                    }`}
                            >
                                {f.icon}
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Count */}
                <div className="px-4 py-2 text-[11px] text-[#2B463C]/30 font-medium border-b border-[#2B463C]/5">
                    {filtered.length} {filtered.length === 1 ? 'persona' : 'personas'}
                </div>

                {/* Contact List */}
                <div className="flex-1 overflow-y-auto">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                            <div className="w-12 h-12 rounded-full bg-[#F8F5EE] flex items-center justify-center mb-3">
                                <Search className="w-5 h-5 text-[#2B463C]/15" />
                            </div>
                            <p className="text-sm text-[#2B463C]/50 font-medium">Sin resultados</p>
                            <p className="text-xs text-[#2B463C]/25 mt-1">Prueba con otro filtro o búsqueda</p>
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
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all border-b border-[#2B463C]/3 ${isSelected
                                        ? 'bg-[#F28C73]/8 border-l-2 border-l-[#F28C73]'
                                        : 'hover:bg-white/80 border-l-2 border-l-transparent'
                                        }`}
                                >
                                    {/* Avatar */}
                                    <div className="relative flex-shrink-0">
                                        <div className={`w-11 h-11 rounded-full flex items-center justify-center text-xs font-semibold ${p.tipo === 'VICTIMA' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-500'}`}>
                                            {initials}
                                        </div>
                                        {riskDot !== 'bg-transparent' && (
                                            <span className={`absolute -top-0.5 -right-0.5 w-3 h-3 ${riskDot} rounded-full border-2 border-[#FAFAF8]`} />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className={`text-sm truncate ${isSelected ? 'font-semibold text-[#2B463C]' : 'font-medium text-[#2B463C]/80'}`}>
                                                {p.nombres || '—'}
                                            </p>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${p.tipo === 'VICTIMA' ? 'bg-blue-50 text-blue-500' : 'bg-red-50 text-red-400'}`}>
                                                {p.tipo === 'VICTIMA' ? 'Víctima' : 'Agresor'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-[#2B463C]/35 truncate mt-0.5">
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
            <div className={`flex-1 flex flex-col bg-white overflow-y-auto ${mobileShowDetail ? 'flex' : 'hidden sm:flex'} ${mobileShowDetail ? 'absolute inset-0 z-10 sm:relative sm:inset-auto sm:z-auto' : ''}`}>
                {!selected ? (
                    /* Empty state */
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                        <div className="w-20 h-20 rounded-full bg-[#F8F5EE] flex items-center justify-center mb-4">
                            <Users className="w-8 h-8 text-[#2B463C]/10" />
                        </div>
                        <h3 className="text-lg font-semibold text-[#2B463C]/60 mb-1">Selecciona una persona</h3>
                        <p className="text-sm text-[#2B463C]/30 max-w-xs">
                            Elige una persona de la lista para ver sus datos demográficos, expedientes y detalles de contacto.
                        </p>
                    </div>
                ) : (
                    /* Person Detail */
                    <>
                        {/* Detail Header */}
                        <div className="border-b border-[#2B463C]/5 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between bg-[#FAFAF8]">
                            {/* Mobile Back Button */}
                            <button
                                onClick={handleBackToList}
                                className="sm:hidden flex items-center gap-1 text-[#2B463C]/60 hover:text-[#2B463C] mr-3 -ml-1 p-1"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-base font-semibold ${selected.tipo === 'VICTIMA' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-500'}`}>
                                    {getInitials(selected.nombres)}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-[#2B463C]">{selected.nombres}</h2>
                                    <p className="text-sm text-[#2B463C]/40">
                                        {selected.documento || 'Sin documento'}
                                        <span className={`ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium ${selected.tipo === 'VICTIMA' ? 'bg-blue-50 text-blue-500 border border-blue-100' : 'bg-red-50 text-red-400 border border-red-100'}`}>
                                            {selected.tipo === 'VICTIMA' ? <User className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                                            {selected.tipo === 'VICTIMA' ? 'Víctima' : 'Agresor'}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <Link
                                href={`/dashboard/personas/${selected.id}`}
                                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#2B463C] text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-[#F28C73] transition-colors shadow-sm"
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
                                <div className="bg-[#FAFAF8] rounded-xl p-5 border border-[#2B463C]/5">
                                    <h3 className="text-sm font-semibold text-[#2B463C] mb-4 flex items-center gap-2">
                                        <User className="w-4 h-4 text-[#F28C73]" />
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
                                <div className="bg-[#FAFAF8] rounded-xl p-5 border border-[#2B463C]/5">
                                    <h3 className="text-sm font-semibold text-[#2B463C] mb-4 flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-[#F28C73]" />
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
                                <div className="bg-[#FAFAF8] rounded-xl p-5 border border-[#2B463C]/5">
                                    <h3 className="text-sm font-semibold text-[#2B463C] mb-4 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-[#F28C73]" />
                                        Expediente Vinculado
                                    </h3>
                                    {selected.expediente ? (
                                        <div className="space-y-3">
                                            <DetailRow label="Radicado" value={selected.expediente.radicado} highlight />
                                            <DetailRow label="Fase del proceso" value={selected.expediente.fase_proceso?.replace(/_/g, ' ') || '—'} />
                                            <div>
                                                <p className="text-[11px] text-[#2B463C]/35 font-medium mb-1">Nivel de riesgo</p>
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
                                                className="inline-flex items-center gap-1.5 text-xs text-[#F28C73] hover:text-[#2B463C] font-medium mt-2 transition-colors"
                                            >
                                                Ir al expediente <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-[#2B463C]/30">Sin expediente vinculado</p>
                                    )}
                                </div>

                                {/* Datos Adicionales */}
                                <div className="bg-[#FAFAF8] rounded-xl p-5 border border-[#2B463C]/5">
                                    <h3 className="text-sm font-semibold text-[#2B463C] mb-4 flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-[#F28C73]" />
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
            <p className="text-[11px] text-[#2B463C]/35 font-medium mb-0.5">{label}</p>
            <p className={`text-sm ${highlight ? 'text-[#F28C73] font-semibold' : 'text-[#2B463C]/80'}`}>
                {value || '—'}
            </p>
        </div>
    )
}
