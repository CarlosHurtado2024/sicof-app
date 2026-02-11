
export interface CompetenciaInput {
    hechos_lugar_municipio: boolean; // ¿Ocurrió en el municipio?
    victima_domicilio_municipio: boolean; // ¿Víctima vive acá?
    es_violencia_intrafamiliar: boolean; // ¿Cumple definición Ley 2126 Art. 5?
    victima_es_nna: boolean; // ¿Es Niño, Niña, Adolescente?
    es_violencia_sexual: boolean; // ¿Hay violencia sexual?
    tiene_medida_proteccion_vigente: boolean; // ¿Ya tiene medida en otra entidad?
}

export interface CompetenciaResultado {
    es_competente: boolean;
    entidad_remision?: 'FISCALIA' | 'ICBF' | 'INSPECCION_POLICIA' | 'OTRA_COMISARIA' | 'JUEZ_FAMILIA';
    mensaje: string;
}

export function verificarCompetencia(input: CompetenciaInput): CompetenciaResultado {
    // 1. Competencia Territorial (Ley 2126 Art. 8)
    // El comisario es competente si los hechos ocurrieron en su municipio O si la víctima reside allí.
    if (!input.hechos_lugar_municipio && !input.victima_domicilio_municipio) {
        return {
            es_competente: false,
            entidad_remision: 'OTRA_COMISARIA',
            mensaje: "Falta de competencia territorial. Remitir a Comisaría del lugar de hechos o domicilio de víctima."
        };
    }

    // 2. Competencia Material - Violencia Intrafamiliar vs Conflictos Vecinales/Otros
    if (!input.es_violencia_intrafamiliar) {
        return {
            es_competente: false,
            entidad_remision: 'INSPECCION_POLICIA',
            mensaje: "No constituye violencia intrafamiliar. Remitir a Inspección de Policía o Centro de Conciliación."
        };
    }

    // 3. Competencia Subsidiaria - Violencia Sexual en NNA (Ley 1098 / Ley 2126)
    // Si es NNA y hay violencia sexual, la competencia preferente es del Defensor de Familia (ICBF).
    // EXCEPCION: El Comisario PUEDE dictar medidas de emergencia, pero debe remitir.
    // Para efectos de este software de gestión de casos, marcaremos alerta de remisión.
    if (input.victima_es_nna && input.es_violencia_sexual) {
        return {
            es_competente: true, // Es competente para MEDIDAS PROVISIONALES
            entidad_remision: 'ICBF', // Pero debe remitir para restablecimiento de derechos
            mensaje: "ATENCIÓN: COMPETENCIA SUBSIDIARIA. El Comisario debe dictar medidas provisionales pero REMITIR INMEDIATAMENTE al ICBF (Defensoría de Familia) por violencia sexual contra NNA."
        };
    }

    // 4. Concurrencia - Delitos Penales
    // La violencia intrafamiliar es delito, por lo que SIEMPRE se compulsa copias a Fiscalía, 
    // pero el Comisario MANTIENE competencia para las medidas de protección.
    // Así que retornamos TRUE pero el sistema deberá generar alertas de compulsa.

    return {
        es_competente: true,
        mensaje: "Competencia verificada. Proceder a radicar el caso."
    };
}
