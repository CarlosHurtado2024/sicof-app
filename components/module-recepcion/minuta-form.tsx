
'use client'

import { useRef } from 'react'
import { crearMinuta } from '@/lib/actions/minutas'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function MinutaForm() {
    const formRef = useRef<HTMLFormElement>(null)

    async function clientAction(formData: FormData) {
        // This is a simple wrapper to handle the server action response in a basic way
        // In a real app, we'd use useFormState or similar
        const result = await crearMinuta(formData)

        if (result?.error) {
            // Simple error handling
            alert(`Error: ${result.error}`)
        } else {
            // Success
            formRef.current?.reset()
            alert('✅ Minuta registrada correctamente')
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto border-t-4 border-t-blue-600 shadow-md">
            <CardHeader>
                <CardTitle className="text-xl">Nueva Minuta de Ingreso</CardTitle>
                <CardDescription>Registro rápido para control de vigilancia y recepción.</CardDescription>
            </CardHeader>
            <form ref={formRef} action={clientAction}>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="nombre_visitante">Nombre Completo *</Label>
                            <Input id="nombre_visitante" name="nombre_visitante" required placeholder="Ej: Juan Pérez" className="bg-gray-50 focus:bg-white transition-colors" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="documento_visitante">Documento (Opcional)</Label>
                            <Input id="documento_visitante" name="documento_visitante" placeholder="Ej: 12345678" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="telefono_contacto">Teléfono (Opcional)</Label>
                            <Input id="telefono_contacto" name="telefono_contacto" placeholder="Ej: 3001234567" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="motivo_visita">Motivo de Visita *</Label>
                            <select
                                id="motivo_visita"
                                name="motivo_visita"
                                required
                                defaultValue=""
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="" disabled>Seleccione...</option>
                                <option value="ORIENTACION">Orientación General</option>
                                <option value="DENUNCIA">Recepción de Denuncia</option>
                                <option value="SEGUIMIENTO">Seguimiento de Caso</option>
                                <option value="AUDIENCIA">Citación a Audiencia</option>
                                <option value="OTRO">Otro Trámite</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="observaciones">Observaciones</Label>
                        <Textarea
                            id="observaciones"
                            name="observaciones"
                            placeholder="Detalles adicionales del ingreso..."
                            className="resize-none min-h-[100px]"
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between bg-gray-50/50 p-6">
                    <Button variant="outline" type="button" onClick={() => formRef.current?.reset()}>Limpiar</Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Registrar Ingreso</Button>
                </CardFooter>
            </form>
        </Card>
    )
}
