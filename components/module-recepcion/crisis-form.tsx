
'use client'

import { useState, useRef } from 'react'
import { registrarCrisis } from '@/lib/actions/crisis'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Siren, Phone, HeartPulse, Loader2, CheckCircle2 } from 'lucide-react'

export function CrisisForm({ onClose }: { onClose: () => void }) {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState<{ radicado: string } | null>(null)
    const [formData, setFormData] = useState({
        nombre_victima: '',
        documento_victima: '',
        tipo_documento: 'CC',
        tipologia: 'FISICA' as 'FISICA' | 'PSICOLOGICA' | 'SEXUAL' | 'ECONOMICA' | 'PATRIMONIAL',
        descripcion_breve: '',
        acciones_inmediatas: '',
        requiere_traslado: false,
        entidad_traslado: '',
    })

    const update = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async () => {
        if (!formData.nombre_victima || !formData.descripcion_breve) {
            alert('Nombre y descripción son obligatorios.')
            return
        }
        setLoading(true)
        const result = await registrarCrisis(formData)
        setLoading(false)

        if (result.success) {
            setSuccess({ radicado: result.radicado! })
        } else {
            alert(`Error: ${result.error}`)
        }
    }

    if (success) {
        return (
            <Card className="w-full border-2 border-emerald-300 shadow-lg bg-gradient-to-br from-emerald-50 to-green-50">
                <CardContent className="pt-8 pb-8 text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-emerald-800">Caso de Emergencia Registrado</h3>
                    <div className="bg-white rounded-lg p-4 border border-emerald-200 inline-block">
                        <p className="text-sm text-slate-500">Radicado de Emergencia</p>
                        <p className="text-2xl font-mono font-bold text-emerald-700">{success.radicado}</p>
                    </div>
                    <div className="bg-red-50 border border-red-100 rounded-lg p-3 my-2 animate-pulse">
                        <p className="text-sm text-red-800 font-bold flex items-center justify-center gap-2">
                            <Siren className="h-4 w-4" />
                            ¡Alerta enviada al equipo psicosocial!
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                            Psicología y Trabajo Social han sido notificados.
                        </p>
                    </div>
                    <p className="text-sm text-slate-600">
                        Nivel de riesgo: <span className="font-bold text-red-600">CRÍTICO</span> — Término de 4 horas activado para medida provisional.
                    </p>
                    <div className="flex gap-3 justify-center pt-4">
                        <Button onClick={onClose} variant="outline">Volver a Recepción</Button>
                        <Button
                            onClick={() => window.location.href = `/dashboard/casos/${success.radicado}`}
                            className="bg-emerald-600 hover:bg-emerald-700"
                        >
                            Ver Expediente
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full border-2 border-red-300 shadow-xl animate-in slide-in-from-top-4 duration-500">
            {/* Emergency Header */}
            <CardHeader className="bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-t-lg">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Siren className="h-6 w-6 text-white animate-pulse" />
                    </div>
                    <div>
                        <CardTitle className="text-white text-lg">🚨 Atención en Crisis</CardTitle>
                        <p className="text-red-100 text-sm mt-0.5">
                            Primeros Auxilios Psicológicos — Solo datos esenciales
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-5 pt-6">
                {/* Alert Banner */}
                <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-800">
                        <p className="font-semibold">Priorizar la estabilización emocional</p>
                        <p className="text-amber-700 mt-0.5">
                            Registre solo la información vital. Los datos completos se podrán ingresar después.
                            El sistema generará un radicado de emergencia con nivel de riesgo CRÍTICO.
                        </p>
                    </div>
                </div>

                {/* Quick Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <a href="tel:155" className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 hover:bg-blue-100 transition-colors">
                        <Phone className="h-4 w-4" /> Línea 155
                    </a>
                    <a href="tel:141" className="flex items-center gap-2 p-2 bg-purple-50 border border-purple-200 rounded-lg text-sm text-purple-700 hover:bg-purple-100 transition-colors">
                        <HeartPulse className="h-4 w-4" /> ICBF 141
                    </a>
                    <a href="tel:123" className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 hover:bg-red-100 transition-colors">
                        <Siren className="h-4 w-4" /> Emergencias 123
                    </a>
                </div>

                {/* Essential Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-red-700 font-semibold">Nombre de la Persona *</Label>
                        <Input
                            value={formData.nombre_victima}
                            onChange={e => update('nombre_victima', e.target.value)}
                            placeholder="Nombre de la persona en crisis"
                            className="border-red-200 focus:border-red-400 focus:ring-red-300 bg-red-50/30"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Documento (si se puede obtener)</Label>
                        <div className="flex gap-2">
                            <select
                                className="border rounded-md px-2 py-2 text-sm bg-white border-slate-200 w-20"
                                value={formData.tipo_documento}
                                onChange={e => update('tipo_documento', e.target.value)}
                            >
                                <option value="CC">CC</option>
                                <option value="TI">TI</option>
                                <option value="CE">CE</option>
                                <option value="PPT">PPT</option>
                            </select>
                            <Input
                                value={formData.documento_victima}
                                onChange={e => update('documento_victima', e.target.value)}
                                placeholder="Número"
                                className="flex-1"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-red-700 font-semibold">Tipo de Violencia *</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {[
                            { value: 'FISICA', label: 'Física', emoji: '🤕' },
                            { value: 'PSICOLOGICA', label: 'Psicológica', emoji: '😰' },
                            { value: 'SEXUAL', label: 'Sexual', emoji: '⚠️' },
                            { value: 'ECONOMICA', label: 'Económica', emoji: '💰' },
                            { value: 'PATRIMONIAL', label: 'Patrimonial', emoji: '🏠' },
                        ].map(opt => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => update('tipologia', opt.value)}
                                className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all duration-200 ${formData.tipologia === opt.value
                                    ? 'bg-red-600 text-white border-red-600 shadow-md scale-105'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-red-300 hover:bg-red-50'
                                    }`}
                            >
                                <span className="block text-base mb-0.5">{opt.emoji}</span>
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-red-700 font-semibold">¿Qué está pasando? *</Label>
                    <Textarea
                        value={formData.descripcion_breve}
                        onChange={e => update('descripcion_breve', e.target.value)}
                        placeholder="Describa brevemente la situación de crisis..."
                        className="min-h-[100px] border-red-200 focus:border-red-400 bg-red-50/30"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Acciones Inmediatas Tomadas</Label>
                    <Textarea
                        value={formData.acciones_inmediatas}
                        onChange={e => update('acciones_inmediatas', e.target.value)}
                        placeholder="Contención emocional, contacto con familiar, llamada a línea de emergencia..."
                        className="min-h-[80px]"
                    />
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <input
                        type="checkbox"
                        id="requiere_traslado"
                        checked={formData.requiere_traslado}
                        onChange={e => update('requiere_traslado', e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-slate-300"
                    />
                    <div className="flex-1">
                        <Label htmlFor="requiere_traslado" className="font-medium cursor-pointer">
                            Requiere traslado a otra entidad
                        </Label>
                        {formData.requiere_traslado && (
                            <Input
                                value={formData.entidad_traslado}
                                onChange={e => update('entidad_traslado', e.target.value)}
                                placeholder="Hospital, ICBF, Fiscalía, Casa de Refugio..."
                                className="mt-2"
                            />
                        )}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex justify-between bg-red-50/50 px-6 py-4 rounded-b-lg">
                <Button variant="outline" onClick={onClose} className="border-red-200 text-red-600 hover:bg-red-50">
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Registrando...
                        </>
                    ) : (
                        <>
                            <Siren className="h-4 w-4" /> Registrar Caso de Emergencia
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}
