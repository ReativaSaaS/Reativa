import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useInView, useReducedMotion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Check, MessageSquare, Bot, TrendingUp, Users, Clock, BarChart3,
  Mail, Phone, MapPin, Send, Menu, X, Star, ChevronRight, Sparkles, Zap, Shield
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
// NOISE SVG (inline)
// ═══════════════════════════════════════════
const NoiseSVG = () => (
  <svg className="fixed inset-0 w-full h-full pointer-events-none z-[2] opacity-[0.035]" style={{ mixBlendMode: 'overlay' }}>
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
)

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
    { h: '#home', l: 'Home' }, { h: '#features', l: 'Features' },
    { h: '#pricing', l: 'Pricing' }, { h: '#about', l: 'About' },
    { h: '#contact', l: 'Contact' },
  ]

  const go = (e, h) => { e.preventDefault(); document.querySelector(h)?.scrollIntoView({ behavior: 'smooth' }); setOpen(false) }

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'bg-[#06060f]/85 backdrop-blur-xl border-b border-white/[0.07] py-3' : 'py-5'}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#home" onClick={e => go(e, '#home')} className="flex items-center gap-2.5 group">
            <motion.img whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} src="/logo-icon.png" alt="R" className="w-9 h-9 rounded-lg shadow-lg shadow-[#7c3aed]/20" />
            <span className="font-['Syne',sans-serif] text-xl font-extrabold tracking-tight text-white">RE<span className="bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent">ATIVA</span></span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {nav.map(n => (
              <a key={n.h} href={n.h} onClick={e => go(e, n.h)} className="relative text-sm font-medium text-white/50 hover:text-white transition-colors duration-200 group">
                {n.l}
                <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] transition-all duration-300 origin-left group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-white/50 hover:text-white transition-colors px-4 py-2">Login</Link>
            <Link to="/register" className="relative group overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-[#7c3aed] via-[#2563eb] to-[#06b6d4]" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full animate-[shimmer_4s_ease_infinite]" />
              <span className="relative flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold">Começar Grátis <ArrowRight size={14} /></span>
            </Link>
          </div>

          <button className="md:hidden p-2 text-white" onClick={() => setOpen(!open)}>{open ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} transition={{ duration: 0.3 }} className="fixed inset-0 bg-[#06060f]/98 backdrop-blur-xl z-[99] flex flex-col items-center justify-center gap-8">
            {nav.map(n => (
              <a key={n.h} href={n.h} onClick={e => go(e, n.h)} className="font-['Syne',sans-serif] text-3xl font-bold text-white/80 hover:text-white transition-colors">{n.l}</a>
            ))}
            <div className="flex flex-col gap-3 w-60 mt-4">
              <Link to="/login" className="text-center py-3 bg-white/[0.06] border border-white/[0.08] rounded-xl text-white font-medium">Login</Link>
              <Link to="/register" className="text-center py-3 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] rounded-xl text-white font-semibold">Começar Grátis</Link>
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
  const words1 = ['Reative', 'clientes']
  const word2 = 'perdidos.'
  const words3 = ['Organize', 'seu', 'negócio.']

  const stats = [
    { end: 2500, suf: '+', label: 'Empresas' },
    { end: 98, suf: '%', label: 'Satisfação' },
    { end: 50, suf: 'M+', label: 'Mensagens/mês' },
  ]

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
      {/* Radial glow behind headline */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-[#7c3aed]/[0.12] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* LEFT */}
        <div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/[0.04] border border-white/[0.07] rounded-full text-xs text-white/40 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Plataforma em Beta
          </motion.div>

          {/* Title word by word */}
          <h1 className="font-['Syne',sans-serif] text-[clamp(2.8rem,6vw,4.5rem)] font-extrabold leading-[1.05] tracking-tight mb-6">
            {words1.map((w, i) => (
              <motion.span key={i} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }} className="inline-block mr-3 text-white">{w}</motion.span>
            ))}
            <br />
            <motion.span initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.26 }} className="inline-block bg-gradient-to-r from-[#7c3aed] via-[#2563eb] to-[#06b6d4] bg-clip-text text-transparent bg-[length:200%_200%] animate-[hue-shift_8s_ease_infinite]">{word2}</motion.span>
            <br />
            {words3.map((w, i) => (
              <motion.span key={i} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.34 + i * 0.08 }} className="inline-block mr-3 text-white/50 font-bold">{w}</motion.span>
            ))}
          </h1>

          <motion.p initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }} animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }} transition={{ duration: 0.8, delay: 0.6 }} className="text-lg text-white/45 leading-relaxed mb-10 max-w-lg font-light">
            Automatize o atendimento, recupere clientes inativos e mantenha seu negócio funcionando 24/7 — sem complicação.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }} className="flex flex-wrap gap-4 mb-14">
            <Link to="/register" className="relative group">
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#06b6d4 animate-ping opacity-20 group-hover:opacity-40" />
              <span className="relative flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white font-semibold shadow-lg shadow-[#7c3aed]/25">Comece Grátis <ArrowRight size={18} /></span>
            </Link>
            <a href="#features" className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-semibold backdrop-blur-xl hover:bg-white/[0.08] hover:border-white/[0.14] transition-all duration-200">
              Ver Funcionalidades
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="flex items-center gap-8">
            {stats.map((s, i) => {
              const { val, ref } = useCounter(s.end)
              return (
                <div key={i} className="flex items-center gap-8">
                  <div ref={ref} className="flex flex-col">
                    <span className="font-['Syne',sans-serif] text-2xl font-bold bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent">{val.toLocaleString()}{s.suf}</span>
                    <span className="text-[11px] text-white/30 mt-0.5">{s.label}</span>
                  </div>
                  {i < stats.length - 1 && <div className="w-px h-10 bg-white/[0.08]" />}
                </div>
              )
            })}
          </motion.div>
        </div>

        {/* RIGHT — Dashboard Mockup */}
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.4 }} className="relative">
          {/* Glow behind */}
          <div className="absolute inset-0 bg-[#7c3aed]/[0.18] rounded-3xl blur-[80px] pointer-events-none" />

          <motion.div animate={reduced ? {} : { y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="relative bg-white/[0.04] backdrop-blur-2xl border border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl">
            {/* Browser bar */}
            <div className="flex items-center gap-3 px-4 py-3 bg-black/40 border-b border-white/[0.06]">
              <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" /><div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" /><div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" /></div>
              <div className="flex-1 text-center"><span className="text-[11px] text-white/25 bg-white/[0.04] px-4 py-1 rounded-md">app.reativa.com/dashboard</span></div>
            </div>

            <div className="p-5 space-y-4">
              {/* Metrics row */}
              <div className="grid grid-cols-3 gap-3">
                {[{ l: 'Conversas', v: '1,247', c: '+12.5%' }, { l: 'Reativados', v: '384', c: '+8.3%' }, { l: 'Resolução', v: '94%', c: '+5.2%' }].map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 + i * 0.1 }} className="bg-black/30 border border-white/[0.05] rounded-lg p-3">
                    <div className="text-[9px] text-white/25 uppercase tracking-wider mb-1">{m.l}</div>
                    <div className="font-['Syne',sans-serif] text-base font-bold text-white">{m.v}</div>
                    <div className="text-[9px] text-emerald-400 font-semibold mt-0.5">{m.c}</div>
                  </motion.div>
                ))}
              </div>

              {/* Chart */}
              <div className="bg-black/30 border border-white/[0.05] rounded-lg p-4 h-24 flex items-end gap-1.5">
                {[35, 60, 42, 78, 55, 88, 65, 82, 50, 92, 70, 85].map((h, i) => (
                  <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 0.8, delay: 1.1 + i * 0.06, ease: [0.22, 1, 0.36, 1] }} className="flex-1 rounded-t-sm bg-gradient-to-t from-[#7c3aed] to-[#06b6d4] opacity-70 hover:opacity-100 transition-opacity" />
                ))}
              </div>

              {/* Client rows */}
              <div className="space-y-1.5">
                {[{ n: 'Maria Clara', s: 'Online', g: 'from-[#7c3aed] to-[#06b6d4]', b: 'bg-emerald-500/15 text-emerald-400' }, { n: 'Rafael Santos', s: 'Inativo', g: 'from-amber-500 to-red-500', b: 'bg-amber-500/15 text-amber-400' }, { n: 'Ana Lima', s: 'Reativado', g: 'from-emerald-500 to-blue-500', b: 'bg-blue-500/15 text-blue-400' }].map((c, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 + i * 0.1 }} className="flex items-center gap-3 py-2 px-3 bg-black/20 rounded-lg">
                    <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${c.g} flex items-center justify-center text-white text-[10px] font-bold`}>{c.n[0]}</div>
                    <span className="flex-1 text-xs font-medium text-white/80">{c.n}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.b}`}>{c.s}</span>
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

