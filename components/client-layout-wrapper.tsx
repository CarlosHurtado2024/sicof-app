'use client'

import { useEffect, useState } from 'react'
import FloatingSidebar from '@/components/floating-sidebar'
import PresenceWrapper from '@/components/presence/PresenceWrapper'
import UserMenu from '@/components/user-menu'
import { CrisisAlertBanner } from '@/components/crisis-alert-banner'
import type { RolUsuario } from '@/types/db'

interface ClientLayoutWrapperProps {
    userRole: RolUsuario | undefined
    userName: string
    userEmail: string
    userInitial: string
    userId: string
}

export default function ClientLayoutWrapper({
    userRole,
    userName,
    userEmail,
    userInitial,
    userId
}: ClientLayoutWrapperProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <>
            {/* Global Crisis Alert System */}
            <CrisisAlertBanner userRole={userRole} userId={userId} />

            {/* Floating Sidebar - Only Navigation */}
            <FloatingSidebar userRole={userRole} />

            {/* Fixed Top Bar - Full Width */}
            <div className="fixed top-0 left-0 right-0 z-40 lg:left-32">
                <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
                    <div className="flex items-center justify-end gap-3 px-6 py-3">
                        {/* Presence Button */}
                        <PresenceWrapper
                            currentUser={{
                                id: userId,
                                nombre: userName,
                                email: userEmail,
                                rol: userRole || 'USUARIO_EXTERNO'
                            }}
                        />

                        {/* User Avatar Menu */}
                        <UserMenu
                            userName={userName}
                            userEmail={userEmail}
                            userInitial={userInitial}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
