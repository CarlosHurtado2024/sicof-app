'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface NotificacionInterna {
    id: string
    usuario_id: string
    titulo: string
    mensaje: string | null
    tipo: 'INFO' | 'ALERTA' | 'CASO' | 'SISTEMA' | 'TAREA'
    leida: boolean
    enlace: string | null
    expediente_id: string | null
    created_at: string
}

export function useNotifications(userId: string) {
    const [notifications, setNotifications] = useState<NotificacionInterna[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    // Fetch notifications
    const fetchNotifications = useCallback(async () => {
        const { data, error } = await supabase
            .from('notificaciones_internas')
            .select('*')
            .eq('usuario_id', userId)
            .order('created_at', { ascending: false })
            .limit(30)

        if (!error && data) {
            setNotifications(data)
            setUnreadCount(data.filter((n: NotificacionInterna) => !n.leida).length)
        }
        setLoading(false)
    }, [supabase, userId])

    // Mark one as read
    const markAsRead = useCallback(async (id: string) => {
        await supabase
            .from('notificaciones_internas')
            .update({ leida: true })
            .eq('id', id)

        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, leida: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
    }, [supabase])

    // Mark all as read
    const markAllAsRead = useCallback(async () => {
        await supabase
            .from('notificaciones_internas')
            .update({ leida: true })
            .eq('usuario_id', userId)
            .eq('leida', false)

        setNotifications(prev => prev.map(n => ({ ...n, leida: true })))
        setUnreadCount(0)
    }, [supabase, userId])

    useEffect(() => {
        fetchNotifications()

        // Realtime subscription for new notifications
        const channel = supabase
            .channel('user-notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notificaciones_internas',
                    filter: `usuario_id=eq.${userId}`
                },
                (payload) => {
                    const newNotif = payload.new as NotificacionInterna
                    setNotifications(prev => [newNotif, ...prev].slice(0, 30))
                    setUnreadCount(prev => prev + 1)
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [fetchNotifications, supabase, userId])

    return {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        refresh: fetchNotifications,
    }
}
