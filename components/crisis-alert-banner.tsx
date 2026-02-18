'use client'

import { useCrisisAlerts } from '@/lib/hooks/useCrisisAlerts'
import { Button } from '@/components/ui/button'
import { Siren, X } from 'lucide-react'

interface CrisisAlertBannerProps {
    userRole: string | undefined
    userId: string
}

export function CrisisAlertBanner({ userRole, userId }: CrisisAlertBannerProps) {
    const { alerta, atender, descartar } = useCrisisAlerts(userRole, userId)

    if (!alerta) return null

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-red-600 text-white shadow-2xl animate-in slide-in-from-top duration-500">
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 animate-pulse">
                    <div className="p-2 bg-white/20 rounded-full">
                        <Siren className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            ¡ALERTA DE CRISIS!
                            <span className="text-xs bg-white/20 px-2 py-0.5 rounded font-mono">
                                {alerta.radicado}
                            </span>
                        </h3>
                        <p className="text-red-100 text-sm">
                            {alerta.nombre_victima} — {alerta.tipologia}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button
                        onClick={atender}
                        variant="secondary"
                        className="flex-1 sm:flex-none font-bold text-red-700 bg-white hover:bg-red-50 border-0 shadow-lg"
                    >
                        🚨 Atender Emergencia
                    </Button>
                    <Button
                        onClick={descartar}
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Progress bar effect for visual urgency */}
            <div className="h-1 w-full bg-red-800">
                <div className="h-full bg-yellow-400 w-full animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"></div>
            </div>
        </div>
    )
}
