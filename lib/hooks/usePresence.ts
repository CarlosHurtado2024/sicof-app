'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

export interface PresenceUser {
  userId: string
  nombre: string
  email: string
  rol: string
  status: 'online' | 'away' | 'offline'
  lastSeen: string
  onlineAt: string
}

export function usePresence(currentUser: {
  id: string
  nombre: string
  email: string
  rol: string
} | null) {
  const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([])
  const [allUsers, setAllUsers] = useState<PresenceUser[]>([])
  const channelRef = useRef<RealtimeChannel | null>(null)
  const supabase = createClient()

  // Fetch all users from DB (for offline users display)
  const fetchAllUsers = useCallback(async () => {
    const { data: usuarios } = await supabase
      .from('usuarios')
      .select('id, email, nombre, rol')

    const { data: presenceData } = await supabase
      .from('user_presence')
      .select('user_id, last_seen, status')

    if (usuarios) {
      const presenceMap = new Map(
        presenceData?.map(p => [p.user_id, p]) || []
      )

      return usuarios.map(u => ({
        userId: u.id,
        nombre: u.nombre || u.email || 'Sin nombre',
        email: u.email || '',
        rol: u.rol || 'USUARIO_EXTERNO',
        status: (presenceMap.get(u.id)?.status || 'offline') as 'online' | 'away' | 'offline',
        lastSeen: presenceMap.get(u.id)?.last_seen || '',
        onlineAt: '',
      }))
    }
    return []
  }, [supabase])

  // Update own presence in DB
  const updatePresenceDB = useCallback(async (status: 'online' | 'away' | 'offline') => {
    if (!currentUser) return

    await supabase
      .from('user_presence')
      .upsert({
        user_id: currentUser.id,
        last_seen: new Date().toISOString(),
        status,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
  }, [currentUser, supabase])

  useEffect(() => {
    if (!currentUser) return

    let isActive = true
    let activityTimeout: NodeJS.Timeout | null = null

    const setup = async () => {
      // Mark online in DB
      await updatePresenceDB('online')

      // Load all users
      const users = await fetchAllUsers()
      if (isActive) setAllUsers(users)

      // Setup realtime presence channel
      const channel = supabase.channel('sicof-presence', {
        config: {
          presence: {
            key: currentUser.id,
          },
        },
      })

      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState()
          const presences: PresenceUser[] = []

          Object.entries(state).forEach(([key, values]) => {
            const val = values[0] as any
            if (val) {
              presences.push({
                userId: val.userId || key,
                nombre: val.nombre || 'Sin nombre',
                email: val.email || '',
                rol: val.rol || 'USUARIO_EXTERNO',
                status: val.status || 'online',
                lastSeen: val.lastSeen || new Date().toISOString(),
                onlineAt: val.onlineAt || new Date().toISOString(),
              })
            }
          })

          if (isActive) {
            setOnlineUsers(presences)

            // Merge online status with all users
            setAllUsers(prev => 
              prev.map(u => {
                const onlineUser = presences.find(p => p.userId === u.userId)
                if (onlineUser) {
                  return { ...u, status: 'online' as const, lastSeen: new Date().toISOString() }
                }
                return u
              })
            )
          }
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          // Refresh all users when someone joins
          fetchAllUsers().then(users => {
            if (isActive) setAllUsers(users)
          })
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          // Refresh all users when someone leaves
          fetchAllUsers().then(users => {
            if (isActive) setAllUsers(users)
          })
        })
        .subscribe(async (status) => {
          if (status !== 'SUBSCRIBED') return

          await channel.track({
            userId: currentUser.id,
            nombre: currentUser.nombre,
            email: currentUser.email,
            rol: currentUser.rol,
            status: 'online',
            onlineAt: new Date().toISOString(),
            lastSeen: new Date().toISOString(),
          })
        })

      channelRef.current = channel

      // Activity tracking: detect if user is away
      const handleActivity = () => {
        if (activityTimeout) clearTimeout(activityTimeout)

        // If was away, come back online
        const currentPresence = onlineUsers.find(u => u.userId === currentUser.id)
        if (currentPresence?.status === 'away') {
          channel.track({
            userId: currentUser.id,
            nombre: currentUser.nombre,
            email: currentUser.email,
            rol: currentUser.rol,
            status: 'online',
            onlineAt: new Date().toISOString(),
            lastSeen: new Date().toISOString(),
          })
          updatePresenceDB('online')
        }

        // Set away timeout (5 minutes)
        activityTimeout = setTimeout(() => {
          channel.track({
            userId: currentUser.id,
            nombre: currentUser.nombre,
            email: currentUser.email,
            rol: currentUser.rol,
            status: 'away',
            onlineAt: new Date().toISOString(),
            lastSeen: new Date().toISOString(),
          })
          updatePresenceDB('away')
        }, 5 * 60 * 1000)
      }

      window.addEventListener('mousemove', handleActivity)
      window.addEventListener('keydown', handleActivity)
      window.addEventListener('click', handleActivity)
      window.addEventListener('scroll', handleActivity)

      // Handle browser close/navigate away
      const handleBeforeUnload = () => {
        updatePresenceDB('offline')
      }
      window.addEventListener('beforeunload', handleBeforeUnload)

      return () => {
        window.removeEventListener('mousemove', handleActivity)
        window.removeEventListener('keydown', handleActivity)
        window.removeEventListener('click', handleActivity)
        window.removeEventListener('scroll', handleActivity)
        window.removeEventListener('beforeunload', handleBeforeUnload)
        if (activityTimeout) clearTimeout(activityTimeout)
      }
    }

    const cleanupPromise = setup()

    // Heartbeat: update last_seen every 30 seconds
    const heartbeat = setInterval(() => {
      updatePresenceDB('online')
    }, 30000)

    return () => {
      isActive = false
      clearInterval(heartbeat)
      if (channelRef.current) {
        updatePresenceDB('offline')
        supabase.removeChannel(channelRef.current)
      }
      cleanupPromise.then(cleanup => cleanup?.())
    }
  }, [currentUser?.id])

  return { onlineUsers, allUsers }
}
