'use client'

import Link from "next/link"
import { SicofLogoIcon } from "@/components/sicof-logo"

export default function Home() {
  return (
    <div className="bg-background-light text-komi-primary font-display antialiased relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
      <header className="flex items-center justify-between whitespace-nowrap px-6 md:px-12 py-6 relative z-50">
        <div className="flex items-center gap-3">
          <SicofLogoIcon className="w-8 h-8" />
          <h2 className="text-3xl font-serif font-bold text-komi-primary tracking-tight">Komi</h2>
        </div>
        <div className="hidden md:flex flex-1 justify-end gap-8">
          <nav className="flex items-center gap-8">
            <Link className="text-komi-primary/80 hover:text-komi-accent transition-colors text-base font-medium" href="#">Funcionalidades</Link>
            <Link className="text-komi-primary/80 hover:text-komi-accent transition-colors text-base font-medium" href="#">Impacto</Link>
            <Link className="text-komi-primary/80 hover:text-komi-accent transition-colors text-base font-medium" href="#">Quiénes somos</Link>
            <Link className="text-komi-primary/80 hover:text-komi-accent transition-colors text-base font-medium" href="#">Contacto</Link>
          </nav>
          <Link
            href="/login"
            className="flex cursor-pointer items-center justify-center rounded-full h-11 px-8 bg-komi-accent hover:bg-komi-accent/90 transition-colors text-white text-base font-bold shadow-sm"
          >
            Ingresar
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1400px] mx-auto">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 px-6 md:px-12 py-12 lg:py-24 items-center">
          <div className="flex flex-col gap-8 text-left max-w-xl z-10 order-2 lg:order-1">
            <h1 className="text-komi-primary text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight">
              Justicia Familiar Digital:<br />
              <span className="text-komi-accent">Eficiente, Empática y Humana.</span>
            </h1>
            <p className="text-komi-primary/80 text-xl md:text-2xl font-normal leading-relaxed">
              Transformamos las Comisarías de Familia en Colombia eliminando el papel y salvando vidas a través de la tecnología.
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <Link
                href="/login"
                className="flex cursor-pointer items-center justify-center rounded-full h-14 px-10 bg-komi-accent hover:bg-komi-accent/90 text-white text-lg font-bold transition-all shadow-md hover:shadow-lg"
              >
                Empezar Ahora
              </Link>
              <button className="flex cursor-pointer items-center justify-center rounded-full h-14 px-8 bg-transparent hover:bg-komi-primary/5 border-2 border-komi-primary/20 text-komi-primary text-lg font-bold transition-all">
                <span className="material-symbols-outlined mr-2">play_circle</span>
                <span>Ver Video</span>
              </button>
            </div>
          </div>
          <div className="relative w-full aspect-square max-w-[600px] mx-auto z-0 order-1 lg:order-2">
            <div className="absolute inset-0 bg-pastel-yellow rounded-[40px] rotate-3 transform-gpu"></div>
            <div className="absolute inset-4 bg-white rounded-[32px] shadow-sm overflow-hidden flex items-center justify-center border border-komi-primary/5">
              <div className="text-center p-8">
                <span className="material-symbols-outlined text-[120px] text-komi-accent/20 block mb-4">family_restroom</span>
                <p className="text-sm text-komi-primary/40 font-medium italic">Justicia al alcance de todos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="px-6 md:px-12 py-24 bg-white/50 relative">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-pastel-blue/30 -z-10"></div>
          <div className="flex flex-col gap-4 text-center items-center mb-16">
            <h2 className="text-komi-primary text-4xl md:text-5xl font-black leading-tight tracking-tight uppercase">
              Diseñado para el bienestar
            </h2>
            <p className="text-komi-primary/70 text-xl font-normal leading-relaxed max-w-3xl">
              Herramientas minimalistas que potencian la labor humana sin abrumar.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="flex flex-col rounded-[32px] bg-white p-8 shadow-sm hover:shadow-xl transition-all border border-komi-primary/5 hover:-translate-y-2 group">
              <div className="w-full aspect-[4/3] rounded-2xl bg-pastel-yellow mb-8 flex items-center justify-center overflow-hidden relative">
                <span className="material-symbols-outlined text-[80px] text-komi-accent/50 group-hover:scale-110 transition-transform duration-500">description</span>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-komi-primary text-2xl font-bold leading-tight">Minuta Digital</h3>
                <p className="text-komi-primary/70 text-lg font-normal leading-relaxed">
                  Optimización de tiempos mediante el registro ágil y seguro de actuaciones.
                </p>
              </div>
            </div>
            <div className="flex flex-col rounded-[32px] bg-white p-8 shadow-sm hover:shadow-xl transition-all border border-komi-primary/5 hover:-translate-y-2 group mt-0 md:mt-12">
              <div className="w-full aspect-[4/3] rounded-2xl bg-pastel-green mb-8 flex items-center justify-center overflow-hidden relative">
                <span className="material-symbols-outlined text-[80px] text-komi-primary/30 group-hover:scale-110 transition-transform duration-500">groups</span>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-komi-primary text-2xl font-bold leading-tight">Valoración Interdisciplinaria</h3>
                <p className="text-komi-primary/70 text-lg font-normal leading-relaxed">
                  Enfoque humano y técnico con equipos psicosociales integrados.
                </p>
              </div>
            </div>
            <div className="flex flex-col rounded-[32px] bg-white p-8 shadow-sm hover:shadow-xl transition-all border border-komi-primary/5 hover:-translate-y-2 group">
              <div className="w-full aspect-[4/3] rounded-2xl bg-pastel-blue mb-8 flex items-center justify-center overflow-hidden relative">
                <span className="material-symbols-outlined text-[80px] text-[#4A90E2]/40 group-hover:scale-110 transition-transform duration-500">notifications_active</span>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-komi-primary text-2xl font-bold leading-tight">Alertas en Tiempo Real</h3>
                <p className="text-komi-primary/70 text-lg font-normal leading-relaxed">
                  Protección inmediata mediante notificaciones tempranas de riesgo.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Law Section */}
        <div className="px-6 md:px-12 py-24 max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-komi-primary text-white rounded-[40px] p-12 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-komi-accent rounded-full opacity-20 mix-blend-screen blur-3xl"></div>
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-pastel-yellow rounded-full opacity-20 mix-blend-screen blur-3xl"></div>
            <div className="flex-1 z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <span className="material-symbols-outlined text-komi-accent text-xl">gavel</span>
                <span className="text-white text-sm font-bold uppercase tracking-wider">Normativa</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight mb-6">
                Cumplimiento Normativo<br />(Ley 2126 de 2021)
              </h2>
              <p className="text-white/80 text-lg font-normal leading-relaxed">
                Komi está diseñado para cumplir estrictamente con los lineamientos legales colombianos, asegurando la debida diligencia y protección de derechos en cada proceso familiar.
              </p>
            </div>
            <div className="z-10 flex-shrink-0">
              <div className="w-32 h-32 rounded-full border-4 border-komi-accent border-dashed flex items-center justify-center bg-komi-primary">
                <span className="material-symbols-outlined text-5xl text-komi-accent">verified</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="px-6 py-12 border-t border-komi-primary/5 text-center">
        <p className="text-komi-primary/40 text-xs font-bold uppercase tracking-[0.2em]">
          Komi © 2026 • Justicia Familiar Digital • Colombia
        </p>
      </footer>
    </div>
  )
}
