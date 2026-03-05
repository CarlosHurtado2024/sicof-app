'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { AlertCircle, Eye, EyeOff, ArrowRight, Loader2, Mail, KeyRound } from 'lucide-react'
import { SicofLogoIcon } from '@/components/sicof-logo'

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
        <div className="min-h-[100svh] relative flex flex-col overflow-hidden" style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#0a1118' }}>
            {/* ─── Abstract Background Blobs ─── */}
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(255,122,89,0.15) 0%, rgba(0,0,0,0) 70%)' }} />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(152,255,152,0.1) 0%, rgba(0,0,0,0) 70%)' }} />
            <div className="absolute top-[20%] right-[20%] w-[40vw] h-[40vw] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(255,253,208,0.1) 0%, rgba(0,0,0,0) 70%)' }} />

            {/* ─── Top Bar (Logo only, no nav links) ─── */}
            <header className="relative z-10 flex items-center px-6 sm:px-10 py-5 w-full">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center" style={{ color: '#ff7a59' }}>
                        <SicofLogoIcon className="w-7 h-7 invert" />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Komi</h2>
                </div>
            </header>

            {/* ─── Main Content ─── */}
            <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
                <div
                    className={`w-full max-w-md p-8 sm:p-10 rounded-xl flex flex-col gap-8 transition-all duration-1000 ease-out ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'
                        }`}
                    style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    {/* Header Section */}
                    <div className="flex flex-col items-center text-center gap-4">
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
                            style={{ background: 'rgba(255, 122, 89, 0.1)' }}
                        >
                            <SicofLogoIcon className="w-8 h-8 invert" />
                        </div>
                        <div>
                            <h1 className="text-[32px] font-bold text-white leading-tight mb-2">Bienvenido</h1>
                            <p className="text-sm font-medium" style={{ color: 'rgba(148, 163, 184, 1)' }}>
                                Komi — Gestión Familiar y Bienestar
                            </p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <form className="flex flex-col gap-5" onSubmit={handleLogin}>
                        {/* Email Input */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium ml-1" style={{ color: 'rgba(203, 213, 225, 1)' }} htmlFor="email">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px]" style={{ color: 'rgba(148, 163, 184, 1)' }} />
                                <input
                                    className="w-full h-12 pl-12 pr-4 rounded-lg text-white text-sm font-medium focus:outline-none transition-all"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.boxShadow = '0 0 0 2px rgba(255, 122, 89, 0.5)'
                                        e.target.style.borderColor = 'transparent'
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.boxShadow = 'none'
                                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                                    }}
                                    id="email"
                                    placeholder="usuario@comisaria.gov.co"
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-medium" style={{ color: 'rgba(203, 213, 225, 1)' }} htmlFor="password">
                                    Contraseña
                                </label>
                                <a className="text-xs font-medium hover:underline" href="#" style={{ color: '#ff7a59' }}>
                                    ¿Olvidaste tu clave?
                                </a>
                            </div>
                            <div className="relative">
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px]" style={{ color: 'rgba(148, 163, 184, 1)' }} />
                                <input
                                    className="w-full h-12 pl-12 pr-12 rounded-lg text-white text-sm font-medium focus:outline-none transition-all"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.boxShadow = '0 0 0 2px rgba(255, 122, 89, 0.5)'
                                        e.target.style.borderColor = 'transparent'
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.boxShadow = 'none'
                                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                                    }}
                                    id="password"
                                    placeholder="••••••••"
                                    required
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 transition-colors"
                                    style={{ color: 'rgba(148, 163, 184, 0.6)' }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(148, 163, 184, 0.6)')}
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div
                                className="flex items-center gap-3 p-3 rounded-lg text-sm font-medium"
                                style={{
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                    color: '#fca5a5',
                                }}
                            >
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Action Button */}
                        <button
                            className="mt-4 w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 text-white"
                            style={{
                                background: '#ff7a59',
                                boxShadow: '0 4px 14px 0 rgba(255,122,89,0.39)',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Autenticando...</span>
                                </>
                            ) : (
                                <>
                                    <span>Iniciar Sesión</span>
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    )
}
