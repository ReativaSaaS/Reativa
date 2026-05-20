import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, Phone, MapPin, CheckCircle2, Headphones } from 'lucide-react'
import GlowOrb from './GlowOrb'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const info = [
    { icon: Mail, l: 'Email', v: 'contato@reativa.com' },
    { icon: Phone, l: 'Telefone', v: '+55 (11) 9999-9999' },
    { icon: MapPin, l: 'Localização', v: 'São Paulo, SP - Brasil' },
  ]

  return (
    <section id="contact" className="relative py-32 z-10">
      <GlowOrb className="w-[400px] h-[400px] bg-[#7c3aed] bottom-0 left-1/4 blur-[140px]" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7c3aed] mb-5">
            <span className="w-8 h-[2px] bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] rounded" />
            Contato
            <span className="w-8 h-[2px] bg-gradient-to-r from-[#06b6d4] to-[#7c3aed] rounded" />
          </span>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-tight mb-5">
            Pronto para{' '}
            <span className="bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent">começar</span>?
          </h2>
          <p className="text-lg text-white/35 max-w-xl mx-auto">
            Entre em contato ou crie sua conta gratuitamente.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.form
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            onSubmit={e => { e.preventDefault(); setSent(true); setTimeout(() => setSent(false), 3000) }}
            className="space-y-5"
          >
            {[
              { l: 'Nome', p: 'Seu nome completo', t: 'text' },
              { l: 'Email', p: 'seu@email.com', t: 'email' },
            ].map((f, i) => (
              <div key={i}>
                <label className="block text-sm font-medium text-white/40 mb-2.5">{f.l}</label>
                <input
                  type={f.t}
                  placeholder={f.p}
                  required
                  className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder-white/20 focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/20 transition-all duration-300 outline-none hover:border-white/[0.1]"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-white/40 mb-2.5">Mensagem</label>
              <textarea
                placeholder="Como podemos ajudar?"
                rows="4"
                required
                className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder-white/20 focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/20 transition-all duration-300 outline-none resize-none hover:border-white/[0.1]"
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-[#7c3aed] via-[#6d28d9] to-[#06b6d4] text-white font-semibold text-base relative overflow-hidden group hover:shadow-lg hover:shadow-[#7c3aed]/20 transition-shadow"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative flex items-center gap-2">
                {sent ? (
                  <>
                    <CheckCircle2 size={18} />
                    Mensagem Enviada!
                  </>
                ) : (
                  <>
                    Enviar Mensagem
                    <Send size={18} />
                  </>
                )}
              </span>
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="space-y-4"
          >
            {info.map((c, i) => {
              const I = c.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-4 p-5 bg-white/[0.02] border border-white/[0.06] rounded-xl transition-all duration-300 hover:border-[#7c3aed]/20 hover:bg-white/[0.04] group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7c3aed]/15 to-[#06b6d4]/15 border border-[#7c3aed]/10 flex items-center justify-center flex-shrink-0 group-hover:border-[#7c3aed]/25 transition-colors">
                    <I size={20} className="text-[#7c3aed]" />
                  </div>
                  <div>
                    <div className="text-xs text-white/25 mb-1">{c.l}</div>
                    <div className="text-sm font-medium text-white/70">{c.v}</div>
                  </div>
                </motion.div>
              )
            })}

            {/* CTA card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="p-6 bg-gradient-to-br from-[#7c3aed]/10 to-[#06b6d4]/10 border border-[#7c3aed]/20 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <Headphones size={20} className="text-[#7c3aed]" />
                <span className="text-sm font-semibold text-white/80">Suporte 24/7</span>
              </div>
              <p className="text-sm text-white/35 leading-relaxed">
                Nossa equipe está pronta para ajudar a qualquer momento. Resposta em até 2 horas.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
