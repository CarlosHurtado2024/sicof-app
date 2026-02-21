
import { RiskForm } from '@/components/module-riesgo/risk-form'
import { getUserProfile } from '@/lib/auth-helpers'

export default async function ValoracionRiesgoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const profileData = await getUserProfile()
    const userRole = profileData?.profile?.rol ?? ''

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Valoración de Riesgo</h1>
                    <p className="text-slate-500">Módulo 2: Instrumento de Referencia (Ley 1257 / Comisarías)</p>
                </div>
            </div>

            <RiskForm expedienteId={id} userRole={userRole} />
        </div>
    )
}
