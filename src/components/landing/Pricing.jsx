import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

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

export default function Pricing() {
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
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-tight mb-5">
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
                  <span className="font-display text-5xl font-extrabold text-white">{p.price}</span>
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
