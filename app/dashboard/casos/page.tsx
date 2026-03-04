
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircle, Eye, ChevronRight, FolderHeart, Search, Filter, ArrowUpDown } from 'lucide-react'
import { FASES_INFO, type FaseProceso } from '@/lib/case-workflow'
import ExpedientesSearch from '@/components/expedientes-search'
import { Suspense } from 'react'
import CasosViewManager from '@/components/casos-view-manager'

const RIESGO_CONFIG: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    SIN_RIESGO: { bg: 'bg-gray-50 border border-gray-100', text: 'text-gray-400', dot: 'bg-gray-200', label: 'Sin Riesgo' },
    BAJO: { bg: 'bg-emerald-50 border border-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Bajo' },
    MODERADO: { bg: 'bg-amber-50 border border-amber-100', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Moderado' },
    ALTO: { bg: 'bg-[#F28C73]/10 border border-[#F28C73]/20', text: 'text-[#D96C53]', dot: 'bg-[#F28C73]', label: 'Alto' },
    CRITICO: { bg: 'bg-red-50 border border-red-100', text: 'text-red-700', dot: 'bg-red-500', label: 'Crítico' },
}

const FASE_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
    RECEPCION: { bg: 'bg-gray-50 border border-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
    VALORACION: { bg: 'bg-[#F28C73]/5 border border-[#F28C73]/10', text: 'text-[#F28C73]', dot: 'bg-[#F28C73]' },
    MEDIDAS: { bg: 'bg-amber-50 border border-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
    SEGUIMIENTO: { bg: 'bg-emerald-50 border border-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    CIERRE: { bg: 'bg-gray-50', text: 'text-gray-400', dot: 'bg-gray-200' },
}

interface PageProps {
    searchParams: Promise<{ q?: string }>
}

export default async function CasosListPage({ searchParams }: PageProps) {
    const { q } = await searchParams
    const supabase = await createClient()
    const searchQuery = q?.trim() || ''

    // Build the query
    let query = supabase
        .from('expedientes')
        .select(`
            *,
            personas (id, tipo, nombres, documento)
        `)
        .order('created_at', { ascending: false })
        .limit(50)

    const { data: allExpedientes } = await query

    // Filter on the client side after fetching (since we need to search across the `personas` relation)
    let expedientes = allExpedientes || []

    if (searchQuery) {
        const lowerQ = searchQuery.toLowerCase()
        expedientes = expedientes.filter((exp: any) => {
            // Search in radicado
            if (exp.radicado?.toLowerCase().includes(lowerQ)) return true

            // Search in personas (names and documents)
            if (exp.personas?.some((p: any) =>
                p.nombres?.toLowerCase().includes(lowerQ) ||
                p.documento?.toLowerCase().includes(lowerQ)
            )) return true

            return false
        })
    }

    const total = expedientes?.length || 0

    return (
        <div className="max-w-[1600px] mx-auto pb-20 px-4 sm:px-8 animate-fade-in-up">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-[#2B463C]/30 text-[10px] mb-8 font-black uppercase tracking-[0.3em]">
                <Link href="/dashboard" className="hover:text-[#F28C73] transition-colors">Panel Control</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-[#F28C73]">Expedientes Vigentes</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-5">
                    <div className="hidden sm:flex w-14 h-14 bg-white border border-[#2B463C]/10 rounded-2xl items-center justify-center shadow-sm">
                        <FolderHeart className="h-6 w-6 text-[#F28C73]" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-[#2B463C] tracking-tight uppercase leading-none mb-2">
                            Gestión Integral
                        </h1>
                        <p className="text-[#2B463C]/40 text-[9px] font-black uppercase tracking-[0.2em]">
                            Ruta de Atención Integral (Ley 1257) • {total} expedientes
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-white/40 backdrop-blur-md p-1.5 rounded-2xl border border-white shadow-sm">
                    <div className="px-2">
                        <ExpedientesSearch />
                    </div>
                    <Link href="/dashboard/recepcion">
                        <Button className="bg-[#2B463C] text-white hover:bg-[#F28C73] h-11 px-6 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-[#2B463C]/10 transition-all hover:scale-105 active:scale-95 group">
                            <PlusCircle className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
                            Nueva Radicación
                        </Button>
                    </Link>
                </div>
            </div>

            {/* View Manager Handles Toggling between Folders and Tables */}
            <CasosViewManager
                expedientes={expedientes}
                FASE_CONFIG={FASE_CONFIG}
                RIESGO_CONFIG={RIESGO_CONFIG}
            />
        </div>

    )
}
