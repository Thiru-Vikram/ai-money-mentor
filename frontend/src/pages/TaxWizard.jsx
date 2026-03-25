import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts'
import PageLayout from '../components/PageLayout'
import { Calculator, TrendingDown, CheckCircle2 } from 'lucide-react'

function fmt(n) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

// ── New Regime FY 2024-25 ──
function calcNewRegime(income) {
  const std = 75000
  const taxable = Math.max(0, income - std)
  let tax = 0
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
  if (taxable <= 700000) tax = 0 // rebate 87A
  const cess = tax * 0.04
  return { tax: Math.round(tax + cess), regime: 'New', taxable, deductions: std }
}

// ── Old Regime FY 2024-25 ──
function calcOldRegime(income, deductions) {
  const std = 50000
  const totalDed = std + deductions
  const taxable = Math.max(0, income - totalDed)
  let tax = 0
  if (taxable <= 250000) tax = 0
  else if (taxable <= 500000) tax = (taxable - 250000) * 0.05
  else if (taxable <= 1000000) tax = 12500 + (taxable - 500000) * 0.20
  else tax = 112500 + (taxable - 1000000) * 0.30
  if (taxable <= 500000) tax = Math.max(0, tax - 12500) // rebate 87A
  const cess = tax * 0.04
  return { tax: Math.round(tax + cess), regime: 'Old', taxable, deductions: totalDed }
}

