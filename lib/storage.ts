
import { createClient } from '@/lib/supabase/client'

const BUCKET = 'documentos'

// ─── Helpers para construir rutas ──────────────────────────────

/**
 * Construye la ruta de carpeta para una persona.
 * Formato: personas/{TIPO_DOC}_{NUMERO}
 */
export function getPersonaFolderPath(tipoDocumento: string, documento: string): string {
    return `personas/${tipoDocumento}_${documento}`
}

/**
 * Construye la ruta de carpeta para un expediente.
 * Formato: casos/{ID_EXPEDIENTE}
 */
export function getCasoFolderPath(expedienteId: string): string {
    return `casos/${expedienteId}`
}

// ─── Subir archivo ─────────────────────────────────────────────

interface UploadResult {
    success: boolean
    path?: string
    url?: string
    error?: string
}

/**
 * Sube un archivo al bucket de documentos.
 * @param file - El archivo a subir
 * @param folderPath - Ruta de la carpeta (ej: "casos/uuid-id" o "personas/CC_12345")
 * @param fileName - Nombre personalizado (opcional, usa el nombre original si no se da)
 */
export async function uploadDocumento(
    file: File,
    folderPath: string,
    fileName?: string
): Promise<UploadResult> {
    const supabase = createClient()
    const finalName = fileName || file.name
    const filePath = `${folderPath}/${finalName}`

    const { data, error } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        })

    if (error) {
        return { success: false, error: error.message }
    }

    // Obtener URL firmada (válida por 1 hora)
    const { data: urlData } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(data.path, 3600)

    return {
        success: true,
        path: data.path,
        url: urlData?.signedUrl
    }
}

// ─── Listar archivos de una carpeta ────────────────────────────

export interface DocumentoInfo {
    name: string
    path: string
    size: number | undefined
    createdAt: string | undefined
    mimeType: string | undefined
}

/**
 * Lista todos los archivos en una carpeta del bucket.
 */
export async function listarDocumentos(folderPath: string): Promise<DocumentoInfo[]> {
    const supabase = createClient()

    const { data, error } = await supabase.storage
        .from(BUCKET)
        .list(folderPath, {
            sortBy: { column: 'created_at', order: 'desc' }
        })

    if (error || !data) return []

    return data
        .filter(f => f.name !== '.emptyFolderPlaceholder')
        .map(f => ({
            name: f.name,
            path: `${folderPath}/${f.name}`,
            size: f.metadata?.size,
            createdAt: f.created_at,
            mimeType: f.metadata?.mimetype
        }))
}

// ─── Obtener URL firmada ───────────────────────────────────────

/**
 * Genera una URL firmada para descargar/visualizar un archivo.
 * @param path - Ruta completa del archivo
 * @param expiresIn - Segundos de validez (default 1 hora)
 */
export async function getSignedUrl(path: string, expiresIn = 3600): Promise<string | null> {
    const supabase = createClient()

    const { data, error } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(path, expiresIn)

    if (error) return null
    return data.signedUrl
}

// ─── Eliminar archivo ──────────────────────────────────────────

/**
 * Elimina uno o más archivos del bucket.
 */
export async function eliminarDocumentos(paths: string[]): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient()

    const { error } = await supabase.storage
        .from(BUCKET)
        .remove(paths)

    if (error) return { success: false, error: error.message }
    return { success: true }
}

// ─── Subir documento a caso ────────────────────────────────────

/**
 * Sube un documento directamente a la carpeta de un caso.
 * Convenience wrapper.
 */
export async function uploadDocumentoCaso(
    expedienteId: string,
    file: File,
    tipoDocumento?: string
): Promise<UploadResult> {
    const folder = getCasoFolderPath(expedienteId)
    const prefix = tipoDocumento ? `${tipoDocumento}_` : ''
    const fileName = `${prefix}${Date.now()}_${file.name}`
    return uploadDocumento(file, folder, fileName)
}

/**
 * Sube un documento directamente a la carpeta de una persona.
 * Convenience wrapper.
 */
export async function uploadDocumentoPersona(
    tipoDoc: string,
    documento: string,
    file: File,
    tipoArchivo?: string
): Promise<UploadResult> {
    const folder = getPersonaFolderPath(tipoDoc, documento)
    const prefix = tipoArchivo ? `${tipoArchivo}_` : ''
    const fileName = `${prefix}${Date.now()}_${file.name}`
    return uploadDocumento(file, folder, fileName)
}
