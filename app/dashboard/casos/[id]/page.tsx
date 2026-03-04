
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

// Iconos más pequeños para el stepper móvil
const FASE_ICONS_SM: Record<FaseProceso, React.ReactNode> = {
    RECEPCION: <ClipboardList className="h-4 w-4" />,
    VALORACION: <HeartPulse className="h-4 w-4" />,
    MEDIDAS: <Shield className="h-4 w-4" />,
    SEGUIMIENTO: <Eye className="h-4 w-4" />,
    CIERRE: <CheckCircle className="h-4 w-4" />,
}

const RIESGO_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
    SIN_RIESGO: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Sin Riesgo' },
    BAJO: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Bajo' },
    MODERADO: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Moderado' },
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
        <div className="space-y-6 max-w-[1400px] mx-auto z-10 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Expediente {expediente.radicado}</h1>
                        <span className={`inline-flex px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm ${riesgoConfig.bg} ${riesgoConfig.text}`}>
                            {riesgoConfig.label}
                        </span>
                    </div>
                    <p className="text-slate-500 mt-2 font-medium italic">
                        {expediente.tipologia_violencia} — <span className="text-blue-600 font-bold">{expediente.estado}</span>
                    </p>
                </div>
            </div>

            {/* === STEPPER DE 5 FASES === */}
            <Card className="border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden bg-white rounded-2xl">
                <CardContent className="p-0">
                    {/* Desktop/Tablet: Horizontal stepper (sm+) */}
                    <div className="hidden sm:flex items-center w-full overflow-x-auto scrollbar-hide">
                        {FASES_ORDEN.map((fase, i) => {
                            const completada = faseCompletada(faseActual, fase)
                            const esActual = fase === faseActual
                            const info = FASES_INFO[fase]

                            return (
                                <div key={fase} className="flex-1 relative min-w-[80px]">
                                    <div className={`flex flex-col items-center py-6 px-2 transition-all
                                        ${esActual ? 'bg-blue-50 border-b-4 border-blue-600' : ''}
                                        ${completada ? 'bg-emerald-50/30' : ''}
                                    `}>
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 shadow-sm
                                            ${esActual ? 'bg-blue-600 text-white scale-110 shadow-blue-200' : ''}
                                            ${completada ? 'bg-emerald-500 text-white' : ''}
                                            ${!esActual && !completada ? 'bg-slate-100 text-slate-400' : ''}
                                        `}>
                                            {completada ? <CheckCircle className="h-6 w-6" /> : FASE_ICONS[fase]}
                                        </div>
                                        <span className={`text-[11px] font-black text-center uppercase tracking-wider
                                            ${esActual ? 'text-blue-700' : ''}
                                            ${completada ? 'text-emerald-700' : ''}
                                            ${!esActual && !completada ? 'text-slate-400' : ''}
                                        `}>
                                            {info.nombre}
                                        </span>
                                    </div>
                                    {/* Connector */}
                                    {i < FASES_ORDEN.length - 1 && (
                                        <div className="absolute top-9 right-0 translate-x-1/2 z-10">
                                            <ChevronRight className={`h-5 w-5 ${completada ? 'text-emerald-400' : 'text-slate-200'}`} />
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* Mobile: Vertical compact stepper (< sm) */}
                    <div className="sm:hidden px-4 py-3">
                        <div className="flex flex-col gap-0">
                            {FASES_ORDEN.map((fase, i) => {
                                const completada = faseCompletada(faseActual, fase)
                                const esActual = fase === faseActual
                                const info = FASES_INFO[fase]
                                const isLast = i === FASES_ORDEN.length - 1

                                return (
                                    <div key={fase} className="flex items-stretch gap-3">
                                        {/* Vertical line + circle */}
                                        <div className="flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm
                                                ${esActual ? 'bg-blue-600 text-white' : ''}
                                                ${completada ? 'bg-emerald-500 text-white' : ''}
                                                ${!esActual && !completada ? 'bg-slate-100 text-slate-400' : ''}
                                            `}>
                                                {completada ? <CheckCircle className="h-5 w-5" /> : FASE_ICONS_SM[fase]}
                                            </div>
                                            {!isLast && (
                                                <div className={`w-0.5 flex-1 min-h-[16px] ${completada ? 'bg-emerald-300' : 'bg-slate-100'}`} />
                                            )}
                                        </div>
                                        {/* Phase label */}
                                        <div className="pb-5 pt-1">
                                            <p className={`text-sm font-black uppercase tracking-wider
                                                ${esActual ? 'text-blue-700' : ''}
                                                ${completada ? 'text-emerald-700' : ''}
                                                ${!esActual && !completada ? 'text-slate-400' : ''}
                                            `}>
                                                {info.nombre}
                                            </p>
                                            {esActual && (
                                                <span className="text-[10px] text-blue-500 font-medium">Fase actual</span>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
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
                            VERDE: 'border-emerald-200 bg-emerald-50 text-emerald-800',
                            AMARILLO: 'border-amber-200 bg-amber-50 text-amber-800',
                            ROJO: 'border-red-200 bg-red-50 text-red-800'
                        }
                        return (
                            <div key={termino.id} className={`p-4 rounded-2xl border shadow-sm ${semaforoColors[semaforo]} flex items-center gap-4 animate-pulse`}>
                                <div className={`p-3 rounded-xl shadow-inner ${semaforo === 'ROJO' ? 'bg-red-100' : semaforo === 'AMARILLO' ? 'bg-amber-100' : 'bg-emerald-100'}`}>
                                    {semaforo === 'ROJO' ? <AlertTriangle className="h-5 w-5 text-red-600" /> : <Clock className="h-5 w-5" />}
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-black uppercase tracking-[0.2em] opacity-60 mb-1">{termino.tipo.replace(/_/g, ' ')}</p>
                                    <p className="font-black text-sm">
                                        {termino.cumplido ? 'TAREA FINALIZADA ✅' : `VENCE: ${tiempoRestante.toUpperCase()}`}
                                    </p>
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
                    <Card className="border border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-xl">
                                    <ClipboardList className="h-6 w-6 text-blue-700" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight">Fase 1: Registro Inicial</CardTitle>
                                    <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Radicación y apertura del proceso</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                <div>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Identificador Radicado</p>
                                    <p className="font-mono font-black text-blue-700 bg-white px-3 py-1 rounded-lg border border-blue-100 inline-block">{expediente.radicado}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Fecha Apertura</p>
                                    <p className="font-bold text-slate-700">{new Date(expediente.created_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Tipología de Violencia</p>
                                    <p className="font-bold text-slate-700 uppercase">{expediente.tipologia_violencia}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Estado Transaccional</p>
                                    <p className="font-bold text-slate-700">{expediente.es_competencia ? '✅ COMPETENCIA VERIFICADA' : '⚠️ VALIDACIÓN PENDIENTE'}</p>
                                </div>
                            </div>

                            {/* Personas */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {victima && (
                                    <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl shadow-sm group hover:bg-blue-100 transition-colors">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-blue-600 rounded-lg shadow-blue-200 shadow-lg">
                                                <User className="h-5 w-5 text-white" />
                                            </div>
                                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Sujeto de Protección</p>
                                        </div>
                                        <p className="text-lg font-black text-slate-900 mb-1">{victima.nombres}</p>
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-slate-500">{victima.tipo_documento}: <span className="font-mono text-slate-900">{victima.documento}</span></p>
                                            {victima.telefono && <p className="text-xs font-bold text-slate-500">TEL: <span className="text-slate-900">{victima.telefono}</span></p>}
                                        </div>
                                    </div>
                                )}
                                {agresor && (
                                    <div className="p-5 bg-red-50 border border-red-100 rounded-2xl shadow-sm group hover:bg-red-100 transition-colors">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-red-600 rounded-lg shadow-red-200 shadow-lg">
                                                <UserX className="h-5 w-5 text-white" />
                                            </div>
                                            <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em]">Sujeto Agresor</p>
                                        </div>
                                        <p className="text-lg font-black text-slate-900 mb-1">{agresor.nombres}</p>
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-slate-500">IDENTIFICACIÓN: <span className="font-mono text-slate-900">{agresor.documento}</span></p>
                                            {agresor.acceso_armas && <p className="text-[10px] font-black text-red-600 bg-white border border-red-200 px-2 py-1 rounded-md inline-block mt-2 animate-bounce">⚠️ ACCESO A ARMAS DETECTADO</p>}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {expediente.hechos_relato && (
                                <div className="mt-4">
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Detalle de los Hechos</p>
                                    <p className="text-sm text-slate-700 bg-slate-50 p-5 rounded-2xl border border-slate-100 leading-relaxed font-medium italic">"{expediente.hechos_relato}"</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* FASE 2: VALORACIÓN */}
                    <Card className="border border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-rose-100 rounded-xl">
                                        <HeartPulse className="h-6 w-6 text-rose-700" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight">Fase 2: Valoración de Riesgo</CardTitle>
                                        <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Intervención de equipo interdisciplinario</CardDescription>
                                    </div>
                                </div>
                                <Link href={`/dashboard/casos/${id}/valoracion`}>
                                    <Button size="sm" className="bg-blue-900 hover:bg-rose-700 text-white gap-2 px-5 py-5 rounded-xl font-bold transition-all shadow-md">
                                        Nueva Valoración <ArrowRight size={16} />
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            {(!expediente.valoraciones_riesgo || expediente.valoraciones_riesgo.length === 0) ? (
                                <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                                    <HeartPulse className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Sin diligencias de valoración</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {expediente.valoraciones_riesgo.map((val: any) => (
                                        <div key={val.id} className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
                                            <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm ${RIESGO_CONFIG[val.nivel_riesgo_calculado]?.bg || ''} ${RIESGO_CONFIG[val.nivel_riesgo_calculado]?.text || ''}`}>
                                                {val.nivel_riesgo_calculado}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-slate-800 italic line-clamp-1">"{val.recomendacion_medidas || 'Sin observaciones detalladas'}"</p>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{new Date(val.fecha_valoracion).toLocaleString('es-CO', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* FASE 3: MEDIDAS */}
                    <Card className="border border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-100 rounded-xl">
                                    <Shield className="h-6 w-6 text-amber-700" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight">Fase 3: Medidas y Audiencias</CardTitle>
                                    <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Garantías legales y debido proceso</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-8">
                            {/* Medidas */}
                            <div>
                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                    Acciones de Protección Activas
                                </h5>
                                {(!expediente.medidas || expediente.medidas.length === 0) ? (
                                    <div className="py-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">Sin medidas cautelares registradas</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-3">
                                        {expediente.medidas.map((m: any) => (
                                            <div key={m.id} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-amber-200 transition-colors">
                                                <div className={`p-2 rounded-lg ${m.categoria === 'PROVISIONAL' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    <ShieldAlert className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{m.tipo}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.categoria}</p>
                                                </div>
                                                <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${m.estado === 'VIGENTE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                                    {m.estado}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Audiencias */}
                            <div>
                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                    Cronograma Jurídico
                                </h5>
                                {(!expediente.audiencias || expediente.audiencias.length === 0) ? (
                                    <div className="py-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">Sin citaciones programadas</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-3">
                                        {expediente.audiencias.map((a: any) => (
                                            <div key={a.id} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-blue-200 transition-colors">
                                                <div className="p-2 bg-slate-100 rounded-lg">
                                                    <Scale className="h-4 w-4 text-slate-700" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{a.tipo?.replace(/_/g, ' ')}</p>
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                                                        {new Date(a.fecha_programada).toLocaleString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                                <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-sm ${a.estado === 'PROGRAMADA' ? 'bg-blue-100 text-blue-700' : a.estado === 'REALIZADA' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
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
                    <Card className="border border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 rounded-xl">
                                    <Eye className="h-6 w-6 text-emerald-700" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight">Fase 4: Seguimiento Extendido</CardTitle>
                                    <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Monitoreo de eficacia y cumplimiento</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            {(!expediente.seguimientos || expediente.seguimientos.length === 0) ? (
                                <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest italic">Sin bitácora de seguimientos</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {expediente.seguimientos.map((s: any) => (
                                        <div key={s.id} className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                            <div className="p-2 bg-emerald-50 rounded-lg">
                                                <CalendarDays className="h-5 w-5 text-emerald-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{s.tipo?.replace(/_/g, ' ')}</p>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5 italic">
                                                    Plan: {new Date(s.fecha_programada).toLocaleDateString('es-CO')}
                                                    {s.fecha_realizada && ` — Realizado: ${new Date(s.fecha_realizada).toLocaleDateString('es-CO')}`}
                                                </p>
                                                {s.observaciones && <p className="text-xs text-slate-600 mt-2 font-medium italic">"{s.observaciones}"</p>}
                                            </div>
                                            <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-sm ${s.cumplimiento ? 'bg-emerald-100 text-emerald-700' : s.fecha_realizada ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'}`}>
                                                {s.cumplimiento ? 'CUMPLE' : s.fecha_realizada ? 'INCUMPLE' : 'PENDIENTE'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* FASE 5: CIERRE / INCUMPLIMIENTO */}
                    <Card className="border border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-200 rounded-xl">
                                    <CheckCircle className="h-6 w-6 text-slate-700" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight">Fase 5: Cierre de Proceso</CardTitle>
                                    <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Finalización de vigencia o incidentes</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            {(!expediente.incidentes_incumplimiento || expediente.incidentes_incumplimiento.length === 0) ? (
                                <div className="py-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-sm font-black text-slate-500 uppercase tracking-widest italic">
                                        {expediente.estado === 'CERRADO'
                                            ? '✅ PROCESO FINALIZADO CON ÉXITO'
                                            : 'SITUACIÓN CONTROLADA — SIN INCIDENTES'}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {expediente.incidentes_incumplimiento.map((inc: any) => (
                                        <div key={inc.id} className="p-5 bg-red-50 border border-red-200 rounded-2xl shadow-sm animate-pulse">
                                            <div className="flex items-center gap-2 mb-3">
                                                <ShieldAlert className="h-5 w-5 text-red-600" />
                                                <p className="text-sm font-black text-red-700 uppercase tracking-tight">INCIDENTE DE INCUMPLIMIENTO GESTIONADO</p>
                                            </div>
                                            <p className="text-sm text-red-800 font-bold bg-white p-3 rounded-xl border border-red-100 italic">"{inc.descripcion_incumplimiento}"</p>
                                            <div className="flex gap-4 mt-3">
                                                <span className="text-[10px] font-black text-red-600 uppercase tracking-widest bg-white px-2 py-1 rounded border border-red-100 italic">SANCIÓN: {inc.sancion_tipo || 'EN TRÁMITE'}</span>
                                                <span className="text-[10px] font-black text-red-600 uppercase tracking-widest bg-white px-2 py-1 rounded border border-red-100">ESTADO: {inc.estado}</span>
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
                    <Card className="border border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 p-5">
                            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3 text-slate-800">
                                <FileText className="h-5 w-5 text-blue-600" /> Bitácora Digital
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5">
                            {(!expediente.actuaciones || expediente.actuaciones.length === 0) ? (
                                <p className="text-sm text-slate-400 font-bold italic text-center py-6">Sin actuaciones registradas</p>
                            ) : (
                                <div className="space-y-6 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                                    {expediente.actuaciones
                                        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                                        .map((act: any) => (
                                            <div key={act.id} className="relative pl-6 group">
                                                <div className="absolute left-0 top-1.5 w-[14px] h-[14px] rounded-full border-2 border-white bg-blue-600 shadow-sm z-10 transition-transform group-hover:scale-125" />
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{new Date(act.created_at).toLocaleString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                                                <p className="text-sm font-black text-slate-800 uppercase tracking-tight group-hover:text-blue-700 transition-colors">{act.tipo?.replace(/_/g, ' ')}</p>
                                                {act.contenido && <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed font-medium italic">"{act.contenido}"</p>}
                                            </div>
                                        ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Info */}
                    <Card className="border border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 p-5">
                            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-800">Cifras del Proceso</CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 space-y-4">
                            <div className="flex justify-between items-center p-2 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</span>
                                <span className="text-xs font-black text-blue-700 uppercase tracking-wider">{expediente.estado}</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fase Activa</span>
                                <span className="text-xs font-black text-slate-800 uppercase tracking-wider">{FASES_INFO[faseActual]?.nombre}</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Carga Riesgo</span>
                                <span className={`text-xs font-black uppercase tracking-wider ${riesgoConfig.text}`}>{riesgoConfig.label}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-4">
                                <div className="text-center p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                                    <p className="text-lg font-black text-slate-900">{expediente.personas?.length || 0}</p>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Sujetos</p>
                                </div>
                                <div className="text-center p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                                    <p className="text-lg font-black text-slate-900">{expediente.actuaciones?.length || 0}</p>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Eventos</p>
                                </div>
                                <div className="text-center p-3 bg-white border border-slate-100 rounded-xl shadow-sm col-span-2">
                                    <p className="text-lg font-black text-slate-900">{expediente.medidas?.length || 0}</p>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Medidas de Protección</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
