
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
            <Card className="w-full border-none shadow-2xl bg-white overflow-hidden">
                <CardContent className="pt-10 pb-8 text-center space-y-6">
                    <div className="mx-auto w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 shadow-inner">
                        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">¡Emergencia Atendida!</h3>
                        <p className="text-slate-500 mt-1 font-medium">El caso ha sido registrado en el sistema con éxito.</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 inline-block shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Radicado de Emergencia</p>
                        <p className="text-3xl font-black font-mono text-emerald-600 tracking-tight">{success.radicado}</p>
                    </div>
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-4 my-2 shadow-sm">
                        <p className="text-sm text-red-700 font-bold flex items-center justify-center gap-2">
                            <Siren className="h-5 w-5 animate-pulse" />
                            ¡Alerta de Equipo Activada!
                        </p>
                        <p className="text-xs text-red-600 mt-1 font-medium">
                            Psicología y Trabajo Social han sido notificados para intervención inmediata.
                        </p>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">
                        Nivel de riesgo: <span className="font-black text-red-600">CRÍTICO</span> — Término de 4 horas activado para medidas.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                        <Button onClick={onClose} variant="ghost" className="text-slate-500 font-bold px-8 py-6">Volver a Recepción</Button>
                        <Button
                            onClick={() => window.location.href = `/dashboard/casos/${success.radicado}`}
                            className="bg-blue-900 hover:bg-slate-800 text-white font-bold px-8 py-6 rounded-xl shadow-lg"
                        >
                            Ver Expediente Detallado
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full border-none shadow-2xl shadow-red-200/50 animate-in slide-in-from-top-4 duration-500 bg-white overflow-hidden">
            {/* Emergency Header */}
            {/* Emergency Header */}
            <CardHeader className="bg-gradient-to-r from-red-600 to-rose-600 text-white py-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner">
                        <Siren className="h-8 w-8 text-white animate-pulse" />
                    </div>
                    <div>
                        <CardTitle className="text-white text-xl font-black tracking-tight">ATENCIÓN EN CRISIS</CardTitle>
                        <p className="text-red-100 text-xs font-bold uppercase tracking-widest mt-0.5">
                            Primeros Auxilios Psicológicos
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-5 pt-6">
                {/* Alert Banner */}
                <div className="flex items-start gap-4 p-4 bg-amber-50 border border-amber-100 rounded-2xl shadow-sm">
                    <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0" />
                    <div className="text-sm text-amber-900 leading-relaxed">
                        <p className="font-black uppercase text-[10px] tracking-widest mb-1">Intervención Prioritaria</p>
                        <p className="font-medium">
                            Concéntrese en la estabilización emocional. Registre solo información vital ahora; podrá complementar el expediente más tarde.
                        </p>
                    </div>
                </div>

                {/* Quick Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <a href="tel:155" className="flex items-center justify-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700 font-bold hover:bg-blue-100 transition-all shadow-sm">
                        <Phone className="h-4 w-4" /> Línea 155
                    </a>
                    <a href="tel:141" className="flex items-center justify-center gap-2 p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 font-bold hover:bg-slate-50 transition-all shadow-sm">
                        <HeartPulse className="h-4 w-4" /> ICBF 141
                    </a>
                    <a href="tel:123" className="flex items-center justify-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700 font-bold hover:bg-red-100 transition-all shadow-sm">
                        <Siren className="h-4 w-4" /> Emergencias 123
                    </a>
                </div>

                {/* Essential Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-red-700 font-black uppercase text-[10px] tracking-widest">Nombre Completo *</Label>
                        <Input
                            value={formData.nombre_victima}
                            onChange={e => update('nombre_victima', e.target.value)}
                            placeholder="Identidad de la persona"
                            className="bg-red-50/30 border-red-100 focus:ring-4 focus:ring-red-50 text-slate-900 font-bold h-12"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Documento de Identidad</Label>
                        <div className="flex gap-2">
                            <select
                                className="border border-slate-200 rounded-xl px-3 h-12 text-sm bg-white font-bold w-24"
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
                                className="flex-1 h-12 font-bold"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-red-700 font-black uppercase text-[10px] tracking-widest">Tipo de Violencia Detectada *</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {[
                            { value: 'FISICA', label: 'Física', emoji: '🤕' },
                            { value: 'PSICOLOGICA', label: 'Psicología', emoji: '😰' },
                            { value: 'SEXUAL', label: 'Sexual', emoji: '🚨' },
                            { value: 'ECONOMICA', label: 'Economía', emoji: '💰' },
                            { value: 'PATRIMONIAL', label: 'Bienes', emoji: '🏠' },
                        ].map(opt => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => update('tipologia', opt.value)}
                                className={`py-4 px-2 rounded-2xl border text-xs font-black uppercase tracking-tighter transition-all duration-300 shadow-sm ${formData.tipologia === opt.value
                                    ? 'bg-red-600 text-white border-red-600 shadow-xl shadow-red-200 -translate-y-1'
                                    : 'bg-white text-slate-500 border-slate-100 hover:border-red-200 hover:bg-red-50'
                                    }`}
                            >
                                <span className="block text-2xl mb-1">{opt.emoji}</span>
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-red-700 font-black uppercase text-[10px] tracking-widest">Descripción Situacional *</Label>
                    <Textarea
                        value={formData.descripcion_breve}
                        onChange={e => update('descripcion_breve', e.target.value)}
                        placeholder="Relato rápido de los hechos..."
                        className="min-h-[120px] bg-red-50/30 border-red-100 focus:ring-4 focus:ring-red-50 text-slate-900 font-medium text-base rounded-2xl p-4 shadow-sm"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Primeros Auxilios Aplicados</Label>
                    <Textarea
                        value={formData.acciones_inmediatas}
                        onChange={e => update('acciones_inmediatas', e.target.value)}
                        placeholder="Acciones de contención realizadas..."
                        className="min-h-[100px] bg-white border-slate-200 focus:ring-4 focus:ring-blue-50 text-slate-800 rounded-2xl p-4 shadow-sm"
                    />
                </div>

                <div className="flex items-start gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl shadow-inner">
                    <input
                        type="checkbox"
                        id="requiere_traslado"
                        checked={formData.requiere_traslado}
                        onChange={e => update('requiere_traslado', e.target.checked)}
                        className="mt-1 h-5 w-5 rounded-lg border-slate-300 text-red-600 focus:ring-red-500"
                    />
                    <div className="flex-1">
                        <Label htmlFor="requiere_traslado" className="font-bold text-slate-700 cursor-pointer text-base">
                            Requiere traslado urgente a otra entidad
                        </Label>
                        {formData.requiere_traslado && (
                            <Input
                                value={formData.entidad_traslado}
                                onChange={e => update('entidad_traslado', e.target.value)}
                                placeholder="Especifique: Hospital, ICBF, Fiscalía..."
                                className="mt-3 bg-white h-11 border-slate-200"
                            />
                        )}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex justify-between bg-slate-50/80 px-8 py-6 border-t border-slate-100">
                <Button variant="ghost" onClick={onClose} className="text-slate-500 font-bold px-8 h-12 hover:bg-slate-100">
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 shadow-xl shadow-red-200 text-white font-bold h-12 px-8 rounded-xl gap-3 transition-all active:scale-95"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" /> Registrando...
                        </>
                    ) : (
                        <>
                            <Siren className="h-5 w-5" /> Registrar Caso de Emergencia
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}
