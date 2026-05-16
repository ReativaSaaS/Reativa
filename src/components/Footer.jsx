import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="relative bg-surface border-t border-white/5 py-16 z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-accent-violet to-accent-cyan rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                  <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-display text-xl font-bold tracking-tight">REATIVA</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">Reative clientes perdidos. Organize seu negócio.</p>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold mb-4">Produto</h4>
            <div className="flex flex-col gap-2.5">
              <a href="#features" className="text-sm text-gray-400 hover:text-accent-violet transition-colors">Funcionalidades</a>
              <a href="#pricing" className="text-sm text-gray-400 hover:text-accent-violet transition-colors">Preços</a>
              <a href="#" className="text-sm text-gray-400 hover:text-accent-violet transition-colors">Integrações</a>
              <a href="#" className="text-sm text-gray-400 hover:text-accent-violet transition-colors">API</a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold mb-4">Empresa</h4>
            <div className="flex flex-col gap-2.5">
              <a href="#about" className="text-sm text-gray-400 hover:text-accent-violet transition-colors">Sobre</a>
              <a href="#" className="text-sm text-gray-400 hover:text-accent-violet transition-colors">Blog</a>
              <a href="#" className="text-sm text-gray-400 hover:text-accent-violet transition-colors">Carreiras</a>
              <a href="#contact" className="text-sm text-gray-400 hover:text-accent-violet transition-colors">Contato</a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold mb-4">Suporte</h4>
            <div className="flex flex-col gap-2.5">
              <a href="#" className="text-sm text-gray-400 hover:text-accent-violet transition-colors">Central de Ajuda</a>
              <a href="#" className="text-sm text-gray-400 hover:text-accent-violet transition-colors">Documentação</a>
              <a href="#" className="text-sm text-gray-400 hover:text-accent-violet transition-colors">Termos de Uso</a>
              <a href="#" className="text-sm text-gray-400 hover:text-accent-violet transition-colors">Privacidade</a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-white/5 text-xs text-gray-500">
          <span>&copy; 2026 REATIVA. Todos os direitos reservados.</span>
          <div className="flex gap-4 mt-4 md:mt-0">
            {['Twitter', 'Instagram', 'LinkedIn', 'GitHub'].map((social, i) => (
              <a key={i} href="#" className="w-9 h-9 flex items-center justify-center bg-white/5 border border-white/10 rounded-md text-gray-400 hover:border-accent-violet hover:text-accent-violet hover:bg-accent-violet/10 transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {social === 'Twitter' && <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>}
                  {social === 'Instagram' && <><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></>}
                  {social === 'LinkedIn' && <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></>}
                  {social === 'GitHub' && <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>}
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