// ═══════════════════════════════════════════
// FEATURES
// ═══════════════════════════════════════════
function Features() {
  const feats = [
    { icon: MessageSquare, t: 'Automação de Mensagens', d: 'Respostas inteligentes que se adaptam ao contexto de cada conversa.' },
    { icon: Bot, t: 'Chatbot Inteligente', d: 'IA que entende a intenção do cliente e resolve 90% das dúvidas.' },
    { icon: TrendingUp, t: 'Campanhas Promocionais', d: 'Crie campanhas segmentadas para reengajar clientes inativos.' },
    { icon: Users, t: 'Organização de Clientes', d: 'CRM integrado para gerenciar contatos, histórico e segmentar sua base.' },
    { icon: Clock, t: 'Agendamento de Respostas', d: 'Programe mensagens para o momento ideal e nunca perca uma oportunidade.' },
    { icon: BarChart3, t: 'Painel Analítico', d: 'Dashboards em tempo real para acompanhar métricas e performance.' },
  ]

  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
  const item = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

  return (
    <section id="features" className="relative py-32 z-10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7c3aed] mb-4"><span className="w-6 h-[2px] bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] rounded" />Funcionalidades</span>
          <h2 className="font-['Syne',sans-serif] text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-tight mb-4">Tudo que você precisa para <span className="bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent">reativar</span></h2>
          <p className="text-lg text-white/40 max-w-xl mx-auto">Ferramentas poderosas para transformar clientes perdidos em oportunidades.</p>
        </motion.div>

        <motion.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {feats.map((f, i) => {
            const I = f.icon
            return (
              <motion.div key={i} variants={item} className={`group relative bg-[#0d0d1a] border border-white/[0.07] rounded-2xl p-8 transition-all duration-300 hover:border-transparent hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(124,58,237,0.15)] overflow-hidden ${i === 0 ? 'lg:col-span-2' : ''}`}>
                {/* Gradient border on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.3))', mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'exclude', WebkitMaskComposite: 'xor', padding: '1px' }} />
                <div className="absolute inset-[1px] rounded-[15px] bg-[#0d0d1a] pointer-events-none" />
                <div className="relative z-10">
                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7c3aed]/20 to-[#06b6d4]/20 flex items-center justify-center mb-5">
                    <I size={22} className="text-[#7c3aed]" />
                  </motion.div>
                  <h3 className="font-['Syne',sans-serif] text-lg font-bold mb-2">{f.t}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{f.d}</p>
                </div>
                <div className="absolute bottom-6 right-6 text-[#7c3aed] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"><ChevronRight size={16} /></div>
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
    { n: '01', t: 'Conecte seus Contatos', d: 'Importe sua base ou conecte com WhatsApp Business.' },
    { n: '02', t: 'Configure Automações', d: 'Crie fluxos com interface drag-and-drop.' },
    { n: '03', t: 'Acompanhe Resultados', d: 'Monitore métricas e veja clientes voltando.' },
  ]

  return (
    <section id="about" className="relative py-32 z-10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7c3aed] mb-4"><span className="w-6 h-[2px] bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] rounded" />Como Funciona</span>
          <h2 className="font-['Syne',sans-serif] text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-tight">Três passos para <span className="bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent">reativar</span></h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10 relative">
          {/* Dashed connecting line */}
          <svg className="absolute top-16 left-[12%] w-[76%] h-4 hidden md:block overflow-visible" viewBox="0 0 800 16" fill="none" preserveAspectRatio="none">
            <motion.path d="M0 8 H800" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="8 6" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, ease: 'easeInOut' }} />
            <defs><linearGradient id="lineGrad" x1="0" y1="0" x2="800" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#7c3aed" /><stop offset="1" stopColor="#06b6d4" /></linearGradient></defs>
          </svg>

          {steps.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5, delay: i * 0.2 }} className="text-center relative">
              <div className="relative inline-block mb-6">
                <span className="font-['Syne',sans-serif] text-[9rem] font-extrabold text-white/[0.03] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] select-none">{s.n}</span>
                <div className="relative w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0d0d1a, #0d0d1a)', boxShadow: '0 0 0 2px transparent, 0 0 0 2px rgba(124,58,237,0.5)' }}>
                  <span className="font-['Syne',sans-serif] text-lg font-bold bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent">{s.n}</span>
                </div>
              </div>
              <h3 className="font-['Syne',sans-serif] text-xl font-bold mb-3">{s.t}</h3>
              <p className="text-sm text-white/40 max-w-xs mx-auto">{s.d}</p>
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
  const plans = [
    { name: 'Starter', price: 97, desc: 'Ideal para quem está começando', feats: ['Até 500 contatos', '5 automações ativas', 'Relatórios básicos', 'Suporte por email'], hot: false },
    { name: 'Pro', price: 197, desc: 'Para negócios em crescimento', feats: ['Até 5.000 contatos', 'Automações ilimitadas', 'Chatbot com IA', 'Relatórios avançados', 'Suporte prioritário'], hot: true },
    { name: 'Business', price: 497, desc: 'Para operações de grande escala', feats: ['Contatos ilimitados', 'Tudo do Pro', 'API dedicada', 'Multi-atendentes', 'Gerente de conta'], hot: false },
  ]

  return (
    <section id="pricing" className="relative py-32 z-10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7c3aed] mb-4"><span className="w-6 h-[2px] bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] rounded" />Preços</span>
          <h2 className="font-['Syne',sans-serif] text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-tight mb-4">Planos que <span className="bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent">crescem</span> com você</h2>
          <p className="text-lg text-white/40 max-w-xl mx-auto">Escolha o plano ideal para o tamanho do seu negócio.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto items-start">
          {plans.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5, delay: i * 0.15 }} className="relative group">
              {/* Glow behind Pro */}
              {p.hot && <div className="absolute inset-0 bg-[#7c3aed]/[0.12] rounded-3xl blur-[100px] pointer-events-none" />}

              <div className={`relative bg-[#0d0d1a] rounded-2xl p-9 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl ${p.hot ? 'border-2 border-transparent' : 'border border-white/[0.07]'}`} style={p.hot ? { background: 'linear-gradient(#0d0d1a,#0d0d1a) padding-box, linear-gradient(135deg,#7c3aed,#2563eb,#06b6d4) border-box', border: '2px solid transparent' } : {}}>
                {p.hot && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white text-[11px] font-bold px-5 py-1.5 rounded-full shadow-lg shadow-[#7c3aed]/30">Mais Popular</div>}

                <div className="text-sm font-semibold text-white/50 mb-2">{p.name}</div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-base font-semibold text-white/50">R$</span>
                  <span className="font-['Syne',sans-serif] text-5xl font-extrabold text-white">{p.price}</span>
                  <span className="text-sm text-white/30">/mês</span>
                </div>
                <p className="text-sm text-white/35 mb-7">{p.desc}</p>

                <ul className="mb-8 space-y-0">
                  {p.feats.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 py-3 border-b border-white/[0.04] text-sm text-white/50 last:border-0">
                      <motion.div initial={{ strokeDashoffset: 24 }} whileInView={{ strokeDashoffset: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.3 + j * 0.08 }}>
                        <Check size={16} className="text-[#7c3aed]" />
                      </motion.div>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link to="/register" className={`block w-full py-3.5 text-center rounded-xl font-semibold transition-all duration-200 ${p.hot ? 'bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white shadow-lg shadow-[#7c3aed]/20 hover:shadow-[#7c3aed]/40 relative overflow-hidden group/btn' : 'bg-white/[0.04] border border-white/[0.07] text-white hover:bg-white/[0.08]'}`}>
                  {p.hot && <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />}
                  <span className="relative">Começar Agora</span>
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
    { q: 'A REATIVA transformou nosso atendimento. Reduzimos o tempo de resposta em 80% e clientes perdidos estão voltando.', n: 'Maria Clara', r: 'CEO, Boutique Online', av: 'MC', g: 'from-[#7c3aed] to-[#06b6d4]' },
    { q: 'O chatbot resolve 90% das dúvidas sem intervenção humana. Economia absurda de tempo e dinheiro.', n: 'Rafael Santos', r: 'Fundador, Tech Solutions', av: 'RS', g: 'from-amber-500 to-red-500' },
    { q: 'A segmentação automática aumentou nossa taxa de conversão em 45%. Ferramenta indispensável.', n: 'Ana Lima', r: 'Diretora de Marketing, E-commerce Plus', av: 'AL', g: 'from-emerald-500 to-blue-500' },
  ]

  return (
    <section className="relative py-32 z-10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7c3aed] mb-4"><span className="w-6 h-[2px] bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] rounded" />Depoimentos</span>
          <h2 className="font-['Syne',sans-serif] text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-tight">O que nossos <span className="bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent">clientes</span> dizem</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5, delay: i * 0.15 }} className="relative bg-white/[0.04] backdrop-blur-md border border-white/[0.07] rounded-2xl p-8 transition-all duration-300 hover:border-[#7c3aed]/30 hover:-translate-y-1 overflow-hidden">
              <span className="absolute -top-2 left-5 text-[6rem] font-serif leading-none bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent opacity-15 select-none">"</span>
              <div className="flex gap-1 mb-4 relative z-10">
                {[...Array(5)].map((_, j) => (
                  <motion.div key={j} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 + j * 0.06 }}>
                    <Star size={14} fill="#eab308" className="text-yellow-500" />
                  </motion.div>
                ))}
              </div>
              <p className="text-sm text-white/50 leading-relaxed mb-6 relative z-10">"{t.q}"</p>
              <div className="flex items-center gap-3 relative z-10">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.g} flex items-center justify-center text-white text-xs font-bold`}>{t.av}</div>
                <div><div className="text-sm font-semibold">{t.n}</div><div className="text-xs text-white/35">{t.r}</div></div>
              </div>
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
    <section id="contact" className="relative py-32 z-10 bg-white/[0.015]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7c3aed] mb-4"><span className="w-6 h-[2px] bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] rounded" />Contato</span>
          <h2 className="font-['Syne',sans-serif] text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-tight mb-4">Pronto para <span className="bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent">começar</span>?</h2>
          <p className="text-lg text-white/40 max-w-xl mx-auto">Entre em contato ou crie sua conta gratuitamente.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.form initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5 }} onSubmit={e => { e.preventDefault(); setSent(true); setTimeout(() => setSent(false), 3000) }} className="space-y-5">
            {[{ l: 'Nome', p: 'Seu nome completo', t: 'text' }, { l: 'Email', p: 'seu@email.com', t: 'email' }].map((f, i) => (
              <div key={i}><label className="block text-sm font-medium text-white/50 mb-2">{f.l}</label><input type={f.t} placeholder={f.p} required className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-white/25 focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/25 transition-all duration-200 outline-none" /></div>
            ))}
            <div><label className="block text-sm font-medium text-white/50 mb-2">Mensagem</label><textarea placeholder="Como podemos ajudar?" rows="4" required className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-white/25 focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/25 transition-all duration-200 outline-none resize-none" /></div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-[#7c3aed] via-[#2563eb] to-[#06b6d4] text-white font-semibold text-base relative overflow-hidden group">
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative flex items-center gap-2">{sent ? 'Mensagem Enviada!' : <><>Enviar Mensagem</><Send size={18} /></>}</span>
            </button>
          </motion.form>

          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5, delay: 0.15 }} className="space-y-4">
            {info.map((c, i) => { const I = c.icon; return (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1 }} className="flex items-center gap-4 p-5 bg-[#0d0d1a] border border-white/[0.07] rounded-xl transition-all duration-300 hover:border-[#7c3aed]/30">
                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#7c3aed]/20 to-[#06b6d4]/20 flex items-center justify-center flex-shrink-0"><I size={20} className="text-[#7c3aed]" /></div>
                <div><div className="text-xs text-white/30 mb-0.5">{c.l}</div><div className="text-sm font-medium text-white/80">{c.v}</div></div>
              </motion.div>
            )})}
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
  return (
    <footer className="relative bg-[#0d0d1a] border-t border-white/[0.05] py-16 z-10">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#7c3aed]/40 to-transparent" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center"><img src="/logo-icon.png" alt="R" className="w-5 h-5" /></div>
              <span className="font-['Syne',sans-serif] text-xl font-extrabold text-white">REATIVA</span>
            </div>
            <p className="text-sm text-white/35 max-w-xs">Reative clientes perdidos. Organize seu negócio.</p>
          </div>
          {[{ t: 'Produto', l: ['Funcionalidades', 'Preços', 'Integrações', 'API'] }, { t: 'Empresa', l: ['Sobre', 'Blog', 'Carreiras', 'Contato'] }, { t: 'Suporte', l: ['Central de Ajuda', 'Documentação', 'Termos de Uso', 'Privacidade'] }].map((c, i) => (
            <div key={i}><h4 className="font-['Syne',sans-serif] text-sm font-bold mb-4">{c.t}</h4><div className="flex flex-col gap-2.5">{c.l.map((l, j) => <a key={j} href="#" className="text-sm text-white/40 hover:text-[#7c3aed] transition-colors duration-200">{l}</a>)}</div></div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-white/[0.05] text-[11px] text-white/25">
          <span>&copy; 2026 REATIVA. Todos os direitos reservados.</span>
          <div className="flex gap-3 mt-4 md:mt-0">
            {['M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z', 'rect x="2" y="2" width="20" height="20" rx="5" ry="5"', 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z', 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22'].map((d, i) => (
              <a key={i} href="#" className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/35 hover:border-[#7c3aed] hover:text-[#7c3aed] hover:bg-[#7c3aed]/10 transition-all duration-200">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
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
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes hue-shift { 0%,100% { filter: hue-rotate(0deg); } 50% { filter: hue-rotate(25deg); } }
        @keyframes blob1 { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(30px,-40px) scale(1.05); } 66% { transform: translate(-20px,30px) scale(0.95); } }
        @keyframes blob2 { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(-40px,20px) scale(0.95); } 66% { transform: translate(30px,-30px) scale(1.05); } }
        @keyframes blob3 { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(20px,40px) scale(1.08); } 66% { transform: translate(-30px,-20px) scale(0.92); } }
        @media (prefers-reduced-motion: reduce) { *,*::before,*::after { animation-duration:0.01ms!important; animation-iteration-count:1!important; transition-duration:0.01ms!important; } }
      `}</style>

      {/* Animated blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#7c3aed] rounded-full blur-[140px] opacity-[0.12] animate-[blob1_12s_ease-in-out_infinite]" />
        <div className="absolute -top-20 -right-32 w-[450px] h-[450px] bg-[#2563eb] rounded-full blur-[140px] opacity-[0.12] animate-[blob2_12s_ease-in-out_infinite_4s]" />
        <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-[#06b6d4] rounded-full blur-[140px] opacity-[0.12] animate-[blob3_12s_ease-in-out_infinite_8s]" />
      </div>

      {/* Grid pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='48' height='48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h48v48H0z' fill='none'/%3E%3Cpath d='M0 0h1v48H0z' fill='rgba(255,255,255,0.025)'/%3E%3Cpath d='M0 0h48v1H0z' fill='rgba(255,255,255,0.025)'/%3E%3C/svg%3E")` }} />

      {/* Noise */}
      <NoiseSVG />

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
