
import { getUserProfile } from '@/lib/auth-helpers'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import {
    Users,
    Archive,
    Calendar,
    ArrowRight,
    PlusCircle,
    HeartPulse,
    FileText,
    ShieldCheck,
    Scale,
    BarChart3,
    Timer,
    FolderHeart,
    Eye,
    Stamp,
    Megaphone,
    TrendingUp,
    Clock,
    Brain,
    Siren,
    ChevronRight
} from 'lucide-react'
import type { RolUsuario } from '@/types/db'

// Stats fetching helper
async function getStats() {
    const supabase = await createClient()

    const [
        { count: totalCasos },
        { count: casosEnTramite },
        { count: casosSeguimiento },
        { count: medidasVigentes },
    ] = await Promise.all([
        supabase.from('expedientes').select('*', { count: 'exact', head: true }),
        supabase.from('expedientes').select('*', { count: 'exact', head: true }).eq('estado', 'TRAMITE'),
        supabase.from('expedientes').select('*', { count: 'exact', head: true }).eq('fase_proceso', 'SEGUIMIENTO'),
        supabase.from('medidas').select('*', { count: 'exact', head: true }).eq('estado', 'VIGENTE'),
    ])

    return {
        totalCasos: totalCasos || 0,
        casosEnTramite: casosEnTramite || 0,
        casosSeguimiento: casosSeguimiento || 0,
        medidasVigentes: medidasVigentes || 0
    }
}

