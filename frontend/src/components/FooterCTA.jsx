import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Zap, FileCheck, HeartPulse } from 'lucide-react'

export default function FooterCTA() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <footer className="relative pt-24 pb-12 overflow-hidden">
      <div className="absolute inset-0 grid-dot-bg opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA block */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-navy-900 rounded-2xl p-10 sm:p-16 text-center mb-20 relative overflow-hidden"
        >
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-br-full" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-tl-full" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border border-white/20 bg-white/10 text-white/80 uppercase tracking-wider mx-auto mb-6">
            <Zap size={11} className="fill-white/60" />
            Start Free · No Credit Card
          </div>

          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-5 text-white">
            Your Financial Independence
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/80 via-white to-white/60">Starts Today.</span>
          </h2>

          <p className="text-white/50 max-w-lg mx-auto text-lg leading-relaxed mb-10">
            Join 50,000+ Indians who've stopped guessing and started growing with AI-powered
            guidance from ET Money Mentor.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 rounded-xl bg-white text-navy-900 font-semibold text-base flex items-center gap-2 shadow-xl hover:bg-white/90 active:scale-95 transition-all">
              Get My Free FIRE Plan <ArrowRight size={18} />
            </button>
            <button className="px-7 py-4 rounded-xl border border-white/20 text-white/80 font-medium text-base flex items-center gap-2 hover:border-white/40 hover:text-white transition-all">
              <HeartPulse size={16} className="text-white/60" />
              Take the 5-Min Money Health Quiz
            </button>
          </div>

          <p className="mt-6 text-xs text-white/30">
            No jargon. No spam. Just clarity. ✦ Cancel anytime.
          </p>
        </motion.div>

        {/* Footer links row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-navy-900/[0.08] pt-8"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-navy-900/10 border border-navy-900/20 flex items-center justify-center">
              <Zap size={11} className="text-navy-900" />
            </div>
            <span className="font-bold text-sm text-navy-900">
              AI<span className="text-navy-600">Money</span>Mentor
            </span>
            <span className="text-navy-900/25 text-xs ml-2">by ET Markets</span>
          </div>

          <div className="flex flex-wrap gap-6 justify-center">
            {['Privacy Policy', 'Terms of Service', 'SEBI Disclosure', 'Contact', 'Blog'].map(link => (
              <a key={link} href="#" className="text-xs text-navy-900/35 hover:text-navy-900/60 transition-colors">
                {link}
              </a>
            ))}
          </div>

          <p className="text-xs text-navy-900/30">© 2026 ET Money Mentor</p>
        </motion.div>

        {/* Disclaimer */}
        <p className="mt-6 text-center text-[11px] text-navy-900/25 leading-relaxed max-w-3xl mx-auto">
          Disclaimer: AI Money Mentor provides educational financial information and should not be construed as
          personalised financial advice. All investments are subject to market risk. Please consult a SEBI-registered
          investment advisor before making investment decisions.
        </p>
      </div>
    </footer>
  )
}
