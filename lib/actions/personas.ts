'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function editarPersona(personaId: string, data: {
    nombres?: string
    documento?: string
    telefono?: string
    email?: string
    direccion_residencia?: string
    zona?: string
    nivel_educativo?: string
    grupo_etnico?: string
    discapacidad?: boolean
    fecha_nacimiento?: string
    genero?: string
}) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No autorizado')

    // Clean empty strings to null
    const cleanData: Record<string, any> = {}
    for (const [key, value] of Object.entries(data)) {
        if (value !== undefined) {
            cleanData[key] = value === '' ? null : value
        }
    }

    const { error } = await supabase
        .from('personas')
        .update(cleanData)
        .eq('id', personaId)

    if (error) throw new Error(`Error actualizando persona: ${error.message}`)

    revalidatePath('/dashboard/personas')
    revalidatePath(`/dashboard/personas/${personaId}`)
    return { success: true }
}

export async function subirFotoPersona(personaId: string, formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No autorizado')

    const file = formData.get('foto') as File
    if (!file || file.size === 0) throw new Error('No se seleccionó un archivo')

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
        throw new Error('Solo se permiten imágenes JPG, PNG o WebP')
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
        throw new Error('La imagen no debe superar 5MB')
    }

    const ext = file.name.split('.').pop() || 'jpg'
    const filePath = `${personaId}.${ext}`

    // Upload to storage
    const { error: uploadError } = await supabase.storage
        .from('personas-fotos')
        .upload(filePath, file, { upsert: true })

    if (uploadError) {
        throw new Error(`Error subiendo foto: ${uploadError.message}`)
    }

    // Get public URL
    const { data: urlData } = supabase.storage
        .from('personas-fotos')
        .getPublicUrl(filePath)

    // Update persona record — store in datos_demograficos.foto_url
    const { data: persona } = await supabase
        .from('personas')
        .select('datos_demograficos')
        .eq('id', personaId)
        .single()

    const currentDemographics = persona?.datos_demograficos || {}
    const updatedDemographics = {
        ...(typeof currentDemographics === 'object' ? currentDemographics : {}),
        foto_url: urlData.publicUrl
    }

    const { error: updateError } = await supabase
        .from('personas')
        .update({ datos_demograficos: updatedDemographics })
        .eq('id', personaId)

    if (updateError) {
        throw new Error(`Error actualizando foto: ${updateError.message}`)
    }

    revalidatePath(`/dashboard/personas/${personaId}`)
    return { success: true, url: urlData.publicUrl }
}
