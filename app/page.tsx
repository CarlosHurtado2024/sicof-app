'use client'

import Link from "next/link"
import { SicofLogoIcon } from "@/components/sicof-logo"
import { ArrowRight, FolderOpen, Users, BarChart3 } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-x-hidden flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ─── Blob Background ─── */}
      <div className="fixed inset-0 z-0" style={{
        backgroundColor: '#111821',
        backgroundImage: `
                    radial-gradient(circle at 15% 50%, rgba(255, 127, 80, 0.15), transparent 25%),
                    radial-gradient(circle at 85% 30%, rgba(152, 255, 152, 0.1), transparent 25%),
                    radial-gradient(circle at 50% 80%, rgba(255, 253, 208, 0.1), transparent 25%)
                `,
      }} />

      <div className="flex h-full grow flex-col relative z-10">
        {/* ─── Navigation ─── */}
        <header className="fixed top-0 w-full z-50" style={{
          background: 'rgba(17, 24, 33, 0.6)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderTop: 'none',
        }}>
          <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3" style={{ color: '#ff7f50' }}>
              <SicofLogoIcon className="w-7 h-7 invert" />
              <h2 className="text-xl font-bold tracking-tight text-white">Komi</h2>
            </div>
            <div className="hidden md:flex flex-1 justify-end items-center gap-8">
              <nav className="flex items-center gap-8">
                {['Features', 'About', 'Contact'].map((item) => (
                  <a key={item} className="text-sm font-medium transition-colors" href="#"
                    style={{ color: 'rgba(255,255,255,0.6)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ff7f50')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                  >
                    {item}
                  </a>
                ))}
              </nav>
              <Link href="/login"
                className="text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all"
                style={{ background: '#ff7f50', boxShadow: '0 4px 20px rgba(255, 127, 80, 0.3)' }}
              >
                Get Started
              </Link>
            </div>
            {/* Mobile CTA */}
            <Link href="/login" className="md:hidden text-white px-5 py-2 rounded-full text-sm font-bold"
              style={{ background: '#ff7f50' }}>
              Acceder
            </Link>
          </div>
        </header>

        <main className="flex-1 mt-24 px-6 pb-20 max-w-[1200px] mx-auto w-full flex flex-col items-center justify-center">
          {/* ─── Hero Section ─── */}
          <section className="w-full flex justify-center py-12 md:py-20">
            <div className="rounded-2xl md:rounded-[2.5rem] p-8 md:p-16 w-full max-w-[960px] flex flex-col items-center text-center relative overflow-hidden"
              style={{
                background: 'rgba(17, 24, 33, 0.6)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
              }}
            >
              {/* Decorative glow */}
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none"
                style={{ background: 'rgba(255, 127, 80, 0.2)' }} />

              <div className="relative z-10 flex flex-col items-center gap-6 max-w-3xl">
                <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2"
                  style={{
                    border: '1px solid rgba(255, 127, 80, 0.3)',
                    background: 'rgba(255, 127, 80, 0.1)',
                    color: '#ff7f50',
                  }}
                >
                  Software de Gestión Familiar
                </span>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-white"
                  style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>
                  Justicia Familiar <span className="italic" style={{ color: '#ff7f50' }}>Digital</span> y Humana
                </h1>

                <p className="text-lg md:text-xl font-light mt-4 max-w-2xl" style={{ color: 'rgba(203, 213, 225, 1)' }}>
                  Modern family &amp; welfare management SaaS for family police stations. Transforma la atención y optimiza los procesos con tecnología centrada en las personas.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Link href="/login"
                    className="text-white px-8 py-4 rounded-full text-base font-bold transition-all flex items-center gap-2 hover:opacity-90"
                    style={{ background: '#ff7f50', boxShadow: '0 8px 24px rgba(255, 127, 80, 0.2)' }}
                  >
                    Comenzar ahora
                    <ArrowRight size={18} />
                  </Link>
                  <button
                    className="px-8 py-4 rounded-full text-base font-bold transition-all flex items-center gap-2 text-white"
                    style={{
                      background: 'rgba(17, 24, 33, 0.6)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(17, 24, 33, 0.6)')}
                  >
                    Ver Demo
                    <span className="text-lg">▶</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ─── Features Section ─── */}
          <section className="w-full py-16 flex flex-col items-center gap-12">
            <div className="text-center max-w-2xl mb-4">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white"
                style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>
                Características principales
              </h2>
              <p style={{ color: 'rgba(148, 163, 184, 1)' }}>
                Todo lo que necesitas para una gestión eficiente, segura y empática.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              {[
                {
                  icon: <FolderOpen className="w-7 h-7" />,
                  iconColor: '#ff7f50',
                  iconBg: 'rgba(255, 127, 80, 0.2)',
                  title: 'Gestión de Casos',
                  desc: 'Administra expedientes de manera segura y digital. Acceso rápido a historiales y documentos importantes en cualquier momento.',
                },
                {
                  icon: <Users className="w-7 h-7" />,
                  iconColor: '#10b981',
                  iconBg: 'rgba(16, 185, 129, 0.2)',
                  title: 'Seguimiento Familiar',
                  desc: 'Mantén un registro detallado de las interacciones, mediaciones y acuerdos. Crea cronogramas visuales de la evolución familiar.',
                },
                {
                  icon: <BarChart3 className="w-7 h-7" />,
                  iconColor: '#f59e0b',
                  iconBg: 'rgba(245, 158, 11, 0.2)',
                  title: 'Reportes Avanzados',
                  desc: 'Genera informes estadísticos y analíticos con un clic. Visualiza tendencias y métricas clave para mejorar la toma de decisiones.',
                },
              ].map((feat, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-8 flex flex-col gap-4 hover:-translate-y-2 transition-transform duration-300"
                  style={{
                    background: 'rgba(17, 24, 33, 0.6)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-2"
                    style={{ background: feat.iconBg, color: feat.iconColor }}>
                    {feat.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white">{feat.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(148, 163, 184, 1)' }}>
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* ─── Footer ─── */}
        <footer className="w-full py-8 mt-auto" style={{
          background: 'rgba(17, 24, 33, 0.6)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderBottom: 'none',
          borderLeft: 'none',
          borderRight: 'none',
        }}>
          <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2" style={{ color: '#ff7f50' }}>
              <SicofLogoIcon className="w-5 h-5 invert" />
              <span className="font-bold text-white">Komi</span>
            </div>
            <div className="flex gap-6">
              {['Privacidad', 'Términos', 'Soporte'].map((link) => (
                <a key={link} className="text-sm transition-colors" href="#"
                  style={{ color: 'rgba(148, 163, 184, 0.6)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ff7f50')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(148, 163, 184, 0.6)')}
                >
                  {link}
                </a>
              ))}
            </div>
            <p className="text-sm" style={{ color: 'rgba(148, 163, 184, 0.4)' }}>
              © 2026 Komi. Todos los derechos reservados.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
