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
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-white shadow-lg"
                />
            ) : (
                <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-bold ring-4 ring-white shadow-lg ${isVictima ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                    {initials}
                </div>
            )}

            {/* Upload button overlay */}
            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 disabled:opacity-50"
                title="Subir foto"
            >
                {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Camera className="h-4 w-4" />
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
