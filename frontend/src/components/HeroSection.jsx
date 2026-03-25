import { useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { ArrowRight, TrendingUp, Shield, Sparkles } from 'lucide-react'

// Animated counter that smoothly transitions between numbers
function AnimatedCounter({ value, prefix = '₹', suffix = '' }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, v =>
    `${prefix}${Math.round(v).toLocaleString('en-IN')}${suffix}`
  )
  const prevValue = useRef(value)

  useEffect(() => {
    const ctrl = animate(prevValue.current, value, {
      duration: 0.6,
      ease: 'easeOut',
      onUpdate: v => count.set(v),
    })
    prevValue.current = value
    return ctrl.stop
  }, [value]) // eslint-disable-line

  return <motion.span className="tabular-nums">{rounded}</motion.span>
}

// Compute monthly SIP for target corpus
function computeSIP(retireAge, currentAge = 28, monthlyExpense = 50000) {
  const years = retireAge - currentAge
  if (years <= 0) return 0
  const months = years * 12
  const targetCorpus = monthlyExpense * 12 * 25 // 25x annual rule
  const r = 0.12 / 12 // 12% annual return
  const fv = targetCorpus
  // FV of SIP: FV = SIP * [((1+r)^n - 1)/r]
  const factor = (Math.pow(1 + r, months) - 1) / r
  return Math.round(fv / factor)
}

export default function HeroSection() {
  const [retireAge, setRetireAge] = useState(45)
  const sip = computeSIP(retireAge)

  const agentMessages = [
    'Analyzing 442 Small Cap funds for overlap...',
    'Comparing Old vs. New tax regime savings...',
    'Mapping SIP schedule for ₹1Cr FIRE goal...',
    'Detecting hidden fund commissions...',
    'Optimizing couple HRA + NPS allocations...',
  ]
  const [msgIdx, setMsgIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setMsgIdx(i => (i + 1) % agentMessages.length), 2800)
    return () => clearInterval(t)
  }, []) // eslint-disable-line

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 overflow-hidden">
      {/* Dot grid background */}
      <div className="absolute inset-0 grid-dot-bg opacity-40 pointer-events-none" />

      {/* Green glow blob */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-green-growth/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* LEFT: Copy */}
          <div className="space-y-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="section-tag mb-5">
                <Sparkles size={11} />
                Powered by ET Markets Data
              </div>
              <h1 className="text-5xl sm:text-6xl font-extrabold leading-[1.1] tracking-tight">
                Stop Guessing.
                <br />
                <span className="gradient-text">Start Growing.</span>
              </h1>
              <p className="mt-5 text-lg text-white/60 leading-relaxed max-w-lg">
                The AI-powered mentor that turns India's savers into confident investors.
                Get your FIRE path in <span className="text-green-growth font-semibold">60 seconds</span>.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex flex-wrap items-center gap-3"
            >
              <button className="btn-primary flex items-center gap-2 px-6 py-3 text-sm">
                Get My FIRE Plan <ArrowRight size={15} />
              </button>
              <button className="btn-ghost flex items-center gap-2 px-5 py-3 text-sm">
                <Shield size={14} className="text-green-growth" />
                Take Health Quiz
              </button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-1"
            >
              {[
                { icon: Shield, label: 'Bank-grade 256-bit SSL' },
                { icon: TrendingUp, label: 'SEBI RIA compliant' },
                { icon: Sparkles, label: 'Demat-Ready' },
              ].map(b => (
                <div key={b.label} className="flex items-center gap-1.5 text-xs text-white/40 font-medium">
                  <b.icon size={12} className="text-green-growth/60" />
                  {b.label}
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: Interactive FIRE Slider card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full"
          >
            <div className="glass-card p-6 sm:p-8 space-y-6 relative overflow-hidden">
              {/* Card inner glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-green-growth/5 rounded-full blur-2xl pointer-events-none" />

              <div>
                <p className="text-xs font-semibold text-green-growth uppercase tracking-widest mb-1">FIRE Path Calculator</p>
                <h2 className="text-xl font-bold text-white">When do you want to retire?</h2>
              </div>

              {/* Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/50">Target Retirement Age</span>
                  <span className="text-2xl font-extrabold text-white">{retireAge}<span className="text-sm text-white/40 font-normal ml-1">yrs</span></span>
                </div>

                <div className="relative">
                  <input
                    type="range"
                    min={30}
                    max={60}
                    value={retireAge}
                    onChange={e => setRetireAge(Number(e.target.value))}
                    className="w-full h-2 appearance-none cursor-pointer rounded-full outline-none
                               bg-white/[0.08] accent-green-500"
                    style={{
                      background: `linear-gradient(to right, #10B981 ${((retireAge - 30) / 30) * 100}%, rgba(255,255,255,0.08) ${((retireAge - 30) / 30) * 100}%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-white/30 mt-1">
                    <span>30</span><span>60</span>
                  </div>
                </div>
              </div>

              {/* Output */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-4">
                  <p className="text-xs text-white/40 mb-1">Monthly SIP Required</p>
                  <p className="text-xl font-bold text-green-growth">
                    <AnimatedCounter value={sip} />
                  </p>
                </div>
                <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-4">
                  <p className="text-xs text-white/40 mb-1">Investment Window</p>
                  <p className="text-xl font-bold text-white">
                    {retireAge - 28} <span className="text-sm text-white/40 font-normal">years</span>
                  </p>
                </div>
              </div>

              {/* Corpus chip */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-green-growth/10 border border-green-growth/20">
                <span className="text-xs text-white/60">Target Retirement Corpus</span>
                <span className="text-sm font-bold text-green-growth">
                  {(() => {
                    const corpus = 50000 * 12 * 25
                    if (corpus >= 10000000) return `₹${(corpus/10000000).toFixed(1)}Cr`
                    return `₹${(corpus/100000).toFixed(0)}L`
                  })()}
                </span>
              </div>

              {/* AI Agent Feed */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-navy-950/60 border border-white/[0.05]">
                <div className="mt-0.5 w-2 h-2 rounded-full bg-green-growth animate-pulse flex-shrink-0" />
                <div>
                  <p className="text-xs text-white/30 font-mono mb-0.5">AI Agent</p>
                  <motion.p
                    key={msgIdx}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-xs text-white/60 font-mono"
                  >
                    {agentMessages[msgIdx]}
                  </motion.p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
