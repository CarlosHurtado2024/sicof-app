
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { calcularVencimiento4Horas } from '@/lib/deadline-logic'

export async function registrarCrisis(formData: {
    nombre_victima: string;
    documento_victima: string;
    tipo_documento: string;
    tipologia: 'FISICA' | 'PSICOLOGICA' | 'SEXUAL' | 'ECONOMICA' | 'PATRIMONIAL';
    descripcion_breve: string;
    acciones_inmediatas: string;
    requiere_traslado: boolean;
    entidad_traslado?: string;
}) {
    const supabase = await createClient()

    const { data: { user: dbUser }, error: authError } = await supabase.auth.getUser()

    let user = dbUser

    if (!user) {
        console.warn('getUser fallo, intentando getSession...', authError)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (session && session.user) {
            user = session.user
        } else {
            console.error('Error de autenticación final en registrarCrisis:', sessionError)
            throw new Error(`No autorizado: ${authError?.message || sessionError?.message || 'Usuario no encontrado'}`)
        }
    }

    try {
        const ahora = new Date().toISOString()
        const year = new Date().getFullYear()
        const radicado = `URG-${year}-${Math.floor(1000 + Math.random() * 9000)}`

        // 1. Crear expediente de emergencia con nivel CRITICO
        const { data: expediente, error: expError } = await supabase
            .from('expedientes')
            .insert({
                radicado,
                estado: 'TRAMITE',
                fase_proceso: 'RECEPCION',
                nivel_riesgo: 'CRITICO',
                hechos_relato: formData.descripcion_breve,
                tipologia_violencia: formData.tipologia,
                fecha_conocimiento_hechos: ahora,
                es_competencia: true, // Asumimos competencia para actos urgentes
                comisaria_id: user.id,
            })
            .select()
            .single()

        if (expError || !expediente) {
            throw new Error(`Error creando expediente de crisis: ${expError?.message}`)
        }

        // 2. Crear persona víctima con datos mínimos
        const { error: personaError } = await supabase.from('personas').insert({
            expediente_id: expediente.id,
            tipo: 'VICTIMA',
            nombres: formData.nombre_victima,
            documento: formData.documento_victima || 'POR VERIFICAR',
            tipo_documento: formData.tipo_documento || 'CC',
            datos_demograficos: { crisis: true, registro_completo: false }
        })

        if (personaError) {
            throw new Error(`Error creando víctima: ${personaError.message}`)
        }

        // 3. Crear actuación de atención en crisis
        await supabase.from('actuaciones').insert({
            expediente_id: expediente.id,
            tipo: 'ATENCION_CRISIS',
            contenido: `ATENCIÓN EN CRISIS — Primeros Auxilios Psicológicos\n\nDescripción: ${formData.descripcion_breve}\n\nAcciones inmediatas: ${formData.acciones_inmediatas}\n\n${formData.requiere_traslado ? `Requiere traslado a: ${formData.entidad_traslado || 'Por determinar'}` : 'No requiere traslado inmediato.'}`,
            autor_id: user.id,
        })

        // 4. Crear término legal urgente: 4 horas para medida provisional
        const vencimiento4h = calcularVencimiento4Horas(new Date(ahora))
        await supabase.from('terminos_legales').insert({
            expediente_id: expediente.id,
            tipo: 'MEDIDA_PROVISIONAL_4H',
            fecha_inicio: ahora,
            fecha_vencimiento: vencimiento4h.toISOString(),
        })

        // 5. Registrar en minuta
        await supabase.from('minutas').insert({
            nombre_visitante: formData.nombre_victima,
            documento_visitante: formData.documento_victima,
            motivo_visita: 'DENUNCIA',
            funcionario_id: user.id,
            observaciones: `🚨 ATENCIÓN EN CRISIS — ${formData.tipologia}. Radicado de emergencia: ${radicado}`,
            fecha_hora_ingreso: ahora,
        })

        // 6. Registrar alerta de crisis en tiempo real
        await supabase.from('alertas_crisis').insert({
            expediente_id: expediente.id,
            radicado,
            nombre_victima: formData.nombre_victima,
            tipologia: formData.tipologia,
            descripcion: formData.descripcion_breve,
            estado: 'PENDIENTE',
            creado_por: user.id,
        })
        // 7. Notificar a Psicólogos y Trabajadores Sociales
        try {
            const { data: destinatarios } = await supabase
                .from('usuarios')
                .select('id, rol')
                .in('rol', ['PSICOLOGO', 'TRABAJADOR_SOCIAL'])

            if (destinatarios && destinatarios.length > 0) {
                const tipologiaLabel: Record<string, string> = {
                    'FISICA': 'Física',
                    'PSICOLOGICA': 'Psicológica',
                    'SEXUAL': 'Sexual',
                    'ECONOMICA': 'Económica',
                    'PATRIMONIAL': 'Patrimonial',
                }

                const notificaciones = destinatarios.map((dest) => ({
                    usuario_id: dest.id,
                    titulo: `🚨 Caso de CRISIS: ${radicado}`,
                    mensaje: `Atención urgente. Caso de crisis por violencia ${tipologiaLabel[formData.tipologia] || formData.tipologia}. Víctima: ${formData.nombre_victima}. Nivel de riesgo: CRÍTICO.`,
                    tipo: 'ALERTA',
                    enlace: `/dashboard/casos/${expediente.id}`,
                    expediente_id: expediente.id,
                    leida: false,
                }))

                await supabase.from('notificaciones_internas').insert(notificaciones)
            }
        } catch (notifError) {
            console.error("Error enviando notificaciones de crisis:", notifError)
        }

        revalidatePath('/dashboard/recepcion')
        return { success: true, radicado, id: expediente.id }

    } catch (error: any) {
        console.error('Error en registro de crisis:', error)
        return { success: false, error: error.message }
    }
}

export async function buscarPersonaPorDocumento(documento: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { persona: null, expedientes: [] }

    // Buscar personas por documento
    const { data: personas } = await supabase
        .from('personas')
        .select('*, expediente:expedientes(id, radicado, estado, tipologia_violencia, fecha_apertura, nivel_riesgo)')
        .eq('documento', documento)
        .order('created_at', { ascending: false })

    if (!personas || personas.length === 0) {
        return { persona: null, expedientes: [] }
    }

    // Deduplicar expedientes
    const expedientesMap = new Map<string, any>()
    personas.forEach((p: any) => {
        if (p.expediente) {
            expedientesMap.set(p.expediente.id, p.expediente)
        }
    })

    return {
        persona: personas[0],
        expedientes: Array.from(expedientesMap.values()),
        totalRegistros: personas.length,
    }
}

export async function atenderCrisis(alertaId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No autorizado')

    const { error } = await supabase
        .from('alertas_crisis')
        .update({
            estado: 'ATENDIDA',
            atendido_por: user.id,
            atendida_at: new Date().toISOString()
        })
        .eq('id', alertaId)

    if (error) throw new Error(error.message)
    revalidatePath('/dashboard')
    return { success: true }
}
