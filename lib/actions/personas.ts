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
    identidad_genero?: string
    estado_civil?: string
    eps?: string
    barrio?: string
    parentesco_victima?: string
}) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No autorizado')

    // Fetch current persona to preserve other demographics
    const { data: persona } = await supabase
        .from('personas')
        .select('datos_demograficos')
        .eq('id', personaId)
        .single()

    const currentDemographics = (persona?.datos_demograficos as any) || {}

    // Fields that go to the top level of the 'personas' table
    const topLevelFields = [
        'nombres', 'documento', 'telefono', 'email', 'direccion_residencia',
        'zona', 'nivel_educativo', 'grupo_etnico', 'discapacidad',
        'fecha_nacimiento', 'genero', 'alias'
    ]

    const updateData: Record<string, any> = {}
    const newDemographics: Record<string, any> = { ...currentDemographics }

    for (const [key, value] of Object.entries(data)) {
        const cleanValue = value === '' ? null : value
        if (topLevelFields.includes(key)) {
            updateData[key] = cleanValue
        } else {
            // These go into JSONB datos_demograficos
            newDemographics[key] = cleanValue
        }
    }

    if (Object.keys(newDemographics).length > 0) {
        updateData.datos_demograficos = newDemographics
    }

    const { error } = await supabase
        .from('personas')
        .update(updateData)
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

    // Fetch persona data to build folder path
    const { data: persona } = await supabase
        .from('personas')
        .select('tipo_documento, documento, datos_demograficos')
        .eq('id', personaId)
        .single()

    if (!persona) throw new Error('Persona no encontrada')

    const tipoDoc = persona.tipo_documento || 'CC'
    const documento = persona.documento || personaId
    const folderName = `${tipoDoc}_${documento}`

    const ext = file.name.split('.').pop() || 'jpg'
    const filePath = `personas/${folderName}/foto.${ext}`

    // Upload to the 'documentos' bucket inside the persona folder
    const { error: uploadError } = await supabase.storage
        .from('documentos')
        .upload(filePath, file, { upsert: true })

    if (uploadError) {
        throw new Error(`Error subiendo foto: ${uploadError.message}`)
    }

    // Get a signed URL (bucket is private) — valid for 1 year
    const { data: signedUrlData, error: signedError } = await supabase.storage
        .from('documentos')
        .createSignedUrl(filePath, 60 * 60 * 24 * 365)

    if (signedError || !signedUrlData) {
        throw new Error('Error generando URL de la foto')
    }

    // Update persona record — store path in datos_demograficos for regenerating URLs
    const currentDemographics = persona.datos_demograficos || {}
    const updatedDemographics = {
        ...(typeof currentDemographics === 'object' ? currentDemographics : {}),
        foto_url: signedUrlData.signedUrl,
        foto_storage_path: filePath
    }

    const { error: updateError } = await supabase
        .from('personas')
        .update({ datos_demograficos: updatedDemographics })
        .eq('id', personaId)

    if (updateError) {
        throw new Error(`Error actualizando foto: ${updateError.message}`)
    }

    revalidatePath(`/dashboard/personas/${personaId}`)
    revalidatePath('/dashboard/personas')
    return { success: true, url: signedUrlData.signedUrl }
}
