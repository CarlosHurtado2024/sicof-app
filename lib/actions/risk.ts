
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { RiskChecklist, calcularNivelRiesgo, RiesgoNivel } from '@/lib/risk-logic'

export async function guardarValoracionRiesgo(expedienteId: string, checklist: RiskChecklist, observaciones: string) {
    const supabase = await createClient()

    // 1. Get User
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("No autorizado")

    // 2. Calcular Riesgo
    const nivelRiesgo = calcularNivelRiesgo(checklist);

    try {
        // 3. Insertar Valoración
        const { error: valError } = await supabase.from('valoraciones_riesgo').insert({
            expediente_id: expedienteId,
            funcionario_id: user.id,
            respuestas_checklist: checklist,
            nivel_riesgo_calculado: nivelRiesgo,
            recomendacion_medidas: observaciones
        });

        if (valError) throw new Error(`Error guardando valoración: ${valError.message}`);

        // 4. Actualizar Expediente
        const { error: expError } = await supabase
            .from('expedientes')
            .update({ nivel_riesgo: nivelRiesgo })
            .eq('id', expedienteId);

        if (expError) throw new Error(`Error actualizando expediente: ${expError.message}`);

        revalidatePath(`/dashboard/casos/${expedienteId}`)
        return { success: true, nivel: nivelRiesgo };

    } catch (error: any) {
        console.error("Error en valoración:", error);
        return { error: error.message };
    }
}
