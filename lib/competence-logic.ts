
// Algoritmo de Competencia Legal — Ley 2126/2021, Art. 5
// Motor de reglas para determinar competencia de Comisaría de Familia

export interface CompetenciaInput {
    hechos_lugar_municipio: boolean;       // ¿Ocurrió en el municipio?
    victima_domicilio_municipio: boolean;  // ¿Víctima vive acá?
    es_violencia_intrafamiliar: boolean;   // ¿Cumple definición Ley 2126 Art. 5?
    agresor_es_familiar: boolean;          // ¿Agresor es miembro del núcleo familiar?
    victima_es_nna: boolean;              // ¿Es Niño, Niña, Adolescente? (< 18 años)
    edad_victima: number;                  // Edad calculada de la víctima
    es_violencia_sexual: boolean;          // ¿Hay violencia sexual?
    tipologia: 'FISICA' | 'PSICOLOGICA' | 'SEXUAL' | 'ECONOMICA' | 'PATRIMONIAL';
    hay_nna_victima_sexual_en_familia: boolean; // Regla 4: Concurrencia
    parentesco: string;                    // Relación víctima-agresor
}

export interface CompetenciaResultado {
    es_competente: boolean;
    competencia_subsidiaria: boolean;      // Competencia temporal para medidas urgentes
    entidad_remision?: 'FISCALIA' | 'ICBF' | 'INSPECCION_POLICIA' | 'OTRA_COMISARIA' | 'JUEZ_FAMILIA' | 'DEFENSORIA';
    mensaje: string;
    fundamento_legal: string;
    permite_medida_provisional: boolean;   // ¿Puede dictar medida urgente antes de remitir?
    requiere_auto_remision: boolean;       // ¿Debe generar auto de remisión?
    regla_aplicada: string;                // Qué regla del algoritmo se aplicó
    alertas: string[];                     // Alertas adicionales
}