const SLIDERS = [
  { label: 'Annual Gross Income (CTC)', key: 'income', min: 300000, max: 10000000, step: 100000, prefix: '₹' },
  { label: '80C Investments', key: 'd80c', min: 0, max: 150000, step: 5000, prefix: '₹', desc: 'ELSS, PPF, LIC, EPF, ULIP — max ₹1.5L' },
  { label: '80D Health Insurance', key: 'd80d', min: 0, max: 75000, step: 5000, prefix: '₹', desc: 'Self ₹25K + Parents ₹25K + Senior ₹25K' },
  { label: 'HRA Exemption', key: 'hra', min: 0, max: 300000, step: 5000, prefix: '₹', desc: 'Min of: actual HRA, 50%/40% of basic, rent−10%' },
  { label: 'NPS 80CCD(1B)', key: 'nps', min: 0, max: 50000, step: 5000, prefix: '₹', desc: 'Extra ₹50K over 80C limit — very under-used' },
  { label: 'Home Loan Interest 24(b)', key: 'homeLoan', min: 0, max: 200000, step: 10000, prefix: '₹', desc: 'Up to ₹2L for self-occupied property' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="card px-3 py-2 text-xs" style={{ minWidth: 150 }}>
      <p className="font-semibold mb-1" style={{ color: '#e2e8f0' }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex justify-between gap-4">
          <span style={{ color: p.fill }}>{p.name}</span>
          <span className="font-bold num" style={{ color: p.fill }}>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function TaxWizard() {
  const [v, setV] = useState({
    income: 1200000, d80c: 150000, d80d: 25000, hra: 0, nps: 50000, homeLoan: 0
  })
  const set = (k) => (e) => setV(p => ({ ...p, [k]: Number(e.target.value) }))

  const { income, d80c, d80d, hra, nps, homeLoan } = v
  const totalUserDeductions = d80c + d80d + hra + nps + homeLoan

  const oldResult = useMemo(() => calcOldRegime(income, totalUserDeductions), [income, totalUserDeductions])
  const newResult = useMemo(() => calcNewRegime(income), [income])

  const betterRegime = oldResult.tax <= newResult.tax ? 'Old' : 'New'
  const saving = Math.abs(oldResult.tax - newResult.tax)

  const chartData = [
    { regime: 'Old Regime', tax: oldResult.tax, fill: betterRegime === 'Old' ? 'var(--color-growth)' : 'var(--color-risk)' },
    { regime: 'New Regime', tax: newResult.tax, fill: betterRegime === 'New' ? 'var(--color-growth)' : 'var(--color-risk)' },
  ]

  const missedDeductions = [
    { name: '80C limit', used: d80c, max: 150000, instrument: 'ELSS, PPF, LIC, EPF', section: '80C' },
    { name: 'NPS extra', used: nps, max: 50000, instrument: 'NPS Tier 1', section: '80CCD(1B)' },
    { name: 'Health insurance', used: d80d, max: 25000, instrument: 'Mediclaim premium', section: '80D' },
  ].filter(d => d.used < d.max)

  const monthlySalary = income / 12

  return (
    <PageLayout
      title={<>Tax <em className="text-gradient-amber not-italic">Wizard</em></>}
      subtitle="Compare Old vs New income tax regime with your exact salary. Discover every rupee of deduction you're silently missing this year."
      sourceLabel="Based on FY 2024-25 tax slabs · Includes standard deduction ₹75K (new) / ₹50K (old) · Section 87A rebate applied"
    >
      {/* ── HEADLINE INSIGHT (live) ── */}
      <motion.div
        key={`${betterRegime}-${saving}`}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        className="headline-insight mb-7 flex items-start gap-3"
      >
        <TrendingDown size={16} style={{ color: 'var(--color-gain)', flexShrink: 0, marginTop: 2 }} />
        <p className="text-sm" style={{ color: 'var(--color-label)' }}>
          The <strong style={{ color: '#fff' }}>{betterRegime} Regime</strong> saves you{' '}
          <strong className="num" style={{ color: 'var(--color-gain)' }}>{fmt(saving)}/year</strong>
          {' '}({fmt(saving / 12)}/month take-home increase).
          {missedDeductions.length > 0 && (
            <span style={{ color: 'var(--color-risk)' }}>
              {' '}⚠️ You're missing {fmt(missedDeductions.reduce((s, d) => s + (d.max - d.used), 0))} in unused deductions.
            </span>
          )}
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ── LEFT: INPUTS ── */}
        <div className="card p-7 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Calculator size={14} style={{ color: 'var(--color-gain)' }} />
            <p className="text-xs font-semibold" style={{ color: 'var(--color-label)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Your Salary Details
            </p>
          </div>

          {SLIDERS.map(({ label, key, min, max, step, desc }) => {
            const val = v[key]
            const pct = ((val - min) / (max - min)) * 100
            return (
              <div key={key} className="space-y-1.5">
                <div className="flex justify-between">
                  <div>
                    <label className="text-xs" style={{ color: 'var(--color-label)' }}>{label}</label>
                    {desc && <p className="text-xs" style={{ color: 'var(--color-muted)' }}>{desc}</p>}
                  </div>
                  <span className="text-xs font-bold num" style={{ color: key === 'income' ? 'var(--color-gain)' : '#e2e8f0', flexShrink: 0, marginLeft: 8 }}>
                    {fmt(val)}
                  </span>
                </div>
                <input
                  type="range" min={min} max={max} step={step} value={val}
                  onChange={set(key)}
                  className="w-full h-1.5 appearance-none cursor-pointer rounded-full outline-none"
                  style={{ background: `linear-gradient(to right, var(--color-gain) ${pct}%, rgba(148,163,184,0.12) ${pct}%)` }}
                />
              </div>
            )
          })}

          <div className="rounded-xl p-3 flex justify-between items-center"
            style={{ background: 'var(--bg-900)', border: '1px solid var(--border-subtle)' }}>
            <span className="text-xs" style={{ color: 'var(--color-muted)' }}>Total deductions claimed</span>
            <span className="text-sm font-bold num" style={{ color: 'var(--color-trust)' }}>{fmt(totalUserDeductions)}</span>
          </div>
        </div>

        {/* ── RIGHT: LIVE RESULTS ── */}
        <div className="space-y-5">
          {/* Regime comparison cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { regime: 'Old Regime', result: oldResult, better: betterRegime === 'Old' },
              { regime: 'New Regime', result: newResult, better: betterRegime === 'New' },
            ].map(({ regime, result, better }) => (
              <motion.div
                key={regime}
                animate={{ borderColor: better ? 'rgba(16,185,129,0.4)' : 'var(--border-subtle)' }}
                className="card p-5 relative"
                style={{ background: better ? 'rgba(16,185,129,0.04)' : 'var(--bg-card)' }}
              >
                {better && (
                  <div className="absolute top-3 right-3">
                    <span className="tag-green text-[9px]"><CheckCircle2 size={8} /> Optimal</span>
                  </div>
                )}
                <p className="text-xs mb-3" style={{ color: 'var(--color-muted)' }}>{regime}</p>
                <p className="metric-value font-display text-2xl num" style={{ color: better ? 'var(--color-growth)' : '#94a3b8' }}>
                  {fmt(result.tax)}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>Annual tax + cess</p>
                <div className="mt-4 pt-3 space-y-1.5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <div className="data-row">
                    <span className="data-label">Taxable income</span>
                    <span className="data-value num">{fmt(result.taxable)}</span>
                  </div>
                  <div className="data-row">
                    <span className="data-label">Deductions</span>
                    <span className="data-value num">{fmt(result.deductions)}</span>
                  </div>
                  <div className="data-row">
                    <span className="data-label">Effective rate</span>
                    <span className="data-value num">{income > 0 ? ((result.tax / income) * 100).toFixed(1) : 0}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bar chart */}
          <div className="card p-5">
            <p className="text-xs font-semibold mb-4" style={{ color: 'var(--color-label)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Tax Comparison
            </p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData} margin={{ left: 0, right: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" vertical={false} />
                <XAxis dataKey="regime" tick={{ fill: 'var(--color-label)', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={v => fmt(v)} tick={{ fill: 'var(--color-muted)', fontSize: 9 }} tickLine={false} axisLine={false} width={50} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="tax" name="Tax payable" radius={[6, 6, 0, 0]} maxBarSize={80}>
                  {chartData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Missed deductions */}
          {missedDeductions.length > 0 && (
            <div className="card-ai p-5">
              <p className="text-xs font-bold mb-3 flex items-center gap-1.5" style={{ color: 'var(--color-ai)' }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--color-ai)' }} />
                AI: Missed Deduction Opportunities
              </p>
              <div className="space-y-3">
                {missedDeductions.map(d => (
                  <div key={d.name} className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold" style={{ color: '#e2e8f0' }}>Section {d.section} · {d.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>{d.instrument}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold num" style={{ color: 'var(--color-risk)' }}>-{fmt(d.max - d.used)}</p>
                      <p className="text-xs" style={{ color: 'var(--color-muted)' }}>unused</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="source-label mt-6">
        FY2024-25 slabs · Section 87A rebate applied · 4% health &amp; education cess included · Consult a CA for precise tax computation
      </p>
    </PageLayout>
  )
}
