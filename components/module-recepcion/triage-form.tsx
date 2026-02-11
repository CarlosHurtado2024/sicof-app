
'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { verificarCompetencia, CompetenciaResultado } from '@/lib/competence-logic'
import { radicarCaso } from '@/lib/actions/triage'

// Tipos para el estado del formulario
type FormData = {
    victima: {
        nombres: string;
        documento: string;
        tipo_documento: 'CC' | 'TI' | 'CE' | 'PASAPORTE' | 'PPT';
        fecha_nacimiento: string;
        genero: string;
        direccion: string;
        zona: 'URBANA' | 'RURAL';
        telefono: string;
        email: string;
        nivel_educativo: string;
        grupo_etnico: string;
        discapacidad: boolean;
        es_victima_conflicto: boolean;
    };
    agresor: {
        nombres: string;
        documento: string;
        alias: string;
        genero: string;
        direccion: string;
        telefono: string;
        acceso_armas: boolean;
    };
    caso: {
        hechos_relato: string;
        tipologia: 'FISICA' | 'PSICOLOGICA' | 'SEXUAL' | 'ECONOMICA' | 'PATRIMONIAL';
        ambito: 'FAMILIAR' | 'NO_FAMILIAR';
        fecha_hechos: string;
        lugar_hechos: string;
        hechos_lugar_municipio: boolean;
        es_competencia: boolean;
    }
};

const INITIAL_DATA: FormData = {
    victima: {
        nombres: '', documento: '', tipo_documento: 'CC', fecha_nacimiento: '', genero: 'FEMENINO',
        direccion: '', zona: 'URBANA', telefono: '', email: '', nivel_educativo: 'SECUNDARIA',
        grupo_etnico: 'NINGUNO', discapacidad: false, es_victima_conflicto: false
    },
    agresor: {
        nombres: '', documento: '', alias: '', genero: 'MASCULINO', direccion: '', telefono: '', acceso_armas: false
    },
    caso: {
        hechos_relato: '', tipologia: 'FISICA', ambito: 'FAMILIAR', fecha_hechos: '', lugar_hechos: '',
        hechos_lugar_municipio: true, es_competencia: false
    }
};

