import { motion } from 'framer-motion'
import {
  MessageSquare, Bot, TrendingUp, Users, Clock, LineChart,
  Globe, Lock, ArrowUpRight,
} from 'lucide-react'

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

export default function Features() {
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
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-tight mb-5">
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
                  <h3 className="font-display text-base font-bold mb-2.5">{f.t}</h3>
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
