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
        <div className="bg-[#f8fafc] dark:bg-slate-900 min-h-screen">
            {/* Client-side components wrapper */}
            <ClientLayoutWrapper
                userRole={userRole}
                userName={profile?.nombre || 'Usuario'}
                userEmail={user.email || ''}
                userInitial={profile?.nombre?.charAt(0) || 'U'}
                userId={user.id}
            />

            {/* Main Content with top padding to account for fixed header */}
            <main className="pt-24 p-6 lg:p-10 lg:pt-24 max-w-[1920px] mx-auto">
                {children}
            </main>
        </div>
    )
}

