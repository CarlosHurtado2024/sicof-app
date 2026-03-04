"use client"

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SicofLogoIcon } from '@/components/sicof-logo'
import {
    LayoutDashboard,
    Users,
    UserSearch,
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
    LogOut,
    Menu,
    X,
    MoreHorizontal
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
        { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="h-4.5 w-4.5" /> },
        { label: 'Expedientes', href: '/dashboard/casos', icon: <FolderHeart className="h-4.5 w-4.5" /> },
        { label: 'Personas', href: '/dashboard/personas', icon: <UserSearch className="h-4.5 w-4.5" /> },
    ]

    switch (rol) {
        case 'AUXILIAR':
            return [
                ...common,
                { label: 'Recepción', href: '/dashboard/recepcion', icon: <Users className="h-4.5 w-4.5" /> },
                { label: 'Documentos', href: '/dashboard/gestion-documental', icon: <Archive className="h-4.5 w-4.5" /> },
                { label: 'Notificaciones', href: '/dashboard/notificaciones', icon: <Megaphone className="h-4.5 w-4.5" /> },
                { label: 'Agenda', href: '/dashboard/agenda', icon: <Calendar className="h-4.5 w-4.5" /> },
                { label: 'Admin', href: '/dashboard/administrativo', icon: <ClipboardList className="h-4.5 w-4.5" /> },
            ]

        case 'PSICOLOGO':
        case 'TRABAJADOR_SOCIAL':
            return [
                ...common,
                { label: 'Valoraciones', href: '/dashboard/valoraciones', icon: <HeartPulse className="h-4.5 w-4.5" /> },
                { label: 'Asignados', href: '/dashboard/casos-asignados', icon: <Eye className="h-4.5 w-4.5" /> },
                { label: 'Informes', href: '/dashboard/informes', icon: <FileText className="h-4.5 w-4.5" /> },
            ]

        case 'SECRETARIO':
        case 'ABOGADO':
            return [
                ...common,
                { label: 'Documentos', href: '/dashboard/gestion-documental', icon: <Archive className="h-4.5 w-4.5" /> },
                { label: 'Autos', href: '/dashboard/autos', icon: <Stamp className="h-4.5 w-4.5" /> },
                { label: 'Términos', href: '/dashboard/terminos', icon: <Timer className="h-4.5 w-4.5" /> },
                { label: 'Notificaciones', href: '/dashboard/notificaciones', icon: <Megaphone className="h-4.5 w-4.5" /> },
            ]

        case 'COMISARIO':
            return [
                ...common,
                { label: 'Firma', href: '/dashboard/firma', icon: <ShieldCheck className="h-4.5 w-4.5" /> },
                { label: 'Audiencias', href: '/dashboard/audiencias', icon: <Scale className="h-4.5 w-4.5" /> },
                { label: 'Control', href: '/dashboard/control', icon: <BarChart3 className="h-4.5 w-4.5" /> },
                { label: 'Estadísticas', href: '/dashboard/estadisticas', icon: <BarChart3 className="h-4.5 w-4.5" /> },
            ]

        case 'ADMINISTRADOR':
            return [
                ...common,
                { label: 'Recepción', href: '/dashboard/recepcion', icon: <Users className="h-4.5 w-4.5" /> },
                { label: 'Valoraciones', href: '/dashboard/valoraciones', icon: <HeartPulse className="h-4.5 w-4.5" /> },
                { label: 'Documentos', href: '/dashboard/gestion-documental', icon: <Archive className="h-4.5 w-4.5" /> },
                { label: 'Autos', href: '/dashboard/autos', icon: <Stamp className="h-4.5 w-4.5" /> },
                { label: 'Términos', href: '/dashboard/terminos', icon: <Timer className="h-4.5 w-4.5" /> },
                { label: 'Audiencias', href: '/dashboard/audiencias', icon: <Scale className="h-4.5 w-4.5" /> },
                { label: 'Notificaciones', href: '/dashboard/notificaciones', icon: <Megaphone className="h-4.5 w-4.5" /> },
                { label: 'Agenda', href: '/dashboard/agenda', icon: <Calendar className="h-4.5 w-4.5" /> },
                { label: 'Estadísticas', href: '/dashboard/estadisticas', icon: <BarChart3 className="h-4.5 w-4.5" /> },
            ]

        default:
            return common
    }
}

// Helper: /dashboard solo coincide exacto; el resto usa prefix match
function isNavActive(pathname: string | null, href: string): boolean {
    if (!pathname) return false
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname === href || pathname.startsWith(href + '/')
}

// Maximum items to show directly in the bottom bar (excluding "More" button)
const MAX_BOTTOM_ITEMS = 4

