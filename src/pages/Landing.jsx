import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useInView, useReducedMotion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Check, MessageSquare, Bot, TrendingUp, Users, Clock, BarChart3,
  Mail, Phone, MapPin, Send, Menu, X, Star, ChevronRight, ChevronDown,
  Sparkles, Zap, Shield, ArrowUpRight, Play, CheckCircle2, Headphones,
  Globe, Lock, Repeat, Target, Layers, LineChart
} from 'lucide-react'

// ═══════════════════════════════════════════
// COUNTER HOOK
// ═══════════════════════════════════════════
function useCounter(target, duration = 2000) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!inView) return
    if (reduced) { setVal(target); return }
    let start = 0
    const step = target / (duration / 16)
    const id = setInterval(() => {
      start += step
      if (start >= target) { setVal(target); clearInterval(id) }
      else setVal(Math.floor(start))
    }, 16)
    return () => clearInterval(id)
  }, [inView, target, duration, reduced])

  return { val, ref }
}

// ═══════════════════════════════════════════
// NOISE SVG
// ═══════════════════════════════════════════
const NoiseSVG = () => (
  <svg className="fixed inset-0 w-full h-full pointer-events-none z-[2] opacity-[0.03]" style={{ mixBlendMode: 'overlay' }}>
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
)

// ═══════════════════════════════════════════
// GLOWING ORB (decorative)
// ═══════════════════════════════════════════
function GlowOrb({ className, delay = 0 }) {
  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.15, 0.25, 0.15],
      }}
      transition={{ duration: 8, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  )
}

