
import { createClient } from '@/lib/supabase/server'
import { ReceptionDashboard } from '@/components/module-recepcion/reception-dashboard'

export const dynamic = 'force-dynamic'

export default async function ReceptionPage() {
    const supabase = await createClient()
    const today = new Date().toISOString().split('T')[0]

    // 1. Fetch Minutas Today
    const { data: minutas } = await supabase
        .from('minutas')
        .select(`
            id, 
            fecha_hora_ingreso, 
            nombre_visitante, 
            documento_visitante, 
            motivo_visita, 
            observaciones,
            fecha_hora_salida,
            funcionario:usuarios(nombre)
        `)
        .gte('fecha_hora_ingreso', `${today}T00:00:00`)
        .order('fecha_hora_ingreso', { ascending: false })
        .limit(50)

    // 2. Fetch KPIs
    // Total today
    const totalHoy = minutas?.length || 0

    // Active (no salida)
    const enAtencion = minutas?.filter((m: any) => !m.fecha_hora_salida).length || 0

    // Crisis (check observations for flag)
    const crisisHoy = minutas?.filter((m: any) =>
        m.observaciones?.includes('ATENCIÓN EN CRISIS')
    ).length || 0

    // Radicados today (Expedientes)
    const { count: radicadosHoy } = await supabase
        .from('expedientes')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00`)

    // Sanitize minutas
    const formattedMinutas = (minutas || []).map((m: any) => ({
        ...m,
        funcionario: Array.isArray(m.funcionario) ? m.funcionario[0] : m.funcionario
    }))

    return (
        <ReceptionDashboard
            initialMinutas={formattedMinutas}
            kpis={{
                totalHoy,
                enAtencion,
                crisisHoy,
                radicadosHoy: radicadosHoy || 0
            }}
        />
    )
}
