'use client'

import { useState } from 'react'
import { usePresence } from '@/lib/hooks/usePresence'
import OnlineUsersPanel from './OnlineUsersPanel'
import { Users, X, ChevronLeft } from 'lucide-react'

interface PresenceWrapperProps {
    currentUser: {
        id: string
        nombre: string
        email: string
        rol: string
    }
}

export default function PresenceWrapper({ currentUser }: PresenceWrapperProps) {
    const { onlineUsers, allUsers } = usePresence(currentUser)
    const [isPanelOpen, setIsPanelOpen] = useState(false)

    const onlineCount = onlineUsers.length

    return (
        <>
            {/* Floating Presence Button */}
            <button
                onClick={() => setIsPanelOpen(!isPanelOpen)}
                className="group relative flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md"
                title="Ver equipo conectado"
            >
                <div className="relative">
                    <Users className="h-4 w-4 text-slate-500 transition-colors group-hover:text-blue-600" />
                    {/* Online count badge */}
                    {onlineCount > 0 && (
                        <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-emerald-500 px-1 text-[9px] font-bold text-white shadow-sm">
                            {onlineCount}
                        </span>
                    )}
                </div>
                <span className="hidden text-xs font-medium text-slate-600 group-hover:text-blue-700 md:inline">
                    Equipo
                </span>
            </button>

            {/* Sliding Panel Overlay */}
            {isPanelOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300"
                    onClick={() => setIsPanelOpen(false)}
                />
            )}

            {/* Sliding Panel */}
            <div
                className={`fixed right-0 top-0 z-50 h-full w-80 transform bg-white shadow-2xl transition-transform duration-300 ease-in-out ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Close button */}
                <button
                    onClick={() => setIsPanelOpen(false)}
                    className="absolute right-3 top-3 z-10 rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                    <X className="h-4 w-4" />
                </button>

                <OnlineUsersPanel
                    allUsers={allUsers}
                    onlineUsers={onlineUsers}
                    currentUserId={currentUser.id}
                />
            </div>
        </>
    )
}
