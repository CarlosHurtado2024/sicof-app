'use client'

import { useState, useRef } from 'react'
import { Camera, Loader2, User, UserX } from 'lucide-react'
import { subirFotoPersona } from '@/lib/actions/personas'

interface PersonaPhotoProps {
    personaId: string
    currentPhotoUrl: string | null
    initials: string
    tipo: string
}

export default function PersonaPhoto({ personaId, currentPhotoUrl, initials, tipo }: PersonaPhotoProps) {
    const [photoUrl, setPhotoUrl] = useState(currentPhotoUrl)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        setError(null)

        try {
            const formData = new FormData()
            formData.append('foto', file)
            const result = await subirFotoPersona(personaId, formData)
            if (result.success && result.url) {
                setPhotoUrl(result.url + '?t=' + Date.now()) // Cache bust
            }
        } catch (err: any) {
            setError(err.message || 'Error subiendo la foto')
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const isVictima = tipo === 'VICTIMA'

    return (
        <div className="relative inline-block">
            {/* Photo / Avatar */}
            {photoUrl ? (
                <img
                    src={photoUrl}
                    alt="Foto de persona"
                    className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl object-cover ring-8 ring-white shadow-2xl shadow-slate-200/50"
                />
            ) : (
                <div className={`w-20 h-20 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center text-2xl sm:text-3xl font-black ring-8 ring-white shadow-2xl shadow-slate-200/50 transition-all duration-500 scale-100 group-hover:scale-105 ${isVictima ? 'bg-blue-50 text-blue-300 border border-blue-100' : 'bg-red-50 text-red-300 border border-red-100'}`}>
                    {initials}
                </div>
            )}

            {/* Upload button overlay */}
            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-white border border-slate-100 hover:bg-slate-50 shadow-xl shadow-slate-200/50 text-blue-600 rounded-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-50 z-10"
                title="Subir foto"
            >
                {isUploading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <Camera className="h-5 w-5" />
                )}
            </button>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Error message */}
            {error && (
                <p className="absolute -bottom-6 left-0 text-[10px] text-red-500 whitespace-nowrap">{error}</p>
            )}
        </div>
    )
}