export function verificarCompetencia(input: CompetenciaInput): CompetenciaResultado {
    const alertas: string[] = [];

    // ============================
    // PASO 0: Competencia Territorial (Art. 8 Ley 2126/2021)
    // ============================
    if (!input.hechos_lugar_municipio && !input.victima_domicilio_municipio) {
        return {
            es_competente: false,
            competencia_subsidiaria: false,
            entidad_remision: 'OTRA_COMISARIA',
            mensaje: 'Falta de competencia territorial. Los hechos no ocurrieron en este municipio y la víctima no reside aquí. Se debe remitir a la Comisaría del lugar de los hechos o del domicilio de la víctima.',
            fundamento_legal: 'Art. 8, Ley 2126 de 2021 — Competencia Territorial',
            permite_medida_provisional: true, // Actos urgentes permitidos
            requiere_auto_remision: true,
            regla_aplicada: 'TERRITORIAL',
            alertas: ['Si hay riesgo inminente, puede dictar medida provisional antes de remitir.']
        };
    }

    // ============================
    // PASO 1: Competencia Material — ¿Es Violencia Intrafamiliar?
    // ============================
    if (!input.es_violencia_intrafamiliar || !input.agresor_es_familiar) {
        return {
            es_competente: false,
            competencia_subsidiaria: false,
            entidad_remision: 'INSPECCION_POLICIA',
            mensaje: 'No constituye violencia intrafamiliar según la Ley 2126. El hecho no ocurre en contexto familiar o el agresor no es miembro del núcleo familiar. Remitir a Inspección de Policía o Centro de Conciliación según corresponda.',
            fundamento_legal: 'Art. 5, Ley 2126 de 2021 — Definición de Violencia Intrafamiliar',
            permite_medida_provisional: false,
            requiere_auto_remision: true,
            regla_aplicada: 'NO_VIF',
            alertas: []
        };
    }

    // ============================
    // PASO 2: ¿Víctima es NNA?
    // ============================
    const victimaEsNNA = input.victima_es_nna || input.edad_victima < 18;

    if (victimaEsNNA) {
        // ============================
        // REGLA 4: Concurrencia (LA EXCEPCIÓN CLAVE)
        // Si hay NNA víctima de violencia sexual Y adulto víctima de VIF en la misma
        // familia → Competencia Comisaría para todo el caso (unidad procesal)
        // ============================
        if (input.es_violencia_sexual && input.hay_nna_victima_sexual_en_familia) {
            alertas.push('⚠️ CONCURRENCIA: NNA víctima de violencia sexual + adulto víctima de VIF en la misma familia.');
            alertas.push('El Comisario asume todo el caso para no dividir la unidad procesal.');
            alertas.push('Se debe compulsar copias a Fiscalía y remitir reporte a ICBF para restablecimiento de derechos.');

            return {
                es_competente: true,
                competencia_subsidiaria: false,
                mensaje: 'COMPETENCIA POR CONCURRENCIA — El Comisario asume la totalidad del caso para preservar la unidad procesal. En la misma familia hay un NNA víctima de violencia sexual y un adulto víctima de violencia intrafamiliar. Se debe compulsar copias a Fiscalía y reportar al ICBF.',
                fundamento_legal: 'Art. 5, Ley 2126 de 2021 / Art. 86, Ley 1098 de 2006 — Concurrencia y Unidad Procesal',
                permite_medida_provisional: true,
                requiere_auto_remision: false,
                regla_aplicada: 'CONCURRENCIA',
                alertas
            };
        }

        // ============================
        // REGLA 3: Violencia Sexual contra NNA (Exclusiva)
        // Si víctima < 18 Y hay violencia sexual → NO COMPETENTE
        // Bloquear caso VIF, abrir Auto de Remisión a ICBF/Defensoría
        // ============================
        if (input.es_violencia_sexual) {
            alertas.push('🚨 VIOLENCIA SEXUAL CONTRA NNA DETECTADA — Competencia exclusiva del ICBF/Defensoría de Familia.');
            alertas.push('El sistema bloqueará la creación del caso VIF.');
            alertas.push('Si hay riesgo inminente, el Comisario puede dictar medida provisional antes de remitir.');

            return {
                es_competente: false,
                competencia_subsidiaria: true, // Puede dictar medidas de emergencia
                entidad_remision: 'ICBF',
                mensaje: 'NO COMPETENTE — Violencia sexual contra NNA. La competencia preferente es del Defensor de Familia (ICBF). Se debe generar Auto de Remisión inmediato. Sin embargo, el Comisario PUEDE y DEBE dictar medidas provisionales de protección si hay riesgo inminente antes de remitir.',
                fundamento_legal: 'Art. 5, Ley 2126 de 2021 / Art. 83, Ley 1098 de 2006 — Competencia del Defensor de Familia',
                permite_medida_provisional: true,
                requiere_auto_remision: true,
                regla_aplicada: 'VS_NNA',
                alertas
            };
        }

        // ============================
        // REGLA 2: VIF contra NNA SIN Violencia Sexual
        // Si víctima < 18 Y maltrato físico/psicológico/negligencia Y agresor = familia
        // → COMPETENCIA COMISARÍA
        // ============================
        alertas.push('Caso de maltrato contra NNA en contexto familiar — Competencia de Comisaría.');
        alertas.push('Activar protocolo de restablecimiento de derechos y notificar al ICBF.');

        return {
            es_competente: true,
            competencia_subsidiaria: false,
            mensaje: 'COMPETENCIA VERIFICADA — Violencia intrafamiliar contra NNA (maltrato físico, psicológico o negligencia). El Comisario es competente para conocer el caso y dictar medidas de protección.',
            fundamento_legal: 'Art. 5, Ley 2126 de 2021 / Art. 86, Ley 1098 de 2006 — VIF contra NNA',
            permite_medida_provisional: true,
            requiere_auto_remision: false,
            regla_aplicada: 'VIF_NNA',
            alertas
        };
    }

    // ============================
    // REGLA 1: VIF Adulto vs Adulto
    // Si víctima ≥ 18 Y agresor = miembro del núcleo familiar → COMPETENCIA COMISARÍA
    // ============================
    // Verificar concurrencia incluso para adultos
    if (input.hay_nna_victima_sexual_en_familia) {
        alertas.push('⚠️ CONCURRENCIA: Hay un NNA víctima de violencia sexual en la misma familia.');
        alertas.push('El Comisario asume todo el caso para no dividir la unidad procesal.');
    }

    // La VIF es delito penal, siempre compulsar copias a Fiscalía
    alertas.push('Compulsar copias a Fiscalía — La violencia intrafamiliar es también delito penal (Art. 229 CP).');

    return {
        es_competente: true,
        competencia_subsidiaria: false,
        mensaje: 'COMPETENCIA VERIFICADA — Violencia intrafamiliar entre adultos en contexto familiar. El Comisario es competente para conocer el caso y dictar medidas de protección.',
        fundamento_legal: 'Art. 5, Ley 2126 de 2021 — VIF entre adultos',
        permite_medida_provisional: true,
        requiere_auto_remision: false,
        regla_aplicada: 'VIF_ADULTO',
        alertas
    };
}

/**
 * Genera el texto del Auto de Remisión cuando el caso no es competencia.
 */
export function generarAutoRemision(
    resultado: CompetenciaResultado,
    datosExpediente: { radicado?: string; victima: string; tipologia: string }
): string {
    const fecha = new Date().toLocaleDateString('es-CO', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return `AUTO DE REMISIÓN

Fecha: ${fecha}
${datosExpediente.radicado ? `Radicado: ${datosExpediente.radicado}` : ''}

MOTIVO: ${resultado.mensaje}

FUNDAMENTO LEGAL: ${resultado.fundamento_legal}

REGLA APLICADA: ${resultado.regla_aplicada}

ENTIDAD DE REMISIÓN: ${resultado.entidad_remision || 'Por determinar'}

DATOS DEL CASO:
- Persona afectada: ${datosExpediente.victima}
- Tipología reportada: ${datosExpediente.tipologia}

${resultado.permite_medida_provisional ? 'NOTA: Se permite dictar medida provisional urgente antes de remitir si hay riesgo inminente.' : ''}

Se ordena remitir el presente caso a ${resultado.entidad_remision || 'la entidad competente'} para que adelante las actuaciones a que haya lugar conforme a sus competencias legales.

${resultado.alertas.length > 0 ? '\nALERTAS:\n' + resultado.alertas.map(a => `- ${a}`).join('\n') : ''}
`;
}
