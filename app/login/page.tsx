'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { AlertCircle, Eye, EyeOff, ArrowLeft, Loader2, Fingerprint } from 'lucide-react'
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
        <div className="font-[Inter,system-ui,sans-serif] min-h-[100svh] flex flex-col justify-center items-center antialiased bg-[#050505] selection:bg-purple-500/30 selection:text-white relative overflow-hidden">

            {/* Futuristic Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Glowing Orbs */}
                <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-purple-600/10 blur-[140px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[20%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-fuchsia-600/10 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />

                {/* Subtle Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] opacity-30" />
            </div>

            {/* Back Link */}
            <Link
                href="/"
                className="absolute top-8 left-8 inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors font-medium z-20 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Regresar
            </Link>

            {/* Main Content */}
            <main className="w-full max-w-[420px] px-6 relative z-10 perspective-1000">
                <div
                    className={`transition-all duration-1000 ease-out transform ${mounted ? 'opacity-100 translate-y-0 rotate-x-0' : 'opacity-0 translate-y-12 rotate-x-12'
                        }`}
                >
                    {/* Glassmorphism Card */}
                    <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] p-8 sm:p-10 rounded-[2rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] relative overflow-hidden group">

                        {/* Shimmer effect line */}
                        <div className="absolute top-0 left-[-100%] w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent group-hover:left-[100%] transition-all duration-1000 ease-in-out" />

                        {/* Header */}
                        <div className="flex flex-col items-center text-center mb-10">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner relative">
                                <SicofLogoIcon className="w-8 h-8 opacity-90" inverted={true} />
                                <div className="absolute inset-0 bg-purple-400/20 blur-xl rounded-full" />
                            </div>
                            <h1 className="text-2xl font-semibold tracking-tight text-white/90 mb-2">
                                Acceso al Sistema
                            </h1>
                            <p className="text-sm text-white/40 font-light tracking-wide">
                                Autenticación cifrada Komi
                            </p>
                        </div>

                        {/* Form */}
                        <form className="space-y-6" onSubmit={handleLogin}>
                            {/* Email */}
                            <div className="space-y-1.5 relative group/input">
                                <input
                                    className="peer w-full bg-transparent border-b border-white/10 px-0 py-3 text-white placeholder-transparent focus:outline-none focus:border-purple-500 transition-colors text-sm font-light"
                                    id="email"
                                    name="email"
                                    placeholder="Correo electrónico"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                                <label
                                    htmlFor="email"
                                    className="absolute left-0 -top-3.5 text-xs font-medium text-white/30 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-white/30 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-purple-400"
                                >
                                    ID de usuario
                                </label>
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5 relative group/input">
                                <input
                                    className="peer w-full bg-transparent border-b border-white/10 px-0 py-3 pr-10 text-white placeholder-transparent focus:outline-none focus:border-purple-500 transition-colors text-sm font-light tracking-widest"
                                    id="password"
                                    name="password"
                                    placeholder="Contraseña"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                />
                                <label
                                    htmlFor="password"
                                    className="absolute left-0 -top-3.5 text-xs font-medium text-white/30 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-white/30 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-purple-400 tracking-normal"
                                >
                                    Clave de acceso
                                </label>
                                <button
                                    type="button"
                                    className="absolute right-0 top-3 text-white/20 hover:text-white/60 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="flex items-start text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg gap-2 mt-4 backdrop-blur-sm">
                                    <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                                    <span className="font-light">{error}</span>
                                </div>
                            )}

                            {/* Submit */}
                            <div className="pt-6">
                                <button
                                    className="relative w-full group/btn overflow-hidden rounded-xl bg-white/5 border border-white/10 transition-all hover:border-purple-500/50 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] disabled:opacity-50 disabled:pointer-events-none"
                                    type="submit"
                                    disabled={loading}
                                >
                                    <div className="px-4 py-3.5 flex items-center justify-center gap-2 relative z-10 text-sm font-medium text-white/90">
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                                                Verificando
                                            </>
                                        ) : (
                                            <>
                                                <Fingerprint className="w-4 h-4 text-purple-400 group-hover/btn:text-fuchsia-400 transition-colors" />
                                                Autenticar
                                            </>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                                </button>
                            </div>
                        </form>

                        {/* Footer links */}
                        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
                            <a href="#" className="text-xs text-white/30 hover:text-purple-400 transition-colors font-light">
                                ¿No puedes acceder a tu cuenta?
                            </a>
                        </div>
                    </div>

                    {/* Hardware Info Placeholder */}
                    <div className="mt-8 text-center text-[10px] text-white/20 font-mono tracking-widest flex items-center justify-center gap-3 opacity-50">
                        <span>SYS.v2.4.0</span>
                        <span className="w-1 h-1 rounded-full bg-purple-500/50" />
                        <span>SECURE.CONN</span>
                        <span className="w-1 h-1 rounded-full bg-purple-500/50" />
                        <span>AES-256</span>
                    </div>
                </div>
            </main>

            {/* Custom Animations required for this page */}
            <style>{`
                @keyframes shimmer {
                    100% {
                        transform: translateX(100%);
                    }
                }
            `}</style>
        </div>
    )
}
