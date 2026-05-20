import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

export default function Testimonials() {
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
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-tight">
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
