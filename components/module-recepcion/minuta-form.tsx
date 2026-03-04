
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
        <Card className="w-full border-slate-200 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
            {/* Header */}
            <CardHeader className="bg-slate-50 border-b border-slate-100 text-slate-800 pb-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                        <CardTitle className="text-slate-900 text-lg font-bold">Minuta de Ingreso</CardTitle>
                        <CardDescription className="text-slate-500 font-medium">
                            Control de vigilancia y recepción
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <form ref={formRef} action={clientAction}>
                <CardContent className="space-y-4 pt-5">

                    {/* Success Banner */}
                    {exito && (
                        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl animate-in slide-in-from-top-2 duration-300 shadow-sm">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                            <p className="text-sm font-bold text-emerald-800">Minuta registrada exitosamente</p>
                        </div>
                    )}

                    {/* Search by Document */}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            <Search className="h-4 w-4 text-blue-600" />
                            Buscar por Documento
                        </Label>
                        <div className="relative">
                            <Input
                                value={documentoBusqueda}
                                onChange={e => handleDocumentoChange(e.target.value)}
                                placeholder="Ingrese cédula o TI para buscar..."
                                className="pr-10 bg-white border-slate-200 focus:ring-4 focus:ring-blue-50 text-slate-900 shadow-sm"
                            />
                            {buscando && (
                                <Loader2 className="absolute right-3 top-3 h-4 w-4 text-blue-600 animate-spin" />
                            )}
                        </div>
                    </div>

                    {/* Search Result: Person Found */}
                    {buscado && resultado?.persona && (
                        <div className="rounded-xl border border-slate-200 overflow-hidden animate-in slide-in-from-top-2 duration-300 shadow-sm">
                            <div className="flex items-center gap-3 p-3 bg-slate-50">
                                <div className="p-2 bg-blue-100 rounded-full">
                                    <UserCheck className="h-4 w-4 text-blue-700" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900">{resultado.persona.nombres}</p>
                                    <p className="text-xs text-slate-500 font-medium">Doc: {resultado.persona.documento}</p>
                                </div>
                            </div>

                            {resultado.expedientes.length > 0 && (
                                <div className="p-4 bg-red-50 border-t border-red-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <AlertTriangle className="h-4 w-4 text-red-600" />
                                        <span className="text-xs font-black text-red-800 uppercase tracking-widest">
                                            Alerta de Reincidencia — {resultado.expedientes.length} expediente(s)
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        {resultado.expedientes.slice(0, 3).map((exp: any, i: number) => (
                                            <div key={i} className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-red-100 shadow-sm">
                                                <span className="font-mono font-bold text-red-700">{exp.radicado}</span>
                                                <span className={`px-2 py-0.5 rounded-full font-bold ${exp.estado === 'TRAMITE' ? 'bg-amber-100 text-amber-700' :
                                                    exp.estado === 'CERRADO' ? 'bg-slate-100 text-slate-600' :
                                                        'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {exp.estado}
                                                </span>
                                                <span className="text-slate-500 font-medium">{exp.tipologia_violencia}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Search Result: Not Found */}
                    {buscado && !resultado?.persona && documentoBusqueda.length >= 4 && (
                        <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800 font-medium animate-in slide-in-from-top-2 duration-300">
                            <User className="h-4 w-4 text-blue-600" />
                            No se encontró persona con ese documento. Se registrará como nuevo visitante.
                        </div>
                    )}

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                        <div className="space-y-2">
                            <Label htmlFor="nombre_visitante" className="text-sm font-bold text-slate-700">
                                Nombre Completo *
                            </Label>
                            <Input
                                id="nombre_visitante"
                                name="nombre_visitante"
                                required
                                defaultValue={resultado?.persona?.nombres || ''}
                                key={resultado?.persona?.nombres || 'empty'}
                                placeholder="Ej: Juan Pérez"
                                className="bg-white border-slate-200 focus:ring-4 focus:ring-blue-50 text-slate-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="documento_visitante" className="text-sm font-bold text-slate-700">
                                Documento
                            </Label>
                            <Input
                                id="documento_visitante"
                                name="documento_visitante"
                                value={documentoBusqueda}
                                onChange={e => handleDocumentoChange(e.target.value)}
                                placeholder="Ej: 12345678"
                                className="bg-white border-slate-200 focus:ring-4 focus:ring-blue-50 text-slate-900"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="telefono_contacto" className="text-sm font-bold text-slate-700">
                                Teléfono
                            </Label>
                            <Input
                                id="telefono_contacto"
                                name="telefono_contacto"
                                placeholder="Ej: 3001234567"
                                className="bg-white border-slate-200 focus:ring-4 focus:ring-blue-50 text-slate-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="motivo_visita" className="text-sm font-bold text-slate-700">
                                Motivo de Visita *
                            </Label>
                            <select
                                id="motivo_visita"
                                name="motivo_visita"
                                required
                                defaultValue=""
                                className="flex h-11 w-full items-center rounded-xl border border-slate-200 bg-white text-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-300 transition-all font-medium shadow-sm"
                            >
                                <option value="" disabled className="text-slate-400">Seleccione...</option>
                                <option value="ORIENTACION" className="text-slate-900">📋 Orientación General</option>
                                <option value="DENUNCIA" className="text-slate-900">🚨 Recepción de Denuncia</option>
                                <option value="SEGUIMIENTO" className="text-slate-900">🔄 Seguimiento de Caso</option>
                                <option value="AUDIENCIA" className="text-slate-900">⚖️ Citación a Audiencia</option>
                                <option value="OTRO" className="text-slate-900">📌 Otro Trámite</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="observaciones" className="text-sm font-bold text-slate-700">
                            Observaciones de Visita
                        </Label>
                        <Textarea
                            id="observaciones"
                            name="observaciones"
                            placeholder="Detalles adicionales del ingreso..."
                            className="resize-none min-h-[100px] bg-white border-slate-200 focus:ring-4 focus:ring-blue-50 text-slate-900 shadow-sm"
                        />
                    </div>
                </CardContent>

                <CardFooter className="flex justify-between bg-slate-50/50 px-6 py-4 border-t border-slate-100">
                    <Button variant="ghost" type="button" className="text-slate-500 font-bold hover:bg-slate-100" onClick={() => {
                        formRef.current?.reset()
                        setDocumentoBusqueda('')
                        setResultado(null)
                        setBuscado(false)
                    }}>
                        Limpiar Formulario
                    </Button>
                    <Button
                        type="submit"
                        disabled={guardando}
                        className="bg-blue-900 hover:bg-slate-800 text-white gap-2 px-8 py-4 rounded-xl font-bold shadow-md transition-all active:scale-95"
                    >
                        {guardando ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Guardando...</>
                        ) : (
                            <><Clock className="h-4 w-4" /> Registrar Ingreso</>
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card >
    )
}
