import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Menu, X, ArrowRight } from 'lucide-react'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const nav = [
    { h: '#home', l: 'Home' },
    { h: '#features', l: 'Funcionalidades' },
    { h: '#how', l: 'Como Funciona' },
    { h: '#pricing', l: 'Preços' },
    { h: '#contact', l: 'Contato' },
  ]

  const go = (e, h) => {
    e.preventDefault()
    document.querySelector(h)?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
          scrolled
            ? 'bg-[#06060f]/90 backdrop-blur-2xl border-b border-white/[0.06] py-3 shadow-2xl shadow-black/20'
            : 'py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#home" onClick={e => go(e, '#home')} className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.4 }}
              className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center shadow-lg shadow-[#7c3aed]/30"
            >
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
            <span className="font-display text-xl font-extrabold tracking-tight text-white">
              RE<span className="bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent">ATIVA</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-full px-2 py-1 backdrop-blur-sm">
            {nav.map(n => (
              <a
                key={n.h}
                href={n.h}
                onClick={e => go(e, n.h)}
                className="relative text-[13px] font-medium text-white/45 hover:text-white transition-colors duration-200 px-4 py-2 rounded-full hover:bg-white/[0.06]"
              >
                {n.l}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-white/50 hover:text-white transition-colors px-4 py-2">
              Login
            </Link>
            <Link to="/register" className="relative group overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-[#7c3aed] via-[#6d28d9] to-[#06b6d4] transition-all duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative flex items-center gap-2 px-6 py-2.5 text-white text-sm font-semibold">
                Começar Grátis
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 bg-[#06060f]/98 backdrop-blur-3xl z-[99] flex flex-col items-center justify-center gap-8"
          >
            {nav.map((n, i) => (
              <motion.a
                key={n.h}
                href={n.h}
                onClick={e => go(e, n.h)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="font-display text-3xl font-bold text-white/70 hover:text-white transition-colors"
              >
                {n.l}
              </motion.a>
            ))}
            <div className="flex flex-col gap-3 w-60 mt-4">
              <Link to="/login" className="text-center py-3.5 bg-white/[0.06] border border-white/[0.08] rounded-xl text-white font-medium hover:bg-white/[0.1] transition-colors">
                Login
              </Link>
              <Link to="/register" className="text-center py-3.5 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] rounded-xl text-white font-semibold shadow-lg shadow-[#7c3aed]/20">
                Começar Grátis
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
