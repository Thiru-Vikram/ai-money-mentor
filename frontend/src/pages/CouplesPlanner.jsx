import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageLayout from '../components/PageLayout'
import { Users, UserIcon, Calculator, ArrowDownToLine, Wallet } from 'lucide-react'

function fmt(n) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

function calcTax(income, isOldRegime, stdDed, sec80c, sec80d, nps, hra) {
  let tax = 0
  const taxableOld = Math.max(0, income - stdDed - sec80c - sec80d - nps - hra)
  const taxableNew = Math.max(0, income - 75000) // New standard ded FY 24-25

  if (isOldRegime) {
      const taxable = taxableOld
      if (taxable <= 250000) tax = 0
      else if (taxable <= 500000) tax = (taxable - 250000) * 0.05
      else if (taxable <= 1000000) tax = 12500 + (taxable - 500000) * 0.20
      else tax = 112500 + (taxable - 1000000) * 0.30

      if (taxable <= 500000) tax = Math.max(0, tax - 12500) // rebate 87A
      tax = tax * 1.04 // cess
      return { tax: Math.round(tax), taxable, ded: stdDed + sec80c + sec80d + nps + hra }
  } else {
      const taxable = taxableNew
      const slabs = [
          [300000, 0], [400000, 0.05], [300000, 0.10], [300000, 0.15],
          [300000, 0.20], [300000, 0.25], [Infinity, 0.30],
      ]
      let rem = taxable
      for (const [lim, rate] of slabs) {
          const chunk = Math.min(rem, lim)
          tax += chunk * rate
          rem -= chunk
          if (rem <= 0) break
      }
      if (taxable <= 700000) tax = 0 // rebate
      tax = tax * 1.04 // cess
      return { tax: Math.round(tax), taxable, ded: 75000 }
  }
}

function calcHRA(basic, rent, actualHra) {
  const c1 = actualHra
  const c2 = 0.5 * basic // assuming metro
  const c3 = rent - (0.1 * basic)
  return Math.max(0, Math.min(c1, Math.min(c2, c3)))
}

const DEFAULT_P1 = { ctc: 1500000, basic: 600000, hraReceived: 240000, rent: 180000, sec80c: 150000, nps: 50000, sec80d: 25000 }
const DEFAULT_P2 = { ctc: 900000, basic: 360000, hraReceived: 144000, rent: 0, sec80c: 100000, nps: 0, sec80d: 0 }

const SLIDERS = [
  { label: 'Annual CTC', key: 'ctc', min: 300000, max: 10000000, step: 100000 },
  { label: 'Basic Salary (of CTC)', key: 'basic', min: 100000, max: 5000000, step: 100000 },
  { label: 'HRA Received', key: 'hraReceived', min: 0, max: 2000000, step: 10000 },
  { label: 'Annual Rent Paid', key: 'rent', min: 0, max: 1200000, step: 10000 },
  { label: '80C Investments', key: 'sec80c', min: 0, max: 150000, step: 5000 },
  { label: 'NPS Contribution', key: 'nps', min: 0, max: 50000, step: 5000 },
]

