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
    MoreHorizontal,
    BotMessageSquare
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
        { label: 'Personas', href: '/dashboard/personas', icon: <UserSearch className="h-5 w-5" /> },
        { label: 'Komi AI', href: '/dashboard/komi-ai', icon: <BotMessageSquare className="h-5 w-5" /> },
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
            <header className="hidden sm:flex fixed top-0 left-[220px] right-0 h-12 z-40 items-center justify-end px-6" style={{ background: 'rgba(10, 17, 24, 0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2">
                    {rightSlot}
                </div>
            </header>

            {/* ─── Desktop/Tablet Left Sidebar (≥640px) ─── */}
            <aside className="hidden sm:flex fixed top-0 left-0 bottom-0 z-50 w-[220px] flex-col safe-top safe-bottom" style={{ background: 'rgba(17, 24, 33, 0.8)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                {/* Logo */}
                <Link href="/dashboard" className="flex items-center gap-3 px-5 pt-5 pb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0" style={{ background: '#ff7a59', boxShadow: '0 4px 14px rgba(255,122,89,0.25)' }}>
                        <SicofLogoIcon className="w-6 h-6" inverted={true} />
                    </div>
                    <span className="text-white text-xl font-bold tracking-tight">Komi</span>
                </Link>

                {/* Nav Items */}
                <nav className="flex-1 flex flex-col gap-1 overflow-y-auto scrollbar-hide px-3">
                    {navItems.map((item) => {
                        const isActive = isNavActive(pathname, item.href)
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 flex-shrink-0 ${isActive
                                    ? 'text-white shadow-md'
                                    : 'hover:bg-white/5'
                                    }`}
                                style={isActive ? { background: '#ff7a59', boxShadow: '0 4px 14px rgba(255,122,89,0.2)' } : { color: 'rgba(255,255,255,0.45)' }}
                            >
                                {item.icon}
                                <span className="text-sm font-medium">{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                {/* Logout Button */}
                <div className="px-3 pb-5 mt-auto">
                    <button
                        onClick={() => {
                            const form = document.createElement('form')
                            form.method = 'POST'
                            form.action = '/auth/signout'
                            document.body.appendChild(form)
                            form.submit()
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200"
                        style={{ color: 'rgba(255,255,255,0.3)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.1)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'transparent' }}
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="text-sm font-medium">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* ─── Phone-only Top Header Bar (<640px) ─── */}
            <header className="sm:hidden sticky top-0 left-0 right-0 z-50 safe-top" style={{ background: 'rgba(10, 17, 24, 0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between h-16 px-4">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm" style={{ background: '#ff7a59' }}>
                            <SicofLogoIcon className="w-7 h-7" inverted={true} />
                        </div>
                        <span className="text-white font-black text-xl tracking-tighter">Komi</span>
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
