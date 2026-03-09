'use client'

import { useState, useTransition } from 'react'
import { Pencil, X, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { editarPersona } from '@/lib/actions/personas'
import { useRouter } from 'next/navigation'

interface PersonaEditFormProps {
    persona: {
        id: string
        nombres: string
        documento: string
        telefono?: string | null
        email?: string | null
        direccion_residencia?: string | null
        zona?: string | null
        nivel_educativo?: string | null
        grupo_etnico?: string | null
        discapacidad?: boolean | null
        fecha_nacimiento?: string | null
        genero?: string | null
        datos_demograficos?: any
        tipo?: string
    }
}

export default function PersonaEditForm({ persona }: PersonaEditFormProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const router = useRouter()

    const demo = (typeof persona.datos_demograficos === 'object' && persona.datos_demograficos) || {}

    const [form, setForm] = useState({
        nombres: persona.nombres || '',
        documento: persona.documento || '',
        telefono: persona.telefono || '',
        email: persona.email || '',
        direccion_residencia: persona.direccion_residencia || '',
        barrio: demo.barrio || '',
        zona: persona.zona || '',
        nivel_educativo: persona.nivel_educativo || '',
        grupo_etnico: persona.grupo_etnico || '',
        discapacidad: persona.discapacidad || false,
        fecha_nacimiento: persona.fecha_nacimiento || '',
        genero: persona.genero || '',
        identidad_genero: demo.identidad_genero || '',
        estado_civil: demo.estado_civil || '',
        eps: demo.regimen_salud || '',
        parentesco_victima: demo.parentesco_victima || '',
    })

    function handleChange(field: string, value: string | boolean) {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    function handleSubmit() {
        setError(null)
        setSuccess(false)
        startTransition(async () => {
            try {
                await editarPersona(persona.id, form)
                setSuccess(true)
                setTimeout(() => {
                    setIsOpen(false)
                    setSuccess(false)
                    router.refresh()
                }, 1000)
            } catch (err: any) {
                setError(err.message || 'Error al guardar')
            }
        })
    }

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                variant="outline"
                className="gap-2 rounded-2xl border-slate-200 text-blue-400 hover:bg-blue-500/15 hover:border-blue-200 transition-all font-bold uppercase tracking-widest text-xs px-6"
            >
                <Pencil size={12} />
                Editar Perfil
            </Button>
        )
    }

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md transition-all duration-300" onClick={() => setIsOpen(false)} />

            {/* Modal */}
            <div className="fixed inset-x-4 top-[5%] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-xl z-50 max-h-[90vh] overflow-y-auto bg-white rounded-[2rem] shadow-2xl animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-8 py-6 flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Editar Perfil</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Actualice la información básica</p>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Form */}
                <div className="px-8 py-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Nombres completos" value={form.nombres} onChange={(v) => handleChange('nombres', v)} />
                        <FormField label="Documento de Identidad" value={form.documento} onChange={(v) => handleChange('documento', v)} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Teléfono / Celular" value={form.telefono} onChange={(v) => handleChange('telefono', v)} />
                        <FormField label="Correo Electrónico" value={form.email} onChange={(v) => handleChange('email', v)} type="email" />
                    </div>

                    <FormField label="Dirección de Residencia" value={form.direccion_residencia} onChange={(v) => handleChange('direccion_residencia', v)} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Zona de Ubicación</label>
                            <select
                                value={form.zona}
                                onChange={(e) => handleChange('zona', e.target.value)}
                                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-700"
                            >
                                <option value="">Sin especificar</option>
                                <option value="URBANA">Urbana</option>
                                <option value="RURAL">Rural</option>
                            </select>
                        </div>
                        <FormField label="Identidad de Género" value={form.identidad_genero} onChange={(v) => handleChange('identidad_genero', v)} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Estado Civil</label>
                            <select
                                value={form.estado_civil}
                                onChange={(e) => handleChange('estado_civil', e.target.value)}
                                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-700"
                            >
                                <option value="">Seleccione...</option>
                                <option value="SOLTERO">Soltero(a)</option>
                                <option value="CASADO">Casado(a)</option>
                                <option value="UNION_LIBRE">Unión Libre</option>
                                <option value="DIVORCIADO">Divorciado(a)</option>
                                <option value="VIUDO">Viudo(a)</option>
                                <option value="SEPARADO">Separado(a)</option>
                            </select>
                        </div>
                        <FormField label="EPS / Régimen de Salud" value={form.eps} onChange={(v) => handleChange('eps', v)} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Barrio / Vereda" value={form.barrio} onChange={(v) => handleChange('barrio', v)} />
                        <FormField label="Fecha de Nacimiento" value={form.fecha_nacimiento} onChange={(v) => handleChange('fecha_nacimiento', v)} type="date" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nivel Educativo</label>
                            <select
                                value={form.nivel_educativo}
                                onChange={(e) => handleChange('nivel_educativo', e.target.value)}
                                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-700"
                            >
                                <option value="">Seleccione...</option>
                                <option value="NINGUNO">Ninguno</option>
                                <option value="PRIMARIA">Primaria</option>
                                <option value="SECUNDARIA">Secundaria</option>
                                <option value="TECNICO">Técnico/Tecnólogo</option>
                                <option value="PROFESIONAL">Profesional</option>
                                <option value="POSTGRADO">Postgrado</option>
                            </select>
                        </div>
                        {persona.tipo === 'AGRESOR' && (
                            <FormField label="Parentesco con la víctima" value={form.parentesco_victima} onChange={(v) => handleChange('parentesco_victima', v)} />
                        )}
                    </div>

                    <FormField label="Grupo Étnico / Otros" value={form.grupo_etnico} onChange={(v) => handleChange('grupo_etnico', v)} />

                    <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl transition-all hover:bg-slate-100 cursor-pointer">
                        <div className="relative flex items-center justify-center">
                            <input
                                type="checkbox"
                                id="discapacidad"
                                checked={form.discapacidad}
                                onChange={(e) => handleChange('discapacidad', e.target.checked)}
                                className="w-6 h-6 rounded-lg border-slate-300 text-blue-400 focus:ring-blue-500 transition-all cursor-pointer"
                            />
                        </div>
                        <label htmlFor="discapacidad" className="text-sm font-bold text-slate-600 cursor-pointer select-none">Persona con discapacidad o capacidades reducidas</label>
                    </div>

                    {/* Error/Success */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">{error}</div>
                    )}
                    {success && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm rounded-xl">✅ Datos actualizados correctamente</div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 px-8 py-6 flex items-center justify-end gap-4 rounded-b-2xl z-10">
                    <Button variant="ghost" onClick={() => setIsOpen(false)} className="rounded-2xl px-6 font-bold text-slate-500 hover:bg-slate-100">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="bg-blue-600 hover:bg-blue-700 text-white gap-3 px-8 py-6 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                    >
                        {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                        {isPending ? 'Procesando...' : 'Guardar Cambios'}
                    </Button>
                </div>
            </div>
        </>
    )
}

function FormField({ label, value, onChange, type = 'text' }: {
    label: string; value: string; onChange: (v: string) => void; type?: string
}) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-700 placeholder:text-slate-300"
            />
        </div>
    )
}
