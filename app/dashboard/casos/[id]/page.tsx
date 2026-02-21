
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
    ClipboardList,
    HeartPulse,
    Shield,
    Eye,
    CheckCircle,
    ArrowRight,
    User,
    UserX,
    FileText,
    AlertTriangle,
    Clock,
    ChevronRight,
    Scale,
    ShieldAlert,
    CalendarDays
} from 'lucide-react'
import { FASES_ORDEN, FASES_INFO, indiceFase, faseCompletada, type FaseProceso } from '@/lib/case-workflow'
import { obtenerSemaforoTermino, formatearTiempoRestante, type TerminoLegal } from '@/lib/deadline-logic'

// Iconos por fase para el stepper
const FASE_ICONS: Record<FaseProceso, React.ReactNode> = {
    RECEPCION: <ClipboardList className="h-5 w-5" />,
    VALORACION: <HeartPulse className="h-5 w-5" />,
    MEDIDAS: <Shield className="h-5 w-5" />,
    SEGUIMIENTO: <Eye className="h-5 w-5" />,
    CIERRE: <CheckCircle className="h-5 w-5" />,
}

const RIESGO_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
    SIN_RIESGO: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Sin Riesgo' },
    BAJO: { bg: 'bg-green-100', text: 'text-green-700', label: 'Bajo' },
    MODERADO: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Moderado' },
    ALTO: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Alto' },
    CRITICO: { bg: 'bg-red-100', text: 'text-red-700', label: 'Crítico' },
}

