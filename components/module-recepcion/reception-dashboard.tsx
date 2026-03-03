'use client'

import { useState } from 'react'
import { MinutaForm } from '@/components/module-recepcion/minuta-form'
import { CrisisForm } from '@/components/module-recepcion/crisis-form'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Users, Clock, AlertTriangle, FileText, Plus, Siren, Search, ChevronRight, MoreVertical } from 'lucide-react'

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

export function ReceptionDashboard({ initialMinutas, kpis }: ReceptionDashboardProps) {
    const [isCrisisMode, setIsCrisisMode] = useState(false)
    const [minutas, setMinutas] = useState(initialMinutas)
    const [searchTerm, setSearchTerm] = useState('')

    const filteredMinutas = minutas.filter(m => !searchTerm ||
        m.nombre_visitante.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.documento_visitante.includes(searchTerm)
    )

    return (
        <div className={`transition-colors duration-500 ${isCrisisMode ? 'bg-red-50/30 p-2 sm:p-4 rounded-xl' : ''}`}>
            {/* Header */}
            <header className="flex flex-col gap-4 mb-8 sm:mb-12">
                <div>
                    <div className="flex items-center space-x-2 text-white/50 text-sm mb-2 font-medium">
                        <span>Inicio</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                        <span className="text-purple-300 font-semibold">Recepción</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white/90 tracking-tight">
                        {isCrisisMode ? '🚨 Atención de Emergencia' : 'Recepción y Radicación'}
                    </h2>
                    <p className="text-white/40 mt-2 text-sm sm:text-base">
                        {isCrisisMode ? 'Prioridad Alta — Atención en Crisis y Primeros Auxilios Psicológicos' : 'Gestión de turnos y registro inicial de usuarios.'}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-sm font-bold text-white/90 dark:text-slate-200">
                            {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
                        </span>
                        <span className="text-xs text-white/50 font-mono tracking-widest">
                            {format(new Date(), 'hh:mm a')}
                        </span>
                    </div>
                    {!isCrisisMode && (
                        <Link href="/dashboard/recepcion/nuevo-caso" className="w-full sm:w-auto">
                            <Button className="w-full sm:w-auto bg-purple-600 border border-purple-500/50 hover:bg-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:bg-purple-500 text-white px-6 sm:px-8 py-3 rounded-xl font-bold text-sm flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] shadow-[#4C1D95]/15 transition-all hover:-translate-y-0.5 active:scale-95">
                                <Plus className="h-5 w-5 mr-2" />
                                Radicar Caso
                            </Button>
                        </Link>
                    )}
                    <Button
                        onClick={() => setIsCrisisMode(!isCrisisMode)}
                        variant={isCrisisMode ? "default" : "outline"}
                        className={`w-full sm:w-auto transition-all duration-300 px-6 py-3 sm:py-3.5 rounded-xl font-semibold ${isCrisisMode
                            ? 'bg-slate-800 hover:bg-slate-900 text-white border-transparent'
                            : 'border-red-200 text-red-600 hover:bg-red-500/10 border border-red-500/20 hover:border-red-300'
                            }`}
                    >
                        {isCrisisMode ? 'Salir del Modo Crisis' : (
                            <>
                                <Siren className="h-4 w-4 mr-2" /> SOS / Crisis
                            </>
                        )}
                    </Button>
                </div>
            </header>

            {/* KPIs Grid - Retirado según la petición del usuario */}
            {/* Main Content - Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
                {/* Left Column: Form */}
                <section className="lg:col-span-6">
                    <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden flex flex-col shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                        <div className="px-5 sm:px-8 py-4 sm:py-6 border-b border-white/10">
                            <h4 className="text-base sm:text-lg font-bold text-white/90 flex items-center">
                                <FileText className="mr-3 text-purple-300 h-5 w-5 sm:h-6 sm:w-6" />
                                {isCrisisMode ? 'Registro de Crisis' : 'Nueva Minuta'}
                            </h4>
                        </div>
                        <div className="p-4 sm:p-8 flex-1">
                            {isCrisisMode ? (
                                <div className="animate-in zoom-in-95 duration-300">
                                    <CrisisForm onClose={() => setIsCrisisMode(false)} />
                                </div>
                            ) : (
                                <MinutaForm />
                            )}
                        </div>
                    </div>
                </section>

                {/* Right Column: Live Queue */}
                <section className={`lg:col-span-6 ${isCrisisMode ? 'opacity-50 pointer-events-none filter grayscale' : ''}`}>
                    <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden h-full flex flex-col shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                        <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-white/10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                            <div>
                                <h4 className="text-base sm:text-lg font-bold text-white/90">Live Queue</h4>
                                <p className="text-[10px] text-purple-300 font-bold uppercase tracking-[0.2em] mt-1">Actividad en Tiempo Real</p>
                            </div>
                            <div className="relative">
                                <input
                                    className="pl-10 pr-4 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#4C1D95]/20 focus:border-[#4C1D95]/30 w-full sm:w-64 transition-all"
                                    placeholder="Buscar registros..."
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search className="absolute left-3.5 top-3 h-4 w-4 text-white/40" />
                            </div>
                        </div>

                        {/* Desktop Table — hidden on mobile */}
                        <div className="hidden md:block overflow-x-auto flex-1">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-white/[0.03] backdrop-blur-md sticky top-0">
                                    <tr>
                                        <th className="px-8 py-5 text-[11px] font-bold text-white/40 uppercase tracking-widest border-b border-white/10">Hora</th>
                                        <th className="px-8 py-5 text-[11px] font-bold text-white/40 uppercase tracking-widest border-b border-white/10">Visitante</th>
                                        <th className="px-8 py-5 text-[11px] font-bold text-white/40 uppercase tracking-widest border-b border-white/10">Motivo</th>
                                        <th className="px-8 py-5 text-[11px] font-bold text-white/40 uppercase tracking-widest border-b border-white/10">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredMinutas.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-12 text-center text-white/50 bg-transparent">
                                                <p className="mb-2 text-lg">📭</p>
                                                No hay registros de ingreso hoy.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredMinutas.map((minuta) => (
                                            <tr key={minuta.id} className="hover:bg-white/5 transition-all duration-200 group">
                                                <td className="px-6 py-5">
                                                    <span className="font-mono text-sm text-white/50">
                                                        {format(new Date(minuta.fecha_hora_ingreso), 'HH:mm:ss')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center">
                                                        <div className="w-9 h-9 rounded-full bg-white/10 text-white/70 flex items-center justify-center font-bold text-xs mr-3 border border-white shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                                                            {minuta.nombre_visitante.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-white/90">{minuta.nombre_visitante}</p>
                                                            <p className="text-xs text-white/40 font-mono mt-0.5">ID: {minuta.documento_visitante.slice(0, 4)}***{minuta.documento_visitante.slice(-3)}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider ${minuta.motivo_visita === 'DENUNCIA'
                                                        ? 'bg-rose-50 text-rose-600 border-rose-100'
                                                        : minuta.motivo_visita === 'AUDIENCIA'
                                                            ? 'bg-white/10 text-white/90 border-white/10'
                                                            : 'bg-white/10 text-white/70 border-white/10'
                                                        }`}>
                                                        {minuta.motivo_visita}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    {minuta.fecha_hora_salida ? (
                                                        <div className="flex items-center">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-slate-400 mr-2.5" />
                                                            <span className="text-sm text-white/50 font-bold uppercase tracking-tight">Completado</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2.5 animate-pulse" />
                                                            <span className="text-sm text-white/80 font-bold uppercase tracking-tight">En Proceso</span>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View — visible only on mobile */}
                        <div className="md:hidden flex-1 overflow-y-auto">
                            {filteredMinutas.length === 0 ? (
                                <div className="px-4 py-12 text-center text-white/50">
                                    <p className="mb-2 text-lg">📭</p>
                                    No hay registros de ingreso hoy.
                                </div>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {filteredMinutas.map((minuta) => (
                                        <div key={minuta.id} className="p-4 hover:bg-white/5 transition-colors">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-9 h-9 rounded-full bg-white/10 text-white/70 flex items-center justify-center font-bold text-xs flex-shrink-0 border border-white shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                                                    {minuta.nombre_visitante.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-white/90 truncate">{minuta.nombre_visitante}</p>
                                                    <p className="text-[11px] text-white/40 font-mono">
                                                        {format(new Date(minuta.fecha_hora_ingreso), 'HH:mm')} · ID: {minuta.documento_visitante.slice(0, 4)}***
                                                    </p>
                                                </div>
                                                {minuta.fecha_hora_salida ? (
                                                    <span className="flex items-center gap-1 text-[10px] font-bold text-white/50 uppercase">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                                                        Listo
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-[10px] font-bold text-white/80 uppercase">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-slate-900"></span>
                                                        Activo
                                                    </span>
                                                )}
                                            </div>
                                            <div className="ml-12">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${minuta.motivo_visita === 'DENUNCIA'
                                                    ? 'bg-rose-50 text-rose-600 border-rose-100'
                                                    : minuta.motivo_visita === 'AUDIENCIA'
                                                        ? 'bg-white/10 text-white/90 border-white/10'
                                                        : 'bg-white/10 text-white/70 border-white/10'
                                                    }`}>
                                                    {minuta.motivo_visita}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {minutas?.length > 0 && (
                            <div className="p-4 sm:p-6 border-t border-white/10 text-center">
                                <button className="text-xs font-bold text-white/40 hover:text-purple-300 transition-colors uppercase tracking-[0.2em]">
                                    Cargar más registros
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}
