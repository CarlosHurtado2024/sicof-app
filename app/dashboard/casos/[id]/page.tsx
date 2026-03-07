
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

const RIESGO_CONFIG: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    SIN_RIESGO: { bg: 'bg-white/[0.06] border-white/[0.1]', text: 'text-white/40', dot: 'bg-white/20', label: 'Sin Riesgo' },
    BAJO: { bg: 'bg-emerald-500/10 border-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-500', label: 'Bajo' },
    MODERADO: { bg: 'bg-amber-500/10 border-amber-500/20', text: 'text-amber-400', dot: 'bg-amber-500', label: 'Moderado' },
    ALTO: { bg: 'bg-[#ff7a59]/10 border-[#ff7a59]/20', text: 'text-[#ff7a59]', dot: 'bg-[#ff7a59]', label: 'Alto' },
    CRITICO: { bg: 'bg-red-500/10 border-red-500/20', text: 'text-red-400', dot: 'bg-red-500', label: 'Crítico' },
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
        <div className="space-y-8 max-w-[1400px] mx-auto pb-10">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-white/35 text-[10px] font-bold uppercase tracking-widest animate-fade-in">
                <Link href="/dashboard/casos" className="hover:text-[#ff7a59] transition-colors">Expedientes</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-[#ff7a59]">Detalle de Caso</span>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div>
                    <div className="flex flex-wrap items-center gap-4">
                        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-display">Expediente {expediente.radicado}</h1>
                        <span className={`inline-flex px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] border shadow-sm ${riesgoConfig.bg} ${riesgoConfig.text}`}>
                            <span className={`w-2 h-2 rounded-full mr-2 inline-block ${riesgoConfig.dot}`}></span>
                            Nivel: {riesgoConfig.label}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                        <span className="text-xs font-bold text-white/45 bg-white/[0.05] px-3 py-1 rounded-lg border border-white/[0.08] uppercase tracking-tighter">
                            {expediente.tipologia_violencia}
                        </span>
                        <span className="text-xs font-bold text-[#ff7a59] bg-[#ff7a59]/5 px-3 py-1 rounded-lg border border-[#F28C73]/10 uppercase tracking-tighter">
                            {expediente.estado}
                        </span>
                    </div>
                </div>
            </div>

            {/* === STEPPER DE 5 FASES === */}
            <Card className="border border-white/[0.08] shadow-sm overflow-hidden bg-white/[0.03] rounded-xl">
                <CardContent className="p-0">
                    {/* Desktop/Tablet: Horizontal stepper (sm+) */}
                    <div className="hidden sm:flex items-center w-full overflow-x-auto scrollbar-hide">
                        {FASES_ORDEN.map((fase, i) => {
                            const completada = faseCompletada(faseActual, fase)
                            const esActual = fase === faseActual
                            const info = FASES_INFO[fase]

                            return (
                                <div key={fase} className="flex-1 relative min-w-[100px]">
                                    <div className={`flex flex-col items-center py-8 px-4 transition-all duration-300
                                        ${esActual ? 'bg-[#ff7a59]/5 border-b-2 border-[#F28C73]' : ''}
                                        ${completada ? 'bg-emerald-50/20' : ''}
                                    `}>
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-all duration-500 shadow-sm
                                            ${esActual ? 'bg-[#ff7a59] text-white ring-4 ring-[#ff7a59]/10' : ''}
                                            ${completada ? 'bg-emerald-500 text-white' : ''}
                                            ${!esActual && !completada ? 'bg-white/[0.05] text-white/25 border border-white/[0.08]' : ''}
                                        `}>
                                            {completada ? <CheckCircle className="h-5 w-5" /> : FASE_ICONS[fase]}
                                        </div>
                                        <span className={`text-[10px] font-bold text-center uppercase tracking-[0.15em]
                                            ${esActual ? 'text-[#ff7a59]' : ''}
                                            ${completada ? 'text-emerald-400' : ''}
                                            ${!esActual && !completada ? 'text-white/35' : ''}
                                        `}>
                                            {info.nombre}
                                        </span>
                                    </div>
                                    {/* Connector */}
                                    {i < FASES_ORDEN.length - 1 && (
                                        <div className="absolute top-10 right-0 translate-x-1/2 z-10 opacity-30">
                                            <ChevronRight className={`h-4 w-4 ${completada ? 'text-emerald-500' : 'text-white/25'}`} />
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* Mobile: Vertical compact stepper (< sm) */}
                    <div className="sm:hidden px-6 py-6 border-t border-white/[0.08] bg-white/[0.02]">
                        <div className="flex flex-col gap-0">
                            {FASES_ORDEN.map((fase, i) => {
                                const completada = faseCompletada(faseActual, fase)
                                const esActual = fase === faseActual
                                const info = FASES_INFO[fase]
                                const isLast = i === FASES_ORDEN.length - 1

                                return (
                                    <div key={fase} className="flex items-stretch gap-4">
                                        {/* Vertical line + circle */}
                                        <div className="flex flex-col items-center">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm
                                                ${esActual ? 'bg-[#ff7a59] text-white ring-2 ring-[#ff7a59]/20' : ''}
                                                ${completada ? 'bg-emerald-500 text-white' : ''}
                                                ${!esActual && !completada ? 'bg-white/[0.05] text-white/25 border border-white/[0.08]' : ''}
                                            `}>
                                                {completada ? <CheckCircle className="h-4 w-4" /> : FASE_ICONS_SM[fase]}
                                            </div>
                                            {!isLast && (
                                                <div className={`w-[2px] flex-1 min-h-[20px] ${completada ? 'bg-emerald-500/30' : 'bg-white/[0.06]'}`} />
                                            )}
                                        </div>
                                        {/* Phase label */}
                                        <div className="pb-6 pt-1">
                                            <p className={`text-xs font-bold uppercase tracking-widest
                                                ${esActual ? 'text-[#ff7a59]' : ''}
                                                ${completada ? 'text-emerald-400' : ''}
                                                ${!esActual && !completada ? 'text-white/35' : ''}
                                            `}>
                                                {info.nombre}
                                            </p>
                                            {esActual && (
                                                <span className="text-[9px] text-[#ff7a59]/70 font-bold uppercase bg-[#ff7a59]/5 px-2 py-0.5 rounded-full mt-1 inline-block">Fase activa</span>
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
                <div className="grid gap-4 md:grid-cols-2">
                    {expediente.terminos_legales.map((termino: any) => {
                        const semaforo = obtenerSemaforoTermino(termino as TerminoLegal)
                        const tiempoRestante = formatearTiempoRestante(termino.fecha_vencimiento)
                        const semaforoStyles = {
                            VERDE: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300 ring-emerald-500/10',
                            AMARILLO: 'border-amber-500/20 bg-amber-500/10 text-amber-300 ring-amber-500/10',
                            ROJO: 'border-red-500/20 bg-red-500/10 text-red-300 ring-red-500/10'
                        }
                        const iconColors = {
                            VERDE: 'bg-emerald-500/15 text-emerald-400',
                            AMARILLO: 'bg-amber-500/15 text-amber-400',
                            ROJO: 'bg-red-500/15 text-red-400'
                        }
                        return (
                            <div key={termino.id} className={`p-4 rounded-xl border-2 ring-4 shadow-sm ${semaforoStyles[semaforo]} flex items-center gap-4 transition-all hover:scale-[1.01] ${semaforo === 'ROJO' ? 'animate-pulse' : ''}`}>
                                <div className={`p-3 rounded-lg ${iconColors[semaforo]}`}>
                                    {semaforo === 'ROJO' ? <AlertTriangle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mb-0.5">{termino.tipo.replace(/_/g, ' ')}</p>
                                    <p className="font-bold text-sm tracking-tight uppercase">
                                        {termino.cumplido ? 'TAREA FINALIZADA ✅' : `Vence: ${tiempoRestante}`}
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
                    <Card className="border border-white/[0.08] shadow-sm rounded-xl overflow-hidden bg-white/[0.03]">
                        <CardHeader className="bg-white/[0.02] border-b border-white/[0.08] p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#ff7a59]/10 rounded-lg">
                                    <ClipboardList className="h-5 w-5 text-[#ff7a59]" />
                                </div>
                                <div>
                                    <CardTitle className="text-sm font-bold text-white uppercase tracking-widest">Fase 1: Apertura y Registro</CardTitle>
                                    <CardDescription className="text-[10px] font-medium text-white/35 uppercase tracking-[0.15em] mt-1">Radicación y verificación de competencia</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-6 bg-white/[0.04] rounded-xl border border-white/[0.08]">
                                <div>
                                    <p className="text-white/35 text-[9px] font-bold uppercase tracking-[0.2em] mb-2">Folio del Expediente</p>
                                    <p className="font-mono font-bold text-white bg-white/[0.05] px-3 py-1.5 rounded-md border border-white/[0.08] inline-block shadow-sm">#{expediente.radicado}</p>
                                </div>
                                <div>
                                    <p className="text-white/35 text-[9px] font-bold uppercase tracking-[0.2em] mb-2">Fecha de Auto Apertura</p>
                                    <p className="font-bold text-white/60 text-sm">{new Date(expediente.created_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-white/35 text-[9px] font-bold uppercase tracking-[0.2em] mb-2">Competencia Jurisdiccional</p>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${expediente.es_competencia ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                        <p className="font-bold text-white/60 text-xs uppercase">{expediente.es_competencia ? 'COMPETENCIA CONFIRMADA' : 'VALIDACIÓN PENDIENTE'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Personas */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {victima && (
                                    <div className="p-6 bg-white/[0.04] border border-emerald-500/20 rounded-xl shadow-sm group hover:border-[#ff7a59]/30 transition-all">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-emerald-500 rounded-lg shadow-sm">
                                                <User className="h-4 w-4 text-white" />
                                            </div>
                                            <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-[0.2em]">Víctima / Solicitante</p>
                                        </div>
                                        <p className="text-md font-bold text-white mb-2 truncate">{victima.nombres}</p>
                                        <div className="space-y-1.5 pt-2 border-t border-white/[0.08]">
                                            <p className="text-[10px] font-bold text-white/40 uppercase flex justify-between">
                                                <span>{victima.tipo_documento}</span>
                                                <span className="font-mono text-white">{victima.documento}</span>
                                            </p>
                                            {victima.telefono && (
                                                <p className="text-[10px] font-bold text-white/40 uppercase flex justify-between">
                                                    <span>Contacto</span>
                                                    <span className="text-white">{victima.telefono}</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {agresor && (
                                    <div className="p-6 bg-white/[0.04] border border-red-500/20 rounded-xl shadow-sm group hover:ring-2 hover:ring-red-100 transition-all">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-red-500 rounded-lg shadow-sm">
                                                <UserX className="h-4 w-4 text-white" />
                                            </div>
                                            <p className="text-[9px] font-bold text-red-400 uppercase tracking-[0.2em]">Agresor / Denunciado</p>
                                        </div>
                                        <p className="text-md font-bold text-white mb-2 truncate">{agresor.nombres}</p>
                                        <div className="space-y-1.5 pt-2 border-t border-white/[0.08]">
                                            <p className="text-[10px] font-bold text-white/40 uppercase flex justify-between">
                                                <span>Cédula</span>
                                                <span className="font-mono text-white">{agresor.documento}</span>
                                            </p>
                                            {agresor.acceso_armas && (
                                                <div className="bg-red-50 p-2 rounded-lg border border-red-500/20 mt-3 flex items-center gap-2">
                                                    <ShieldAlert className="h-3 w-3 text-red-400" />
                                                    <span className="text-[8px] font-bold text-red-400 uppercase tracking-widest leading-none">Peligro: Posee Armas</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {expediente.hechos_relato && (
                                <div className="mt-8 pt-8 border-t border-white/[0.08]">
                                    <p className="text-white/35 text-[9px] font-bold uppercase tracking-[0.2em] mb-4">Relato Consolidado por Recepción</p>
                                    <div className="text-sm text-gray-700 bg-white/[0.04] p-6 rounded-xl border border-white/[0.08] leading-relaxed font-medium italic shadow-inner">
                                        <span className="text-[#ff7a59] text-2xl font-serif mr-1">"</span>
                                        {expediente.hechos_relato}
                                        <span className="text-[#ff7a59] text-2xl font-serif ml-1">"</span>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* FASE 2: VALORACIÓN */}
                    <Card className="border border-white/[0.08] shadow-sm rounded-xl overflow-hidden bg-white/[0.03]">
                        <CardHeader className="bg-white/[0.02] border-b border-white/[0.08] p-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-rose-500/10 rounded-lg">
                                        <HeartPulse className="h-5 w-5 text-rose-500" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-sm font-bold text-white uppercase tracking-widest">Fase 2: Intervención Salud / Riesgo</CardTitle>
                                        <CardDescription className="text-[10px] font-medium text-white/35 uppercase tracking-[0.15em] mt-1">Valoración por equipo interdisciplinario</CardDescription>
                                    </div>
                                </div>
                                <Link href={`/dashboard/casos/${id}/valoracion`}>
                                    <Button size="sm" className="bg-[#ff7a59] hover:bg-[#ff6b47] text-white gap-2 px-6 h-10 rounded-lg font-bold transition-all text-[10px] uppercase tracking-widest">
                                        Añadir Evaluación <ArrowRight size={14} />
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            {(!expediente.valoraciones_riesgo || expediente.valoraciones_riesgo.length === 0) ? (
                                <div className="py-12 text-center bg-white/[0.04] rounded-xl border border-dashed border-white/[0.1]">
                                    <HeartPulse className="h-8 w-8 text-white/15 mx-auto mb-3" />
                                    <p className="text-[10px] font-bold text-white/35 uppercase tracking-widest">Sin registros de valoración</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {expediente.valoraciones_riesgo.map((val: any) => (
                                        <div key={val.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-white/[0.04] rounded-xl border border-white/[0.08] group hover:border-[#ff7a59]/20 transition-all">
                                            <div className={`px-3 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-widest self-start sm:self-center shadow-sm ${RIESGO_CONFIG[val.nivel_riesgo_calculado]?.bg || ''} ${RIESGO_CONFIG[val.nivel_riesgo_calculado]?.text || ''}`}>
                                                {val.nivel_riesgo_calculado}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-white/70 italic line-clamp-1">"{val.recomendacion_medidas || 'Sin observaciones'}"</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Clock className="h-3 w-3 text-white/25" />
                                                    <span className="text-[9px] font-bold text-white/35 uppercase tracking-widest">
                                                        {new Date(val.fecha_valoracion).toLocaleString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* FASE 3: MEDIDAS */}
                    <Card className="border border-white/[0.08] shadow-sm rounded-xl overflow-hidden bg-white/[0.03]">
                        <CardHeader className="bg-white/[0.02] border-b border-white/[0.08] p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-500/10 rounded-lg">
                                    <Shield className="h-5 w-5 text-amber-500" />
                                </div>
                                <div>
                                    <CardTitle className="text-sm font-bold text-white uppercase tracking-widest">Fase 3: Garantías y Medidas</CardTitle>
                                    <CardDescription className="text-[10px] font-medium text-white/35 uppercase tracking-[0.15em] mt-1">Protección legal y actuaciones judiciales</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-10">
                            {/* Medidas */}
                            <div>
                                <h5 className="text-[9px] font-bold text-white/35 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a59]"></span>
                                    Acciones de Protección Activas
                                </h5>
                                {(!expediente.medidas || expediente.medidas.length === 0) ? (
                                    <div className="py-8 text-center bg-white/[0.04] rounded-xl border border-white/[0.08]">
                                        <p className="text-[10px] font-bold text-white/35 uppercase tracking-widest italic">Sin medidas cautelares registradas</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-3">
                                        {expediente.medidas.map((m: any) => (
                                            <div key={m.id} className="flex items-center gap-4 p-4 bg-white/[0.04] border border-white/[0.08] rounded-xl shadow-sm hover:border-[#ff7a59]/20 transition-all">
                                                <div className={`p-2 rounded-lg ${m.categoria === 'PROVISIONAL' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                                    <ShieldAlert className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-white/70 uppercase tracking-tight">{m.tipo}</p>
                                                    <p className="text-[9px] font-medium text-white/35 uppercase tracking-widest">{m.categoria}</p>
                                                </div>
                                                <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${m.estado === 'VIGENTE' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/[0.06] text-white/40'}`}>
                                                    {m.estado}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Audiencias */}
                            <div>
                                <h5 className="text-[9px] font-bold text-white/35 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#111821]"></span>
                                    Cronograma Jurídico
                                </h5>
                                {(!expediente.audiencias || expediente.audiencias.length === 0) ? (
                                    <div className="py-8 text-center bg-white/[0.04] rounded-xl border border-white/[0.08]">
                                        <p className="text-[10px] font-bold text-white/35 uppercase tracking-widest italic">Sin citaciones programadas</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-3">
                                        {expediente.audiencias.map((a: any) => (
                                            <div key={a.id} className="flex items-center gap-4 p-4 bg-white/[0.04] border border-white/[0.08] rounded-xl shadow-sm hover:ring-1 hover:ring-white/10 transition-all">
                                                <div className="p-2 bg-white/[0.05] rounded-lg">
                                                    <Scale className="h-4 w-4 text-white/50" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-white/70 uppercase tracking-tight">{a.tipo?.replace(/_/g, ' ')}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <Clock className="h-3 w-3 text-white/25" />
                                                        <p className="text-[9px] font-bold text-white/35 uppercase tracking-widest">
                                                            {new Date(a.fecha_programada).toLocaleString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest shadow-sm ${a.estado === 'PROGRAMADA' ? 'bg-[#ff7a59] text-white' : a.estado === 'REALIZADA' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>
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
                    <Card className="border border-white/[0.08] shadow-sm rounded-xl overflow-hidden bg-white/[0.03]">
                        <CardHeader className="bg-white/[0.02] border-b border-white/[0.08] p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/10 rounded-lg">
                                    <Eye className="h-5 w-5 text-emerald-500" />
                                </div>
                                <div>
                                    <CardTitle className="text-sm font-bold text-white uppercase tracking-widest">Fase 4: Seguimiento Extendido</CardTitle>
                                    <CardDescription className="text-[10px] font-medium text-white/35 uppercase tracking-[0.15em] mt-1">Monitoreo de eficacia y cumplimiento</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            {(!expediente.seguimientos || expediente.seguimientos.length === 0) ? (
                                <div className="py-12 text-center bg-white/[0.04] rounded-xl border border-dashed border-white/[0.1]">
                                    <p className="text-[10px] font-bold text-white/35 uppercase tracking-widest italic">Sin bitácora de seguimientos</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {expediente.seguimientos.map((s: any) => (
                                        <div key={s.id} className="flex items-center gap-4 p-5 bg-white/[0.04] border border-white/[0.08] rounded-xl shadow-sm group hover:border-[#ff7a59]/20 transition-all">
                                            <div className="p-2 bg-white/[0.05] rounded-lg border border-white/[0.08] shadow-sm">
                                                <CalendarDays className="h-4 w-4 text-white/50" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-bold text-white/70 uppercase tracking-tight">{s.tipo?.replace(/_/g, ' ')}</p>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                                                    <p className="text-[9px] font-bold text-white/35 uppercase tracking-widest">
                                                        Prog: {new Date(s.fecha_programada).toLocaleDateString('es-CO')}
                                                    </p>
                                                    {s.fecha_realizada && (
                                                        <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
                                                            Realizado: {new Date(s.fecha_realizada).toLocaleDateString('es-CO')}
                                                        </p>
                                                    )}
                                                </div>
                                                {s.observaciones && <p className="text-xs text-white/40 mt-3 font-medium italic border-l-2 border-white/[0.06] pl-3 leading-relaxed">"{s.observaciones}"</p>}
                                            </div>
                                            <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest shadow-sm ${s.cumplimiento ? 'bg-emerald-500/15 text-emerald-400' : s.fecha_realizada ? 'bg-red-500/15 text-red-400' : 'bg-white/[0.06] text-white/40'}`}>
                                                {s.cumplimiento ? 'CUMPLE' : s.fecha_realizada ? 'INCUMPLE' : 'PENDIENTE'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* FASE 5: CIERRE / INCUMPLIMIENTO */}
                    <Card className="border border-white/[0.08] shadow-sm rounded-xl overflow-hidden bg-white/[0.03]">
                        <CardHeader className="bg-white/[0.02] border-b border-white/[0.08] p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#ff7a59] rounded-lg">
                                    <CheckCircle className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-sm font-bold text-white uppercase tracking-widest">Fase 5: Conclusión y Cierre</CardTitle>
                                    <CardDescription className="text-[10px] font-medium text-white/35 uppercase tracking-[0.15em] mt-1">Finalización legal o gestión de incidentes</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            {(!expediente.incidentes_incumplimiento || expediente.incidentes_incumplimiento.length === 0) ? (
                                <div className="py-10 text-center bg-white/[0.04] rounded-xl border border-white/[0.08]">
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.15em] italic">
                                        {expediente.estado === 'CERRADO'
                                            ? '✅ PROCESO FINALIZADO SEGÚN PROTOCOLO'
                                            : 'SITUACIÓN MONITOREADA — SIN INCIDENTES'}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {expediente.incidentes_incumplimiento.map((inc: any) => (
                                        <div key={inc.id} className="p-6 bg-red-500/10 border-2 border-red-500/20 rounded-xl shadow-sm">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 bg-red-500 rounded-lg shadow-sm">
                                                    <ShieldAlert className="h-4 w-4 text-white" />
                                                </div>
                                                <p className="text-xs font-bold text-red-400 uppercase tracking-tight">INCIDENTE DE INCUMPLIMIENTO</p>
                                            </div>
                                            <div className="bg-white/[0.04] p-4 rounded-lg border border-red-500/20 shadow-inner mb-4">
                                                <p className="text-sm text-red-300 font-medium italic leading-relaxed">"{inc.descripcion_incumplimiento}"</p>
                                            </div>
                                            <div className="flex flex-wrap gap-3">
                                                <span className="text-[8px] font-bold text-red-400 uppercase tracking-widest bg-white/[0.05] px-2.5 py-1 rounded border border-red-500/20">SANCIÓN: {inc.sancion_tipo || 'EN TRÁMITE'}</span>
                                                <span className="text-[8px] font-bold text-red-400 uppercase tracking-widest bg-white/[0.05] px-2.5 py-1 rounded border border-red-500/20">ESTADO: {inc.estado}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Column (1/3) — Actuaciones / Timeline */}
                <div className="space-y-8">
                    <Card className="border border-white/[0.08] shadow-sm rounded-xl overflow-hidden bg-white/[0.03]">
                        <CardHeader className="bg-white/[0.02] border-b border-white/[0.08] p-6">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3 text-white">
                                <FileText className="h-4 w-4 text-[#ff7a59]" /> Bitácora Digital
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {(!expediente.actuaciones || expediente.actuaciones.length === 0) ? (
                                <p className="text-[10px] text-white/35 font-bold uppercase tracking-widest text-center py-10 italic">Sin actuaciones</p>
                            ) : (
                                <div className="space-y-8 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/[0.06] pb-2">
                                    {expediente.actuaciones
                                        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                                        .map((act: any) => (
                                            <div key={act.id} className="relative pl-8 group">
                                                <div className="absolute left-0 top-1.5 w-[14px] h-[14px] rounded-full border-2 border-[#111821] bg-white/20 shadow-sm z-10 transition-all group-hover:bg-[#ff7a59] group-hover:scale-110" />
                                                <p className="text-[9px] font-bold text-white/35 uppercase tracking-widest mb-1.5">{new Date(act.created_at).toLocaleString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                                                <p className="text-xs font-bold text-white uppercase tracking-tight group-hover:text-[#ff7a59] transition-colors">{act.tipo?.replace(/_/g, ' ')}</p>
                                                {act.contenido && <p className="text-[10px] text-white/40 mt-2 font-medium italic line-clamp-3 leading-relaxed border-l border-white/[0.06] pl-3">"{act.contenido}"</p>}
                                            </div>
                                        ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Info */}
                    <Card className="border border-white/[0.08] shadow-sm rounded-xl overflow-hidden bg-white/[0.03]">
                        <CardHeader className="bg-white/[0.02] border-b border-white/[0.08] p-6">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Métricas del Expediente</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between items-center p-3 bg-white/[0.04] rounded-lg border border-white/[0.08]">
                                <span className="text-[9px] font-bold text-white/35 uppercase tracking-widest">Procedimiento</span>
                                <span className="text-[10px] font-bold text-[#ff7a59] uppercase tracking-wider bg-white/[0.04] px-2 py-0.5 rounded border border-[#ff7a59]/20">{expediente.estado}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white/[0.04] rounded-lg border border-white/[0.08]">
                                <span className="text-[9px] font-bold text-white/35 uppercase tracking-widest">Etapa Procesal</span>
                                <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">{FASES_INFO[faseActual]?.nombre}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white/[0.04] rounded-lg border border-white/[0.08]">
                                <span className="text-[9px] font-bold text-white/35 uppercase tracking-widest">Carga de Riesgo</span>
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${riesgoConfig.text}`}>{riesgoConfig.label}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mt-6">
                                <div className="text-center p-4 bg-white/[0.04] border border-white/[0.08] rounded-xl shadow-sm">
                                    <p className="text-xl font-bold text-white">{expediente.personas?.length || 0}</p>
                                    <p className="text-[8px] font-bold text-white/35 uppercase tracking-[0.2em] mt-1">Intervinientes</p>
                                </div>
                                <div className="text-center p-4 bg-white/[0.04] border border-white/[0.08] rounded-xl shadow-sm">
                                    <p className="text-xl font-bold text-white">{expediente.actuaciones?.length || 0}</p>
                                    <p className="text-[8px] font-bold text-white/35 uppercase tracking-[0.2em] mt-1">Actuaciones</p>
                                </div>
                                <div className="text-center p-4 bg-[#ff7a59]/15 text-white rounded-xl shadow-lg border border-[#ff7a59]/20 col-span-2">
                                    <p className="text-xl font-bold">{expediente.medidas?.length || 0}</p>
                                    <p className="text-[8px] font-bold text-white/35 uppercase tracking-[0.2em] mt-1">Medidas Dictadas</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
