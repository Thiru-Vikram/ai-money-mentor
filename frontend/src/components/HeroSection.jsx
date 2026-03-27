import { useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { ArrowRight, TrendingUp, Shield, Sparkles } from 'lucide-react'

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

function computeSIP(retireAge, currentAge = 28, monthlyExpense = 50000) {
  const years = retireAge - currentAge
  if (years <= 0) return 0
  const months = years * 12
  const targetCorpus = monthlyExpense * 12 * 25
  const r = 0.12 / 12
  const fv = targetCorpus
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
              <h1 className="text-5xl sm:text-6xl font-extrabold leading-[1.1] tracking-tight text-navy-900">
                Stop Guessing.
                <br />
                <span className="gradient-text">Start Growing.</span>
              </h1>
              <p className="mt-5 text-lg text-navy-900/55 leading-relaxed max-w-lg">
                The AI-powered mentor that turns India's savers into confident investors.
                Get your FIRE path in <span className="text-navy-900 font-semibold">60 seconds</span>.
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
                <Shield size={14} className="text-navy-900/60" />
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
                <div key={b.label} className="flex items-center gap-1.5 text-xs text-navy-900/40 font-medium">
                  <b.icon size={12} className="text-navy-900/30" />
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
              <div>
                <p className="text-xs font-semibold text-navy-900/50 uppercase tracking-widest mb-1">FIRE Path Calculator</p>
                <h2 className="text-xl font-bold text-navy-900">When do you want to retire?</h2>
              </div>

              {/* Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-navy-900/50">Target Retirement Age</span>
                  <span className="text-2xl font-extrabold text-navy-900">{retireAge}<span className="text-sm text-navy-900/40 font-normal ml-1">yrs</span></span>
                </div>

                <div className="relative">
                  <input
                    type="range"
                    min={30}
                    max={60}
                    value={retireAge}
                    onChange={e => setRetireAge(Number(e.target.value))}
                    className="w-full h-2 appearance-none cursor-pointer rounded-full outline-none"
                    style={{
                      background: `linear-gradient(to right, #0A192F ${((retireAge - 30) / 30) * 100}%, rgba(10,25,47,0.1) ${((retireAge - 30) / 30) * 100}%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-navy-900/30 mt-1">
                    <span>30</span><span>60</span>
                  </div>
                </div>
              </div>

              {/* Output */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-navy-900/[0.03] border border-navy-900/[0.06] p-4">
                  <p className="text-xs text-navy-900/40 mb-1">Monthly SIP Required</p>
                  <p className="text-xl font-bold text-navy-900">
                    <AnimatedCounter value={sip} />
                  </p>
                </div>
                <div className="rounded-xl bg-navy-900/[0.03] border border-navy-900/[0.06] p-4">
                  <p className="text-xs text-navy-900/40 mb-1">Investment Window</p>
                  <p className="text-xl font-bold text-navy-900">
                    {retireAge - 28} <span className="text-sm text-navy-900/40 font-normal">years</span>
                  </p>
                </div>
              </div>

              {/* Corpus chip */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-navy-900/[0.04] border border-navy-900/[0.08]">
                <span className="text-xs text-navy-900/55">Target Retirement Corpus</span>
                <span className="text-sm font-bold text-navy-900">
                  {(() => {
                    const corpus = 50000 * 12 * 25
                    if (corpus >= 10000000) return `₹${(corpus/10000000).toFixed(1)}Cr`
                    return `₹${(corpus/100000).toFixed(0)}L`
                  })()}
                </span>
              </div>

              {/* AI Agent Feed */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-navy-900/[0.03] border border-navy-900/[0.06]">
                <div className="mt-0.5 w-2 h-2 rounded-full bg-navy-900 animate-pulse flex-shrink-0" />
                <div>
                  <p className="text-xs text-navy-900/35 font-mono mb-0.5">AI Agent</p>
                  <motion.p
                    key={msgIdx}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-xs text-navy-900/55 font-mono"
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
