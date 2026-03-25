import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Zap } from 'lucide-react'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Portfolio X-Ray', href: '#xray' },
  { label: 'Tax Wizard', href: '#tax' },
  { label: 'Health Score', href: '#health' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'backdrop-blur-md bg-navy-900/80 border-b border-white/[0.06] shadow-xl shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-green-growth/20 border border-green-growth/40 flex items-center justify-center group-hover:bg-green-growth/30 transition-colors">
            <Zap size={16} className="text-green-growth fill-green-growth" />
          </div>
          <span className="font-bold text-white text-base tracking-tight">
            AI<span className="text-green-growth">Money</span>Mentor
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map(l => (
            <a key={l.label} href={l.href} className="nav-link">{l.label}</a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button className="btn-ghost text-xs px-4 py-2">Log in</button>
          <button className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-navy-900 animate-pulse" />
            Connect CAMS
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/[0.05] transition-colors"
          onClick={() => setMenuOpen(v => !v)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/[0.06] backdrop-blur-md bg-navy-900/90"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {navLinks.map(l => (
                <a
                  key={l.label}
                  href={l.href}
                  className="text-white/70 hover:text-white py-2 text-sm font-medium border-b border-white/[0.05]"
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </a>
              ))}
              <button className="btn-primary mt-2 w-full justify-center">Connect CAMS</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
