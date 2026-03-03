
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
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2E1065] via-[#4C1D95] to-[#0F1A2E] p-5 sm:p-8 lg:p-10 text-white shadow-xl shadow-slate-900/20 animate-fade-in-up">
                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:40px_40px]" />
                <div className="absolute top-0 right-0 w-80 h-80 bg-fuchsia-500/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-[80px]" />
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-500/5 rounded-full translate-y-1/2 -translate-x-1/3 blur-[60px]" />
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <p className="text-slate-400 text-sm font-medium mb-1">
                                {getGreeting()}, {firstName} 👋
                            </p>
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
                                {getRolTitle(userRole)}
                            </h2>
                            <p className="text-slate-400 mt-2 text-sm max-w-lg">
                                {getRolDescription(userRole)}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href="/dashboard/recepcion/nuevo-caso">
                                <Button className="bg-white text-[#2E1065] hover:bg-slate-100 rounded-xl px-5 py-2.5 font-bold text-sm transition-all hover:-translate-y-0.5 gap-2 shadow-lg shadow-black/20">
                                    <PlusCircle className="h-4 w-4" />
                                    Nuevo Caso
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 stagger-children">
                <KPICard
                    title="Total Expedientes"
                    value={stats.totalCasos}
                    icon={<FolderHeart className="h-5 w-5" />}
                    gradient="from-[#4C1D95] to-[#2C4A7C]"
                    bgLight="bg-slate-50"
                    textColor="text-[#4C1D95]"
                />
                <KPICard
                    title="En Trámite"
                    value={stats.casosEnTramite}
                    icon={<Timer className="h-5 w-5" />}
                    gradient="from-amber-500 to-orange-500"
                    bgLight="bg-amber-50"
                    textColor="text-amber-600"
                />
                <KPICard
                    title="En Seguimiento"
                    value={stats.casosSeguimiento}
                    icon={<Eye className="h-5 w-5" />}
                    gradient="from-emerald-500 to-teal-500"
                    bgLight="bg-emerald-50"
                    textColor="text-emerald-600"
                />
                <KPICard
                    title="Medidas Vigentes"
                    value={stats.medidasVigentes}
                    icon={<ShieldCheck className="h-5 w-5" />}
                    gradient="from-purple-500 to-fuchsia-500"
                    bgLight="bg-purple-50"
                    textColor="text-purple-600"
                />
            </div>

            {/* Role-specific modules */}
            <div>
                <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2.5">
                    <span className="w-1.5 h-6 bg-gradient-to-b from-[#4C1D95] to-[#2C4A7C] rounded-full" />
                    Módulos Disponibles
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 stagger-children">
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
        <Card className="border border-slate-100/80 shadow-sm hover:shadow-lg transition-all duration-500 group rounded-2xl overflow-hidden card-hover bg-white">
            <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                    <div className={`bg-gradient-to-br ${gradient} text-white p-2.5 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                        {icon}
                    </div>
                    <TrendingUp className="h-4 w-4 text-slate-200 group-hover:text-emerald-500 transition-colors duration-300" />
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 tabular-nums tracking-tight">{value}</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{title}</p>
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
                iconBg="bg-slate-100"
                iconColor="text-[#4C1D95]"
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
                iconBg="bg-slate-100"
                iconColor="text-slate-700"
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
                iconBg="bg-slate-100"
                iconColor="text-slate-800"
                title="Audiencias"
                subtitle="Sala de Audiencia"
                description="Programar, dirigir audiencias y emitir fallos de medidas de protección."
                actions={[
                    { label: 'Ver Audiencias', href: '/dashboard/audiencias', variant: 'default' as const },
                ]}
            />
            <ModuleCard
                icon={<BarChart3 className="h-5 w-5" />}
                iconBg="bg-fuchsia-50"
                iconColor="text-fuchsia-600"
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
        <Card className="flex flex-col border border-slate-100/80 shadow-sm hover:shadow-lg hover:border-slate-200 transition-all duration-500 rounded-2xl overflow-hidden group card-hover bg-white relative">
            {/* Left accent bar on hover */}
            <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${iconBg === 'bg-slate-100' ? 'bg-[#4C1D95]' : iconColor.replace('text-', 'bg-')} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            <div className="p-5 sm:p-6 flex-1">
                <div className="flex items-start gap-3.5 mb-4">
                    <div className={`${iconBg} ${iconColor} p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                        {icon}
                    </div>
                    <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-800 leading-tight">{title}</h4>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">{subtitle}</p>
                    </div>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
            </div>
            <div className="px-5 sm:px-6 pb-5 pt-0 flex flex-col gap-2">
                {actions.map((action, i) => (
                    <Button
                        key={i}
                        variant={action.variant}
                        className={`w-full justify-between rounded-xl text-sm transition-all duration-300 ${action.variant === 'default'
                            ? 'bg-[#4C1D95] hover:bg-[#3B0764] text-white shadow-sm shadow-slate-900/15'
                            : 'border-slate-200 hover:border-[#4C1D95]/30 hover:text-[#4C1D95] hover:bg-slate-50'
                            }`}
                        asChild
                    >
                        <Link href={action.href}>
                            <span>{action.label}</span>
                            <ArrowRight size={14} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
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
        default: return 'Bienvenido al sistema Komi.'
    }
}
