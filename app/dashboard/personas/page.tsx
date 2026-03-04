
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ChevronRight, ChevronLeft, UserSearch, Search, User, UserX, ArrowRight, Shield, Gavel, AlertTriangle, CheckCircle } from 'lucide-react'
import PersonasSearch from '@/components/personas-search'
import { Suspense } from 'react'

const TIPO_BADGE: Record<string, { bg: string; text: string; label: string }> = {
    VICTIMA: { bg: 'bg-blue-50 border border-blue-100', text: 'text-blue-600', label: 'Víctima' },
    AGRESOR: { bg: 'bg-red-50 border border-red-100', text: 'text-red-600', label: 'Agresor' },
}

// Risk-level top bar color
const RISK_COLOR: Record<string, string> = {
    CRITICO: 'bg-red-500',
    ALTO: 'bg-red-400',
    MODERADO: 'bg-amber-400',
    BAJO: 'bg-emerald-400',
    SIN_RIESGO: 'bg-slate-300',
}

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
        .limit(100)

    let personas = allPersonas || []

    if (searchQuery) {
        const lowerQ = searchQuery.toLowerCase()
        personas = personas.filter((p: any) =>
            p.nombres?.toLowerCase().includes(lowerQ) ||
            p.documento?.toLowerCase().includes(lowerQ)
        )
    }

    const total = personas.length

    return (
        <div className="max-w-[1440px] mx-auto animate-fade-in-up">
            <main className="flex flex-col md:flex-row gap-6">
                {/* ─── Sidebar Filters ─── */}
                <aside className="w-full md:w-56 shrink-0 flex flex-col gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-[#2B463C]/5">
                        <h3 className="text-sm font-semibold mb-3 text-[#2B463C] flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#F28C73] text-[18px]">filter_list</span>
                            Filtros
                        </h3>

                        {/* Search */}
                        <div className="mb-4">
                            <label className="block text-xs font-medium text-[#2B463C]/50 mb-1.5">Buscar Ciudadano</label>
                            <Suspense fallback={<div className="h-9 bg-slate-100 rounded-lg animate-pulse" />}>
                                <PersonasSearch />
                            </Suspense>
                        </div>

                        {/* Role filter */}
                        <div className="mb-4">
                            <h4 className="text-xs font-semibold text-[#2B463C] mb-2">Rol en Proceso</h4>
                            <div className="space-y-1.5">
                                {['Todos', 'Víctima', 'Agresor / Denunciado'].map((label) => (
                                    <label key={label} className="flex items-center gap-2.5 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            defaultChecked={label === 'Todos'}
                                            className="w-3.5 h-3.5 rounded border-[#2B463C]/15 text-[#F28C73] focus:ring-[#F28C73] bg-[#F8F5EE]"
                                        />
                                        <span className="text-xs text-[#2B463C]/70 group-hover:text-[#F28C73] transition-colors">{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Status filter */}
                        <div>
                            <h4 className="text-xs font-semibold text-[#2B463C] mb-2">Estado del Proceso</h4>
                            <div className="space-y-1.5">
                                {['Con procesos activos', 'Con medidas de protección', 'Con alerta de reincidencia'].map((label) => (
                                    <label key={label} className="flex items-center gap-2.5 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="w-3.5 h-3.5 rounded border-[#2B463C]/15 text-[#F28C73] focus:ring-[#F28C73] bg-[#F8F5EE]"
                                        />
                                        <span className="text-xs text-[#2B463C]/70 group-hover:text-[#F28C73] transition-colors">{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* ─── Main Content ─── */}
                <div className="flex-1 flex flex-col gap-5">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                        <div className="flex flex-col gap-0.5">
                            <h1 className="text-[#2B463C] text-2xl font-bold leading-tight">Directorio de Personas</h1>
                            <p className="text-[#2B463C]/40 text-sm">Gestión de {total} ciudadanos registrados</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-[#2B463C]/40">Ordenar por:</span>
                            <select className="bg-white border-none text-xs font-medium text-[#2B463C] rounded-lg focus:ring-0 py-1.5 pl-2 pr-6 cursor-pointer shadow-sm">
                                <option>Más recientes</option>
                                <option>Orden alfabético</option>
                                <option>Mayor riesgo</option>
                            </select>
                        </div>
                    </div>

                    {/* Cards Grid */}
                    {personas.length === 0 ? (
                        <div className="bg-white rounded-xl border border-[#2B463C]/5 p-12 text-center">
                            <div className="flex flex-col items-center">
                                <div className="w-14 h-14 bg-[#F8F5EE] rounded-2xl flex items-center justify-center mb-3 border border-[#2B463C]/5">
                                    {searchQuery ? <Search className="h-7 w-7 text-[#2B463C]/20" /> : <UserSearch className="h-7 w-7 text-[#2B463C]/20" />}
                                </div>
                                {searchQuery ? (
                                    <>
                                        <p className="text-[#2B463C] font-semibold mb-1">Sin coincidencias</p>
                                        <p className="text-[#2B463C]/40 text-xs">Pruebe con otra búsqueda</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-[#2B463C] font-semibold mb-1">Base de datos vacía</p>
                                        <p className="text-[#2B463C]/40 text-xs">Los intervinientes aparecerán al crear casos</p>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {personas.map((p: any) => {
                                const tipoConfig = TIPO_BADGE[p.tipo] || { bg: 'bg-slate-50', text: 'text-slate-500', label: p.tipo }
                                const initials = p.nombres?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || '??'
                                const fotoUrl = p.datos_demograficos?.foto_url
                                const riesgo = p.expediente?.nivel_riesgo || 'SIN_RIESGO'
                                const riskColor = RISK_COLOR[riesgo] || RISK_COLOR.SIN_RIESGO
                                const hasExpediente = !!p.expediente
                                const faseActiva = p.expediente?.fase_proceso

                                return (
                                    <div
                                        key={p.id}
                                        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-[#2B463C]/5 flex flex-col group relative"
                                    >
                                        {/* Risk Indicator Line */}
                                        <div className={`absolute top-0 left-0 w-full h-1 ${riskColor}`} />

                                        <div className="p-4 flex flex-col items-center text-center gap-2 relative pt-5">
                                            {/* Avatar */}
                                            <div className="w-20 h-20 rounded-full bg-[#F8F5EE] border border-[#2B463C]/5 p-1.5 mb-1">
                                                {fotoUrl ? (
                                                    <img src={fotoUrl} alt="" className="w-full h-full rounded-full object-cover" />
                                                ) : (
                                                    <div className={`w-full h-full rounded-full flex items-center justify-center text-sm font-semibold ${p.tipo === 'VICTIMA' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                                                        {initials}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Name & Document */}
                                            <div className="flex flex-col">
                                                <h3 className="text-[#2B463C] text-sm font-semibold leading-tight group-hover:text-[#F28C73] transition-colors">{p.nombres || '—'}</h3>
                                                <p className="text-[#2B463C]/35 text-[11px] font-medium mt-0.5">{p.documento || '—'}</p>
                                            </div>

                                            {/* Badges */}
                                            <div className="flex flex-wrap justify-center gap-1.5 mt-1">
                                                {hasExpediente && faseActiva && faseActiva !== 'ARCHIVADO' ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 text-[10px] font-medium border border-amber-100">
                                                        <Gavel className="w-3 h-3" />
                                                        Activo
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 text-slate-400 text-[10px] font-medium border border-slate-100">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Sin procesos
                                                    </span>
                                                )}
                                                {riesgo === 'CRITICO' || riesgo === 'ALTO' ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-50 text-red-500 text-[10px] font-medium border border-red-100">
                                                        <AlertTriangle className="w-3 h-3" />
                                                        Riesgo
                                                    </span>
                                                ) : null}
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium ${tipoConfig.bg} ${tipoConfig.text}`}>
                                                    {p.tipo === 'VICTIMA' ? <User className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                                                    {tipoConfig.label}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="mt-auto border-t border-[#2B463C]/5 bg-[#F8F5EE]/50 px-4 py-2.5 flex justify-between items-center">
                                            <span className="text-[10px] text-[#2B463C]/30 font-medium">
                                                {p.telefono || 'Sin teléfono'}
                                            </span>
                                            <Link
                                                href={`/dashboard/personas/${p.id}`}
                                                className="text-[#F28C73] hover:text-[#2B463C] transition-colors p-1 rounded-full hover:bg-[#F28C73]/10"
                                            >
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {personas.length > 0 && (
                        <div className="mt-6 flex justify-center items-center gap-1.5">
                            <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#2B463C]/5 bg-white text-[#2B463C]/30 hover:text-[#F28C73] transition-colors">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#F28C73] text-white font-medium text-xs shadow-sm">1</button>
                            <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#2B463C]/5 bg-white text-[#2B463C]/70 hover:text-[#F28C73] font-medium text-xs transition-colors">2</button>
                            <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#2B463C]/5 bg-white text-[#2B463C]/70 hover:text-[#F28C73] font-medium text-xs transition-colors">3</button>
                            <span className="text-[#2B463C]/20 px-1">...</span>
                            <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#2B463C]/5 bg-white text-[#2B463C]/30 hover:text-[#F28C73] transition-colors">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
