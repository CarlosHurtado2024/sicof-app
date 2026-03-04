
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
            <Card className="w-full border-gray-100 shadow-sm bg-white overflow-hidden rounded-xl animate-in zoom-in-95 duration-300">
                <CardContent className="pt-12 pb-10 text-center space-y-8">
                    <div className="mx-auto w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100">
                        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900 tracking-tight font-display">Emergencia Registrada</h3>
                        <p className="text-gray-500 mt-2 font-medium">El protocolo de atención prioritaria ha sido activado correctamente.</p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-8 border border-gray-100 inline-block">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Folio de Emergencia</p>
                        <p className="text-4xl font-black font-mono text-emerald-600 tracking-tight">{success.radicado}</p>
                    </div>

                    <div className="bg-red-50 border border-red-100 rounded-xl p-5 max-w-md mx-auto">
                        <div className="flex items-center justify-center gap-3 text-red-700 font-bold mb-1">
                            <Siren className="h-5 w-5 animate-pulse" />
                            <span>NOTIFICACIÓN ENVIADA</span>
                        </div>
                        <p className="text-xs text-red-600 font-medium leading-relaxed">
                            Los equipos de Psicología y Trabajo Social han recibido una alerta en tiempo real para intervención inmediata.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                        <Button onClick={onClose} variant="ghost" className="text-gray-500 font-bold px-8 h-12 hover:bg-gray-50 rounded-lg">
                            Regresar
                        </Button>
                        <Button
                            onClick={() => window.location.href = `/dashboard/casos/${success.radicado}`}
                            className="bg-gray-900 hover:bg-black text-white font-bold px-8 h-12 rounded-lg shadow-sm"
                        >
                            Ver Expediente Prioritario
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full border-red-100 shadow-xl shadow-red-500/5 animate-in slide-in-from-top-4 duration-500 bg-white overflow-hidden rounded-xl">
            {/* Emergency Header */}
            <CardHeader className="bg-red-600 text-white py-8 px-8">
                <div className="flex items-center gap-5">
                    <div className="p-3.5 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                        <Siren className="h-8 w-8 text-white animate-pulse" />
                    </div>
                    <div>
                        <CardTitle className="text-white text-2xl font-bold tracking-tight font-display">ATENCIÓN EN CRISIS</CardTitle>
                        <p className="text-red-100 text-[10px] font-black uppercase tracking-[0.25em] mt-1">
                            Activación Protocolo Ley 1257
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-8 pt-8 px-8">
                {/* Alert Banner */}
                <div className="flex items-start gap-4 p-5 bg-amber-50 border border-amber-100 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-900 leading-relaxed">
                        <p className="font-bold uppercase text-[10px] tracking-widest mb-1">Prioridad de Estabilización</p>
                        <p className="font-medium opacity-80 text-xs">
                            Concéntrese en mitigar el daño inmediato y recolectar datos vitales de contacto. El registro administrativo se completará en la fase de triaje.
                        </p>
                    </div>
                </div>

                {/* Quick Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <a href="tel:155" className="flex items-center justify-center gap-2 p-4 bg-gray-50 border border-gray-100 rounded-lg text-xs text-gray-700 font-bold hover:bg-gray-100 transition-all shadow-sm">
                        <Phone className="h-4 w-4 text-blue-600" /> Línea 155
                    </a>
                    <a href="tel:141" className="flex items-center justify-center gap-2 p-4 bg-gray-50 border border-gray-100 rounded-lg text-xs text-gray-700 font-bold hover:bg-gray-100 transition-all shadow-sm">
                        <HeartPulse className="h-4 w-4 text-emerald-600" /> ICBF 141
                    </a>
                    <a href="tel:123" className="flex items-center justify-center gap-2 p-4 bg-red-50 border border-red-100 rounded-lg text-xs text-red-700 font-bold hover:bg-red-100 transition-all shadow-sm">
                        <Siren className="h-4 w-4 animate-pulse" /> Urgencias 123
                    </a>
                </div>

                {/* Essential Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <Label className="text-red-700 font-black uppercase text-[10px] tracking-widest">Nombre del Ciudadano *</Label>
                        <Input
                            value={formData.nombre_victima}
                            onChange={e => update('nombre_victima', e.target.value)}
                            placeholder="Nombre completo..."
                            className="bg-red-50/20 border-red-100 focus:ring-4 focus:ring-red-50 text-gray-900 font-bold h-12 rounded-lg"
                        />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Identificación</Label>
                        <div className="flex gap-3">
                            <select
                                className="border border-gray-100 rounded-lg px-3 h-12 text-sm bg-gray-50 font-bold w-24 outline-none focus:ring-2 focus:ring-[#F28C73]/10"
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
                                placeholder="Número..."
                                className="flex-1 h-12 font-bold bg-white border-gray-100 rounded-lg"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <Label className="text-red-700 font-black uppercase text-[10px] tracking-widest">Tipicidad Prima Facie *</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {[
                            { value: 'FISICA', label: 'Física', emoji: '🤕' },
                            { value: 'PSICOLOGICA', label: 'Psicología', emoji: '😰' },
                            { value: 'SEXUAL', label: 'Sexual', emoji: '🚨' },
                            { value: 'ECONOMICA', label: 'Económica', emoji: '💰' },
                            { value: 'PATRIMONIAL', label: 'Bienes', emoji: '🏠' },
                        ].map(opt => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => update('tipologia', opt.value)}
                                className={`py-5 px-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${formData.tipologia === opt.value
                                    ? 'bg-red-600 text-white border-red-600 shadow-md ring-4 ring-red-50'
                                    : 'bg-white text-gray-400 border-gray-100 hover:border-red-200 hover:bg-gray-50'
                                    }`}
                            >
                                <span className="block text-2xl mb-2">{opt.emoji}</span>
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <Label className="text-red-700 font-black uppercase text-[10px] tracking-widest">Relato Sintético *</Label>
                        <Textarea
                            value={formData.descripcion_breve}
                            onChange={e => update('descripcion_breve', e.target.value)}
                            placeholder="Describa los hechos clave..."
                            className="min-h-[140px] bg-red-50/20 border-red-100 focus:ring-4 focus:ring-red-50 text-gray-900 font-medium text-sm rounded-lg p-5 transition-all"
                        />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Intervención de Contención</Label>
                        <Textarea
                            value={formData.acciones_inmediatas}
                            onChange={e => update('acciones_inmediatas', e.target.value)}
                            placeholder="Acciones psicosociales realizadas..."
                            className="min-h-[140px] bg-gray-50/30 border-gray-100 focus:ring-4 focus:ring-[#F28C73]/5 text-gray-600 text-sm rounded-lg p-5 transition-all"
                        />
                    </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl border border-gray-100">
                    <input
                        type="checkbox"
                        id="requiere_traslado"
                        checked={formData.requiere_traslado}
                        onChange={e => update('requiere_traslado', e.target.checked)}
                        className="mt-1 h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                    />
                    <div className="flex-1">
                        <Label htmlFor="requiere_traslado" className="font-bold text-gray-900 cursor-pointer text-sm">
                            Activación de Ruta Intersectorial (Traslado Externo)
                        </Label>
                        {formData.requiere_traslado && (
                            <Input
                                value={formData.entidad_traslado}
                                onChange={e => update('entidad_traslado', e.target.value)}
                                placeholder="Entidad: Hospital, Clínica, Fiscalía, ICBF..."
                                className="mt-4 bg-white h-11 border-gray-100 rounded-lg text-sm"
                            />
                        )}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex justify-between bg-gray-50/50 px-8 py-6 border-t border-gray-100">
                <Button variant="ghost" onClick={onClose} className="text-gray-400 font-bold px-8 h-12 hover:bg-white rounded-lg">
                    Cerrar
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold h-12 px-10 rounded-lg gap-3 transition-all active:scale-95 shadow-lg shadow-red-200"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" /> Procesando...
                        </>
                    ) : (
                        <>
                            <Siren className="h-5 w-5" /> Registrar Emergencia
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}
