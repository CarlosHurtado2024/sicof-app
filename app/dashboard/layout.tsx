
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUserProfile } from '@/lib/auth-helpers'
import {
    LayoutDashboard,
    Users,
    FileText,
    Gavel,
    Bell,
    LogOut,
    Settings,
    Calendar,
    ClipboardList,
    Archive,
    Megaphone,
    HeartPulse,
    Scale,
    ShieldCheck,
    Eye,
    BarChart3,
    Stamp,
    Timer,
    FolderHeart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { RolUsuario } from '@/types/db'

// Definimos la estructura de navegación por rol
interface NavItem {
    label: string
    href: string
    icon: React.ReactNode
}

function getNavItems(rol: RolUsuario | undefined): NavItem[] {
    const common: NavItem[] = [
        { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
        { label: 'Expedientes', href: '/dashboard/casos', icon: <FolderHeart className="h-4 w-4" /> },
    ]

    switch (rol) {
        case 'AUXILIAR':
            return [
                ...common,
                { label: 'Recepción y Triaje', href: '/dashboard/recepcion', icon: <Users className="h-4 w-4" /> },
                { label: 'Gestión Documental', href: '/dashboard/gestion-documental', icon: <Archive className="h-4 w-4" /> },
                { label: 'Notificaciones', href: '/dashboard/notificaciones', icon: <Megaphone className="h-4 w-4" /> },
                { label: 'Agenda y Citas', href: '/dashboard/agenda', icon: <Calendar className="h-4 w-4" /> },
                { label: 'Admin y Control', href: '/dashboard/administrativo', icon: <ClipboardList className="h-4 w-4" /> },
            ]

        case 'PSICOLOGO':
        case 'TRABAJADOR_SOCIAL':
            return [
                ...common,
                { label: 'Mis Valoraciones', href: '/dashboard/valoraciones', icon: <HeartPulse className="h-4 w-4" /> },
                { label: 'Casos Asignados', href: '/dashboard/casos-asignados', icon: <Eye className="h-4 w-4" /> },
                { label: 'Informes Periciales', href: '/dashboard/informes', icon: <FileText className="h-4 w-4" /> },
            ]

        case 'SECRETARIO':
        case 'ABOGADO':
            return [
                ...common,
                { label: 'Gestor Documental', href: '/dashboard/gestion-documental', icon: <Archive className="h-4 w-4" /> },
                { label: 'Autos y Oficios', href: '/dashboard/autos', icon: <Stamp className="h-4 w-4" /> },
                { label: 'Control de Términos', href: '/dashboard/terminos', icon: <Timer className="h-4 w-4" /> },
                { label: 'Notificaciones', href: '/dashboard/notificaciones', icon: <Megaphone className="h-4 w-4" /> },
            ]

        case 'COMISARIO':
            return [
                ...common,
                { label: 'Bandeja de Firma', href: '/dashboard/firma', icon: <ShieldCheck className="h-4 w-4" /> },
                { label: 'Audiencias', href: '/dashboard/audiencias', icon: <Scale className="h-4 w-4" /> },
                { label: 'Tablero de Control', href: '/dashboard/control', icon: <BarChart3 className="h-4 w-4" /> },
                { label: 'Estadísticas', href: '/dashboard/estadisticas', icon: <BarChart3 className="h-4 w-4" /> },
            ]

        case 'ADMINISTRADOR':
            // Admin ve todo
            return [
                ...common,
                { label: 'Recepción y Triaje', href: '/dashboard/recepcion', icon: <Users className="h-4 w-4" /> },
                { label: 'Valoraciones', href: '/dashboard/valoraciones', icon: <HeartPulse className="h-4 w-4" /> },
                { label: 'Gestión Documental', href: '/dashboard/gestion-documental', icon: <Archive className="h-4 w-4" /> },
                { label: 'Autos y Oficios', href: '/dashboard/autos', icon: <Stamp className="h-4 w-4" /> },
                { label: 'Control de Términos', href: '/dashboard/terminos', icon: <Timer className="h-4 w-4" /> },
                { label: 'Audiencias', href: '/dashboard/audiencias', icon: <Scale className="h-4 w-4" /> },
                { label: 'Notificaciones', href: '/dashboard/notificaciones', icon: <Megaphone className="h-4 w-4" /> },
                { label: 'Agenda y Citas', href: '/dashboard/agenda', icon: <Calendar className="h-4 w-4" /> },
                { label: 'Estadísticas', href: '/dashboard/estadisticas', icon: <BarChart3 className="h-4 w-4" /> },
            ]

        default:
            return common
    }
}

const ROL_LABELS: Record<string, string> = {
    COMISARIO: 'Comisario/a de Familia',
    SECRETARIO: 'Secretario/a de Despacho',
    PSICOLOGO: 'Psicólogo/a',
    TRABAJADOR_SOCIAL: 'Trabajador/a Social',
    ABOGADO: 'Abogado/a',
    AUXILIAR: 'Auxiliar Administrativo',
    PRACTICANTE: 'Practicante',
    USUARIO_EXTERNO: 'Usuario Externo',
    ADMINISTRADOR: 'Administrador'
}

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const data = await getUserProfile()

    if (!data) {
        redirect('/login')
    }

    const { user, profile } = data
    const userRole = profile?.rol as RolUsuario | undefined
    const navItems = getNavItems(userRole)

    return (
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
            {/* Sidebar */}
            <div className="hidden border-r bg-slate-50 lg:block">
                <div className="flex h-full max-h-screen flex-col">
                    {/* Brand */}
                    <div className="flex h-[60px] items-center border-b px-6 bg-white">
                        <Link className="flex items-center gap-2 font-bold text-lg" href="/dashboard">
                            <Gavel className="h-6 w-6 text-blue-600" />
                            <span>SICOF</span>
                        </Link>
                        <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                            <Bell className="h-4 w-4" />
                            <span className="sr-only">Notificaciones</span>
                        </Button>
                    </div>

                    {/* Rol Badge */}
                    <div className="px-4 py-3 border-b bg-blue-50">
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-blue-400">Mi Rol</p>
                        <p className="text-sm font-semibold text-blue-700">{ROL_LABELS[userRole || ''] || 'Sin Rol'}</p>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 overflow-auto py-3">
                        <nav className="grid items-start px-3 text-sm font-medium gap-1">
                            {navItems.map((item, i) => (
                                <Link
                                    key={item.href}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-700"
                                    href={item.href}
                                >
                                    {item.icon}
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Footer */}
                    <div className="mt-auto border-t bg-white p-4">
                        <div className="mb-3 px-1">
                            <p className="text-sm font-semibold text-slate-800 truncate">{profile?.nombre}</p>
                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        </div>
                        <form action="/auth/signout" method="post">
                            <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50">
                                <LogOut className="h-4 w-4" />
                                Cerrar Sesión
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col">
                <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-white px-6">
                    <div className="w-full flex-1">
                        <h1 className="font-semibold text-lg text-slate-800">Comisaría de Familia</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-500">
                            {user.email}
                        </span>
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                            {profile?.nombre?.charAt(0) || 'U'}
                        </div>
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-slate-50/50">
                    {children}
                </main>
            </div>
        </div>
    )
}
