import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ArrowRight } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  const links = [
    { href: '/#home', label: 'Home' },
    { href: '/#features', label: 'Features' },
    { href: '/#pricing', label: 'Pricing' },
    { href: '/#about', label: 'About' },
    { href: '/#contact', label: 'Contact' },
  ]

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-300 ${scrolled ? 'bg-deep/85 backdrop-blur-xl border-b border-white/5 py-3' : 'py-4'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 z-[1001]">
            <div className="w-9 h-9 bg-gradient-to-br from-accent-violet to-accent-cyan rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-display text-xl font-bold tracking-tight">REATIVA</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map(link => (
              <a key={link.href} href={link.href} className="text-sm font-medium text-gray-400 hover:text-white transition-colors relative group">
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-accent-violet to-accent-cyan transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3 z-[1001]">
            <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors px-4 py-2">
              Login
            </Link>
            <Link to="/register" className="btn-primary text-sm py-2.5 px-5">
              Get Started
              <ArrowRight size={14} />
            </Link>
          </div>

          <button className="md:hidden z-[1001] p-1" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-deep/98 backdrop-blur-xl z-[999] flex flex-col items-center justify-center gap-10 transition-transform duration-500 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {links.map(link => (
          <a key={link.href} href={link.href} className="font-display text-3xl font-semibold text-white hover:text-accent-violet transition-colors" onClick={() => setMobileOpen(false)}>
            {link.label}
          </a>
        ))}
        <div className="flex flex-col gap-3 w-60">
          <Link to="/login" className="btn-secondary w-full justify-center">Login</Link>
          <Link to="/register" className="btn-primary w-full justify-center">Get Started</Link>
        </div>
      </div>
    </>
  )
}
