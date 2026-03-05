'use client'

import { useState } from 'react'
import { MinutaForm } from '@/components/module-recepcion/minuta-form'
import { CrisisForm } from '@/components/module-recepcion/crisis-form'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
    Users, Clock, AlertTriangle, FileText, Plus, Siren, Search,
    ChevronRight, ArrowLeft, X, ClipboardList, UserCheck
} from 'lucide-react'

interface Minuta {
    id: string;
    fecha_hora_ingreso: string;
    nombre_visitante: string;
    documento_visitante: string;
    motivo_visita: string;
    funcionario: { nombre: string };
    fecha_hora_salida?: string;
}

interface ReceptionDashboardProps {
    initialMinutas: Minuta[];
    kpis: {
        totalHoy: number;
        enAtencion: number;
        crisisHoy: number;
        radicadosHoy: number;
    }
}

function getInitials(name: string): string {
    return name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '??'
}

const MOTIVO_STYLE: Record<string, { bg: string; text: string }> = {
    DENUNCIA: { bg: 'bg-red-500/10 border border-red-500/20', text: 'text-red-400' },
    AUDIENCIA: { bg: 'bg-blue-500/15 border border-blue-500/20', text: 'text-blue-400' },
    CONSULTA: { bg: 'bg-amber-500/10 border border-amber-500/20', text: 'text-amber-400' },
    SEGUIMIENTO: { bg: 'bg-emerald-500/10 border border-emerald-500/20', text: 'text-emerald-400' },
}

