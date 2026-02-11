
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { calcularVencimiento4Horas, calcularVencimientoAudiencia } from '@/lib/deadline-logic'

// Definición de esquemas de validación
const TriageSchema = z.object({
    // Víctima
    victima: z.object({
        nombres: z.string().min(3),
        documento: z.string().min(5),
        tipo_documento: z.enum(['CC', 'TI', 'CE', 'PASAPORTE', 'PPT']),
        fecha_nacimiento: z.string(),
        genero: z.enum(['MASCULINO', 'FEMENINO', 'TRANS', 'NO_BINARIO', 'OTRO']),
        direccion: z.string().min(5),
        zona: z.enum(['URBANA', 'RURAL']),
        telefono: z.string().optional(),
        email: z.string().email().optional().or(z.literal('')),
        nivel_educativo: z.enum(['PRIMARIA', 'SECUNDARIA', 'TECNICO', 'PROFESIONAL', 'NINGUNO']),
        grupo_etnico: z.enum(['INDIGENA', 'AFRODESCENDIENTE', 'RAIZAL', 'ROM', 'NINGUNO']).optional(),
        discapacidad: z.boolean().default(false),
        es_victima_conflicto: z.boolean().default(false)
    }),
    // Agresor
    agresor: z.object({
        nombres: z.string().min(3),
        documento: z.string().optional().or(z.literal('')),
        alias: z.string().optional(),
        genero: z.enum(['MASCULINO', 'FEMENINO', 'OTRO']).optional(),
        direccion: z.string().optional(),
        telefono: z.string().optional(),
        acceso_armas: z.boolean().default(false)
    }),
    // Caso
    caso: z.object({
        hechos_relato: z.string().min(20, "El relato debe ser detallado"),
        tipologia: z.enum(['FISICA', 'PSICOLOGICA', 'SEXUAL', 'ECONOMICA', 'PATRIMONIAL']),
        ambito: z.enum(['FAMILIAR', 'NO_FAMILIAR']),
        fecha_hechos: z.string(),
        lugar_hechos: z.string().min(3),
        es_competencia: z.boolean()
    })
})

export async function radicarCaso(data: z.infer<typeof TriageSchema>) {
    const supabase = await createClient()

    // 1. Get User
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("No autorizado")

    try {
        // A. Crear Expediente (Radicado) — Inicia en FASE 1: RECEPCION
        const year = new Date().getFullYear();
        const radicado = `COM-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
        const ahora = new Date().toISOString();

        const { data: expediente, error: expError } = await supabase
            .from('expedientes')
            .insert({
                radicado: radicado,
                estado: 'TRAMITE',
                fase_proceso: 'RECEPCION', // ← Nueva: Fase 1
                nivel_riesgo: 'BAJO',
                hechos_relato: data.caso.hechos_relato,
                tipologia_violencia: data.caso.tipologia,
                fecha_hechos: data.caso.fecha_hechos,
                lugar_hechos: data.caso.lugar_hechos,
                es_competencia: data.caso.es_competencia,
                fecha_conocimiento_hechos: ahora, // ← Nueva: para alertas de 4h
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
            tipo_documento: data.victima.tipo_documento,
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
                ocupacion: 'NO REGISTRA',
                regimen_salud: 'NO REGISTRA'
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
            acceso_armas: data.agresor.acceso_armas
        });

        if (agrError) throw new Error(`Error creando agresor: ${agrError.message}`);

        // D. Auto de Avocamiento (Actuación automática — Fase 1)
        await supabase.from('actuaciones').insert({
            expediente_id: expediente.id,
            tipo: 'AUTO_AVOCAMIENTO',
            contenido: `Auto que avoca conocimiento del caso ${radicado}. Se ordena iniciar trámite de medida de protección por presunta violencia intrafamiliar de tipo ${data.caso.tipologia}.`,
            autor_id: user.id
        });

        // E. Crear Término Legal: Medida Provisional en 4 horas (Art. 17 Ley 2126)
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

        return { success: true, radicado: expediente.radicado, id: expediente.id };

    } catch (error: any) {
        console.error("Error en radicación:", error);
        return { error: error.message };
    }
}
