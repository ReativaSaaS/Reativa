import { useState, useEffect, useRef } from 'react'
import { motion, useInView, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Check, MessageSquare, Bot, TrendingUp, Users, Clock, BarChart3,
  Mail, Phone, MapPin, Send, Menu, X, Star, ChevronRight, Sparkles, Zap, Shield
} from 'lucide-react'

// =============================================
// ANIMATED COUNTER HOOK
// =============================================
function useCounter(end, duration = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const increment = end / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, end, duration])

  return { count, ref }
}

// =============================================
// NAVBAR
// =============================================
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const links = [
    { href: '#home', label: 'Home' },
    { href: '#features', label: 'Features' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
  ]

  const scrollTo = (e, href) => {
    e.preventDefault()
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-500 ${
          scrolled ? 'bg-[#080810]/80 backdrop-blur-xl border-b border-white/[0.07] py-3' : 'py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] flex items-center justify-center shadow-lg shadow-[#7C3AED]/20">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Check size={18} className="text-white" strokeWidth={3} />
                </motion.div>
              </div>
            </div>
            <span className="font-['Syne'] text-xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              REATIVA
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {links.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                className="relative text-sm font-medium text-white/60 hover:text-white transition-colors group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-white/60 hover:text-white transition-colors px-4 py-2">
              Login
            </Link>
            <Link to="/register" className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] via-[#2563EB] to-[#06B6D4] rounded-lg blur-sm opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#7C3AED] via-[#2563EB] to-[#06B6D4] rounded-lg text-white text-sm font-semibold overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_3s_ease_infinite]" />
                Começar Grátis
                <ArrowRight size={14} />
              </div>
            </Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#080810]/98 backdrop-blur-xl z-[999] flex flex-col items-center justify-center gap-8"
          >
            {links.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                className="font-['Syne'] text-3xl font-bold text-white/80 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-3 w-60 mt-4">
              <Link to="/login" className="text-center py-3 bg-white/5 border border-white/10 rounded-lg text-white font-medium">
                Login
              </Link>
              <Link to="/register" className="text-center py-3 bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] rounded-lg text-white font-semibold">
                Começar Grátis
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// =============================================
// HERO
// =============================================
function Hero() {
  const stats = [
    { end: 2500, suffix: '+', label: 'Empresas' },
    { end: 98, suffix: '%', label: 'Satisfação' },
    { end: 50, suffix: 'M+', label: 'Mensagens/mês' },
  ]

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#7C3AED]/15 rounded-full blur-[120px]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%200h40v40H0z%22%20fill%3D%22none%22%2F%3E%3Cpath%20d%3D%22M0%200h1v40H0z%22%20fill%3D%22rgba(255%2C255%2C255%2C0.03)%22%2F%3E%3Cpath%20d%3D%22M0%200h40v1H0z%22%20fill%3D%22rgba(255%2C255%2C255%2C0.03)%22%2F%3E%3C%2Fsvg%3E')] opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Content */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/[0.05] border border-white/[0.07] rounded-full text-sm text-white/50 mb-8"
          >
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Plataforma em Beta
          </motion.div>

          <motion.h1
            className="font-['Syne'] text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6"
          >
            {['Reative', 'clientes'].map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="inline-block mr-3"
              >
                {word}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block bg-gradient-to-r from-[#7C3AED] via-[#2563EB] to-[#06B6D4] bg-clip-text text-transparent animate-[hue-shift_8s_ease_infinite]"
            >
              perdidos.
            </motion.span>
            <br />
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-block text-white/60 font-normal"
            >
              Organize seu negócio.
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg text-white/50 leading-relaxed mb-10 max-w-lg"
          >
            Automatize o atendimento, recupere clientes inativos e mantenha seu negócio funcionando 24/7 — sem complicação.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <Link to="/register" className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] rounded-xl blur-sm opacity-60 group-hover:opacity-100 transition-opacity animate-pulse" />
              <div className="relative flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] rounded-xl text-white font-semibold text-base">
                Comece Grátis
                <ArrowRight size={18} />
              </div>
            </Link>
            <a href="#features" className="flex items-center gap-2 px-8 py-4 bg-white/[0.05] border border-white/[0.07] rounded-xl text-white font-semibold text-base backdrop-blur-xl hover:bg-white/[0.08] transition-all">
              Ver Funcionalidades
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex items-center gap-8"
          >
            {stats.map((stat, i) => {
              const { count, ref } = useCounter(stat.end)
              return (
                <div key={i} ref={ref} className="flex flex-col">
                  <span className="font-['Syne'] text-2xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">
                    {count.toLocaleString()}{stat.suffix}
                  </span>
                  <span className="text-xs text-white/40">{stat.label}</span>
                </div>
              )
            })}
          </motion.div>
        </div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED]/20 to-[#06B6D4]/20 rounded-3xl blur-3xl" />
          <motion.div
            animate={{ y: [-8, 0, -8] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="relative bg-[#0F0F1A]/80 backdrop-blur-2xl border border-white/[0.07] rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Browser Chrome */}
            <div className="flex items-center gap-3 px-4 py-3 bg-black/40 border-b border-white/[0.07]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex-1 text-center">
                <div className="inline-block px-4 py-1 bg-white/[0.05] rounded text-xs text-white/30">
                  app.reativa.com/dashboard
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-5 space-y-4">
              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Conversas', value: '1,247', change: '+12.5%', color: 'emerald' },
                  { label: 'Reativados', value: '384', change: '+8.3%', color: 'blue' },
                  { label: 'Resolução', value: '94%', change: '+5.2%', color: 'purple' },
                ].map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="bg-black/30 border border-white/[0.05] rounded-lg p-3"
                  >
                    <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{m.label}</div>
                    <div className="font-['Syne'] text-lg font-bold text-white">{m.value}</div>
                    <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">{m.change}</div>
                  </motion.div>
                ))}
              </div>

              {/* Chart */}
              <div className="bg-black/30 border border-white/[0.05] rounded-lg p-4 h-24 flex items-end gap-2">
                {[40, 65, 45, 80, 60, 90, 70, 85, 55, 95, 75, 88].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.6, delay: 1 + i * 0.05 }}
                    className="flex-1 bg-gradient-to-t from-[#7C3AED] to-[#06B6D4] rounded-t opacity-70 hover:opacity-100 transition-opacity"
                  />
                ))}
              </div>

              {/* Client Rows */}
              <div className="space-y-2">
                {[
                  { name: 'Maria Clara', status: 'Online', color: 'from-[#7C3AED] to-[#06B6D4]', badge: 'emerald' },
                  { name: 'Rafael Santos', status: 'Inativo', color: 'from-yellow-500 to-red-500', badge: 'yellow' },
                  { name: 'Ana Lima', status: 'Reativado', color: 'from-emerald-500 to-blue-500', badge: 'blue' },
                ].map((c, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 + i * 0.1 }}
                    className="flex items-center gap-3 py-2 px-3 bg-black/20 rounded-lg"
                  >
                    <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${c.color} flex items-center justify-center text-white text-xs font-bold`}>
                      {c.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white">{c.name}</div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      c.badge === 'emerald' ? 'bg-emerald-500/15 text-emerald-400' :
                      c.badge === 'yellow' ? 'bg-yellow-500/15 text-yellow-400' :
                      'bg-blue-500/15 text-blue-400'
                    }`}>
                      {c.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// =============================================
// FEATURES
// =============================================
function Features() {
  const features = [
    { icon: MessageSquare, title: 'Automação de Mensagens', desc: 'Respostas inteligentes que se adaptam ao contexto de cada conversa.' },
    { icon: Bot, title: 'Chatbot Inteligente', desc: 'IA que entende a intenção do cliente e resolve 90% das dúvidas.' },
    { icon: TrendingUp, title: 'Campanhas Promocionais', desc: 'Crie campanhas segmentadas para reengajar clientes inativos.' },
    { icon: Users, title: 'Organização de Clientes', desc: 'CRM integrado para gerenciar contatos, histórico e segmentar sua base.' },
    { icon: Clock, title: 'Agendamento de Respostas', desc: 'Programe mensagens para o momento ideal e nunca perca uma oportunidade.' },
    { icon: BarChart3, title: 'Painel Analítico', desc: 'Dashboards em tempo real para acompanhar métricas e performance.' },
  ]

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <section id="features" className="relative py-32 z-10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7C3AED] mb-4">
            <span className="w-6 h-[2px] bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] rounded" />
            Funcionalidades
          </span>
          <h2 className="font-['Syne'] text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Tudo que você precisa para{' '}
            <span className="bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">reativar</span>
          </h2>
          <p className="text-lg text-white/50 max-w-xl mx-auto">Ferramentas poderosas para transformar clientes perdidos em oportunidades.</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                className={`group relative bg-[#0F0F1A] border border-white/[0.07] rounded-2xl p-8 backdrop-blur-xl transition-all duration-300 hover:border-[#7C3AED]/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#7C3AED]/10 overflow-hidden ${
                  i === 0 ? 'lg:col-span-2' : ''
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7C3AED]/20 to-[#06B6D4]/20 flex items-center justify-center mb-5"
                  >
                    <Icon size={22} className="text-[#7C3AED]" />
                  </motion.div>
                  <h3 className="font-['Syne'] text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
                </div>
                <div className="absolute bottom-6 right-6 text-[#7C3AED] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <ChevronRight size={16} />
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

// =============================================
// HOW IT WORKS
// =============================================
function HowItWorks() {
  const steps = [
    { num: '01', title: 'Conecte seus Contatos', desc: 'Importe sua base ou conecte com WhatsApp Business.' },
    { num: '02', title: 'Configure Automações', desc: 'Crie fluxos com nossa interface drag-and-drop.' },
    { num: '03', title: 'Acompanhe Resultados', desc: 'Monitore métricas e veja clientes perdidos voltando.' },
  ]

  return (
    <section id="about" className="relative py-32 z-10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7C3AED] mb-4">
            <span className="w-6 h-[2px] bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] rounded" />
            Como Funciona
          </span>
          <h2 className="font-['Syne'] text-4xl md:text-5xl font-bold tracking-tight">
            Três passos para{' '}
            <span className="bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">reativar</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10 relative">
          {/* Connecting Line */}
          <div className="absolute top-16 left-[15%] w-[70%] h-[2px] hidden md:block">
            <div className="w-full h-full border-t-2 border-dashed border-white/[0.1]" />
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4]"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 2px, 0 2px)' }}
            />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="text-center relative"
            >
              <div className="relative inline-block mb-6">
                <span className="font-['Syne'] text-[120px] font-extrabold text-white/[0.03] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  {step.num}
                </span>
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-[#7C3AED]/20">
                  {step.num}
                </div>
              </div>
              <h3 className="font-['Syne'] text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-sm text-white/50 max-w-xs mx-auto">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// =============================================
// PRICING
// =============================================
function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: 97,
      desc: 'Ideal para quem está começando',
      features: ['Até 500 contatos', '5 automações ativas', 'Relatórios básicos', 'Suporte por email'],
      featured: false,
    },
    {
      name: 'Pro',
      price: 197,
      desc: 'Para negócios em crescimento',
      features: ['Até 5.000 contatos', 'Automações ilimitadas', 'Chatbot com IA', 'Relatórios avançados', 'Suporte prioritário'],
      featured: true,
    },
    {
      name: 'Business',
      price: 497,
      desc: 'Para operações de grande escala',
      features: ['Contatos ilimitados', 'Tudo do Pro', 'API dedicada', 'Multi-atendentes', 'Gerente de conta'],
      featured: false,
    },
  ]

  return (
    <section id="pricing" className="relative py-32 z-10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7C3AED] mb-4">
            <span className="w-6 h-[2px] bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] rounded" />
            Preços
          </span>
          <h2 className="font-['Syne'] text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Planos que <span className="bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">crescem</span> com você
          </h2>
          <p className="text-lg text-white/50 max-w-xl mx-auto">Escolha o plano ideal para o tamanho do seu negócio.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`relative bg-[#0F0F1A] border rounded-2xl p-9 transition-all duration-300 hover:-translate-y-1 ${
                plan.featured
                  ? 'border-[#7C3AED]/50 shadow-lg shadow-[#7C3AED]/10 scale-[1.02]'
                  : 'border-white/[0.07] hover:border-white/[0.15]'
              }`}
            >
              {plan.featured && (
                <>
                  <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-[#7C3AED] via-[#2563EB] to-[#06B6D4] -z-10" />
                  <div className="absolute inset-0 rounded-2xl bg-[#0F0F1A] -z-[5]" />
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white text-xs font-semibold px-4 py-1 rounded-full">
                    Mais Popular
                  </div>
                  <div className="absolute inset-0 bg-[#7C3AED]/5 rounded-2xl blur-3xl -z-[3]" />
                </>
              )}

              <div className="text-base font-semibold text-white/60 mb-2">{plan.name}</div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-lg font-semibold text-white/60">R$</span>
                <span className="font-['Syne'] text-5xl font-extrabold text-white">{plan.price}</span>
                <span className="text-base text-white/40">/mês</span>
              </div>
              <p className="text-sm text-white/40 mb-7">{plan.desc}</p>

              <ul className="mb-8 space-y-0">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 py-3 border-b border-white/[0.05] text-sm text-white/60 last:border-0">
                    <Check size={16} className="text-[#7C3AED] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={`block w-full py-3.5 text-center rounded-lg font-semibold transition-all duration-300 ${
                  plan.featured
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white shadow-lg shadow-[#7C3AED]/20 hover:shadow-[#7C3AED]/40'
                    : 'bg-white/[0.05] border border-white/[0.07] text-white hover:bg-white/[0.08]'
                }`}
              >
                Começar Agora
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// =============================================
// TESTIMONIALS
// =============================================
function Testimonials() {
  const testimonials = [
    {
      quote: 'A REATIVA transformou nosso atendimento. Reduzimos o tempo de resposta em 80% e clientes perdidos estão voltando.',
      name: 'Maria Clara',
      role: 'CEO, Boutique Online',
      avatar: 'MC',
      gradient: 'from-[#7C3AED] to-[#06B6D4]',
    },
    {
      quote: 'O chatbot resolve 90% das dúvidas sem intervenção humana. Economia absurda de tempo e dinheiro.',
      name: 'Rafael Santos',
      role: 'Fundador, Tech Solutions',
      avatar: 'RS',
      gradient: 'from-yellow-500 to-red-500',
    },
    {
      quote: 'A segmentação automática aumentou nossa taxa de conversão em 45%. Ferramenta indispensável.',
      name: 'Ana Lima',
      role: 'Diretora de Marketing, E-commerce Plus',
      avatar: 'AL',
      gradient: 'from-emerald-500 to-blue-500',
    },
  ]

  return (
    <section className="relative py-32 z-10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7C3AED] mb-4">
            <span className="w-6 h-[2px] bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] rounded" />
            Depoimentos
          </span>
          <h2 className="font-['Syne'] text-4xl md:text-5xl font-bold tracking-tight">
            O que nossos <span className="bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">clientes</span> dizem
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group bg-[#0F0F1A] border border-white/[0.07] rounded-2xl p-8 backdrop-blur-xl transition-all duration-300 hover:border-[#7C3AED]/30 hover:-translate-y-1 relative overflow-hidden"
            >
              <span className="absolute top-4 left-6 text-6xl font-serif bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent opacity-20">"</span>
              <div className="flex gap-1 mb-4 relative z-10">
                {[...Array(5)].map((_, j) => (
                  <motion.div
                    key={j}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + j * 0.05 }}
                  >
                    <Star size={14} fill="#F59E0B" className="text-yellow-500" />
                  </motion.div>
                ))}
              </div>
              <p className="text-sm text-white/60 leading-relaxed mb-6 relative z-10">"{t.quote}"</p>
              <div className="flex items-center gap-3 relative z-10">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-xs font-bold`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-white/40">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// =============================================
// CONTACT
// =============================================
function Contact() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'contato@reativa.com' },
    { icon: Phone, label: 'Telefone', value: '+55 (11) 9999-9999' },
    { icon: MapPin, label: 'Localização', value: 'São Paulo, SP - Brasil' },
  ]

  return (
    <section id="contact" className="relative py-32 z-10 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7C3AED] mb-4">
            <span className="w-6 h-[2px] bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] rounded" />
            Contato
          </span>
          <h2 className="font-['Syne'] text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Pronto para <span className="bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">começar</span>?
          </h2>
          <p className="text-lg text-white/50 max-w-xl mx-auto">Entre em contato ou crie sua conta gratuitamente.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.form
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Nome</label>
              <input
                type="text"
                placeholder="Seu nome completo"
                required
                className="w-full px-4 py-3.5 bg-white/[0.05] border border-white/[0.07] rounded-xl text-white placeholder-white/30 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/30 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Email</label>
              <input
                type="email"
                placeholder="seu@email.com"
                required
                className="w-full px-4 py-3.5 bg-white/[0.05] border border-white/[0.07] rounded-xl text-white placeholder-white/30 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/30 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Mensagem</label>
              <textarea
                placeholder="Como podemos ajudar?"
                rows="4"
                required
                className="w-full px-4 py-3.5 bg-white/[0.05] border border-white/[0.07] rounded-xl text-white placeholder-white/30 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/30 transition-all outline-none resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#7C3AED] via-[#2563EB] to-[#06B6D4] rounded-xl text-white font-semibold text-base hover:shadow-lg hover:shadow-[#7C3AED]/20 transition-all relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              {submitted ? 'Mensagem Enviada!' : (
                <>
                  Enviar Mensagem
                  <Send size={18} />
                </>
              )}
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="space-y-4"
          >
            {contactInfo.map((info, i) => {
              const Icon = info.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-4 p-5 bg-[#0F0F1A] border border-white/[0.07] rounded-xl transition-all duration-300 hover:border-[#7C3AED]/30"
                >
                  <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#7C3AED]/20 to-[#06B6D4]/20 flex items-center justify-center text-[#7C3AED] flex-shrink-0">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-white/40 mb-0.5">{info.label}</div>
                    <div className="text-sm font-medium">{info.value}</div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// =============================================
// FOOTER
// =============================================
function Footer() {
  return (
    <footer className="relative bg-[#0F0F1A] border-t border-white/[0.07] py-16 z-10">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#7C3AED]/50 to-transparent" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] flex items-center justify-center">
                <Check size={18} className="text-white" strokeWidth={3} />
              </div>
              <span className="font-['Syne'] text-xl font-bold">REATIVA</span>
            </div>
            <p className="text-sm text-white/50 max-w-xs">Reative clientes perdidos. Organize seu negócio.</p>
          </div>

          {[
            { title: 'Produto', links: ['Funcionalidades', 'Preços', 'Integrações', 'API'] },
            { title: 'Empresa', links: ['Sobre', 'Blog', 'Carreiras', 'Contato'] },
            { title: 'Suporte', links: ['Central de Ajuda', 'Documentação', 'Termos de Uso', 'Privacidade'] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="font-['Syne'] text-sm font-semibold mb-4">{col.title}</h4>
              <div className="flex flex-col gap-2.5">
                {col.links.map((link, j) => (
                  <a key={j} href="#" className="text-sm text-white/50 hover:text-[#7C3AED] transition-colors">{link}</a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-white/[0.07] text-xs text-white/30">
          <span>&copy; 2026 REATIVA. Todos os direitos reservados.</span>
          <div className="flex gap-4 mt-4 md:mt-0">
            {['Twitter', 'Instagram', 'LinkedIn', 'GitHub'].map((social, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 flex items-center justify-center bg-white/[0.05] border border-white/[0.07] rounded-lg text-white/40 hover:border-[#7C3AED] hover:text-[#7C3AED] hover:bg-[#7C3AED]/10 transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {social === 'Twitter' && <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>}
                  {social === 'Instagram' && <><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></>}
                  {social === 'LinkedIn' && <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></>}
                  {social === 'GitHub' && <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>}
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// =============================================
// MAIN APP
// =============================================
export default function Landing() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes hue-shift {
          0%, 100% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(30deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        body {
          font-family: 'DM Sans', sans-serif;
          background: #080810;
        }
      `}</style>

      {/* Background Gradient Mesh */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#7C3AED]/8 rounded-full blur-[120px] animate-[float_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#2563EB]/8 rounded-full blur-[120px] animate-[float_8s_ease-in-out_infinite_2s]" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-[#06B6D4]/8 rounded-full blur-[120px] animate-[float_8s_ease-in-out_infinite_4s]" />
      </div>

      {/* Noise Overlay */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px'
        }}
      />

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <Contact />
        <Footer />
      </div>
    </>
  )
}
