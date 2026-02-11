
// Lógica de cálculo de términos legales y alertas — Ley 2126/2021
// Art. 17: Medida provisional en máximo 4 horas desde conocimiento del hecho

export type TipoTermino = 'MEDIDA_PROVISIONAL_4H' | 'AUDIENCIA_30DIAS' | 'FALLO_10DIAS' | 'INCIDENTE' | 'OTRO'
export type SemaforoEstado = 'VERDE' | 'AMARILLO' | 'ROJO'

export interface TerminoLegal {
    tipo: TipoTermino
    fecha_inicio: string
    fecha_vencimiento: string
    cumplido: boolean
}

const TERMINOS_CONFIG: Record<TipoTermino, { nombre: string; descripcion: string }> = {
    MEDIDA_PROVISIONAL_4H: {
        nombre: 'Medida Provisional',
        descripcion: 'El Comisario debe emitir medida provisional dentro de las 4 horas siguientes al conocimiento de los hechos (Art. 17 Ley 2126/2021)'
    },
    AUDIENCIA_30DIAS: {
        nombre: 'Programación de Audiencia',
        descripcion: 'La audiencia debe programarse dentro de los 30 días siguientes a la radicación del caso'
    },
    FALLO_10DIAS: {
        nombre: 'Emisión de Fallo',
        descripcion: 'El fallo con medidas definitivas debe emitirse dentro de los 10 días siguientes a la audiencia'
    },
    INCIDENTE: {
        nombre: 'Resolución de Incidente',
        descripcion: 'El incidente de incumplimiento debe resolverse oportunamente'
    },
    OTRO: {
        nombre: 'Otro Término',
        descripcion: 'Término legal personalizado'
    }
}

/**
 * Calcula la fecha de vencimiento de la medida provisional (4 horas desde conocimiento).
 */
export function calcularVencimiento4Horas(fechaConocimiento: Date): Date {
    const vencimiento = new Date(fechaConocimiento)
    vencimiento.setHours(vencimiento.getHours() + 4)
    return vencimiento
}

/**
 * Calcula la fecha de vencimiento para audiencia (30 días desde radicación).
 */
export function calcularVencimientoAudiencia(fechaRadicacion: Date): Date {
    const vencimiento = new Date(fechaRadicacion)
    vencimiento.setDate(vencimiento.getDate() + 30)
    return vencimiento
}

/**
 * Calcula la fecha de vencimiento para el fallo (10 días desde audiencia).
 */
export function calcularVencimientoFallo(fechaAudiencia: Date): Date {
    const vencimiento = new Date(fechaAudiencia)
    vencimiento.setDate(vencimiento.getDate() + 10)
    return vencimiento
}

/**
 * Determina el estado del semáforo de un término legal:
 * - VERDE: más del 50% del tiempo restante
 * - AMARILLO: menos del 50% pero no vencido
 * - ROJO: vencido
 */
export function obtenerSemaforoTermino(termino: TerminoLegal): SemaforoEstado {
    if (termino.cumplido) return 'VERDE'

    const ahora = new Date()
    const inicio = new Date(termino.fecha_inicio)
    const vencimiento = new Date(termino.fecha_vencimiento)

    if (ahora >= vencimiento) return 'ROJO'

    const tiempoTotal = vencimiento.getTime() - inicio.getTime()
    const tiempoTranscurrido = ahora.getTime() - inicio.getTime()
    const porcentaje = tiempoTranscurrido / tiempoTotal

    if (porcentaje >= 0.5) return 'AMARILLO'
    return 'VERDE'
}

/**
 * Obtiene la información descriptiva de un tipo de término.
 */
export function obtenerInfoTermino(tipo: TipoTermino) {
    return TERMINOS_CONFIG[tipo]
}

/**
 * Formatea el tiempo restante para vencimiento en texto legible.
 */
export function formatearTiempoRestante(fechaVencimiento: string): string {
    const ahora = new Date()
    const vencimiento = new Date(fechaVencimiento)
    const diffMs = vencimiento.getTime() - ahora.getTime()

    if (diffMs <= 0) return 'VENCIDO'

    const horas = Math.floor(diffMs / (1000 * 60 * 60))
    const minutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    const dias = Math.floor(horas / 24)

    if (dias > 0) return `${dias}d ${horas % 24}h restantes`
    if (horas > 0) return `${horas}h ${minutos}m restantes`
    return `${minutos}m restantes`
}