export default function TopNavBar({ userRole, rightSlot }: TopNavBarProps) {
    const pathname = usePathname()
    const navItems = getNavItems(userRole)
    const [moreMenuOpen, setMoreMenuOpen] = useState(false)
    const moreMenuRef = useRef<HTMLDivElement>(null)

    // Determine which items go in the bottom bar vs overflow
    const needsMore = navItems.length > MAX_BOTTOM_ITEMS
    const bottomBarItems = needsMore ? navItems.slice(0, MAX_BOTTOM_ITEMS - 1) : navItems
    const overflowItems = needsMore ? navItems.slice(MAX_BOTTOM_ITEMS - 1) : []

    // Check if any overflow item is active (to highlight "More" button)
    const isOverflowActive = overflowItems.some(
        item => isNavActive(pathname, item.href)
    )

    // Close More menu when navigating
    useEffect(() => {
        setMoreMenuOpen(false)
    }, [pathname])

    // Close More menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
                setMoreMenuOpen(false)
            }
        }
        if (moreMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [moreMenuOpen])

    return (
        <>
            {/* ─── Desktop Top Header Bar (≥640px) ─── */}
            <header className="hidden sm:flex fixed top-0 left-[60px] right-0 h-12 bg-white/60 backdrop-blur-md border-b border-[#2B463C]/5 z-40 items-center justify-end px-6">
                <div className="flex items-center gap-2">
                    {rightSlot}
                </div>
            </header>

            {/* ─── Desktop/Tablet Left Sidebar (≥640px) ─── */}
            <aside className="hidden sm:flex fixed top-0 left-0 bottom-0 z-50 w-[60px] flex-col items-center bg-[#F2EBE1] border-r border-[#2B463C]/5 safe-top safe-bottom">
                {/* Logo */}
                <Link href="/dashboard" className="flex-shrink-0 mt-3 mb-5">
                    <div className="w-9 h-9 bg-[#F28C73] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#F28C73]/20 hover:scale-105 transition-all duration-300">
                        <SicofLogoIcon className="w-5 h-5" inverted={true} />
                    </div>
                </Link>

                {/* Divider */}
                <div className="w-8 h-px bg-[#2B463C]/8 mb-3" />

                {/* Nav Items */}
                <nav className="flex-1 flex flex-col items-center gap-2 overflow-y-auto scrollbar-hide py-1 w-full px-3">
                    {navItems.map((item) => {
                        const isActive = isNavActive(pathname, item.href)
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`group relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 flex-shrink-0 ${isActive
                                    ? 'bg-[#F28C73] text-white shadow-lg shadow-[#F28C73]/20'
                                    : 'text-[#333333]/40 hover:text-[#F28C73] hover:bg-white/50'
                                    }`}
                            >
                                {item.icon}
                                {/* Tooltip */}
                                <span className="absolute left-full ml-4 px-3 py-2 bg-[#333333] text-white text-[10px] font-black tracking-widest uppercase rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap shadow-xl z-[60] pointer-events-none">
                                    {item.label}
                                </span>
                            </Link>
                        )
                    })}
                </nav>

                {/* Logout Button */}
                <div className="pb-4 mt-auto w-full px-3">
                    <button
                        onClick={() => {
                            const form = document.createElement('form')
                            form.method = 'POST'
                            form.action = '/auth/signout'
                            document.body.appendChild(form)
                            form.submit()
                        }}
                        className="flex items-center justify-center w-full h-10 rounded-lg text-[#333333]/40 hover:text-red-500 hover:bg-red-50 transition-all duration-300"
                        title="Cerrar Sesión"
                    >
                        <LogOut className="h-4.5 w-4.5" />
                    </button>
                </div>
            </aside>

            {/* ─── Phone-only Top Header Bar (<640px) ─── */}
            <header className="sm:hidden sticky top-0 left-0 right-0 z-50 bg-[#F2EBE1]/95 backdrop-blur-xl border-b border-gray-200 safe-top">
                <div className="flex items-center justify-between h-16 px-4">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#F28C73] rounded-xl flex items-center justify-center text-white shadow-sm">
                            <SicofLogoIcon className="w-7 h-7" inverted={true} />
                        </div>
                        <span className="text-gray-900 font-black text-xl tracking-tighter">Komi</span>
                    </Link>

                    {/* Right: Notifications + Team + Avatar */}
                    <div className="flex items-center gap-1">
                        {rightSlot}
                    </div>
                </div>
            </header>

            {/* ─── Phone-only Bottom Navigation Bar (<640px) ─── */}
            <nav className="mobile-bottom-nav sm:hidden" aria-label="Navegación principal móvil">
                {bottomBarItems.map((item) => {
                    const isActive = isNavActive(pathname, item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`mobile-bottom-nav-item ${isActive ? 'active' : ''}`}
                        >
                            <span className="mobile-bottom-nav-icon">
                                {item.icon}
                            </span>
                            <span className="mobile-bottom-nav-label">{item.label}</span>
                            {isActive && <span className="mobile-bottom-nav-indicator" />}
                        </Link>
                    )
                })}

                {/* "More" button if overflow items exist */}
                {needsMore && (
                    <div className="relative" ref={moreMenuRef}>
                        <button
                            onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                            className={`mobile-bottom-nav-item ${isOverflowActive || moreMenuOpen ? 'active' : ''}`}
                            aria-label="Más opciones"
                            aria-expanded={moreMenuOpen}
                        >
                            <span className="mobile-bottom-nav-icon">
                                <MoreHorizontal className="h-5 w-5" />
                            </span>
                            <span className="mobile-bottom-nav-label">Más</span>
                            {(isOverflowActive || moreMenuOpen) && <span className="mobile-bottom-nav-indicator" />}
                        </button>

                        {/* Overflow menu popup */}
                        {moreMenuOpen && (
                            <div className="mobile-bottom-nav-overflow">
                                {overflowItems.map((item) => {
                                    const isActive = isNavActive(pathname, item.href)
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setMoreMenuOpen(false)}
                                            className={`mobile-bottom-nav-overflow-item ${isActive ? 'active' : ''}`}
                                        >
                                            <span className="mobile-bottom-nav-overflow-icon">{item.icon}</span>
                                            <span>{item.label}</span>
                                        </Link>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )}
            </nav>
        </>
    )
}