export function ReceptionDashboard({ initialMinutas, kpis }: ReceptionDashboardProps) {
    const [isCrisisMode, setIsCrisisMode] = useState(false)
    const [minutas, setMinutas] = useState(initialMinutas)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedMinutaId, setSelectedMinutaId] = useState<string | null>(null)
    const [mobileShowForm, setMobileShowForm] = useState(false)

    const filteredMinutas = minutas.filter(m => !searchTerm ||
        m.nombre_visitante.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.documento_visitante.includes(searchTerm)
    )

    const enAtencion = minutas.filter(m => !m.fecha_hora_salida).length
    const totalHoy = minutas.length

    const handleShowForm = () => {
        setSelectedMinutaId(null)
        setMobileShowForm(true)
    }

    const handleBackToList = () => {
        setMobileShowForm(false)
    }

    return (
        <div className="flex h-[calc(100vh-5rem)] bg-white/[0.03] rounded-xl sm:border border-white/[0.08] shadow-sm overflow-hidden relative">
            {/* ═══════ LEFT PANEL — Cola de Espera ═══════ */}
            <div className={`w-full sm:w-[340px] flex-shrink-0 border-r border-white/[0.08] flex flex-col bg-white/[0.02] ${mobileShowForm ? 'hidden sm:flex' : 'flex'}`}>
                {/* Header */}
                <div className="px-4 pt-4 pb-2">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-bold text-white">Recepción</h2>
                        <button
                            onClick={() => setIsCrisisMode(!isCrisisMode)}
                            className={`text-[10px] font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${isCrisisMode
                                ? 'bg-red-500/100 text-white'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-100'
                                }`}
                        >
                            <Siren className={`w-3 h-3 ${isCrisisMode ? 'animate-pulse' : ''}`} />
                            {isCrisisMode ? 'Emergencia' : 'Crisis'}
                        </button>
                    </div>

                    {/* KPI chips */}
                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[11px]">
                            <Users className="w-3 h-3 text-[#ff7a59]" />
                            <span className="font-semibold text-white">{totalHoy}</span>
                            <span className="text-white/30">hoy</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px]">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/100 animate-pulse" />
                            <span className="font-semibold text-emerald-400">{enAtencion}</span>
                            <span className="text-emerald-500/50">activos</span>
                        </div>
                        {kpis.crisisHoy > 0 && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-[11px]">
                                <AlertTriangle className="w-3 h-3 text-red-400" />
                                <span className="font-semibold text-red-400">{kpis.crisisHoy}</span>
                            </div>
                        )}
                    </div>

                    {/* Search */}
                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                            type="text"
                            placeholder="Buscar visitante..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm bg-white/[0.03] border border-white/[0.08] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ff7a59]/40 focus:border-[#ff7a59]/40 placeholder:text-white/20"
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-white/25 hover:text-white">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* New Minuta button (mobile) */}
                    <button
                        onClick={handleShowForm}
                        className="sm:hidden w-full flex items-center justify-center gap-2 py-2.5 bg-[#ff7a59] text-white text-sm font-medium rounded-lg hover:bg-[#ff7a59] transition-colors mb-2"
                    >
                        <Plus className="w-4 h-4" />
                        Registrar Ingreso
                    </button>
                </div>

                {/* Count + Date */}
                <div className="px-4 py-2 text-[11px] text-white/25 font-medium border-b border-white/[0.08] flex justify-between">
                    <span>{filteredMinutas.length} registros</span>
                    <span>{format(new Date(), "d MMM yyyy", { locale: es })}</span>
                </div>

                {/* Queue List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredMinutas.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                            <div className="w-12 h-12 rounded-full bg-white/[0.04] flex items-center justify-center mb-3">
                                <ClipboardList className="w-5 h-5 text-white/12" />
                            </div>
                            <p className="text-sm text-white/45 font-medium">Sin registros</p>
                            <p className="text-xs text-white/20 mt-1">No hay visitantes registrados hoy</p>
                        </div>
                    ) : (
                        filteredMinutas.map((minuta) => {
                            const initials = getInitials(minuta.nombre_visitante)
                            const isActive = !minuta.fecha_hora_salida
                            const motivoStyle = MOTIVO_STYLE[minuta.motivo_visita] || { bg: 'bg-white/5 border border-white/10', text: 'text-slate-500' }

                            return (
                                <div
                                    key={minuta.id}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all border-b border-white/[0.04] hover:bg-white/80"
                                >
                                    {/* Avatar */}
                                    <div className="relative flex-shrink-0">
                                        <div className={`w-11 h-11 rounded-full flex items-center justify-center text-xs font-semibold ${isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-white/40'}`}>
                                            {initials}
                                        </div>
                                        {isActive && (
                                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500/100 rounded-full border-2 border-[#111821] animate-pulse" />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-sm font-medium text-white/70 truncate">
                                                {minuta.nombre_visitante}
                                            </p>
                                            <span className="text-[10px] text-white/20 font-mono flex-shrink-0">
                                                {format(new Date(minuta.fecha_hora_ingreso), 'HH:mm')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${motivoStyle.bg} ${motivoStyle.text}`}>
                                                {minuta.motivo_visita}
                                            </span>
                                            <span className="text-[10px] text-white/20">
                                                {isActive ? '• En atención' : '• Egresado'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>

            {/* ═══════ RIGHT PANEL — Formulario de Minuta ═══════ */}
            <div className={`flex-1 flex flex-col bg-white/[0.03] overflow-y-auto ${mobileShowForm ? 'flex' : 'hidden sm:flex'} ${mobileShowForm ? 'absolute inset-0 z-10 sm:relative sm:inset-auto sm:z-auto' : ''}`}>
                {/* Form Header */}
                <div className="border-b border-white/[0.08] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between bg-white/[0.02]">
                    {/* Mobile Back */}
                    <button onClick={handleBackToList} className="sm:hidden flex items-center gap-1 text-white/50 hover:text-white mr-3 -ml-1 p-1">
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-3 flex-1">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${isCrisisMode ? 'bg-red-500/10' : 'bg-white/[0.04]'}`}>
                            {isCrisisMode ? (
                                <Siren className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 animate-pulse" />
                            ) : (
                                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-[#ff7a59]" />
                            )}
                        </div>
                        <div>
                            <h2 className={`text-base sm:text-lg font-bold ${isCrisisMode ? 'text-red-700' : 'text-white'}`}>
                                {isCrisisMode ? 'Registro de Emergencia' : 'Formulario de Minuta'}
                            </h2>
                            <p className="text-xs text-white/30">
                                {isCrisisMode ? 'Protocolo de Emergencia Ley 1257' : 'Registro de ingreso al despacho'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/dashboard/recepcion/nuevo-caso"
                            className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#ff7a59] text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-[#ff7a59] transition-colors shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Radicar Caso</span>
                        </Link>
                    </div>
                </div>

                {/* Form Body */}
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                    <div className="max-w-3xl mx-auto">
                        {isCrisisMode ? (
                            <div className="bg-red-50/50 rounded-xl p-5 border border-red-500/20">
                                <CrisisForm onClose={() => setIsCrisisMode(false)} />
                            </div>
                        ) : (
                            <div className="bg-white/[0.02] rounded-xl p-4 sm:p-6 border border-white/[0.08]">
                                <MinutaForm />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
