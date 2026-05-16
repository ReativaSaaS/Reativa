import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react'

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'contato@reativa.com' },
    { icon: Phone, label: 'Telefone', value: '+55 (11) 9999-9999' },
    { icon: MapPin, label: 'Localização', value: 'São Paulo, SP - Brasil' },
  ]

  return (
    <section id="contact" className="relative py-32 z-10">
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
            Contato
          </span>
          <h2 className="section-heading">
            Pronto para <span className="gradient-text">começar</span>?
          </h2>
          <p className="section-desc">Entre em contato ou crie sua conta gratuitamente.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Nome</label>
              <input
                type="text"
                placeholder="Seu nome completo"
                required
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-accent-violet focus:ring-2 focus:ring-accent-violet/20 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <input
                type="email"
                placeholder="seu@email.com"
                required
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-accent-violet focus:ring-2 focus:ring-accent-violet/20 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Mensagem</label>
              <textarea
                placeholder="Como podemos ajudar?"
                rows="4"
                required
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-accent-violet focus:ring-2 focus:ring-accent-violet/20 transition-all outline-none resize-none"
              ></textarea>
            </div>
            <button type="submit" className="btn-primary w-full justify-center py-4 text-base">
              {submitted ? 'Mensagem Enviada!' : (
                <>
                  <span>Enviar Mensagem</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col gap-4"
          >
            {contactInfo.map((info, i) => {
              const Icon = info.icon
              return (
                <div key={i} className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-lg backdrop-blur-xl transition-all duration-300 hover:border-accent-violet/30">
                  <div className="w-11 h-11 bg-accent-violet/10 rounded-md flex items-center justify-center text-accent-violet flex-shrink-0">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">{info.label}</div>
                    <div className="text-sm font-medium">{info.value}</div>
                  </div>
                </div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