export default async function DashboardPage() {
    const profileData = await getUserProfile()
    const userRole = profileData?.profile?.rol as RolUsuario | undefined
    const stats = await getStats()

    const nombreUsuario = profileData?.profile?.nombre || 'Usuario'
    const firstName = nombreUsuario.split(' ')[0]

    return (
        <div className="flex flex-col gap-8 max-w-[1400px] mx-auto">
            {/* Welcome Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#7C3AED] via-[#6D28D9] to-[#5B21B6] p-5 sm:p-8 lg:p-10 text-white shadow-xl shadow-violet-500/15">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3 blur-2xl"></div>
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <p className="text-violet-200 text-sm font-medium mb-1">
                                {getGreeting()}, {firstName} 👋
                            </p>
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
                                {getRolTitle(userRole)}
                            </h2>
                            <p className="text-violet-200/80 mt-2 text-sm max-w-lg">
                                {getRolDescription(userRole)}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href="/dashboard/recepcion/nuevo-caso">
                                <Button className="bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-sm rounded-xl px-5 py-2.5 font-semibold text-sm transition-all hover:-translate-y-0.5 gap-2">
                                    <PlusCircle className="h-4 w-4" />
                                    Nuevo Caso
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KPICard
                    title="Total Expedientes"
                    value={stats.totalCasos}
                    icon={<FolderHeart className="h-5 w-5" />}
                    gradient="from-violet-500 to-purple-600"
                    bgLight="bg-violet-50"
                    textColor="text-violet-600"
                />
                <KPICard
                    title="En Trámite"
                    value={stats.casosEnTramite}
                    icon={<Timer className="h-5 w-5" />}
                    gradient="from-amber-500 to-orange-600"
                    bgLight="bg-amber-50"
                    textColor="text-amber-600"
                />
                <KPICard
                    title="En Seguimiento"
                    value={stats.casosSeguimiento}
                    icon={<Eye className="h-5 w-5" />}
                    gradient="from-emerald-500 to-teal-600"
                    bgLight="bg-emerald-50"
                    textColor="text-emerald-600"
                />
                <KPICard
                    title="Medidas Vigentes"
                    value={stats.medidasVigentes}
                    icon={<ShieldCheck className="h-5 w-5" />}
                    gradient="from-blue-500 to-indigo-600"
                    bgLight="bg-blue-50"
                    textColor="text-blue-600"
                />
            </div>

            {/* Role-specific modules */}
            <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-[#7C3AED] rounded-full"></span>
                    Módulos Disponibles
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {(userRole === 'AUXILIAR' || userRole === 'ADMINISTRADOR') && <AuxiliarModules />}
                    {(userRole === 'PSICOLOGO' || userRole === 'TRABAJADOR_SOCIAL' || userRole === 'ADMINISTRADOR') && <PsicosocialModules />}
                    {(userRole === 'SECRETARIO' || userRole === 'ABOGADO' || userRole === 'ADMINISTRADOR') && <SecretarioModules />}
                    {(userRole === 'COMISARIO' || userRole === 'ADMINISTRADOR') && <ComisarioModules />}
                </div>
            </div>
        </div>
    )
}

// === KPI Card ===
function KPICard({ title, value, icon, gradient, bgLight, textColor }: {
    title: string; value: number; icon: React.ReactNode; gradient: string; bgLight: string; textColor: string
}) {
    return (
        <Card className="border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group rounded-xl overflow-hidden">
            <CardContent className="p-5 flex items-center gap-4">
                <div className={`${bgLight} ${textColor} p-3 rounded-xl group-hover:scale-105 transition-transform duration-300`}>
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-2xl font-bold text-slate-800 tabular-nums">{value}</p>
                    <p className="text-xs text-slate-500 font-medium truncate">{title}</p>
                </div>
                <TrendingUp className="h-4 w-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
            </CardContent>
        </Card>
    )
}

// === Módulos AUXILIAR ===
function AuxiliarModules() {
    return (
        <>
            <ModuleCard
                icon={<Users className="h-5 w-5" />}
                iconBg="bg-violet-50"
                iconColor="text-[#7C3AED]"
                title="Recepción y Radicación"
                subtitle="Ventanilla Única Digital"
                description="Registro de minuta, ingreso de usuarios, validación de competencia y generación de radicado."
                actions={[
                    { label: 'Nueva Minuta', href: '/dashboard/recepcion', variant: 'default' as const },
                    { label: 'Radicar Nuevo Caso', href: '/dashboard/recepcion/nuevo-caso', variant: 'outline' as const },
                ]}
            />
            <ModuleCard
                icon={<Archive className="h-5 w-5" />}
                iconBg="bg-amber-50"
                iconColor="text-amber-600"
                title="Gestión Documental"
                subtitle="Expediente Digital"
                description="Carga de documentos, foliación digital e indexación automática al expediente."
                actions={[
                    { label: 'Buscar Expediente', href: '/dashboard/casos', variant: 'outline' as const },
                ]}
            />
            <ModuleCard
                icon={<Calendar className="h-5 w-5" />}
                iconBg="bg-emerald-50"
                iconColor="text-emerald-600"
                title="Agenda y Programación"
                subtitle="Logística de Audiencias"
                description="Asignación de citas con equipo psicosocial y programación de audiencias."
                actions={[
                    { label: 'Ver Agenda', href: '/dashboard/agenda', variant: 'outline' as const },
                ]}
            />
        </>
    )
}

// === Módulos PSICOSOCIAL ===
function PsicosocialModules() {
    return (
        <>
            <ModuleCard
                icon={<HeartPulse className="h-5 w-5" />}
                iconBg="bg-rose-50"
                iconColor="text-rose-600"
                title="Valoraciones de Riesgo"
                subtitle="Instrumento de Valoración (Ley 1257)"
                description="Aplicar el instrumento de valoración de riesgo de feminicidio y violencia grave."
                actions={[
                    { label: 'Casos Pendientes', href: '/dashboard/casos', variant: 'default' as const },
                ]}
            />
            <ModuleCard
                icon={<FileText className="h-5 w-5" />}
                iconBg="bg-indigo-50"
                iconColor="text-indigo-600"
                title="Informes Periciales"
                subtitle="Equipo Interdisciplinario"
                description="Generar informes de valoración psicológica, visita domiciliaria y verificación de derechos."
                actions={[
                    { label: 'Mis Informes', href: '/dashboard/informes', variant: 'outline' as const },
                ]}
            />
            <ModuleCard
                icon={<Eye className="h-5 w-5" />}
                iconBg="bg-teal-50"
                iconColor="text-teal-600"
                title="Casos Asignados"
                subtitle="Mi Carga de Trabajo"
                description="Expedientes asignados para valoración por el equipo interdisciplinario."
                actions={[
                    { label: 'Ver Asignados', href: '/dashboard/casos', variant: 'outline' as const },
                ]}
            />
        </>
    )
}

// === Módulos SECRETARIO ===
function SecretarioModules() {
    return (
        <>
            <ModuleCard
                icon={<Stamp className="h-5 w-5" />}
                iconBg="bg-orange-50"
                iconColor="text-orange-600"
                title="Autos y Oficios"
                subtitle="Motor Procesal"
                description="Generación de autos de admisión, pruebas, traslado, oficios a Fiscalía, Policía y EPS."
                actions={[
                    { label: 'Generar Documento', href: '/dashboard/autos', variant: 'default' as const },
                ]}
            />
            <ModuleCard
                icon={<Timer className="h-5 w-5" />}
                iconBg="bg-red-50"
                iconColor="text-red-600"
                title="Control de Términos"
                subtitle="Semáforo de Vencimientos"
                description="Alertas visuales de vencimiento de términos legales (4h medida provisional, 30d audiencia)."
                actions={[
                    { label: 'Ver Términos', href: '/dashboard/terminos', variant: 'default' as const },
                ]}
            />
            <ModuleCard
                icon={<Megaphone className="h-5 w-5" />}
                iconBg="bg-pink-50"
                iconColor="text-pink-600"
                title="Notificaciones"
                subtitle="Citaciones y Oficios"
                description="Gestión de citaciones, notificaciones personales, envío de oficios y control de recibido."
                actions={[
                    { label: 'Gestionar', href: '/dashboard/notificaciones', variant: 'outline' as const },
                ]}
            />
        </>
    )
}

// === Módulos COMISARIO ===
function ComisarioModules() {
    return (
        <>
            <ModuleCard
                icon={<ShieldCheck className="h-5 w-5" />}
                iconBg="bg-emerald-50"
                iconColor="text-emerald-600"
                title="Bandeja de Firma"
                subtitle="Aprobación de Autos y Medidas"
                description="Revisar y firmar digitalmente los autos preparados por el Secretario."
                actions={[
                    { label: 'Ver Pendientes', href: '/dashboard/firma', variant: 'default' as const },
                ]}
            />
            <ModuleCard
                icon={<Scale className="h-5 w-5" />}
                iconBg="bg-violet-50"
                iconColor="text-violet-600"
                title="Audiencias"
                subtitle="Sala de Audiencia"
                description="Programar, dirigir audiencias y emitir fallos de medidas de protección."
                actions={[
                    { label: 'Ver Audiencias', href: '/dashboard/audiencias', variant: 'default' as const },
                ]}
            />
            <ModuleCard
                icon={<BarChart3 className="h-5 w-5" />}
                iconBg="bg-cyan-50"
                iconColor="text-cyan-600"
                title="Tablero de Control"
                subtitle="Indicadores y Estadísticas"
                description="Casos activos, medidas vigentes, reincidencias y reportes para MinJusticia."
                actions={[
                    { label: 'Ver Estadísticas', href: '/dashboard/estadisticas', variant: 'outline' as const },
                ]}
            />
        </>
    )
}

// === Reusable Module Card ===
function ModuleCard({ icon, iconBg, iconColor, title, subtitle, description, actions }: {
    icon: React.ReactNode
    iconBg: string
    iconColor: string
    title: string
    subtitle: string
    description: string
    actions: { label: string; href: string; variant: 'default' | 'outline' }[]
}) {
    return (
        <Card className="flex flex-col border border-slate-100 shadow-sm hover:shadow-md hover:border-violet-200/50 transition-all duration-300 rounded-xl overflow-hidden group">
            <div className="p-6 flex-1">
                <div className="flex items-start gap-3.5 mb-4">
                    <div className={`${iconBg} ${iconColor} p-2.5 rounded-xl group-hover:scale-105 transition-transform duration-300 flex-shrink-0`}>
                        {icon}
                    </div>
                    <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-800 leading-tight">{title}</h4>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">{subtitle}</p>
                    </div>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
            </div>
            <div className="px-6 pb-5 pt-0 flex flex-col gap-2">
                {actions.map((action, i) => (
                    <Button
                        key={i}
                        variant={action.variant}
                        className={`w-full justify-between rounded-lg text-sm ${action.variant === 'default'
                            ? 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-sm shadow-violet-500/20'
                            : 'border-slate-200 hover:border-violet-300 hover:text-[#7C3AED] hover:bg-violet-50/50'
                            }`}
                        asChild
                    >
                        <Link href={action.href}>
                            <span>{action.label}</span>
                            <ArrowRight size={14} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    </Button>
                ))}
            </div>
        </Card>
    )
}

function getGreeting(): string {
    const hour = new Date().getHours()
    if (hour < 12) return 'Buenos días'
    if (hour < 18) return 'Buenas tardes'
    return 'Buenas noches'
}

function getRolTitle(rol: RolUsuario | undefined): string {
    switch (rol) {
        case 'AUXILIAR': return 'Recepción y Radicación'
        case 'PSICOLOGO': return 'Equipo Psicosocial — Psicología'
        case 'TRABAJADOR_SOCIAL': return 'Equipo Psicosocial — Trabajo Social'
        case 'SECRETARIO': return 'Secretaría de Despacho'
        case 'ABOGADO': return 'Asesoría Jurídica'
        case 'COMISARIO': return 'Despacho del Comisario'
        case 'ADMINISTRADOR': return 'Administración General'
        default: return 'Panel de Control'
    }
}

function getRolDescription(rol: RolUsuario | undefined): string {
    switch (rol) {
        case 'AUXILIAR': return 'Gestiona la ventanilla única digital, registra minutas y radica nuevos casos.'
        case 'PSICOLOGO': return 'Aplica instrumentos de valoración y genera informes periciales psicológicos.'
        case 'TRABAJADOR_SOCIAL': return 'Realiza visitas domiciliarias y verificación de derechos.'
        case 'SECRETARIO': return 'Genera autos, controla términos legales y gestiona notificaciones.'
        case 'ABOGADO': return 'Asesora jurídicamente y apoya la generación de documentos procesales.'
        case 'COMISARIO': return 'Firma autos, dirige audiencias y monitorea indicadores de gestión.'
        case 'ADMINISTRADOR': return 'Acceso completo a todos los módulos del sistema.'
        default: return 'Bienvenido al sistema SICOF.'
    }
}
