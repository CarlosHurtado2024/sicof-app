
import Link from "next/link"
import { SicofLogo, SicofLogoIcon } from "@/components/sicof-logo"
import { Gavel, Menu, ArrowRight, PlayCircle, CheckCircle, XCircle, Share2, Brain, FolderArchive, Shield, Zap, Clock, Users, ChevronRight, Star, Lock, BarChart3, FileText } from "lucide-react"

export const metadata = {
  title: 'SICOF — Sistema Integral para Comisarías de Familia',
  description: 'Plataforma integral de gestión para Comisarías de Familia. Moderniza procesos, reduce tiempos y garantiza cumplimiento de la Ley 2126.',
}

export default function Home() {
  return (
    <div className="font-[Inter,system-ui,sans-serif] bg-[#fafafa] text-slate-800 antialiased overflow-x-hidden selection:bg-violet-500/20 selection:text-violet-700">

      {/* --- NAVIGATION --- */}
      <nav className="fixed w-full z-50 top-0 bg-white/70 backdrop-blur-2xl border-b border-slate-200/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[72px]">
            {/* Logo */}
            <div className="flex-shrink-0 cursor-pointer">
              <SicofLogo iconClassName="h-10 w-10" inverted={false} showSubtitle={true} />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-1 items-center">
              <Link href="#modulos" className="text-slate-500 hover:text-slate-900 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-slate-100/80 text-sm">Módulos</Link>
              <Link href="#beneficios" className="text-slate-500 hover:text-slate-900 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-slate-100/80 text-sm">Beneficios</Link>
              <Link href="#precios" className="text-slate-500 hover:text-slate-900 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-slate-100/80 text-sm">Precios</Link>
              <Link href="#seguridad" className="text-slate-500 hover:text-slate-900 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-slate-100/80 text-sm">Seguridad</Link>
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login" className="text-slate-600 hover:text-slate-900 font-medium transition-colors text-sm px-4 py-2">
                Iniciar Sesión
              </Link>
              <Link href="/login" className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transform hover:-translate-y-0.5">
                Solicitar Demo
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button className="text-slate-600 hover:text-[#7C3AED] focus:outline-none p-2 rounded-lg hover:bg-slate-100">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-32 pb-24 lg:pt-44 lg:pb-36 overflow-hidden">
        {/* Background Mesh */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bg-gradient-to-br from-violet-500/15 to-transparent w-[800px] h-[800px] rounded-full -top-40 -left-40 blur-3xl"></div>
          <div className="absolute bg-gradient-to-bl from-indigo-400/10 to-transparent w-[600px] h-[600px] rounded-full top-20 right-0 blur-3xl"></div>
          <div className="absolute bg-gradient-to-t from-purple-300/10 to-transparent w-[500px] h-[500px] rounded-full bottom-0 left-1/3 blur-3xl"></div>
          {/* Dot pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#7C3AED_0.8px,transparent_0.8px)] [background-size:32px_32px] opacity-[0.03]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Hero Content */}
            <div className="space-y-8 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-violet-50 text-[#7C3AED] text-xs font-semibold border border-violet-200/60 gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7C3AED]"></span>
                </span>
                Módulo de IA Disponible — v2.4
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                Justicia familiar
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#6D28D9]">
                  inteligente y digital
                </span>
              </h1>

              <p className="text-base lg:text-lg text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                SICOF moderniza la gestión de las Comisarías de Familia con herramientas de IA, expediente digital y cumplimiento normativo automático de la Ley 2126.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link href="/login" className="group bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-7 py-3.5 rounded-xl font-semibold transition-all shadow-xl shadow-violet-500/25 hover:shadow-2xl hover:shadow-violet-500/30 flex items-center justify-center gap-2 transform hover:-translate-y-0.5">
                  Empezar Ahora
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <button className="group bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-7 py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 hover:border-violet-300 hover:text-[#7C3AED] shadow-sm">
                  <PlayCircle className="w-5 h-5 text-[#7C3AED]" />
                  Ver Demo
                </button>
              </div>

              {/* Social proof */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-sm text-slate-400">
                <div className="flex -space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm">JD</div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm">AM</div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm">CR</div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm">+</div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                  </div>
                  <span className="ml-1.5 font-medium">50+ entidades confían en SICOF</span>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative lg:h-[560px] flex items-center justify-center">
              <div className="relative w-full max-w-lg lg:max-w-full">
                {/* Main card */}
                <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-slate-200/60 p-3 relative z-20 transform hover:-translate-y-1 transition-all duration-500">
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl overflow-hidden aspect-[16/10]">
                    <img
                      alt="Dashboard interface"
                      className="w-full h-full object-cover opacity-95 hover:opacity-100 transition-opacity"
                      src="/dashboard-preview.svg"
                    />
                  </div>
                </div>

                {/* Floating cards */}
                <div className="absolute -left-8 bottom-24 bg-white p-4 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-slate-100 z-30 animate-[float_3s_ease-in-out_infinite]">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-50 p-2.5 rounded-lg text-emerald-600">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 font-medium">Casos Resueltos</p>
                      <p className="text-lg font-bold text-slate-800">+12%</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-4 top-12 bg-white p-4 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-slate-100 z-30 animate-[float_3s_ease-in-out_infinite_1s]">
                  <div className="flex items-center gap-3">
                    <div className="bg-violet-50 p-2.5 rounded-lg text-[#7C3AED]">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 font-medium">Alertas Activas</p>
                      <p className="text-lg font-bold text-slate-800">3 Nuevas</p>
                    </div>
                  </div>
                </div>

                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 to-transparent blur-[80px] -z-10 translate-y-20"></div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* --- LOGO BAR --- */}
      <section className="py-10 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-[0.2em] mb-8">Impacto en cifras</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-3xl lg:text-4xl font-extrabold text-[#7C3AED] mb-1 group-hover:scale-105 transition-transform">10,000+</div>
              <p className="text-slate-400 font-medium text-sm">Casos Gestionados</p>
            </div>
            <div className="group">
              <div className="text-3xl lg:text-4xl font-extrabold text-[#7C3AED] mb-1 group-hover:scale-105 transition-transform">50+</div>
              <p className="text-slate-400 font-medium text-sm">Comisarías Activas</p>
            </div>
            <div className="group">
              <div className="text-3xl lg:text-4xl font-extrabold text-[#7C3AED] mb-1 group-hover:scale-105 transition-transform">-40%</div>
              <p className="text-slate-400 font-medium text-sm">Tiempo de Respuesta</p>
            </div>
            <div className="group">
              <div className="text-3xl lg:text-4xl font-extrabold text-[#7C3AED] mb-1 group-hover:scale-105 transition-transform">99.9%</div>
              <p className="text-slate-400 font-medium text-sm">Disponibilidad</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- MODULES/FEATURES --- */}
      <section id="modulos" className="py-24 relative bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-[#7C3AED] font-semibold text-sm tracking-widest uppercase mb-3">Plataforma Integral</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">Tecnología al servicio de la justicia familiar</h2>
            <p className="text-slate-500 text-base">Herramientas diseñadas para cumplir estándares legales y optimizar cada flujo de trabajo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Feature 1 - Large */}
            <div className="md:col-span-2 md:row-span-2 bg-white rounded-2xl p-8 lg:p-10 shadow-sm hover:shadow-lg border border-slate-100 transition-all duration-300 group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-80 h-80 bg-violet-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-violet-100/60 transition-colors duration-500"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center text-[#7C3AED] mb-6 group-hover:scale-110 group-hover:bg-violet-100 transition-all duration-300">
                    <Gavel className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Ley 2126 Compliance</h3>
                  <p className="text-slate-500 text-base max-w-md leading-relaxed">
                    Garantiza cumplimiento normativo total. El sistema se actualiza automáticamente con cada cambio legislativo, asegurando que cada proceso respete términos y procedimientos de ley.
                  </p>
                </div>
                <div className="mt-8 relative h-48 bg-gradient-to-br from-slate-50 to-violet-50/50 rounded-xl border border-slate-100 overflow-hidden">
                  <img alt="Legal documents" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPyQXT7kdp4mOoQJYPFAlrwJRn0FICOMT9-b2f5K0Os3kfh4kvzcdlTrZoZ5TpHB-I1__Tqr3tW6zvFtK8Mq9PbSTZP05gv4Q4g99WGgSlm1k_9EjVrpt0GXYDKg4DkVsWWPMTPD3AI2JJF1erzfrnnNNpduJlcqkpOmagc9Ux4__JHt5n5IaWnoIVX_z1SCOxvRocB2FtUyC6kvzDytM6fMB09zdAmvG0T4RkshuNVCb7hXqb5J-0dvivD8ps2tBlTtiRLtSsyz6i4" />
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-6 lg:p-7 shadow-sm hover:shadow-lg border border-slate-100 transition-all duration-300 group hover:-translate-y-0.5">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-5 group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Interoperabilidad</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Conexión fluida con bases de datos externas y otras entidades del estado colombiano.</p>
            </div>

            {/* Feature 3 - Highlighted */}
            <div className="bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] rounded-2xl p-6 lg:p-7 shadow-lg shadow-violet-500/20 text-white transition-all duration-300 group hover:-translate-y-0.5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center text-white mb-5 backdrop-blur-sm border border-white/10">
                  <Brain className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold mb-2">IA para Riesgo</h3>
                <p className="text-violet-100 text-sm mb-5 leading-relaxed">Algoritmos predictivos para valorar el nivel de riesgo en casos de violencia intrafamiliar.</p>
                <div className="w-full bg-white/15 rounded-full h-1.5">
                  <div className="bg-white h-1.5 rounded-full w-[75%]"></div>
                </div>
                <p className="text-violet-200 text-[11px] mt-2 font-medium">75% precisión en predicción</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-6 lg:p-7 shadow-sm hover:shadow-lg border border-slate-100 transition-all duration-300 group hover:-translate-y-0.5">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-5 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-300">
                <FolderArchive className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Expediente Digital</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Centralización segura de documentos, pruebas y audios en la nube con cifrado AES-256.</p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-2xl p-6 lg:p-7 shadow-sm hover:shadow-lg border border-slate-100 transition-all duration-300 group hover:-translate-y-0.5">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-5 group-hover:scale-110 group-hover:bg-amber-100 transition-all duration-300">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Analítica Avanzada</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Dashboards en tiempo real con KPIs, tendencias y reportes automáticos para la toma de decisiones.</p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-2xl p-6 lg:p-7 shadow-sm hover:shadow-lg border border-slate-100 transition-all duration-300 group hover:-translate-y-0.5">
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
      <section id="beneficios" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#7C3AED] font-semibold text-sm tracking-widest uppercase mb-3">¿Por qué SICOF?</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 leading-tight">Diseñado para quienes protegen familias</h2>
              <p className="text-slate-500 text-base mb-10 leading-relaxed">Cada funcionalidad ha sido pensada en colaboración con comisarios, psicólogos y trabajadores sociales de toda Colombia.</p>

              <div className="space-y-6">
                <div className="flex gap-4 group">
                  <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center text-[#7C3AED] flex-shrink-0 group-hover:bg-violet-100 transition-colors">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Reducción del 40% en tiempos</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">Automatización de procesos repetitivos que antes consumían horas del equipo.</p>
                  </div>
                </div>
                <div className="flex gap-4 group">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Seguridad de nivel gubernamental</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">Encriptación AES-256, auditoría completa y cumplimiento de habeas data.</p>
                  </div>
                </div>
                <div className="flex gap-4 group">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Disponibilidad 24/7</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">Infraestructura cloud con 99.9% de uptime para acceso en cualquier momento.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-3xl p-8 lg:p-12 border border-violet-100/50">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
                    <p className="text-3xl font-extrabold text-[#7C3AED] mb-1">99%</p>
                    <p className="text-slate-500 text-xs font-medium">Satisfacción</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
                    <p className="text-3xl font-extrabold text-emerald-600 mb-1">24/7</p>
                    <p className="text-slate-500 text-xs font-medium">Soporte</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
                    <p className="text-3xl font-extrabold text-blue-600 mb-1">5 min</p>
                    <p className="text-slate-500 text-xs font-medium">Onboarding</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
                    <p className="text-3xl font-extrabold text-amber-600 mb-1">100%</p>
                    <p className="text-slate-500 text-xs font-medium">Compliance</p>
                  </div>
                </div>
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-violet-200/20 to-indigo-200/20 blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section id="precios" className="py-24 relative bg-[#fafafa] border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-[#7C3AED] font-semibold text-sm tracking-widest uppercase mb-3">Planes Transparentes</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">El plan ideal para tu Comisaría</h2>
            <p className="text-slate-500 text-base">Sin costos ocultos. Cancela cuando quieras.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Plan 1 */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200/60 hover:border-violet-200 transition-all duration-300 hover:shadow-lg group">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-1">Básico</h3>
                <p className="text-slate-400 text-sm">Para municipios pequeños.</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900">$850K</span>
                <span className="text-slate-400 text-sm ml-1">COP/mes</span>
              </div>
              <button className="w-full py-3 px-4 bg-slate-50 text-slate-700 font-semibold rounded-xl hover:bg-violet-50 hover:text-[#7C3AED] border border-slate-200 hover:border-violet-200 transition-all duration-300 mb-8 text-sm">
                Comenzar
              </button>
              <ul className="space-y-3 text-sm text-slate-500">
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-[#7C3AED] flex-shrink-0" /> Expediente Digital Básico</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-[#7C3AED] flex-shrink-0" /> Hasta 5 usuarios</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-[#7C3AED] flex-shrink-0" /> Soporte por Email</li>
                <li className="flex items-center gap-2.5 opacity-40"><XCircle className="w-4 h-4 flex-shrink-0" /> Valoración de Riesgo IA</li>
                <li className="flex items-center gap-2.5 opacity-40"><XCircle className="w-4 h-4 flex-shrink-0" /> Firma Electrónica</li>
              </ul>
            </div>

            {/* Plan 2 - Popular */}
            <div className="bg-white rounded-2xl p-8 border-2 border-[#7C3AED] shadow-[0_0_0_1px_rgba(124,58,237,0.1),0_20px_40px_rgba(124,58,237,0.12)] relative transform md:-translate-y-3">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#7C3AED] text-white text-[11px] font-bold px-4 py-1 rounded-full tracking-wide shadow-lg shadow-violet-500/30">
                RECOMENDADO
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[#7C3AED] mb-1">Institucional</h3>
                <p className="text-slate-400 text-sm">Para comisarías medianas y grandes.</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900">$2.1M</span>
                <span className="text-slate-400 text-sm ml-1">COP/mes</span>
              </div>
              <button className="w-full py-3 px-4 bg-[#7C3AED] text-white font-semibold rounded-xl hover:bg-[#6D28D9] shadow-lg shadow-violet-500/25 hover:shadow-xl transition-all duration-300 mb-8 text-sm">
                Obtener Plan
              </button>
              <ul className="space-y-3 text-sm text-slate-500">
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-[#7C3AED] flex-shrink-0" /> <span className="font-medium text-slate-700">Expediente Digital Completo</span></li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-[#7C3AED] flex-shrink-0" /> Valoración de Riesgo (IA)</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-[#7C3AED] flex-shrink-0" /> Firma Electrónica</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-[#7C3AED] flex-shrink-0" /> Usuarios Ilimitados</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-[#7C3AED] flex-shrink-0" /> Soporte Prioritario 24/7</li>
              </ul>
            </div>

            {/* Plan 3 */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200/60 hover:border-violet-200 transition-all duration-300 hover:shadow-lg">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-1">Gubernamental</h3>
                <p className="text-slate-400 text-sm">Gestión a nivel departamental.</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900">Custom</span>
              </div>
              <button className="w-full py-3 px-4 bg-slate-50 text-slate-700 font-semibold rounded-xl hover:bg-violet-50 hover:text-[#7C3AED] border border-slate-200 hover:border-violet-200 transition-all duration-300 mb-8 text-sm">
                Contactar Ventas
              </button>
              <ul className="space-y-3 text-sm text-slate-500">
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-[#7C3AED] flex-shrink-0" /> Todo lo de Institucional</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-[#7C3AED] flex-shrink-0" /> Interoperabilidad Estatal</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-[#7C3AED] flex-shrink-0" /> API Dedicada</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-[#7C3AED] flex-shrink-0" /> Auditoría Avanzada</li>
                <li className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-[#7C3AED] flex-shrink-0" /> Gerente de Cuenta</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIAL --- */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
        </div>
        <div className="max-w-3xl mx-auto px-4 relative z-10 text-center">
          <div className="flex justify-center gap-1 mb-8">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
          </div>
          <blockquote className="text-xl md:text-2xl font-medium text-white mb-8 leading-relaxed">
            &ldquo;SICOF ha transformado radicalmente la forma en que atendemos a las familias. La agilidad administrativa se traduce directamente en una justicia más humana y oportuna.&rdquo;
          </blockquote>
          <cite className="flex items-center justify-center gap-4 not-italic">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
              MG
            </div>
            <div className="text-left">
              <div className="text-white font-semibold">Dra. Maria González</div>
              <div className="text-violet-300 text-sm">Comisaria Primera de Familia</div>
            </div>
          </cite>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">¿Listo para modernizar tu Comisaría?</h2>
          <p className="text-slate-500 text-base mb-8 max-w-xl mx-auto">Comienza hoy y únete a más de 50 entidades que ya confían en SICOF para proteger familias.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login" className="group bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-xl shadow-violet-500/25 hover:shadow-2xl flex items-center justify-center gap-2 transform hover:-translate-y-0.5">
              Empezar Gratis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a href="#" className="text-slate-600 hover:text-[#7C3AED] px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 border border-slate-200 hover:border-violet-200">
              Hablar con un Experto
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-white pt-16 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

            <div className="col-span-1">
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
                <input className="bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent placeholder-slate-500 text-sm" placeholder="tu@email.com" type="email" />
                <button className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors" type="button">Suscribirse</button>
              </form>
            </div>

          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">© 2026 SICOF. Todos los derechos reservados.</p>
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
