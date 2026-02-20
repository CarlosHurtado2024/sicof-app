"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SicofLogoIcon } from '@/components/sicof-logo'
import {
    LayoutDashboard,
    Users,
    FileText,
    Bell,
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
    FolderHeart,
    LogOut
} from 'lucide-react'
import type { RolUsuario } from '@/types/db'

interface NavItem {
    label: string
    href: string
    icon: React.ReactNode
}

interface FloatingSidebarProps {
    userRole: RolUsuario | undefined
}

function getNavItems(rol: RolUsuario | undefined): NavItem[] {
    const common: NavItem[] = [
        { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="h-6 w-6" /> },
        { label: 'Expedientes', href: '/dashboard/casos', icon: <FolderHeart className="h-6 w-6" /> },
    ]

    switch (rol) {
        case 'AUXILIAR':
            return [
                ...common,
                { label: 'Recepción y Triaje', href: '/dashboard/recepcion', icon: <Users className="h-6 w-6" /> },
                { label: 'Gestión Documental', href: '/dashboard/gestion-documental', icon: <Archive className="h-6 w-6" /> },
                { label: 'Notificaciones', href: '/dashboard/notificaciones', icon: <Megaphone className="h-6 w-6" /> },
                { label: 'Agenda y Citas', href: '/dashboard/agenda', icon: <Calendar className="h-6 w-6" /> },
                { label: 'Admin y Control', href: '/dashboard/administrativo', icon: <ClipboardList className="h-6 w-6" /> },
            ]

        case 'PSICOLOGO':
        case 'TRABAJADOR_SOCIAL':
            return [
                ...common,
                { label: 'Mis Valoraciones', href: '/dashboard/valoraciones', icon: <HeartPulse className="h-6 w-6" /> },
                { label: 'Casos Asignados', href: '/dashboard/casos-asignados', icon: <Eye className="h-6 w-6" /> },
                { label: 'Informes Periciales', href: '/dashboard/informes', icon: <FileText className="h-6 w-6" /> },
            ]

        case 'SECRETARIO':
        case 'ABOGADO':
            return [
                ...common,
                { label: 'Gestor Documental', href: '/dashboard/gestion-documental', icon: <Archive className="h-6 w-6" /> },
                { label: 'Autos y Oficios', href: '/dashboard/autos', icon: <Stamp className="h-6 w-6" /> },
                { label: 'Control de Términos', href: '/dashboard/terminos', icon: <Timer className="h-6 w-6" /> },
                { label: 'Notificaciones', href: '/dashboard/notificaciones', icon: <Megaphone className="h-6 w-6" /> },
            ]

        case 'COMISARIO':
            return [
                ...common,
                { label: 'Bandeja de Firma', href: '/dashboard/firma', icon: <ShieldCheck className="h-6 w-6" /> },
                { label: 'Audiencias', href: '/dashboard/audiencias', icon: <Scale className="h-6 w-6" /> },
                { label: 'Tablero de Control', href: '/dashboard/control', icon: <BarChart3 className="h-6 w-6" /> },
                { label: 'Estadísticas', href: '/dashboard/estadisticas', icon: <BarChart3 className="h-6 w-6" /> },
            ]

        case 'ADMINISTRADOR':
            return [
                ...common,
                { label: 'Recepción y Triaje', href: '/dashboard/recepcion', icon: <Users className="h-6 w-6" /> },
                { label: 'Valoraciones', href: '/dashboard/valoraciones', icon: <HeartPulse className="h-6 w-6" /> },
                { label: 'Gestión Documental', href: '/dashboard/gestion-documental', icon: <Archive className="h-6 w-6" /> },
                { label: 'Autos y Oficios', href: '/dashboard/autos', icon: <Stamp className="h-6 w-6" /> },
                { label: 'Control de Términos', href: '/dashboard/terminos', icon: <Timer className="h-6 w-6" /> },
                { label: 'Audiencias', href: '/dashboard/audiencias', icon: <Scale className="h-6 w-6" /> },
                { label: 'Notificaciones', href: '/dashboard/notificaciones', icon: <Megaphone className="h-6 w-6" /> },
                { label: 'Agenda y Citas', href: '/dashboard/agenda', icon: <Calendar className="h-6 w-6" /> },
                { label: 'Estadísticas', href: '/dashboard/estadisticas', icon: <BarChart3 className="h-6 w-6" /> },
            ]

        default:
            return common
    }
}

export default function FloatingSidebar({ userRole }: FloatingSidebarProps) {
    const pathname = usePathname()
    const navItems = getNavItems(userRole)

    return (
        <aside className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
            <div className="backdrop-blur-xl bg-slate-900/80 border border-white/10 shadow-2xl flex flex-col items-center py-8 rounded-[2rem] w-20 gap-6">
                {/* Logo */}
                <div className="w-14 h-14 flex items-center justify-center">
                    <SicofLogoIcon className="w-12 h-12" inverted={true} />
                </div>

                {/* Navigation */}
                <nav className="flex flex-col items-center gap-3">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`group relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all ${isActive
                                    ? 'bg-[#7C3AED] text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]'
                                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {item.icon}
                                {/* Tooltip */}
                                <span className="absolute left-full ml-4 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-xl border border-white/10">
                                    {item.label}
                                </span>
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </aside>
    )
}