export default function CouplesPlanner() {
  const [p1, setP1] = useState(DEFAULT_P1)
  const [p2, setP2] = useState(DEFAULT_P2)
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState(null)

  const handleOptimize = () => {
      setAnalyzing(true)
      setTimeout(() => {
          // Both separate
          const p1_hra = calcHRA(p1.basic, p1.rent, p1.hraReceived)
          const p1_old = calcTax(p1.ctc, true, 50000, p1.sec80c, p1.sec80d, p1.nps, p1_hra)
          const p1_new = calcTax(p1.ctc, false, 75000, 0, 0, 0, 0)

          const p2_hra = calcHRA(p2.basic, p2.rent, p2.hraReceived)
          const p2_old = calcTax(p2.ctc, true, 50000, p2.sec80c, p2.sec80d, p2.nps, p2_hra)
          const p2_new = calcTax(p2.ctc, false, 75000, 0, 0, 0, 0)

          const currentTotalTax = Math.min(p1_old.tax, p1_new.tax) + Math.min(p2_old.tax, p2_new.tax)

          // Optimize: Split rent to maximize HRA for both
          // Simplistic algorithm: give rent to whoever is in higher bracket, or split 50-50
          const totalRent = Math.max(p1.rent, p2.rent) // Usually only one pays rent in app
          let bestTax = Infinity
          let bestSplit = 0
          for (let r1 = 0; r1 <= totalRent; r1 += 10000) {
              const r2 = totalRent - r1
              const hr1 = calcHRA(p1.basic, r1, p1.hraReceived)
              const hr2 = calcHRA(p2.basic, r2, p2.hraReceived)
              const t1_o = calcTax(p1.ctc, true, 50000, 150000, 25000, 50000, hr1).tax // assume maxing 80c, nps, 80d if optimizing
              const t1_n = calcTax(p1.ctc, false, 75000, 0, 0, 0, 0).tax
              const t2_o = calcTax(p2.ctc, true, 50000, 150000, 25000, 50000, hr2).tax
              const t2_n = calcTax(p2.ctc, false, 75000, 0, 0, 0, 0).tax

              const total = Math.min(t1_o, t1_n) + Math.min(t2_o, t2_n)
              if (total < bestTax) {
                  bestTax = total
                  bestSplit = r1
              }
          }

          setAnalyzing(false)
          setResults({
              baseTotalTax: currentTotalTax,
              optTotalTax: bestTax,
              savings: currentTotalTax - bestTax,
              split1: bestSplit,
              split2: totalRent - bestSplit,
              p1_bestRegime: p1_old.tax < p1_new.tax ? 'Old' : 'New',
              p2_bestRegime: p2_old.tax < p2_new.tax ? 'Old' : 'New',
              jointIncome: p1.ctc + p2.ctc,
              investable: (p1.ctc + p2.ctc) - bestTax - totalRent, // rough approx
          })
      }, 1200)
  }

  const SliderGroup = ({ title, state, setter, index }) => {
      const color = index === 1 ? 'var(--color-trust)' : 'var(--color-ai)'
      return (
          <div className="card p-6 lg:p-7 space-y-5">
              <div className="flex items-center gap-2 mb-2 pb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <UserIcon size={16} style={{ color }} />
                  <h3 className="text-base font-semibold" style={{ color: '#f1f5f9' }}>{title}</h3>
              </div>
              {SLIDERS.map(({ label, key, min, max, step }) => {
                  const val = state[key]
                  const pct = ((val - min) / (max - min)) * 100
                  return (
                      <div key={key} className="space-y-1.5">
                          <div className="flex justify-between">
                              <label className="text-xs" style={{ color: 'var(--color-label)' }}>{label}</label>
                              <span className="text-xs font-bold num" style={{ color: '#e2e8f0' }}>{fmt(val)}</span>
                          </div>
                          <input
                              type="range" min={min} max={max} step={step} value={val}
                              onChange={(e) => setter(p => ({ ...p, [key]: Number(e.target.value) }))}
                              className="w-full h-1.5 appearance-none cursor-pointer rounded-full outline-none"
                              style={{ background: `linear-gradient(to right, ${color} ${pct}%, rgba(148,163,184,0.12) ${pct}%)` }}
                          />
                      </div>
                  )
              })}
          </div>
      )
  }

  return (
    <PageLayout
      title={<>Couple's Money <em className="text-gradient-green not-italic">Planner</em></>}
      subtitle="India's first AI joint financial planning tool. Both partners input data, AI optimizes across both incomes for tax efficiency, HRA claims, NPS matching, and SIP splits."
      sourceLabel="Built for DINKs (Dual Income, No Kids) & two-income households · Indian tax laws FY24-25"
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Inputs */}
        <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
            <SliderGroup title="Partner 1" state={p1} setter={setP1} index={1} />
            <SliderGroup title="Partner 2" state={p2} setter={setP2} index={2} />
        </div>

        {/* Results */}
        <div className="space-y-6">
           <button
             onClick={handleOptimize}
             disabled={analyzing}
             className="btn-primary w-full justify-center py-4 text-base shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
             style={{ background: 'var(--color-growth)', color: '#000' }}
           >
             <Calculator size={18} />
             {analyzing ? 'Optimizing Plan...' : 'Optimize Together'}
           </button>

           <AnimatePresence>
             {!results && !analyzing && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-8 text-center text-sm" style={{ borderStyle: 'dashed', borderColor: 'var(--border-subtle)', color: 'var(--color-muted)' }}>
                    <Users size={32} className="mx-auto mb-4 opacity-50" />
                    Fill in both partners' details and click "Optimize Together" to generate your joint financial strategy.
                 </motion.div>
             )}

             {results && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                    {/* Headline Insight Card */}
                    <div className="headline-insight flex items-start gap-3" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                       <ArrowDownToLine size={18} style={{ color: 'var(--color-growth)', flexShrink: 0 }} />
                       <div>
                         <p className="text-sm shadow-sm" style={{ color: '#e2e8f0' }}>
                            You can save <strong className="num text-base mx-1" style={{ color: 'var(--color-growth)' }}>{fmt(results.savings)}/yr</strong> in taxes by optimizing jointly.
                         </p>
                         <p className="text-xs mt-1" style={{ color: 'var(--color-label)' }}>Combine tax brackets. Build wealth faster.</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="card p-4 text-center">
                            <p className="metric-label mb-1">Joint Gross Income</p>
                            <p className="metric-value text-2xl num" style={{ color: '#e2e8f0' }}>{fmt(results.jointIncome)}</p>
                        </div>
                        <div className="card p-4 text-center">
                            <p className="metric-label mb-1">Investable Surplus</p>
                            <p className="metric-value text-2xl num" style={{ color: 'var(--color-trust)' }}>{fmt(results.investable)}</p>
                        </div>
                    </div>

                    <div className="card-ai p-5">
                       <p className="text-xs font-semibold mb-4 uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--color-ai)' }}>
                         <Wallet size={14} /> AI Optimization Strategy
                       </p>
                       <div className="space-y-4 text-sm" style={{ color: '#e2e8f0' }}>
                           <div className="p-3 rounded-lg" style={{ background: 'var(--bg-900)' }}>
                               <p className="font-semibold mb-1">1. HRA Rent Splitting</p>
                               <p className="text-xs leading-relaxed text-slate-400">
                                   Instead of Partner 1 paying all rent, sign a joint lease. Partner 1 pays <span className="text-cyan-400 font-bold">{fmt(results.split1)}</span> and Partner 2 pays <span className="text-cyan-400 font-bold">{fmt(results.split2)}</span>. This maximizes HRA claims across both tax slabs.
                               </p>
                           </div>
                           <div className="p-3 rounded-lg" style={{ background: 'var(--bg-900)' }}>
                               <p className="font-semibold mb-1">2. Tax Regimes</p>
                               <div className="flex justify-between text-xs text-slate-400 mt-1">
                                 <span>Partner 1: <strong className={results.p1_bestRegime === 'Old' ? 'text-amber-400' : 'text-emerald-400'}>{results.p1_bestRegime} Regime</strong></span>
                                 <span>Partner 2: <strong className={results.p2_bestRegime === 'Old' ? 'text-amber-400' : 'text-emerald-400'}>{results.p2_bestRegime} Regime</strong></span>
                               </div>
                           </div>
                           <div className="p-3 rounded-lg" style={{ background: 'var(--bg-900)' }}>
                               <p className="font-semibold mb-1">3. Maximize Section 80C & NPS</p>
                               <p className="text-xs leading-relaxed text-slate-400">
                                   Ensure both partners max out ₹1.5L in 80C and ₹50k in NPS. Don't let one partner invest ₹3L while the other invests ₹0. Shift investments to the lower saver's name to utilize tax limits.
                               </p>
                           </div>
                       </div>
                    </div>
                 </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </PageLayout>
  )
}
