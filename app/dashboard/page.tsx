
import { getUserProfile } from '@/lib/auth-helpers'
import { createClient } from '@/lib/supabase/server'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import {
    Users,
    Archive,
    Calendar,
    PlusCircle,
    HeartPulse,
    FileText,
    ShieldCheck,
    Scale,
    BarChart3,
    Timer,
    Eye,
    Stamp,
    Megaphone,
    Siren,
    ChevronRight,
    BotMessageSquare
} from 'lucide-react'
import type { RolUsuario } from '@/types/db'

// Granular stats for the advanced flow diagram
async function getStats() {
    const supabase = await createClient()

    const [
        { count: totalCasos },
        { count: casosEnTramite },
        { count: casosSeguimiento },
        { count: medidasVigentes },
        // Recepción breakdown
        { count: recSexual },
        { count: recFisica },
        { count: recPsicologica },
        { count: recEconomica },
        // Valoración breakdown
        { count: valTotal },
        // Cierre breakdown
        { count: cieFiscalia },
        { count: cieMedidas },
        { count: cieConciliacion },
        { count: cieArchivo },
    ] = await Promise.all([
        supabase.from('expedientes').select('*', { count: 'exact', head: true }),
        supabase.from('expedientes').select('*', { count: 'exact', head: true }).eq('estado', 'TRAMITE'),
        supabase.from('expedientes').select('*', { count: 'exact', head: true }).eq('fase_proceso', 'SEGUIMIENTO'),
        supabase.from('medidas').select('*', { count: 'exact', head: true }).eq('estado', 'VIGENTE'),

        // Recepción by tipology
        supabase.from('expedientes').select('*', { count: 'exact', head: true }).eq('tipologia_violencia', 'SEXUAL'),
        supabase.from('expedientes').select('*', { count: 'exact', head: true }).eq('tipologia_violencia', 'FISICA'),
        supabase.from('expedientes').select('*', { count: 'exact', head: true }).eq('tipologia_violencia', 'PSICOLOGICA'),
        supabase.from('expedientes').select('*', { count: 'exact', head: true }).in('tipologia_violencia', ['ECONOMICA', 'PATRIMONIAL']),

        // Valoración
        supabase.from('expedientes').select('*', { count: 'exact', head: true }).eq('fase_proceso', 'VALORACION'),

        // Cierre / Outcomes (using state or phase)
        supabase.from('expedientes').select('*', { count: 'exact', head: true }).eq('fase_proceso', 'CIERRE').not('descripcion_remision', 'is', null),
        supabase.from('expedientes').select('*', { count: 'exact', head: true }).eq('fase_proceso', 'MEDIDAS'),
        supabase.from('expedientes').select('*', { count: 'exact', head: true }).eq('fase_proceso', 'SEGUIMIENTO'),
        supabase.from('expedientes').select('*', { count: 'exact', head: true }).eq('estado', 'ARCHIVO'),
    ])

    return {
        totalCasos: totalCasos || 0,
        casosEnTramite: casosEnTramite || 0,
        casosSeguimiento: casosSeguimiento || 0,
        medidasVigentes: medidasVigentes || 0,
        flow: {
            recepcion: {
                sexual: recSexual || 0,
                fisica: recFisica || 0,
                psicologica: recPsicologica || 0,
                economica: recEconomica || 0,
                menores: Math.max((totalCasos || 0) - (recSexual || 0) - (recFisica || 0) - (recPsicologica || 0) - (recEconomica || 0), 0)
            },
            valoracion: {
                psicologia: Math.ceil((valTotal || 0) * 0.6),
                social: Math.floor((valTotal || 0) * 0.4)
            },
            cierre: {
                fiscalia: cieFiscalia || 0,
                medidas: cieMedidas || 0,
                conciliacion: cieConciliacion || 0,
                archivo: cieArchivo || 0
            }
        }
    }
}

import AdvancedFlowDiagram from '@/components/dashboard/advanced-flow-diagram'

