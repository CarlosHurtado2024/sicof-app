
// Máquina de estados para el flujo del caso — Ley 2126/2021
// Las 5 fases de la Ruta de Atención Integral

export type FaseProceso = 'RECEPCION' | 'VALORACION' | 'MEDIDAS' | 'SEGUIMIENTO' | 'CIERRE'

export const FASES_ORDEN: FaseProceso[] = [
    'RECEPCION',
    'VALORACION',
    'MEDIDAS',
    'SEGUIMIENTO',
    'CIERRE'
]

export const FASES_INFO: Record<FaseProceso, { nombre: string; descripcion: string; icono: string }> = {
    RECEPCION: {
        nombre: 'Recepción y Registro',
        descripcion: 'Triaje inicial, registro de víctima/agresor, validación de competencia',
        icono: 'ClipboardList'
    },
    VALORACION: {
        nombre: 'Valoración Interdisciplinaria',
        descripcion: 'Valoración psicológica, de riesgo y social por el equipo interdisciplinario',
        icono: 'HeartPulse'
    },
    MEDIDAS: {
        nombre: 'Medidas de Protección',
        descripcion: 'Medidas provisionales (4h), audiencia y fallo con medidas definitivas',
        icono: 'Shield'
    },
    SEGUIMIENTO: {
        nombre: 'Seguimiento',
        descripcion: 'Verificación del cumplimiento de las órdenes y medidas impuestas',
        icono: 'Eye'
    },
    CIERRE: {
        nombre: 'Cierre o Incumplimiento',
        descripcion: 'Levantamiento de medidas si se supera el riesgo, o incidente de incumplimiento',
        icono: 'CheckCircle'
    }
}

export interface ExpedienteParaWorkflow {
    id: string
    fase_proceso: FaseProceso
    tiene_victima: boolean
    tiene_agresor: boolean
    tiene_valoracion_riesgo: boolean
    tiene_medida_provisional: boolean
    tiene_medida_definitiva: boolean
    tiene_seguimiento_cumplido: boolean
}

export interface TransicionResultado {
    puede_avanzar: boolean
    fase_destino: FaseProceso | null
    requisitos_faltantes: string[]
    mensaje: string
}

/**
 * Verifica si un expediente puede avanzar a la siguiente fase del proceso.
 * Cada transición tiene requisitos legales que deben cumplirse.
 */
export function puedeAvanzarFase(expediente: ExpedienteParaWorkflow): TransicionResultado {
    const faseActual = expediente.fase_proceso
    const indiceFaseActual = FASES_ORDEN.indexOf(faseActual)

    // Ya está en la última fase
    if (indiceFaseActual === FASES_ORDEN.length - 1) {
        return {
            puede_avanzar: false,
            fase_destino: null,
            requisitos_faltantes: [],
            mensaje: 'El expediente ya se encuentra en la fase final.'
        }
    }

    const faseDestino = FASES_ORDEN[indiceFaseActual + 1]
    const faltantes: string[] = []

    switch (faseActual) {
        case 'RECEPCION':
            // Para pasar a valoración: debe tener víctima y agresor registrados
            if (!expediente.tiene_victima) faltantes.push('Registrar datos de la víctima')
            if (!expediente.tiene_agresor) faltantes.push('Registrar datos del agresor')
            break

        case 'VALORACION':
            // Para pasar a medidas: debe tener al menos una valoración de riesgo
            if (!expediente.tiene_valoracion_riesgo) faltantes.push('Realizar al menos una valoración de riesgo')
            break

        case 'MEDIDAS':
            // Para pasar a seguimiento: debe existir una medida de protección
            if (!expediente.tiene_medida_provisional && !expediente.tiene_medida_definitiva) {
                faltantes.push('Dictar al menos una medida de protección (provisional o definitiva)')
            }
            break

        case 'SEGUIMIENTO':
            // Para pasar a cierre: debe haber verificación de cumplimiento
            if (!expediente.tiene_seguimiento_cumplido) {
                faltantes.push('Realizar al menos una verificación de cumplimiento')
            }
            break
    }

    return {
        puede_avanzar: faltantes.length === 0,
        fase_destino: faltantes.length === 0 ? faseDestino : null,
        requisitos_faltantes: faltantes,
        mensaje: faltantes.length === 0
            ? `El expediente puede avanzar a: ${FASES_INFO[faseDestino].nombre}`
            : `Requisitos pendientes para avanzar a ${FASES_INFO[faseDestino].nombre}`
    }
}

/**
 * Obtiene el índice numérico de una fase (0-4) para renderizar el stepper.
 */
export function indiceFase(fase: FaseProceso): number {
    return FASES_ORDEN.indexOf(fase)
}

/**
 * Verifica si una fase específica está completada respecto a la fase actual.
 */
export function faseCompletada(faseActual: FaseProceso, faseAVerificar: FaseProceso): boolean {
    return FASES_ORDEN.indexOf(faseAVerificar) < FASES_ORDEN.indexOf(faseActual)
}
