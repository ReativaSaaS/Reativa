import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { register } from '../lib/supabase'
import { showToast } from '../components/Toast'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const getStrength = (pwd) => {
    let score = 0
    if (pwd.length >= 8) score++
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^a-zA-Z0-9]/.test(pwd)) score++
    return score
  }

  const strengthLabels = ['', 'Fraca', 'Média', 'Boa', 'Forte']
  const strengthColors = ['', 'bg-red-500', 'bg-yellow-500', 'bg-yellow-500', 'bg-emerald-500']
  const strength = getStrength(form.password)

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Nome é obrigatório'
    if (!form.email || !form.email.includes('@')) newErrors.email = 'Email inválido'
    if (!form.password || form.password.length < 8) newErrors.password = 'Senha deve ter pelo menos 8 caracteres'
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'As senhas não coincidem'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      await register(form.email, form.password, form.name)
      showToast('Conta criada com sucesso!', 'success')
      setTimeout(() => navigate('/login'), 1500)
    } catch (error) {
      showToast(error.message || 'Erro ao criar conta', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors mb-6">
          <ArrowLeft size={16} />
          Voltar para o site
        </Link>

        <div className="text-center mb-9">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-violet to-accent-cyan rounded-lg flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-display text-2xl font-bold">REATIVA</span>
          </Link>
          <h1 className="font-display text-3xl font-bold mb-2">Crie sua conta</h1>
          <p className="text-gray-400">Comece a automatizar seu atendimento hoje</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-9 backdrop-blur-xl">
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button className="flex items-center justify-center gap-2 py-3 bg-black/30 border border-white/10 rounded-lg text-sm text-gray-400 hover:border-accent-violet/30 hover:text-white transition-all" onClick={() => showToast('Integração com Google em breve', 'error')}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 bg-black/30 border border-white/10 rounded-lg text-sm text-gray-400 hover:border-accent-violet/30 hover:text-white transition-all" onClick={() => showToast('Integração com GitHub em breve', 'error')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
              GitHub
            </button>
          </div>

          <div className="flex items-center gap-4 mb-5">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-xs text-gray-500">ou registre-se com email</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Nome completo</label>
              <input
                type="text"
                value={form.name}
                onChange={handleChange('name')}
                placeholder="Seu nome completo"
                className={`w-full px-4 py-3.5 bg-black/30 border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-accent-violet/20 transition-all outline-none ${
                  errors.name ? 'border-red-500' : 'border-white/10 focus:border-accent-violet'
                }`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1.5">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="seu@email.com"
                className={`w-full px-4 py-3.5 bg-black/30 border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-accent-violet/20 transition-all outline-none ${
                  errors.email ? 'border-red-500' : 'border-white/10 focus:border-accent-violet'
                }`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1.5">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Senha</label>
              <input
                type="password"
                value={form.password}
                onChange={handleChange('password')}
                placeholder="Mínimo 8 caracteres"
                className={`w-full px-4 py-3.5 bg-black/30 border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-accent-violet/20 transition-all outline-none ${
                  errors.password ? 'border-red-500' : 'border-white/10 focus:border-accent-violet'
                }`}
              />
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${i <= strength ? strengthColors[strength] : 'bg-white/10'}`}></div>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">Força: {strengthLabels[strength]}</span>
                </div>
              )}
              {errors.password && <p className="text-xs text-red-500 mt-1.5">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Confirmar senha</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={handleChange('confirmPassword')}
                placeholder="Repita sua senha"
                className={`w-full px-4 py-3.5 bg-black/30 border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-accent-violet/20 transition-all outline-none ${
                  errors.confirmPassword ? 'border-red-500' : 'border-white/10 focus:border-accent-violet'
                }`}
              />
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1.5">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`btn-primary w-full justify-center py-4 text-base ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </form>

          <div className="text-center mt-6 text-sm text-gray-400">
            Já tem uma conta? <Link to="/login" className="text-accent-violet font-semibold hover:underline">Fazer login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
