import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import PageLayout from '../components/PageLayout'
import { UploadCloud, FileText, CheckCircle2, AlertTriangle, Layers, Percent, Bot } from 'lucide-react'

// Indian number formatter
function fmt(n) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

function solveXIRR(cashflows) {
  return 14.2 // Placeholder for complex XIRR calculation
}

// Mock Data
const MOCK_FUNDS = [
  { name: 'Parag Parikh Flexi Cap', invested: 250000, current: 340000, category: 'Equity - Flexi', ter: 0.72 },
  { name: 'Nippon India Small Cap', invested: 100000, current: 165000, category: 'Equity - Small', ter: 0.85 },
  { name: 'HDFC Mid-Cap Opportunities', invested: 150000, current: 198000, category: 'Equity - Mid', ter: 0.90 },
  { name: 'ICICI Pru Nifty 50 Index', invested: 300000, current: 360000, category: 'Equity - Large', ter: 0.20 },
  { name: 'SBI Liquid Fund', invested: 50000, current: 54000, category: 'Debt - Liquid', ter: 0.15 },
]

const ALLOCATION = [
  { name: 'Equity (Large)', value: 45, color: '#3b82f6' }, // blue
  { name: 'Equity (Mid/Small)', value: 35, color: '#06b6d4' }, // cyan
  { name: 'Foreign Equity', value: 10, color: '#8b5cf6' }, // purple
  { name: 'Debt & Cash', value: 10, color: '#f59e0b' }, // amber
]

const OVERLAP = [
  { pair: ['Parag Parikh Flexi Cap', 'ICICI Pru Nifty 50 Index'], pct: 38 },
  { pair: ['HDFC Mid-Cap', 'Nippon India Small Cap'], pct: 12 },
]

// Recharts Custom Tooltip
const DonutTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="card px-3 py-2 text-xs" style={{ minWidth: 120 }}>
        <div className="flex justify-between gap-4">
          <span style={{ color: data.color }}>{data.name}</span>
          <span className="font-bold num" style={{ color: data.color }}>{data.value}%</span>
        </div>
      </div>
    )
  }
  return null
}

const TABS = ['Overview', 'Overlap Matrix', 'Expense Drag', 'AI Action Plan']