// ═══════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const nav = [
    { h: '#home', l: 'Home' },
    { h: '#features', l: 'Funcionalidades' },
    { h: '#how', l: 'Como Funciona' },
    { h: '#pricing', l: 'Preços' },
    { h: '#contact', l: 'Contato' },
  ]

  const go = (e, h) => {
    e.preventDefault()
    document.querySelector(h)?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
          scrolled
            ? 'bg-[#06060f]/90 backdrop-blur-2xl border-b border-white/[0.06] py-3 shadow-2xl shadow-black/20'
            : 'py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#home" onClick={e => go(e, '#home')} className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.4 }}
              className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-[#7c3aed]/30"
            >
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
            <span className="font-['Syne',sans-serif] text-xl font-extrabold tracking-tight text-white">
              RE<span className="bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent">ATIVA</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-full px-2 py-1 backdrop-blur-sm">
            {nav.map(n => (
              <a
                key={n.h}
                href={n.h}
                onClick={e => go(e, n.h)}
                className="relative text-[13px] font-medium text-white/45 hover:text-white transition-colors duration-200 px-4 py-2 rounded-full hover:bg-white/[0.06]"
              >
                {n.l}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-white/50 hover:text-white transition-colors px-4 py-2">
              Login
            </Link>
            <Link to="/register" className="relative group overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-[#7c3aed] via-[#6d28d9] to-[#06b6d4] transition-all duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative flex items-center gap-2 px-6 py-2.5 text-white text-sm font-semibold">
                Começar Grátis
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 bg-[#06060f]/98 backdrop-blur-3xl z-[99] flex flex-col items-center justify-center gap-8"
          >
            {nav.map((n, i) => (
              <motion.a
                key={n.h}
                href={n.h}
                onClick={e => go(e, n.h)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="font-['Syne',sans-serif] text-3xl font-bold text-white/70 hover:text-white transition-colors"
              >
                {n.l}
              </motion.a>
            ))}
            <div className="flex flex-col gap-3 w-60 mt-4">
              <Link to="/login" className="text-center py-3.5 bg-white/[0.06] border border-white/[0.08] rounded-xl text-white font-medium hover:bg-white/[0.1] transition-colors">
                Login
              </Link>
              <Link to="/register" className="text-center py-3.5 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] rounded-xl text-white font-semibold shadow-lg shadow-[#7c3aed]/20">
                Começar Grátis
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ═══════════════════════════════════════════
// HERO
// ═══════════════════════════════════════════
function Hero() {
  const reduced = useReducedMotion()
  const stats = [
    { end: 2500, suf: '+', label: 'Empresas' },
    { end: 98, suf: '%', label: 'Satisfação' },
    { end: 50, suf: 'M+', label: 'Mensagens/mês' },
  ]

  const trustLogos = ['Nubank', 'iFood', '99', 'Magazine Luiza', 'Stone']

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center pt-32 pb-16 overflow-hidden">
      {/* Background effects */}
      <GlowOrb className="w-[600px] h-[600px] bg-[#7c3aed] -top-40 -left-40 blur-[160px]" />
      <GlowOrb className="w-[500px] h-[500px] bg-[#06b6d4] top-20 -right-40 blur-[160px]" delay={2} />
      <GlowOrb className="w-[400px] h-[400px] bg-[#6d28d9] bottom-0 left-1/3 blur-[140px]" delay={4} />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Cpath d='M0 0h1v60H0z' fill='rgba(255,255,255,0.02)'/%3E%3Cpath d='M0 0h60v1H0z' fill='rgba(255,255,255,0.02)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* LEFT */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-[#7c3aed]/10 to-[#06b6d4]/10 border border-[#7c3aed]/20 rounded-full text-xs text-[#a78bfa] mb-8 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Plataforma em Beta — Acesso Antecipado
          </motion.div>

          <h1 className="font-['Syne',sans-serif] text-[clamp(2.8rem,6vw,4.5rem)] font-extrabold leading-[1.05] tracking-tight mb-6">
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-block text-white"
            >
              Reative clientes
            </motion.span>
            <br />
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block bg-gradient-to-r from-[#7c3aed] via-[#a78bfa] to-[#06b6d4] bg-clip-text text-transparent bg-[length:200%_200%] animate-[gradient_6s_ease_infinite]"
            >
              perdidos.
            </motion.span>
            <br />
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-block text-white/40 font-bold"
            >
              Organize seu negócio.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-white/40 leading-relaxed mb-10 max-w-lg"
          >
            Automatize o atendimento, recupere clientes inativos e mantenha seu negócio funcionando 24/7 — sem complicação.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap gap-4 mb-10"
          >
            <Link to="/register" className="relative group">
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
              <span className="relative flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white font-semibold shadow-xl shadow-[#7c3aed]/25 hover:shadow-[#7c3aed]/40 transition-shadow">
                Comece Grátis
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <a
              href="#features"
              className="flex items-center gap-3 px-8 py-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-semibold backdrop-blur-xl hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 group"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/15 transition-colors">
                <Play size={14} fill="white" className="text-white ml-0.5" />
              </div>
              Ver Demo
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-8 mb-12"
          >
            {stats.map((s, i) => {
              const { val, ref } = useCounter(s.end)
              return (
                <div key={i} className="flex items-center gap-8">
                  <div ref={ref} className="flex flex-col">
                    <span className="font-['Syne',sans-serif] text-2xl font-bold bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent">
                      {val.toLocaleString()}{s.suf}
                    </span>
                    <span className="text-[11px] text-white/30 mt-0.5">{s.label}</span>
                  </div>
                  {i < stats.length - 1 && <div className="w-px h-10 bg-white/[0.08]" />}
                </div>
              )
            })}
          </motion.div>

          {/* Trust logos */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex items-center gap-6"
          >
            <span className="text-[11px] text-white/20 uppercase tracking-widest">Confiado por</span>
            <div className="flex items-center gap-5 opacity-30">
              {trustLogos.map((logo, i) => (
                <span key={i} className="text-xs font-semibold text-white/50 tracking-wide">{logo}</span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT — Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed]/20 via-transparent to-[#06b6d4]/20 rounded-3xl blur-[80px] pointer-events-none" />

          <motion.div
            animate={reduced ? {} : { y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative bg-[#0a0a18]/80 backdrop-blur-3xl border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl shadow-black/40"
          >
            {/* Browser bar */}
            <div className="flex items-center gap-3 px-5 py-3.5 bg-black/50 border-b border-white/[0.05]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-110 transition-all cursor-pointer" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e] hover:brightness-110 transition-all cursor-pointer" />
                <div className="w-3 h-3 rounded-full bg-[#28c840] hover:brightness-110 transition-all cursor-pointer" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-[11px] text-white/20 bg-white/[0.04] px-5 py-1.5 rounded-lg font-mono">
                  app.reativa.com/dashboard
                </span>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Metrics row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { l: 'Conversas', v: '1,247', c: '+12.5%', icon: MessageSquare, color: '#7c3aed' },
                  { l: 'Reativados', v: '384', c: '+8.3%', icon: Users, color: '#06b6d4' },
                  { l: 'Resolução', v: '94%', c: '+5.2%', icon: Target, color: '#10b981' },
                ].map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3.5 hover:border-white/[0.1] transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] text-white/25 uppercase tracking-wider font-medium">{m.l}</span>
                      <m.icon size={12} style={{ color: m.color }} className="opacity-50 group-hover:opacity-80 transition-opacity" />
                    </div>
                    <div className="font-['Syne',sans-serif] text-lg font-bold text-white">{m.v}</div>
                    <div className="text-[10px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                      <TrendingUp size={10} />
                      {m.c}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Chart area */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 h-28"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] text-white/25 uppercase tracking-wider">Performance</span>
                  <span className="text-[10px] text-emerald-400/70">+23% este mês</span>
                </div>
                <div className="flex items-end gap-1.5 h-16">
                  {[35, 55, 40, 72, 50, 85, 60, 78, 45, 90, 65, 82].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.8, delay: 1.2 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      className="flex-1 rounded-t-sm bg-gradient-to-t from-[#7c3aed] to-[#06b6d4] opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                    />
                  ))}
                </div>
              </motion.div>

              {/* Client rows */}
              <div className="space-y-2">
                {[
                  { n: 'Maria Clara', s: 'Online', g: 'from-[#7c3aed] to-[#06b6d4]', b: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', time: 'Agora' },
                  { n: 'Rafael Santos', s: 'Inativo', g: 'from-amber-500 to-red-500', b: 'bg-amber-500/15 text-amber-400 border-amber-500/20', time: '15 dias' },
                  { n: 'Ana Lima', s: 'Reativado', g: 'from-emerald-500 to-blue-500', b: 'bg-blue-500/15 text-blue-400 border-blue-500/20', time: 'Hoje' },
                ].map((c, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 + i * 0.1 }}
                    className="flex items-center gap-3 py-2.5 px-3.5 bg-white/[0.02] border border-white/[0.04] rounded-xl hover:border-white/[0.08] transition-colors group cursor-pointer"
                  >
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${c.g} flex items-center justify-center text-white text-[11px] font-bold shadow-lg`}>
                      {c.n[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white/80">{c.n}</div>
                      <div className="text-[10px] text-white/25">{c.time}</div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${c.b}`}>
                      {c.s}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Floating notification */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2 }}
            className="absolute -right-4 top-1/4 hidden lg:flex items-center gap-2.5 px-4 py-2.5 bg-[#0a0a18]/90 border border-white/[0.08] rounded-xl backdrop-blur-xl shadow-2xl"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 size={14} className="text-emerald-400" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-white/80">Cliente reativado!</div>
              <div className="text-[10px] text-white/30">Maria acabou de responder</div>
            </div>
          </motion.div>

          {/* Floating stat */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.3 }}
            className="absolute -left-4 bottom-1/3 hidden lg:flex items-center gap-2.5 px-4 py-2.5 bg-[#0a0a18]/90 border border-white/[0.08] rounded-xl backdrop-blur-xl shadow-2xl"
          >
            <div className="w-8 h-8 rounded-full bg-[#7c3aed]/20 flex items-center justify-center">
              <TrendingUp size={14} className="text-[#7c3aed]" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-white/80">+45% conversão</div>
              <div className="text-[10px] text-white/30">Este mês</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════
// FEATURES
// ═══════════════════════════════════════════
function Features() {
  const feats = [
    { icon: MessageSquare, t: 'Automação de Mensagens', d: 'Respostas inteligentes que se adaptam ao contexto de cada conversa automaticamente.', tag: 'Popular' },
    { icon: Bot, t: 'Chatbot com IA', d: 'IA que entende a intenção do cliente e resolve 90% das dúvidas sem intervenção humana.', tag: 'IA' },
    { icon: TrendingUp, t: 'Campanhas Promocionais', d: 'Crie campanhas segmentadas para reengajar clientes inativos e aumentar vendas.', tag: null },
    { icon: Users, t: 'CRM Integrado', d: 'Gerencie contatos, histórico e segmente sua base de clientes em um só lugar.', tag: null },
    { icon: Clock, t: 'Agendamento Inteligente', d: 'Programe mensagens para o momento ideal e nunca perca uma oportunidade de venda.', tag: null },
    { icon: LineChart, t: 'Analytics Avançado', d: 'Dashboards em tempo real com métricas de performance e insights acionáveis.', tag: 'Novo' },
    { icon: Globe, t: 'WhatsApp Business API', d: 'Integração nativa com a plataforma mais usada do Brasil para automatizar atendimentos.', tag: null },
    { icon: Lock, t: 'Segurança LGPD', d: 'Dados criptografados e em conformidade com a Lei Geral de Proteção de Dados.', tag: null },
  ]

  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }
  const item = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

  return (
    <section id="features" className="relative py-32 z-10">
      <GlowOrb className="w-[500px] h-[500px] bg-[#7c3aed] top-1/4 -left-60 blur-[140px]" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7c3aed] mb-5">
            <span className="w-8 h-[2px] bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] rounded" />
            Funcionalidades
            <span className="w-8 h-[2px] bg-gradient-to-r from-[#06b6d4] to-[#7c3aed] rounded" />
          </span>
          <h2 className="font-['Syne',sans-serif] text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-tight mb-5">
            Tudo que você precisa para{' '}
            <span className="bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent">reativar</span>
          </h2>
          <p className="text-lg text-white/35 max-w-2xl mx-auto leading-relaxed">
            Ferramentas poderosas e intuitivas para transformar clientes perdidos em oportunidades de crescimento.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {feats.map((f, i) => {
            const I = f.icon
            return (
              <motion.div
                key={i}
                variants={item}
                className="group relative bg-white/[0.02] border border-white/[0.06] rounded-2xl p-7 transition-all duration-300 hover:border-[#7c3aed]/30 hover:-translate-y-1 hover:bg-white/[0.04] hover:shadow-[0_0_40px_rgba(124,58,237,0.1)] overflow-hidden"
              >
                {/* Gradient border on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.15))',
                  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  maskComposite: 'exclude',
                  WebkitMaskComposite: 'xor',
                  padding: '1px',
                }} />
                <div className="absolute inset-[1px] rounded-[15px] bg-[#06060f] pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#7c3aed]/15 to-[#06b6d4]/15 border border-[#7c3aed]/10 flex items-center justify-center"
                    >
                      <I size={20} className="text-[#7c3aed]" />
                    </motion.div>
                    {f.tag && (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#7c3aed]/15 text-[#a78bfa] border border-[#7c3aed]/20 uppercase tracking-wider">
                        {f.tag}
                      </span>
                    )}
                  </div>
                  <h3 className="font-['Syne',sans-serif] text-base font-bold mb-2.5">{f.t}</h3>
                  <p className="text-[13px] text-white/35 leading-relaxed">{f.d}</p>
                </div>

                <div className="absolute bottom-5 right-5 text-[#7c3aed] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <ArrowUpRight size={16} />
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════
// HOW IT WORKS
// ═══════════════════════════════════════════
function HowItWorks() {
  const steps = [
    { n: '01', t: 'Conecte seus Contatos', d: 'Importe sua base de clientes ou conecte diretamente com WhatsApp Business API em poucos cliques.', icon: Users },
    { n: '02', t: 'Configure Automações', d: 'Crie fluxos inteligentes com interface drag-and-drop. Sem código, sem complicação.', icon: Zap },
    { n: '03', t: 'Acompanhe Resultados', d: 'Monitore métricas em tempo real e veja seus clientes voltando automaticamente.', icon: LineChart },
  ]

  return (
    <section id="how" className="relative py-32 z-10">
      <GlowOrb className="w-[400px] h-[400px] bg-[#06b6d4] top-1/3 right-0 blur-[140px]" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7c3aed] mb-5">
            <span className="w-8 h-[2px] bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] rounded" />
            Como Funciona
            <span className="w-8 h-[2px] bg-gradient-to-r from-[#06b6d4] to-[#7c3aed] rounded" />
          </span>
          <h2 className="font-['Syne',sans-serif] text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-tight">
            Três passos para{' '}
            <span className="bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent">reativar</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="absolute top-20 left-[16%] w-[68%] h-px hidden md:block">
            <div className="w-full h-full bg-gradient-to-r from-[#7c3aed]/30 via-[#06b6d4]/30 to-[#7c3aed]/30" />
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4]"
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
          </div>

          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="text-center relative group"
            >
              <div className="relative inline-block mb-8">
                {/* Background number */}
                <span className="font-['Syne',sans-serif] text-[8rem] font-extrabold text-white/[0.02] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] select-none">
                  {s.n}
                </span>
                {/* Circle */}
                <div className="relative w-20 h-20 rounded-2xl bg-[#0a0a18] border border-white/[0.08] flex items-center justify-center group-hover:border-[#7c3aed]/30 group-hover:shadow-[0_0_30px_rgba(124,58,237,0.15)] transition-all duration-500">
                  <s.icon size={28} className="text-[#7c3aed] group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <h3 className="font-['Syne',sans-serif] text-xl font-bold mb-3">{s.t}</h3>
              <p className="text-sm text-white/35 max-w-xs mx-auto leading-relaxed">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════
// PRICING
// ═══════════════════════════════════════════
function Pricing() {
  const [annual, setAnnual] = useState(false)

  const plans = [
    {
      name: 'Starter',
      price: annual ? 77 : 97,
      desc: 'Ideal para quem está começando',
      feats: ['Até 500 contatos', '5 automações ativas', 'Relatórios básicos', 'Suporte por email', '1 usuário'],
      hot: false,
      cta: 'Começar Agora',
    },
    {
      name: 'Pro',
      price: annual ? 157 : 197,
      desc: 'Para negócios em crescimento',
      feats: ['Até 5.000 contatos', 'Automações ilimitadas', 'Chatbot com IA', 'Relatórios avançados', 'Suporte prioritário', '5 usuários'],
      hot: true,
      cta: 'Começar Agora',
    },
    {
      name: 'Business',
      price: annual ? 397 : 497,
      desc: 'Para operações de grande escala',
      feats: ['Contatos ilimitados', 'Tudo do Pro', 'API dedicada', 'Multi-atendentes', 'Gerente de conta', 'Usuários ilimitados'],
      hot: false,
      cta: 'Falar com Vendas',
    },
  ]

  return (
    <section id="pricing" className="relative py-32 z-10">
      <GlowOrb className="w-[500px] h-[500px] bg-[#7c3aed] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-[160px]" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7c3aed] mb-5">
            <span className="w-8 h-[2px] bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] rounded" />
            Preços
            <span className="w-8 h-[2px] bg-gradient-to-r from-[#06b6d4] to-[#7c3aed] rounded" />
          </span>
          <h2 className="font-['Syne',sans-serif] text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-tight mb-5">
            Planos que{' '}
            <span className="bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent">crescem</span> com você
          </h2>
          <p className="text-lg text-white/35 max-w-xl mx-auto mb-8">
            Escolha o plano ideal para o tamanho do seu negócio. Cancele quando quiser.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-full p-1.5">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                !annual ? 'bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white shadow-lg' : 'text-white/40 hover:text-white/60'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                annual ? 'bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white shadow-lg' : 'text-white/40 hover:text-white/60'
              }`}
            >
              Anual
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                -20%
              </span>
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto items-start">
          {plans.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative group"
            >
              {p.hot && <div className="absolute inset-0 bg-[#7c3aed]/[0.08] rounded-3xl blur-[80px] pointer-events-none" />}

              <div
                className={`relative rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
                  p.hot
                    ? 'bg-[#0a0a18] border-2 border-transparent'
                    : 'bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1]'
                }`}
                style={
                  p.hot
                    ? {
                        background: 'linear-gradient(#0a0a18,#0a0a18) padding-box, linear-gradient(135deg,#7c3aed,#2563eb,#06b6d4) border-box',
                        border: '2px solid transparent',
                      }
                    : {}
                }
              >
                {p.hot && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white text-[11px] font-bold px-5 py-1.5 rounded-full shadow-lg shadow-[#7c3aed]/30 flex items-center gap-1.5">
                    <Sparkles size={12} />
                    Mais Popular
                  </div>
                )}

                <div className="text-sm font-semibold text-white/40 mb-2">{p.name}</div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-base font-semibold text-white/40">R$</span>
                  <span className="font-['Syne',sans-serif] text-5xl font-extrabold text-white">{p.price}</span>
                  <span className="text-sm text-white/25">/mês</span>
                </div>
                <p className="text-sm text-white/30 mb-8">{p.desc}</p>

                <ul className="mb-8 space-y-0">
                  {p.feats.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 py-3 border-b border-white/[0.04] text-sm text-white/45 last:border-0">
                      <CheckCircle2 size={16} className="text-[#7c3aed] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/register"
                  className={`block w-full py-3.5 text-center rounded-xl font-semibold transition-all duration-300 ${
                    p.hot
                      ? 'bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white shadow-lg shadow-[#7c3aed]/20 hover:shadow-[#7c3aed]/40 relative overflow-hidden group/btn'
                      : 'bg-white/[0.04] border border-white/[0.06] text-white hover:bg-white/[0.08] hover:border-white/[0.12]'
                  }`}
                >
                  {p.hot && (
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                  )}
                  <span className="relative">{p.cta}</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════
// TESTIMONIALS
// ═══════════════════════════════════════════
function Testimonials() {
  const items = [
    {
      q: 'A REATIVA transformou nosso atendimento. Reduzimos o tempo de resposta em 80% e clientes perdidos estão voltando.',
      n: 'Maria Clara',
      r: 'CEO, Boutique Online',
      av: 'MC',
      g: 'from-[#7c3aed] to-[#06b6d4]',
      rating: 5,
    },
    {
      q: 'O chatbot resolve 90% das dúvidas sem intervenção humana. Economia absurda de tempo e dinheiro.',
      n: 'Rafael Santos',
      r: 'Fundador, Tech Solutions',
      av: 'RS',
      g: 'from-amber-500 to-red-500',
      rating: 5,
    },
    {
      q: 'A segmentação automática aumentou nossa taxa de conversão em 45%. Ferramenta indispensável para qualquer negócio.',
      n: 'Ana Lima',
      r: 'Diretora de Marketing, E-commerce Plus',
      av: 'AL',
      g: 'from-emerald-500 to-blue-500',
      rating: 5,
    },
  ]

  return (
    <section className="relative py-32 z-10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7c3aed] mb-5">
            <span className="w-8 h-[2px] bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] rounded" />
            Depoimentos
            <span className="w-8 h-[2px] bg-gradient-to-r from-[#06b6d4] to-[#7c3aed] rounded" />
          </span>
          <h2 className="font-['Syne',sans-serif] text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-tight">
            O que nossos{' '}
            <span className="bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent">clientes</span> dizem
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 transition-all duration-300 hover:border-[#7c3aed]/20 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(124,58,237,0.08)] overflow-hidden group"
            >
              {/* Quote mark */}
              <span className="absolute -top-2 left-5 text-[6rem] font-serif leading-none bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent opacity-10 select-none">
                &ldquo;
              </span>

              {/* Stars */}
              <div className="flex gap-1 mb-5 relative z-10">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} size={14} fill="#eab308" className="text-yellow-500" />
                ))}
              </div>

              <p className="text-sm text-white/45 leading-relaxed mb-7 relative z-10">&ldquo;{t.q}&rdquo;</p>

              <div className="flex items-center gap-3 relative z-10">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${t.g} flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
                  {t.av}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white/80">{t.n}</div>
                  <div className="text-xs text-white/30">{t.r}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════
// FAQ
// ═══════════════════════════════════════════
function FAQ() {
  const [open, setOpen] = useState(null)
  const faqs = [
    { q: 'Preciso de conhecimento técnico para usar?', a: 'Não! A REATIVA foi feita para ser intuitiva. Com interface drag-and-zero, você cria automações sem escrever uma linha de código.' },
    { q: 'Posso cancelar a qualquer momento?', a: 'Sim, todos os planos são mensais e sem fidelidade. Cancele quando quiser, sem multa ou burocracia.' },
    { q: 'Funciona com WhatsApp Business?', a: 'Sim! Integramos nativamente com a WhatsApp Business API. Você pode enviar mensagens, criar chatbots e automatizar atendimentos.' },
    { q: 'Meus dados estão seguros?', a: 'Absolutamente. Usamos criptografia de ponta e somos 100% compatíveis com a LGPD. Seus dados nunca são compartilhados com terceiros.' },
    { q: 'Oferecem suporte em português?', a: 'Sim! Nosso suporte é 100% em português, por email, chat e telefone nos planos Pro e Business.' },
    { q: 'Posso migrar de plano depois?', a: 'Pode! Você pode fazer upgrade ou downgrade a qualquer momento. O valor é ajustado proporcionalmente.' },
  ]

  return (
    <section className="relative py-32 z-10">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7c3aed] mb-5">
            <span className="w-8 h-[2px] bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] rounded" />
            FAQ
            <span className="w-8 h-[2px] bg-gradient-to-r from-[#06b6d4] to-[#7c3aed] rounded" />
          </span>
          <h2 className="font-['Syne',sans-serif] text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-tight">
            Perguntas{' '}
            <span className="bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent">frequentes</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-left hover:border-white/[0.1] transition-all duration-300 group"
              >
                <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">{f.q}</span>
                <motion.div
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown size={18} className="text-white/30" />
                </motion.div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-2 text-sm text-white/35 leading-relaxed">
                      {f.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════
// CONTACT
// ═══════════════════════════════════════════
function Contact() {
  const [sent, setSent] = useState(false)
  const info = [
    { icon: Mail, l: 'Email', v: 'contato@reativa.com' },
    { icon: Phone, l: 'Telefone', v: '+55 (11) 9999-9999' },
    { icon: MapPin, l: 'Localização', v: 'São Paulo, SP - Brasil' },
  ]

  return (
    <section id="contact" className="relative py-32 z-10">
      <GlowOrb className="w-[400px] h-[400px] bg-[#7c3aed] bottom-0 left-1/4 blur-[140px]" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7c3aed] mb-5">
            <span className="w-8 h-[2px] bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] rounded" />
            Contato
            <span className="w-8 h-[2px] bg-gradient-to-r from-[#06b6d4] to-[#7c3aed] rounded" />
          </span>
          <h2 className="font-['Syne',sans-serif] text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-tight mb-5">
            Pronto para{' '}
            <span className="bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent">começar</span>?
          </h2>
          <p className="text-lg text-white/35 max-w-xl mx-auto">
            Entre em contato ou crie sua conta gratuitamente.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.form
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            onSubmit={e => { e.preventDefault(); setSent(true); setTimeout(() => setSent(false), 3000) }}
            className="space-y-5"
          >
            {[
              { l: 'Nome', p: 'Seu nome completo', t: 'text' },
              { l: 'Email', p: 'seu@email.com', t: 'email' },
            ].map((f, i) => (
              <div key={i}>
                <label className="block text-sm font-medium text-white/40 mb-2.5">{f.l}</label>
                <input
                  type={f.t}
                  placeholder={f.p}
                  required
                  className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder-white/20 focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/20 transition-all duration-300 outline-none hover:border-white/[0.1]"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-white/40 mb-2.5">Mensagem</label>
              <textarea
                placeholder="Como podemos ajudar?"
                rows="4"
                required
                className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder-white/20 focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/20 transition-all duration-300 outline-none resize-none hover:border-white/[0.1]"
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-[#7c3aed] via-[#6d28d9] to-[#06b6d4] text-white font-semibold text-base relative overflow-hidden group hover:shadow-lg hover:shadow-[#7c3aed]/20 transition-shadow"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative flex items-center gap-2">
                {sent ? (
                  <>
                    <CheckCircle2 size={18} />
                    Mensagem Enviada!
                  </>
                ) : (
                  <>
                    Enviar Mensagem
                    <Send size={18} />
                  </>
                )}
              </span>
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="space-y-4"
          >
            {info.map((c, i) => {
              const I = c.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-4 p-5 bg-white/[0.02] border border-white/[0.06] rounded-xl transition-all duration-300 hover:border-[#7c3aed]/20 hover:bg-white/[0.04] group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7c3aed]/15 to-[#06b6d4]/15 border border-[#7c3aed]/10 flex items-center justify-center flex-shrink-0 group-hover:border-[#7c3aed]/25 transition-colors">
                    <I size={20} className="text-[#7c3aed]" />
                  </div>
                  <div>
                    <div className="text-xs text-white/25 mb-1">{c.l}</div>
                    <div className="text-sm font-medium text-white/70">{c.v}</div>
                  </div>
                </motion.div>
              )
            })}

            {/* CTA card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="p-6 bg-gradient-to-br from-[#7c3aed]/10 to-[#06b6d4]/10 border border-[#7c3aed]/20 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <Headphones size={20} className="text-[#7c3aed]" />
                <span className="text-sm font-semibold text-white/80">Suporte 24/7</span>
              </div>
              <p className="text-sm text-white/35 leading-relaxed">
                Nossa equipe está pronta para ajudar a qualquer momento. Resposta em até 2 horas.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════
function Footer() {
  const links = [
    { t: 'Produto', l: ['Funcionalidades', 'Preços', 'Integrações', 'API', 'Changelog'] },
    { t: 'Empresa', l: ['Sobre', 'Blog', 'Carreiras', 'Contato', 'Imprensa'] },
    { t: 'Suporte', l: ['Central de Ajuda', 'Documentação', 'Status', 'Termos de Uso', 'Privacidade'] },
  ]

  const socials = [
    'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z',
    'rect x="2" y="2" width="20" height="20" rx="5" ry="5"',
    'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z',
    'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22',
  ]

  return (
    <footer className="relative bg-[#06060f] border-t border-white/[0.04] py-20 z-10">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#7c3aed]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-[#7c3aed]/20">
                <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                  <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-['Syne',sans-serif] text-xl font-extrabold text-white">REATIVA</span>
            </div>
            <p className="text-sm text-white/30 max-w-xs leading-relaxed mb-6">
              Reative clientes perdidos. Organize seu negócio. Automatize atendimentos 24/7.
            </p>
            <div className="flex gap-3">
              {socials.map((d, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/30 hover:border-[#7c3aed]/30 hover:text-[#7c3aed] hover:bg-[#7c3aed]/5 transition-all duration-300"
                  aria-label="Social media"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={d} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {links.map((c, i) => (
            <div key={i}>
              <h4 className="font-['Syne',sans-serif] text-sm font-bold mb-5 text-white/60">{c.t}</h4>
              <div className="flex flex-col gap-3">
                {c.l.map((l, j) => (
                  <a key={j} href="#" className="text-sm text-white/30 hover:text-[#7c3aed] transition-colors duration-200">
                    {l}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/[0.04]">
          <span className="text-[11px] text-white/20">&copy; 2026 REATIVA. Todos os direitos reservados.</span>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <a href="#" className="text-[11px] text-white/20 hover:text-white/40 transition-colors">Termos</a>
            <a href="#" className="text-[11px] text-white/20 hover:text-white/40 transition-colors">Privacidade</a>
            <a href="#" className="text-[11px] text-white/20 hover:text-white/40 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ═══════════════════════════════════════════
// CTA BANNER (before footer)
// ═══════════════════════════════════════════
function CTABanner() {
  return (
    <section className="relative py-24 z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#7c3aed]/10 via-[#6d28d9]/10 to-[#06b6d4]/10" />
      <GlowOrb className="w-[400px] h-[400px] bg-[#7c3aed] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-[120px]" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <h2 className="font-['Syne',sans-serif] text-[clamp(2rem,5vw,3.5rem)] font-extrabold tracking-tight mb-6">
            Pronto para{' '}
            <span className="bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent">reativar</span>?
          </h2>
          <p className="text-lg text-white/35 max-w-xl mx-auto mb-10">
            Junte-se a mais de 2.500 empresas que já estão recuperando clientes e aumentando vendas.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="relative group">
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
              <span className="relative flex items-center gap-2 px-10 py-4.5 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white font-semibold shadow-xl shadow-[#7c3aed]/25 text-lg">
                Comece Grátis Agora
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
          <p className="text-xs text-white/20 mt-5">Sem cartão de crédito. Cancele quando quiser.</p>
        </motion.div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════
// APP
// ═══════════════════════════════════════════
export default function Landing() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');
        body { font-family: 'DM Sans', sans-serif; background: #06060f; }
        @keyframes gradient { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @media (prefers-reduced-motion: reduce) { *,*::before,*::after { animation-duration:0.01ms!important; animation-iteration-count:1!important; transition-duration:0.01ms!important; } }
      `}</style>

      {/* Noise */}
      <NoiseSVG />

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <FAQ />
        <Contact />
        <CTABanner />
        <Footer />
      </div>
    </>
  )
}