export default async function DashboardPage() {
    const profileData = await getUserProfile()
    const userRole = profileData?.profile?.rol as RolUsuario | undefined
    const stats = await getStats()

    const nombreUsuario = profileData?.profile?.nombre || 'Usuario'
    const firstName = nombreUsuario.split(' ')[0]

    return (
        <div className="flex flex-col gap-5 max-w-[1200px] mx-auto">
            {/* Welcome Header */}
            <div className="rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Siren className="h-4 w-4" style={{ color: '#ff7a59' }} />
                        <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#ff7a59' }}>Panel de Control</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white">
                        {getGreeting()}, <span style={{ color: '#ff7a59' }}>{firstName}</span>
                    </h1>
                    <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        {getRolTitle(userRole)} — {getRolDescription(userRole)}
                    </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Link href="/dashboard/recepcion" className="flex-1 sm:flex-initial">
                        <Button variant="ghost" className="w-full px-4 h-10 rounded-lg text-xs font-medium transition-colors" style={{ color: 'rgba(255,255,255,0.45)' }}>
                            Recepción
                        </Button>
                    </Link>
                    <Link href="/dashboard/recepcion/nuevo-caso" className="flex-1 sm:flex-initial">
                        <Button className="w-full px-4 h-10 rounded-lg text-xs font-medium transition-colors shadow-sm text-white" style={{ background: '#ff7a59', boxShadow: '0 4px 14px rgba(255,122,89,0.25)' }}>
                            <PlusCircle className="mr-1.5 h-4 w-4" />
                            Nuevo Caso
                        </Button>
                    </Link>
                </div>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <KPIChip label="Activos" value={stats.totalCasos} color="blue" />
                <KPIChip label="Triaje" value={stats.casosEnTramite} color="orange" />
                <KPIChip label="Medidas" value={stats.medidasVigentes} color="purple" />
                <KPIChip label="Seguimientos" value={stats.casosSeguimiento} color="green" />
            </div>

            {/* Advanced Flow Diagram */}
            <AdvancedFlowDiagram data={stats.flow} />

            {/* Komi AI Module — visible for all roles */}
            <div className="space-y-4">
                <h3 className="text-[11px] font-semibold text-white/25 uppercase tracking-widest flex items-center gap-2 px-1">
                    <span className="w-6 h-px bg-white/[0.1]" />
                    Inteligencia Artificial
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <ModuleCard
                        icon={<BotMessageSquare className="h-4 w-4" />}
                        iconBg="bg-gradient-to-br from-[#ff7a59]/10 to-[#ff7a59]/5"
                        iconColor="text-[#ff7a59]"
                        title="Komi AI"
                        subtitle="Asistente Inteligente"
                        description="Consulta datos del sistema en lenguaje natural. Pregunta sobre expedientes, víctimas, medidas y más."
                        actions={[
                            { label: 'Abrir Chat', href: '/dashboard/komi-ai', variant: 'default' as const },
                        ]}
                    />
                </div>
            </div>

            {/* Modules Section */}
            {(userRole !== 'AUXILIAR') && (
                <div className="space-y-4">
                    <h3 className="text-[11px] font-semibold uppercase tracking-widest flex items-center gap-2 px-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
                        <span className="w-6 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
                        Módulos disponibles
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {userRole === 'ADMINISTRADOR' && <AuxiliarModules />}
                        {(userRole === 'PSICOLOGO' || userRole === 'TRABAJADOR_SOCIAL' || userRole === 'ADMINISTRADOR') && <PsicosocialModules />}
                        {(userRole === 'SECRETARIO' || userRole === 'ABOGADO' || userRole === 'ADMINISTRADOR') && <SecretarioModules />}
                        {(userRole === 'COMISARIO' || userRole === 'ADMINISTRADOR') && <ComisarioModules />}
                    </div>
                </div>
            )}
        </div>
    )
}

// === KPI Chip ===
function KPIChip({ label, value, color }: { label: string; value: number; color: string }) {
    const accentColors: Record<string, string> = {
        blue: '#60a5fa',
        orange: '#fb923c',
        purple: '#a78bfa',
        green: '#34d399',
    }
    const accent = accentColors[color] || accentColors.blue
    return (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
            <span className="text-lg font-bold tabular-nums" style={{ color: accent }}>{value}</span>
        </div>
    )
}

