
import Link from "next/link"
import { SicofLogo, SicofLogoIcon } from "@/components/sicof-logo"
import { Gavel, Menu, ArrowRight, PlayCircle, CheckCircle, XCircle, Share2, Brain, FolderArchive, Shield, Zap, Clock, Users, ChevronRight, Star, Lock, BarChart3, FileText, Sparkles, ArrowUpRight, Globe, HeartHandshake } from "lucide-react"

export const metadata = {
  title: 'Komi — Familia y Bienestar',
  description: 'Plataforma integral de gestión para Comisarías de Familia. Moderniza procesos, reduce tiempos y garantiza cumplimiento de la Ley 2126.',
}

export default function Home() {
  return (
    <div className="font-[Inter,system-ui,sans-serif] bg-[#fafafa] text-slate-800 antialiased overflow-x-hidden selection:bg-slate-900/20 selection:text-slate-700">

      {/* --- NAVIGATION --- */}
      <nav className="fixed w-full z-50 top-0 bg-white/70 backdrop-blur-2xl border-b border-slate-200/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[72px]">
            <div className="flex-shrink-0 cursor-pointer">
              <SicofLogo iconClassName="h-10 w-10" inverted={false} showSubtitle={true} />
            </div>
            <div className="hidden md:flex space-x-1 items-center">
              <Link href="#modulos" className="text-slate-500 hover:text-slate-900 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-slate-100/80 text-sm">Módulos</Link>
              <Link href="#beneficios" className="text-slate-500 hover:text-slate-900 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-slate-100/80 text-sm">Beneficios</Link>
              <Link href="#precios" className="text-slate-500 hover:text-slate-900 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-slate-100/80 text-sm">Precios</Link>
              <Link href="#seguridad" className="text-slate-500 hover:text-slate-900 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-slate-100/80 text-sm">Seguridad</Link>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login" className="text-slate-600 hover:text-slate-900 font-medium transition-colors text-sm px-4 py-2">
                Iniciar Sesión
              </Link>
              <Link href="/login" className="bg-[#1B2A4A] hover:bg-[#142035] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-slate-900/25 hover:shadow-xl hover:shadow-slate-900/30 transform hover:-translate-y-0.5">
                Solicitar Demo
              </Link>
            </div>
            <div className="md:hidden flex items-center gap-2">
              <Link href="/login" className="bg-[#1B2A4A] text-white px-4 py-2 rounded-lg font-semibold text-sm">
                Ingresar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* --- HERO SECTION (Full dark immersive) --- */}
      {/* ═══════════════════════════════════════════════════════ */}
      <header className="relative min-h-[100svh] flex items-center overflow-hidden bg-[#0B1628]">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[700px] h-[700px] rounded-full bg-[#1B2A4A]/40 blur-[150px] -top-48 -left-48 animate-pulse" />
          <div className="absolute w-[500px] h-[500px] rounded-full bg-blue-900/20 blur-[120px] top-1/4 right-0 animate-pulse [animation-delay:2s]" />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-cyan-900/15 blur-[100px] bottom-0 left-1/3 animate-pulse [animation-delay:4s]" />
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:60px_60px]" />
          {/* Radial fade */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(59,130,246,0.08),transparent)]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28 pb-16 lg:pt-32 lg:pb-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* Left content - 7 cols */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm text-cyan-300 text-xs font-semibold border border-white/10 gap-2.5">
                <Sparkles className="w-3.5 h-3.5" />
                Módulo de IA Integrado — v2.4
              </div>

              <h1 className="text-[2.5rem] sm:text-5xl lg:text-[3.75rem] xl:text-7xl font-extrabold tracking-tight text-white leading-[1.05]">
                Justicia familiar
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-slate-300">
                  inteligente y digital
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Komi moderniza la gestión de las Comisarías de Familia con herramientas de IA, expediente digital y cumplimiento normativo automático de la <span className="text-white/80 font-medium">Ley 2126</span>.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link href="/login" className="group bg-white text-[#0B1628] px-7 py-4 rounded-xl font-bold transition-all shadow-xl shadow-black/30 hover:shadow-2xl flex items-center justify-center gap-2.5 transform hover:-translate-y-0.5 text-sm">
                  Empezar Ahora
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <button className="group bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 backdrop-blur-sm px-7 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2.5 text-sm">
                  <PlayCircle className="w-5 h-5 text-cyan-400" />
                  Ver Demo
                </button>
              </div>

              {/* Social proof */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-sm text-slate-500">
                <div className="flex -space-x-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 border-2 border-[#0B1628] flex items-center justify-center text-[10px] font-bold text-white shadow-lg">JD</div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 border-2 border-[#0B1628] flex items-center justify-center text-[10px] font-bold text-white shadow-lg">AM</div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-[#0B1628] flex items-center justify-center text-[10px] font-bold text-white shadow-lg">CR</div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-[#0B1628] flex items-center justify-center text-[10px] font-bold text-white shadow-lg">+5</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <span className="text-slate-400 font-medium">50+ entidades confían en Komi</span>
                </div>
              </div>
            </div>

            {/* Right visual - 5 cols */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Glow behind card */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/10 blur-[80px] scale-110 -z-10" />

                {/* Main dashboard mock */}
                <div className="bg-white/[0.06] backdrop-blur-md rounded-2xl border border-white/10 p-4 shadow-2xl shadow-black/40">
                  <div className="bg-[#111D32] rounded-xl overflow-hidden">
                    {/* Mock top bar */}
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                      </div>
                      <div className="flex-1 flex justify-center">
                        <div className="bg-white/5 rounded-md px-12 py-1 text-[10px] text-slate-500 font-mono">komi.gov.co/dashboard</div>
                      </div>
                    </div>

                    {/* Mock content */}
                    <div className="p-4 space-y-4">
                      {/* Stats row */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-white/5 rounded-lg p-3 text-center">
                          <p className="text-xl font-bold text-white">1,247</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Expedientes</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 text-center">
                          <p className="text-xl font-bold text-emerald-400">89%</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Resueltos</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 text-center">
                          <p className="text-xl font-bold text-cyan-400">3.2d</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Promedio</p>
                        </div>
                      </div>
                      {/* Activity bars */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-slate-500 w-8">Lun</span>
                          <div className="flex-1 bg-white/5 rounded-full h-2"><div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full w-[85%]" /></div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-slate-500 w-8">Mar</span>
                          <div className="flex-1 bg-white/5 rounded-full h-2"><div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full w-[72%]" /></div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-slate-500 w-8">Mié</span>
                          <div className="flex-1 bg-white/5 rounded-full h-2"><div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full w-[93%]" /></div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-slate-500 w-8">Jue</span>
                          <div className="flex-1 bg-white/5 rounded-full h-2"><div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full w-[67%]" /></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating card - IA alert */}
                <div className="absolute -left-4 sm:-left-8 bottom-16 bg-white/[0.08] backdrop-blur-xl p-4 rounded-xl border border-white/10 shadow-2xl shadow-black/30 animate-[float_3s_ease-in-out_infinite]">
                  <div className="flex items-center gap-3">
                    <div className="bg-cyan-500/20 p-2.5 rounded-lg text-cyan-400">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 font-medium">IA Risk Score</p>
                      <p className="text-lg font-bold text-white">Alto — 8.5</p>
                    </div>
                  </div>
                </div>

                {/* Floating card - resolved */}
                <div className="absolute -right-2 sm:-right-6 top-16 bg-white/[0.08] backdrop-blur-xl p-4 rounded-xl border border-white/10 shadow-2xl shadow-black/30 animate-[float_3s_ease-in-out_infinite_1.5s]">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-500/20 p-2.5 rounded-lg text-emerald-400">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 font-medium">Hoy</p>
                      <p className="text-lg font-bold text-white">+12 resueltos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom gradient fade to white */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </header>

      {/* --- STATS BAR --- */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 text-center">
            {[
              { value: '10,000+', label: 'Casos Gestionados', color: 'text-[#1B2A4A]' },
              { value: '50+', label: 'Comisarías Activas', color: 'text-[#1B2A4A]' },
              { value: '-40%', label: 'Tiempo de Respuesta', color: 'text-emerald-600' },
              { value: '99.9%', label: 'Disponibilidad', color: 'text-[#1B2A4A]' },
            ].map((stat, i) => (
              <div key={i} className="group">
                <div className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold ${stat.color} mb-1 group-hover:scale-105 transition-transform`}>{stat.value}</div>
                <p className="text-slate-400 font-medium text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- MODULES/FEATURES --- */}
      <section id="modulos" className="py-20 sm:py-28 relative bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-[#1B2A4A] font-semibold text-sm tracking-widest uppercase mb-3">Plataforma Integral</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">Tecnología al servicio de la justicia familiar</h2>
            <p className="text-slate-500 text-base">Herramientas diseñadas para cumplir estándares legales y optimizar cada flujo de trabajo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Feature 1 - Large */}
            <div className="md:col-span-2 md:row-span-2 bg-white rounded-2xl p-8 lg:p-10 shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-500 group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-slate-100/80 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:from-cyan-50/50 transition-colors duration-700" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 bg-[#1B2A4A] rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-slate-900/20">
                    <Gavel className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Ley 2126 Compliance</h3>
                  <p className="text-slate-500 text-base max-w-md leading-relaxed">
                    Garantiza cumplimiento normativo total. El sistema se actualiza automáticamente con cada cambio legislativo.
                  </p>
                </div>
                <div className="mt-8 grid grid-cols-3 gap-3">
                  {['Términos', 'Audiencias', 'Medidas'].map((item, i) => (
                    <div key={i} className="bg-slate-50 group-hover:bg-[#1B2A4A]/5 rounded-xl p-4 text-center transition-colors duration-300">
                      <p className="text-2xl font-bold text-[#1B2A4A]">{['100%', '24h', '∞'][i]}</p>
                      <p className="text-xs text-slate-500 mt-1 font-medium">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-6 lg:p-7 shadow-sm hover:shadow-lg border border-slate-100 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-5 group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Interoperabilidad</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Conexión fluida con bases de datos externas y otras entidades del estado colombiano.</p>
            </div>

            {/* Feature 3 - Highlighted */}
            <div className="bg-gradient-to-br from-[#1B2A4A] to-[#0B1628] rounded-2xl p-6 lg:p-7 shadow-xl text-white transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-cyan-400 mb-5 backdrop-blur-sm border border-white/10">
                  <Brain className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold mb-2">IA para Riesgo</h3>
                <p className="text-slate-300 text-sm mb-5 leading-relaxed">Algoritmos predictivos para valorar el nivel de riesgo en casos de violencia intrafamiliar.</p>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-gradient-to-r from-cyan-400 to-blue-400 h-2 rounded-full w-[75%]" />
                </div>
                <p className="text-slate-400 text-[11px] mt-2 font-medium">75% precisión en predicción</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-6 lg:p-7 shadow-sm hover:shadow-lg border border-slate-100 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-5 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-300">
                <FolderArchive className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Expediente Digital</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Centralización segura de documentos, pruebas y audios en la nube con cifrado AES-256.</p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-2xl p-6 lg:p-7 shadow-sm hover:shadow-lg border border-slate-100 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-5 group-hover:scale-110 group-hover:bg-amber-100 transition-all duration-300">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Analítica Avanzada</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Dashboards en tiempo real con KPIs, tendencias y reportes automáticos.</p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-2xl p-6 lg:p-7 shadow-sm hover:shadow-lg border border-slate-100 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 mb-5 group-hover:scale-110 group-hover:bg-rose-100 transition-all duration-300">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Firma Electrónica</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Firma digital legal integrada para autos, resoluciones y medidas de protección.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- BENEFITS SECTION --- */}
      <section id="beneficios" className="py-20 sm:py-28 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#1B2A4A] font-semibold text-sm tracking-widest uppercase mb-3">¿Por qué Komi?</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 leading-tight">Diseñado para quienes protegen familias</h2>
              <p className="text-slate-500 text-base mb-10 leading-relaxed">Cada funcionalidad ha sido pensada en colaboración con comisarios, psicólogos y trabajadores sociales de toda Colombia.</p>

              <div className="space-y-6">
                {[
                  { icon: <Zap className="w-5 h-5" />, bg: 'bg-amber-50', color: 'text-amber-600', hover: 'group-hover:bg-amber-100', title: 'Reducción del 40% en tiempos', desc: 'Automatización de procesos repetitivos que antes consumían horas del equipo.' },
                  { icon: <Shield className="w-5 h-5" />, bg: 'bg-emerald-50', color: 'text-emerald-600', hover: 'group-hover:bg-emerald-100', title: 'Seguridad gubernamental', desc: 'Encriptación AES-256, auditoría completa y cumplimiento de habeas data.' },
                  { icon: <Clock className="w-5 h-5" />, bg: 'bg-blue-50', color: 'text-blue-600', hover: 'group-hover:bg-blue-100', title: 'Disponibilidad 24/7', desc: 'Infraestructura cloud con 99.9% de uptime para acceso en cualquier momento.' },
                  { icon: <HeartHandshake className="w-5 h-5" />, bg: 'bg-rose-50', color: 'text-rose-600', hover: 'group-hover:bg-rose-100', title: 'Enfoque humano', desc: 'Herramientas que priorizan la atención a víctimas y el bienestar familiar.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className={`w-11 h-11 ${item.bg} rounded-xl flex items-center justify-center ${item.color} flex-shrink-0 ${item.hover} transition-colors`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-[#0B1628] to-[#1B2A4A] rounded-3xl p-8 lg:p-12 border border-slate-700/30 shadow-2xl shadow-slate-900/30">
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  {[
                    { value: '99%', label: 'Satisfacción', color: 'text-white' },
                    { value: '24/7', label: 'Soporte', color: 'text-cyan-400' },
                    { value: '5 min', label: 'Onboarding', color: 'text-blue-400' },
                    { value: '100%', label: 'Compliance', color: 'text-emerald-400' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 sm:p-6 text-center border border-white/5 hover:bg-white/10 transition-colors">
                      <p className={`text-3xl sm:text-4xl font-extrabold ${stat.color} mb-1`}>{stat.value}</p>
                      <p className="text-slate-400 text-xs font-medium">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section id="precios" className="py-20 sm:py-28 relative bg-[#fafafa] border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-[#1B2A4A] font-semibold text-sm tracking-widest uppercase mb-3">Planes Transparentes</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">El plan ideal para tu Comisaría</h2>
            <p className="text-slate-500 text-base">Sin costos ocultos. Cancela cuando quieras.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Plan 1 */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200/60 hover:border-slate-300 transition-all duration-300 hover:shadow-lg group">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-1">Básico</h3>
                <p className="text-slate-400 text-sm">Para municipios pequeños.</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900">$850K</span>
                <span className="text-slate-400 text-sm ml-1">COP/mes</span>
              </div>
              <button className="w-full py-3 px-4 bg-slate-50 text-slate-700 font-semibold rounded-xl hover:bg-slate-100 hover:text-[#1B2A4A] border border-slate-200 hover:border-slate-300 transition-all duration-300 mb-8 text-sm">
                Comenzar
              </button>
              <ul className="space-y-3 text-sm text-slate-500">
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-[#1B2A4A] flex-shrink-0" /> Expediente Digital Básico</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-[#1B2A4A] flex-shrink-0" /> Hasta 5 usuarios</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-[#1B2A4A] flex-shrink-0" /> Soporte por Email</li>
                <li className="flex items-center gap-2.5 opacity-40"><XCircle className="w-4 h-4 flex-shrink-0" /> Valoración de Riesgo IA</li>
                <li className="flex items-center gap-2.5 opacity-40"><XCircle className="w-4 h-4 flex-shrink-0" /> Firma Electrónica</li>
              </ul>
            </div>

            {/* Plan 2 - Popular */}
            <div className="bg-white rounded-2xl p-8 border-2 border-[#1B2A4A] shadow-[0_20px_60px_rgba(27,42,74,0.15)] relative transform md:-translate-y-3">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1B2A4A] text-white text-[11px] font-bold px-4 py-1 rounded-full tracking-wide shadow-lg">
                RECOMENDADO
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[#1B2A4A] mb-1">Institucional</h3>
                <p className="text-slate-400 text-sm">Para comisarías medianas y grandes.</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900">$2.1M</span>
                <span className="text-slate-400 text-sm ml-1">COP/mes</span>
              </div>
              <button className="w-full py-3 px-4 bg-[#1B2A4A] text-white font-semibold rounded-xl hover:bg-[#142035] shadow-lg shadow-slate-900/20 hover:shadow-xl transition-all duration-300 mb-8 text-sm">
                Obtener Plan
              </button>
              <ul className="space-y-3 text-sm text-slate-500">
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-[#1B2A4A] flex-shrink-0" /> <span className="font-medium text-slate-700">Expediente Digital Completo</span></li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-[#1B2A4A] flex-shrink-0" /> Valoración de Riesgo (IA)</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-[#1B2A4A] flex-shrink-0" /> Firma Electrónica</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-[#1B2A4A] flex-shrink-0" /> Usuarios Ilimitados</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-[#1B2A4A] flex-shrink-0" /> Soporte Prioritario 24/7</li>
              </ul>
            </div>

            {/* Plan 3 */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200/60 hover:border-slate-300 transition-all duration-300 hover:shadow-lg">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-1">Gubernamental</h3>
                <p className="text-slate-400 text-sm">Gestión a nivel departamental.</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900">Custom</span>
              </div>
              <button className="w-full py-3 px-4 bg-slate-50 text-slate-700 font-semibold rounded-xl hover:bg-slate-100 hover:text-[#1B2A4A] border border-slate-200 hover:border-slate-300 transition-all duration-300 mb-8 text-sm">
                Contactar Ventas
              </button>
              <ul className="space-y-3 text-sm text-slate-500">
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-[#1B2A4A] flex-shrink-0" /> Todo lo de Institucional</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-[#1B2A4A] flex-shrink-0" /> Interoperabilidad Estatal</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-[#1B2A4A] flex-shrink-0" /> API Dedicada</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-[#1B2A4A] flex-shrink-0" /> Auditoría Avanzada</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-[#1B2A4A] flex-shrink-0" /> Gerente de Cuenta</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIAL --- */}
      <section className="py-20 sm:py-28 bg-[#0B1628] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-cyan-900/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-900/10 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-3xl mx-auto px-4 relative z-10 text-center">
          <div className="flex justify-center gap-1 mb-8">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
          </div>
          <blockquote className="text-xl sm:text-2xl md:text-3xl font-medium text-white mb-8 leading-relaxed">
            &ldquo;Komi ha transformado radicalmente la forma en que atendemos a las familias. La agilidad administrativa se traduce directamente en una justicia más humana y oportuna.&rdquo;
          </blockquote>
          <cite className="flex items-center justify-center gap-4 not-italic">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              MG
            </div>
            <div className="text-left">
              <div className="text-white font-semibold">Dra. Maria González</div>
              <div className="text-slate-400 text-sm">Comisaria Primera de Familia</div>
            </div>
          </cite>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-20 sm:py-28 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/60 mb-6">
            <Globe className="w-3.5 h-3.5" />
            Disponible en toda Colombia
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">¿Listo para modernizar tu Comisaría?</h2>
          <p className="text-slate-500 text-base sm:text-lg mb-10 max-w-xl mx-auto">Comienza hoy y únete a más de 50 entidades que ya confían en Komi para proteger familias.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login" className="group bg-[#1B2A4A] hover:bg-[#142035] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl shadow-slate-900/25 hover:shadow-2xl flex items-center justify-center gap-2 transform hover:-translate-y-0.5">
              Empezar Gratis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a href="#" className="text-slate-600 hover:text-[#1B2A4A] px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300">
              Hablar con un Experto
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#0B1628] text-white pt-16 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-12">
            <div className="sm:col-span-2 md:col-span-1">
              <div className="mb-4">
                <SicofLogo iconClassName="h-9 w-9" inverted={true} showSubtitle={false} />
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">Soluciones tecnológicas integrales para la administración de justicia familiar moderna.</p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 text-sm">Plataforma</h3>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Características</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Seguridad</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Casos de Éxito</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 text-sm">Soporte</h3>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentación</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Estado del Sistema</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 text-sm">Actualizaciones</h3>
              <p className="text-slate-400 text-sm mb-4">Recibe noticias sobre legislación y tecnología.</p>
              <form className="flex flex-col gap-2">
                <input className="bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent placeholder-slate-500 text-sm backdrop-blur-sm" placeholder="tu@email.com" type="email" />
                <button className="bg-white/10 hover:bg-white/15 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors" type="button">Suscribirse</button>
              </form>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">© 2026 Komi. Todos los derechos reservados.</p>
            <div className="flex gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-white transition-colors">Privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Términos</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  )
}
