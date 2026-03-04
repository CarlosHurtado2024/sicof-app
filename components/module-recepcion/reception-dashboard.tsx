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
        <div className={`transition-all duration-500 ${isCrisisMode ? 'bg-red-50/50 p-4 sm:p-8 rounded-xl border border-red-200' : ''}`}>
            {/* Header */}
            <header className="flex flex-col gap-6 mb-12 animate-fade-in-up">
                <div>
                    <div className="flex items-center space-x-3 text-gray-400 text-[10px] mb-4 font-black uppercase tracking-[0.2em]">
                        <span>Gestión</span>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-[#F28C73]">Recepción</span>
                    </div>
                    <h2 className={`text-3xl sm:text-5xl font-bold tracking-tight font-display transition-colors duration-500 ${isCrisisMode ? 'text-red-700' : 'text-gray-900'}`}>
                        {isCrisisMode ? 'Atención de Emergencia' : 'Recepción y Radicación'}
                    </h2>
                    <p className="text-gray-500 mt-4 text-sm sm:text-base font-medium max-w-2xl leading-relaxed">
                        {isCrisisMode ? 'Prioridad Crítica — Activación de Protocolo de Emergencia Ley 1257.' : 'Registro inicial de usuarios y gestión de la cola de atención del despacho.'}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end pr-8 border-r border-gray-100">
                        <span className="text-sm font-bold text-gray-900 uppercase tracking-tighter">
                            {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
                        </span>
                        <span className="text-[10px] text-gray-400 font-black tracking-widest uppercase">
                            {format(new Date(), 'hh:mm a')}
                        </span>
                    </div>
                    {!isCrisisMode && (
                        <Link href="/dashboard/recepcion/nuevo-caso" className="w-full sm:w-auto">
                            <Button className="w-full sm:w-auto bg-[#F28C73] hover:bg-[#D96C53] text-white px-8 py-7 rounded-lg font-bold text-sm uppercase tracking-widest shadow-sm transition-all hover:scale-[1.02]">
                                <Plus className="h-5 w-5 mr-2" />
                                Radicar Caso
                            </Button>
                        </Link>
                    )}
                    <Button
                        onClick={() => setIsCrisisMode(!isCrisisMode)}
                        variant={isCrisisMode ? "default" : "outline"}
                        className={`w-full sm:w-auto transition-all duration-300 px-8 py-7 rounded-lg font-bold text-sm uppercase tracking-widest ${isCrisisMode
                            ? 'bg-red-600 hover:bg-red-700 text-white border-none'
                            : 'border-2 border-red-100 text-red-600 hover:bg-red-50'
                            }`}
                    >
                        <Siren className={`h-5 w-5 mr-3 ${isCrisisMode ? 'animate-pulse' : ''}`} />
                        {isCrisisMode ? 'Finalizar Emergencia' : 'Activar Emergencia'}
                    </Button>
                </div>
            </header>

            {/* KPIs Grid - Retirado según la petición del usuario */}
            {/* Main Content - Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
                {/* Left Column: Form */}
                <section className="lg:col-span-6">
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col shadow-sm">
                        <div className="px-5 sm:px-8 py-5 border-b border-gray-100 bg-white">
                            <h4 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${isCrisisMode ? 'bg-red-50 text-red-600' : 'bg-[#F28C73]/10 text-[#F28C73]'}`}>
                                    <FileText className="h-5 w-5" />
                                </div>
                                {isCrisisMode ? 'Registro de Emergencia' : 'Formulario de Minuta'}
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
                <section className={`lg:col-span-6 transition-all duration-300 ${isCrisisMode ? 'opacity-30 pointer-events-none scale-95 origin-right' : ''}`}>
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden h-full flex flex-col shadow-sm">
                        <div className="px-5 sm:px-8 py-5 border-b border-gray-100 bg-white flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            <div>
                                <h4 className="text-base sm:text-lg font-bold text-gray-900">Cola de Espera</h4>
                                <p className="text-[10px] text-[#F28C73] font-black uppercase tracking-widest mt-1">Sincronización en Directo</p>
                            </div>
                            <div className="relative group">
                                <input
                                    className="pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-100 rounded-lg focus:ring-4 focus:ring-[#F28C73]/5 focus:border-[#F28C73]/20 w-full sm:w-64 transition-all"
                                    placeholder="Nombre o documento..."
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-300 group-focus-within:text-[#F28C73] transition-colors" />
                            </div>
                        </div>

                        {/* Desktop Table — hidden on mobile */}
                        <div className="hidden md:block overflow-x-auto flex-1">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Hora</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Usuario</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Motivo</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredMinutas.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-12 text-center text-slate-400 bg-transparent">
                                                <p className="mb-2 text-3xl">📭</p>
                                                No hay registros de ingreso hoy.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredMinutas.map((minuta) => (
                                            <tr key={minuta.id} className="hover:bg-blue-50/50 transition-all duration-200 group">
                                                <td className="px-8 py-4">
                                                    <span className="font-mono text-sm text-gray-400 font-bold">
                                                        {format(new Date(minuta.fecha_hora_ingreso), 'HH:mm')}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-4">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 rounded-lg bg-gray-50 text-gray-800 flex items-center justify-center font-bold text-xs mr-3 border border-gray-100">
                                                            {minuta.nombre_visitante.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-bold text-gray-900 truncate">{minuta.nombre_visitante}</p>
                                                            <p className="text-[10px] text-gray-400 font-mono mt-0.5 tracking-tighter">ID: {minuta.documento_visitante.slice(0, 4)}***{minuta.documento_visitante.slice(-3)}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-4">
                                                    <span className={`px-2 py-1 rounded-md text-[10px] font-black border uppercase tracking-widest ${minuta.motivo_visita === 'DENUNCIA'
                                                        ? 'bg-red-50 text-red-700 border-red-100'
                                                        : minuta.motivo_visita === 'AUDIENCIA'
                                                            ? 'bg-blue-50 text-blue-700 border-blue-100'
                                                            : 'bg-gray-50 text-gray-700 border-gray-100'
                                                        }`}>
                                                        {minuta.motivo_visita}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-4">
                                                    {minuta.fecha_hora_salida ? (
                                                        <div className="flex items-center gap-2">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Egresado</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                                                            <span className="text-[10px] text-emerald-600 font-black uppercase tracking-tight">Atendiendo</span>
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
                                <div className="px-4 py-12 text-center text-slate-400">
                                    <p className="mb-2 text-3xl">📭</p>
                                    No hay registros de ingreso hoy.
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {filteredMinutas.map((minuta) => (
                                        <div key={minuta.id} className="p-4 hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs flex-shrink-0 border border-white shadow-sm">
                                                    {minuta.nombre_visitante.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-slate-800 truncate">{minuta.nombre_visitante}</p>
                                                    <p className="text-[11px] text-slate-400 font-mono">
                                                        {format(new Date(minuta.fecha_hora_ingreso), 'HH:mm')} · ID: {minuta.documento_visitante.slice(0, 4)}***
                                                    </p>
                                                </div>
                                                {minuta.fecha_hora_salida ? (
                                                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                                                        Listo
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
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
                            <div className="p-6 border-t border-gray-100 text-center bg-gray-50/20">
                                <button className="text-[10px] font-black text-gray-400 hover:text-[#F28C73] transition-colors uppercase tracking-[0.25em]">
                                    Cargar Historial Completo
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}
