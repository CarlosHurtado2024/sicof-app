'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, Check, CheckCheck, ExternalLink, AlertTriangle, Info, FileText, Settings, ClipboardList, Siren } from 'lucide-react'
import { useNotifications, type NotificacionInterna } from '@/lib/hooks/useNotifications'
import { useRouter } from 'next/navigation'

interface NotificationBellProps {
    userId: string
}

const TIPO_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
    INFO: { icon: <Info className="w-4 h-4" />, color: 'text-blue-600', bg: 'bg-blue-50' },
    ALERTA: { icon: <Siren className="w-4 h-4 animate-pulse" />, color: 'text-red-600', bg: 'bg-red-50' },
    CASO: { icon: <FileText className="w-4 h-4" />, color: 'text-violet-600', bg: 'bg-violet-50' },
    SISTEMA: { icon: <Settings className="w-4 h-4" />, color: 'text-slate-600', bg: 'bg-slate-100' },
    TAREA: { icon: <ClipboardList className="w-4 h-4" />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Ahora'
    if (mins < 60) return `${mins}m`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h`
    const days = Math.floor(hours / 24)
    return `${days}d`
}

export default function NotificationBell({ userId }: NotificationBellProps) {
    const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications(userId)
    const [open, setOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    // Close dropdown on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        if (open) {
            document.addEventListener('mousedown', handleClick)
        }
        return () => document.removeEventListener('mousedown', handleClick)
    }, [open])

    const handleNotifClick = async (notif: NotificacionInterna) => {
        if (!notif.leida) {
            await markAsRead(notif.id)
        }
        if (notif.enlace) {
            router.push(notif.enlace)
            setOpen(false)
        }
    }

    // Effect to play alert sound 3 times for new crisis notifications
    useEffect(() => {
        if (notifications.length > 0) {
            const newestNotif = notifications[0]
            // Only play if it's an unread ALERTA (crisis) and it was just received (within last 10 seconds to avoid re-play on mount)
            const isJustReceived = (Date.now() - new Date(newestNotif.created_at).getTime()) < 10000

            if (newestNotif.tipo === 'ALERTA' && !newestNotif.leida && isJustReceived) {
                playCrisisSound(3)
            }
        }
    }, [notifications])

    const playCrisisSound = (times: number) => {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()

        let count = 0
        const playOne = () => {
            if (count >= times) {
                audioCtx.close()
                return
            }

            const oscillator = audioCtx.createOscillator()
            const gainNode = audioCtx.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(audioCtx.destination)

            oscillator.type = 'sine'
            oscillator.frequency.setValueAtTime(880, audioCtx.currentTime) // A5 note

            gainNode.gain.setValueAtTime(0, audioCtx.currentTime)
            gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.05)
            gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3)

            oscillator.start(audioCtx.currentTime)
            oscillator.stop(audioCtx.currentTime + 0.3)

            count++
            setTimeout(playOne, 800) // 800ms between beeps
        }

        playOne()
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setOpen(!open)}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl text-slate-500 hover:text-[#7C3AED] hover:bg-violet-50 transition-all"
                aria-label="Notificaciones"
            >
                <Bell className="w-5 h-5" />
                {/* Red dot for unread */}
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-[9px] font-bold text-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div className="fixed inset-x-3 top-14 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 w-auto sm:w-96 max-h-[480px] bg-white rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-200/60 overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-900">Notificaciones</h3>
                            {unreadCount > 0 && (
                                <span className="bg-violet-100 text-[#7C3AED] text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    {unreadCount} nueva{unreadCount > 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="flex items-center gap-1 text-xs text-[#7C3AED] hover:text-[#6D28D9] font-medium transition-colors"
                            >
                                <CheckCheck className="w-3.5 h-3.5" />
                                Marcar todas
                            </button>
                        )}
                    </div>

                    {/* Notification List */}
                    <div className="overflow-y-auto max-h-[400px]">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="w-6 h-6 border-2 border-violet-200 border-t-[#7C3AED] rounded-full animate-spin" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-14 text-slate-400">
                                <Bell className="w-10 h-10 mb-3 opacity-30" />
                                <p className="text-sm font-medium">Sin notificaciones</p>
                                <p className="text-xs mt-1">Las notificaciones aparecerán aquí</p>
                            </div>
                        ) : (
                            notifications.map((notif) => {
                                const config = TIPO_CONFIG[notif.tipo] || TIPO_CONFIG.INFO
                                return (
                                    <button
                                        key={notif.id}
                                        onClick={() => handleNotifClick(notif)}
                                        className={`w-full flex items-start gap-3 px-5 py-3.5 text-left transition-colors hover:bg-slate-50 border-b border-slate-50 last:border-0 ${!notif.leida ? 'bg-violet-50/30' : ''
                                            }`}
                                    >
                                        {/* Icon */}
                                        <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${config.bg} ${config.color} mt-0.5`}>
                                            {config.icon}
                                        </div>
                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className={`text-sm leading-snug ${!notif.leida ? 'font-semibold text-slate-900' : 'font-medium text-slate-600'}`}>
                                                    {notif.titulo}
                                                </p>
                                                <span className="text-[10px] text-slate-400 flex-shrink-0 mt-0.5 font-medium">
                                                    {timeAgo(notif.created_at)}
                                                </span>
                                            </div>
                                            {notif.mensaje && (
                                                <p className="text-xs text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                                                    {notif.mensaje}
                                                </p>
                                            )}
                                            {notif.enlace && (
                                                <span className="inline-flex items-center gap-1 text-[10px] text-[#7C3AED] font-medium mt-1.5">
                                                    Ver detalle <ExternalLink className="w-2.5 h-2.5" />
                                                </span>
                                            )}
                                        </div>
                                        {/* Unread indicator */}
                                        {!notif.leida && (
                                            <div className="flex-shrink-0 w-2 h-2 bg-[#7C3AED] rounded-full mt-2" />
                                        )}
                                    </button>
                                )
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
