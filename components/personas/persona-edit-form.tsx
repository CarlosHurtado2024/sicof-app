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
                className="gap-2 rounded-xl border-white/10 text-purple-300 hover:bg-white/10 hover:text-white"
            >
                <Pencil size={14} />
                Editar Datos
            </Button>
        )
    }

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

            {/* Modal */}
            <div className="fixed inset-x-4 top-[5%] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-lg z-50 max-h-[90vh] overflow-y-auto bg-white/[0.02] backdrop-blur-xl rounded-2xl shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-white/[0.02] backdrop-blur-xl border-b border-white/10 px-5 py-4 flex items-center justify-between rounded-t-2xl z-10">
                    <h2 className="text-lg font-bold text-white/90">Editar Persona</h2>
                    <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <div className="px-5 py-4 space-y-4">
                    <FormField label="Nombres completos" value={form.nombres} onChange={(v) => handleChange('nombres', v)} />
                    <FormField label="Documento" value={form.documento} onChange={(v) => handleChange('documento', v)} />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Teléfono" value={form.telefono} onChange={(v) => handleChange('telefono', v)} />
                        <FormField label="Email" value={form.email} onChange={(v) => handleChange('email', v)} type="email" />
                    </div>

                    <FormField label="Dirección" value={form.direccion_residencia} onChange={(v) => handleChange('direccion_residencia', v)} />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-1 block">Zona</label>
                            <select
                                value={form.zona}
                                onChange={(e) => handleChange('zona', e.target.value)}
                                className="w-full px-3 py-2.5 text-sm bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white/90 [&>option]:bg-[#050505] [&>option]:text-white"
                            >
                                <option value="">Sin especificar</option>
                                <option value="URBANA">Urbana</option>
                                <option value="RURAL">Rural</option>
                            </select>
                        </div>
                        <FormField label="Género" value={form.genero} onChange={(v) => handleChange('genero', v)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Fecha de Nacimiento" value={form.fecha_nacimiento} onChange={(v) => handleChange('fecha_nacimiento', v)} type="date" />
                        <FormField label="Nivel Educativo" value={form.nivel_educativo} onChange={(v) => handleChange('nivel_educativo', v)} />
                    </div>

                    <FormField label="Grupo Étnico" value={form.grupo_etnico} onChange={(v) => handleChange('grupo_etnico', v)} />

                    <div className="flex items-center gap-3 py-1">
                        <input
                            type="checkbox"
                            id="discapacidad"
                            checked={form.discapacidad}
                            onChange={(e) => handleChange('discapacidad', e.target.checked)}
                            className="w-4 h-4 rounded border-white/10 text-purple-600 focus:ring-purple-500 bg-white/5"
                        />
                        <label htmlFor="discapacidad" className="text-sm text-white/80">Persona con discapacidad</label>
                    </div>

                    {/* Error/Success */}
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-lg border border-red-200">{error}</div>
                    )}
                    {success && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm rounded-lg border border-emerald-200">✅ Datos actualizados correctamente</div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white/[0.02] backdrop-blur-xl border-t border-white/10 px-5 py-4 flex items-center justify-end gap-3 rounded-b-2xl">
                    <Button variant="outline" onClick={() => setIsOpen(false)} className="rounded-xl">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="bg-purple-600 border border-purple-500/50 hover:bg-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.3)] gap-2 rounded-xl font-semibold shadow-[#4C1D95]/15"
                    >
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {isPending ? 'Guardando...' : 'Guardar Cambios'}
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
        <div>
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-1 block">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-white/90"
            />
        </div>
    )
}
