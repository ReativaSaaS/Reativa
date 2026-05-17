import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-deep py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors mb-8">
          <ArrowLeft size={16} /> Voltar
        </Link>

        <h1 className="font-display text-3xl font-bold mb-2">Política de Privacidade</h1>
        <p className="text-sm text-gray-500 mb-8">Última atualização: 16 de maio de 2026</p>

        <div className="space-y-8 text-sm text-gray-300 leading-relaxed">
          <section>
            <h2 className="font-display text-lg font-semibold text-white mb-3">1. Informações que Coletamos</h2>
            <p>Coletamos informações que você nos fornece diretamente: nome, email, telefone, dados de clientes e conteúdo inserido na plataforma. Também coletamos dados de uso automaticamente, como páginas visitadas e ações realizadas.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-white mb-3">2. Uso das Informações</h2>
            <p>Utilizamos seus dados para: fornecer e melhorar nossos serviços, enviar comunicações importantes, personalizar sua experiência e garantir a segurança da plataforma.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-white mb-3">3. Compartilhamento</h2>
            <p>Não vendemos seus dados. Compartilhamos informações apenas com provedores de serviço essenciais (Supabase, Stripe, OpenRouter) para operação da plataforma, e quando exigido por lei.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-white mb-3">4. Segurança</h2>
            <p>Implementamos medidas de segurança adequadas para proteger seus dados, incluindo criptografia, autenticação segura e acesso restrito. Nenhum sistema é 100% seguro, mas nos esforçamos para proteger suas informações.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-white mb-3">5. Seus Direitos</h2>
            <p>Você tem direito de: acessar seus dados, corrigir informações incorretas, solicitar exclusão da conta e exportar seus dados. Entre em contato para exercer esses direitos.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-white mb-3">6. Cookies</h2>
            <p>Utilizamos cookies essenciais para funcionamento da plataforma e cookies de autenticação para manter sua sessão ativa.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-white mb-3">7. Retenção de Dados</h2>
            <p>Mantemos seus dados enquanto sua conta estiver ativa. Após exclusão da conta, dados pessoais são removidos em até 30 dias, exceto quando retenção é exigida por lei.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-white mb-3">8. Contato</h2>
            <p>Questões sobre privacidade? Entre em contato: <a href="mailto:privacidade@reativa.com" className="text-accent-violet hover:underline">privacidade@reativa.com</a></p>
          </section>
        </div>
      </div>
    </div>
  )
}
