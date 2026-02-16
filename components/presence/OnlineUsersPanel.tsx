'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Circle, Clock, Users, Wifi, WifiOff } from 'lucide-react'
import type { PresenceUser } from '@/lib/hooks/usePresence'

const ROL_LABELS: Record<string, string> = {
    COMISARIO: 'Comisario/a',
    SECRETARIO: 'Secretario/a',
    PSICOLOGO: 'Psicólogo/a',
    TRABAJADOR_SOCIAL: 'T. Social',
    ABOGADO: 'Abogado/a',
    AUXILIAR: 'Auxiliar',
    PRACTICANTE: 'Practicante',
    USUARIO_EXTERNO: 'Externo',
    ADMINISTRADOR: 'Admin',
}

const ROL_COLORS: Record<string, string> = {
    COMISARIO: 'bg-purple-100 text-purple-700 border-purple-200',
    SECRETARIO: 'bg-sky-100 text-sky-700 border-sky-200',
    PSICOLOGO: 'bg-rose-100 text-rose-700 border-rose-200',
    TRABAJADOR_SOCIAL: 'bg-amber-100 text-amber-700 border-amber-200',
    ABOGADO: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    AUXILIAR: 'bg-blue-100 text-blue-700 border-blue-200',
    PRACTICANTE: 'bg-teal-100 text-teal-700 border-teal-200',
    USUARIO_EXTERNO: 'bg-slate-100 text-slate-700 border-slate-200',
    ADMINISTRADOR: 'bg-indigo-100 text-indigo-700 border-indigo-200',
}

function getRelativeTime(dateString: string): string {
    if (!dateString) return 'Sin registro'

    const now = new Date()
    const date = new Date(dateString)
    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)

    if (diffSec < 60) return 'Justo ahora'
    if (diffMin < 2) return 'Hace 1 min'
    if (diffMin < 60) return `Hace ${diffMin} min`
    if (diffHour < 2) return 'Hace 1 hora'
    if (diffHour < 24) return `Hace ${diffHour} horas`
    if (diffDay < 2) return 'Ayer'
    if (diffDay < 7) return `Hace ${diffDay} días`
    return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
}

function StatusDot({ status }: { status: 'online' | 'away' | 'offline' }) {
    const styles = {
        online: 'bg-emerald-500 shadow-emerald-400/50',
        away: 'bg-amber-400 shadow-amber-300/50',
        offline: 'bg-slate-300 shadow-transparent',
    }

    return (
        <span className="relative flex h-3 w-3">
            {status === 'online' && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            )}
            <span
                className={`relative inline-flex h-3 w-3 rounded-full shadow-md ${styles[status]}`}
            />
        </span>
    )
}

