import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export default function FAQ() {
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
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-tight">
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
