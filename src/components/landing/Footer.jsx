import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  const links = [
    { t: 'Produto', l: ['Funcionalidades', 'Preços', 'Integrações', 'API', 'Changelog'] },
    { t: 'Empresa', l: ['Sobre', 'Blog', 'Carreiras', 'Contato', 'Imprensa'] },
    { t: 'Suporte', l: ['Central de Ajuda', 'Documentação', 'Status', 'Termos de Uso', 'Privacidade'] },
  ]

  const socials = [
    'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z',
    'rect x="2" y="2" width="20" height="20" rx="5" ry="5"',
    'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z',
    'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22',
  ]

  return (
    <footer className="relative bg-[#06060f] border-t border-white/[0.04] py-20 z-10">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#7c3aed]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-[#7c3aed]/20">
                <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                  <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-display text-xl font-extrabold text-white">REATIVA</span>
            </div>
            <p className="text-sm text-white/30 max-w-xs leading-relaxed mb-6">
              Reative clientes perdidos. Organize seu negócio. Automatize atendimentos 24/7.
            </p>
            <div className="flex gap-3">
              {socials.map((d, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/30 hover:border-[#7c3aed]/30 hover:text-[#7c3aed] hover:bg-[#7c3aed]/5 transition-all duration-300"
                  aria-label="Social media"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={d} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {links.map((c, i) => (
            <div key={i}>
              <h4 className="font-display text-sm font-bold mb-5 text-white/60">{c.t}</h4>
              <div className="flex flex-col gap-3">
                {c.l.map((l, j) => (
                  <a key={j} href="#" className="text-sm text-white/30 hover:text-[#7c3aed] transition-colors duration-200">
                    {l}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/[0.04]">
          <span className="text-[11px] text-white/20">&copy; 2026 REATIVA. Todos os direitos reservados.</span>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <a href="#" className="text-[11px] text-white/20 hover:text-white/40 transition-colors">Termos</a>
            <a href="#" className="text-[11px] text-white/20 hover:text-white/40 transition-colors">Privacidade</a>
            <a href="#" className="text-[11px] text-white/20 hover:text-white/40 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
