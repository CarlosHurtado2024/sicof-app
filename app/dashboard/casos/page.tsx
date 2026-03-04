
import { createClient } from '@/lib/supabase/server'
import ExpedientesViewManager from '@/components/expedientes-view-manager'

interface PageProps {
    searchParams: Promise<{ q?: string }>
}

export default async function CasosListPage({ searchParams }: PageProps) {
    const { q } = await searchParams
    const supabase = await createClient()
    const searchQuery = q?.trim() || ''

    const { data: allExpedientes } = await supabase
        .from('expedientes')
        .select(`
            *,
            personas (id, tipo, nombres, documento, telefono)
        `)
        .order('created_at', { ascending: false })
        .limit(100)

    const expedientes = allExpedientes || []

    return <ExpedientesViewManager expedientes={expedientes} searchQuery={searchQuery} />
}
