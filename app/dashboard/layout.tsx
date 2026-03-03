import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserProfile } from '@/lib/auth-helpers'
import type { RolUsuario } from '@/types/db'
import ClientLayoutWrapper from '@/components/client-layout-wrapper'

const ROL_LABELS: Record<string, string> = {
    COMISARIO: 'Comisario/a de Familia',
    SECRETARIO: 'Secretario/a de Despacho',
    PSICOLOGO: 'Psicólogo/a',
    TRABAJADOR_SOCIAL: 'Trabajador/a Social',
    ABOGADO: 'Abogado/a',
    AUXILIAR: 'Auxiliar Administrativo',
    PRACTICANTE: 'Practicante',
    USUARIO_EXTERNO: 'Usuario Externo',
    ADMINISTRADOR: 'Administrador'
}

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const data = await getUserProfile()

    if (!data) {
        redirect('/login')
    }

    const { user, profile } = data
    const userRole = profile?.rol as RolUsuario | undefined

    return (
        <div className="bg-[#050505] text-white min-h-screen selection:bg-purple-500/30 selection:text-white relative overflow-hidden">
            {/* Background ambient light */}
            <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center opacity-30">
                <div className="absolute w-[800px] h-[800px] bg-purple-600/10 blur-[150px] mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }} />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_10%,transparent_100%)]" />
            </div>

            <div className="relative z-10">
                {/* Client-side components wrapper: Sidebar + Bottom Nav */}
                <ClientLayoutWrapper
                    userRole={userRole}
                    userName={profile?.nombre || 'Usuario'}
                    userEmail={user.email || ''}
                    userInitial={profile?.nombre?.charAt(0) || 'U'}
                    userId={user.id}
                />

                {/* Main Content — Offset left for sidebar on desktop/tablet */}
                <main className="px-4 py-6 sm:pl-[84px] sm:pr-6 lg:pr-10 max-w-[1920px]">
                    {children}
                </main>
            </div>
        </div>
    )
}
