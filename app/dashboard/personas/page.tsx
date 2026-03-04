
import { createClient } from '@/lib/supabase/server'
import PersonasViewManager from '@/components/personas-view-manager'

interface PageProps {
    searchParams: Promise<{ q?: string }>
}

export default async function PersonasListPage({ searchParams }: PageProps) {
    const { q } = await searchParams
    const supabase = await createClient()
    const searchQuery = q?.trim() || ''

    const { data: allPersonas } = await supabase
        .from('personas')
        .select(`
            id, nombres, documento, tipo, telefono, genero, datos_demograficos,
            expediente:expedientes(id, radicado, nivel_riesgo, fase_proceso)
        `)
        .order('created_at', { ascending: false })
        .limit(200)

    const personas = (allPersonas || []).map(p => ({
        ...p,
        expediente: Array.isArray(p.expediente) ? p.expediente[0] || null : (p.expediente || null)
    })) as any

    return <PersonasViewManager personas={personas} searchQuery={searchQuery} />
}
