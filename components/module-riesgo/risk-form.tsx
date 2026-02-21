
'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { calcularNivelRiesgo, RiesgoNivel, RiskChecklist } from '@/lib/risk-logic'
import { guardarValoracionRiesgo } from '@/lib/actions/risk'
import { useRouter } from 'next/navigation'

interface RiskFormProps {
    expedienteId: string;
    userRole?: string;
}

export function RiskForm({ expedienteId, userRole }: RiskFormProps) {
    const router = useRouter();
    const [checklist, setChecklist] = useState<RiskChecklist>({
        amenaza_muerte: false,
        amenaza_con_arma: false,
        amenaza_suicidio_agresor: false,
        violencia_frecuente: false,
        aumento_severidad: false,
        antecedentes_penales: false,
        violacion_medidas_previas: false,
        victima_embarazada: false,
        victima_discapacidad: false,
        presencia_nna: false,
        dependencia_economica: false,
        consumo_sustancias: false,
        acceso_armas: false,
        celos_excesivos: false,
        violencia_sexual: false
    });
    const [observaciones, setObservaciones] = useState('');
    const [loading, setLoading] = useState(false);
    const [calculatedRisk, setCalculatedRisk] = useState<RiesgoNivel>(RiesgoNivel.SIN_RIESGO);

    const handleCheck = (key: keyof RiskChecklist, checked: boolean) => {
        const newChecklist = { ...checklist, [key]: checked };
        setChecklist(newChecklist);
        setCalculatedRisk(calcularNivelRiesgo(newChecklist));
    };

    const handleSubmit = async () => {
        setLoading(true);
        // @ts-ignore - Enum compatibility
        const result = await guardarValoracionRiesgo(expedienteId, checklist, observaciones);
        setLoading(false);

        if (result.success) {
            alert(`✅ Valoración Guardada. Nuevo Nivel de Riesgo: ${calculatedRisk}`);
            const redirectPath = userRole === 'AUXILIAR'
                ? '/dashboard/recepcion'
                : (userRole === 'PSICOLOGO' || userRole === 'TRABAJADOR_SOCIAL')
                    ? '/dashboard/casos'
                    : '/dashboard';
            router.push(redirectPath);
        } else {
            alert(`Error: ${result.error}`);
        }
    };

    const riskColor = {
        [RiesgoNivel.SIN_RIESGO]: 'bg-green-100 text-green-800',
        [RiesgoNivel.BAJO]: 'bg-blue-100 text-blue-800',
        [RiesgoNivel.MODERADO]: 'bg-yellow-100 text-yellow-800',
        [RiesgoNivel.ALTO]: 'bg-orange-100 text-orange-800',
        [RiesgoNivel.CRITICO]: 'bg-red-100 text-red-800'
    }[calculatedRisk];

    return (
        <Card className="w-full max-w-4xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle>Instrumento de Valoración de Riesgo</CardTitle>
                <CardDescription>
                    Nivel de Riesgo Calculado: <span className={`px-2 py-1 rounded font-bold ${riskColor}`}>{calculatedRisk}</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-slate-500 uppercase">Indicadores Críticos</h3>
                        <div className="flex items-start gap-2">
                            <Checkbox id="amenaza_muerte" checked={checklist.amenaza_muerte} onCheckedChange={(c: boolean) => handleCheck('amenaza_muerte', c)} />
                            <Label htmlFor="amenaza_muerte">Amenaza de muerte reciente</Label>
                        </div>
                        <div className="flex items-start gap-2">
                            <Checkbox id="amenaza_con_arma" checked={checklist.amenaza_con_arma} onCheckedChange={(c: boolean) => handleCheck('amenaza_con_arma', c)} />
                            <Label htmlFor="amenaza_con_arma">Amenaza con arma / Objeto contundente</Label>
                        </div>
                        <div className="flex items-start gap-2">
                            <Checkbox id="violencia_sexual" checked={checklist.violencia_sexual} onCheckedChange={(c: boolean) => handleCheck('violencia_sexual', c)} />
                            <Label htmlFor="violencia_sexual">Historial de violencia sexual</Label>
                        </div>
                        <div className="flex items-start gap-2">
                            <Checkbox id="violacion_medidas_previas" checked={checklist.violacion_medidas_previas} onCheckedChange={(c: boolean) => handleCheck('violacion_medidas_previas', c)} />
                            <Label htmlFor="violacion_medidas_previas">Incumplimiento de medidas previas</Label>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-slate-500 uppercase">Agravantes del Agresor</h3>
                        <div className="flex items-start gap-2">
                            <Checkbox id="consumo_sustancias" checked={checklist.consumo_sustancias} onCheckedChange={(c: boolean) => handleCheck('consumo_sustancias', c)} />
                            <Label htmlFor="consumo_sustancias">Consumo de alcohol o sustancias psicoactivas</Label>
                        </div>
                        <div className="flex items-start gap-2">
                            <Checkbox id="acceso_armas" checked={checklist.acceso_armas} onCheckedChange={(c: boolean) => handleCheck('acceso_armas', c)} />
                            <Label htmlFor="acceso_armas">Acceso a armas de fuego</Label>
                        </div>
                        <div className="flex items-start gap-2">
                            <Checkbox id="antecedentes_penales" checked={checklist.antecedentes_penales} onCheckedChange={(c: boolean) => handleCheck('antecedentes_penales', c)} />
                            <Label htmlFor="antecedentes_penales">Antecedentes penales o judiciales</Label>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-slate-500 uppercase">Contexto y Severidad</h3>
                        <div className="flex items-start gap-2">
                            <Checkbox id="aumento_severidad" checked={checklist.aumento_severidad} onCheckedChange={(c: boolean) => handleCheck('aumento_severidad', c)} />
                            <Label htmlFor="aumento_severidad">Aumento en frecuencia o severidad de agresiones</Label>
                        </div>
                        <div className="flex items-start gap-2">
                            <Checkbox id="amenaza_suicidio_agresor" checked={checklist.amenaza_suicidio_agresor} onCheckedChange={(c: boolean) => handleCheck('amenaza_suicidio_agresor', c)} />
                            <Label htmlFor="amenaza_suicidio_agresor">Amenaza de suicidio por parte del agresor</Label>
                        </div>
                        <div className="flex items-start gap-2">
                            <Checkbox id="celos_excesivos" checked={checklist.celos_excesivos} onCheckedChange={(c: boolean) => handleCheck('celos_excesivos', c)} />
                            <Label htmlFor="celos_excesivos">Celos excesivos / Control coercitivo</Label>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-slate-500 uppercase">Vulnerabilidad de la Víctima</h3>
                        <div className="flex items-start gap-2">
                            <Checkbox id="presencia_nna" checked={checklist.presencia_nna} onCheckedChange={(c: boolean) => handleCheck('presencia_nna', c)} />
                            <Label htmlFor="presencia_nna">Presencia de Niños, Niñas o Adolescentes</Label>
                        </div>
                        <div className="flex items-start gap-2">
                            <Checkbox id="victima_embarazada" checked={checklist.victima_embarazada} onCheckedChange={(c: boolean) => handleCheck('victima_embarazada', c)} />
                            <Label htmlFor="victima_embarazada">Víctima en estado de embarazo</Label>
                        </div>
                        <div className="flex items-start gap-2">
                            <Checkbox id="dependencia_economica" checked={checklist.dependencia_economica} onCheckedChange={(c: boolean) => handleCheck('dependencia_economica', c)} />
                            <Label htmlFor="dependencia_economica">Dependencia económica del agresor</Label>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="observaciones">Recomendaciones Profesionales (Opcional)</Label>
                    <Textarea
                        id="observaciones"
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        placeholder="Observaciones adicionales sobre el riesgo..."
                    />
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSubmit} disabled={loading} className={`w-full ${riskColor}`}>
                    {loading ? 'Guardando...' : `Confirmar Valoración: ${calculatedRisk}`}
                </Button>
            </CardFooter>
        </Card>
    )
}
