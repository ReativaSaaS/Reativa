import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Star } from 'lucide-react'

const testimonials = [
  {
    quote: 'A REATIVA transformou nosso atendimento. Reduzimos o tempo de resposta em 80% e clientes perdidos estão voltando.',
    name: 'Maria Clara',
    role: 'CEO, Boutique Online',
    avatar: 'MC',
    gradient: 'from-accent-violet to-accent-cyan',
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

export default function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="relative py-32 z-10">
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
            Depoimentos
          </span>
          <h2 className="section-heading">
            O que nossos <span className="gradient-text">clientes</span> dizem
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-xl transition-all duration-300 hover:border-accent-violet/30 hover:-translate-y-1"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={14} fill="#f59e0b" className="text-yellow-500" />
                ))}
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-6 italic">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
