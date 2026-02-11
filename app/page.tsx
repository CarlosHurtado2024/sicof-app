
import Link from "next/link"
import { Gavel, Menu, ArrowRight, PlayCircle, CheckCircle, XCircle, Share2, Brain, FolderArchive, Quote } from "lucide-react"

export default function Home() {
  return (
    <div className="font-sans bg-[#f7f6f8] text-slate-800 antialiased overflow-x-hidden selection:bg-purple-500/30 selection:text-purple-600">

      {/* --- NAVIGATION --- */}
      <nav className="fixed w-full z-50 top-0 bg-[#f7f6f8]/80 backdrop-blur-xl border-b border-white/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 bg-[#921ac6] rounded-lg flex items-center justify-center text-white shadow-[0_0_20px_rgba(146,26,198,0.3)]">
                <Gavel className="w-6 h-6" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">SICOF</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              <Link href="#modulos" className="text-slate-600 hover:text-[#921ac6] font-medium transition-colors">Módulos</Link>
              <Link href="#beneficios" className="text-slate-600 hover:text-[#921ac6] font-medium transition-colors">Beneficios</Link>
              <Link href="#precios" className="text-slate-600 hover:text-[#921ac6] font-medium transition-colors">Precios</Link>
              <Link href="#seguridad" className="text-slate-600 hover:text-[#921ac6] font-medium transition-colors">Seguridad</Link>
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex">
              <Link href="/login" className="bg-[#921ac6] hover:bg-[#7a15a6] text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-lg hover:shadow-[0_0_30px_rgba(146,26,198,0.5)] transform hover:-translate-y-0.5">
                Ingresar al Sistema
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button className="text-slate-600 hover:text-[#921ac6] focus:outline-none">
                <Menu className="w-8 h-8" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute bg-[#921ac6]/20 w-96 h-96 rounded-full top-0 -left-20 blur-[80px] opacity-60 animate-pulse"></div>
          <div className="absolute bg-purple-300/30 w-[30rem] h-[30rem] rounded-full bottom-0 right-0 blur-[80px] opacity-60"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#921ac6_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Hero Content */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#921ac6]/10 text-[#921ac6] text-sm font-semibold border border-[#921ac6]/20 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#921ac6] mr-2 animate-pulse"></span>
                Nuevo Módulo de IA Disponible
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Transformación Digital <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#921ac6] to-purple-400">
                  en las Comisarías de Familia
                </span>
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Sistema Integral de Gestión para Comisarías de Familia. Moderniza procesos, reduce tiempos de respuesta y garantiza el cumplimiento de la Ley 2126 con nuestra plataforma segura y escalable.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/login" className="bg-[#921ac6] hover:bg-[#7a15a6] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-xl hover:shadow-[0_0_30px_rgba(146,26,198,0.5)] flex items-center justify-center gap-2">
                  <span>Empezar Ahora</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 hover:border-[#921ac6]/30">
                  <PlayCircle className="w-5 h-5 text-[#921ac6]" />
                  <span>Ver Demo</span>
                </button>
              </div>

              <div className="pt-6 flex items-center justify-center lg:justify-start gap-4 text-sm text-slate-500">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600">JD</div>
                  <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600">AM</div>
                  <div className="w-8 h-8 rounded-full bg-slate-400 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600">CR</div>
                </div>
                <p>Confianza de +50 entidades gubernamentales</p>
              </div>
            </div>

            {/* Hero Image / Dashboard Preview */}
            <div className="relative lg:h-[600px] flex items-center justify-center perspective-[1000px]">
              <div className="relative w-full max-w-lg lg:max-w-full transform rotate-y-12 hover:rotate-y-6 transition-transform duration-700 ease-out preserve-3d">
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 relative z-20 transform hover:-translate-y-2 transition-transform duration-500">
                  <div className="bg-slate-50 rounded-xl overflow-hidden aspect-[16/10]">
                    <img
                      alt="Dashboard interface"
                      className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity bg-slate-50"
                      src="/dashboard-preview.svg"
                    />
                  </div>

                  {/* Floating Cards */}
                  <div className="absolute -left-12 bottom-20 bg-white p-4 rounded-xl shadow-lg border border-slate-100 z-30 animate-bounce delay-1000 duration-[3000ms]">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-lg text-green-600">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Casos Resueltos</p>
                        <p className="text-lg font-bold text-slate-800">+12%</p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -right-8 top-10 bg-white p-4 rounded-xl shadow-lg border border-slate-100 z-30 animate-bounce delay-500 duration-[4000ms]">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#921ac6]/10 p-2 rounded-lg text-[#921ac6]">
                        <Quote className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Alertas Activas</p>
                        <p className="text-lg font-bold text-slate-800">3 Nuevas</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Glow behind */}
                <div className="absolute inset-0 bg-[#921ac6] blur-[100px] opacity-20 -z-10 transform translate-y-20"></div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* --- STATS SECTION --- */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100 text-center">
            <div className="p-4 group">
              <div className="text-4xl lg:text-5xl font-extrabold text-[#921ac6] mb-2 group-hover:scale-110 transition-transform duration-300">10k+</div>
              <p className="text-slate-500 font-medium uppercase tracking-wide text-sm">Casos Gestionados</p>
            </div>
            <div className="p-4 group">
              <div className="text-4xl lg:text-5xl font-extrabold text-[#921ac6] mb-2 group-hover:scale-110 transition-transform duration-300">50+</div>
              <p className="text-slate-500 font-medium uppercase tracking-wide text-sm">Comisarías Digitalizadas</p>
            </div>
            <div className="p-4 group">
              <div className="text-4xl lg:text-5xl font-extrabold text-[#921ac6] mb-2 group-hover:scale-110 transition-transform duration-300">-40%</div>
              <p className="text-slate-500 font-medium uppercase tracking-wide text-sm">Tiempo de Respuesta</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- MODULES/FEATURES --- */}
      <section id="modulos" className="py-24 relative bg-[#f7f6f8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-base text-[#921ac6] font-semibold tracking-wide uppercase mb-2">Potencia Institucional</h2>
            <p className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Tecnología al servicio de la justicia familiar</p>
            <p className="text-lg text-slate-600">Herramientas diseñadas específicamente para cumplir con los estándares legales y optimizar el flujo de trabajo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
            {/* Feature 1: Ley Compliance */}
            <div className="md:col-span-2 md:row-span-2 bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_0_30px_rgba(146,26,198,0.2)] border border-slate-100 transition-all duration-300 group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#921ac6]/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-[#921ac6]/10 transition-colors"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 bg-[#921ac6]/10 rounded-xl flex items-center justify-center text-[#921ac6] mb-6 group-hover:scale-110 transition-transform">
                    <Gavel className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Ley 2126 Compliance</h3>
                  <p className="text-slate-600 text-lg max-w-md">
                    Garantiza el cumplimiento normativo total. Nuestro sistema se actualiza automáticamente con cada cambio en la legislación de comisarías de familia, asegurando que cada proceso respete los términos y procedimientos de ley.
                  </p>
                </div>
                <div className="mt-8 relative h-48 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
                  <img alt="Legal documents" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPyQXT7kdp4mOoQJYPFAlrwJRn0FICOMT9-b2f5K0Os3kfh4kvzcdlTrZoZ5TpHB-I1__Tqr3tW6zvFtK8Mq9PbSTZP05gv4Q4g99WGgSlm1k_9EjVrpt0GXYDKg4DkVsWWPMTPD3AI2JJF1erzfrnnNNpduJlcqkpOmagc9Ux4__JHt5n5IaWnoIVX_z1SCOxvRocB2FtUyC6kvzDytM6fMB09zdAmvG0T4RkshuNVCb7hXqb5J-0dvivD8ps2tBlTtiRLtSsyz6i4" />
                </div>
              </div>
            </div>

            {/* Feature 2: Interoperability */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-lg border border-slate-100 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4 group-hover:rotate-12 transition-transform">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Interoperabilidad</h3>
              <p className="text-slate-600 text-sm">Conexión fluida con bases de datos externas y otras entidades del estado.</p>
            </div>

            {/* Feature 3: AI Risk */}
            <div className="bg-gradient-to-br from-[#921ac6] to-purple-600 rounded-2xl p-6 shadow-lg text-white transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-white mb-4 backdrop-blur-sm">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">IA para Riesgo</h3>
              <p className="text-purple-100 text-sm mb-4">Algoritmos predictivos para valorar el nivel de riesgo en casos de violencia intrafamiliar.</p>
              <div className="w-full bg-white/20 rounded-full h-1.5 mt-auto">
                <div className="bg-white h-1.5 rounded-full w-[75%]"></div>
              </div>
            </div>

            {/* Feature 4: Digital Files */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-lg border border-slate-100 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600 mb-4">
                <FolderArchive className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Expediente Digital</h3>
              <p className="text-slate-600 text-sm">Centralización segura de documentos, pruebas y audios en la nube.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section id="precios" className="py-24 relative bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-base text-[#921ac6] font-semibold tracking-wide uppercase mb-2">Planes Flexibles</h2>
            <p className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">Elige el plan ideal para tu Comisaría</p>
            <div className="flex items-center justify-center gap-4 mt-8">
              <span className="text-slate-600 font-medium text-sm">Mensual</span>
              <button className="w-14 h-8 bg-[#921ac6] rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#921ac6]">
                <span className="absolute right-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform transform translate-x-0"></span>
              </button>
              <span className="text-slate-900 font-bold text-sm">Anual <span className="text-[#921ac6] text-xs font-normal ml-1 bg-[#921ac6]/10 px-2 py-0.5 rounded-full">-20%</span></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

            {/* Plan 1 */}
            <div className="bg-[#f7f6f8] rounded-2xl p-8 border border-slate-200 hover:border-[#921ac6]/30 transition-all duration-300 hover:shadow-lg relative group">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Básico</h3>
                <p className="text-slate-500 text-sm h-10">Para municipios pequeños que inician su transformación digital.</p>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-extrabold text-slate-900">$850.000</span>
                <span className="text-slate-500 text-sm"> COP / mes</span>
              </div>
              <button className="w-full py-3 px-4 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:text-[#921ac6] hover:border-[#921ac6]/30 transition-all duration-300 mb-8">
                Comenzar Gratis
              </button>
              <ul className="space-y-4 text-sm text-slate-600">
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-[#921ac6]" /> <span>Expediente Digital Básico</span></li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-[#921ac6]" /> <span>Hasta 5 usuarios</span></li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-[#921ac6]" /> <span>Soporte por Email</span></li>
                <li className="flex items-center gap-3 opacity-50"><XCircle className="w-5 h-5 text-slate-400" /> <span>Valoración de Riesgo IA</span></li>
                <li className="flex items-center gap-3 opacity-50"><XCircle className="w-5 h-5 text-slate-400" /> <span>Firma Electrónica Avanzada</span></li>
              </ul>
            </div>

            {/* Plan 2 - Popular */}
            <div className="bg-white rounded-2xl p-8 border-2 border-[#921ac6] shadow-[0_0_20px_rgba(146,26,198,0.3)] relative transform md:-translate-y-4 z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#921ac6] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-md">
                Más Popular
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-[#921ac6] mb-2">Institucional</h3>
                <p className="text-slate-500 text-sm h-10">La solución estándar para comisarías medianas y grandes.</p>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-extrabold text-slate-900">$2.100.000</span>
                <span className="text-slate-500 text-sm"> COP / mes</span>
              </div>
              <button className="w-full py-3 px-4 bg-[#921ac6] text-white font-semibold rounded-xl hover:bg-[#7a15a6] shadow-lg hover:shadow-[0_0_20px_rgba(146,26,198,0.3)] transition-all duration-300 mb-8">
                Obtener Plan
              </button>
              <ul className="space-y-4 text-sm text-slate-600">
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-[#921ac6]" /> <span className="font-medium text-slate-900">Expediente Digital Completo</span></li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-[#921ac6]" /> <span>Valoración de Riesgo (IA)</span></li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-[#921ac6]" /> <span>Firma Electrónica</span></li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-[#921ac6]" /> <span>Usuarios Ilimitados</span></li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-[#921ac6]" /> <span>Soporte Prioritario 24/7</span></li>
              </ul>
            </div>

            {/* Plan 3 */}
            <div className="bg-[#f7f6f8] rounded-2xl p-8 border border-slate-200 hover:border-[#921ac6]/30 transition-all duration-300 hover:shadow-lg">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Gubernamental</h3>
                <p className="text-slate-500 text-sm h-10">Gestión a nivel departamental con interoperabilidad total.</p>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-extrabold text-slate-900">Personalizado</span>
              </div>
              <button className="w-full py-3 px-4 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:text-[#921ac6] hover:border-[#921ac6]/30 transition-all duration-300 mb-8">
                Contactar Ventas
              </button>
              <ul className="space-y-4 text-sm text-slate-600">
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-[#921ac6]" /> <span>Todo lo de Institucional</span></li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-[#921ac6]" /> <span>Interoperabilidad Estatal</span></li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-[#921ac6]" /> <span>API Dedicada</span></li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-[#921ac6]" /> <span>Auditoría Avanzada</span></li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-[#921ac6]" /> <span>Gerente de Cuenta Dedicado</span></li>
              </ul>
            </div>
          </div>

          <div className="mt-16 bg-[#921ac6]/5 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between border border-[#921ac6]/10">
            <div className="mb-4 md:mb-0">
              <h4 className="text-lg font-bold text-slate-900">¿Necesitas una implementación a medida?</h4>
              <p className="text-slate-600 text-sm">Nuestros ingenieros pueden adaptar SICOF a los requerimientos específicos de tu entidad.</p>
            </div>
            <a href="#" className="text-[#921ac6] font-bold hover:text-[#7a15a6] flex items-center gap-2 group">
              Hablar con un experto
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIAL --- */}
      <section className="py-20 bg-[#1c1121] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <Quote className="w-16 h-16 text-[#921ac6]/40 mx-auto mb-6" />
          <blockquote className="text-2xl md:text-3xl font-medium text-white mb-8 leading-relaxed">
            "SICOF ha transformado radicalmente la forma en que atendemos a las familias. La agilidad administrativa se traduce directamente en una justicia más humana y oportuna."
          </blockquote>
          <cite className="flex items-center justify-center gap-4 not-italic">
            <div className="w-12 h-12 rounded-full bg-slate-700 overflow-hidden">
              <img alt="Portrait" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAa84WhAka6yVio466PGQqJcSo7sjd3DfEY2zJmhzqFf59UqKKbvxmH5sn80jDc2CotZ9ekjfkmkrXR6tMJ9ycvXxP7etJNH73OBAruFUjy4VnV8XWNCKLcjKvunwhs-5CZg9Q2q6TO9RTy1NNm0yYmPPQDGUWCaX_WNg9s8jNdvC0lUFJFaWJ4q8ezhyMRYjjrZOg7THv4tLvK84_KoK9tw_kCSe0U-ikMwp9zyUSrOCRlIf2uOytGq29WTDJzRkA1OJbPV5mo_DVg" />
            </div>
            <div className="text-left">
              <div className="text-white font-bold">Dra. Maria González</div>
              <div className="text-[#921ac6] text-sm">Comisaria Primera de Familia</div>
            </div>
          </cite>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-white pt-16 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

            <div className="col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#921ac6] rounded-lg flex items-center justify-center text-white">
                  <Gavel className="w-4 h-4" />
                </div>
                <span className="font-bold text-xl tracking-tight">SICOF</span>
              </div>
              <p className="text-slate-400 text-sm mb-6">Soluciones tecnológicas integrales para la administración de justicia familiar moderna.</p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Plataforma</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-[#921ac6] transition-colors">Características</a></li>
                <li><a href="#" className="hover:text-[#921ac6] transition-colors">Seguridad</a></li>
                <li><a href="#" className="hover:text-[#921ac6] transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-[#921ac6] transition-colors">Casos de Éxito</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-[#921ac6] transition-colors">Documentación</a></li>
                <li><a href="#" className="hover:text-[#921ac6] transition-colors">API</a></li>
                <li><a href="#" className="hover:text-[#921ac6] transition-colors">Estado del Sistema</a></li>
                <li><a href="#" className="hover:text-[#921ac6] transition-colors">Contacto</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Actualizaciones</h3>
              <p className="text-slate-400 text-sm mb-4">Recibe noticias sobre legislación y tecnología.</p>
              <form className="flex flex-col gap-2">
                <input className="bg-slate-800 border-none text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#921ac6] placeholder-slate-500" placeholder="tu@email.com" type="email" />
                <button className="bg-[#921ac6] hover:bg-[#7a15a6] text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors" type="button">Suscribirse</button>
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
    </div>
  )
}
