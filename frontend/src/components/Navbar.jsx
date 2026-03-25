import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Zap, TrendingUp } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'FIRE Planner', href: '/fire-planner' },
  { label: 'Health Score', href: '/health-score' },
  { label: 'Tax Wizard', href: '/tax-wizard' },
  { label: 'Portfolio X-Ray', href: '/portfolio-xray' },
  { label: 'Life Events', href: '/life-event' },
  { label: "Couple's Planner", href: '/couples-planner' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hoveredPath, setHoveredPath] = useState(null)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 pointer-events-none">
      <div className={`pointer-events-auto transition-all duration-500 w-full max-w-[95%] xl:max-w-6xl rounded-full ${scrolled || !isHome ? 'bg-[rgba(5,8,16,0.6)] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]' : 'bg-transparent border border-transparent'}`}>
        <nav className="px-5 lg:px-8 flex items-center justify-between h-[64px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0 mr-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 group-hover:rotate-180 bg-blue-500/10 border border-blue-500/30 flex-shrink-0">
              <TrendingUp size={14} className="text-blue-400 group-hover:text-emerald-400 transition-colors" />
            </div>
            <span className="font-display font-normal text-lg tracking-tight text-slate-100 flex-shrink-0 whitespace-nowrap">
              AI<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Money</span>Mentor
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center" onMouseLeave={() => setHoveredPath(null)}>
            {navLinks.map(l => {
              const isActive = location.pathname === l.href
              const isHovered = hoveredPath === l.href

              return (
                <Link
                  key={l.label}
                  to={l.href}
                  onMouseEnter={() => setHoveredPath(l.href)}
                  className="relative px-4 py-2 rounded-full text-[13px] font-medium tracking-wide transition-colors group"
                >
                  <span className={`relative z-10 whitespace-nowrap transition-colors duration-300 ${isActive ? 'text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'text-slate-400 group-hover:text-white'}`}>
                    {l.label}
                  </span>
                  
                  {isHovered && !isActive && (
                    <motion.div
                      layoutId="navbar-hover"
                      className="absolute inset-0 bg-white/5 rounded-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}

                  {isActive && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 bg-blue-500/10 border border-blue-500/30 rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-4 ml-4 flex-shrink-0">
            <Link to="/health-score" className="relative group overflow-hidden px-5 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-[13px] font-semibold tracking-wide transition-all hover:border-blue-400/60 hover:text-white hover:bg-blue-500/20 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] whitespace-nowrap">
              <span className="relative z-10 flex items-center gap-2">
                <Zap size={14} className="text-blue-400 group-hover:animate-pulse" />
                Health Score
              </span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-full transition-colors text-slate-300 hover:text-white hover:bg-white/5 flex-shrink-0"
            onClick={() => setMenuOpen(v => !v)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-[80px] left-4 right-4 z-40 lg:hidden rounded-3xl overflow-hidden pointer-events-auto shadow-2xl border border-white/10 backdrop-blur-3xl bg-[#02040a]/95"
          >
            <div className="px-6 py-6 flex flex-col gap-2">
              {navLinks.map(l => (
                <Link
                  key={l.label}
                  to={l.href}
                  className={`py-3 px-4 text-sm font-medium rounded-xl transition-colors ${
                    location.pathname === l.href
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/health-score"
                className="mt-4 w-full py-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                onClick={() => setMenuOpen(false)}
              >
                <Zap size={16} /> Get Health Score
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
