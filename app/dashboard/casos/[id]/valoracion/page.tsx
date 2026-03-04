
import { RiskForm } from '@/components/module-riesgo/risk-form'
import { getUserProfile } from '@/lib/auth-helpers'

export default async function ValoracionRiesgoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const profileData = await getUserProfile()
    const userRole = profileData?.profile?.rol ?? ''

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">VALORACIÓN DE RIESGO</h1>
                    <p className="text-slate-500 font-medium uppercase tracking-[0.1em] text-xs mt-1">Módulo 2: Instrumento de Referencia Legal (Ley 1257)</p>
                </div>
            </div>

            <RiskForm expedienteId={id} userRole={userRole} />
        </div>
    )
}
