
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
        <Card className="w-full border-0 shadow-lg bg-white overflow-hidden">
            {/* Gradient Header */}
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white pb-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-white text-lg">Minuta de Ingreso</CardTitle>
                        <CardDescription className="text-blue-100">
                            Control de vigilancia y recepción
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <form ref={formRef} action={clientAction}>
                <CardContent className="space-y-4 pt-5">

                    {/* Success Banner */}
                    {exito && (
                        <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg animate-in slide-in-from-top-2 duration-300">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                            <p className="text-sm font-medium text-emerald-800">✅ Minuta registrada exitosamente</p>
                        </div>
                    )}

                    {/* Search by Document */}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <Search className="h-3.5 w-3.5 text-blue-500" />
                            Buscar por Documento
                        </Label>
                        <div className="relative">
                            <Input
                                value={documentoBusqueda}
                                onChange={e => handleDocumentoChange(e.target.value)}
                                placeholder="Ingrese cédula o TI para buscar..."
                                className="pr-10 bg-blue-50/50 border-blue-200 focus:border-blue-400 focus:ring-blue-300"
                            />
                            {buscando && (
                                <Loader2 className="absolute right-3 top-2.5 h-5 w-5 text-blue-400 animate-spin" />
                            )}
                        </div>
                    </div>

                    {/* Search Result: Person Found */}
                    {buscado && resultado?.persona && (
                        <div className="rounded-lg border border-blue-200 overflow-hidden animate-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center gap-3 p-3 bg-blue-50">
                                <div className="p-1.5 bg-blue-100 rounded-full">
                                    <UserCheck className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-blue-900">{resultado.persona.nombres}</p>
                                    <p className="text-xs text-blue-600">Doc: {resultado.persona.documento}</p>
                                </div>
                            </div>

                            {resultado.expedientes.length > 0 && (
                                <div className="p-3 bg-red-50 border-t border-red-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertTriangle className="h-4 w-4 text-red-600" />
                                        <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
                                            ⚠ Alerta de Reincidencia — {resultado.expedientes.length} expediente(s) previo(s)
                                        </span>
                                    </div>
                                    <div className="space-y-1.5">
                                        {resultado.expedientes.slice(0, 3).map((exp: any, i: number) => (
                                            <div key={i} className="flex items-center justify-between text-xs bg-white p-2 rounded border border-red-100">
                                                <span className="font-mono font-medium text-red-800">{exp.radicado}</span>
                                                <span className={`px-2 py-0.5 rounded-full font-medium ${exp.estado === 'TRAMITE' ? 'bg-amber-100 text-amber-700' :
                                                        exp.estado === 'CERRADO' ? 'bg-slate-100 text-slate-600' :
                                                            'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {exp.estado}
                                                </span>
                                                <span className="text-slate-500">{exp.tipologia_violencia}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Search Result: Not Found */}
                    {buscado && !resultado?.persona && documentoBusqueda.length >= 4 && (
                        <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 animate-in slide-in-from-top-2 duration-300">
                            <User className="h-4 w-4 text-slate-400" />
                            No se encontró persona con ese documento. Se registrará como nuevo visitante.
                        </div>
                    )}

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                        <div className="space-y-2">
                            <Label htmlFor="nombre_visitante" className="text-sm font-medium text-slate-700">
                                Nombre Completo *
                            </Label>
                            <Input
                                id="nombre_visitante"
                                name="nombre_visitante"
                                required
                                defaultValue={resultado?.persona?.nombres || ''}
                                key={resultado?.persona?.nombres || 'empty'}
                                placeholder="Ej: Juan Pérez"
                                className="bg-slate-50/50 focus:bg-white transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="documento_visitante" className="text-sm font-medium text-slate-700">
                                Documento
                            </Label>
                            <Input
                                id="documento_visitante"
                                name="documento_visitante"
                                value={documentoBusqueda}
                                onChange={e => handleDocumentoChange(e.target.value)}
                                placeholder="Ej: 12345678"
                                className="bg-slate-50/50 focus:bg-white"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="telefono_contacto" className="text-sm font-medium text-slate-700">
                                Teléfono
                            </Label>
                            <Input
                                id="telefono_contacto"
                                name="telefono_contacto"
                                placeholder="Ej: 3001234567"
                                className="bg-slate-50/50 focus:bg-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="motivo_visita" className="text-sm font-medium text-slate-700">
                                Motivo de Visita *
                            </Label>
                            <select
                                id="motivo_visita"
                                name="motivo_visita"
                                required
                                defaultValue=""
                                className="flex h-10 w-full items-center rounded-md border border-input bg-slate-50/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-colors"
                            >
                                <option value="" disabled>Seleccione...</option>
                                <option value="ORIENTACION">📋 Orientación General</option>
                                <option value="DENUNCIA">🚨 Recepción de Denuncia</option>
                                <option value="SEGUIMIENTO">🔄 Seguimiento de Caso</option>
                                <option value="AUDIENCIA">⚖️ Citación a Audiencia</option>
                                <option value="OTRO">📌 Otro Trámite</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="observaciones" className="text-sm font-medium text-slate-700">
                            Observaciones
                        </Label>
                        <Textarea
                            id="observaciones"
                            name="observaciones"
                            placeholder="Detalles adicionales del ingreso..."
                            className="resize-none min-h-[80px] bg-slate-50/50 focus:bg-white"
                        />
                    </div>
                </CardContent>

                <CardFooter className="flex justify-between bg-slate-50/50 px-6 py-4">
                    <Button variant="outline" type="button" onClick={() => {
                        formRef.current?.reset()
                        setDocumentoBusqueda('')
                        setResultado(null)
                        setBuscado(false)
                    }}>
                        Limpiar
                    </Button>
                    <Button
                        type="submit"
                        disabled={guardando}
                        className="bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200 gap-2"
                    >
                        {guardando ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Guardando...</>
                        ) : (
                            <><Clock className="h-4 w-4" /> Registrar Ingreso</>
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
