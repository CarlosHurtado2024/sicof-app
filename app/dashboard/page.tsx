
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
        { count: pendientesFirma },
    ] = await Promise.all([
        supabase.from('expedientes').select('*', { count: 'exact', head: true }),
        supabase.from('expedientes').select('*', { count: 'exact', head: true }).eq('estado', 'TRAMITE'),
        supabase.from('expedientes').select('*', { count: 'exact', head: true }).eq('fase_proceso', 'SEGUIMIENTO'),
        supabase.from('medidas').select('*', { count: 'exact', head: true }).eq('estado', 'VIGENTE'),
        supabase.from('autos').select('*', { count: 'exact', head: true }).eq('estado', 'PENDIENTE_FIRMA'),
    ])

    return {
        totalCasos: totalCasos || 0,
        casosEnTramite: casosEnTramite || 0,
        casosSeguimiento: casosSeguimiento || 0,
        medidasVigentes: medidasVigentes || 0,
        pendientesFirma: pendientesFirma || 0
    }
}

export default async function DashboardPage() {
    const profileData = await getUserProfile()
    const userRole = profileData?.profile?.rol as RolUsuario | undefined
    const stats = await getStats()

    const nombreUsuario = profileData?.profile?.nombre || 'Usuario'
    const firstName = nombreUsuario.split(' ')[0]

    return (
        <div className="flex flex-col gap-8 max-w-[1400px] mx-auto z-10 relative">
            {/* Welcome Header */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 animate-fade-in-up">
                <div>
                    <h1 className="text-3xl font-bold mb-2 font-display text-gray-900 leading-tight tracking-tight">
                        Bienvenida de nuevo, <span className="text-[#F28C73]">{firstName}</span>.
                    </h1>
                    <p className="text-gray-500 font-medium flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-danger inline-block animate-pulse shadow-[0_0_8px_rgba(229,91,91,0.4)]"></span>
                        Hay 3 casos de riesgo crítico que requieren acción inmediata.
                    </p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button className="flex-1 md:flex-none bg-danger text-white px-5 py-2.5 rounded-lg font-medium hover:bg-red-600 transition-colors shadow-sm active:scale-95">
                        Revisar Casos Críticos
                    </button>
                    <Link href="/dashboard/recepcion/nuevo-caso" className="hidden sm:block">
                        <Button className="bg-[#F28C73] text-white hover:bg-[#D96C53] px-5 py-2.5 rounded-lg font-medium shadow-sm transition-all hover:scale-105">
                            <PlusCircle className="mr-2 h-5 w-5" />
                            Nuevo Caso
                        </Button>
                    </Link>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Casos Activos"
                    value={stats.totalCasos}
                    icon={<FolderHeart className="h-4 w-4" />}
                    bgLight="bg-blue-50"
                    textColor="text-blue-600"
                />
                <KPICard
                    title="En Triaje"
                    value={stats.casosEnTramite}
                    icon={<Timer className="h-4 w-4" />}
                    bgLight="bg-orange-50"
                    textColor="text-orange-600"
                />
                <KPICard
                    title="Medidas Vigentes"
                    value={stats.medidasVigentes}
                    icon={<ShieldCheck className="h-4 w-4" />}
                    bgLight="bg-purple-50"
                    textColor="text-purple-600"
                />
                <KPICard
                    title="Seguimientos"
                    value={stats.casosSeguimiento}
                    icon={<Eye className="h-4 w-4" />}
                    bgLight="bg-green-50"
                    textColor="text-success"
                />
            </div>

            {/* Role-specific modules */}
            <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <h3 className="text-[10px] tracking-[0.3em] font-black text-gray-400 uppercase mb-8 flex items-center gap-3">
                    <span className="w-8 h-px bg-gray-200" />
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
function KPICard({ title, value, icon, bgLight, textColor }: {
    title: string; value: number; icon: React.ReactNode; bgLight: string; textColor: string
}) {
    return (
        <Card className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group overflow-hidden relative">
            <CardContent className="p-0 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2.5 ${bgLight} ${textColor} rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                        {icon}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{title}</span>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-gray-900 tracking-tighter tabular-nums">{value}</span>
                </div>
            </CardContent>
            <div className={`absolute -bottom-1 -right-1 w-12 h-12 ${bgLight} rounded-full opacity-0 group-hover:opacity-20 transition-opacity blur-xl`} />
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
                iconColor="text-[#042153]"
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
        <Card className="flex flex-col bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-[#F28C73]/20 transition-all duration-300 rounded-xl overflow-hidden group">
            <div className="p-6 flex-1">
                <div className="flex items-start gap-4 mb-5">
                    <div className={`${iconBg} ${iconColor} p-3 rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                        {icon}
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-gray-900 leading-tight mb-1">{title}</h4>
                        <p className="text-[10px] text-[#F28C73] font-black tracking-widest uppercase">{subtitle}</p>
                    </div>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">{description}</p>
            </div>
            <div className="px-6 pb-6 pt-0 flex flex-col gap-2">
                {actions.map((action, i) => (
                    <Button
                        key={i}
                        variant={action.variant}
                        className={`w-full justify-between rounded-lg text-xs font-bold uppercase tracking-wider transition-all h-11 ${action.variant === 'default'
                            ? 'bg-[#F28C73] text-white hover:bg-[#D96C53] shadow-sm'
                            : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
                            }`}
                        asChild
                    >
                        <Link href={action.href}>
                            <span>{action.label}</span>
                            <ChevronRight size={14} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
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