// === Module Card ===
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
        <div className="rounded-xl overflow-hidden group transition-all glass-card hover:border-[#ff7a59]/20">
            <div className="p-5">
                <div className="flex items-start gap-3 mb-3">
                    <div className={`${iconBg} ${iconColor} p-2.5 rounded-lg flex-shrink-0`} style={{ background: 'rgba(255,122,89,0.08)' }}>
                        {icon}
                    </div>
                    <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white leading-tight">{title}</h4>
                        <p className="text-[10px] font-semibold tracking-wider uppercase mt-0.5" style={{ color: '#ff7a59' }}>{subtitle}</p>
                    </div>
                </div>
                <p className="text-xs leading-relaxed font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>{description}</p>
            </div>
            <div className="px-5 pb-5 pt-0 flex flex-col gap-2">
                {actions.map((action, i) => (
                    <Link
                        key={i}
                        href={action.href}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${action.variant === 'default'
                            ? 'text-white shadow-sm'
                            : ''
                            }`}
                        style={action.variant === 'default'
                            ? { background: '#ff7a59', boxShadow: '0 4px 14px rgba(255,122,89,0.2)' }
                            : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }
                        }
                    >
                        <span>{action.label}</span>
                        <ChevronRight size={14} className="opacity-40" />
                    </Link>
                ))}
            </div>
        </div>
    )
}

// === Módulos AUXILIAR ===
function AuxiliarModules() {
    return (
        <>
            <ModuleCard
                icon={<Users className="h-4 w-4" />}
                iconBg="bg-white/[0.04]"
                iconColor="text-white"
                title="Recepción y Radicación"
                subtitle="Ventanilla Única Digital"
                description="Registro de minuta, ingreso de usuarios, validación de competencia y generación de radicado."
                actions={[
                    { label: 'Nueva Minuta', href: '/dashboard/recepcion', variant: 'default' as const },
                    { label: 'Radicar Nuevo Caso', href: '/dashboard/recepcion/nuevo-caso', variant: 'outline' as const },
                ]}
            />
            <ModuleCard
                icon={<Archive className="h-4 w-4" />}
                iconBg="bg-amber-500/10"
                iconColor="text-amber-400"
                title="Gestión Documental"
                subtitle="Expediente Digital"
                description="Carga de documentos, foliación digital e indexación automática al expediente."
                actions={[
                    { label: 'Buscar Expediente', href: '/dashboard/casos', variant: 'outline' as const },
                ]}
            />
            <ModuleCard
                icon={<Calendar className="h-4 w-4" />}
                iconBg="bg-emerald-500/10"
                iconColor="text-emerald-400"
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
                icon={<HeartPulse className="h-4 w-4" />}
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
                icon={<FileText className="h-4 w-4" />}
                iconBg="bg-white/[0.04]"
                iconColor="text-white/60"
                title="Informes Periciales"
                subtitle="Equipo Interdisciplinario"
                description="Generar informes de valoración psicológica, visita domiciliaria y verificación de derechos."
                actions={[
                    { label: 'Mis Informes', href: '/dashboard/informes', variant: 'outline' as const },
                ]}
            />
            <ModuleCard
                icon={<Eye className="h-4 w-4" />}
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
                icon={<Stamp className="h-4 w-4" />}
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
                icon={<Timer className="h-4 w-4" />}
                iconBg="bg-red-500/10"
                iconColor="text-red-400"
                title="Control de Términos"
                subtitle="Semáforo de Vencimientos"
                description="Alertas visuales de vencimiento de términos legales (4h medida provisional, 30d audiencia)."
                actions={[
                    { label: 'Ver Términos', href: '/dashboard/terminos', variant: 'default' as const },
                ]}
            />
            <ModuleCard
                icon={<Megaphone className="h-4 w-4" />}
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
                icon={<ShieldCheck className="h-4 w-4" />}
                iconBg="bg-emerald-500/10"
                iconColor="text-emerald-400"
                title="Bandeja de Firma"
                subtitle="Aprobación de Autos y Medidas"
                description="Revisar y firmar digitalmente los autos preparados por el Secretario."
                actions={[
                    { label: 'Ver Pendientes', href: '/dashboard/firma', variant: 'default' as const },
                ]}
            />
            <ModuleCard
                icon={<Scale className="h-4 w-4" />}
                iconBg="bg-white/[0.04]"
                iconColor="text-white"
                title="Audiencias"
                subtitle="Sala de Audiencia"
                description="Programar, dirigir audiencias y emitir fallos de medidas de protección."
                actions={[
                    { label: 'Ver Audiencias', href: '/dashboard/audiencias', variant: 'default' as const },
                ]}
            />
            <ModuleCard
                icon={<BarChart3 className="h-4 w-4" />}
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
