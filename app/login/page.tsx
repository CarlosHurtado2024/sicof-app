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
        <div className="font-display text-[#2B463C] min-h-[100svh] relative flex items-center justify-center p-4 sm:p-8 overflow-hidden antialiased bg-[#FDFBF7]">
            {/* Mesh Gradient Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#F28C73]/10 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-[#2B463C]/5 blur-[100px] animate-pulse" style={{ animationDuration: '12s' }} />
                <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-[#F28C73]/15 blur-[150px] animate-pulse" style={{ animationDuration: '10s' }} />

                {/* Subtle texture overlay */}
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />
            </div>

            {/* Back Link */}
            <Link
                href="/"
                className="absolute top-8 left-8 inline-flex items-center gap-2 text-sm text-[#2B463C]/60 hover:text-[#2B463C] transition-colors font-bold z-20 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="uppercase tracking-widest text-[10px]">Inicio</span>
            </Link>

            {/* Glass Panel Login Card */}
            <div
                className={`w-full max-w-[480px] bg-white/40 backdrop-blur-[40px] border border-white/60 rounded-[3rem] p-8 sm:p-12 relative z-10 shadow-[0_32px_64px_-16px_rgba(43,70,60,0.12)] transition-all duration-1000 ease-out transform ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
                    }`}
            >
                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#F28C73]/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#2B463C]/5 rounded-full blur-2xl" />

                {/* Logo Section */}
                <div className="flex flex-col items-center gap-1 mb-10 text-[#2B463C]">
                    <div className="bg-white/60 p-4 rounded-3xl shadow-sm border border-white/80 mb-4 backdrop-blur-md group hover:scale-105 transition-transform duration-500">
                        <SicofLogoIcon className="w-12 h-12" />
                    </div>
                    <span className="text-4xl font-serif font-black tracking-tighter">Komi</span>
                    <div className="h-0.5 w-8 bg-[#F28C73] rounded-full mt-1 opacity-60" />
                </div>

                <div className="w-full text-center mb-10">
                    <h2 className="text-2xl font-bold text-[#2B463C] mb-2 uppercase tracking-widest">Portal de Acceso</h2>
                    <p className="text-[#2B463C]/40 text-[10px] font-bold uppercase tracking-[0.2em]">Tecnología Empática para Comisarías</p>
                </div>

                {/* Login Form */}
                <form className="w-full flex flex-col gap-6" onSubmit={handleLogin}>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-[#2B463C]/50 uppercase tracking-[0.15em] ml-1" htmlFor="email">
                            Usuario Institucional
                        </label>
                        <div className="relative group">
                            <input
                                className="w-full pl-6 pr-4 py-4 rounded-2xl border border-white/60 bg-white/40 text-[#2B463C] placeholder-[#2B463C]/20 focus:outline-none focus:ring-2 focus:ring-[#F28C73]/30 transition-all backdrop-blur-md shadow-inner text-sm font-medium"
                                id="email"
                                placeholder="usuario@comisaria.gov.co"
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-[#2B463C]/50 uppercase tracking-[0.15em] ml-1" htmlFor="password">
                            Contraseña de Seguridad
                        </label>
                        <div className="relative group">
                            <input
                                className="w-full pl-6 pr-12 py-4 rounded-2xl border border-white/60 bg-white/40 text-[#2B463C] placeholder-[#2B463C]/20 focus:outline-none focus:ring-2 focus:ring-[#F28C73]/30 transition-all backdrop-blur-md shadow-inner text-sm font-medium"
                                id="password"
                                placeholder="••••••••"
                                required
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2B463C]/20 hover:text-[#2B463C] transition-colors p-2"
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-3 p-4 bg-red-50/50 backdrop-blur-md border border-red-100 rounded-2xl text-red-600 text-[10px] font-bold uppercase tracking-wider animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>Acceso Denegado: {error}</span>
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-1 px-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className="relative flex items-center justify-center">
                                <input
                                    className="peer h-4 w-4 rounded-md border-white/60 bg-white/40 text-[#F28C73] focus:ring-[#F28C73] transition-colors cursor-pointer appearance-none border"
                                    type="checkbox"
                                />
                                <div className="absolute h-2 w-2 bg-[#F28C73] rounded-sm opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                            <span className="text-[10px] font-bold text-[#2B463C]/40 group-hover:text-[#2B463C] transition-colors uppercase tracking-widest">
                                Persistir Sesión
                            </span>
                        </label>
                        <Link
                            href="#"
                            className="text-[10px] font-bold text-[#F28C73] hover:text-[#F28C73]/80 transition-colors uppercase tracking-widest"
                        >
                            ¿Recuperar Acceso?
                        </Link>
                    </div>

                    <button
                        className="mt-6 w-full bg-[#2B463C] hover:bg-[#F28C73] text-white font-bold py-5 px-4 rounded-2xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-xl shadow-[#2B463C]/10 disabled:opacity-50 group uppercase tracking-[0.2em] text-xs"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Autenticando...</span>
                            </>
                        ) : (
                            <>
                                <span>Entrar al Sistema</span>
                                <ArrowLeft size={16} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer Badges */}
                <div className="mt-12 pt-8 border-t border-white/40 w-full flex flex-col items-center gap-4">
                    <div className="flex items-center gap-3 text-[8px] font-bold uppercase tracking-[0.3em] text-[#2B463C]/30">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/60 backdrop-blur-md">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            SERVIDOR SEGURO
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/60 backdrop-blur-md">
                            ENCRIPTACIÓN AES
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
