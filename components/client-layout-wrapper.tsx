'use client'

import { useEffect, useState } from 'react'
import TopNavBar from '@/components/floating-sidebar'
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

            {/* Top Navigation Bar — Logo + Nav + Equipo + Avatar */}
            <TopNavBar
                userRole={userRole}
                rightSlot={
                    <>
                        <PresenceWrapper
                            currentUser={{
                                id: userId,
                                nombre: userName,
                                email: userEmail,
                                rol: userRole || 'USUARIO_EXTERNO'
                            }}
                        />
                        <UserMenu
                            userName={userName}
                            userEmail={userEmail}
                            userInitial={userInitial}
                        />
                    </>
                }
            />
        </>
    )
}
