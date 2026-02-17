
'use client'

import { useState } from 'react'
import { MinutaForm } from '@/components/module-recepcion/minuta-form'
import { CrisisForm } from '@/components/module-recepcion/crisis-form'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Users, Clock, AlertTriangle, FileText, Plus, Siren, Search, Activity, CheckCircle2 } from 'lucide-react'

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

    return (
        <div className={`space-y-6 transition-colors duration-500 ${isCrisisMode ? 'bg-red-50/30 p-4 rounded-xl' : ''}`}>

            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        {isCrisisMode ? '🚨 MODO DE EMERGENCIA' : 'Recepción y Radicación'}
                    </h1>
                    <p className="text-slate-500">
                        {isCrisisMode ? 'Prioridad Alta — Atención en Crisis y Primeros Auxilios Psicológicos' : 'Ventanilla Única Digital — Control de Ingreso y Triaje'}
                    </p>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                    <div className="bg-white border text-slate-600 px-4 py-2 rounded-lg font-medium text-sm shadow-sm flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
                    </div>

                    {!isCrisisMode && (
                        <Link href="/dashboard/recepcion/nuevo-caso">
                            <Button className="bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200">
                                <Plus className="h-4 w-4 mr-2" /> Radicar Nuevo Caso
                            </Button>
                        </Link>
                    )}

                    <Button
                        onClick={() => setIsCrisisMode(!isCrisisMode)}
                        variant={isCrisisMode ? "default" : "outline"}
                        className={`transition-all duration-300 ${isCrisisMode
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
            </div>

            {/* KPIs Grid */}
            {!isCrisisMode && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="shadow-sm border-l-4 border-l-blue-500">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Ingresos Hoy</p>
                                <h3 className="text-2xl font-bold text-slate-800">{kpis.totalHoy}</h3>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-l-4 border-l-emerald-500">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 bg-emerald-100 rounded-full">
                                <Activity className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">En Atención</p>
                                <h3 className="text-2xl font-bold text-slate-800">{kpis.enAtencion}</h3>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-l-4 border-l-red-500">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 bg-red-100 rounded-full">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Alertas Crisis</p>
                                <h3 className="text-2xl font-bold text-slate-800">{kpis.crisisHoy}</h3>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-l-4 border-l-purple-500">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 bg-purple-100 rounded-full">
                                <FileText className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Radicados</p>
                                <h3 className="text-2xl font-bold text-slate-800">{kpis.radicadosHoy}</h3>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Forms */}
                <div className="lg:col-span-1">
                    {isCrisisMode ? (
                        <div className="animate-in zoom-in-95 duration-300">
                            <CrisisForm onClose={() => setIsCrisisMode(false)} />
                        </div>
                    ) : (
                        <MinutaForm />
                    )}
                </div>

                {/* Right Column: List (Hidden in Crisis Mode if small screen, or dimmed) */}
                <div className={`lg:col-span-2 ${isCrisisMode ? 'opacity-50 pointer-events-none filter grayscale' : ''}`}>
                    <Card className="h-full border-0 shadow-md">
                        <CardHeader className="border-b bg-slate-50/50">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Historial de Ingresos</CardTitle>
                                    <CardDescription>Últimos registros en ventanilla hoy.</CardDescription>
                                </div>
                                <div className="relative w-48">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                    <input
                                        placeholder="Filtrar..."
                                        className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-auto max-h-[600px]">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-slate-500 font-medium border-b sticky top-0">
                                        <tr>
                                            <th className="px-4 py-3">Hora</th>
                                            <th className="px-4 py-3">Visitante</th>
                                            <th className="px-4 py-3">Motivo</th>
                                            <th className="px-4 py-3">Funcionario</th>
                                            <th className="px-4 py-3">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {minutas?.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-4 py-12 text-center text-slate-500 bg-slate-50/30">
                                                    <p className="mb-2 text-lg">📭</p>
                                                    No hay registros de ingreso hoy.
                                                </td>
                                            </tr>
                                        ) : (
                                            minutas.map((minuta) => (
                                                <tr key={minuta.id} className="hover:bg-slate-50/80 transition-colors">
                                                    <td className="px-4 py-3 font-mono text-slate-600 whitespace-nowrap">
                                                        {format(new Date(minuta.fecha_hora_ingreso), 'HH:mm')}
                                                    </td>
                                                    <td className="px-4 py-3 font-medium text-slate-900">
                                                        {minuta.nombre_visitante}
                                                        <div className="text-xs text-slate-400 font-mono">{minuta.documento_visitante}</div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${minuta.motivo_visita === 'DENUNCIA' ? 'bg-red-50 text-red-700 border-red-100' :
                                                            minuta.motivo_visita === 'AUDIENCIA' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                                minuta.motivo_visita === 'ORIENTACION' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                                    'bg-slate-50 text-slate-700 border-slate-100'
                                                            }`}>
                                                            {minuta.motivo_visita}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-500 text-xs">
                                                        {minuta.funcionario?.nombre?.split(' ')[0] || 'Sistema'}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {minuta.fecha_hora_salida ? (
                                                            <span className="text-slate-400 text-xs flex items-center gap-1">
                                                                <CheckCircle2 className="h-3 w-3" /> Salida
                                                            </span>
                                                        ) : (
                                                            <span className="text-emerald-600 text-xs font-medium flex items-center gap-1 animate-pulse">
                                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> En Atención
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
