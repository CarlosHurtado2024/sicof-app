'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { atenderCrisis } from '@/lib/actions/crisis'
import { useRouter } from 'next/navigation'

export interface AlertaCrisis {
    id: string
    expediente_id: string
    radicado: string
    nombre_victima: string
    tipologia: string
    descripcion: string
    created_at: string
}

const ALERT_SOUND_BASE64 = 'data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAFAAAAZAAACmAAZmZmszMzMwAAAAAAZmZmszMzMwAAAAAAZmZmszMzMwAAAAAAZmZmszMzMwAAAAAA//uQxAAACkIJeAAeMAAAAAA0gAAABP4h4AAYAAAAAAqgAAAAAAAAARi4AAaQAAAAAAABzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMz//uQxAAACkIJeAAeMAAAAAA0gAAABP4h4AAYAAAAAAqgAAAAAAAAARi4AAaQAAAAAAABzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMz//uQxAHACSAJdAAeUAAAAAA0gAAABMIh4AAYAAAAAAqgAAAAAAAAARi4AAaQAAAAAAABzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMz//uQxATACSAJdAAeUAAAAAA0gAAABMIh4AAYAAAAAAqgAAAAAAAAARi4AAaQAAAAAAABzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMz'

export function useCrisisAlerts(userRole: string | undefined, userId: string) {
    const [alerta, setAlerta] = useState<AlertaCrisis | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const router = useRouter()
    const supabase = createClient()

    // Solo roles psicosociales y administrativos reciben alertas
    const canReceiveAlerts = ['PSICOLOGO', 'TRABAJADOR_SOCIAL', 'COMISARIO', 'ADMINISTRADOR'].includes(userRole || '')

    useEffect(() => {
        if (!canReceiveAlerts) return

        // Inicializar audio
        audioRef.current = new Audio(ALERT_SOUND_BASE64)

        // Cargar alertas pendientes iniciales
        const fetchPendingAlerts = async () => {
            const { data } = await supabase
                .from('alertas_crisis')
                .select('*')
                .eq('estado', 'PENDIENTE')
                .order('created_at', { ascending: false })
                .limit(1)

            if (data && data.length > 0) {
                setAlerta(data[0])
            }
        }

        fetchPendingAlerts()

        // Suscribirse a nuevas alertas
        const channel = supabase
            .channel('crisis-alerts')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'alertas_crisis',
                    filter: 'estado=eq.PENDIENTE'
                },
                (payload) => {
                    console.log('🚨 ALERTA DE CRISIS RECIBIDA:', payload)
                    setAlerta(payload.new as AlertaCrisis)
                    playAlertSound()
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'alertas_crisis'
                },
                (payload) => {
                    // Si la alerta actual fue atendida (por otro o por mi), limpiarla
                    if (alerta && payload.new.id === alerta.id && payload.new.estado !== 'PENDIENTE') {
                        setAlerta(null)
                        stopAlertSound()
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [canReceiveAlerts, supabase, userId, alerta])

    const playAlertSound = () => {
        if (audioRef.current) {
            audioRef.current.loop = true
            audioRef.current.play().catch(e => console.log('Error playing sound:', e))
        }
    }

    const stopAlertSound = () => {
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        }
    }

    const atender = async () => {
        if (!alerta) return

        try {
            stopAlertSound()
            setAlerta(null) // Optimistic update
            await atenderCrisis(alerta.id)
            router.push(`/dashboard/casos/${alerta.radicado}`)
        } catch (error) {
            console.error('Error atendiendo crisis:', error)
        }
    }

    const descartar = () => {
        stopAlertSound()
        setAlerta(null)
    }

    return {
        alerta,
        atender,
        descartar
    }
}
