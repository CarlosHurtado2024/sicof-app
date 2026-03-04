'use client'

import Link from "next/link"
import { SicofLogoIcon } from "@/components/sicof-logo"
import { ArrowLeft } from "lucide-react"

export default function Home() {
  return (
    <div className="bg-[#FDFBF7] text-[#2B463C] font-display antialiased relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden selection:bg-[#F28C73]/20">
      {/* Immersive Background Blur Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#F28C73]/10 blur-[150px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#2B463C]/5 blur-[120px] animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute top-[40%] left-[10%] w-[30vw] h-[30vw] rounded-full bg-[#F28C73]/5 blur-[100px] opacity-60" />
      </div>

      {/* Navigation - Ultra-Modern Glassmorphism */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-6xl">
        <header className="flex items-center justify-between px-8 py-5 bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(43,70,60,0.12)]">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="relative p-2.5 bg-[#2B463C] rounded-2xl group-hover:bg-[#F28C73] transition-all duration-500 shadow-lg shadow-[#2B463C]/20">
              <SicofLogoIcon className="w-6 h-6 invert" />
              <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-2xl font-serif font-black text-[#2B463C] tracking-tighter leading-none">Komi</h2>
              <span className="text-[8px] font-black tracking-[0.4em] uppercase text-[#F28C73]">Justicia Humana</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-12">
            {['Impacto', 'Soluciones', 'Seguridad', 'Nosotros'].map((item) => (
              <Link key={item} href="#" className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2B463C]/50 hover:text-[#2B463C] transition-all relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F28C73] transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="flex items-center justify-center rounded-2xl h-12 px-8 bg-[#2B463C] hover:bg-[#F28C73] transition-all text-white text-[10px] font-black uppercase tracking-[0.25em] shadow-xl shadow-[#2B463C]/10 active:scale-95 group"
            >
              Acceder al Portal
              <ArrowLeft className="w-4 h-4 ml-3 rotate-180 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </header>
      </div>

      <main className="flex-1 w-full relative z-10">
        {/* Hero Section - The Masterpiece */}
        <section className="relative px-6 md:px-16 pt-32 lg:pt-56 pb-24 overflow-hidden">
          <div className="max-w-6xl mx-auto flex flex-col items-center text-center animate-fade-in-up gap-12">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/50 backdrop-blur-md border border-white w-fit shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F28C73] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F28C73]"></span>
              </span>
              <span className="text-[10px] font-black text-[#2B463C] uppercase tracking-[0.4em]">Evolución Procesal 2026</span>
            </div>

            <div className="flex flex-col gap-8">
              <h1 className="text-[#2B463C] text-5xl md:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tighter uppercase">
                Justicia <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F28C73] via-[#2B463C] to-[#2B463C]">Inteligente</span>
              </h1>
              <p className="text-[#2B463C]/40 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
                Simplificamos la burocracia en las Comisarías de Familia para que el equipo se enfoque en el bienestar de las personas.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link
                href="/login"
                className="flex items-center justify-center rounded-2xl h-14 px-10 bg-[#2B463C] hover:bg-[#F28C73] text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-[#2B463C]/10 hover:-translate-y-1 active:scale-95 group"
              >
                Comenzar Ahora
                <ArrowLeft className="w-4 h-4 ml-3 rotate-180 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="flex items-center justify-center rounded-2xl h-14 px-8 bg-white/40 backdrop-blur-xl border border-white/80 text-[#2B463C] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/80 transition-all active:scale-95 shadow-md">
                Ver Casos de Éxito
              </button>
            </div>
          </div>
        </section>

        {/* Stats Section - High End Minimalism */}
        <section className="px-6 md:px-16 py-24 lg:py-48 bg-white/5 relative">
          <div className="max-w-[1600px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-px lg:bg-[#2B463C]/10 rounded-[4rem] overflow-hidden border border-[#2B463C]/10 backdrop-blur-sm">
              {[
                { label: 'Eficiencia Jurídica', val: '+92%', sub: 'Reducción de tiempos procesales' },
                { label: 'Impacto Social', val: '24/7', sub: 'Atención y monitoreo continuo' },
                { label: 'Precisión de Datos', val: '100%', sub: 'Digitalización blindada' }
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 md:px-20 py-24 flex flex-col gap-5 group transition-all hover:bg-white/40 items-center md:items-start">
                  <span className="text-[10px] font-black text-[#F28C73] uppercase tracking-[0.5em] group-hover:translate-x-3 transition-transform">{stat.label}</span>
                  <span className="text-8xl lg:text-9xl font-black text-[#2B463C] tracking-tighter leading-none">{stat.val}</span>
                  <p className="text-[#2B463C]/40 text-sm font-bold uppercase tracking-widest">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features - Professional Excellence */}
        <section className="px-6 md:px-16 py-32 lg:py-56 relative overflow-hidden">
          <div className="max-w-7xl mx-auto text-center flex flex-col items-center gap-24">
            <div className="flex flex-col gap-8 max-w-4xl">
              <span className="text-[10px] font-black text-[#F28C73] uppercase tracking-[0.6em] animate-pulse">Infraestructura de Clase Mundial</span>
              <h2 className="text-[#2B463C] text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9]">
                Diseñado para líderes de justicia.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
              {[
                { title: 'Motor de Decisiones', desc: 'Analítica en tiempo real para evaluar riesgos psicosociales.', icon: 'analytics' },
                { title: 'Cifrado Soberano', desc: 'Protocolos de seguridad grado militar para datos sensibles.', icon: 'lock' },
                { title: 'Nube Descentralizada', desc: 'Acceso total sin depender de infraestructuras locales fallidas.', icon: 'cloud_done' },
                { title: 'Gestión Humana', desc: 'Interfaz diseñada para reducir la fatiga en el equipo jurídico.', icon: 'auto_awesome' }
              ].map((feat, i) => (
                <div key={i} className="group p-14 rounded-[3.5rem] bg-white/40 backdrop-blur-2xl border border-white/80 hover:bg-[#2B463C] transition-all duration-700 shadow-2xl shadow-black/5 hover:shadow-[#2B463C]/30 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-3xl bg-[#F28C73]/10 flex items-center justify-center mb-12 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-500">
                    <span className="material-symbols-outlined text-[#F28C73] group-hover:text-white text-5xl font-light">{feat.icon}</span>
                  </div>
                  <h3 className="text-2xl font-black group-hover:text-white mb-6 uppercase tracking-tighter transition-colors">{feat.title}</h3>
                  <p className="text-[12px] font-bold uppercase tracking-[0.2em] leading-relaxed text-[#2B463C]/40 group-hover:text-white/60 transition-colors">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing - CTA */}
        <section className="px-6 md:px-16 py-32 lg:pt-0 lg:pb-56">
          <div className="max-w-6xl mx-auto rounded-[4rem] bg-[#2B463C] p-12 lg:p-32 text-center flex flex-col items-center gap-12 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(43,70,60,0.4)]">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#F28C73]/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full -translate-x-1/2 translate-y-1/2" />

            <h2 className="text-white text-4xl md:text-7xl font-black uppercase tracking-tighter leading-tight relative z-10">
              ¿Listo para transformar <br className="hidden md:block" /> la justicia en su municipio?
            </h2>
            <Link
              href="/login"
              className="relative z-10 flex items-center justify-center rounded-[2rem] h-20 px-16 bg-[#F28C73] hover:bg-white text-[#2B463C] text-xs font-black uppercase tracking-[0.4em] transition-all active:scale-95 shadow-2xl"
            >
              Solicitar Acceso al Portal
            </Link>
          </div>
        </section>
      </main>

      {/* Premium Footer */}
      <footer className="px-6 md:px-16 py-20 border-t border-[#2B463C]/10 relative z-10 bg-white/20 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-20">
          <div className="flex flex-col md:flex-row justify-between items-start gap-16">
            <div className="flex flex-col gap-8 max-w-sm">
              <div className="flex items-center gap-4 group">
                <SicofLogoIcon className="w-8 h-8 opacity-100 group-hover:rotate-12 transition-transform duration-500" />
                <div className="flex flex-col">
                  <span className="text-2xl font-serif font-black uppercase tracking-tighter">Komi</span>
                  <span className="text-[9px] font-bold text-[#2B463C]/40 uppercase tracking-[0.5em]">Systems of Justice</span>
                </div>
              </div>
              <p className="text-[11px] font-bold text-[#2B463C]/40 uppercase tracking-widest leading-loose">
                Komi es una plataforma de tecnología legal diseñada específicamente para las Comisarías de Familia en Colombia, optimizando procesos bajo la normativa Ley 2126 de 2021.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-16 lg:gap-32">
              {[
                { title: 'Producto', links: ['Impacto', 'Soluciones', 'Seguridad'] },
                { title: 'Regulatorio', links: ['Privacidad', 'Términos', 'Ley 2126'] },
                { title: 'Soporte', links: ['Documentación', 'Módulo API', 'Contacto'] }
              ].map((group, i) => (
                <div key={i} className="flex flex-col gap-8">
                  <span className="text-[10px] font-black text-[#2B463C] uppercase tracking-[0.4em]">{group.title}</span>
                  <div className="flex flex-col gap-4">
                    {group.links.map((link) => (
                      <Link key={link} href="#" className="text-[10px] font-bold text-[#2B463C]/40 hover:text-[#F28C73] transition-colors uppercase tracking-[0.2em]">{link}</Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-16 border-t border-[#2B463C]/5 gap-8">
            <span className="text-[9px] font-black text-[#2B463C]/20 uppercase tracking-[0.6em]">© 2026 KOMI PROJECT • BOGOTÁ, COLOMBIA • ALL RIGHTS RESERVED</span>
            <div className="flex gap-10">
              {['LinkedIn', 'Twitter', 'GitHub'].map(social => (
                <Link key={social} href="#" className="text-[9px] font-black text-[#2B463C]/20 hover:text-[#2B463C] transition-colors uppercase tracking-[0.3em]">{social}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Animations & Interactions */}
      <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-30px) rotate(1deg); }
                }
                .animate-float {
                    animation: float 8s ease-in-out infinite;
                }
                .animate-fade-in-up {
                    animation: fadeInUp 1s ease-out forwards;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
    </div>
  )
}
