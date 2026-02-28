'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search, X, Loader2 } from 'lucide-react'

export default function ExpedientesSearch() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const [query, setQuery] = useState(searchParams.get('q') || '')
    const inputRef = useRef<HTMLInputElement>(null)
    const debounceRef = useRef<NodeJS.Timeout | null>(null)

    // Sync from URL
    useEffect(() => {
        setQuery(searchParams.get('q') || '')
    }, [searchParams])

    function handleSearch(value: string) {
        setQuery(value)

        // Debounce search
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            startTransition(() => {
                const params = new URLSearchParams(searchParams.toString())
                if (value.trim()) {
                    params.set('q', value.trim())
                } else {
                    params.delete('q')
                }
                router.replace(`${pathname}?${params.toString()}`, { scroll: false })
            })
        }, 350)
    }

    function handleClear() {
        setQuery('')
        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString())
            params.delete('q')
            router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        })
        inputRef.current?.focus()
    }

    return (
        <div className="relative flex-1 max-w-md">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Buscar por nombre o documento..."
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 placeholder:text-slate-400 transition-all"
                    aria-label="Buscar expedientes por nombre o documento"
                />
                {/* Loading / Clear */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isPending ? (
                        <Loader2 className="h-4 w-4 text-violet-500 animate-spin" />
                    ) : query ? (
                        <button
                            onClick={handleClear}
                            className="p-0.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            aria-label="Limpiar búsqueda"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    )
}
