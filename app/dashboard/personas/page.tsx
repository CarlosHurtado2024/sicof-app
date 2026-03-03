
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronRight, UserSearch, Eye, Search, User, UserX, Phone } from 'lucide-react'
import PersonasSearch from '@/components/personas-search'
import { Suspense } from 'react'

const TIPO_BADGE: Record<string, { bg: string; text: string; label: string }> = {
    VICTIMA: { bg: 'bg-purple-500/10 border border-purple-500/20', text: 'text-purple-300', label: 'Víctima' },
    AGRESOR: { bg: 'bg-red-500/10 border border-red-500/20', text: 'text-red-300', label: 'Agresor' },
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
                <div className="flex items-center space-x-2 text-white/40 text-sm mb-3 font-medium">
                    <span>Inicio</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span className="text-purple-300">Personas</span>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white/90 flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-xl">
                                <UserSearch className="h-5 w-5 text-purple-300" />
                            </div>
                            Personas Registradas
                        </h1>
                        <p className="text-white/50 text-sm mt-1 ml-12">Directorio de víctimas y agresores vinculados a expedientes</p>
                    </div>
                </div>
            </div>

            {/* Search + Stats */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Suspense fallback={<div className="flex-1 max-w-md h-10 bg-white/10 rounded-xl animate-pulse" />}>
                    <PersonasSearch />
                </Suspense>
                <div className="flex items-center gap-2 text-sm text-white/50 flex-shrink-0">
                    <span className="font-bold text-white/90">{total}</span>
                    {searchQuery ? (
                        <span>resultados para "<span className="font-medium text-white/90">{searchQuery}</span>"</span>
                    ) : (
                        <span>personas registradas</span>
                    )}
                </div>
            </div>

            {/* Table Card */}
            <Card className="border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.3)] rounded-xl overflow-hidden bg-white/[0.02] backdrop-blur-3xl">
                <CardContent className="p-0">
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-white/[0.03] backdrop-blur-xl border-b border-white/10">
                                    <th className="text-left px-5 py-3.5 font-semibold text-white/50 text-xs uppercase tracking-wider">Nombre</th>
                                    <th className="text-left px-5 py-3.5 font-semibold text-white/50 text-xs uppercase tracking-wider">Documento</th>
                                    <th className="text-left px-5 py-3.5 font-semibold text-white/50 text-xs uppercase tracking-wider">Tipo</th>
                                    <th className="text-left px-5 py-3.5 font-semibold text-white/50 text-xs uppercase tracking-wider">Expediente</th>
                                    <th className="text-left px-5 py-3.5 font-semibold text-white/50 text-xs uppercase tracking-wider">Teléfono</th>
                                    <th className="text-right px-5 py-3.5 font-semibold text-white/50 text-xs uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {personas.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-16 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-3">
                                                    {searchQuery ? <Search className="h-6 w-6 text-white/30" /> : <UserSearch className="h-6 w-6 text-white/30" />}
                                                </div>
                                                {searchQuery ? (
                                                    <>
                                                        <p className="text-white/50 font-medium mb-1">No se encontraron personas</p>
                                                        <p className="text-white/40 text-xs">Intenta con otro nombre o número de documento</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p className="text-white/50 font-medium mb-1">No hay personas registradas</p>
                                                        <p className="text-white/40 text-xs">Las personas vinculadas a casos aparecerán aquí</p>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    personas.map((p: any) => {
                                        const tipoConfig = TIPO_BADGE[p.tipo] || { bg: 'bg-white/5', text: 'text-white/70', label: p.tipo }
                                        const initials = p.nombres?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || '??'
                                        const fotoUrl = p.datos_demograficos?.foto_url
                                        return (
                                            <tr key={p.id} className="hover:bg-slate-100/30 transition-colors group">
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {fotoUrl ? (
                                                            <img src={fotoUrl} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-2 ring-slate-100" />
                                                        ) : (
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${p.tipo === 'VICTIMA' ? 'bg-purple-100 text-purple-600' : 'bg-red-100 text-red-600'}`}>
                                                                {initials}
                                                            </div>
                                                        )}
                                                        <span className="font-semibold text-white/90 text-sm truncate">{p.nombres || '—'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="font-mono text-xs text-white/70">{p.documento || '—'}</span>
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
                                                            <span className="font-mono font-bold text-purple-300 text-xs bg-white/10 px-2.5 py-1 rounded-md hover:bg-white/10 transition-colors">
                                                                {p.expediente.radicado}
                                                            </span>
                                                        </Link>
                                                    ) : (
                                                        <span className="text-xs text-white/40">—</span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="text-xs text-white/70">{p.telefono || '—'}</span>
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    <Link href={`/dashboard/personas/${p.id}`}>
                                                        <Button variant="ghost" size="sm" className="gap-1.5 text-purple-300 hover:text-white hover:bg-white/10 rounded-lg font-semibold text-xs">
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
                    <div className="md:hidden divide-y divide-white/5">
                        {personas.length === 0 ? (
                            <div className="px-4 py-12 text-center">
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-3">
                                        {searchQuery ? <Search className="h-6 w-6 text-white/30" /> : <UserSearch className="h-6 w-6 text-white/30" />}
                                    </div>
                                    {searchQuery ? (
                                        <>
                                            <p className="text-white/50 font-medium mb-1">No se encontraron personas</p>
                                            <p className="text-white/40 text-xs">Intenta con otro nombre o documento</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-white/50 font-medium mb-1">No hay personas registradas</p>
                                            <p className="text-white/40 text-xs">Las personas vinculadas a casos aparecerán aquí</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            personas.map((p: any) => {
                                const tipoConfig = TIPO_BADGE[p.tipo] || { bg: 'bg-white/5', text: 'text-white/70', label: p.tipo }
                                const initials = p.nombres?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || '??'
                                const fotoUrl = p.datos_demograficos?.foto_url
                                return (
                                    <Link key={p.id} href={`/dashboard/personas/${p.id}`} className="block">
                                        <div className="p-4 hover:bg-slate-100/30 transition-colors active:bg-white/10">
                                            <div className="flex items-center gap-3 mb-2">
                                                {fotoUrl ? (
                                                    <img src={fotoUrl} alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100" />
                                                ) : (
                                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold ${p.tipo === 'VICTIMA' ? 'bg-purple-100 text-purple-600' : 'bg-red-100 text-red-600'}`}>
                                                        {initials}
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-white/90 text-sm truncate">{p.nombres || '—'}</p>
                                                    <p className="text-[11px] text-white/40 font-mono">{p.documento || '—'}</p>
                                                </div>
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${tipoConfig.bg} ${tipoConfig.text}`}>
                                                    {tipoConfig.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-[11px] text-white/50 ml-12">
                                                {p.expediente && (
                                                    <span className="font-mono text-purple-300 font-bold">{p.expediente.radicado}</span>
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
