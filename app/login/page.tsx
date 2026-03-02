'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { AlertCircle, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react'
import { SicofLogoIcon } from '@/components/sicof-logo'
import Link from 'next/link'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [mounted, setMounted] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            router.push('/dashboard')
            router.refresh()
        }
    }

    return (
        <div className="font-[Inter,system-ui,sans-serif] min-h-[100svh] flex flex-col antialiased bg-[#0B1628] selection:bg-cyan-400/20 selection:text-white">

            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Subtle radial gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(59,130,246,0.08),transparent)]" />
                {/* Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:48px_48px]" />
            </div>

            {/* Content */}
            <main className="flex-grow flex items-center justify-center px-4 py-8 relative z-10">
                <div
                    className={`w-full max-w-[400px] transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}
                >
                    {/* Back link */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors font-medium mb-8 group"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                        Volver
                    </Link>

                    {/* Logo & Title */}
                    <div className="text-center mb-8">
                        <div className={`transition-all duration-700 delay-100 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-5">
                                <SicofLogoIcon className="w-10 h-10" inverted={true} />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
                            Bienvenido
                        </h1>
                        <p className="text-sm text-slate-500">
                            Ingresa a tu cuenta de Komi
                        </p>
                    </div>

                    {/* Form */}
                    <form className="space-y-4" onSubmit={handleLogin}>
                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-slate-400" htmlFor="email">
                                Correo electrónico
                            </label>
                            <input
                                className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all text-sm"
                                id="email"
                                name="email"
                                placeholder="nombre@entidad.gov.co"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-medium text-slate-400" htmlFor="password">
                                    Contraseña
                                </label>
                                <a className="text-xs font-medium text-slate-500 hover:text-cyan-400 transition-colors" href="#">
                                    ¿Olvidaste tu contraseña?
                                </a>
                            </div>
                            <div className="relative">
                                <input
                                    className="block w-full px-4 py-3 pr-11 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all text-sm"
                                    id="password"
                                    name="password"
                                    placeholder="•••••••••"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-600 hover:text-slate-400 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword
                                        ? <EyeOff className="h-[18px] w-[18px]" />
                                        : <Eye className="h-[18px] w-[18px]" />
                                    }
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="flex items-center text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl gap-2.5">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                <span className="text-xs font-medium">{error}</span>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-bold text-[#0B1628] bg-white hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B1628] focus:ring-white transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg shadow-black/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none gap-2 mt-2"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Ingresando...
                                </>
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-white/5" />
                        <span className="text-xs text-slate-600 font-medium">o</span>
                        <div className="flex-1 h-px bg-white/5" />
                    </div>

                    {/* Secondary action */}
                    <button
                        type="button"
                        className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-medium text-slate-400 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all"
                    >
                        Solicitar acceso
                    </button>

                    {/* Footer info */}
                    <div className="mt-8 flex justify-center items-center gap-4 text-[11px] text-slate-600">
                        <a className="hover:text-slate-400 transition-colors" href="#">Privacidad</a>
                        <span>·</span>
                        <a className="hover:text-slate-400 transition-colors" href="#">Términos</a>
                        <span>·</span>
                        <a className="hover:text-slate-400 transition-colors" href="#">Soporte</a>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-4 text-center text-[11px] text-slate-700 relative z-10">
                © 2026 Komi — Familia y Bienestar
            </footer>
        </div>
    )
}
