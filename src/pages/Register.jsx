import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Eye, EyeOff, X } from 'lucide-react'
import { register, loginWithGoogle, loginWithGitHub } from '../lib/supabase'
import { showToast } from '../components/Toast'

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const getStrength = (pwd) => {
    let score = 0
    if (pwd.length >= 8) score++
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^a-zA-Z0-9]/.test(pwd)) score++
    return score
  }
  const strengthLabels = ['', 'Fraca', 'Média', 'Boa', 'Muito forte']
  const strengthColors = ['', '#ef4444', '#f59e0b', '#10b981', '#06b6d4']
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
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }

    setLoading(true)
    try {
      await register(form.email, form.password, form.name)
      showToast('Conta criada com sucesso!', 'success')
      setTimeout(() => navigate('/login'), 1500)
    } catch (error) {
      showToast(error.message || 'Erro ao criar conta', 'error')
    } finally { setLoading(false) }
  }

  const passwordsMatch = form.confirmPassword.length > 0 && form.password === form.confirmPassword
  const passwordsDontMatch = form.confirmPassword.length > 0 && form.password !== form.confirmPassword

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="flex min-h-screen">
      {/* LEFT — Branding */}
      <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="hidden lg:flex w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden" style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb, #06b6d4)' }}>
        <svg className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter><rect width="100%" height="100%" filter="url(#n)" /></svg>

        <div className="relative z-10 text-center max-w-sm">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center"><img src="/logo-icon.png" alt="R" className="w-8 h-8" /></div>
            <span className="font-['Syne',sans-serif] text-4xl font-extrabold text-white tracking-tight">REATIVA</span>
          </div>
          <p className="font-['DM_Sans',sans-serif] text-lg text-white/80 font-light mb-10">Recupere clientes. Automatize tudo.</p>
          <div className="space-y-4 text-left">
            {['Mais de 2.500 empresas ativas', '50M+ mensagens por mês', 'Setup em menos de 5 minutos'].map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0"><Check size={12} className="text-white" strokeWidth={3} /></div>
                <span className="text-sm text-white/90 font-light">{t}</span>
              </div>
            ))}
          </div>
        </div>

        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black/25 backdrop-blur-xl border border-white/15 rounded-xl p-4 flex items-center gap-3 min-w-[240px]">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/40 to-white/10 flex items-center justify-center text-white text-sm font-bold">MC</div>
          <div className="flex-1"><div className="text-sm font-semibold text-white">Maria Clara</div><div className="text-xs text-white/60">CEO, Boutique Online</div></div>
          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/30 text-emerald-200">Reativado</span>
        </motion.div>

        <div className="absolute right-0 top-0 bottom-0 w-px bg-white/10" />
      </motion.div>

      {/* RIGHT — Form */}
      <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="flex-1 flex items-center justify-center p-6 relative bg-[#06060f] overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#7c3aed] rounded-full blur-[120px] opacity-[0.12] animate-[blob_10s_ease-in-out_infinite] pointer-events-none" />

        <div className="relative z-10 w-full max-w-[400px]">
          <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center"><img src="/logo-icon.png" alt="R" className="w-5 h-5" /></div>
            <span className="font-['Syne',sans-serif] text-xl font-extrabold text-white">REATIVA</span>
          </Link>

          <h1 className="font-['Syne',sans-serif] text-[28px] font-bold text-white mb-2">Crie sua conta</h1>
          <p className="font-['DM_Sans',sans-serif] text-[15px] text-white/50 font-light mb-8">Comece a automatizar seu atendimento hoje</p>

          <motion.div variants={container} initial="hidden" animate="visible">
            {/* OAuth */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3 mb-5">
              <motion.button whileHover={{ y: -1, scale: 0.98 }} whileTap={{ scale: 0.97 }} className="flex items-center justify-center gap-2.5 py-[11px] px-4 bg-white/[0.05] border border-white/[0.1] rounded-[10px] text-sm font-medium text-white/85 hover:bg-white/[0.09] transition-colors duration-200" onClick={loginWithGoogle}>
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google
              </motion.button>
              <motion.button whileHover={{ y: -1, scale: 0.98 }} whileTap={{ scale: 0.97 }} className="flex items-center justify-center gap-2.5 py-[11px] px-4 bg-white/[0.05] border border-white/[0.1] rounded-[10px] text-sm font-medium text-white/85 hover:bg-white/[0.09] transition-colors duration-200" onClick={loginWithGitHub}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
                GitHub
              </motion.button>
            </motion.div>

            {/* Divider */}
            <motion.div variants={fadeUp} className="flex items-center gap-4 mb-5">
              <div className="flex-1 h-px bg-white/[0.08]" />
              <span className="text-xs text-white/30">ou registre-se com email</span>
              <div className="flex-1 h-px bg-white/[0.08]" />
            </motion.div>

            <form onSubmit={handleSubmit}>
              <motion.div variants={container} className="flex flex-col gap-5">
                {/* Name */}
                <motion.div variants={fadeUp}>
                  <label className="block text-[13px] font-medium text-white/65 mb-1.5">Nome completo</label>
                  <input type="text" value={form.name} onChange={handleChange('name')} placeholder="Seu nome completo" className={`w-full px-3.5 py-[11px] bg-white/[0.04] border rounded-[10px] text-white text-[15px] placeholder-white/25 transition-all duration-250 outline-none ${errors.name ? 'border-red-500' : 'border-white/[0.09] focus:border-[#7c3aed] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.18)]'}`} />
                  {errors.name && <p className="text-xs text-red-400 mt-1.5">{errors.name}</p>}
                </motion.div>

                {/* Email */}
                <motion.div variants={fadeUp}>
                  <label className="block text-[13px] font-medium text-white/65 mb-1.5">Email</label>
                  <input type="email" value={form.email} onChange={handleChange('email')} placeholder="seu@email.com" className={`w-full px-3.5 py-[11px] bg-white/[0.04] border rounded-[10px] text-white text-[15px] placeholder-white/25 transition-all duration-250 outline-none ${errors.email ? 'border-red-500' : 'border-white/[0.09] focus:border-[#7c3aed] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.18)]'}`} />
                  {errors.email && <p className="text-xs text-red-400 mt-1.5">{errors.email}</p>}
                </motion.div>

                {/* Password */}
                <motion.div variants={fadeUp}>
                  <label className="block text-[13px] font-medium text-white/65 mb-1.5">Senha</label>
                  <div className="relative">
                    <input type={showPw ? 'text' : 'password'} value={form.password} onChange={handleChange('password')} placeholder="Mínimo 8 caracteres" className={`w-full px-3.5 py-[11px] pr-11 bg-white/[0.04] border rounded-[10px] text-white text-[15px] placeholder-white/25 transition-all duration-250 outline-none ${errors.password ? 'border-red-500' : 'border-white/[0.09] focus:border-[#7c3aed] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.18)]'}`} />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {form.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="flex-1 h-[3px] rounded-sm transition-all duration-300" style={{ background: i <= strength ? strengthColors[strength] : 'rgba(255,255,255,0.1)' }} />
                        ))}
                      </div>
                      <span className="text-xs" style={{ color: strengthColors[strength] || 'rgba(255,255,255,0.3)' }}>{strengthLabels[strength]}</span>
                    </div>
                  )}
                  {errors.password && <p className="text-xs text-red-400 mt-1.5">{errors.password}</p>}
                </motion.div>

                {/* Confirm Password */}
                <motion.div variants={fadeUp}>
                  <label className="block text-[13px] font-medium text-white/65 mb-1.5">Confirmar senha</label>
                  <div className="relative">
                    <input type={showConfirm ? 'text' : 'password'} value={form.confirmPassword} onChange={handleChange('confirmPassword')} placeholder="Repita sua senha" className={`w-full px-3.5 py-[11px] pr-11 bg-white/[0.04] border rounded-[10px] text-white text-[15px] placeholder-white/25 transition-all duration-250 outline-none ${errors.confirmPassword ? 'border-red-500' : passwordsMatch ? 'border-emerald-500' : 'border-white/[0.09] focus:border-[#7c3aed] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.18)]'}`} />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                      {passwordsMatch && <Check size={16} className="text-emerald-500" />}
                      {passwordsDontMatch && <X size={16} className="text-red-400" />}
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-white/40 hover:text-white/80 transition-colors">
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-400 mt-1.5">{errors.confirmPassword}</p>}
                </motion.div>

                {/* Submit */}
                <motion.div variants={fadeUp}>
                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className={`relative w-full py-[13px] rounded-[10px] text-white text-[15px] font-semibold overflow-hidden group ${loading ? 'opacity-70 cursor-not-allowed' : ''}`} style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb, #06b6d4)', backgroundSize: '200% 200%' }}>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full skew-x-[-20deg] group-hover:translate-x-full transition-transform duration-700" />
                    <span className="relative">{loading ? 'Criando conta...' : 'Criar Conta'}</span>
                  </motion.button>
                </motion.div>
              </motion.div>
            </form>

            <motion.p variants={fadeUp} className="text-center mt-6 text-sm text-white/40">
              Já tem uma conta? <Link to="/login" className="text-[#06b6d4] font-semibold hover:underline transition-all duration-150">Fazer login</Link>
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
