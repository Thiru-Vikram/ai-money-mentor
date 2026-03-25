import { useState, useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import PageLayout from '../components/PageLayout'
import { Flame, Info, TrendingUp } from 'lucide-react'

// Indian number formatter
function fmt(n) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

const SLIDER_STYLE = (pct) => ({
  background: `linear-gradient(to right, #f59e0b ${pct}%, rgba(148,163,184,0.12) ${pct}%)`
})

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="card px-3 py-2 text-xs" style={{ minWidth: 130 }}>
        <p className="font-semibold mb-1" style={{ color: '#e2e8f0' }}>Age {label}</p>
        {payload.map(p => (
          <div key={p.name} className="flex justify-between gap-4">
            <span style={{ color: p.stroke || p.fill }}>{p.name}</span>
            <span className="font-bold num" style={{ color: p.stroke || p.fill }}>{fmt(p.value)}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function FIREPlanner() {
  const [inputs, setInputs] = useState({
    expenses: 50000,
    currentAge: 20,
    retireAge: 40,
    inflationRate: 10,
    returnRate: 12,
    coastAge: 22,
    savings: 0,
    sipStepUp: 10
  })

  // Ensure coastAge doesn't exceed retireAge or fall below currentAge
  const handleInput = (k) => (e) => {
    let val = Number(e.target.value)
    if (k === 'currentAge' && val > inputs.coastAge) {
      setInputs(p => ({ ...p, currentAge: val, coastAge: val }))
    } else if (k === 'retireAge' && val < inputs.coastAge) {
      setInputs(p => ({ ...p, retireAge: val, coastAge: val }))
    } else {
      setInputs(p => ({ ...p, [k]: val }))
    }
  }

  const results = useMemo(() => {
    const { currentAge, retireAge, coastAge, expenses, inflationRate, returnRate, savings, sipStepUp } = inputs
    const yearsToRetire = Math.max(0, retireAge - currentAge)
    const yearsToCoast = Math.max(0, retireAge - coastAge)

    const expenseToday = expenses * 12
    const expenseAtRetirement = expenseToday * Math.pow(1 + inflationRate / 100, yearsToRetire)

    const leanFire = expenseAtRetirement * 15
    const fire = expenseAtRetirement * 25
    const fatFire = expenseAtRetirement * 50

    // Present value of Standard FIRE target, discounted from Retire Age back to Coast Age
    const coastFire = fire / Math.pow(1 + returnRate / 100, yearsToCoast)

    // SIP Calculation
    const monthlyReturn = returnRate / 100 / 12
    const futureValueExisting = savings * Math.pow(1 + returnRate / 100, yearsToRetire)
    const corpusFromSIP = fire - futureValueExisting

    let fvFactor = 0
    if (yearsToRetire > 0 && monthlyReturn > 0) {
      const stepUpRate = (sipStepUp || 0) / 100
      for (let i = 1; i <= yearsToRetire; i++) {
        const sipForYear = Math.pow(1 + stepUpRate, i - 1)
        const fvEndOfYear = sipForYear * ((Math.pow(1 + monthlyReturn, 12) - 1) / monthlyReturn)
        const compoundForRest = Math.pow(1 + monthlyReturn, (yearsToRetire - i) * 12)
        fvFactor += fvEndOfYear * compoundForRest
      }
    }
    const monthlySIP = (corpusFromSIP > 0 && fvFactor > 0) ? corpusFromSIP / fvFactor : 0

    // Growth projection
    const projData = []
    let currentCorpus = savings
    let currentMonthlySip = monthlySIP

    for (let yr = 0; yr <= yearsToRetire; yr++) {
      const age = currentAge + yr
      
      if (yr === 0) {
        projData.push({ age, corpus: Math.round(currentCorpus), target: Math.round(fire) })
      } else {
        currentCorpus = currentCorpus * Math.pow(1 + monthlyReturn, 12)
        if (currentMonthlySip > 0) {
          const fvSipForYear = currentMonthlySip * ((Math.pow(1 + monthlyReturn, 12) - 1) / monthlyReturn)
          currentCorpus += fvSipForYear
        }
        projData.push({
          age,
          corpus: Math.round(currentCorpus),
          target: Math.round(fire),
        })
        currentMonthlySip *= (1 + (sipStepUp || 0) / 100)
      }
    }

    return { expenseToday, expenseAtRetirement, leanFire, fire, fatFire, coastFire, monthlySIP, projData }
  }, [inputs])

  const SLIDERS = [
    { label: 'Monthly Expense', key: 'expenses', min: 10000, max: 300000, step: 5000, fmt: true },
    { label: 'Current Savings', key: 'savings', min: 0, max: 20000000, step: 50000, fmt: true },
    { label: 'Current Age', key: 'currentAge', min: 18, max: 55, suffix: 'yrs' },
    { label: 'Retirement Age', key: 'retireAge', min: 30, max: 70, suffix: 'yrs' },
    { label: 'Expected Return (CAGR)', key: 'returnRate', min: 8, max: 18, step: 0.5, suffix: '%' },
    { label: 'Assumed Inflation Rate', key: 'inflationRate', min: 4, max: 15, step: 0.5, suffix: '%' },
    { label: 'Annual SIP Step-up', key: 'sipStepUp', min: 0, max: 25, suffix: '%' },
    { label: 'Desired Coast FIRE Age', key: 'coastAge', min: inputs.currentAge, max: inputs.retireAge, suffix: 'yrs' },
  ]

  const CARDS = [
    {
      label: 'Expense Today',
      value: fmt(results.expenseToday),
      color: 'var(--color-label)',
      desc: 'What it currently costs to fund your lifestyle for one full year.'
    },
    {
      label: `Expense at Age ${inputs.retireAge}`,
      value: fmt(results.expenseAtRetirement),
      color: 'var(--color-risk)',
      desc: 'Your estimated annual living cost when you retire, adjusted for inflation. It will cost more to live the exact same life.'
    },
    {
      label: 'Lean FIRE (15x)',
      value: fmt(results.leanFire),
      color: 'var(--color-trust)',
      desc: 'The absolute bare minimum. Enough to survive and cover essential bills, but you may still need to work casually to fund luxuries.'
    },
    {
      label: 'Standard FIRE (25x)',
      value: fmt(results.fire),
      color: 'var(--color-gain)',
      desc: 'The classic 4% rule. You can comfortably maintain your current lifestyle indefinitely without ever working again.'
    },
    {
      label: 'FAT FIRE (50x)',
      value: fmt(results.fatFire),
      color: 'var(--color-growth)',
      desc: 'Pure luxury. Complete financial abundance allowing you to travel, buy expensive things, and live lavishly without worrying about a budget.'
    },
    {
      label: `Coast FIRE Number (by Age ${inputs.coastAge})`,
      value: fmt(results.coastFire),
      color: 'var(--color-label)',
      desc: `If you reach this corpus by age ${inputs.coastAge}, compound interest will do the rest of the work. You can stop investing entirely and just let the money grow until retirement!`
    }
  ]

  return (
    <PageLayout
      title={<>Your FIRE Path <em className="text-gradient-amber not-italic">Planner</em></>}
      subtitle="A simple, extremely intuitive calculator to understand exactly what your magic numbers are and what they mean."
    >
      <div className="grid lg:grid-cols-5 gap-6 mt-8">
        
        {/* ── INPUTS ── */}
        <div className="lg:col-span-2 card p-6 space-y-6 self-start sticky top-6">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={14} style={{ color: 'var(--color-gain)' }} />
            <p className="text-xs font-semibold" style={{ color: 'var(--color-label)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Your Numbers
            </p>
          </div>
          
          {SLIDERS.map(({ label, key, min, max, step = 1, suffix, fmt: doFmt }) => {
            const val = inputs[key]
            const pct = ((val - min) / ((max || 100) - min)) * 100
            return (
              <div key={key} className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs" style={{ color: 'var(--color-label)' }}>{label}</label>
                  <span className="text-xs font-semibold num" style={{ color: '#e2e8f0' }}>
                    {doFmt ? fmt(val) : `${val}${suffix || ''}`}
                  </span>
                </div>
                <input
                  type="range" min={min} max={max} step={step} value={val}
                  onChange={handleInput(key)}
                  className="w-full h-1.5 appearance-none cursor-pointer rounded-full outline-none"
                  style={SLIDER_STYLE(Math.min(pct, 100))}
                />
              </div>
            )
          })}
        </div>

        {/* ── OUTPUTS ── */}
        <div className="lg:col-span-3">
          
          {/* Bento Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {CARDS.map(({ label, value, color, desc }) => (
              <div key={label} className="card p-5 hover:bg-white/[0.03] transition-colors border border-white/[0.05]">
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--color-label)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {label}
                </p>
                <p className="font-display text-3xl num mb-3" style={{ color }}>
                  {value}
                </p>
                <div className="flex items-start gap-2">
                  <Info size={14} style={{ color: 'var(--color-muted)', flexShrink: 0, marginTop: 2 }} />
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="card p-5 mt-4 bg-amber-500/10 border border-amber-500/20">
             <p className="text-sm" style={{ color: 'var(--color-label)' }}>
               <strong>💡 Pro Tip:</strong> Your Coast FIRE number tells you exactly when you've "won the game." Once you hit <strong>{fmt(results.coastFire)}</strong> at age <strong>{inputs.coastAge}</strong>, you no longer need to save a single rupee for retirement. Compound interest will take it to {fmt(results.fire)} by age {inputs.retireAge} automatically!
             </p>
          </div>

          {/* Action Plan & Projection Chart */}
          <div className="card p-6 mt-6">
            <div className="flex flex-col sm:flex-row gap-6 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={16} style={{ color: 'var(--color-gain)' }} />
                  <p className="text-xs font-semibold" style={{ color: 'var(--color-label)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    The Action Plan
                  </p>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                  To hit your Standard FIRE target of <strong style={{color: '#fff'}}>{fmt(results.fire)}</strong>, you need to invest:
                </p>
                <p className="font-display text-4xl num mt-2" style={{ color: 'var(--color-gain)' }}>
                  {fmt(results.monthlySIP)}
                  <span className="text-lg font-sans" style={{ color: 'var(--color-muted)' }}> / month</span>
                </p>
                {inputs.sipStepUp > 0 && (
                  <p className="text-xs mt-1" style={{ color: 'var(--color-label)' }}>
                    increasing your monthly sip by <strong className="num">{inputs.sipStepUp}%</strong> every year.
                  </p>
                )}
              </div>
            </div>

            <p className="text-xs text-center mb-4" style={{ color: 'var(--color-muted)' }}>Your Corpus vs Target Projection</p>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={results.projData} margin={{ left: 0, right: 20, top: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="corpusGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-trust)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--color-trust)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-gain)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="var(--color-gain)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                <XAxis dataKey="age" tick={{ fill: 'var(--color-muted)', fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={v => fmt(v)} tick={{ fill: 'var(--color-muted)', fontSize: 9 }} tickLine={false} axisLine={false} width={55} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="corpus" name="Your Corpus" stroke="var(--color-trust)" fill="url(#corpusGrad)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="target" name="Target" stroke="var(--color-gain)" fill="url(#targetGrad)" strokeWidth={1.5} strokeDasharray="6 3" dot={false} />
                <ReferenceLine x={inputs.retireAge} stroke="rgba(239,68,68,0.4)" strokeDasharray="4 2" label={{ value: 'FIRE', fill: 'var(--color-risk)', fontSize: 10 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </PageLayout>
  )
}