function UserCard({ user, currentUserId }: { user: PresenceUser; currentUserId: string }) {
    const initials = user.nombre
        .split(' ')
        .map(n => n.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)

    const isCurrentUser = user.userId === currentUserId

    const avatarColors = {
        online: 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white ring-emerald-200',
        away: 'bg-gradient-to-br from-amber-400 to-orange-500 text-white ring-amber-200',
        offline: 'bg-gradient-to-br from-slate-200 to-slate-300 text-slate-500 ring-slate-100',
    }

    return (
        <div
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-white hover:shadow-sm ${isCurrentUser ? 'bg-blue-50/60 ring-1 ring-blue-100' : ''
                }`}
        >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
                <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ring-2 transition-all duration-300 ${avatarColors[user.status]}`}
                >
                    {initials}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5">
                    <StatusDot status={user.status} />
                </div>
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-medium text-slate-800">
                        {user.nombre}
                        {isCurrentUser && (
                            <span className="ml-1 text-[10px] font-normal text-blue-500">(tú)</span>
                        )}
                    </p>
                </div>
                <div className="mt-0.5 flex items-center gap-2">
                    <span
                        className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold leading-none ${ROL_COLORS[user.rol] || 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                    >
                        {ROL_LABELS[user.rol] || user.rol}
                    </span>
                    {user.status !== 'online' && user.lastSeen && (
                        <span className="flex items-center gap-0.5 text-[10px] text-slate-400">
                            <Clock className="h-2.5 w-2.5" />
                            {getRelativeTime(user.lastSeen)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

function CollapsibleSection({
    title,
    icon,
    count,
    defaultOpen,
    children,
    accentColor,
}: {
    title: string
    icon: React.ReactNode
    count: number
    defaultOpen: boolean
    children: React.ReactNode
    accentColor: string
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen)

    return (
        <div className="mb-1">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors hover:bg-slate-100"
            >
                {isOpen ? (
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                )}
                {icon}
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {title}
                </span>
                <span
                    className={`ml-auto inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${accentColor}`}
                >
                    {count}
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="space-y-0.5 px-1 pb-2">{children}</div>
            </div>
        </div>
    )
}

export default function OnlineUsersPanel({
    allUsers,
    onlineUsers,
    currentUserId,
}: {
    allUsers: PresenceUser[]
    onlineUsers: PresenceUser[]
    currentUserId: string
}) {
    const onlineIds = new Set(onlineUsers.map(u => u.userId))

    // Merge presence data: online from realtime, rest from DB
    const enrichedUsers = allUsers.map(u => {
        const rtUser = onlineUsers.find(ou => ou.userId === u.userId)
        if (rtUser) {
            return { ...u, ...rtUser, status: rtUser.status as 'online' | 'away' | 'offline' }
        }
        return { ...u, status: onlineIds.has(u.userId) ? 'online' as const : u.status }
    })

    const online = enrichedUsers.filter(u => u.status === 'online')
    const away = enrichedUsers.filter(u => u.status === 'away')
    const offline = enrichedUsers.filter(u => u.status === 'offline')

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="border-b border-slate-100 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3">
                <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-white/90" />
                    <h3 className="text-sm font-bold text-white">Equipo</h3>
                </div>
                <p className="mt-0.5 text-[11px] text-blue-100">
                    {online.length} de {enrichedUsers.length} conectados
                </p>
            </div>

            {/* Summary bar */}
            <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/80 px-4 py-2">
                <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-[11px] font-medium text-slate-600">{online.length}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    <span className="text-[11px] font-medium text-slate-600">{away.length}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-slate-300" />
                    <span className="text-[11px] font-medium text-slate-600">{offline.length}</span>
                </div>
            </div>

            {/* User Lists */}
            <div className="flex-1 overflow-y-auto px-2 py-2">
                {/* Online */}
                <CollapsibleSection
                    title="En línea"
                    icon={<Wifi className="h-3.5 w-3.5 text-emerald-500" />}
                    count={online.length}
                    defaultOpen={true}
                    accentColor="bg-emerald-100 text-emerald-700"
                >
                    {online.length === 0 ? (
                        <p className="px-3 py-2 text-xs text-slate-400 italic">Nadie en línea</p>
                    ) : (
                        online.map(u => (
                            <UserCard key={u.userId} user={u} currentUserId={currentUserId} />
                        ))
                    )}
                </CollapsibleSection>

                {/* Away */}
                <CollapsibleSection
                    title="Ausente"
                    icon={<Clock className="h-3.5 w-3.5 text-amber-500" />}
                    count={away.length}
                    defaultOpen={true}
                    accentColor="bg-amber-100 text-amber-700"
                >
                    {away.length === 0 ? (
                        <p className="px-3 py-2 text-xs text-slate-400 italic">Nadie ausente</p>
                    ) : (
                        away.map(u => (
                            <UserCard key={u.userId} user={u} currentUserId={currentUserId} />
                        ))
                    )}
                </CollapsibleSection>

                {/* Offline */}
                <CollapsibleSection
                    title="Desconectado"
                    icon={<WifiOff className="h-3.5 w-3.5 text-slate-400" />}
                    count={offline.length}
                    defaultOpen={false}
                    accentColor="bg-slate-100 text-slate-600"
                >
                    {offline.length === 0 ? (
                        <p className="px-3 py-2 text-xs text-slate-400 italic">Todos conectados</p>
                    ) : (
                        offline.map(u => (
                            <UserCard key={u.userId} user={u} currentUserId={currentUserId} />
                        ))
                    )}
                </CollapsibleSection>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 bg-slate-50/80 px-4 py-2">
                <p className="text-center text-[10px] text-slate-400">
                    Actualización en tiempo real
                </p>
            </div>
        </div>
    )
}
