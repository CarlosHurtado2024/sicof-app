'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { AlertCircle, User, Lock, Eye, EyeOff, Shield, ArrowLeft } from 'lucide-react'
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
        <div className="font-[Inter,system-ui,sans-serif] min-h-screen flex flex-col antialiased relative overflow-hidden bg-[#f7f6f8] selection:bg-purple-300/30 selection:text-purple-700">

            {/* ── Animated Background Blobs ── */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/25 mix-blend-multiply blur-[100px] opacity-70"
                    style={{ animation: 'blob 8s infinite alternate ease-in-out' }}
                />
                <div
                    className="absolute top-[20%] right-[5%] w-[40vw] h-[40vw] rounded-full bg-purple-500/30 mix-blend-multiply blur-[100px] opacity-70"
                    style={{ animation: 'blob 8s infinite alternate ease-in-out 2s' }}
                />
                <div
                    className="absolute -bottom-[15%] left-[15%] w-[45vw] h-[45vw] rounded-full bg-violet-300/30 mix-blend-multiply blur-[100px] opacity-70"
                    style={{ animation: 'blob 8s infinite alternate ease-in-out 4s' }}
                />
                <div className="absolute inset-0 bg-white/10 z-0" />
            </div>

            {/* ── Top Accent Line ── */}
            <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-[#7C3AED] via-purple-400 to-indigo-500 z-20" />

            {/* ── Main Content ── */}
            <main className="flex-grow flex items-center justify-center p-4 relative z-10">
                <div
                    className={`w-full max-w-md transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'
                        }`}
                >
                    {/* ── Back to Landing ── */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-[#7C3AED] transition-colors font-medium mb-5 group"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                        Volver al inicio
                    </Link>

                    {/* ── Glass Card ── */}
                    <div className="backdrop-blur-xl bg-white/60 rounded-2xl shadow-[0_8px_40px_0_rgba(124,58,237,0.1)] overflow-hidden border border-white/60">

                        {/* ── Header with Logo ── */}
                        <div className="px-8 pt-10 pb-6 text-center">
                            <div className={`transition-all duration-700 delay-150 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/80 backdrop-blur-sm mb-5 shadow-sm border border-white/40">
                                    <SicofLogoIcon className="w-14 h-14" />
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
                                SICOF
                            </h1>
                            <p className="text-xs font-semibold text-[#7C3AED] uppercase tracking-[0.2em]">
                                Sistema Integral de Comisarías de Familia
                            </p>
                            <p className="mt-4 text-sm text-slate-500 font-medium">
                                Ingrese sus credenciales para acceder
                            </p>
                        </div>

                        {/* ── Form ── */}
                        <form className="px-8 pb-8 space-y-5" onSubmit={handleLogin}>
                            {/* Email */}
                            <div className="space-y-1.5 group">
                                <label className="block text-sm font-semibold text-slate-700" htmlFor="email">
                                    Correo Institucional
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <User className="text-slate-400 group-focus-within:text-[#7C3AED] transition-colors h-[18px] w-[18px]" />
                                    </div>
                                    <input
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-200/60 rounded-xl leading-5 bg-white/50 backdrop-blur-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] transition-all duration-200 text-sm shadow-sm"
                                        id="email"
                                        name="email"
                                        placeholder="nombre@entidad.gov.co"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5 group">
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-semibold text-slate-700" htmlFor="password">
                                        Contraseña
                                    </label>
                                    <a className="text-xs font-semibold text-slate-400 hover:text-[#7C3AED] transition-colors" href="#">
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Lock className="text-slate-400 group-focus-within:text-[#7C3AED] transition-colors h-[18px] w-[18px]" />
                                    </div>
                                    <input
                                        className="block w-full pl-10 pr-10 py-3 border border-slate-200/60 rounded-xl leading-5 bg-white/50 backdrop-blur-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] transition-all duration-200 text-sm shadow-sm"
                                        id="password"
                                        name="password"
                                        placeholder="•••••••••"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
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
                                <div className="flex items-center text-sm text-red-600 bg-red-50/80 backdrop-blur-sm p-3 rounded-xl border border-red-100 gap-2.5">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <span className="text-xs font-medium">{error}</span>
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#7C3AED] hover:bg-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7C3AED] transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/35 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none gap-2 backdrop-blur-md"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Iniciando sesión...
                                    </>
                                ) : (
                                    'Iniciar Sesión'
                                )}
                            </button>
                        </form>

                        {/* ── Footer ── */}
                        <div className="px-8 py-4 bg-white/30 backdrop-blur-md border-t border-white/40 flex justify-between items-center text-xs text-slate-400 font-medium">
                            <div className="flex items-center gap-1.5">
                                <Shield className="w-3 h-3" />
                                <span>Acceso seguro</span>
                            </div>
                            <div className="flex space-x-3">
                                <a className="hover:text-[#7C3AED] transition-colors" href="#">Privacidad</a>
                                <a className="hover:text-[#7C3AED] transition-colors" href="#">Soporte</a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* ── Page Footer ── */}
            <footer className="p-6 text-center text-xs text-slate-400 font-medium relative z-10">
                © 2025 SICOF — Sistema Integral de Comisarías de Familia
            </footer>

            {/* ── Blob Animation Keyframes ── */}
            <style jsx>{`
                @keyframes blob {
                    0% {
                        transform: translate(0, 0) scale(1);
                    }
                    33% {
                        transform: translate(30px, -20px) scale(1.05);
                    }
                    66% {
                        transform: translate(-15px, 15px) scale(0.95);
                    }
                    100% {
                        transform: translate(0, 0) scale(1);
                    }
                }
            `}</style>
        </div>
    )
}
