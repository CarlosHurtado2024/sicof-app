
import { z } from 'zod'

// Enum matching DB
export enum RiesgoNivel {
    SIN_RIESGO = 'SIN_RIESGO',
    BAJO = 'BAJO',
    MODERADO = 'MODERADO',
    ALTO = 'ALTO',
    CRITICO = 'CRITICO'
}

export const RiskChecklistSchema = z.object({
    // Amenazas
    amenaza_muerte: z.boolean(),
    amenaza_con_arma: z.boolean(),
    amenaza_suicidio_agresor: z.boolean(),
    // Historia
    violencia_frecuente: z.boolean(),
    aumento_severidad: z.boolean(),
    antecedentes_penales: z.boolean(),
    violacion_medidas_previas: z.boolean(),
    // Vulnerabilidad
    victima_embarazada: z.boolean(),
    victima_discapacidad: z.boolean(),
    presencia_nna: z.boolean(), // Niños, Niñas, Adolescentes
    dependencia_economica: z.boolean(),
    // Agresor
    consumo_sustancias: z.boolean(),
    acceso_armas: z.boolean(),
    celos_excesivos: z.boolean(),
    // Violencia Sexual
    violencia_sexual: z.boolean()
});

export type RiskChecklist = z.infer<typeof RiskChecklistSchema>;

export function calcularNivelRiesgo(checklist: RiskChecklist): RiesgoNivel {
    let score = 0;

    // Critical Indicators (Weight 3)
    if (checklist.amenaza_muerte) score += 3;
    if (checklist.amenaza_con_arma) score += 3;
    if (checklist.violencia_sexual) score += 3;
    if (checklist.violacion_medidas_previas) score += 3;

    // High Risk Indicators (Weight 2)
    if (checklist.aumento_severidad) score += 2;
    if (checklist.acceso_armas) score += 2;
    if (checklist.consumo_sustancias) score += 2;
    if (checklist.presencia_nna) score += 2;

    // General Indicators (Weight 1)
    if (checklist.violencia_frecuente) score += 1;
    if (checklist.antecedentes_penales) score += 1;
    if (checklist.victima_embarazada) score += 1;
    if (checklist.victima_discapacidad) score += 1;
    if (checklist.dependencia_economica) score += 1;
    if (checklist.celos_excesivos) score += 1;
    if (checklist.amenaza_suicidio_agresor) score += 1;

    // Classification
    if (score >= 8) return RiesgoNivel.CRITICO; // Vida en peligro inminente
    if (score >= 5) return RiesgoNivel.ALTO; // Riesgo grave
    if (score >= 3) return RiesgoNivel.MODERADO; // Riesgo latente
    if (score >= 1) return RiesgoNivel.BAJO; // Alerta temprana
    return RiesgoNivel.SIN_RIESGO;
}
