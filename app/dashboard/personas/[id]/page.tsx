
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import {
    ChevronRight, User, UserX, Phone, Mail, MapPin, Calendar,
    GraduationCap, Users, Heart, Shield, FileText, FolderHeart, ArrowLeft
} from 'lucide-react'
import PersonaPhoto from '@/components/personas/persona-photo'
import PersonaEditForm from '@/components/personas/persona-edit-form'
import { Button } from '@/components/ui/button'

const RIESGO_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
    SIN_RIESGO: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Sin Riesgo' },
    BAJO: { bg: 'bg-emerald-100 border border-emerald-200', text: 'text-emerald-700', label: 'Bajo' },
    MODERADO: { bg: 'bg-amber-100 border border-amber-200', text: 'text-amber-700', label: 'Moderado' },
    ALTO: { bg: 'bg-orange-100 border border-orange-200', text: 'text-orange-700', label: 'Alto' },
    CRITICO: { bg: 'bg-red-100 border border-red-200', text: 'text-red-700', label: 'Crítico' },
}

export default async function PersonaDetallePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: persona, error } = await supabase
        .from('personas')
        .select(`
            *,
            expediente:expedientes(id, radicado, estado, tipologia_violencia, nivel_riesgo, fase_proceso, created_at)
        `)
        .eq('id', id)
        .single()

    if (error || !persona) return notFound()

    const demo = (typeof persona.datos_demograficos === 'object' && persona.datos_demograficos) || {}
    const fotoUrl = (demo as any)?.foto_url || null
    const tipoDocumento = (demo as any)?.tipo_documento || 'CC'
    const identidadGenero = (demo as any)?.identidad_genero || null
    const ocupacion = (demo as any)?.ocupacion || null
    const regimenSalud = (demo as any)?.regimen_salud || null
    const estadoCivil = (demo as any)?.estado_civil || null
    const parentescoVictima = (demo as any)?.parentesco_victima || null
    const barrio = (demo as any)?.barrio || null

    // Also find all expedientes where this person appears (by document match)
    let otrosExpedientes: any[] = []
    if (persona.documento && persona.documento !== 'NO REPORTA' && persona.documento !== 'POR VERIFICAR') {
        const { data: matchPersonas } = await supabase
            .from('personas')
            .select('expediente:expedientes(id, radicado, estado, tipologia_violencia, nivel_riesgo, created_at)')
            .eq('documento', persona.documento)
            .neq('id', persona.id)

        if (matchPersonas) {
            const seen = new Set<string>()
            if (persona.expediente) seen.add(persona.expediente.id)
            for (const mp of matchPersonas) {
                if (mp.expediente && !seen.has((mp.expediente as any).id)) {
                    seen.add((mp.expediente as any).id)
                    otrosExpedientes.push(mp.expediente)
                }
            }
        }
    }

    const edad = persona.fecha_nacimiento
        ? Math.floor((Date.now() - new Date(persona.fecha_nacimiento).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
        : null

    const isVictima = persona.tipo === 'VICTIMA'

    return (
        <div className="space-y-6 max-w-[1000px] mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-slate-400 text-sm font-medium animate-fade-in-up">
                <Link href="/dashboard" className="hover:text-slate-600 transition-colors">Inicio</Link>
                <ChevronRight className="h-3.5 w-3.5" />
                <Link href="/dashboard/personas" className="hover:text-slate-600 transition-colors">Personas</Link>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-blue-600 font-bold truncate max-w-[200px]">{persona.nombres}</span>
            </div>

            {/* Back button */}
            <Link href="/dashboard/personas">
                <Button variant="ghost" size="sm" className="gap-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 -ml-2 rounded-full">
                    <ArrowLeft size={14} />
                    Volver al listado
                </Button>
            </Link>

            {/* Profile Header Card */}
            <Card className="border-0 shadow-2xl shadow-slate-200/50 overflow-hidden rounded-[2.5rem] bg-white">
                <div className={`h-24 sm:h-32 relative ${isVictima ? 'bg-gradient-to-r from-blue-600 to-indigo-700' : 'bg-gradient-to-r from-rose-500 to-red-600'}`}>
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:24px_24px]" />
                </div>
                <CardContent className="relative px-6 sm:px-10 pb-8">
                    {/* Photo */}
                    <div className="-mt-12 sm:-mt-16 mb-4">
                        <PersonaPhoto
                            personaId={persona.id}
                            currentPhotoUrl={fotoUrl}
                            initials={persona.nombres?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || '??'}
                            tipo={persona.tipo}
                        />
                    </div>

                    {/* Name + Type */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{persona.nombres}</h1>
                            <div className="flex flex-wrap items-center gap-3 mt-2">
                                <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border shadow-sm ${isVictima ? 'bg-blue-100 border-blue-200 text-blue-700' : 'bg-red-100 border-red-200 text-red-700'}`}>
                                    {isVictima ? <User className="h-3.5 w-3.5" /> : <UserX className="h-3.5 w-3.5" />}
                                    {isVictima ? 'Víctima' : 'Agresor'}
                                </span>
                                <span className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-xl uppercase tracking-tighter">{tipoDocumento}: {persona.documento}</span>
                            </div>
                        </div>
                        <PersonaEditForm persona={persona} />
                    </div>
                </CardContent>
            </Card>

            {/* Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Info (2/3) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Data */}
                    <Card className="border-0 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden bg-white">
                        <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
                            <CardTitle className="text-sm font-black text-slate-900 flex items-center gap-3 uppercase tracking-wider">
                                <div className="p-2 bg-blue-100 rounded-xl">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                </div>
                                Datos Personales
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <InfoField icon={<Calendar className="h-4 w-4" />} label="Nacimiento" value={persona.fecha_nacimiento ? `${new Date(persona.fecha_nacimiento).toLocaleDateString('es-CO')}${edad !== null ? ` (${edad} años)` : ''}` : null} />
                                <InfoField icon={<Users className="h-4 w-4" />} label="Género" value={persona.genero || identidadGenero} />
                                <InfoField icon={<MapPin className="h-4 w-4" />} label="Dirección" value={persona.direccion_residencia} />
                                <InfoField icon={<MapPin className="h-4 w-4" />} label="Barrio" value={barrio} />
                                <InfoField icon={<MapPin className="h-4 w-4" />} label="Zona" value={persona.zona} />
                                <InfoField icon={<Phone className="h-4 w-4" />} label="Teléfono" value={persona.telefono} />
                                <InfoField icon={<Mail className="h-4 w-4" />} label="Email" value={persona.email} />
                                <InfoField icon={<GraduationCap className="h-4 w-4" />} label="Nivel Educativo" value={persona.nivel_educativo} />
                                <InfoField icon={<Users className="h-4 w-4" />} label="Grupo Étnico" value={persona.grupo_etnico} />
                                <InfoField icon={<Heart className="h-4 w-4" />} label="Estado Civil" value={estadoCivil} />
                                <InfoField icon={<Shield className="h-4 w-4" />} label="Régimen Salud" value={regimenSalud} />
                                <InfoField icon={<Users className="h-4 w-4" />} label="Ocupación" value={ocupacion} />
                            </div>

                            {/* Special flags */}
                            <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-100">
                                {persona.discapacidad && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                                        ♿ Discapacidad
                                    </span>
                                )}
                                {persona.es_victima_conflicto && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200">
                                        🕊️ Conflicto Armado
                                    </span>
                                )}
                                {persona.acceso_armas && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-700 border border-red-200 animate-pulse">
                                        ⚠️ Acceso a Armas
                                    </span>
                                )}
                                {persona.alias && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200">
                                        ALIAS: {persona.alias}
                                    </span>
                                )}
                                {parentescoVictima && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-700 border border-orange-200">
                                        VÍNCULO: {parentescoVictima}
                                    </span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar (1/3) — Expedientes */}
                <div className="space-y-6">
                    {/* Expediente principal */}
                    <Card className="border-0 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden bg-white hover:shadow-2xl transition-all duration-300">
                        <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
                            <CardTitle className="text-sm font-black text-slate-900 flex items-center gap-3 uppercase tracking-wider">
                                <div className="p-2 bg-indigo-100 rounded-xl">
                                    <FolderHeart className="h-4 w-4 text-indigo-600" />
                                </div>
                                Expediente Principal
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {persona.expediente ? (
                                <Link href={`/dashboard/casos/${persona.expediente.id}`} className="block group">
                                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 group-hover:border-blue-200 group-hover:bg-blue-50/30 transition-all">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-mono font-black text-blue-600 text-[11px] tracking-widest">{persona.expediente.radicado}</span>
                                            {persona.expediente.nivel_riesgo && (
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border shadow-sm ${RIESGO_CONFIG[persona.expediente.nivel_riesgo]?.bg || ''} ${RIESGO_CONFIG[persona.expediente.nivel_riesgo]?.text || ''}`}>
                                                    {RIESGO_CONFIG[persona.expediente.nivel_riesgo]?.label || persona.expediente.nivel_riesgo}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs font-bold text-slate-700 leading-tight">{persona.expediente.tipologia_violencia}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{persona.expediente.estado}</p>
                                        <p className="text-[10px] text-slate-300 mt-2 font-medium">
                                            {new Date(persona.expediente.created_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                </Link>
                            ) : (
                                <p className="text-sm font-bold text-slate-400 text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 uppercase tracking-widest">Sin expediente vinculado</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Otros expedientes */}
                    {otrosExpedientes.length > 0 && (
                        <Card className="border-0 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden bg-white">
                            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
                                <CardTitle className="text-sm font-black text-slate-900 flex items-center gap-3 uppercase tracking-wider">
                                    <div className="p-2 bg-slate-100 rounded-xl">
                                        <FolderHeart className="h-4 w-4 text-slate-600" />
                                    </div>
                                    Otros Expedientes ({otrosExpedientes.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-3">
                                {otrosExpedientes.map((exp: any) => (
                                    <Link key={exp.id} href={`/dashboard/casos/${exp.id}`} className="block group">
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:border-slate-200 group-hover:bg-slate-100 transition-all">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-mono font-bold text-blue-600 text-[10px] tracking-wider">{exp.radicado}</span>
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{exp.estado}</span>
                                            </div>
                                            <p className="text-[11px] font-bold text-slate-600 truncate">{exp.tipologia_violencia}</p>
                                        </div>
                                    </Link>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}

function InfoField({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | null | undefined }) {
    return (
        <div className="flex items-center gap-4 p-4 rounded-[1.25rem] bg-slate-50 border border-slate-100/50 hover:bg-white hover:border-blue-100 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 group">
            <div className="text-slate-400 group-hover:text-blue-500 transition-colors transform group-hover:scale-110 duration-300">{icon}</div>
            <div className="min-w-0">
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.15em] mb-0.5">{label}</p>
                <p className="font-bold text-slate-700 text-sm truncate">{value || '—'}</p>
            </div>
        </div>
    )
}