export default async function CasoDetallePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    // Fetch expediente with all related data
    const { data: expediente, error } = await supabase
        .from('expedientes')
        .select(`
            *,
            personas (*),
            valoraciones_riesgo (*),
            medidas (*),
            actuaciones (*),
            seguimientos (*),
            audiencias (*),
            terminos_legales (*),
            incidentes_incumplimiento (*)
        `)
        .eq('id', id)
        .single()

    if (error || !expediente) return notFound()

    const faseActual = (expediente.fase_proceso as FaseProceso) || 'RECEPCION'
    const victima = expediente.personas?.find((p: any) => p.tipo === 'VICTIMA')
    const agresor = expediente.personas?.find((p: any) => p.tipo === 'AGRESOR')
    const riesgoConfig = RIESGO_CONFIG[expediente.nivel_riesgo] || RIESGO_CONFIG.SIN_RIESGO

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-slate-800">Expediente {expediente.radicado}</h1>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${riesgoConfig.bg} ${riesgoConfig.text}`}>
                            {riesgoConfig.label}
                        </span>
                    </div>
                    <p className="text-slate-500 mt-1">
                        {expediente.tipologia_violencia} — {expediente.estado}
                    </p>
                </div>
            </div>

            {/* === STEPPER DE 5 FASES === */}
            <Card className="border-0 shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <div className="flex items-center w-full overflow-x-auto scrollbar-hide snap-x snap-mandatory">
                        {FASES_ORDEN.map((fase, i) => {
                            const completada = faseCompletada(faseActual, fase)
                            const esActual = fase === faseActual
                            const info = FASES_INFO[fase]

                            return (
                                <div key={fase} className="flex-1 relative min-w-[80px] snap-center">
                                    <div className={`flex flex-col items-center py-3 sm:py-4 px-2 transition-all
                                        ${esActual ? 'bg-blue-50 border-b-2 border-blue-600' : ''}
                                        ${completada ? 'bg-emerald-50/50' : ''}
                                    `}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2
                                            ${esActual ? 'bg-blue-600 text-white shadow-md' : ''}
                                            ${completada ? 'bg-emerald-500 text-white' : ''}
                                            ${!esActual && !completada ? 'bg-slate-200 text-slate-400' : ''}
                                        `}>
                                            {completada ? <CheckCircle className="h-5 w-5" /> : FASE_ICONS[fase]}
                                        </div>
                                        <span className={`text-xs font-semibold text-center leading-tight
                                            ${esActual ? 'text-blue-700' : ''}
                                            ${completada ? 'text-emerald-700' : ''}
                                            ${!esActual && !completada ? 'text-slate-400' : ''}
                                        `}>
                                            {info.nombre}
                                        </span>
                                    </div>
                                    {/* Connector */}
                                    {i < FASES_ORDEN.length - 1 && (
                                        <div className="absolute top-7 right-0 translate-x-1/2 z-10">
                                            <ChevronRight className={`h-4 w-4 ${completada ? 'text-emerald-400' : 'text-slate-300'}`} />
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* === ALERTAS DE TÉRMINOS LEGALES === */}
            {expediente.terminos_legales?.length > 0 && (
                <div className="grid gap-3 md:grid-cols-2">
                    {expediente.terminos_legales.map((termino: any) => {
                        const semaforo = obtenerSemaforoTermino(termino as TerminoLegal)
                        const tiempoRestante = formatearTiempoRestante(termino.fecha_vencimiento)
                        const semaforoColors = {
                            VERDE: 'border-emerald-200 bg-emerald-50',
                            AMARILLO: 'border-amber-200 bg-amber-50',
                            ROJO: 'border-red-200 bg-red-50'
                        }
                        const semaforoText = {
                            VERDE: 'text-emerald-700',
                            AMARILLO: 'text-amber-700',
                            ROJO: 'text-red-700'
                        }
                        return (
                            <div key={termino.id} className={`p-3 rounded-lg border ${semaforoColors[semaforo]} flex items-center gap-3`}>
                                <div className={`p-2 rounded-full ${semaforo === 'ROJO' ? 'bg-red-200' : semaforo === 'AMARILLO' ? 'bg-amber-200' : 'bg-emerald-200'}`}>
                                    {semaforo === 'ROJO' ? <AlertTriangle className="h-4 w-4 text-red-700" /> : <Clock className="h-4 w-4" />}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm font-semibold ${semaforoText[semaforo]}`}>{termino.tipo.replace(/_/g, ' ')}</p>
                                    <p className="text-xs text-slate-500">{termino.cumplido ? '✅ Cumplido' : tiempoRestante}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* === CONTENIDO POR FASE === */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Column (2/3) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* FASE 1: RECEPCIÓN */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="border-b bg-slate-50/50">
                            <div className="flex items-center gap-2">
                                <ClipboardList className="h-5 w-5 text-blue-600" />
                                <CardTitle className="text-base">Fase 1: Recepción y Registro</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-slate-400 text-xs uppercase tracking-wide">Radicado</p>
                                    <p className="font-mono font-bold text-blue-700">{expediente.radicado}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs uppercase tracking-wide">Fecha Apertura</p>
                                    <p>{new Date(expediente.created_at).toLocaleDateString('es-CO')}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs uppercase tracking-wide">Tipología</p>
                                    <p className="font-medium">{expediente.tipologia_violencia}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs uppercase tracking-wide">Competencia</p>
                                    <p>{expediente.es_competencia ? '✅ Verificada' : '⚠️ Pendiente'}</p>
                                </div>
                            </div>

                            {/* Personas */}
                            <div className="grid md:grid-cols-2 gap-4">
                                {victima && (
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <User className="h-4 w-4 text-blue-600" />
                                            <p className="text-xs font-bold text-blue-700 uppercase">Víctima</p>
                                        </div>
                                        <p className="font-semibold text-slate-800">{victima.nombres}</p>
                                        <p className="text-xs text-slate-500">{victima.tipo_documento}: {victima.documento}</p>
                                        {victima.telefono && <p className="text-xs text-slate-500">Tel: {victima.telefono}</p>}
                                    </div>
                                )}
                                {agresor && (
                                    <div className="p-3 bg-red-50 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <UserX className="h-4 w-4 text-red-600" />
                                            <p className="text-xs font-bold text-red-700 uppercase">Agresor</p>
                                        </div>
                                        <p className="font-semibold text-slate-800">{agresor.nombres}</p>
                                        <p className="text-xs text-slate-500">Doc: {agresor.documento}</p>
                                        {agresor.acceso_armas && <p className="text-xs text-red-600 font-semibold">⚠️ Acceso a armas</p>}
                                    </div>
                                )}
                            </div>

                            {expediente.hechos_relato && (
                                <div>
                                    <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Relato de Hechos</p>
                                    <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded">{expediente.hechos_relato}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* FASE 2: VALORACIÓN */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="border-b bg-slate-50/50">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <HeartPulse className="h-5 w-5 text-purple-600" />
                                    <CardTitle className="text-base">Fase 2: Valoración Interdisciplinaria</CardTitle>
                                </div>
                                <Link href={`/dashboard/casos/${id}/valoracion`}>
                                    <Button size="sm" variant="outline" className="gap-1">
                                        Nueva Valoración <ArrowRight size={14} />
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            {(!expediente.valoraciones_riesgo || expediente.valoraciones_riesgo.length === 0) ? (
                                <p className="text-sm text-slate-400 py-4 text-center">No se han realizado valoraciones de riesgo.</p>
                            ) : (
                                <div className="space-y-3">
                                    {expediente.valoraciones_riesgo.map((val: any) => (
                                        <div key={val.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                            <div className={`px-2 py-1 rounded-full text-xs font-bold ${RIESGO_CONFIG[val.nivel_riesgo_calculado]?.bg || ''} ${RIESGO_CONFIG[val.nivel_riesgo_calculado]?.text || ''}`}>
                                                {val.nivel_riesgo_calculado}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-slate-700">{val.recomendacion_medidas || 'Sin observaciones'}</p>
                                                <p className="text-xs text-slate-400">{new Date(val.fecha_valoracion).toLocaleString('es-CO')}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* FASE 3: MEDIDAS */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="border-b bg-slate-50/50">
                            <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-amber-600" />
                                <CardTitle className="text-base">Fase 3: Medidas de Protección</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            {/* Medidas */}
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Medidas Dictadas</p>
                                {(!expediente.medidas || expediente.medidas.length === 0) ? (
                                    <p className="text-sm text-slate-400 text-center py-3">No se han dictado medidas.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {expediente.medidas.map((m: any) => (
                                            <div key={m.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                                <ShieldAlert className={`h-4 w-4 ${m.categoria === 'PROVISIONAL' ? 'text-amber-600' : 'text-emerald-600'}`} />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">{m.tipo} ({m.categoria})</p>
                                                    {m.descripcion && <p className="text-xs text-slate-500">{m.descripcion}</p>}
                                                </div>
                                                <span className={`text-xs px-2 py-1 rounded-full ${m.estado === 'VIGENTE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                                    {m.estado}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Audiencias */}
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Audiencias</p>
                                {(!expediente.audiencias || expediente.audiencias.length === 0) ? (
                                    <p className="text-sm text-slate-400 text-center py-3">No se han programado audiencias.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {expediente.audiencias.map((a: any) => (
                                            <div key={a.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                                <Scale className="h-4 w-4 text-violet-600" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">{a.tipo?.replace(/_/g, ' ')}</p>
                                                    <p className="text-xs text-slate-500">
                                                        {new Date(a.fecha_programada).toLocaleString('es-CO')}
                                                    </p>
                                                </div>
                                                <span className={`text-xs px-2 py-1 rounded-full ${a.estado === 'PROGRAMADA' ? 'bg-blue-100 text-blue-700' : a.estado === 'REALIZADA' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {a.estado}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* FASE 4: SEGUIMIENTO */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="border-b bg-slate-50/50">
                            <div className="flex items-center gap-2">
                                <Eye className="h-5 w-5 text-emerald-600" />
                                <CardTitle className="text-base">Fase 4: Seguimiento</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            {(!expediente.seguimientos || expediente.seguimientos.length === 0) ? (
                                <p className="text-sm text-slate-400 text-center py-3">No hay seguimientos registrados.</p>
                            ) : (
                                <div className="space-y-2">
                                    {expediente.seguimientos.map((s: any) => (
                                        <div key={s.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                            <CalendarDays className="h-4 w-4 text-emerald-600" />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{s.tipo?.replace(/_/g, ' ')}</p>
                                                <p className="text-xs text-slate-500">
                                                    Programado: {new Date(s.fecha_programada).toLocaleDateString('es-CO')}
                                                    {s.fecha_realizada && ` — Realizado: ${new Date(s.fecha_realizada).toLocaleDateString('es-CO')}`}
                                                </p>
                                                {s.observaciones && <p className="text-xs text-slate-500 mt-1">{s.observaciones}</p>}
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full ${s.cumplimiento ? 'bg-emerald-100 text-emerald-700' : s.fecha_realizada ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                                                {s.cumplimiento ? 'Cumple' : s.fecha_realizada ? 'No Cumple' : 'Pendiente'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* FASE 5: CIERRE / INCUMPLIMIENTO */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="border-b bg-slate-50/50">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-slate-600" />
                                <CardTitle className="text-base">Fase 5: Cierre o Incumplimiento</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            {(!expediente.incidentes_incumplimiento || expediente.incidentes_incumplimiento.length === 0) ? (
                                <p className="text-sm text-slate-400 text-center py-3">
                                    {expediente.estado === 'CERRADO'
                                        ? '✅ Expediente cerrado. Se superó el riesgo y se levantaron las medidas.'
                                        : 'No se han registrado incidentes de incumplimiento.'}
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {expediente.incidentes_incumplimiento.map((inc: any) => (
                                        <div key={inc.id} className="p-3 bg-red-50 rounded-lg border border-red-200">
                                            <p className="text-sm font-semibold text-red-800">Incidente de Incumplimiento</p>
                                            <p className="text-sm text-red-700 mt-1">{inc.descripcion_incumplimiento}</p>
                                            <div className="flex gap-4 mt-2 text-xs text-red-500">
                                                <span>Sanción: {inc.sancion_tipo || 'Pendiente'}</span>
                                                <span>Estado: {inc.estado}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Column (1/3) — Actuaciones / Timeline */}
                <div className="space-y-6">
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="border-b bg-slate-50/50">
                            <CardTitle className="text-base flex items-center gap-2">
                                <FileText className="h-4 w-4" /> Historial de Actuaciones
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            {(!expediente.actuaciones || expediente.actuaciones.length === 0) ? (
                                <p className="text-sm text-slate-400 text-center py-3">Sin actuaciones registradas.</p>
                            ) : (
                                <div className="space-y-3">
                                    {expediente.actuaciones
                                        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                                        .map((act: any) => (
                                            <div key={act.id} className="relative pl-4 border-l-2 border-slate-200 pb-3">
                                                <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-blue-500" />
                                                <p className="text-xs text-slate-400">{new Date(act.created_at).toLocaleString('es-CO')}</p>
                                                <p className="text-sm font-medium text-slate-700">{act.tipo?.replace(/_/g, ' ')}</p>
                                                {act.contenido && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{act.contenido}</p>}
                                            </div>
                                        ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Info */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="border-b bg-slate-50/50">
                            <CardTitle className="text-base">Información del Expediente</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Estado</span>
                                <span className="font-medium">{expediente.estado}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Fase</span>
                                <span className="font-medium">{FASES_INFO[faseActual]?.nombre}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Nivel Riesgo</span>
                                <span className={`font-medium ${riesgoConfig.text}`}>{riesgoConfig.label}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Personas</span>
                                <span className="font-medium">{expediente.personas?.length || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Actuaciones</span>
                                <span className="font-medium">{expediente.actuaciones?.length || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Medidas</span>
                                <span className="font-medium">{expediente.medidas?.length || 0}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
