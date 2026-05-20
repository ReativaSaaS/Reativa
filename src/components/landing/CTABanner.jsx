import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import GlowOrb from './GlowOrb'

export default function CTABanner() {
  return (
    <section className="relative py-24 z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#7c3aed]/10 via-[#6d28d9]/10 to-[#06b6d4]/10" />
      <GlowOrb className="w-[400px] h-[400px] bg-[#7c3aed] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-[120px]" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-extrabold tracking-tight mb-6">
            Pronto para{' '}
            <span className="bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent">reativar</span>?
          </h2>
          <p className="text-lg text-white/35 max-w-xl mx-auto mb-10">
            Junte-se a mais de 2.500 empresas que já estão recuperando clientes e aumentando vendas.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="relative group">
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
              <span className="relative flex items-center gap-2 px-10 py-4.5 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white font-semibold shadow-xl shadow-[#7c3aed]/25 text-lg">
                Comece Grátis Agora
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
          <p className="text-xs text-white/20 mt-5">Sem cartão de crédito. Cancele quando quiser.</p>
        </motion.div>
      </div>
    </section>
  )
}
