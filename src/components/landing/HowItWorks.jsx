import { motion } from 'framer-motion'
import { Users, Zap, LineChart } from 'lucide-react'

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

export default function HowItWorks() {
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
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-tight">
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
                <span className="font-display text-[8rem] font-extrabold text-white/[0.02] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] select-none">
                  {s.n}
                </span>
                {/* Circle */}
                <div className="relative w-20 h-20 rounded-2xl bg-[#0a0a18] border border-white/[0.08] flex items-center justify-center group-hover:border-[#7c3aed]/30 group-hover:shadow-[0_0_30px_rgba(124,58,237,0.15)] transition-all duration-500">
                  <s.icon size={28} className="text-[#7c3aed] group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <h3 className="font-display text-xl font-bold mb-3">{s.t}</h3>
              <p className="text-sm text-white/35 max-w-xs mx-auto leading-relaxed">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