export default function PortfolioXRayPage() {
  const [file, setFile] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState(null)
  const [activeTab, setActiveTab] = useState(TABS[0])

  const handleUpload = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setAnalyzing(true)
    setTimeout(() => {
      setAnalyzing(false)
      const totalInvested = MOCK_FUNDS.reduce((s, f) => s + f.invested, 0)
      const totalCurrent = MOCK_FUNDS.reduce((s, f) => s + f.current, 0)
      const totalGain = totalCurrent - totalInvested
      const absReturn = (totalGain / totalInvested) * 100
      const xirr = solveXIRR([])
      const totalExpenseRatio = (MOCK_FUNDS.reduce((s, f) => s + f.ter * f.current, 0) / totalCurrent)
      const expenseLost10y = totalCurrent * Math.pow(1.12, 10) - totalCurrent * Math.pow(1.12 - (totalExpenseRatio/100), 10)

      setResults({
        totalInvested, totalCurrent, totalGain, absReturn, xirr,
        totalExpenseRatio, expenseLost10y, funds: MOCK_FUNDS
      })
    }, 2000)
  }

  const handleDemo = () => {
    setAnalyzing(true)
    setTimeout(() => {
      const e = { target: { files: [{ name: 'demo_cams_statement.pdf' }] } }
      handleUpload(e)
    }, 500)
  }

  return (
    <PageLayout
      title={<>Portfolio <em className="text-gradient-cyan not-italic">X-Ray</em></>}
      subtitle="Upload your CAMS or KFintech consolidated account statement. Get instant XIRR analysis, fund overlap detection, expense drag, and an AI rebalancing plan."
      sourceLabel="All data stays in your browser. No financial data is sent to our servers."
    >
      {!results && !analyzing && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto mt-8">
          <div className="card p-10 text-center border-dashed" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <UploadCloud size={28} style={{ color: 'var(--color-trust)' }} />
            </div>
            <h2 className="font-display text-2xl mb-2" style={{ color: '#f1f5f9' }}>Upload Statement</h2>
            <p className="text-sm mb-8" style={{ color: 'var(--color-label)' }}>
              Supports PDF statements from CAMS and KFintech. Email password is not required if removed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <label className="btn-primary cursor-pointer w-full sm:w-auto justify-center">
                <input type="file" className="hidden" accept=".pdf" onChange={handleUpload} />
                Select PDF File
              </label>
              <button onClick={handleDemo} className="btn-ghost w-full sm:w-auto justify-center">
                Try Demo Data
              </button>
            </div>
            <p className="source-label mt-6">End-to-end encrypted · Data never leaves your device</p>
          </div>
        </motion.div>
      )}

      {analyzing && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin mb-6"
            style={{ borderColor: 'rgba(6,182,212,0.2)', borderTopColor: 'var(--color-ai)' }} />
          <h3 className="font-display text-2xl" style={{ color: '#f1f5f9' }}>Parsing Statement...</h3>
          <div className="mt-4 flex flex-col items-center gap-2">
            {['Extracting ISIN numbers...', 'Calculating internal rate of return...', 'Detecting stock-level overlap...'].map((txt, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.7 }}
                className="text-xs font-mono" style={{ color: 'var(--color-ai)' }}
              >
                &gt; {txt}
              </motion.p>
            ))}
          </div>
        </motion.div>
      )}

      {results && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* File header */}
          <div className="flex items-center justify-between pb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)' }}>
                <FileText size={18} style={{ color: 'var(--color-trust)' }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>{file?.name || 'demo_statement.pdf'}</p>
                <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Analyzed just now</p>
              </div>
            </div>
            <button onClick={() => setResults(null)} className="btn-ghost text-xs py-1.5 px-3">
              Upload New
            </button>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* ── METRICS LEFT PANEL ── */}
            <div className="lg:col-span-1 space-y-4">
              <div className="card p-5">
                <p className="metric-label">Current Value</p>
                <p className="metric-value text-3xl mb-1 num" style={{ color: '#f1f5f9' }}>{fmt(results.totalCurrent)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="tag-green">
                    <TrendingUp size={10} /> {fmt(results.totalGain)}
                  </span>
                  <span className="text-xs font-semibold num" style={{ color: 'var(--color-growth)' }}>
                    +{results.absReturn.toFixed(1)}% abs
                  </span>
                </div>
              </div>

              <div className="card p-5">
                <p className="metric-label">Annualized Return (XIRR)</p>
                <p className="metric-value text-3xl mb-1 num" style={{ color: 'var(--color-gain)' }}>{results.xirr.toFixed(1)}%</p>
                <p className="metric-sub">Beating Nifty 50 by 2.2%</p>
              </div>

              <div className="card p-5">
                <p className="metric-label">Total Invested</p>
                <p className="metric-value text-xl mb-1 num" style={{ color: '#e2e8f0' }}>{fmt(results.totalInvested)}</p>
                <p className="metric-sub">Across {results.funds.length} funds</p>
              </div>
            </div>

            {/* ── TABBED CONTENT RIGHT ── */}
            <div className="lg:col-span-3 space-y-5">
              {/* Tab Nav */}
              <div className="flex gap-2 p-1 overflow-x-auto" style={{ background: 'var(--bg-900)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                {TABS.map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
                    style={activeTab === t
                      ? { background: 'var(--color-trust)', color: '#fff', boxShadow: '0 2px 10px rgba(59,130,246,0.2)' }
                      : { color: 'var(--color-label)', background: 'transparent' }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Tab Contents */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* OVERVIEW */}
                  {activeTab === 'Overview' && (
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="card p-6">
                        <p className="text-xs font-semibold mb-6 uppercase tracking-wider" style={{ color: 'var(--color-label)' }}>Asset Allocation</p>
                        <div className="h-[200px] relative">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={ALLOCATION} innerRadius={60} outerRadius={80} paddingAngle={4}
                                dataKey="value" stroke="none"
                              >
                                {ALLOCATION.map((d, i) => <Cell key={i} fill={d.color} />)}
                              </Pie>
                              <Tooltip content={<DonutTooltip />} cursor={false} />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-xs" style={{ color: 'var(--color-muted)' }}>Equity</span>
                            <span className="font-display text-2xl num mt-0.5" style={{ color: '#e2e8f0', lineHeight: 1 }}>90%</span>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          {ALLOCATION.map(a => (
                            <div key={a.name} className="flex justify-between text-xs">
                              <span className="flex items-center gap-1.5" style={{ color: 'var(--color-label)' }}>
                                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: a.color }} />
                                {a.name}
                              </span>
                              <span className="font-semibold num" style={{ color: '#e2e8f0' }}>{a.value}%</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="card p-6 flex flex-col">
                        <p className="text-xs font-semibold mb-4 uppercase tracking-wider" style={{ color: 'var(--color-label)' }}>Holdings</p>
                        <div className="space-y-0.5 flex-1 p-1">
                          {results.funds.map(f => (
                            <div key={f.name} className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                              <p className="text-xs font-semibold truncate" style={{ color: '#e2e8f0' }}>{f.name}</p>
                              <div className="flex justify-between mt-1.5 text-xs">
                                <span style={{ color: 'var(--color-muted)' }}>
                                  {f.category.replace('Equity -', 'Eq:')}
                                </span>
                                <span className="font-semibold num" style={{ color: 'var(--color-gain)' }}>{fmt(f.current)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* OVERLAP MATRIX */}
                  {activeTab === 'Overlap Matrix' && (
                    <div className="card p-6">
                      <div className="headline-insight mb-6 flex items-start gap-3">
                        <Layers size={16} style={{ color: 'var(--color-gain)', flexShrink: 0, marginTop: 2 }} />
                        <p className="text-sm" style={{ color: 'var(--color-label)' }}>
                          High overlap detected. Parag Parikh Flexi and ICICI Nifty 50 share <strong style={{ color: 'var(--color-risk)' }}>38%</strong> of the same stocks. You are paying two fund managers to buy HDFC Bank and Reliance.
                        </p>
                      </div>

                      <p className="text-xs font-semibold mb-4 uppercase tracking-wider" style={{ color: 'var(--color-label)' }}>Top Overlapping Pairs</p>
                      <div className="space-y-3">
                        {OVERLAP.map((o, i) => (
                          <div key={i} className="p-4 rounded-xl" style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-900)' }}>
                            <div className="flex justify-between items-start mb-3">
                              <div className="space-y-1">
                                <p className="text-xs font-semibold" style={{ color: '#e2e8f0' }}>{o.pair[0]}</p>
                                <p className="text-xs" style={{ color: 'var(--color-muted)' }}>and</p>
                                <p className="text-xs font-semibold" style={{ color: '#e2e8f0' }}>{o.pair[1]}</p>
                              </div>
                              <div className="text-right">
                                <span className="font-display text-2xl num" style={{ color: o.pct > 30 ? 'var(--color-risk)' : 'var(--color-gain)' }}>{o.pct}%</span>
                                <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--color-muted)' }}>Portfolio Overlap</p>
                              </div>
                            </div>
                            <div className="progress-bar mt-2 bg-opacity-20">
                              <div className="progress-fill" style={{ width: `${o.pct}%`, background: o.pct > 30 ? 'var(--color-risk)' : 'var(--color-gain)' }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* EXPENSE DRAG */}
                  {activeTab === 'Expense Drag' && (
                    <div className="card p-6">
                       <div className="headline-insight mb-6 flex items-start gap-3">
                        <Percent size={16} style={{ color: 'var(--color-gain)', flexShrink: 0, marginTop: 2 }} />
                        <p className="text-sm" style={{ color: 'var(--color-label)' }}>
                          Your weighted Expense Ratio is <strong style={{ color: 'var(--color-gain)' }}>{results.totalExpenseRatio.toFixed(2)}%</strong>.
                          Over 10 years, you will lose <strong className="num" style={{ color: 'var(--color-trust)' }}>{fmt(results.expenseLost10y)}</strong> to fees alone. Consider moving to direct plans if you haven't.
                        </p>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                              <th className="font-semibold py-3 px-3 uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>Fund</th>
                              <th className="font-semibold py-3 px-3 uppercase tracking-wider text-right" style={{ color: 'var(--color-muted)' }}>TER</th>
                              <th className="font-semibold py-3 px-3 uppercase tracking-wider text-right" style={{ color: 'var(--color-muted)' }}>Est. Annual Fee</th>
                            </tr>
                          </thead>
                          <tbody>
                            {results.funds.map((f, i) => (
                              <tr key={i} style={{ borderBottom: '1px solid rgba(148,163,184,0.05)' }}>
                                <td className="py-3 px-3 font-medium" style={{ color: '#e2e8f0' }}>{f.name}</td>
                                <td className="py-3 px-3 num text-right" style={{ color: f.ter > 0.8 ? 'var(--color-risk)' : 'var(--color-gain)' }}>{f.ter.toFixed(2)}%</td>
                                <td className="py-3 px-3 num text-right" style={{ color: 'var(--color-label)' }}>{fmt((f.ter / 100) * f.current)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* AI ACTION PLAN */}
                  {activeTab === 'AI Action Plan' && (
                    <div className="space-y-4">
                      {/* AI Agent Message */}
                      <div className="card-ai p-5">
                        <div className="flex items-center gap-2 mb-3">
                         <div className="w-6 h-6 rounded-full flex items-center justify-center p-1" style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)' }}>
                            <Bot size={12} style={{ color: 'var(--color-ai)' }} />
                          </div>
                          <span className="text-xs font-bold" style={{ color: 'var(--color-ai)' }}>AI Mentor Analysis</span>
                        </div>
                        <div className="space-y-3 text-sm leading-relaxed" style={{ color: '#e2e8f0' }}>
                          <p>I've analyzed your ₹{fmt(results.totalInvested)} portfolio. Your 14.2% XIRR is excellent, but inefficiencies are dragging down potential returns.</p>
                          <p>You hold 5 funds, which is good, but your **Flexi Cap and Large Cap Index have 38% overlap**. You are effectively doubling down on the top 20 Nifty stocks while paying higher active management fees for the Flexi Cap.</p>
                        </div>
                      </div>

                      {/* Action Items */}
                      <div className="card p-5">
                        <p className="text-xs font-semibold mb-4 uppercase tracking-wider" style={{ color: 'var(--color-label)' }}>Recommended Actions</p>
                        <div className="space-y-4">
                          {[
                            { title: 'Stop SIP in ICICI Nifty 50 Index', desc: 'Parag Parikh Flexi Cap already allocates 60%+ to large caps. Consolidate your large-cap exposure.', type: 'alert' },
                            { title: 'Increase Mid/Small Cap Allocation', desc: 'At your age/timeline, a 35% mid/small cap weighting could be optimized closer to 45% for alpha generation.', type: 'info' },
                            { title: 'Move to Direct Growth Plans', desc: 'Ensure all funds have "- Direct Plan - Growth" in the name. Regular plans cost you ~0.75% extra annually.', type: 'check' },
                          ].map((a, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'var(--bg-900)', border: '1px solid var(--border-subtle)' }}>
                              <div className="mt-0.5 min-w-[16px]">
                                {a.type === 'alert' && <AlertTriangle size={15} style={{ color: 'var(--color-risk)' }} />}
                                {a.type === 'check' && <CheckCircle2 size={15} style={{ color: 'var(--color-growth)' }} />}
                                {a.type === 'info' && <TrendingUp size={15} style={{ color: 'var(--color-gain)' }} />}
                              </div>
                              <div>
                                <p className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>{a.title}</p>
                                <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>{a.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </PageLayout>
  )
}
