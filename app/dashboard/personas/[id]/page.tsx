
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
    SIN_RIESGO: { bg: 'bg-slate-50', text: 'text-slate-600', label: 'Sin Riesgo' },
    BAJO: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Bajo' },
    MODERADO: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Moderado' },
    ALTO: { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Alto' },
    CRITICO: { bg: 'bg-red-50', text: 'text-red-700', label: 'Crítico' },
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
                <span className="text-[#1B2A4A] truncate max-w-[200px]">{persona.nombres}</span>
            </div>

            {/* Back button */}
            <Link href="/dashboard/personas">
                <Button variant="ghost" size="sm" className="gap-1.5 text-slate-500 hover:text-slate-700 -ml-2">
                    <ArrowLeft size={14} />
                    Volver al listado
                </Button>
            </Link>

            {/* Profile Header Card */}
            <Card className="border-0 shadow-sm overflow-hidden rounded-2xl">
                <div className={`h-20 sm:h-28 relative ${isVictima ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-gradient-to-r from-red-500 to-rose-600'}`}>
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:24px_24px]" />
                </div>
                <CardContent className="relative px-4 sm:px-6 pb-6">
                    {/* Photo */}
                    <div className="-mt-12 sm:-mt-14 mb-4">
                        <PersonaPhoto
                            personaId={persona.id}
                            currentPhotoUrl={fotoUrl}
                            initials={persona.nombres?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || '??'}
                            tipo={persona.tipo}
                        />
                    </div>

                    {/* Name + Type */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">{persona.nombres}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${isVictima ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`}>
                                    {isVictima ? <User className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
                                    {isVictima ? 'Víctima' : 'Agresor'}
                                </span>
                                <span className="text-sm text-slate-500">{tipoDocumento}: {persona.documento}</span>
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
                    <Card className="border-0 shadow-sm rounded-2xl">
                        <CardHeader className="border-b bg-slate-50/50 rounded-t-2xl">
                            <CardTitle className="text-base flex items-center gap-2.5">
                                <div className="p-1.5 bg-gradient-to-br from-[#1B2A4A] to-[#2C4A7C] rounded-lg">
                                    <FileText className="h-3.5 w-3.5 text-white" />
                                </div>
                                Datos Personales
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <InfoField icon={<Calendar className="h-4 w-4" />} label="Fecha de Nacimiento" value={persona.fecha_nacimiento ? `${new Date(persona.fecha_nacimiento).toLocaleDateString('es-CO')}${edad !== null ? ` (${edad} años)` : ''}` : null} />
                                <InfoField icon={<Users className="h-4 w-4" />} label="Género" value={persona.genero || identidadGenero} />
                                <InfoField icon={<MapPin className="h-4 w-4" />} label="Dirección" value={persona.direccion_residencia} />
                                <InfoField icon={<MapPin className="h-4 w-4" />} label="Barrio" value={barrio} />
                                <InfoField icon={<MapPin className="h-4 w-4" />} label="Zona" value={persona.zona} />
                                <InfoField icon={<Phone className="h-4 w-4" />} label="Teléfono" value={persona.telefono} />
                                <InfoField icon={<Mail className="h-4 w-4" />} label="Email" value={persona.email} />
                                <InfoField icon={<GraduationCap className="h-4 w-4" />} label="Nivel Educativo" value={persona.nivel_educativo} />
                                <InfoField icon={<Users className="h-4 w-4" />} label="Grupo Étnico" value={persona.grupo_etnico} />
                                <InfoField icon={<Heart className="h-4 w-4" />} label="Estado Civil" value={estadoCivil} />
                                <InfoField icon={<Shield className="h-4 w-4" />} label="EPS / Régimen Salud" value={regimenSalud} />
                                <InfoField icon={<Users className="h-4 w-4" />} label="Ocupación" value={ocupacion} />
                            </div>

                            {/* Special flags */}
                            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
                                {persona.discapacidad && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                                        ♿ Persona con discapacidad
                                    </span>
                                )}
                                {persona.es_victima_conflicto && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700">
                                        🕊️ Víctima del conflicto armado
                                    </span>
                                )}
                                {persona.acceso_armas && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-red-50 text-red-700">
                                        ⚠️ Acceso a armas
                                    </span>
                                )}
                                {persona.alias && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600">
                                        Alias: {persona.alias}
                                    </span>
                                )}
                                {parentescoVictima && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-orange-50 text-orange-700">
                                        Parentesco: {parentescoVictima}
                                    </span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar (1/3) — Expedientes */}
                <div className="space-y-6">
                    {/* Expediente principal */}
                    <Card className="border-0 shadow-sm rounded-2xl card-hover">
                        <CardHeader className="border-b bg-slate-50/50 rounded-t-2xl">
                            <CardTitle className="text-base flex items-center gap-2.5">
                                <div className="p-1.5 bg-gradient-to-br from-[#1B2A4A] to-[#2C4A7C] rounded-lg">
                                    <FolderHeart className="h-3.5 w-3.5 text-white" />
                                </div>
                                Expediente Principal
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            {persona.expediente ? (
                                <Link href={`/dashboard/casos/${persona.expediente.id}`} className="block">
                                    <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-mono font-bold text-[#1B2A4A] text-xs">{persona.expediente.radicado}</span>
                                            {persona.expediente.nivel_riesgo && (
                                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${RIESGO_CONFIG[persona.expediente.nivel_riesgo]?.bg || ''} ${RIESGO_CONFIG[persona.expediente.nivel_riesgo]?.text || ''}`}>
                                                    {RIESGO_CONFIG[persona.expediente.nivel_riesgo]?.label || persona.expediente.nivel_riesgo}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-600">{persona.expediente.tipologia_violencia} — {persona.expediente.estado}</p>
                                        <p className="text-[10px] text-slate-400 mt-1">
                                            {new Date(persona.expediente.created_at).toLocaleDateString('es-CO')}
                                        </p>
                                    </div>
                                </Link>
                            ) : (
                                <p className="text-sm text-slate-400 text-center py-3">Sin expediente vinculado</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Otros expedientes */}
                    {otrosExpedientes.length > 0 && (
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="border-b bg-slate-50/50">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <FolderHeart className="h-4 w-4" />
                                    Otros Expedientes ({otrosExpedientes.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-2">
                                {otrosExpedientes.map((exp: any) => (
                                    <Link key={exp.id} href={`/dashboard/casos/${exp.id}`} className="block">
                                        <div className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <span className="font-mono font-bold text-[#1B2A4A] text-xs">{exp.radicado}</span>
                                                <span className="text-[10px] text-slate-400">{exp.estado}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">{exp.tipologia_violencia}</p>
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
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <div className="text-slate-400 mt-0.5 flex-shrink-0">{icon}</div>
            <div>
                <p className="text-slate-400 text-[11px] uppercase tracking-wide font-medium">{label}</p>
                <p className="font-medium text-slate-700 text-sm">{value || '—'}</p>
            </div>
        </div>
    )
}
