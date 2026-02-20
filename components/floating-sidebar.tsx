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

interface TopNavBarProps {
    userRole: RolUsuario | undefined
    rightSlot?: React.ReactNode
}

function getNavItems(rol: RolUsuario | undefined): NavItem[] {
    const common: NavItem[] = [
        { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
        { label: 'Expedientes', href: '/dashboard/casos', icon: <FolderHeart className="h-5 w-5" /> },
    ]

    switch (rol) {
        case 'AUXILIAR':
            return [
                ...common,
                { label: 'Recepción', href: '/dashboard/recepcion', icon: <Users className="h-5 w-5" /> },
                { label: 'Documentos', href: '/dashboard/gestion-documental', icon: <Archive className="h-5 w-5" /> },
                { label: 'Notificaciones', href: '/dashboard/notificaciones', icon: <Megaphone className="h-5 w-5" /> },
                { label: 'Agenda', href: '/dashboard/agenda', icon: <Calendar className="h-5 w-5" /> },
                { label: 'Admin', href: '/dashboard/administrativo', icon: <ClipboardList className="h-5 w-5" /> },
            ]

        case 'PSICOLOGO':
        case 'TRABAJADOR_SOCIAL':
            return [
                ...common,
                { label: 'Valoraciones', href: '/dashboard/valoraciones', icon: <HeartPulse className="h-5 w-5" /> },
                { label: 'Asignados', href: '/dashboard/casos-asignados', icon: <Eye className="h-5 w-5" /> },
                { label: 'Informes', href: '/dashboard/informes', icon: <FileText className="h-5 w-5" /> },
            ]

        case 'SECRETARIO':
        case 'ABOGADO':
            return [
                ...common,
                { label: 'Documentos', href: '/dashboard/gestion-documental', icon: <Archive className="h-5 w-5" /> },
                { label: 'Autos', href: '/dashboard/autos', icon: <Stamp className="h-5 w-5" /> },
                { label: 'Términos', href: '/dashboard/terminos', icon: <Timer className="h-5 w-5" /> },
                { label: 'Notificaciones', href: '/dashboard/notificaciones', icon: <Megaphone className="h-5 w-5" /> },
            ]

        case 'COMISARIO':
            return [
                ...common,
                { label: 'Firma', href: '/dashboard/firma', icon: <ShieldCheck className="h-5 w-5" /> },
                { label: 'Audiencias', href: '/dashboard/audiencias', icon: <Scale className="h-5 w-5" /> },
                { label: 'Control', href: '/dashboard/control', icon: <BarChart3 className="h-5 w-5" /> },
                { label: 'Estadísticas', href: '/dashboard/estadisticas', icon: <BarChart3 className="h-5 w-5" /> },
            ]

        case 'ADMINISTRADOR':
            return [
                ...common,
                { label: 'Recepción', href: '/dashboard/recepcion', icon: <Users className="h-5 w-5" /> },
                { label: 'Valoraciones', href: '/dashboard/valoraciones', icon: <HeartPulse className="h-5 w-5" /> },
                { label: 'Documentos', href: '/dashboard/gestion-documental', icon: <Archive className="h-5 w-5" /> },
                { label: 'Autos', href: '/dashboard/autos', icon: <Stamp className="h-5 w-5" /> },
                { label: 'Términos', href: '/dashboard/terminos', icon: <Timer className="h-5 w-5" /> },
                { label: 'Audiencias', href: '/dashboard/audiencias', icon: <Scale className="h-5 w-5" /> },
                { label: 'Notificaciones', href: '/dashboard/notificaciones', icon: <Megaphone className="h-5 w-5" /> },
                { label: 'Agenda', href: '/dashboard/agenda', icon: <Calendar className="h-5 w-5" /> },
                { label: 'Estadísticas', href: '/dashboard/estadisticas', icon: <BarChart3 className="h-5 w-5" /> },
            ]

        default:
            return common
    }
}

export default function TopNavBar({ userRole, rightSlot }: TopNavBarProps) {
    const pathname = usePathname()
    const navItems = getNavItems(userRole)

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
            <div className="flex items-center h-16 px-4 gap-1">
                {/* Logo */}
                <Link href="/dashboard" className="flex-shrink-0 mr-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
                        <SicofLogoIcon className="w-7 h-7" inverted={true} />
                    </div>
                </Link>

                {/* Divider */}
                <div className="w-px h-8 bg-slate-200 mr-2 flex-shrink-0 hidden sm:block" />

                {/* Navigation Items — horizontal, scrollable */}
                <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1 min-w-0">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`group relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${isActive
                                        ? 'bg-[#7C3AED] text-white shadow-md shadow-violet-500/25'
                                        : 'text-slate-500 hover:text-[#7C3AED] hover:bg-violet-50'
                                    }`}
                            >
                                {item.icon}
                                <span className="hidden xl:inline">{item.label}</span>
                                {/* Tooltip for when labels are hidden */}
                                <span className="xl:hidden absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-900 text-white text-xs font-medium rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-xl z-50">
                                    {item.label}
                                </span>
                            </Link>
                        )
                    })}
                </nav>

                {/* Right slot: Equipo + Avatar */}
                {rightSlot && (
                    <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                        {rightSlot}
                    </div>
                )}
            </div>
        </header>
    )
}
