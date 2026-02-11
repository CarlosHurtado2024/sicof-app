
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const MinutaSchema = z.object({
    nombre_visitante: z.string().min(3, "El nombre es requerido"),
    documento_visitante: z.string().optional(),
    telefono_contacto: z.string().optional(),
    motivo_visita: z.enum(['ORIENTACION', 'DENUNCIA', 'SEGUIMIENTO', 'AUDIENCIA', 'OTRO']),
    observaciones: z.string().optional(),
})

export async function crearMinuta(formData: FormData) {
    const supabase = await createClient()

    // 1. Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('No autorizado')
    }

    // 2. Validate form data
    const rawData = {
        nombre_visitante: formData.get('nombre_visitante'),
        documento_visitante: formData.get('documento_visitante'),
        telefono_contacto: formData.get('telefono_contacto'),
        motivo_visita: formData.get('motivo_visita'),
        observaciones: formData.get('observaciones'),
    }

    const validatedData = MinutaSchema.safeParse(rawData)

    if (!validatedData.success) {
        return { error: 'Datos inválidos', fields: validatedData.error.flatten().fieldErrors }
    }

    // 3. Insert into DB
    const { error } = await supabase
        .from('minutas')
        .insert({
            ...validatedData.data,
            funcionario_id: user.id,
            fecha_hora_ingreso: new Date().toISOString()
        })

    if (error) {
        console.error("Error creating minuta:", error)
        return { error: 'Error al guardar la minuta' }
    }

    revalidatePath('/dashboard/recepcion')
    redirect('/dashboard/recepcion')
}
