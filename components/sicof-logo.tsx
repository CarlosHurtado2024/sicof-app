"use client"

import { useId } from "react"

interface SicofLogoIconProps {
    className?: string
    inverted?: boolean
}

export function SicofLogoIcon({ className = "w-10 h-10", inverted = false }: SicofLogoIconProps) {
    const rawId = useId()
    const gid = `sg${rawId.replace(/:/g, "x")}`

    const shieldFill = inverted ? "white" : `url(#${gid})`
    const fig = inverted ? "rgba(255,255,255,0.42)" : "rgba(255,255,255,0.95)"
    const line = inverted ? "rgba(255,255,255,0.42)" : "rgba(255,255,255,0.95)"

    return (
        <svg viewBox="0 0 100 112" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <defs>
                <linearGradient id={gid} x1="0" y1="0" x2="100" y2="112" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#A855F7" />
                    <stop offset="100%" stopColor="#5B21B6" />
                </linearGradient>
            </defs>

            {/* ── SHIELD / ESCUDO ── */}
            <path
                d="M50,2 C28,2 6,13 6,33 L6,62 C6,89 26,106 50,113 C74,106 94,89 94,62 L94,33 C94,13 72,2 50,2Z"
                fill={shieldFill}
            />

            {/* ── BALANZA DE JUSTICIA (arriba) ── */}
            {/* Pilar central */}
            <rect x="49" y="14" width="2" height="9" rx="1" fill={fig} />
            {/* Barra horizontal */}
            <rect x="36" y="22" width="28" height="2" rx="1" fill={fig} />
            {/* Cadena izquierda */}
            <line x1="37.5" y1="24" x2="37.5" y2="28" stroke={line} strokeWidth="1.5" strokeLinecap="round" />
            {/* Platillo izquierdo */}
            <path d="M33.5,28 Q37.5,33.5 41.5,28" stroke={line} strokeWidth="1.5" strokeLinecap="round" />
            {/* Cadena derecha */}
            <line x1="62.5" y1="24" x2="62.5" y2="28" stroke={line} strokeWidth="1.5" strokeLinecap="round" />
            {/* Platillo derecho */}
            <path d="M58.5,28 Q62.5,33.5 66.5,28" stroke={line} strokeWidth="1.5" strokeLinecap="round" />

            {/* ── ADULTO IZQUIERDO ── */}
            {/* Cabeza */}
            <circle cx="28" cy="50" r="8.5" fill={fig} />
            {/* Cuerpo (hombros anchos → adulto) */}
            <path d="M17,59 C17,59 14,82 28,84 C42,82 39,59 39,59 C35,55 21,55 17,59Z" fill={fig} />
            {/* Brazo derecho extendido hacia el niño */}
            <line x1="39" y1="67" x2="45" y2="71" stroke={line} strokeWidth="3.5" strokeLinecap="round" />

            {/* ── NIÑO (centro) ── */}
            {/* Cabeza (más pequeña, más baja) */}
            <circle cx="50" cy="55" r="6.5" fill={fig} />
            {/* Cuerpo pequeño */}
            <path d="M42,62 C42,62 40,80 50,82 C60,80 58,62 58,62 C55,58 45,58 42,62Z" fill={fig} />
            {/* Mano izquierda del niño */}
            <circle cx="42" cy="72" r="2.5" fill={fig} />
            {/* Mano derecha del niño */}
            <circle cx="58" cy="72" r="2.5" fill={fig} />

            {/* ── ADULTO DERECHO ── */}
            {/* Cabeza */}
            <circle cx="72" cy="50" r="8.5" fill={fig} />
            {/* Cuerpo */}
            <path d="M61,59 C61,59 58,82 72,84 C86,82 83,59 83,59 C79,55 65,55 61,59Z" fill={fig} />
            {/* Brazo izquierdo extendido hacia el niño */}
            <line x1="61" y1="67" x2="55" y2="71" stroke={line} strokeWidth="3.5" strokeLinecap="round" />

            {/* ── CORAZÓN en la base del escudo (familia + amor) ── */}
            <path
                d="M50,97 C47.5,93 41,91.5 41,95.5 C41,98.5 45,101 50,106 C55,101 59,98.5 59,95.5 C59,91.5 52.5,93 50,97Z"
                fill={fig}
            />
        </svg>
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
    const subtitleColor = inverted ? "text-violet-200/60" : "text-slate-400"

    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            <SicofLogoIcon className={iconClassName} inverted={inverted} />
            <div className="flex flex-col">
                <span className={`font-bold text-lg tracking-tight leading-none ${textColor}`}>SICOF</span>
                {showSubtitle && (
                    <span className={`text-[10px] font-medium tracking-widest uppercase ${subtitleColor}`}>
                        gov platform
                    </span>
                )}
            </div>
        </div>
    )
}
