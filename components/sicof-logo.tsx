"use client"

import Image from "next/image"

interface SicofLogoIconProps {
    className?: string
    inverted?: boolean
}

export function SicofLogoIcon({ className = "w-10 h-10", inverted = false }: SicofLogoIconProps) {
    return (
        <div className={`relative ${className}`} style={{ filter: inverted ? 'brightness(0) invert(1)' : 'none' }}>
            <Image
                src="/logo_komi.svg"
                alt="Komi Logo"
                fill
                className="object-contain"
                priority
            />
        </div>
    )
}

interface SicofLogoProps {
    className?: string
    iconClassName?: string
    inverted?: boolean
    showSubtitle?: boolean
}

export function SicofLogo({
    className = "",
    iconClassName = "w-10 h-10",
    inverted = false,
    showSubtitle = true,
}: SicofLogoProps) {
    const textColor = inverted ? "text-white" : "text-slate-900"
    const subtitleColor = inverted ? "text-white/30/60" : "text-purple-300"

    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            <SicofLogoIcon className={iconClassName} inverted={inverted} />
            <div className="flex flex-col">
                <span className={`font-bold text-lg tracking-tight leading-none ${textColor}`}>Komi</span>
                {showSubtitle && (
                    <span className={`text-[10px] font-semibold tracking-[0.08em] uppercase ${subtitleColor}`}>
                        Familia y Bienestar
                    </span>
                )}
            </div>
        </div>
    )
}
