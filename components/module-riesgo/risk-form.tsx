
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
        [RiesgoNivel.SIN_RIESGO]: 'bg-slate-100 text-slate-700 border-slate-200',
        [RiesgoNivel.BAJO]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        [RiesgoNivel.MODERADO]: 'bg-amber-100 text-amber-700 border-amber-200',
        [RiesgoNivel.ALTO]: 'bg-orange-100 text-orange-700 border-orange-200',
        [RiesgoNivel.CRITICO]: 'bg-red-100 text-red-700 border-red-200'
    }[calculatedRisk];

    return (
        <Card className="w-full shadow-2xl shadow-slate-200/50 border-slate-200 rounded-3xl overflow-hidden bg-white/[0.03]">
            <CardHeader className="bg-white/5/50 border-b border-white/10 p-8">
                <CardTitle className="text-2xl font-black text-slate-900 tracking-tight uppercase">Instrumento de Evaluación</CardTitle>
                <CardDescription className="flex items-center gap-3 mt-3">
                    <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Nivel de Riesgo Previsto:</span>
                    <span className={`px-4 py-2 rounded-xl font-black text-sm uppercase tracking-wider border shadow-sm transition-all duration-500 scale-105 ${riskColor}`}>{calculatedRisk}</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4 p-6 bg-white/5/50 border border-white/10 rounded-2xl group hover:border-blue-200 transition-colors">
                        <h3 className="font-black text-[10px] text-blue-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                            Indicadores Críticos
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-white/[0.03] transition-colors">
                                <Checkbox id="amenaza_muerte" checked={checklist.amenaza_muerte} onCheckedChange={(c: boolean) => handleCheck('amenaza_muerte', c)} />
                                <Label htmlFor="amenaza_muerte" className="font-bold text-slate-700 text-sm leading-tight cursor-pointer">Amenaza de muerte reciente</Label>
                            </div>
                            <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-white/[0.03] transition-colors">
                                <Checkbox id="amenaza_con_arma" checked={checklist.amenaza_con_arma} onCheckedChange={(c: boolean) => handleCheck('amenaza_con_arma', c)} />
                                <Label htmlFor="amenaza_con_arma" className="font-bold text-slate-700 text-sm leading-tight cursor-pointer">Amenaza con arma / Objeto contundente</Label>
                            </div>
                            <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-white/[0.03] transition-colors">
                                <Checkbox id="violencia_sexual" checked={checklist.violencia_sexual} onCheckedChange={(c: boolean) => handleCheck('violencia_sexual', c)} />
                                <Label htmlFor="violencia_sexual" className="font-bold text-slate-700 text-sm leading-tight cursor-pointer">Historial de violencia sexual</Label>
                            </div>
                            <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-white/[0.03] transition-colors">
                                <Checkbox id="violacion_medidas_previas" checked={checklist.violacion_medidas_previas} onCheckedChange={(c: boolean) => handleCheck('violacion_medidas_previas', c)} />
                                <Label htmlFor="violacion_medidas_previas" className="font-bold text-slate-700 text-sm leading-tight cursor-pointer">Incumplimiento de medidas previas</Label>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 p-6 bg-white/5/50 border border-white/10 rounded-2xl group hover:border-amber-200 transition-colors">
                        <h3 className="font-black text-[10px] text-amber-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                            Agravantes del Agresor
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-white/[0.03] transition-colors">
                                <Checkbox id="consumo_sustancias" checked={checklist.consumo_sustancias} onCheckedChange={(c: boolean) => handleCheck('consumo_sustancias', c)} />
                                <Label htmlFor="consumo_sustancias" className="font-bold text-slate-700 text-sm leading-tight cursor-pointer">Consumo de alcohol o sustancias</Label>
                            </div>
                            <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-white/[0.03] transition-colors">
                                <Checkbox id="acceso_armas" checked={checklist.acceso_armas} onCheckedChange={(c: boolean) => handleCheck('acceso_armas', c)} />
                                <Label htmlFor="acceso_armas" className="font-bold text-slate-700 text-sm leading-tight cursor-pointer">Acceso a armas de fuego</Label>
                            </div>
                            <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-white/[0.03] transition-colors">
                                <Checkbox id="antecedentes_penales" checked={checklist.antecedentes_penales} onCheckedChange={(c: boolean) => handleCheck('antecedentes_penales', c)} />
                                <Label htmlFor="antecedentes_penales" className="font-bold text-slate-700 text-sm leading-tight cursor-pointer">Antecedentes penales o judiciales</Label>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 p-6 bg-white/5/50 border border-white/10 rounded-2xl group hover:border-indigo-200 transition-colors">
                        <h3 className="font-black text-[10px] text-indigo-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                            Contexto y Severidad
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-white/[0.03] transition-colors">
                                <Checkbox id="aumento_severidad" checked={checklist.aumento_severidad} onCheckedChange={(c: boolean) => handleCheck('aumento_severidad', c)} />
                                <Label htmlFor="aumento_severidad" className="font-bold text-slate-700 text-sm leading-tight cursor-pointer">Aumento en frecuencia de agresiones</Label>
                            </div>
                            <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-white/[0.03] transition-colors">
                                <Checkbox id="amenaza_suicidio_agresor" checked={checklist.amenaza_suicidio_agresor} onCheckedChange={(c: boolean) => handleCheck('amenaza_suicidio_agresor', c)} />
                                <Label htmlFor="amenaza_suicidio_agresor" className="font-bold text-slate-700 text-sm leading-tight cursor-pointer">Amenaza de suicidio del agresor</Label>
                            </div>
                            <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-white/[0.03] transition-colors">
                                <Checkbox id="celos_excesivos" checked={checklist.celos_excesivos} onCheckedChange={(c: boolean) => handleCheck('celos_excesivos', c)} />
                                <Label htmlFor="celos_excesivos" className="font-bold text-slate-700 text-sm leading-tight cursor-pointer">Control coercitivo / Celos</Label>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 p-6 bg-white/5/50 border border-white/10 rounded-2xl group hover:border-emerald-200 transition-colors">
                        <h3 className="font-black text-[10px] text-emerald-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                            Vulnerabilidad
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-white/[0.03] transition-colors">
                                <Checkbox id="presencia_nna" checked={checklist.presencia_nna} onCheckedChange={(c: boolean) => handleCheck('presencia_nna', c)} />
                                <Label htmlFor="presencia_nna" className="font-bold text-slate-700 text-sm leading-tight cursor-pointer">Presencia de NNA en el hogar</Label>
                            </div>
                            <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-white/[0.03] transition-colors">
                                <Checkbox id="victima_embarazada" checked={checklist.victima_embarazada} onCheckedChange={(c: boolean) => handleCheck('victima_embarazada', c)} />
                                <Label htmlFor="victima_embarazada" className="font-bold text-slate-700 text-sm leading-tight cursor-pointer">Víctima en gestación</Label>
                            </div>
                            <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-white/[0.03] transition-colors">
                                <Checkbox id="dependencia_economica" checked={checklist.dependencia_economica} onCheckedChange={(c: boolean) => handleCheck('dependencia_economica', c)} />
                                <Label htmlFor="dependencia_economica" className="font-bold text-slate-700 text-sm leading-tight cursor-pointer">Dependencia económica</Label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 p-6 bg-white/5 border border-white/10 rounded-2xl">
                    <Label htmlFor="observaciones" className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Análisis Profesional y Recomendaciones</Label>
                    <Textarea
                        id="observaciones"
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        placeholder="Escriba aquí sus observaciones y sugerencias de medidas de protección..."
                        className="bg-white/[0.03] border-slate-200 min-h-[120px] rounded-xl focus:ring-2 focus:ring-blue-500/20"
                    />
                </div>
            </CardContent>
            <CardFooter className="p-8 pt-0">
                <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`w-full py-7 rounded-2xl font-black uppercase tracking-widest text-base shadow-lg transition-all active:scale-95 ${loading ? 'opacity-50' : 'hover:shadow-xl'} ${riskColor}`}
                >
                    {loading ? 'Procesando...' : `CONFIRMAR NIVEL: ${calculatedRisk}`}
                </Button>
            </CardFooter>
        </Card >
    )
}
