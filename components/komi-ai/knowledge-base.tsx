"use client"

import { useState, useRef, useEffect } from "react"
import {
    UploadCloud,
    FileText,
    Send,
    Loader2,
    BotMessageSquare,
    Scale,
    AlertCircle,
    CheckCircle2,
    Trash2,
    X
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Document {
    id: string
    title: string
    filename: string
    created_at: string
}

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    sources?: string[]
}

export default function KnowledgeBaseClient() {
    const [documents, setDocuments] = useState<Document[]>([])
    const [isUploading, setIsUploading] = useState(false)
    const [isDeletingId, setIsDeletingId] = useState<string | null>(null)
    const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null)
    const [uploadStatus, setUploadStatus] = useState<{ type: 'error' | 'success', message: string } | null>(null)

    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isChatting, setIsChatting] = useState(false)
    const [showMobileDocs, setShowMobileDocs] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Cargar documentos al iniciar
    useEffect(() => {
        fetchDocuments()
    }, [])

    const fetchDocuments = async () => {
        try {
            const res = await fetch("/api/knowledge/upload")
            if (res.ok) {
                const data = await res.json()
                setDocuments(data)
            }
        } catch (error) {
            console.error("Error fetching docs:", error)
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.type !== "application/pdf") {
            setUploadStatus({ type: 'error', message: 'Solo se permiten archivos PDF.' })
            return
        }

        setIsUploading(true)
        setUploadStatus(null)

        const formData = new FormData()
        formData.append("file", file)

        try {
            const res = await fetch("/api/knowledge/upload", {
                method: "POST",
                body: formData
            })

            const data = await res.json()
            if (res.ok) {
                setUploadStatus({ type: 'success', message: `¡Procesado exitosamente!` })
                fetchDocuments()
                setTimeout(() => setUploadStatus(null), 5000)
            } else {
                setUploadStatus({ type: 'error', message: data.error || "Error al subir documento" })
            }
        } catch (error: any) {
            setUploadStatus({ type: 'error', message: error.message || "Error al subir documento" })
        } finally {
            setIsUploading(false)
            // Reset input
            e.target.value = ""
        }
    }

    const handleDeleteDocument = async (id: string) => {
        setIsDeletingId(id);
        setUploadStatus(null);
        setDocumentToDelete(null);

        try {
            const res = await fetch(`/api/knowledge/upload?id=${id}`, {
                method: "DELETE"
            });

            if (res.ok) {
                setUploadStatus({ type: 'success', message: "Documento eliminado correctamente." });
                setDocuments(prev => prev.filter(doc => doc.id !== id));
            } else {
                const data = await res.json();
                setUploadStatus({ type: 'error', message: data.error || "Error al eliminar documento" });
            }
        } catch (error: any) {
            setUploadStatus({ type: 'error', message: error.message || "Error al eliminar documento" });
        } finally {
            setIsDeletingId(null);
        }
    }

    const handleSendMessage = async () => {
        const question = input.trim()
        if (!question || isChatting) return

        if (documents.length === 0) {
            setInput("")
            const userMsgId = crypto.randomUUID()
            const botMsgId = crypto.randomUUID()

            setMessages(prev => [
                ...prev,
                { id: userMsgId, role: "user", content: question },
                { id: botMsgId, role: "assistant", content: "Aún no hay documentos en la base de conocimiento. Sube un archivo en el panel izquierdo para empezar a interactuar con tus documentos." }
            ])
            return;
        }

        setInput("")

        const userMsgId = crypto.randomUUID()
        const botMsgId = crypto.randomUUID()

        setMessages(prev => [
            ...prev,
            { id: userMsgId, role: "user", content: question },
            { id: botMsgId, role: "assistant", content: "..." } // Loading state
        ])

        setIsChatting(true)

        try {
            const res = await fetch("/api/knowledge/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question })
            })

            const data = await res.json()

            setMessages(prev => prev.map(msg =>
                msg.id === botMsgId
                    ? { id: botMsgId, role: "assistant", content: data.answer || data.error, sources: data.sources }
                    : msg
            ))
        } catch (error) {
            setMessages(prev => prev.map(msg =>
                msg.id === botMsgId
                    ? { id: botMsgId, role: "assistant", content: "Ocurrió un error de red al consultar la base de datos de conocimiento." }
                    : msg
            ))
        } finally {
            setIsChatting(false)
        }
    }

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    return (
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-6 h-full sm:h-[calc(100vh-12rem)]">

            {/* Lado Izquierdo: Documentos (Oculto en móvil por defecto, o mostrado como modal a pantalla completa) */}
            <div className={`
                ${showMobileDocs ? 'fixed inset-0 z-50 flex bg-[#0d141b] p-4 flex-col overflow-y-auto animate-in slide-in-from-left-full' : 'hidden'} 
                lg:relative lg:flex lg:p-0 lg:bg-transparent lg:z-auto
                w-full lg:w-1/3 flex-col gap-4
            `}>

                {showMobileDocs && (
                    <div className="flex justify-between items-center mb-2 lg:hidden">
                        <h2 className="text-white font-bold text-xl">Tus Documentos</h2>
                        <button
                            onClick={() => setShowMobileDocs(false)}
                            className="bg-white/10 p-2 rounded-full text-white/70 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}
                {/* Caja de subida */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 backdrop-blur-sm">
                    <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <UploadCloud className="h-5 w-5 text-[#ff7a59]" />
                        Subir Documento (PDF)
                    </h2>

                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/[0.1] border-dashed rounded-xl cursor-pointer bg-white/[0.01] hover:bg-white/[0.04] transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {isUploading ? (
                                <Loader2 className="w-8 h-8 text-[#ff7a59] mb-3 animate-spin" />
                            ) : (
                                <FileText className="w-8 h-8 text-white/40 mb-3" />
                            )}
                            <p className="mb-2 text-sm text-white/70">
                                <span className="font-semibold">Click para subir</span> o arrastra un archivo
                            </p>
                            <p className="text-xs text-white/40">PDF (Leyes, Jurisprudencia, Lineamientos)</p>
                        </div>
                        <input type="file" className="hidden" accept=".pdf" disabled={isUploading} onChange={handleFileUpload} />
                    </label>

                    {uploadStatus && (
                        <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 text-sm ${uploadStatus.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}>
                            {uploadStatus.type === 'error' ? <AlertCircle className="w-4 h-4 mt-0.5" /> : <CheckCircle2 className="w-4 h-4 mt-0.5" />}
                            <span>{uploadStatus.message}</span>
                        </div>
                    )}
                </div>

                {/* Lista de documentos */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 backdrop-blur-sm flex-1 flex flex-col overflow-hidden">
                    <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <Scale className="h-5 w-5 text-indigo-400" />
                        Base de Conocimiento ({documents.length})
                    </h2>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                        {documents.length === 0 ? (
                            <div className="text-center text-white/40 py-8 text-sm">
                                Aún no has subido ningún documento legal a la base de conocimiento vectorial.
                            </div>
                        ) : (
                            documents.map(doc => (
                                <div key={doc.id} className="p-3 bg-black/20 border border-white/5 rounded-xl flex items-center justify-between gap-3 group transition-colors hover:bg-black/30">
                                    <div className="flex items-center gap-3 overflow-hidden flex-1">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-white text-sm font-medium truncate" title={doc.title}>{doc.title}</p>
                                            <p className="text-white/40 text-xs">
                                                {new Date(doc.created_at).toLocaleDateString('es-CO')}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setDocumentToDelete(doc)}
                                        disabled={isDeletingId === doc.id}
                                        className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors flex-shrink-0 disabled:opacity-50"
                                        title="Eliminar documento"
                                    >
                                        {isDeletingId === doc.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Lado Derecho: Chat AI */}
            <div className="w-full lg:w-2/3 flex flex-col bg-white/[0.03] border-t lg:border border-white/[0.08] lg:rounded-2xl lg:backdrop-blur-sm overflow-hidden h-full">

                {/* Header del chat */}
                <div className="p-3 lg:p-4 border-b border-white/[0.08] flex items-center justify-between gap-3 bg-black/20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#ff7a59] to-[#e06b47] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#ff7a59]/20">
                            <BotMessageSquare className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-white font-bold leading-none">Komi Legal</h2>
                            <p className="text-[10px] text-white/40 font-medium uppercase tracking-widest mt-1">Busca en tus documentos</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowMobileDocs(true)}
                        className="lg:hidden flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 rounded-lg text-white text-xs font-medium transition-colors"
                    >
                        <FileText className="w-4 h-4 text-[#ff7a59]" />
                        <span className="hidden sm:inline">Fuentes</span>
                    </button>
                </div>

                {/* Área de mensajes */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center max-w-sm mx-auto">
                            <Scale className="w-12 h-12 text-white/10 mb-4" />
                            <h3 className="text-white font-medium mb-2">Asistente Legal RAG</h3>
                            <p className="text-sm text-white/40 leading-relaxed">
                                Pregúntame sobre cualquier tema que esté documentado en los PDFs que has subido a la plataforma. Yo leeré los documentos y te daré una respuesta fundamentada.
                            </p>
                        </div>
                    ) : (
                        messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] ${msg.role === 'assistant' ? 'flex gap-3' : ''}`}>
                                    {msg.role === 'assistant' && (
                                        <div className="w-8 h-8 bg-gradient-to-br from-[#ff7a59] to-[#e06b47] rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-sm mt-1">
                                            <BotMessageSquare className="h-4 w-4" />
                                        </div>
                                    )}
                                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-[#ff7a59] text-white rounded-br-sm'
                                        : 'bg-white/[0.05] border border-white/10 text-white/90 rounded-bl-sm'
                                        }`}>
                                        {msg.content === "..." ? (
                                            <div className="flex items-center gap-2 text-white/50">
                                                <Loader2 className="w-4 h-4 animate-spin" /> Buscando jurisprudencia en tus PDFs...
                                            </div>
                                        ) : (
                                            msg.role === 'assistant' ? (
                                                <div className="markdown-prose space-y-3">
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
                                                        components={{
                                                            p: ({ node, ...props }) => <p className="leading-relaxed text-white/90" {...props} />,
                                                            ul: ({ node, ...props }) => <ul className="list-disc pl-5 mt-2 space-y-1 marker:text-[#ff7a59]" {...props} />,
                                                            ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mt-2 space-y-1 marker:text-[#ff7a59]" {...props} />,
                                                            li: ({ node, ...props }) => <li className="text-white/80" {...props} />,
                                                            strong: ({ node, ...props }) => <strong className="font-semibold text-white" {...props} />,
                                                            a: ({ node, ...props }) => <a className="text-[#ff7a59] hover:underline" {...props} />
                                                        }}
                                                    >
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                </div>
                                            ) : (
                                                <div className="whitespace-pre-wrap">{msg.content}</div>
                                            )
                                        )}

                                        {/* Fuentes usadas */}
                                        {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                                            <div className="mt-3 pt-3 border-t border-white/5">
                                                <p className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-2">Basado en:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {msg.sources.map((srcId, i) => {
                                                        const doc = documents.find(d => d.id === srcId)
                                                        return doc ? (
                                                            <div key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded overflow-hidden truncate max-w-[200px] text-[10px] text-indigo-300">
                                                                📄 {doc.title}
                                                            </div>
                                                        ) : null
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/[0.08] bg-black/10">
                    <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 focus-within:border-[#ff7a59] focus-within:bg-white/[0.05] transition-all">
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && !isChatting && handleSendMessage()}
                            placeholder="Ej: ¿Cuál es el procedimiento según la ley 2126?"
                            disabled={isChatting}
                            className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder:text-white/30"
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={isChatting || !input.trim()}
                            className="w-8 h-8 rounded-lg bg-[#ff7a59] text-white flex items-center justify-center hover:bg-[#ff6b47] disabled:opacity-50 transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>

            </div>

            {/* Modal de confirmación de eliminación */}
            {documentToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                                    <Trash2 className="w-5 h-5 text-red-500" />
                                </div>
                                <button
                                    onClick={() => setDocumentToDelete(null)}
                                    className="text-white/40 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <h3 className="text-lg font-medium text-white mb-2">Eliminar documento</h3>
                            <p className="text-sm text-white/60 mb-4">
                                ¿Estás seguro de que quieres eliminar <span className="text-white font-medium">"{documentToDelete.title}"</span>? Esta acción no se puede deshacer y Komi Legal ya no podrá usar esta información.
                            </p>

                            <div className="flex gap-3 justify-end mt-6">
                                <button
                                    onClick={() => setDocumentToDelete(null)}
                                    className="px-4 py-2 rounded-xl text-sm font-medium text-white hover:bg-white/5 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => handleDeleteDocument(documentToDelete.id)}
                                    className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-colors shadow-lg shadow-red-500/20"
                                >
                                    Sí, eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
