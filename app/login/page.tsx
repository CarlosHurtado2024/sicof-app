'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { AlertCircle, User, Lock, Eye, EyeOff, Gavel, Shield, ArrowRight, CheckCircle } from 'lucide-react'
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
        <div className="font-[Inter,system-ui,sans-serif] min-h-screen flex antialiased">

            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-[55%] relative bg-gradient-to-br from-[#1e1033] via-[#2d1659] to-[#1a0f2e] overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute w-[600px] h-[600px] rounded-full bg-violet-600/15 -top-40 -left-40 blur-[120px]"></div>
                    <div className="absolute w-[400px] h-[400px] rounded-full bg-indigo-500/10 bottom-0 right-0 blur-[100px]"></div>
                    <div className="absolute w-[300px] h-[300px] rounded-full bg-purple-400/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-[80px]"></div>
                    {/* Grid pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.03)_1px,transparent_1px)] [background-size:60px_60px]"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between w-full p-12 lg:p-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-500/30">
                            <Gavel className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="font-bold text-xl text-white tracking-tight">SICOF</span>
                            <p className="text-violet-300/60 text-[10px] font-medium tracking-[0.2em] uppercase">Gov Platform</p>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-lg">
                        <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-6">
                                Justicia familiar
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-indigo-300">
                                    inteligente y segura
                                </span>
                            </h2>
                            <p className="text-violet-200/60 text-base leading-relaxed mb-10">
                                Plataforma integral de gestión diseñada para modernizar los procesos de las Comisarías de Familia en Colombia.
                            </p>
                        </div>

                        {/* Feature Pills */}
                        <div className={`space-y-4 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            <div className="flex items-center gap-3 group">
                                <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="w-4 h-4 text-violet-400" />
                                </div>
                                <span className="text-violet-200/70 text-sm">Cumplimiento automático de la Ley 2126</span>
                            </div>
                            <div className="flex items-center gap-3 group">
                                <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                                    <Shield className="w-4 h-4 text-violet-400" />
                                </div>
                                <span className="text-violet-200/70 text-sm">Encriptación de datos de nivel gubernamental</span>
                            </div>
                            <div className="flex items-center gap-3 group">
                                <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="w-4 h-4 text-violet-400" />
                                </div>
                                <span className="text-violet-200/70 text-sm">Valoración de riesgo con Inteligencia Artificial</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className={`transition-all duration-700 delay-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="flex items-center gap-4 text-violet-300/40 text-xs">
                            <div className="flex -space-x-2">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 border-2 border-[#1e1033] flex items-center justify-center text-[9px] font-bold text-white">JD</div>
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 border-2 border-[#1e1033] flex items-center justify-center text-[9px] font-bold text-white">AM</div>
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-[#1e1033] flex items-center justify-center text-[9px] font-bold text-white">CR</div>
                            </div>
                            <span>50+ entidades gubernamentales confían en SICOF</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex-1 flex flex-col bg-white">
                {/* Mobile header */}
                <div className="lg:hidden flex items-center justify-between p-6 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] rounded-xl flex items-center justify-center text-white">
                            <Gavel className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-lg text-slate-900 tracking-tight">SICOF</span>
                    </div>
                    <Link href="/" className="text-sm text-slate-500 hover:text-[#7C3AED] transition-colors font-medium">
                        ← Volver al inicio
                    </Link>
                </div>

                {/* Form Container */}
                <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                    <div className={`w-full max-w-[400px] transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

                        {/* Back link - desktop */}
                        <Link href="/" className="hidden lg:inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-[#7C3AED] transition-colors font-medium mb-10 group">
                            <ArrowRight className="w-3.5 h-3.5 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
                            Volver al inicio
                        </Link>

                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
                                Bienvenido
                            </h1>
                            <p className="text-sm text-slate-500">
                                Ingrese sus credenciales para acceder al sistema
                            </p>
                        </div>

                        {/* Login Form */}
                        <form className="space-y-5" onSubmit={handleLogin}>
                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-slate-700" htmlFor="email">
                                    Correo Institucional
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <User className="text-slate-400 group-focus-within:text-[#7C3AED] transition-colors h-[18px] w-[18px]" />
                                    </div>
                                    <input
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all duration-200 text-sm"
                                        id="email"
                                        name="username"
                                        placeholder="nombre@entidad.gov.co"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-medium text-slate-700" htmlFor="password">
                                        Contraseña
                                    </label>
                                    <a className="text-xs font-medium text-[#7C3AED] hover:text-[#6D28D9] transition-colors" href="#">
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Lock className="text-slate-400 group-focus-within:text-[#7C3AED] transition-colors h-[18px] w-[18px]" />
                                    </div>
                                    <input
                                        className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all duration-200 text-sm"
                                        id="password"
                                        name="password"
                                        placeholder="•••••••••"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                                    </button>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="flex items-center text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 gap-2.5">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <span className="text-xs font-medium">{error}</span>
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7C3AED] transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none gap-2"
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

                        {/* Divider */}
                        <div className="my-6 flex items-center gap-3">
                            <div className="flex-1 h-px bg-slate-100"></div>
                            <span className="text-xs text-slate-400 font-medium">Acceso seguro</span>
                            <div className="flex-1 h-px bg-slate-100"></div>
                        </div>

                        {/* Security badges */}
                        <div className="flex items-center justify-center gap-6 text-slate-400">
                            <div className="flex items-center gap-1.5 text-[11px]">
                                <Shield className="w-3.5 h-3.5" />
                                <span>SSL/TLS</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px]">
                                <Lock className="w-3.5 h-3.5" />
                                <span>AES-256</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px]">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Habeas Data</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 flex justify-between items-center text-xs text-slate-400 border-t border-slate-50">
                    <span>v2.4.0</span>
                    <div className="flex gap-4">
                        <a className="hover:text-[#7C3AED] transition-colors" href="#">Privacidad</a>
                        <a className="hover:text-[#7C3AED] transition-colors" href="#">Soporte</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
