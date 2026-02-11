
import { TriageForm } from '@/components/module-recepcion/triage-form'

export default function NuevoCasoPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Registro de Caso y Triaje</h1>
                    <p className="text-slate-500">Módulo 1: Recepción y Caracterización de Víctimas</p>
                </div>
            </div>

            <div className="flex justify-center">
                <TriageForm />
            </div>
        </div>
    )
}
