import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import AnimatedCounter from './AnimatedCounter'

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative">
        {/* Floating Elements */}
        <motion.div
          className="absolute top-[10%] left-[5%] hidden lg:block"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="20" stroke="rgba(139,92,246,0.3)" strokeWidth="1"/>
            <circle cx="24" cy="24" r="12" stroke="rgba(6,182,212,0.3)" strokeWidth="1"/>
            <circle cx="24" cy="24" r="4" fill="rgba(139,92,246,0.5)"/>
          </svg>
        </motion.div>

        <motion.div
          className="absolute top-[20%] right-[5%] hidden lg:block"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <div className="flex items-center gap-2 px-3.5 py-2 bg-white/5 border border-white/10 rounded-lg backdrop-blur-xl text-sm text-gray-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Cliente reativado!
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-[20%] left-[10%] hidden lg:block"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        >
          <div className="flex items-center gap-2 px-3.5 py-2 bg-white/5 border border-white/10 rounded-lg backdrop-blur-xl text-sm text-gray-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
            +45% conversão
          </div>
        </motion.div>

        {/* Content */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400 backdrop-blur-xl mb-7"
          >
            <span className="w-2 h-2 bg-emerald-500 rounded-full relative">
              <span className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-30"></span>
            </span>
            Plataforma em Beta
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6"
          >
            Reative clientes<br/>
            <span className="gradient-text">perdidos.</span><br/>
            <span className="text-gray-400 font-normal">Organize seu negócio.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-400 leading-relaxed mb-9 max-w-lg"
          >
            Automatize o atendimento, recupere clientes inativos e mantenha seu negócio funcionando 24/7 — sem complicação.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <Link to="/register" className="btn-primary text-base px-7 py-4">
              <span>Comece Grátis</span>
              <ArrowRight size={18} />
            </Link>
            <a href="#features" className="btn-secondary text-base px-7 py-4">
              Ver Funcionalidades
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center gap-8"
          >
            <div className="flex flex-col">
              <AnimatedCounter end={2500} suffix="+" className="font-display text-2xl font-bold gradient-text" />
              <span className="text-xs text-gray-500">Empresas</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="flex flex-col">
              <AnimatedCounter end={98} suffix="%" className="font-display text-2xl font-bold gradient-text" />
              <span className="text-xs text-gray-500">Satisfação</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="flex flex-col">
              <AnimatedCounter end={50} suffix="M+" className="font-display text-2xl font-bold gradient-text" />
              <span className="text-xs text-gray-500">Mensagens/mês</span>
            </div>
          </motion.div>
        </div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent-violet/20 to-accent-cyan/20 blur-3xl rounded-full"></div>
          <div className="relative bg-surface border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-accent-violet/10 animate-float">
            {/* Chrome */}
            <div className="flex items-center gap-3 px-4 py-3 bg-black/40 border-b border-white/5">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </div>
              <div className="flex-1 text-center text-xs text-gray-500 bg-black/30 py-1 px-3 rounded">app.reativa.com/dashboard</div>
            </div>

            {/* Body */}
            <div className="flex min-h-[320px]">
              {/* Sidebar */}
              <div className="w-12 bg-black/30 border-r border-white/5 py-3 flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-accent-violet/15 text-accent-violet flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                </div>
                <div className="w-8 h-8 rounded-md text-gray-500 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                </div>
                <div className="w-8 h-8 rounded-md text-gray-500 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <div className="w-8 h-8 rounded-md text-gray-500 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
                </div>
              </div>

              {/* Main */}
              <div className="flex-1 p-4 flex flex-col gap-3">
                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Conversas', value: '1,247', change: '+12.5%' },
                    { label: 'Reativados', value: '384', change: '+8.3%' },
                    { label: 'Resolução', value: '94%', change: '+5.2%' },
                  ].map((m, i) => (
                    <div key={i} className="bg-black/30 border border-white/5 rounded-md p-3">
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{m.label}</div>
                      <div className="font-display text-lg font-bold">{m.value}</div>
                      <div className="text-[10px] text-emerald-500 font-semibold mt-0.5">{m.change}</div>
                    </div>
                  ))}
                </div>

                {/* Chart */}
                <div className="bg-black/30 border border-white/5 rounded-md p-3 h-20 flex items-end gap-1.5">
                  {[40, 65, 45, 80, 60, 90, 70, 85, 55, 95].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-accent-violet to-accent-cyan rounded-sm opacity-70 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }}></div>
                  ))}
                </div>

                {/* Clients */}
                <div className="flex flex-col gap-1.5">
                  {[
                    { name: 'Maria Clara', status: 'Ativo', color: 'from-accent-violet to-accent-cyan', badge: 'active' },
                    { name: 'Rafael Santos', status: 'Inativo há 15 dias', color: 'from-yellow-500 to-red-500', badge: 'inactive' },
                    { name: 'Ana Lima', status: 'Reativado', color: 'from-emerald-500 to-blue-500', badge: 'recovered' },
                  ].map((c, i) => (
                    <div key={i} className="flex items-center gap-2.5 py-2 px-2.5 bg-black/20 rounded-md">
                      <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${c.color} flex items-center justify-center text-white text-xs font-bold`}>{c.name[0]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold">{c.name}</div>
                        <div className="text-[10px] text-gray-500">{c.status}</div>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        c.badge === 'active' ? 'bg-emerald-500/15 text-emerald-500' :
                        c.badge === 'inactive' ? 'bg-yellow-500/15 text-yellow-500' :
                        'bg-accent-violet/15 text-accent-violet'
                      }`}>{c.badge === 'active' ? 'Online' : c.badge === 'inactive' ? 'Inativo' : 'Reativado'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
