'use client'

import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { SicofLogoIcon } from "@/components/sicof-logo"

export default function Home() {
  return (
    <div className="font-[Inter,system-ui,sans-serif] bg-[#050505] text-white antialiased min-h-[100svh] flex flex-col overflow-hidden selection:bg-purple-500/30 selection:text-white relative">

      {/* Dynamic Geometric Background */}
      <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center opacity-40">
        <div className="absolute w-[800px] h-[800px] bg-purple-600/10 blur-[150px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />

        {/* Rotating Abstract Wireframe / Geometric figure */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-30 custom-spin">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full stroke-purple-400 stroke-[0.2] fill-transparent">
            {/* Multiple nested geometric shapes rotating slowly */}
            <g className="origin-center animate-[spin_60s_linear_infinite]">
              <polygon points="100,10 186.6,60 186.6,140 100,190 13.4,140 13.4,60" />
              <polygon points="100,30 169.2,70 169.2,130 100,170 30.8,130 30.8,70" />
              <polygon points="100,50 152,80 152,120 100,150 48,120 48,80" />
              <circle cx="100" cy="100" r="90" strokeDasharray="4 4" />
              <circle cx="100" cy="100" r="70" strokeOpacity="0.5" />
              <path d="M 100 10 L 100 190 M 13.4 60 L 186.6 140 M 13.4 140 L 186.6 60" />
            </g>
            <g className="origin-center animate-[spin_40s_linear_infinite_reverse]">
              <rect x="30" y="30" width="140" height="140" transform="rotate(45 100 100)" />
              <circle cx="100" cy="100" r="99" strokeWidth="0.5" strokeDasharray="1 6" strokeOpacity="0.8" />
            </g>
          </svg>
        </div>

        {/* Deep Field Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 w-full pt-8 pb-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/5 border border-white/10 p-2 rounded-xl backdrop-blur-md">
              <SicofLogoIcon className="h-6 w-6 opacity-90" inverted={true} />
            </div>
            <span className="font-bold tracking-widest text-lg text-white/90">KOMI</span>
          </div>

          <div className="flex items-center gap-6 sm:gap-10">
            <div className="hidden sm:flex items-center gap-8 text-sm font-medium tracking-wide text-white/40">
              <Link href="#" className="hover:text-white transition-colors">Acerca de nosotros</Link>
              <Link href="#" className="hover:text-white transition-colors">Contacto</Link>
            </div>
            <Link
              href="/login"
              className="text-xs font-semibold tracking-wider uppercase text-purple-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              Ingresar <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="flex-grow flex flex-col justify-center items-center relative z-10 px-6 text-center">

        {/* Sub-badge */}
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05] text-white/50 text-xs font-medium tracking-widest uppercase mb-10 backdrop-blur-sm animate-[fade-in_1s_ease-out]">
          Plataforma Institucional V2
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/40 mb-6 leading-[1.05] max-w-5xl animate-[fade-in-up_1s_ease-out_0.2s_both]">
          Inteligencia y justicia, <br />
          <span className="font-light italic pr-2">en un solo lugar.</span>
        </h1>

        {/* Persuasive Subtitle */}
        <p className="text-base sm:text-xl text-white/40 font-light max-w-2xl leading-relaxed mb-12 tracking-wide animate-[fade-in-up_1s_ease-out_0.4s_both]">
          Diseñamos la estructura digital más avanzada para la gestión de expedientes y protección familiar, eliminando la fricción administrativa con extrema seguridad.
        </p>

        {/* Call to Action */}
        <div className="animate-[fade-in-up_1s_ease-out_0.6s_both]">
          <Link
            href="/login"
            className="group relative inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-full text-sm font-semibold tracking-wide overflow-hidden transition-transform hover:scale-105"
          >
            <span className="relative z-10">Empezar ahora</span>
            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-purple-100 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
          </Link>
        </div>

      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 border-t border-white/5 py-6 text-center text-[10px] text-white/20 tracking-widest uppercase font-mono mt-auto">
        Komi System © 2026 • Encrypted Data
      </footer>

      {/* Custom Keyframes */}
      <style>{`
        .custom-spin {
          animation: slow-spin 120s linear infinite;
        }
        @keyframes slow-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
