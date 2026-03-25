import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Zap, FileCheck, HeartPulse } from 'lucide-react'

export default function FooterCTA() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <footer className="relative pt-24 pb-12 overflow-hidden">
      <div className="absolute inset-0 grid-dot-bg opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-green-growth/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA block */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="glass-card p-10 sm:p-16 text-center mb-20 relative overflow-hidden"
        >
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-green-growth/5 rounded-br-full" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-growth/5 rounded-tl-full" />

          <div className="section-tag mx-auto mb-6">
            <Zap size={11} className="fill-green-growth" />
            Start Free · No Credit Card
          </div>

          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-5">
            Your Financial Independence
            <br />
            <span className="gradient-text">Starts Today.</span>
          </h2>

          <p className="text-white/50 max-w-lg mx-auto text-lg leading-relaxed mb-10">
            Join 50,000+ Indians who've stopped guessing and started growing with AI-powered
            guidance from ET Money Mentor.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="btn-primary px-8 py-4 text-base flex items-center gap-2 shadow-xl shadow-green-growth/20">
              Get My Free FIRE Plan <ArrowRight size={18} />
            </button>
            <button className="btn-ghost px-7 py-4 text-base flex items-center gap-2">
              <HeartPulse size={16} className="text-green-growth" />
              Take the 5-Min Money Health Quiz
            </button>
          </div>

          <p className="mt-6 text-xs text-white/25">
            No jargon. No spam. Just clarity. ✦ Cancel anytime.
          </p>
        </motion.div>

        {/* Footer links row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/[0.05] pt-8"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-green-growth/20 border border-green-growth/30 flex items-center justify-center">
              <Zap size={11} className="text-green-growth fill-green-growth" />
            </div>
            <span className="font-bold text-sm text-white">
              AI<span className="text-green-growth">Money</span>Mentor
            </span>
            <span className="text-white/20 text-xs ml-2">by ET Markets</span>
          </div>

          <div className="flex flex-wrap gap-6 justify-center">
            {['Privacy Policy', 'Terms of Service', 'SEBI Disclosure', 'Contact', 'Blog'].map(link => (
              <a key={link} href="#" className="text-xs text-white/35 hover:text-white/60 transition-colors">
                {link}
              </a>
            ))}
          </div>

          <p className="text-xs text-white/25">© 2026 ET Money Mentor</p>
        </motion.div>

        {/* Disclaimer */}
        <p className="mt-6 text-center text-[11px] text-white/20 leading-relaxed max-w-3xl mx-auto">
          Disclaimer: AI Money Mentor provides educational financial information and should not be construed as
          personalised financial advice. All investments are subject to market risk. Please consult a SEBI-registered
          investment advisor before making investment decisions.
        </p>
      </div>
    </footer>
  )
}
