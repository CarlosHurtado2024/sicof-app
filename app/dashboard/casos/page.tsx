
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircle, Eye, AlertTriangle, Shield, Clock } from 'lucide-react'
import { FASES_INFO, type FaseProceso } from '@/lib/case-workflow'

const RIESGO_COLORS: Record<string, string> = {
    SIN_RIESGO: 'bg-gray-100 text-gray-700',
    BAJO: 'bg-green-100 text-green-700',
    MODERADO: 'bg-yellow-100 text-yellow-700',
    ALTO: 'bg-orange-100 text-orange-700',
    CRITICO: 'bg-red-100 text-red-700',
}

const FASE_COLORS: Record<string, string> = {
    RECEPCION: 'bg-blue-100 text-blue-700',
    VALORACION: 'bg-purple-100 text-purple-700',
    MEDIDAS: 'bg-amber-100 text-amber-700',
    SEGUIMIENTO: 'bg-emerald-100 text-emerald-700',
    CIERRE: 'bg-slate-100 text-slate-700',
}

export default async function CasosListPage() {
    const supabase = await createClient()

    const { data: expedientes } = await supabase
        .from('expedientes')
        .select(`
            *,
            personas (id, tipo, nombres, documento)
        `)
        .order('created_at', { ascending: false })
        .limit(50)

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">Expedientes</h1>
                    <p className="text-slate-500">Gestión de casos — Ruta de Atención Integral</p>
                </div>
                <Link href="/dashboard/recepcion/nuevo-caso">
                    <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                        <PlusCircle size={16} />
                        Radicar Nuevo Caso
                    </Button>
                </Link>
            </div>

            <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="text-left px-4 py-3 font-medium text-slate-500">Radicado</th>
                                    <th className="text-left px-4 py-3 font-medium text-slate-500">Víctima</th>
                                    <th className="text-left px-4 py-3 font-medium text-slate-500">Tipología</th>
                                    <th className="text-left px-4 py-3 font-medium text-slate-500">Fase</th>
                                    <th className="text-left px-4 py-3 font-medium text-slate-500">Riesgo</th>
                                    <th className="text-left px-4 py-3 font-medium text-slate-500">Fecha</th>
                                    <th className="text-left px-4 py-3 font-medium text-slate-500">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {(!expedientes || expedientes.length === 0) ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                                            No hay expedientes registrados.
                                        </td>
                                    </tr>
                                ) : (
                                    expedientes.map((exp: any) => {
                                        const victima = exp.personas?.find((p: any) => p.tipo === 'VICTIMA')
                                        const faseKey = exp.fase_proceso as FaseProceso || 'RECEPCION'
                                        return (
                                            <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="px-4 py-3">
                                                    <span className="font-mono font-semibold text-blue-700">{exp.radicado}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="font-medium text-slate-800">{victima?.nombres || '—'}</p>
                                                    <p className="text-xs text-slate-400">{victima?.documento || ''}</p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-xs">{exp.tipologia_violencia || '—'}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${FASE_COLORS[faseKey] || 'bg-gray-100'}`}>
                                                        {FASES_INFO[faseKey]?.nombre || faseKey}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${RIESGO_COLORS[exp.nivel_riesgo] || 'bg-gray-100'}`}>
                                                        {exp.nivel_riesgo}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-slate-500">
                                                    {new Date(exp.created_at).toLocaleDateString('es-CO')}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Link href={`/dashboard/casos/${exp.id}`}>
                                                        <Button variant="ghost" size="sm" className="gap-1 text-blue-600">
                                                            <Eye size={14} /> Ver
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
