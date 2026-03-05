"use client"

import { useState, useRef, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
    BotMessageSquare,
    Send,
    Loader2,
    Sparkles,
    BarChart3,
    Users,
    FileText,
    ShieldAlert,
    Database,
    ChevronDown,
    X,
    Code2,
} from 'lucide-react'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    sql?: string | null
    timestamp: Date
    isLoading?: boolean
}

const SUGGESTIONS = [
    { icon: <BarChart3 className="h-3.5 w-3.5" />, label: "¿Cuántos expedientes activos hay?", color: "text-blue-500" },
    { icon: <ShieldAlert className="h-3.5 w-3.5" />, label: "¿Cuántos casos de riesgo ALTO o CRITICO hay?", color: "text-red-500" },
    { icon: <Users className="h-3.5 w-3.5" />, label: "¿Cuántas víctimas se han registrado?", color: "text-purple-500" },
    { icon: <FileText className="h-3.5 w-3.5" />, label: "¿Cuántos casos de violencia psicológica hay?", color: "text-amber-500" },
]

export default function KomiAIChat() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showSQLFor, setShowSQLFor] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const chatContainerRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [messages, scrollToBottom])

    const sendMessage = async (text?: string) => {
        const question = (text || input).trim()
        if (!question || isLoading) return

        setInput('')
        const userMsg: Message = {
            id: crypto.randomUUID(),
            role: 'user',
            content: question,
            timestamp: new Date(),
        }

        const loadingMsg: Message = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: '',
            timestamp: new Date(),
            isLoading: true,
        }

        setMessages(prev => [...prev, userMsg, loadingMsg])
        setIsLoading(true)

        try {
            const supabase = createClient()
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                throw new Error('No hay sesión activa')
            }

            // Build conversation history for context
            const history = messages
                .filter(m => !m.isLoading)
                .slice(-6)
                .map(m => ({ role: m.role, content: m.content }))

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/komi-ai-chat`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.access_token}`,
                        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
                    },
                    body: JSON.stringify({ question, history }),
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al consultar Komi AI')
            }

            const assistantMsg: Message = {
                id: loadingMsg.id,
                role: 'assistant',
                content: data.answer || 'No pude procesar tu consulta.',
                sql: data.sql,
                timestamp: new Date(),
            }

            setMessages(prev => prev.map(m => m.id === loadingMsg.id ? assistantMsg : m))
        } catch (err) {
            const errorMsg: Message = {
                id: loadingMsg.id,
                role: 'assistant',
                content: `❌ ${err instanceof Error ? err.message : 'Error inesperado. Intenta de nuevo.'}`,
                timestamp: new Date(),
            }
            setMessages(prev => prev.map(m => m.id === loadingMsg.id ? errorMsg : m))
        } finally {
            setIsLoading(false)
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    const isEmpty = messages.length === 0

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] sm:h-[calc(100vh-5rem)] max-w-[900px] mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4 flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-[#F28C73] to-[#E06B52] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#F28C73]/20">
                    <BotMessageSquare className="h-5 w-5" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-[#2B463C]">Komi AI</h1>
                    <p className="text-[10px] text-[#2B463C]/40 font-medium uppercase tracking-widest">Asistente de datos inteligente</p>
                </div>
                {messages.length > 0 && (
                    <button
                        onClick={() => { setMessages([]); setShowSQLFor(null) }}
                        className="ml-auto text-[10px] font-semibold text-[#2B463C]/30 hover:text-[#F28C73] transition-colors uppercase tracking-wider flex items-center gap-1"
                    >
                        <X className="h-3 w-3" />
                        Limpiar
                    </button>
                )}
            </div>

            {/* Chat area */}
            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto rounded-2xl bg-white border border-[#2B463C]/5 shadow-sm"
            >
                {isEmpty ? (
                    /* Empty state */
                    <div className="flex flex-col items-center justify-center h-full px-6 py-12">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#F28C73]/10 to-[#F28C73]/5 rounded-2xl flex items-center justify-center mb-5">
                            <Sparkles className="h-7 w-7 text-[#F28C73]" />
                        </div>
                        <h2 className="text-base font-bold text-[#2B463C] mb-1">Pregunta lo que necesites</h2>
                        <p className="text-xs text-[#2B463C]/40 text-center max-w-sm mb-8 leading-relaxed">
                            Consulta datos en tiempo real sobre expedientes, personas, medidas, audiencias y más. Respuestas basadas 100% en la base de datos.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-lg">
                            {SUGGESTIONS.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => sendMessage(s.label)}
                                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#FAFAF8] border border-[#2B463C]/5 hover:border-[#F28C73]/20 hover:bg-[#FFF8F6] text-left transition-all group"
                                >
                                    <span className={`${s.color} opacity-60 group-hover:opacity-100 transition-opacity`}>{s.icon}</span>
                                    <span className="text-xs text-[#2B463C]/60 group-hover:text-[#2B463C] font-medium transition-colors">{s.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-1.5 mt-8 text-[10px] text-[#2B463C]/20">
                            <Database className="h-3 w-3" />
                            <span>Conectado a la base de datos en tiempo real</span>
                        </div>
                    </div>
                ) : (
                    /* Messages */
                    <div className="p-4 space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] ${msg.role === 'user' ? '' : 'flex gap-2.5'}`}>
                                    {msg.role === 'assistant' && (
                                        <div className="w-7 h-7 bg-gradient-to-br from-[#F28C73] to-[#E06B52] rounded-lg flex items-center justify-center text-white flex-shrink-0 mt-0.5 shadow-sm">
                                            <BotMessageSquare className="h-3.5 w-3.5" />
                                        </div>
                                    )}
                                    <div>
                                        <div
                                            className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                                ? 'bg-[#2B463C] text-white rounded-br-md'
                                                : 'bg-[#FAFAF8] text-[#2B463C] border border-[#2B463C]/5 rounded-bl-md'
                                                }`}
                                        >
                                            {msg.isLoading ? (
                                                <div className="flex items-center gap-2 py-0.5">
                                                    <Loader2 className="h-4 w-4 animate-spin text-[#F28C73]" />
                                                    <span className="text-xs text-[#2B463C]/40 font-medium">Consultando datos...</span>
                                                </div>
                                            ) : (
                                                <div className="whitespace-pre-wrap">{msg.content}</div>
                                            )}
                                        </div>

                                        {/* SQL toggle */}
                                        {msg.role === 'assistant' && msg.sql && !msg.isLoading && (
                                            <div className="mt-1.5">
                                                <button
                                                    onClick={() => setShowSQLFor(showSQLFor === msg.id ? null : msg.id)}
                                                    className="flex items-center gap-1 text-[10px] text-[#2B463C]/25 hover:text-[#F28C73] transition-colors font-medium"
                                                >
                                                    <Code2 className="h-3 w-3" />
                                                    {showSQLFor === msg.id ? 'Ocultar SQL' : 'Ver SQL'}
                                                    <ChevronDown className={`h-3 w-3 transition-transform ${showSQLFor === msg.id ? 'rotate-180' : ''}`} />
                                                </button>
                                                {showSQLFor === msg.id && (
                                                    <pre className="mt-1.5 p-3 rounded-lg bg-[#2B463C] text-emerald-300 text-[11px] overflow-x-auto font-mono leading-relaxed">
                                                        {msg.sql}
                                                    </pre>
                                                )}
                                            </div>
                                        )}

                                        <div className={`text-[9px] mt-1 ${msg.role === 'user' ? 'text-right text-[#2B463C]/20' : 'text-[#2B463C]/20'}`}>
                                            {msg.timestamp.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input area */}
            <div className="flex-shrink-0 mt-3">
                <div className="flex items-center gap-2 bg-white rounded-xl border border-[#2B463C]/5 shadow-sm px-4 py-2 focus-within:border-[#F28C73]/30 focus-within:shadow-md focus-within:shadow-[#F28C73]/5 transition-all">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Pregunta sobre los datos del sistema..."
                        disabled={isLoading}
                        className="flex-1 bg-transparent text-sm text-[#2B463C] placeholder:text-[#2B463C]/25 outline-none py-1.5 font-medium"
                        autoFocus
                    />
                    <button
                        onClick={() => sendMessage()}
                        disabled={isLoading || !input.trim()}
                        className="w-9 h-9 rounded-lg bg-[#2B463C] text-white flex items-center justify-center hover:bg-[#F28C73] disabled:opacity-30 disabled:hover:bg-[#2B463C] transition-colors flex-shrink-0 shadow-sm"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </button>
                </div>
                <p className="text-center text-[9px] text-[#2B463C]/15 mt-2 font-medium">
                    Komi AI consulta datos reales de la base de datos • Las respuestas son tan precisas como los datos registrados
                </p>
            </div>
        </div>
    )
}
