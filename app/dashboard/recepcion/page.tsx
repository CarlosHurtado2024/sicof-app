
import { createClient } from '@/lib/supabase/server'
import { MinutaForm } from '@/components/module-recepcion/minuta-form'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default async function ReceptionPage() {
    const supabase = await createClient()

    // Fetch recent minutas (last 20)
    const { data: minutas } = await supabase
        .from('minutas')
        .select('*, funcionario:usuarios(nombre)')
        .order('fecha_hora_ingreso', { ascending: false })
        .limit(20)

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Recepción y Radicación</h1>
                    <p className="text-slate-500">Ventanilla Única Digital - Control de Ingreso</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-medium">
                        {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                    </div>
                    <Link href="/dashboard/recepcion/nuevo-caso">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            + Radicar Nuevo Caso
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Form */}
                <div className="lg:col-span-1">
                    <MinutaForm />
                </div>

                {/* Right Column: List */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Historial de Ingresos Recientes</CardTitle>
                            <CardDescription>Ultimos 20 registros en ventanilla.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-slate-500 font-medium border-b">
                                        <tr>
                                            <th className="px-4 py-3">Hora</th>
                                            <th className="px-4 py-3">Visitante</th>
                                            <th className="px-4 py-3">Motivo</th>
                                            <th className="px-4 py-3">Funcionario</th>
                                            <th className="px-4 py-3">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {minutas?.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                                                    No hay registros hoy.
                                                </td>
                                            </tr>
                                        ) : (
                                            minutas?.map((minuta: any) => (
                                                <tr key={minuta.id} className="hover:bg-slate-50/50">
                                                    <td className="px-4 py-3 font-mono text-slate-600">
                                                        {format(new Date(minuta.fecha_hora_ingreso), 'HH:mm')}
                                                    </td>
                                                    <td className="px-4 py-3 font-medium text-slate-900">
                                                        {minuta.nombre_visitante}
                                                        <div className="text-xs text-slate-400">{minuta.documento_visitante}</div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                                ${minuta.motivo_visita === 'DENUNCIA' ? 'bg-red-100 text-red-700' :
                                                                minuta.motivo_visita === 'AUDIENCIA' ? 'bg-purple-100 text-purple-700' :
                                                                    'bg-slate-100 text-slate-700'}`}>
                                                            {minuta.motivo_visita}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-500 text-xs">
                                                        {minuta.funcionario?.nombre || 'Desconocido'}
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-500 text-xs">
                                                        {minuta.fecha_hora_salida ? 'SALIDA REGISTRADA' : 'EN ATENCIÓN'}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