export function TriageForm() {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<FormData>(INITIAL_DATA);
    const [competenciaResult, setCompetenciaResult] = useState<CompetenciaResultado | null>(null);
    const [loading, setLoading] = useState(false);

    const updateField = (section: keyof FormData, field: string, value: any) => {
        setData(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };

    const handleNext = () => {
        if (step === 3) {
            // Validar competencia antes de pasar al resumen
            const result = verificarCompetencia({
                hechos_lugar_municipio: data.caso.hechos_lugar_municipio,
                victima_domicilio_municipio: true, // Asumimos true por defecto o agregamos campo
                es_violencia_intrafamiliar: data.caso.ambito === 'FAMILIAR',
                victima_es_nna: false, // TODO: Calcular por fecha nacimiento
                es_violencia_sexual: data.caso.tipologia === 'SEXUAL',
                tiene_medida_proteccion_vigente: false
            });
            setCompetenciaResult(result);
            updateField('caso', 'es_competencia', result.es_competente);
        }
        setStep(prev => prev + 1);
    };

    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        setLoading(true);
        // @ts-ignore - TODO: Fix type mismatch in enum between client/server
        const result = await radicarCaso(data);
        setLoading(false);
        if (result.success) {
            alert(`✅ Caso radicado exitosamente: ${result.radicado}`);
            window.location.href = '/dashboard/recepcion';
        } else {
            alert(`❌ Error: ${result.error}`);
        }
    };

    return (
        <Card className="w-full max-w-4xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle>Registro de Caso y Triaje - Paso {step} de 4</CardTitle>
                <CardDescription>
                    {step === 1 && "Caracterización de la Víctima (Parte Accionante)"}
                    {step === 2 && "Datos del Presunto Agresor (Parte Accionada)"}
                    {step === 3 && "Relato de Hechos y Competencia"}
                    {step === 4 && "Confirmación y Radicación"}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">

                {/* PASO 1: VÍCTIMA */}
                {step === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Nombres Completos</Label>
                            <Input value={data.victima.nombres} onChange={e => updateField('victima', 'nombres', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Documento</Label>
                            <div className="flex gap-2">
                                <select
                                    className="border rounded p-2 text-sm"
                                    value={data.victima.tipo_documento}
                                    onChange={e => updateField('victima', 'tipo_documento', e.target.value)}
                                >
                                    <option value="CC">CC</option>
                                    <option value="TI">TI</option>
                                    <option value="CE">CE</option>
                                    <option value="PPT">PPT</option>
                                </select>
                                <Input value={data.victima.documento} onChange={e => updateField('victima', 'documento', e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Fecha Nacimiento</Label>
                            <Input type="date" value={data.victima.fecha_nacimiento} onChange={e => updateField('victima', 'fecha_nacimiento', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Género</Label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={data.victima.genero}
                                onChange={e => updateField('victima', 'genero', e.target.value)}>
                                <option value="FEMENINO">Femenino</option>
                                <option value="MASCULINO">Masculino</option>
                                <option value="TRANS">Trans</option>
                                <option value="NO_BINARIO">No Binario</option>
                            </select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label>Dirección Residencia</Label>
                            <Input value={data.victima.direccion} onChange={e => updateField('victima', 'direccion', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Zona</Label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={data.victima.zona}
                                onChange={e => updateField('victima', 'zona', e.target.value)}>
                                <option value="URBANA">Urbana</option>
                                <option value="RURAL">Rural</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Nivel Educativo</Label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={data.victima.nivel_educativo}
                                onChange={e => updateField('victima', 'nivel_educativo', e.target.value)}>
                                <option value="PRIMARIA">Primaria</option>
                                <option value="SECUNDARIA">Secundaria</option>
                                <option value="TECNICO">Técnico/Tecnólogo</option>
                                <option value="PROFESIONAL">Profesional</option>
                                <option value="NINGUNO">Ninguno</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* PASO 2: AGRESOR */}
                {step === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Nombres Agresor</Label>
                            <Input value={data.agresor.nombres} onChange={e => updateField('agresor', 'nombres', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Alias / Apodo</Label>
                            <Input value={data.agresor.alias} onChange={e => updateField('agresor', 'alias', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Documento (Si se conoce)</Label>
                            <Input value={data.agresor.documento} onChange={e => updateField('agresor', 'documento', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Dirección para Notificación</Label>
                            <Input value={data.agresor.direccion} onChange={e => updateField('agresor', 'direccion', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>¿Tiene acceso a armas?</Label>
                            <div className="flex gap-4 pt-2">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={data.agresor.acceso_armas} onChange={e => updateField('agresor', 'acceso_armas', e.target.checked)} />
                                    Sí, tiene acceso
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* PASO 3: HECHOS Y COMPETENCIA */}
                {step === 3 && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Fecha de los Hechos</Label>
                                <Input type="date" value={data.caso.fecha_hechos} onChange={e => updateField('caso', 'fecha_hechos', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Tipología</Label>
                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={data.caso.tipologia}
                                    onChange={e => updateField('caso', 'tipologia', e.target.value)}>
                                    <option value="FISICA">Física</option>
                                    <option value="PSICOLOGICA">Psicológica</option>
                                    <option value="SEXUAL">Sexual</option>
                                    <option value="ECONOMICA">Económica</option>
                                    <option value="PATRIMONIAL">Patrimonial</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Relato de los Hechos</Label>
                            <Textarea
                                value={data.caso.hechos_relato}
                                onChange={e => updateField('caso', 'hechos_relato', e.target.value)}
                                placeholder="Describa tiempo, modo y lugar de la agresión (Mínimo 20 caracteres)..."
                                className="min-h-[150px]"
                            />
                        </div>
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                            <h4 className="font-semibold text-yellow-800 mb-2">Preguntas de Competencia</h4>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={data.caso.ambito === 'FAMILIAR'} onChange={e => updateField('caso', 'ambito', e.target.checked ? 'FAMILIAR' : 'NO_FAMILIAR')} />
                                    ¿Es violencia en contexto familiar (Art. 5 Ley 2126)?
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={data.caso.hechos_lugar_municipio} onChange={e => updateField('caso', 'hechos_lugar_municipio', e.target.checked)} />
                                    ¿Los hechos ocurrieron en este municipio?
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* PASO 4: CONFIRMACIÓN */}
                {step === 4 && (
                    <div className="space-y-6">
                        <div className={`p-4 rounded-md border ${competenciaResult?.es_competente ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            <h3 className={`text-lg font-bold ${competenciaResult?.es_competente ? 'text-green-800' : 'text-red-800'}`}>
                                {competenciaResult?.es_competente ? '✅ COMPETENCIA VERIFICADA' : '⛔ NO ES COMPETENCIA DEL COMISARIO'}
                            </h3>
                            <p className="mt-2 text-sm text-slate-700">{competenciaResult?.mensaje}</p>
                            {competenciaResult?.entidad_remision && (
                                <div className="mt-4 font-bold">
                                    Remitir a: {competenciaResult.entidad_remision}
                                </div>
                            )}
                        </div>

                        {competenciaResult?.es_competente && (
                            <div className="bg-slate-50 p-4 rounded text-sm space-y-2">
                                <p><strong>Víctima:</strong> {data.victima.nombres} ({data.victima.documento})</p>
                                <p><strong>Agresor:</strong> {data.agresor.nombres}</p>
                                <p><strong>Tipología:</strong> {data.caso.tipologia}</p>
                                <p><strong>Hechos:</strong> {data.caso.hechos_relato}</p>
                            </div>
                        )}
                    </div>
                )}

            </CardContent>
            <CardFooter className="flex justify-between">
                {step > 1 && (
                    <Button variant="outline" onClick={handleBack}>Atrás</Button>
                )}

                {step < 4 && (
                    <Button onClick={handleNext} className="ml-auto">Siguiente</Button>
                )}

                {step === 4 && competenciaResult?.es_competente && (
                    <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 ml-auto">
                        {loading ? 'Radicando...' : 'Confirmar y Generar Radicado'}
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
