import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { MessageSquare, Bot, TrendingUp, Users, Clock, BarChart3, Mail, ArrowRight } from 'lucide-react'

const features = [
  {
    icon: MessageSquare,
    title: 'Automação de Mensagens',
    desc: 'Respostas inteligentes que se adaptam ao contexto de cada conversa automaticamente.',
  },
  {
    icon: Bot,
    title: 'Chatbot Inteligente',
    desc: 'IA que entende a intenção do cliente e resolve 90% das dúvidas sem intervenção.',
  },
  {
    icon: TrendingUp,
    title: 'Campanhas Promocionais',
    desc: 'Crie campanhas segmentadas para reengajar clientes inativos e aumentar vendas.',
  },
  {
    icon: Users,
    title: 'Organização de Clientes',
    desc: 'CRM integrado para gerenciar contatos, histórico e segmentar sua base.',
  },
  {
    icon: Clock,
    title: 'Agendamento de Respostas',
    desc: 'Programe mensagens para o momento ideal e nunca perca uma oportunidade.',
  },
  {
    icon: BarChart3,
    title: 'Painel Analítico',
    desc: 'Dashboards em tempo real para acompanhar métricas e performance.',
  },
  {
    icon: Mail,
    title: 'Integração WhatsApp',
    desc: 'Conecte diretamente com WhatsApp Business API para automatizar atendimentos na plataforma mais usada do Brasil.',
    wide: true,
  },
]

function FeatureCard({ feature, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const Icon = feature.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      className={`group relative bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-xl transition-all duration-300 hover:border-accent-violet/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent-violet/10 overflow-hidden ${feature.wide ? 'col-span-full' : ''}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent-violet/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        <div className="w-12 h-12 flex items-center justify-center mb-5">
          <Icon size={24} className="text-accent-violet" />
        </div>
        <h3 className="font-display text-lg font-semibold mb-2">{feature.title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
        <div className="absolute bottom-6 right-6 text-accent-violet opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <ArrowRight size={16} />
        </div>
      </div>
    </motion.div>
  )
}

export default function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="features" className="relative py-32 z-10">
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
            Funcionalidades
          </span>
          <h2 className="section-heading">
            Tudo que você precisa para<br/>
            <span className="gradient-text">reativar e crescer</span>
          </h2>
          <p className="section-desc">Ferramentas poderosas para transformar clientes perdidos em oportunidades.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
