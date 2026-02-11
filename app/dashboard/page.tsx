
import { getUserProfile } from '@/lib/auth-helpers'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import {
    Users,
    Archive,
    Megaphone,
    Calendar,
    ClipboardList,
    ArrowRight,
    PlusCircle,
    Clock,
    HeartPulse,
    FileText,
    ShieldCheck,
    Scale,
    BarChart3,
    Timer,
    AlertTriangle,
    FolderHeart,
    Eye,
    Stamp,
    TrendingUp
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

    return (
        <div className="flex flex-col gap-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
                <h2 className="text-2xl font-bold tracking-tight">Bienvenido/a, {nombreUsuario}</h2>
                <p className="text-blue-100 mt-1">
                    {getRolDescription(userRole)}
                </p>
            </div>

            {/* KPI Cards (visible to all roles) */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KPICard title="Total Expedientes" value={stats.totalCasos} icon={<FolderHeart className="h-5 w-5" />} color="blue" />
                <KPICard title="En Trámite" value={stats.casosEnTramite} icon={<Timer className="h-5 w-5" />} color="amber" />
                <KPICard title="En Seguimiento" value={stats.casosSeguimiento} icon={<Eye className="h-5 w-5" />} color="emerald" />
                <KPICard title="Medidas Vigentes" value={stats.medidasVigentes} icon={<ShieldCheck className="h-5 w-5" />} color="purple" />
            </div>

            {/* Role-specific modules */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {(userRole === 'AUXILIAR' || userRole === 'ADMINISTRADOR') && <AuxiliarModules />}
                {(userRole === 'PSICOLOGO' || userRole === 'TRABAJADOR_SOCIAL' || userRole === 'ADMINISTRADOR') && <PsicosocialModules />}
                {(userRole === 'SECRETARIO' || userRole === 'ABOGADO' || userRole === 'ADMINISTRADOR') && <SecretarioModules />}
                {(userRole === 'COMISARIO' || userRole === 'ADMINISTRADOR') && <ComisarioModules />}
            </div>
        </div>
    )
}

// === KPI Card ===
function KPICard({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) {
    const bg = `bg-${color}-50`
    const text = `text-${color}-600`
    return (
        <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
                <div className={`${bg} ${text} p-3 rounded-lg`}>
                    {icon}
                </div>
                <div>
                    <p className="text-2xl font-bold text-slate-800">{value}</p>
                    <p className="text-xs text-slate-500">{title}</p>
                </div>
            </CardContent>
        </Card>
    )
}

// === Módulos AUXILIAR ===
function AuxiliarModules() {
    return (
        <>
            <ModuleCard
                icon={<Users className="h-6 w-6 text-blue-600" />}
                title="Recepción y Radicación"
                subtitle="Ventanilla Única Digital"
                description="Registro de minuta, ingreso de usuarios, validación de competencia y generación de radicado."
                actions={[
                    { label: 'Nueva Minuta', href: '/dashboard/recepcion', variant: 'default' as const },
                    { label: 'Radicar Nuevo Caso', href: '/dashboard/recepcion/nuevo-caso', variant: 'outline' as const },
                ]}
            />
            <ModuleCard
                icon={<Archive className="h-6 w-6 text-amber-600" />}
                title="Gestión Documental"
                subtitle="Expediente Digital"
                description="Carga de documentos, foliación digital e indexación automática al expediente."
                actions={[
                    { label: 'Buscar Expediente', href: '/dashboard/casos', variant: 'outline' as const },
                ]}
            />
            <ModuleCard
                icon={<Calendar className="h-6 w-6 text-green-600" />}
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
                icon={<HeartPulse className="h-6 w-6 text-rose-600" />}
                title="Valoraciones de Riesgo"
                subtitle="Instrumento de Valoración (Ley 1257)"
                description="Aplicar el instrumento de valoración de riesgo de feminicidio y violencia grave."
                actions={[
                    { label: 'Casos Pendientes', href: '/dashboard/casos', variant: 'default' as const },
                ]}
            />
            <ModuleCard
                icon={<FileText className="h-6 w-6 text-indigo-600" />}
                title="Informes Periciales"
                subtitle="Equipo Interdisciplinario"
                description="Generar informes de valoración psicológica, visita domiciliaria y verificación de derechos."
                actions={[
                    { label: 'Mis Informes', href: '/dashboard/informes', variant: 'outline' as const },
                ]}
            />
            <ModuleCard
                icon={<Eye className="h-6 w-6 text-teal-600" />}
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
                icon={<Stamp className="h-6 w-6 text-orange-600" />}
                title="Autos y Oficios"
                subtitle="Motor Procesal"
                description="Generación de autos de admisión, pruebas, traslado, oficios a Fiscalía, Policía y EPS."
                actions={[
                    { label: 'Generar Documento', href: '/dashboard/autos', variant: 'default' as const },
                ]}
            />
            <ModuleCard
                icon={<Timer className="h-6 w-6 text-red-600" />}
                title="Control de Términos"
                subtitle="Semáforo de Vencimientos"
                description="Alertas visuales de vencimiento de términos legales (4h medida provisional, 30d audiencia)."
                actions={[
                    { label: 'Ver Términos', href: '/dashboard/terminos', variant: 'default' as const },
                ]}
            />
            <ModuleCard
                icon={<Megaphone className="h-6 w-6 text-pink-600" />}
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
                icon={<ShieldCheck className="h-6 w-6 text-emerald-600" />}
                title="Bandeja de Firma"
                subtitle="Aprobación de Autos y Medidas"
                description="Revisar y firmar digitalmente los autos preparados por el Secretario."
                actions={[
                    { label: 'Ver Pendientes', href: '/dashboard/firma', variant: 'default' as const },
                ]}
            />
            <ModuleCard
                icon={<Scale className="h-6 w-6 text-violet-600" />}
                title="Audiencias"
                subtitle="Sala de Audiencia"
                description="Programar, dirigir audiencias y emitir fallos de medidas de protección."
                actions={[
                    { label: 'Ver Audiencias', href: '/dashboard/audiencias', variant: 'default' as const },
                ]}
            />
            <ModuleCard
                icon={<BarChart3 className="h-6 w-6 text-cyan-600" />}
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
function ModuleCard({ icon, title, subtitle, description, actions }: {
    icon: React.ReactNode
    title: string
    subtitle: string
    description: string
    actions: { label: string; href: string; variant: 'default' | 'outline' }[]
}) {
    return (
        <Card className="flex flex-col border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="flex items-center gap-3">
                    {icon}
                    <div>
                        <CardTitle className="text-base">{title}</CardTitle>
                        <CardDescription className="text-xs">{subtitle}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
                <p className="text-sm text-slate-500">{description}</p>
                <div className="mt-auto flex flex-col gap-2">
                    {actions.map((action, i) => (
                        <Button key={i} variant={action.variant} className="w-full justify-between" asChild>
                            <Link href={action.href}>
                                <span>{action.label}</span>
                                <ArrowRight size={16} />
                            </Link>
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

function getRolDescription(rol: RolUsuario | undefined): string {
    switch (rol) {
        case 'AUXILIAR': return 'Panel de Control — Recepción y Radicación'
        case 'PSICOLOGO': return 'Panel de Control — Equipo Psicosocial (Psicología)'
        case 'TRABAJADOR_SOCIAL': return 'Panel de Control — Equipo Psicosocial (Trabajo Social)'
        case 'SECRETARIO': return 'Panel de Control — Secretaría de Despacho'
        case 'ABOGADO': return 'Panel de Control — Asesoría Jurídica'
        case 'COMISARIO': return 'Panel de Control — Despacho del Comisario'
        case 'ADMINISTRADOR': return 'Panel de Control — Administración General'
        default: return 'Panel de Control'
    }
}
