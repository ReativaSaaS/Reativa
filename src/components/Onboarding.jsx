import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Check, Users, Zap, Bot, Sparkles } from 'lucide-react'

const steps = [
  {
    icon: Users,
    title: 'Bem-vindo à REATIVA',
    subtitle: 'Sua plataforma de reativação de clientes',
    description: 'A REATIVA ajuda você a recuperar clientes perdidos, automatizar atendimento e crescer seu negócio. Vamos configurar sua conta em 3 passos simples.',
    color: 'from-accent-violet to-accent-cyan'
  },
  {
    icon: Zap,
    title: 'Importe seus clientes',
    subtitle: 'Comece com sua base existente',
    description: 'Importe seus contatos via CSV ou adicione manualmente. Quanto mais dados você tiver, melhor a IA pode ajudar a reativar clientes inativos.',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    icon: Bot,
    title: 'Configure a IA',
    subtitle: 'Assistente inteligente de reativação',
    description: 'Configure sua API key do OpenRouter para ativar o assistente de IA. Ele analisa seus clientes e sugere ações personalizadas.',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    icon: Sparkles,
    title: 'Tudo pronto!',
    subtitle: 'Comece a reativar clientes',
    description: 'Sua conta está configurada. Comece adicionando clientes e criando campanhas de reativação. A IA vai ajudar com sugestões inteligentes.',
    color: 'from-amber-500 to-orange-500'
  }
]

export default function Onboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      localStorage.setItem('reativa_onboarding_done', 'true')
      onComplete()
    }
  }

  const prev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  const skip = () => {
    localStorage.setItem('reativa_onboarding_done', 'true')
    onComplete()
  }

  const step = steps[currentStep]
  const Icon = step.icon

  return (
    <div className="fixed inset-0 bg-deep/95 backdrop-blur-xl z-[200] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full"
      >
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div key={i} className={`flex-1 h-1 rounded-full transition-colors duration-300 ${i <= currentStep ? 'bg-accent-violet' : 'bg-white/10'}`} />
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="text-center mb-10"
          >
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
              <Icon size={28} className="text-white" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-2">{step.title}</h2>
            <p className="text-sm text-accent-light mb-4">{step.subtitle}</p>
            <p className="text-sm text-gray-400 leading-relaxed max-w-md mx-auto">{step.description}</p>
          </motion.div>
        </AnimatePresence>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div>
            {currentStep > 0 ? (
              <button onClick={prev} className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-1.5">
                <ArrowLeft size={14} /> Voltar
              </button>
            ) : (
              <button onClick={skip} className="text-sm text-gray-500 hover:text-white transition-colors">
                Pular
              </button>
            )}
          </div>

          <button onClick={next} className="btn-primary px-6 py-2.5 text-sm">
            {currentStep === steps.length - 1 ? (
              <>
                <Check size={16} /> Começar
              </>
            ) : (
              <>
                Próximo <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
