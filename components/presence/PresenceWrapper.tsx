'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { usePresence } from '@/lib/hooks/usePresence'
import OnlineUsersPanel from './OnlineUsersPanel'
import { Users, X } from 'lucide-react'

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
            {/* Presence Button with Purple Theme */}
            <button
                onClick={() => setIsPanelOpen(!isPanelOpen)}
                className="group relative flex items-center gap-2 rounded-xl border border-[#7C3AED]/30 bg-[#7C3AED]/10 backdrop-blur-sm px-4 py-2.5 shadow-md shadow-[#7C3AED]/10 transition-all duration-200 hover:border-[#7C3AED]/50 hover:bg-[#7C3AED]/20 hover:shadow-lg hover:shadow-[#7C3AED]/20"
                title="Ver equipo conectado"
            >
                <div className="relative">
                    <Users className="h-5 w-5 text-[#7C3AED] transition-colors group-hover:text-[#6B31D1]" />
                    {/* Online count badge */}
                    {onlineCount > 0 && (
                        <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-emerald-500 px-1 text-[9px] font-bold text-white shadow-sm ring-2 ring-white">
                            {onlineCount}
                        </span>
                    )}
                </div>
                <span className="hidden text-sm font-semibold text-[#7C3AED] group-hover:text-[#6B31D1] md:inline">
                    Equipo
                </span>
            </button>

            {/* Portal: Render overlay and panel at document.body level to escape stacking context */}
            {typeof window !== 'undefined' && createPortal(
                <>
                    {/* Sliding Panel Overlay with Enhanced Blur */}
                    {isPanelOpen && (
                        <div
                            className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-md transition-all duration-300"
                            onClick={() => setIsPanelOpen(false)}
                        />
                    )}

                    {/* Desktop: Right Sidebar (sm+) */}
                    <div
                        className={`fixed right-0 top-0 z-[70] h-full w-80 transform bg-white shadow-2xl transition-transform duration-300 ease-in-out hidden sm:block ${isPanelOpen ? 'sm:translate-x-0' : 'sm:translate-x-full'
                            }`}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setIsPanelOpen(false)}
                            className="absolute right-3 top-3 z-10 rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <OnlineUsersPanel
                            allUsers={allUsers}
                            onlineUsers={onlineUsers}
                            currentUserId={currentUser.id}
                        />
                    </div>

                    {/* Mobile: Bottom Sheet (< sm) */}
                    <div
                        className={`fixed bottom-0 left-0 right-0 z-[70] transform bg-white shadow-2xl transition-transform duration-300 ease-in-out rounded-t-2xl sm:hidden ${isPanelOpen ? 'translate-y-0' : 'translate-y-full'
                            }`}
                        style={{ maxHeight: '60vh' }}
                    >
                        {/* Drag handle */}
                        <div className="flex justify-center pt-2 pb-0">
                            <div className="w-10 h-1 rounded-full bg-slate-300" />
                        </div>

                        {/* Close button */}
                        <button
                            onClick={() => setIsPanelOpen(false)}
                            className="absolute right-3 top-3 z-10 rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <div className="overflow-y-auto" style={{ maxHeight: 'calc(60vh - 12px)' }}>
                            <OnlineUsersPanel
                                allUsers={allUsers}
                                onlineUsers={onlineUsers}
                                currentUserId={currentUser.id}
                            />
                        </div>
                    </div>
                </>,
                document.body
            )}
        </>
    )
}
