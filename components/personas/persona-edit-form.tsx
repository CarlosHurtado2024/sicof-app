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
    }
}

export default function PersonaEditForm({ persona }: PersonaEditFormProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const router = useRouter()

    const [form, setForm] = useState({
        nombres: persona.nombres || '',
        documento: persona.documento || '',
        telefono: persona.telefono || '',
        email: persona.email || '',
        direccion_residencia: persona.direccion_residencia || '',
        zona: persona.zona || '',
        nivel_educativo: persona.nivel_educativo || '',
        grupo_etnico: persona.grupo_etnico || '',
        discapacidad: persona.discapacidad || false,
        fecha_nacimiento: persona.fecha_nacimiento || '',
        genero: persona.genero || '',
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
            <div className="fixed inset-x-4 top-[5%] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-xl z-50 max-h-[90vh] overflow-y-auto bg-white/[0.03] rounded-[2rem] shadow-2xl animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-white/10 px-8 py-6 flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Editar Perfil</h2>
                        <p className="text-xs font-bold text-white/40 uppercase tracking-widest mt-1">Actualice la información básica</p>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl text-white/40 hover:text-slate-900 hover:bg-slate-100 transition-all">
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
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Zona de Ubicación</label>
                            <select
                                value={form.zona}
                                onChange={(e) => handleChange('zona', e.target.value)}
                                className="w-full px-4 py-3 text-sm bg-white/5 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-700"
                            >
                                <option value="">Sin especificar</option>
                                <option value="URBANA">Urbana</option>
                                <option value="RURAL">Rural</option>
                            </select>
                        </div>
                        <FormField label="Identidad de Género" value={form.genero} onChange={(v) => handleChange('genero', v)} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Fecha de Nacimiento" value={form.fecha_nacimiento} onChange={(v) => handleChange('fecha_nacimiento', v)} type="date" />
                        <FormField label="Nivel Educativo" value={form.nivel_educativo} onChange={(v) => handleChange('nivel_educativo', v)} />
                    </div>

                    <FormField label="Grupo Étnico / Otros" value={form.grupo_etnico} onChange={(v) => handleChange('grupo_etnico', v)} />

                    <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl transition-all hover:bg-slate-100 cursor-pointer">
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
                        <div className="p-3 bg-red-500/100/10 border border-red-500/20 text-red-300 text-sm rounded-lg border border-red-200">{error}</div>
                    )}
                    {success && (
                        <div className="p-3 bg-emerald-500/100/10 border border-emerald-500/20 text-emerald-300 text-sm rounded-lg border border-emerald-200">✅ Datos actualizados correctamente</div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white/5/80 backdrop-blur-xl border-t border-white/10 px-8 py-6 flex items-center justify-end gap-4 rounded-b-2xl">
                    <Button variant="ghost" onClick={() => setIsOpen(false)} className="rounded-2xl px-6 font-bold text-slate-500 hover:bg-slate-200">
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
            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-white/5 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-700 placeholder:text-slate-300"
            />
        </div>
    )
}
