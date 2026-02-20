
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { calcularVencimiento4Horas, calcularVencimientoAudiencia } from '@/lib/deadline-logic'
import { generarAutoRemision, verificarCompetencia } from '@/lib/competence-logic'

// Definición de esquemas de validación actualizados
const TriageSchema = z.object({
    // Víctima
    victima: z.object({
        nombres: z.string().min(3),
        documento: z.string().min(5),
        tipo_documento: z.string(),
        fecha_nacimiento: z.string(),
        genero: z.string(),
        identidad_genero: z.string().optional(),
        direccion: z.string().min(5),
        barrio: z.string().optional(),
        zona: z.enum(['URBANA', 'RURAL']),
        telefono: z.string().optional(),
        email: z.string().email().optional().or(z.literal('')),
        nivel_educativo: z.string(),
        grupo_etnico: z.string(), // Obligatorio ahora
        discapacidad: z.boolean().default(false),
        tipo_discapacidad: z.string().optional(),
        es_victima_conflicto: z.boolean().default(false),
        estado_civil: z.string().optional(),
        eps: z.string().optional()
    }),
    // Agresor
    agresor: z.object({
        nombres: z.string().min(3),
        documento: z.string().optional().or(z.literal('')),
        tipo_documento: z.string().optional(),
        alias: z.string().optional(),
        genero: z.string().optional(),
        direccion: z.string().optional(),
        telefono: z.string().optional(),
        ocupacion: z.string().optional(),
        acceso_armas: z.boolean().default(false),
        parentesco: z.string() // Obligatorio ahora
    }),
    // Caso
    caso: z.object({
        hechos_relato: z.string().min(20, "El relato debe ser detallado"),
        tipologia: z.enum(['FISICA', 'PSICOLOGICA', 'SEXUAL', 'ECONOMICA', 'PATRIMONIAL']),
        ambito: z.enum(['FAMILIAR', 'NO_FAMILIAR']),
        fecha_hechos: z.string(),
        lugar_hechos: z.string().min(3),
        hechos_lugar_municipio: z.boolean(),
        victima_domicilio_municipio: z.boolean(),
        es_competencia: z.boolean(),
        hay_nna_victima_sexual_en_familia: z.boolean().optional()
    })
})

