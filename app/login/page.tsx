'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { AlertCircle, User, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()
    const supabase = createClient()

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
        <div className="bg-[#f7f6f8] dark:bg-[#1c1121] font-sans text-gray-800 dark:text-gray-100 min-h-screen flex flex-col antialiased selection:bg-[#921ac6]/30 selection:text-[#921ac6] relative overflow-hidden">
            {/* Animated blobs background */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/30 mix-blend-multiply filter blur-[80px] opacity-70 animate-blob"></div>
                <div className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-[#921ac6]/40 mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-[20%] left-[20%] w-[45vw] h-[45vw] rounded-full bg-purple-300/40 mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-4000"></div>
                <div className="absolute inset-0 bg-white/10 dark:bg-black/20 z-0"></div>
            </div>

            {/* Top gradient bar */}
            <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-[#921ac6] via-purple-400 to-indigo-500 z-20"></div>

            <main className="flex-grow flex items-center justify-center p-4 relative z-10">
                {/* Main Card with glassmorphism */}
                <div className="w-full max-w-md backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] overflow-hidden border border-white/50 dark:border-white/10 transform transition-all">

                    {/* Card Header */}
                    <div className="px-8 pt-10 pb-6 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#921ac6]/20 backdrop-blur-sm mb-6 text-[#921ac6] shadow-inner border border-white/20">
                            <ShieldCheck className="w-9 h-9" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2 drop-shadow-sm">
                            Sistema de Gestión Integral
                        </h1>
                        <p className="text-sm font-semibold text-[#921ac6] uppercase tracking-wider">
                            Comisarías de Familia
                        </p>
                        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                            Ingrese sus credenciales para acceder al sistema
                        </p>
                    </div>

                    {/* Login Form */}
                    <form className="px-8 pb-8 space-y-5" onSubmit={handleLogin}>
                        {/* Email Input */}
                        <div className="space-y-1 group">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200" htmlFor="email">
                                Usuario o Correo
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="text-gray-500 dark:text-gray-400 group-focus-within:text-[#921ac6] transition-colors h-5 w-5" />
                                </div>
                                <input
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200/60 dark:border-gray-600/60 rounded-lg leading-5 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#921ac6]/40 focus:border-[#921ac6] transition-all duration-200 sm:text-sm shadow-sm"
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

                        {/* Password Input */}
                        <div className="space-y-1 group">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200" htmlFor="password">
                                Contraseña
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="text-gray-500 dark:text-gray-400 group-focus-within:text-[#921ac6] transition-colors h-5 w-5" />
                                </div>
                                <input
                                    className="block w-full pl-10 pr-10 py-3 border border-gray-200/60 dark:border-gray-600/60 rounded-lg leading-5 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#921ac6]/40 focus:border-[#921ac6] transition-all duration-200 sm:text-sm shadow-sm"
                                    id="password"
                                    name="password"
                                    placeholder="•••••••••"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <div
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 text-gray-500 dark:text-gray-400 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center text-sm text-red-600 bg-red-50/80 dark:bg-red-900/20 p-3 rounded-lg border border-red-200/60 dark:border-red-800/60 backdrop-blur-sm">
                                <AlertCircle className="mr-2 h-4 w-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-lg shadow-[#921ac6]/30 text-sm font-bold text-white bg-[#921ac6] hover:bg-[#7a15a6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#921ac6] transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#921ac6]/40 backdrop-blur-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>

                        {/* Forgot Password */}
                        <div className="text-center">
                            <a className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-[#921ac6] transition-colors duration-200" href="#">
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>
                    </form>

                    {/* Card Footer */}
                    <div className="px-8 py-4 bg-white/30 dark:bg-gray-900/30 backdrop-blur-md border-t border-white/40 dark:border-gray-700/40 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 font-medium">
                        <span>Versión 2.4.0</span>
                        <div className="flex space-x-3">
                            <a className="hover:text-[#921ac6] transition-colors" href="#">Privacidad</a>
                            <a className="hover:text-[#921ac6] transition-colors" href="#">Soporte</a>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="p-6 text-center text-xs text-gray-500 dark:text-gray-400 font-medium relative z-10 drop-shadow-sm">
                © 2026 Sistema de Gestión Integral - Todos los derechos reservados.
            </footer>

            {/* Custom animations */}
            <style jsx>{`
                @keyframes blob {
                    0% {
                        transform: translate(0px, 0px) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                    100% {
                        transform: translate(0px, 0px) scale(1);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    )
}
