
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
        <div className="bg-[#f7f6f8] dark:bg-[#1c1121] min-h-screen flex flex-col antialiased font-sans text-gray-800 dark:text-gray-100 selection:bg-purple-500/30 selection:text-purple-600">
            {/* Decorative subtle background pattern */}
            <div className="fixed inset-0 z-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#921ac6 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>

            {/* Top Bar decoration */}
            <div className="fixed top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 via-purple-400 to-indigo-500 z-20"></div>

            <main className="flex-grow flex items-center justify-center p-4 relative z-10">
                {/* Main Card */}
                <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 transform transition-all hover:shadow-purple-500/5">

                    {/* Card Header Area */}
                    <div className="px-8 pt-10 pb-6 text-center">
                        {/* Logo */}
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-600/10 mb-6 text-purple-600">
                            <ShieldCheck className="w-10 h-10" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
                            Sistema de Gestión Integral
                        </h1>
                        <p className="text-sm font-medium text-purple-600 uppercase tracking-wider">
                            Comisarías de Familia
                        </p>
                        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                            Ingrese sus credenciales para acceder al sistema
                        </p>
                    </div>

                    {/* Login Form */}
                    <form className="px-8 pb-8 space-y-5" onSubmit={handleLogin}>
                        {/* Username Input */}
                        <div className="space-y-1 group">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">Usuario o Correo</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="text-gray-400 group-focus-within:text-purple-600 transition-colors h-5 w-5" />
                                </div>
                                <input
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-lg leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all duration-200 sm:text-sm"
                                    id="email"
                                    type="email"
                                    placeholder="nombre@entidad.gov.co"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1 group">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">Contraseña</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="text-gray-400 group-focus-within:text-purple-600 transition-colors h-5 w-5" />
                                </div>
                                <input
                                    className="block w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-gray-700 rounded-lg leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all duration-200 sm:text-sm"
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="•••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <div
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer hover:text-gray-600 dark:hover:text-gray-200 text-gray-400 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">
                                <AlertCircle className="mr-2 h-4 w-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* Primary Action */}
                        <button
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 transition-all duration-200 transform hover:-translate-y-0.5 shadow-purple-600/30 hover:shadow-purple-600/50 disabled:opacity-50 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>

                        {/* Forgot Password */}
                        <div className="text-center">
                            <a className="text-sm font-medium text-gray-500 hover:text-purple-600 transition-colors duration-200" href="#">
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>
                    </form>

                    {/* Card Footer Area */}
                    <div className="px-8 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-xs text-gray-400">
                        <span>Versión 2.4.0</span>
                        <div className="flex space-x-3">
                            <a className="hover:text-purple-600 transition-colors" href="#">Privacidad</a>
                            <a className="hover:text-purple-600 transition-colors" href="#">Soporte</a>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="p-6 text-center text-xs text-gray-400 dark:text-gray-600 relative z-10">
                © 2026 Sistema de Gestión Integral - Todos los derechos reservados.
            </footer>
        </div>
    )
}
