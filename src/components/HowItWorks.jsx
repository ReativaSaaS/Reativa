import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const steps = [
  {
    number: '01',
    title: 'Conecte seus Contatos',
    desc: 'Importe sua base de clientes ou conecte diretamente com seu WhatsApp Business.',
  },
  {
    number: '02',
    title: 'Configure Automações',
    desc: 'Crie fluxos de atendimento automatizados com nossa interface drag-and-drop.',
  },
  {
    number: '03',
    title: 'Acompanhe Resultados',
    desc: 'Monitore métricas em tempo real e veja clientes perdidos voltando.',
  },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" className="relative py-32 z-10">
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
            Como Funciona
          </span>
          <h2 className="section-heading">
            Três passos para<br/>
            <span className="gradient-text">reativar seu negócio</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10 relative">
          {/* Connecting line */}
          <div className="absolute top-10 left-[15%] w-[70%] h-0.5 bg-gradient-to-r from-accent-violet to-accent-cyan opacity-20 hidden md:block"></div>

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="text-center relative"
            >
              <div className="font-display text-5xl font-extrabold gradient-text opacity-30 mb-4">{step.number}</div>
              <div className="w-10 h-1 bg-gradient-to-r from-accent-violet to-accent-cyan rounded mx-auto mb-5"></div>
              <h3 className="font-display text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
