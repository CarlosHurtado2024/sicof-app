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
        <div className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor: '#0a1118', color: 'rgba(255,255,255,0.9)' }}>
            {/* Background blobs */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(255,122,89,0.1) 0%, transparent 70%)' }} />
                <div className="absolute bottom-[-15%] right-[-5%] w-[50vw] h-[50vw] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(152,255,152,0.06) 0%, transparent 70%)' }} />
                <div className="absolute top-[30%] right-[15%] w-[30vw] h-[30vw] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(255,253,208,0.05) 0%, transparent 70%)' }} />
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

                {/* Main Content */}
                <main className="px-4 py-6 sm:pt-16 sm:pl-[228px] sm:pr-6 lg:pr-10 max-w-[1920px]">
                    {children}
                </main>
            </div>
        </div>
    )
}
