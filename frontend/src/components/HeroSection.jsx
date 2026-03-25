import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { ArrowRight, TrendingUp, Shield, Zap, Bot, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

// Count-up animation hook
function useCountUp(target, duration = 1.2) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, v => Math.round(v))
  const prevTarget = useRef(target)

  useEffect(() => {
    const ctrl = animate(prevTarget.current, target, {
      duration,
      ease: 'easeOut',
      onUpdate: v => count.set(v),
    })
    prevTarget.current = target
    return ctrl.stop
  }, [target])

  return rounded
}

// Indian number formatter
function fmtIN(n) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(0)}L`
  return `₹${n.toLocaleString('en-IN')}`
}

function computeSIP(retireAge, currentAge = 28, monthlyExpense = 50000, returnRate = 0.12) {
  const years = retireAge - currentAge
  if (years <= 0) return 0
  const months = years * 12
  const corpusNeeded = (monthlyExpense * 12 * 25 * Math.pow(1.06, years))
  const r = returnRate / 12
  const factor = (Math.pow(1 + r, months) - 1) / r
  return Math.round(corpusNeeded / factor)
}

function computeCorpus(retireAge, currentAge = 28, monthlyExpense = 50000) {
  const years = retireAge - currentAge
  return Math.round(monthlyExpense * 12 * 25 * Math.pow(1.06, years))
}

const agentTicker = [
  'Analyzing 442 Small Cap funds for overlap...',
  'Old regime saves you ₹37,200 vs New regime...',
  'Mapping SIP schedule for ₹1Cr FIRE goal...',
  'HDFC Bank appears in 4 of your 5 funds...',
  'Optimizing couple HRA + NPS allocations...',
  'Section 80D deduction of ₹25,000 unused...',
]

export default function HeroSection() {
  const [retireAge, setRetireAge] = useState(45)
  const [msgIdx, setMsgIdx] = useState(0)
  const sip = computeSIP(retireAge)
  const corpus = computeCorpus(retireAge)
  const yearsLeft = retireAge - 28

  const sipCount = useCountUp(sip)
  const corpusCount = useCountUp(corpus)

  useEffect(() => {
    const t = setInterval(() => setMsgIdx(i => (i + 1) % agentTicker.length), 3000)
    return () => clearInterval(t)
  }, [])

  const sliderPct = ((retireAge - 30) / 30) * 100

  return (
    <section className="relative min-h-[100vh] flex flex-col justify-center pt-32 pb-16 overflow-hidden bg-[#02040a]">
      {/* Dramatic Atmosphere Background */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {/* Glow behind text */}
        <div className="absolute top-[-20%] left-[10%] w-[60%] h-[70%] rounded-full bg-blue-600/15 blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[130px] mix-blend-screen" />
        <div className="absolute top-[30%] right-[20%] w-[30%] h-[50%] rounded-[100%] bg-emerald-500/5 blur-[150px] mix-blend-screen" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 flex flex-col items-center">
        
        {/* Massive Centered Typography */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center w-full mb-16 relative"
        >
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ boxShadow: '0 0 10px #60a5fa' }} />
            <span className="text-[10px] font-mono text-blue-100 tracking-[0.2em] uppercase">Wealth Engine 2.0 Alive</span>
          </div>

          <h1 className="font-display text-[4rem] sm:text-7xl lg:text-[7.5rem] font-normal leading-[0.9] tracking-[-0.02em] text-[#fafafa]">
            Your brilliant 
            <span className="block italic mt-1 pb-4 text-transparent bg-clip-text bg-gradient-to-br from-blue-300 via-cyan-200 to-emerald-200 drop-shadow-[0_0_40px_rgba(59,130,246,0.2)]">
               AI CA Friend.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto text-slate-400 font-light tracking-wide">
            Stop paying ₹25,000/year for generic advice. Get a meticulously crafted, algorithmic FIRE plan—designed completely for the <strong className="text-slate-200 font-normal">Indian tax code</strong>.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
            <Link to="/fire-planner" className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-300 bg-blue-600 rounded-full hover:bg-blue-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] overflow-hidden border border-blue-400/50">
              <span className="relative z-10 flex items-center gap-2 text-[15px] tracking-wide">
                Generate My Plan <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 h-full w-full scale-0 rounded-full bg-white/20 transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10" />
            </Link>
            
            <Link to="/health-score" className="inline-flex items-center gap-2 px-8 py-4 font-medium text-slate-300 transition-colors border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 hover:text-white backdrop-blur-md text-[15px]">
              <Shield size={16} className="text-cyan-400" /> Verify Health Score
            </Link>
          </div>
        </motion.div>

        {/* Floating Asymmetric Cards Section */}
        <div className="w-full relative max-w-5xl mx-auto mt-6">
          
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-[70%] mx-auto z-20 relative"
          >
            {/* The Glassy FIRE Card */}
            <div className="p-8 md:p-12 relative overflow-hidden backdrop-blur-[40px] bg-[rgba(15,20,35,0.4)] border border-white/10 rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] transition-transform duration-500 hover:scale-[1.02]">
              <div className="absolute top-[-50%] right-[-50%] w-[100%] h-[100%] bg-gradient-to-bl from-blue-500/10 to-transparent pointer-events-none rounded-full" />
              
              <div className="flex items-start justify-between mb-10 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp size={14} className="text-emerald-400" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400/80">Simulation</span>
                  </div>
                  <h2 className="font-display text-3xl text-white">FIRE Trajectory</h2>
                </div>
                
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Retirement Age</span>
                  <div className="font-display text-[2.5rem] leading-none text-white num mt-2">
                    {retireAge}<span className="text-lg text-slate-500 ml-1">yrs</span>
                  </div>
                </div>
              </div>

              {/* Slider */}
              <div className="space-y-4 mb-12 relative z-10">
                <input
                  type="range"
                  min={30} max={60} value={retireAge}
                  onChange={e => setRetireAge(Number(e.target.value))}
                  className="w-full h-2 appearance-none cursor-pointer rounded-full outline-none"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 ${sliderPct}%, rgba(255,255,255,0.05) ${sliderPct}%)`,
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.8), 0 0 10px rgba(59,130,246,0.2)'
                  }}
                />
                <div className="flex justify-between text-xs font-mono text-slate-500">
                  <span>30</span><span>60</span>
                </div>
              </div>

              {/* Output KPIs with stark contrast */}
              <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="p-6 rounded-2xl bg-[#050810]/60 border border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition-colors duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <p className="text-[10px] font-mono tracking-[0.15em] text-slate-400 uppercase mb-3">Required SIP</p>
                  <p className="font-display text-3xl md:text-5xl text-emerald-400 num relative z-10">
                    <motion.span>{useTransform(sipCount, v => fmtIN(v * (sip > 100000 ? 100 : 1) / (sip > 100000 ? 100 : 1)))}</motion.span>
                  </p>
                  <p className="text-xs text-slate-500 mt-2 relative z-10 font-mono">/ month</p>
                </div>
                
                <div className="p-6 rounded-2xl bg-[#050810]/60 border border-white/5 relative overflow-hidden group hover:border-blue-500/30 transition-colors duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <p className="text-[10px] font-mono tracking-[0.15em] text-slate-400 uppercase mb-3">Target Corpus</p>
                  <p className="font-display text-3xl md:text-5xl text-white num relative z-10">
                    {fmtIN(corpus)}
                  </p>
                  <p className="text-xs text-slate-500 mt-2 relative z-10 font-mono">wealth accumulation</p>
                </div>
              </div>
            </div>
            
            {/* Attached Agent Console - Asymmetrical popup */}
            <motion.div
              initial={{ opacity: 0, x: 30, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8, ease: "easeOut" }}
              className="absolute -bottom-8 -right-4 md:-right-16 z-30 bg-[#06101f]/90 backdrop-blur-2xl border border-cyan-500/30 p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(6,182,212,0.1)] max-w-[300px]"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-400/50 flex items-center justify-center flex-shrink-0 relative">
                  <div className="absolute inset-0 rounded-full border border-cyan-400 animate-ping opacity-20" />
                  <Bot size={18} className="text-cyan-400" />
                </div>
                <div className="overflow-hidden pt-0.5">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-cyan-500/80 font-mono mb-1.5 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" /> Live Agent
                  </p>
                  <motion.p
                    key={msgIdx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="text-[13px] text-cyan-50 font-medium leading-relaxed"
                  >
                    {agentTicker[msgIdx]}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Premium Data Strip - Refined & Minimalist */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 1.2, duration: 1 }}
           className="w-full mt-32 mb-10 pt-10 border-t border-white/5 relative"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-px">
            {[
              { label: 'Indians Unprepared', value: '95%', color: 'var(--color-risk)' },
              { label: 'Traditional Cost', value: '₹25k+', color: '#fff' },
              { label: 'Data Precision', value: '100%', color: 'var(--color-ai)' },
              { label: 'Avg Tax Saved', value: '₹54k/yr', color: 'var(--color-gain)' },
            ].map(({ label, value, color }, i) => (
              <div key={i} className="text-center relative md:px-4">
                <p className="font-display text-[2.5rem] num drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" style={{ color }}>{value}</p>
                <p className="text-[10px] mt-2 text-slate-500 font-mono uppercase tracking-widest">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

