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
            {/* Presence Button */}
            <button
                onClick={() => setIsPanelOpen(!isPanelOpen)}
                className="group relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-white/50 hover:text-white border border-transparent hover:border-white/[0.1] hover:bg-white/[0.03] transition-all shadow-sm hover:shadow-md"
                title="Ver equipo conectado"
            >
                <div className="relative">
                    <Users className="h-[18px] w-[18px]" strokeWidth={2.5} />
                    {/* Online count badge */}
                    {onlineCount > 0 && (
                        <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#ff7a59] px-1 text-[9px] font-black text-[#52EBB0] border-2 border-white shadow-sm">
                            {onlineCount}
                        </span>
                    )}
                </div>
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
                        className={`fixed right-0 top-0 z-[70] h-full w-80 transform bg-white/[0.02] backdrop-blur-xl shadow-2xl transition-transform duration-300 ease-in-out hidden sm:block ${isPanelOpen ? 'sm:translate-x-0' : 'sm:translate-x-full'
                            }`}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setIsPanelOpen(false)}
                            className="absolute right-3 top-3 z-10 rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-slate-900"
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
                        className={`fixed bottom-0 left-0 right-0 z-[70] transform bg-white/[0.02] backdrop-blur-xl shadow-2xl transition-transform duration-300 ease-in-out rounded-t-2xl sm:hidden ${isPanelOpen ? 'translate-y-0' : 'translate-y-full'
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
                            className="absolute right-3 top-3 z-10 rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-slate-900"
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
