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
                src="/svg_komi.svg"
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
    const textColor = inverted ? "text-white" : "text-[#2B463C]"
    const subtitleColor = inverted ? "text-white/40" : "text-[#F28482]"

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <SicofLogoIcon className={iconClassName} inverted={inverted} />
            <div className="flex flex-col">
                <span className={`font-black text-xl tracking-tighter leading-none font-serif ${textColor}`}>Komi</span>
                {showSubtitle && (
                    <span className={`text-[8px] font-black tracking-[0.2em] uppercase ${subtitleColor}`}>
                        Justicia Humana
                    </span>
                )}
            </div>
        </div>
    )
}
