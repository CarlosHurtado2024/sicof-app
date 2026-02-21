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
                    <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-sm mb-2 font-medium">
                        <span>Inicio</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                        <span className="text-[#7C3AED]">Recepción</span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                        {isCrisisMode ? '🚨 Atención de Emergencia' : 'Recepción y Radicación'}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-lg font-light">
                        {isCrisisMode ? 'Prioridad Alta — Atención en Crisis y Primeros Auxilios Psicológicos' : 'Gestión de turnos y registro inicial de usuarios.'}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
                        </span>
                        <span className="text-xs text-slate-500 font-mono tracking-widest">
                            {format(new Date(), 'hh:mm a')}
                        </span>
                    </div>
                    {!isCrisisMode && (
                        <Link href="/dashboard/recepcion/nuevo-caso" className="w-full sm:w-auto">
                            <Button className="w-full sm:w-auto bg-[#7C3AED] hover:opacity-90 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center shadow-lg shadow-[#7C3AED]/25 transition-all active:scale-95">
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
                            : 'border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300'
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
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
                        <div className="px-5 sm:px-8 py-4 sm:py-6 border-b border-slate-100 dark:border-slate-700">
                            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center">
                                <FileText className="mr-3 text-[#7C3AED] h-5 w-5 sm:h-6 sm:w-6" />
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
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden h-full flex flex-col">
                        <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                            <div>
                                <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Live Queue</h4>
                                <p className="text-[10px] text-[#7C3AED] font-bold uppercase tracking-[0.2em] mt-1">Actividad en Tiempo Real</p>
                            </div>
                            <div className="relative">
                                <input
                                    className="pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#7C3AED]/20 w-full sm:w-64 transition-all"
                                    placeholder="Buscar registros..."
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            </div>
                        </div>

                        {/* Desktop Table — hidden on mobile */}
                        <div className="hidden md:block overflow-x-auto flex-1">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50/50 dark:bg-slate-900/30 sticky top-0 backdrop-blur-md">
                                    <tr>
                                        <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700">Hora</th>
                                        <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700">Visitante</th>
                                        <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700">Motivo</th>
                                        <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                    {filteredMinutas.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-12 text-center text-slate-500 bg-slate-50/30 dark:bg-slate-900/30">
                                                <p className="mb-2 text-lg">📭</p>
                                                No hay registros de ingreso hoy.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredMinutas.map((minuta) => (
                                            <tr key={minuta.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                                <td className="px-8 py-6">
                                                    <span className="font-mono text-sm text-slate-500 dark:text-slate-400">
                                                        {format(new Date(minuta.fecha_hora_ingreso), 'HH:mm:ss')}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 flex items-center justify-center font-bold text-xs mr-4 border border-white dark:border-slate-600 shadow-sm">
                                                            {minuta.nombre_visitante.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{minuta.nombre_visitante}</p>
                                                            <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {minuta.documento_visitante.slice(0, 4)}***{minuta.documento_visitante.slice(-3)}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider ${minuta.motivo_visita === 'DENUNCIA'
                                                        ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border-rose-100 dark:border-rose-500/20'
                                                        : minuta.motivo_visita === 'AUDIENCIA'
                                                            ? 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border-purple-100 dark:border-purple-500/20'
                                                            : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-600'
                                                        }`}>
                                                        {minuta.motivo_visita}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    {minuta.fecha_hora_salida ? (
                                                        <div className="flex items-center">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-slate-400 mr-2.5"></span>
                                                            <span className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tight">Completado</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mr-2.5"></span>
                                                            <span className="text-sm text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-tight">En Proceso</span>
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
                                <div className="px-4 py-12 text-center text-slate-500">
                                    <p className="mb-2 text-lg">📭</p>
                                    No hay registros de ingreso hoy.
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {filteredMinutas.map((minuta) => (
                                        <div key={minuta.id} className="p-4 hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs flex-shrink-0 border border-white shadow-sm">
                                                    {minuta.nombre_visitante.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-slate-900 truncate">{minuta.nombre_visitante}</p>
                                                    <p className="text-[11px] text-slate-400 font-mono">
                                                        {format(new Date(minuta.fecha_hora_ingreso), 'HH:mm')} · ID: {minuta.documento_visitante.slice(0, 4)}***
                                                    </p>
                                                </div>
                                                {minuta.fecha_hora_salida ? (
                                                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                                                        Listo
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 uppercase">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                                                        Activo
                                                    </span>
                                                )}
                                            </div>
                                            <div className="ml-12">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${minuta.motivo_visita === 'DENUNCIA'
                                                    ? 'bg-rose-50 text-rose-600 border-rose-100'
                                                    : minuta.motivo_visita === 'AUDIENCIA'
                                                        ? 'bg-purple-50 text-purple-600 border-purple-100'
                                                        : 'bg-slate-100 text-slate-600 border-slate-200'
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
                            <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-700 text-center">
                                <button className="text-xs font-bold text-slate-400 hover:text-[#7C3AED] transition-colors uppercase tracking-[0.2em]">
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
