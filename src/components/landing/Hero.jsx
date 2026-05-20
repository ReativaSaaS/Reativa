import { useState, useEffect, useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Play, TrendingUp, Users, BarChart3, MessageSquare, Target, CheckCircle2 } from 'lucide-react'

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

          <h1 className="font-display text-[clamp(2.8rem,6vw,4.5rem)] font-extrabold leading-[1.05] tracking-tight mb-6">
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
                    <span className="font-display text-2xl font-bold bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent">
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
                    <div className="font-display text-lg font-bold text-white">{m.v}</div>
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

export default Hero
