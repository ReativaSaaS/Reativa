import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function Terms() {
  return (
    <div className="min-h-screen bg-deep py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors mb-8">
          <ArrowLeft size={16} /> Voltar
        </Link>

        <h1 className="font-display text-3xl font-bold mb-2">Termos de Uso</h1>
        <p className="text-sm text-gray-500 mb-8">Última atualização: 16 de maio de 2026</p>

        <div className="space-y-8 text-sm text-gray-300 leading-relaxed">
          <section>
            <h2 className="font-display text-lg font-semibold text-white mb-3">1. Aceitação dos Termos</h2>
            <p>Ao acessar e usar a plataforma REATIVA, você concorda com estes Termos de Uso. Se você não concordar com algum termo, não utilize nossos serviços.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-white mb-3">2. Descrição do Serviço</h2>
            <p>A REATIVA é uma plataforma SaaS de reativação de clientes e CRM que oferece ferramentas para gerenciamento de contatos, automação de atendimento, campanhas de reativação e assistente de inteligência artificial.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-white mb-3">3. Cadastro e Conta</h2>
            <p>Para usar nossos serviços, você deve criar uma conta com informações verdadeiras e manter seus dados atualizados. Você é responsável por manter a segurança de sua conta e senha.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-white mb-3">4. Uso Aceitável</h2>
            <p>Você concorda em usar a plataforma apenas para fins legítimos de negócios. É proibido usar o serviço para enviar spam, mensagens não solicitadas ou qualquer atividade ilegal.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-white mb-3">5. Pagamentos e Assinatura</h2>
            <p>Os planos pagos são cobrados mensalmente via Stripe. Você pode cancelar a qualquer momento. Reembolsos são avaliados caso a caso dentro de 7 dias após o pagamento.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-white mb-3">6. Propriedade Intelectual</h2>
            <p>Todo o conteúdo, design e código da plataforma REATIVA são de nossa propriedade. Você mantém a propriedade de seus dados e conteúdo inserido na plataforma.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-white mb-3">7. Limitação de Responsabilidade</h2>
            <p>A REATIVA não se responsabiliza por perdas indiretas, lucros cessantes ou danos consequenciais. Nosso serviço é fornecido "como está" sem garantias expressas.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-white mb-3">8. Alterações</h2>
            <p>Podemos atualizar estes termos a qualquer momento. Mudanças significativas serão comunicadas por email ou notificação na plataforma.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-white mb-3">9. Contato</h2>
            <p>Dúvidas sobre estes termos? Entre em contato: <a href="mailto:contato@reativa.com" className="text-accent-violet hover:underline">contato@reativa.com</a></p>
          </section>
        </div>
      </div>
    </div>
  )
}
