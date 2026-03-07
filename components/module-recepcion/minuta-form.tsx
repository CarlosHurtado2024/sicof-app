
'use client'

import { useRef, useState, useCallback } from 'react'
import { crearMinuta } from '@/lib/actions/minutas'
import { buscarPersonaPorDocumento } from '@/lib/actions/crisis'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, UserCheck, AlertTriangle, Clock, FileText, Loader2, CheckCircle2, User } from 'lucide-react'

interface PersonaEncontrada {
    persona: any;
    expedientes: any[];
    totalRegistros: number;
}

export function MinutaForm() {
    const formRef = useRef<HTMLFormElement>(null)
    const [buscando, setBuscando] = useState(false)
    const [documentoBusqueda, setDocumentoBusqueda] = useState('')
    const [resultado, setResultado] = useState<PersonaEncontrada | null>(null)
    const [buscado, setBuscado] = useState(false)
    const [guardando, setGuardando] = useState(false)
    const [exito, setExito] = useState(false)
    const debounceRef = useRef<NodeJS.Timeout | null>(null)

    const buscarPersona = useCallback(async (doc: string) => {
        if (doc.length < 4) {
            setResultado(null)
            setBuscado(false)
            return
        }

        setBuscando(true)
        try {
            const res = await buscarPersonaPorDocumento(doc)
            setResultado(res as PersonaEncontrada)
            setBuscado(true)
        } catch {
            setResultado(null)
        } finally {
            setBuscando(false)
        }
    }, [])

    const handleDocumentoChange = (value: string) => {
        setDocumentoBusqueda(value)
        setExito(false)
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => buscarPersona(value), 500)
    }

    async function clientAction(formData: FormData) {
        setGuardando(true)
        const result = await crearMinuta(formData)

        if (result?.error) {
            alert(`Error: ${result.error}`)
            setGuardando(false)
        } else {
            setExito(true)
            setGuardando(false)
            setTimeout(() => {
                formRef.current?.reset()
                setDocumentoBusqueda('')
                setResultado(null)
                setBuscado(false)
                setExito(false)
            }, 3000)
        }
    }

    return (
        <Card className="w-full border-white/[0.08] bg-white/[0.03] shadow-sm overflow-hidden rounded-xl">
            {/* Header */}
            <CardHeader className="bg-white/[0.02] border-b border-white/[0.08] pb-5">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#ff7a59]/10 rounded-xl">
                        <FileText className="h-6 w-6 text-[#ff7a59]" />
                    </div>
                    <div>
                        <CardTitle className="text-white text-xl font-bold font-display">Minuta de Ingreso</CardTitle>
                        <CardDescription className="text-white/40 font-medium">
                            Control de recepción y primer contacto con el ciudadano
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <form ref={formRef} action={clientAction}>
                <CardContent className="space-y-4 pt-5">

                    {/* Success Banner */}
                    {exito && (
                        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg animate-in slide-in-from-top-2 duration-300">
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                            <p className="text-sm font-bold text-emerald-300">✓ Registro completado correctamente</p>
                        </div>
                    )}

                    {/* Search by Document */}
                    <div className="space-y-3">
                        <Label className="flex items-center gap-2 text-[10px] font-black text-white/35 uppercase tracking-widest">
                            <Search className="h-3 w-3" />
                            Verificar Antecedentes
                        </Label>
                        <div className="relative group">
                            <Input
                                value={documentoBusqueda}
                                onChange={e => handleDocumentoChange(e.target.value)}
                                placeholder="Cédula del ciudadano..."
                                className="h-12 pr-10 bg-white/[0.05] border-white/[0.08] focus:ring-4 focus:ring-[#ff7a59]/5 focus:border-[#ff7a59]/20 text-white rounded-lg transition-all"
                            />
                            {buscando && (
                                <Loader2 className="absolute right-3 top-4 h-4 w-4 text-[#ff7a59] animate-spin" />
                            )}
                        </div>
                    </div>

                    {/* Search Result: Person Found */}
                    {buscado && resultado?.persona && (
                        <div className="rounded-xl border border-white/[0.08] overflow-hidden animate-in slide-in-from-top-2 duration-300 shadow-sm">
                            <div className="flex items-center gap-4 p-4 bg-white/[0.04]">
                                <div className="p-2.5 bg-white/[0.03] border border-white/[0.08] rounded-lg text-[#ff7a59]">
                                    <UserCheck className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-base font-bold text-white leading-tight">{resultado.persona.nombres}</p>
                                    <p className="text-xs text-white/40 font-medium mt-0.5">Identificación Verificada: {resultado.persona.documento}</p>
                                </div>
                            </div>

                            {resultado.expedientes.length > 0 && (
                                <div className="p-5 bg-red-500/10 border-t border-red-500/20">
                                    <div className="flex items-center gap-2 mb-4">
                                        <AlertTriangle className="h-4 w-4 text-red-400" />
                                        <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">
                                            Alerta Crítica: Reincidencia Detectada ({resultado.expedientes.length})
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        {resultado.expedientes.slice(0, 3).map((exp: any, i: number) => (
                                            <div key={i} className="flex items-center justify-between text-[11px] bg-white/[0.04] p-3 rounded-lg border border-red-500/20 shadow-sm">
                                                <span className="font-mono font-black text-red-400">{exp.radicado}</span>
                                                <span className={`px-2 py-0.5 rounded-md font-bold text-[9px] uppercase tracking-tighter ${exp.estado === 'TRAMITE' ? 'bg-amber-500/15 text-amber-400' :
                                                    exp.estado === 'CERRADO' ? 'bg-white/[0.06] text-white/40' :
                                                        'bg-blue-500/15 text-blue-400'
                                                    }`}>
                                                    {exp.estado}
                                                </span>
                                                <span className="text-white/45 font-bold truncate max-w-[120px]">{exp.tipologia_violencia}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Search Result: Not Found */}
                    {buscado && !resultado?.persona && documentoBusqueda.length >= 4 && (
                        <div className="flex items-center gap-3 p-4 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white/45 font-medium animate-in slide-in-from-top-2 duration-300">
                            <User className="h-4 w-4 text-[#ff7a59]" />
                            Usuario no registrado previamente. Documentación requerida para radicación.
                        </div>
                    )}

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="nombre_visitante" className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                Nombre del Ciudadano *
                            </Label>
                            <Input
                                id="nombre_visitante"
                                name="nombre_visitante"
                                required
                                defaultValue={resultado?.persona?.nombres || ''}
                                key={resultado?.persona?.nombres || 'empty'}
                                placeholder="Nombre completo..."
                                className="h-11 bg-white/[0.05] border-white/[0.08] focus:ring-4 focus:ring-[#ff7a59]/5 focus:border-[#ff7a59]/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="documento_visitante" className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                Identificación
                            </Label>
                            <Input
                                id="documento_visitante"
                                name="documento_visitante"
                                value={documentoBusqueda}
                                onChange={e => handleDocumentoChange(e.target.value)}
                                placeholder="Cédula..."
                                className="h-11 bg-white/[0.05] border-white/[0.08] focus:ring-4 focus:ring-[#ff7a59]/5 focus:border-[#ff7a59]/20"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="telefono_contacto" className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                Teléfono de Contacto
                            </Label>
                            <Input
                                id="telefono_contacto"
                                name="telefono_contacto"
                                placeholder="Celular..."
                                className="h-11 bg-white/[0.05] border-white/[0.08] focus:ring-4 focus:ring-[#ff7a59]/5 focus:border-[#ff7a59]/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="motivo_visita" className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                Motivo de Ingreso *
                            </Label>
                            <select
                                id="motivo_visita"
                                name="motivo_visita"
                                required
                                defaultValue=""
                                className="flex h-11 w-full items-center rounded-lg border border-white/[0.08] bg-white/[0.05] text-white px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-[#ff7a59]/5 focus:border-[#ff7a59]/20 transition-all font-bold shadow-sm cursor-pointer"
                            >
                                <option value="" disabled className="text-white/40 font-medium">Seleccione trámite...</option>
                                <option value="ORIENTACION" className="text-white font-bold">📋 Orientación General</option>
                                <option value="DENUNCIA" className="text-white font-bold">🚨 Recepción de Denuncia</option>
                                <option value="SEGUIMIENTO" className="text-white font-bold">🔄 Seguimiento de Caso</option>
                                <option value="AUDIENCIA" className="text-white font-bold">⚖️ Citación a Audiencia</option>
                                <option value="OTRO" className="text-white font-bold">📌 Otro Trámite</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="observaciones" className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Detalles de la Recepción
                        </Label>
                        <Textarea
                            id="observaciones"
                            name="observaciones"
                            placeholder="Notas o requerimientos especiales..."
                            className="resize-none min-h-[120px] bg-white/[0.05] border-white/[0.08] focus:ring-4 focus:ring-[#ff7a59]/5 focus:border-[#ff7a59]/20 rounded-lg"
                        />
                    </div>
                </CardContent>

                <CardFooter className="flex justify-between bg-white/[0.02] px-8 py-5 border-t border-white/[0.08]">
                    <Button variant="ghost" type="button" className="text-white/35 font-bold hover:text-white/60 hover:bg-white/[0.06]" onClick={() => {
                        formRef.current?.reset()
                        setDocumentoBusqueda('')
                        setResultado(null)
                        setBuscado(false)
                    }}>
                        Reiniciar
                    </Button>
                    <Button
                        type="submit"
                        disabled={guardando}
                        className="bg-[#ff7a59] hover:bg-[#D96C53] text-white gap-2 px-10 py-5 rounded-lg font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
                    >
                        {guardando ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Procesando...</>
                        ) : (
                            <><Clock className="h-4 w-4" /> Registrar Entrada</>
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card >
    )
}
