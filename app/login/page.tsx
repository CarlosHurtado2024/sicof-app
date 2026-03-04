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
        <div className="font-display text-komi-primary min-h-[100svh] relative flex items-center justify-center p-4 sm:p-8 overflow-hidden antialiased">
            {/* Background Image with Blur Overlay */}
            <div className="absolute inset-0 z-0 bg-background-light">
                <img
                    alt="Komi Background"
                    className="w-full h-full object-cover opacity-90 transition-opacity duration-1000"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDIDZtm4LTm8RmgNVUm4DV8Y-k9iKEAACpqyW60r98hXtZcxzBOaGAI6l8i_IsH2sQf3Ae4nJ-JCAhyP0XNjkAQU6MCAZrw5VYdShvi97wSFVQFKeOpkyqxSkTnMTmi51zOsKn5BhySJuxa-ZnXC40L7UscwAXR_6X6IuGigq1MxIc5N6SdIMKzdNTpTjsB5QBU19n_HfmQ9sI8HJPpnzXVLCInlnjeNn-txf1cOkkhM5D5iHlx1nbhHz2j9A5fMknL_U_vV_jV9AP"
                />
                <div className="absolute inset-0 bg-white/30 backdrop-blur-[4px]"></div>
            </div>

            {/* Back Link */}
            <Link
                href="/"
                className="absolute top-8 left-8 inline-flex items-center gap-2 text-sm text-komi-primary/60 hover:text-komi-primary transition-colors font-bold z-20 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Regresar a Inicio
            </Link>

            {/* Glass Panel Login Card */}
            <div
                className={`w-full max-w-[500px] bg-white/80 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] p-8 sm:p-12 relative z-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-1000 ease-out transform ${mounted ? 'opacity-100 translate-y-0 shadow-lg' : 'opacity-0 translate-y-12'
                    }`}
            >
                {/* Logo Section */}
                <div className="flex flex-col items-center gap-2 mb-8 text-komi-primary">
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 mb-2">
                        <SicofLogoIcon className="w-10 h-10" />
                    </div>
                    <span className="text-3xl font-serif font-black tracking-tight">Komi</span>
                </div>

                <div className="w-full text-center mb-10">
                    <h2 className="text-3xl font-black text-komi-primary mb-2">Bienvenido</h2>
                    <p className="text-komi-primary/50 text-sm font-medium">Soporte eficiente con tecnología segura.</p>
                </div>

                {/* Login Form */}
                <form className="w-full flex flex-col gap-6" onSubmit={handleLogin}>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-komi-primary/80" htmlFor="email">
                            Correo electrónico institucional
                        </label>
                        <div className="relative flex items-center">
                            <div className="absolute left-3 w-8 h-8 bg-pastel-yellow rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-[#B45309] text-base">person</span>
                            </div>
                            <input
                                className="w-full pl-14 pr-4 py-3.5 rounded-2xl border border-white/50 bg-white/50 text-komi-primary placeholder-komi-primary/30 focus:outline-none focus:ring-2 focus:ring-komi-accent transition-all backdrop-blur-sm shadow-sm"
                                id="email"
                                placeholder="ejemplo@comisaria.gov.co"
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-komi-primary/80" htmlFor="password">
                            Contraseña
                        </label>
                        <div className="relative flex items-center">
                            <div className="absolute left-3 w-8 h-8 bg-pastel-green rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-[#047857] text-base">key</span>
                            </div>
                            <input
                                className="w-full pl-14 pr-12 py-3.5 rounded-2xl border border-white/50 bg-white/50 text-komi-primary placeholder-komi-primary/30 focus:outline-none focus:ring-2 focus:ring-komi-accent transition-all backdrop-blur-sm shadow-sm"
                                id="password"
                                placeholder="••••••••"
                                required
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                className="absolute right-4 text-komi-primary/30 hover:text-komi-primary transition-colors p-1"
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <span className="material-symbols-outlined text-xl">
                                    {showPassword ? 'visibility' : 'visibility_off'}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-1 px-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                className="h-4 w-4 rounded border-slate-200 text-komi-accent focus:ring-komi-accent transition-colors cursor-pointer"
                                type="checkbox"
                            />
                            <span className="text-sm font-bold text-komi-primary/40 group-hover:text-komi-primary/80 transition-colors">
                                Recordarme
                            </span>
                        </label>
                        <Link
                            href="#"
                            className="text-sm font-bold text-komi-accent hover:text-komi-accent/80 transition-colors"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    <button
                        className="mt-4 w-full bg-komi-accent hover:bg-komi-accent/90 text-white font-black py-4 px-4 rounded-2xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-lg shadow-komi-accent/20 disabled:opacity-50"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Verificando...</span>
                            </>
                        ) : (
                            <>
                                <span>Iniciar Sesión</span>
                                <span className="material-symbols-outlined text-base font-bold">arrow_forward</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Footer Badges */}
                <div className="mt-8 pt-6 border-t border-slate-100/50 w-full flex justify-center">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-komi-primary/30 bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm border border-white/50">
                        <div className="w-5 h-5 bg-pastel-blue rounded-full flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[12px] text-blue-600 font-bold">shield</span>
                        </div>
                        PWA Cifrado • AES-256
                    </div>
                </div>
            </div>
        </div>
    )
}