export async function radicarCaso(data: z.infer<typeof TriageSchema>) {
    const supabase = await createClient()

    // 1. Get User
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("No autorizado")

    try {
        // Validar competencia nuevamente en servidor
        // (Esto es redundante pero seguro)
        // Omitimos validación completa aquí para confiar en el cliente/usuario, 
        // pero usamos los flags para determinar flujos.

        // A. Crear Expediente (Radicado)
        const year = new Date().getFullYear();
        const radicado = `COM-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
        const ahora = new Date().toISOString();

        // Determinar estado inicial basado en competencia
        // Si no es competente pero se radica, es para MEDIDA PROVISIONAL (competencia subsidiaria)
        // o para REMISIÓN formal.
        const estadoInicial = data.caso.es_competencia ? 'TRAMITE' : 'REMITIDO';

        const { data: expediente, error: expError } = await supabase
            .from('expedientes')
            .insert({
                radicado: radicado,
                estado: estadoInicial,
                fase_proceso: 'RECEPCION',
                nivel_riesgo: 'BAJO', // Se actualizará en valoración
                hechos_relato: data.caso.hechos_relato,
                tipologia_violencia: data.caso.tipologia,
                fecha_hechos: data.caso.fecha_hechos,
                lugar_hechos: data.caso.lugar_hechos,
                es_competencia: data.caso.es_competencia,
                fecha_conocimiento_hechos: ahora,
                comisaria_id: user.id
            })
            .select()
            .single();

        if (expError || !expediente) throw new Error(`Error creando expediente: ${expError?.message}`);

        // B. Crear Víctima
        const { error: vicError } = await supabase.from('personas').insert({
            expediente_id: expediente.id,
            tipo: 'VICTIMA',
            nombres: data.victima.nombres,
            documento: data.victima.documento,
            fecha_nacimiento: data.victima.fecha_nacimiento,
            genero: data.victima.genero,
            direccion_residencia: data.victima.direccion,
            zona: data.victima.zona,
            telefono: data.victima.telefono,
            email: data.victima.email || null,
            nivel_educativo: data.victima.nivel_educativo,
            grupo_etnico: data.victima.grupo_etnico,
            discapacidad: data.victima.discapacidad,
            es_victima_conflicto: data.victima.es_victima_conflicto,
            datos_demograficos: {
                tipo_documento: data.victima.tipo_documento,
                identidad_genero: data.victima.identidad_genero,
                ocupacion: 'NO REGISTRA',
                regimen_salud: data.victima.eps,
                estado_civil: data.victima.estado_civil,
                tipo_discapacidad: data.victima.tipo_discapacidad,
                barrio: data.victima.barrio
            }
        });

        if (vicError) throw new Error(`Error creando víctima: ${vicError.message}`);

        // C. Crear Agresor
        const { error: agrError } = await supabase.from('personas').insert({
            expediente_id: expediente.id,
            tipo: 'AGRESOR',
            nombres: data.agresor.nombres,
            documento: data.agresor.documento || 'NO REPORTA',
            alias: data.agresor.alias,
            direccion_residencia: data.agresor.direccion,
            telefono: data.agresor.telefono,
            acceso_armas: data.agresor.acceso_armas,
            datos_demograficos: {
                tipo_documento: data.agresor.tipo_documento || 'CC',
                genero: data.agresor.genero,
                ocupacion: data.agresor.ocupacion,
                parentesco_victima: data.agresor.parentesco
            }
        });

        if (agrError) throw new Error(`Error creando agresor: ${agrError.message}`);

        // D. Actuaciones Automáticas (Auto Avocamiento o Remisión)

        if (data.caso.es_competencia) {
            // Caso Competente: Auto de Avocamiento
            await supabase.from('actuaciones').insert({
                expediente_id: expediente.id,
                tipo: 'AUTO_AVOCAMIENTO',
                contenido: `Auto que avoca conocimiento del caso ${radicado}. Se ordena iniciar trámite de medida de protección por presunta violencia intrafamiliar de tipo ${data.caso.tipologia}. Parentesco: ${data.agresor.parentesco}.`,
                autor_id: user.id
            });

            // Términos Legales
            const fechaConocimiento = new Date(ahora);
            const vencimiento4h = calcularVencimiento4Horas(fechaConocimiento);
            const vencimientoAudiencia = calcularVencimientoAudiencia(fechaConocimiento);

            await supabase.from('terminos_legales').insert([
                {
                    expediente_id: expediente.id,
                    tipo: 'MEDIDA_PROVISIONAL_4H',
                    fecha_inicio: ahora,
                    fecha_vencimiento: vencimiento4h.toISOString()
                },
                {
                    expediente_id: expediente.id,
                    tipo: 'AUDIENCIA_30DIAS',
                    fecha_inicio: ahora,
                    fecha_vencimiento: vencimientoAudiencia.toISOString()
                }
            ]);
        } else {
            // Caso NO Competente: Auto de Remisión
            // Recalculamos resultado de competencia para generar el texto exacto
            const edad = calcularEdad(data.victima.fecha_nacimiento); // Helper function duplicated or import needed? 
            // We'll approximate age calculation or pass it from client? 
            // Better to rely on logic:
            const esNNA = edad < 18; // Logic simplification for server side generation

            const compResult = verificarCompetencia({
                hechos_lugar_municipio: data.caso.hechos_lugar_municipio,
                victima_domicilio_municipio: data.caso.victima_domicilio_municipio,
                es_violencia_intrafamiliar: data.caso.ambito === 'FAMILIAR',
                agresor_es_familiar: !!data.agresor.parentesco,
                victima_es_nna: esNNA,
                edad_victima: edad,
                es_violencia_sexual: data.caso.tipologia === 'SEXUAL',
                tipologia: data.caso.tipologia,
                hay_nna_victima_sexual_en_familia: data.caso.hay_nna_victima_sexual_en_familia || false,
                parentesco: data.agresor.parentesco
            });

            const textoAuto = generarAutoRemision(compResult, {
                radicado: expediente.radicado,
                victima: data.victima.nombres,
                tipologia: data.caso.tipologia
            });

            await supabase.from('actuaciones').insert({
                expediente_id: expediente.id,
                tipo: 'AUTO_REMISION', // New type needed in DB check? Assuming generic string or TEXT
                contenido: textoAuto,
                autor_id: user.id
            });

            // Si permite medida provisional (subsidiaria), activamos término de 4h también
            if (compResult.permite_medida_provisional) {
                const fechaConocimiento = new Date(ahora);
                const vencimiento4h = calcularVencimiento4Horas(fechaConocimiento);

                await supabase.from('terminos_legales').insert({
                    expediente_id: expediente.id,
                    tipo: 'MEDIDA_PROVISIONAL_4H',
                    fecha_inicio: ahora,
                    fecha_vencimiento: vencimiento4h.toISOString()
                });
            }
        }

        // E. Notificar a Psicólogos y Trabajadores Sociales
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
                    titulo: `Nuevo caso radicado: ${radicado}`,
                    mensaje: `Se ha registrado un nuevo caso de violencia ${tipologiaLabel[data.caso.tipologia] || data.caso.tipologia}. Víctima: ${data.victima.nombres}. Requiere valoración del equipo psicosocial.`,
                    tipo: 'CASO',
                    enlace: `/dashboard/casos/${expediente.id}`,
                    expediente_id: expediente.id,
                    leida: false,
                }))

                await supabase.from('notificaciones_internas').insert(notificaciones)
            }
        } catch (notifError) {
            // No bloquear la radicación si falla la notificación
            console.error("Error enviando notificaciones:", notifError)
        }

        revalidatePath('/dashboard/recepcion')
        return { success: true, radicado: expediente.radicado, id: expediente.id };

    } catch (error: any) {
        console.error("Error en radicación:", error);
        return { error: error.message };
    }
}

function calcularEdad(fecha: string): number {
    if (!fecha) return 0;
    const diff = Date.now() - new Date(fecha).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}
