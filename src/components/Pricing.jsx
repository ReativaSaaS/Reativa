import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { selectPlan } from '../lib/stripe'

const plans = [
  {
    name: 'Starter',
    price: 97,
    desc: 'Ideal para quem está começando',
    features: ['Até 500 contatos', '5 automações ativas', 'Relatórios básicos', 'Suporte por email'],
    plan: 'starter',
  },
  {
    name: 'Pro',
    price: 197,
    desc: 'Para negócios em crescimento',
    features: ['Até 5.000 contatos', 'Automações ilimitadas', 'Chatbot com IA', 'Relatórios avançados', 'Suporte prioritário'],
    plan: 'pro',
    featured: true,
  },
  {
    name: 'Business',
    price: 497,
    desc: 'Para operações de grande escala',
    features: ['Contatos ilimitados', 'Tudo do plano Pro', 'API dedicada', 'Multi-atendentes', 'Gerente de conta'],
    plan: 'business',
  },
]

function PricingCard({ p, index, isInView }) {
  const [loading, setLoading] = useState(false)

  const handleSelect = async () => {
    setLoading(true)
    try {
      await selectPlan(p.plan)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className={`relative bg-white/5 border rounded-xl p-9 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${
        p.featured
          ? 'border-accent-violet shadow-lg shadow-accent-violet/10 scale-[1.02]'
          : 'border-white/10 hover:border-accent-violet/30'
      }`}
    >
      {p.featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-accent-violet to-accent-cyan text-white text-xs font-semibold px-4 py-1 rounded-full whitespace-nowrap">
          Mais Popular
        </div>
      )}

      <div className="text-base font-semibold text-gray-400 mb-2">{p.name}</div>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-lg font-semibold text-gray-400">R$</span>
        <span className="font-display text-5xl font-extrabold leading-none">{p.price}</span>
        <span className="text-base text-gray-500">/mês</span>
      </div>
      <p className="text-sm text-gray-500 mb-7">{p.desc}</p>

      <ul className="mb-8 space-y-0">
        {p.features.map((f, i) => (
          <li key={i} className="flex items-center gap-3 py-3 border-b border-white/5 text-sm text-gray-400 last:border-0">
            <Check size={18} className="text-accent-violet flex-shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={handleSelect}
        disabled={loading}
        className={`w-full py-3.5 px-6 text-sm font-semibold rounded-lg transition-all duration-300 ${
          p.featured
            ? 'bg-gradient-to-r from-accent-violet to-accent-cyan text-white shadow-lg shadow-accent-violet/30 hover:shadow-accent-violet/50 hover:-translate-y-0.5'
            : 'bg-white/5 border border-white/10 text-white hover:border-accent-violet/30 hover:bg-accent-violet/10 hover:-translate-y-0.5'
        } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Processando...' : p.featured ? 'Começar Agora' : 'Falar com Vendas'}
      </button>
    </motion.div>
  )
}

export default function Pricing() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="pricing" className="relative py-32 z-10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="section-tag">
            <span className="w-6 h-0.5 bg-gradient-to-r from-accent-violet to-accent-cyan rounded"></span>
            Preços
          </span>
          <h2 className="section-heading">
            Planos que <span className="gradient-text">crescem</span> com você
          </h2>
          <p className="section-desc">Escolha o plano ideal para o tamanho do seu negócio.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto items-start">
          {plans.map((p, i) => (
            <PricingCard key={i} p={p} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  )
}
