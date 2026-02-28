
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronRight, UserSearch, Eye, Search, User, UserX, Phone } from 'lucide-react'
import PersonasSearch from '@/components/personas-search'
import { Suspense } from 'react'

const TIPO_BADGE: Record<string, { bg: string; text: string; label: string }> = {
    VICTIMA: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Víctima' },
    AGRESOR: { bg: 'bg-red-50', text: 'text-red-700', label: 'Agresor' },
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
            expediente:expedientes(id, radicado)
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
        <div className="space-y-6 max-w-[1400px] mx-auto">
            {/* Breadcrumb + Header */}
            <div>
                <div className="flex items-center space-x-2 text-slate-400 text-sm mb-3 font-medium">
                    <span>Inicio</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span className="text-[#7C3AED]">Personas</span>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-3">
                            <div className="p-2 bg-violet-50 rounded-xl">
                                <UserSearch className="h-5 w-5 text-[#7C3AED]" />
                            </div>
                            Personas Registradas
                        </h1>
                        <p className="text-slate-500 text-sm mt-1 ml-12">Directorio de víctimas y agresores vinculados a expedientes</p>
                    </div>
                </div>
            </div>

            {/* Search + Stats */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Suspense fallback={<div className="flex-1 max-w-md h-10 bg-slate-100 rounded-xl animate-pulse" />}>
                    <PersonasSearch />
                </Suspense>
                <div className="flex items-center gap-2 text-sm text-slate-500 flex-shrink-0">
                    <span className="font-bold text-slate-800">{total}</span>
                    {searchQuery ? (
                        <span>resultados para "<span className="font-medium text-violet-600">{searchQuery}</span>"</span>
                    ) : (
                        <span>personas registradas</span>
                    )}
                </div>
            </div>

            {/* Table Card */}
            <Card className="border border-slate-100 shadow-sm rounded-xl overflow-hidden">
                <CardContent className="p-0">
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-100">
                                    <th className="text-left px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">Nombre</th>
                                    <th className="text-left px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">Documento</th>
                                    <th className="text-left px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">Tipo</th>
                                    <th className="text-left px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">Expediente</th>
                                    <th className="text-left px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">Teléfono</th>
                                    <th className="text-right px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {personas.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-16 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
                                                    {searchQuery ? <Search className="h-6 w-6 text-slate-300" /> : <UserSearch className="h-6 w-6 text-slate-300" />}
                                                </div>
                                                {searchQuery ? (
                                                    <>
                                                        <p className="text-slate-500 font-medium mb-1">No se encontraron personas</p>
                                                        <p className="text-slate-400 text-xs">Intenta con otro nombre o número de documento</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p className="text-slate-500 font-medium mb-1">No hay personas registradas</p>
                                                        <p className="text-slate-400 text-xs">Las personas vinculadas a casos aparecerán aquí</p>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    personas.map((p: any) => {
                                        const tipoConfig = TIPO_BADGE[p.tipo] || { bg: 'bg-slate-50', text: 'text-slate-600', label: p.tipo }
                                        const initials = p.nombres?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || '??'
                                        const fotoUrl = p.datos_demograficos?.foto_url
                                        return (
                                            <tr key={p.id} className="hover:bg-violet-50/30 transition-colors group">
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {fotoUrl ? (
                                                            <img src={fotoUrl} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-2 ring-slate-100" />
                                                        ) : (
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${p.tipo === 'VICTIMA' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                                                                {initials}
                                                            </div>
                                                        )}
                                                        <span className="font-semibold text-slate-800 text-sm truncate">{p.nombres || '—'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="font-mono text-xs text-slate-600">{p.documento || '—'}</span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold ${tipoConfig.bg} ${tipoConfig.text}`}>
                                                        {p.tipo === 'VICTIMA' ? <User className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
                                                        {tipoConfig.label}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    {p.expediente ? (
                                                        <Link href={`/dashboard/casos/${p.expediente.id}`}>
                                                            <span className="font-mono font-bold text-[#7C3AED] text-xs bg-violet-50 px-2.5 py-1 rounded-md hover:bg-violet-100 transition-colors">
                                                                {p.expediente.radicado}
                                                            </span>
                                                        </Link>
                                                    ) : (
                                                        <span className="text-xs text-slate-400">—</span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="text-xs text-slate-600">{p.telefono || '—'}</span>
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    <Link href={`/dashboard/personas/${p.id}`}>
                                                        <Button variant="ghost" size="sm" className="gap-1.5 text-[#7C3AED] hover:text-[#6D28D9] hover:bg-violet-50 rounded-lg font-semibold text-xs">
                                                            <Eye size={14} />
                                                            Ver
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-slate-100">
                        {personas.length === 0 ? (
                            <div className="px-4 py-12 text-center">
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
                                        {searchQuery ? <Search className="h-6 w-6 text-slate-300" /> : <UserSearch className="h-6 w-6 text-slate-300" />}
                                    </div>
                                    {searchQuery ? (
                                        <>
                                            <p className="text-slate-500 font-medium mb-1">No se encontraron personas</p>
                                            <p className="text-slate-400 text-xs">Intenta con otro nombre o documento</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-slate-500 font-medium mb-1">No hay personas registradas</p>
                                            <p className="text-slate-400 text-xs">Las personas vinculadas a casos aparecerán aquí</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            personas.map((p: any) => {
                                const tipoConfig = TIPO_BADGE[p.tipo] || { bg: 'bg-slate-50', text: 'text-slate-600', label: p.tipo }
                                const initials = p.nombres?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || '??'
                                const fotoUrl = p.datos_demograficos?.foto_url
                                return (
                                    <Link key={p.id} href={`/dashboard/personas/${p.id}`} className="block">
                                        <div className="p-4 hover:bg-violet-50/30 transition-colors active:bg-violet-50">
                                            <div className="flex items-center gap-3 mb-2">
                                                {fotoUrl ? (
                                                    <img src={fotoUrl} alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100" />
                                                ) : (
                                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold ${p.tipo === 'VICTIMA' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                                                        {initials}
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-slate-800 text-sm truncate">{p.nombres || '—'}</p>
                                                    <p className="text-[11px] text-slate-400 font-mono">{p.documento || '—'}</p>
                                                </div>
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${tipoConfig.bg} ${tipoConfig.text}`}>
                                                    {tipoConfig.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-[11px] text-slate-500 ml-12">
                                                {p.expediente && (
                                                    <span className="font-mono text-[#7C3AED] font-bold">{p.expediente.radicado}</span>
                                                )}
                                                {p.telefono && (
                                                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{p.telefono}</span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
