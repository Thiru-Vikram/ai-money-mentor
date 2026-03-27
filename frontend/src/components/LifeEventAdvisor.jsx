import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip
} from 'recharts'
import {
  Sparkles, Gift, Heart, Baby, Briefcase, Home, Landmark, PiggyBank,
  ArrowRight, Download, CalendarSync, Check, Square, Shield,
  TrendingUp, Flame, HelpCircle, Archive, ChevronRight, Loader2
} from 'lucide-react'

/* ─── Life Events Config ─────────────────────────────────────────────────── */
const LIFE_EVENTS = [
  {
    id: 'bonus',
    label: 'I received a Bonus',
    icon: Gift,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    prompt: (amount) => `I'm an Indian salaried professional and I just received a bonus of ₹${amount}. Analyze the tax impact and give me a structured financial strategy.`,
    defaultAmount: '5,00,000',
  },
  {
    id: 'marriage',
    label: 'Getting Married',
    icon: Heart,
    color: 'text-pink-600 bg-pink-50 border-pink-200',
    prompt: (amount) => `I'm getting married in India with an estimated budget of ₹${amount}. Give me a complete financial advisory covering budget optimization, tax implications after marriage (HRA, joint investments), and wealth planning as a couple.`,
    defaultAmount: '15,00,000',
  },
  {
    id: 'baby',
    label: 'New Baby',
    icon: Baby,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    prompt: (amount) => `I'm an Indian parent expecting a new baby. My current monthly income is ₹${amount}. Advise me on insurance needs (term + health), child education planning (Sukanya/PPF), emergency fund adjustment, and tax-efficient savings.`,
    defaultAmount: '1,50,000',
  },
  {
    id: 'inheritance',
    label: 'Inheritance',
    icon: Landmark,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    prompt: (amount) => `I've received an inheritance of ₹${amount} in India. Advise on tax implications (capital gains, property), optimal asset allocation, debt clearance strategy, and how to integrate this into my FIRE plan.`,
    defaultAmount: '50,00,000',
  },
  {
    id: 'job_change',
    label: 'Job Change',
    icon: Briefcase,
    color: 'text-violet-600 bg-violet-50 border-violet-200',
    prompt: (amount) => `I'm changing jobs in India with a new CTC of ₹${amount}. Advise on EPF transfer vs withdrawal, gratuity eligibility, salary structuring for tax efficiency (HRA, NPS, LTA), and how to optimize the new compensation.`,
    defaultAmount: '25,00,000',
  },
  {
    id: 'home',
    label: 'Home Purchase',
    icon: Home,
    color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
    prompt: (amount) => `I'm buying a home in India worth ₹${amount}. Advise on home loan optimization (tenure, EMI vs SIP), Section 80C/24b deductions, stamp duty, registration, and impact on my overall financial plan.`,
    defaultAmount: '80,00,000',
  },
]

const SIDEBAR_LINKS = [
  { id: 'events', label: 'Life Events', icon: Sparkles, active: true },
  { id: 'tax', label: 'Tax Planning', icon: PiggyBank },
  { id: 'estate', label: 'Estate Strategy', icon: Landmark },
  { id: 'insurance', label: 'Insurance', icon: Shield },
  { id: 'wealth', label: 'Wealth Gap', icon: TrendingUp },
]

/* ─── Backend API ─────────────────────────────────────────────────────────── */
async function fetchAdvisory(prompt) {
  const response = await fetch('http://localhost:8080/api/life-event/advise', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })
  const text = await response.text()
  // Strip markdown code fences if present
  const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim()
  return JSON.parse(cleaned)
}

/* ─── Fallback Data ───────────────────────────────────────────────────────── */
const FALLBACK = {
  headline: 'Strategy for your ₹5,00,000 Bonus',
  confidence: 98,
  taxImpact: {
    estimatedLiability: '₹1,50,000',
    priority: 'HIGH',
    description: 'Your bonus shifts your annual income into the 30% bracket. Immediate optimization required via Section 80C and NPS top-ups.',
  },
  immediateActions: [
    { title: 'NPS Tier 1 Contribution', amount: '₹50,000', description: 'Maximize tax deduction under Sec 80CCD(1B).' },
    { title: 'Credit Card Paydown', amount: '₹1,20,000', description: 'Eliminate high-interest debt (36% APR) immediately.' },
    { title: 'Liquid Reserve', amount: '₹80,000', description: 'Replenish emergency fund to 6 months of expenses.' },
  ],
  longTermAllocation: [
    { title: 'Index Fund Lump Sum', amount: '₹2,00,000', description: 'Diversified equity exposure for 10yr+ horizon.' },
    { title: 'Gold SGBs', amount: '₹50,000', description: 'Strategic hedge against market volatility.' },
    { title: 'ELSS Tax Saver', amount: '₹1,50,000', description: 'Lock-in for 80C with equity upside.' },
  ],
  healthImpact: { points: 12, quarterData: [45, 52, 48, 55, 67] },
  fireImpact: 'This allocation accelerates your FIRE date by 4 months.',
  checklist: [
    'Confirm Bonus Receipt in Ledger',
    'Execute NPS Tier 1 Transfer',
    'Initiate Credit Card Payment',
    'Schedule Index Fund SIP/Lump Sum',
  ],
}

/* ─── Chart Tooltip ───────────────────────────────────────────────────────── */
const BarTooltipCustom = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-navy-900/10 shadow-lg rounded-xl px-3 py-2 text-xs">
      <p className="text-navy-900/50">{label}</p>
      <p className="text-navy-900 font-bold">{payload[0].value} pts</p>
    </div>
  )
}

/* ─── Main Component ──────────────────────────────────────────────────────── */
export default function LifeEventAdvisor() {
  const [selectedEvent, setSelectedEvent] = useState(LIFE_EVENTS[0])
  const [amount, setAmount] = useState(LIFE_EVENTS[0].defaultAmount)
  const [advisory, setAdvisory] = useState(null)
  const [loading, setLoading] = useState(false)
  const [checkedItems, setCheckedItems] = useState({})
  const [error, setError] = useState(null)

  const handleSelectEvent = (event) => {
    setSelectedEvent(event)
    setAmount(event.defaultAmount)
    setAdvisory(null)
    setCheckedItems({})
    setError(null)
  }

  const handleAnalyze = async () => {
    setLoading(true)
    setError(null)
    setAdvisory(null)

    try {
      const prompt = selectedEvent.prompt(amount)
      const data = await fetchAdvisory(prompt)
      if (data.error) throw new Error(data.error)
      setAdvisory(data)
      setCheckedItems({})
    } catch (err) {
      console.error('Advisory API error:', err)
      setError('AI analysis failed. Showing sample advisory.')
      setAdvisory(FALLBACK)
      setCheckedItems({ 0: true })
    } finally {
      setLoading(false)
    }
  }

  const toggleCheck = (i) => {
    setCheckedItems(prev => ({ ...prev, [i]: !prev[i] }))
  }

  const chartData = useMemo(() => {
    if (!advisory?.healthImpact?.quarterData) return []
    const labels = ['Q1', 'Q2', 'Q3', 'Q4', 'Now']
    return advisory.healthImpact.quarterData.map((val, i) => ({
      quarter: labels[i] || `Q${i + 1}`,
      score: val,
      isNow: i === advisory.healthImpact.quarterData.length - 1,
    }))
  }, [advisory])

  return (
    <section id="advisor" className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10">
          <div className="section-tag mb-4">
            <Sparkles size={11} />
            AI Advisory
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
            Life Event Financial Advisor
          </h1>
          <p className="text-navy-900/50 text-base mt-2 max-w-2xl">
            Institutional-grade advice for life's biggest milestones. Our AI engine processes
            Indian tax laws and market conditions to secure your legacy.
          </p>
        </div>

        <div className="flex gap-6">
          {/* ── Left Sidebar ── */}
          <div className="hidden lg:flex flex-col w-56 flex-shrink-0 space-y-2">
            {/* Sidebar Nav */}
            <div className="glass-card p-3 space-y-1 mb-4">
              {SIDEBAR_LINKS.map(link => (
                <button
                  key={link.id}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    link.active
                      ? 'bg-navy-900 text-white'
                      : 'text-navy-900/50 hover:bg-navy-900/[0.04] hover:text-navy-900'
                  }`}
                >
                  <link.icon size={15} />
                  {link.label}
                </button>
              ))}
            </div>

            {/* Bottom links */}
            <div className="mt-auto pt-4 space-y-1">
              <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-navy-900/40 hover:text-navy-900/60 transition-colors">
                <HelpCircle size={15} /> Support
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-navy-900/40 hover:text-navy-900/60 transition-colors">
                <Archive size={15} /> Archive
              </button>
            </div>
          </div>

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Event Selection + API Key */}
            <div className="grid lg:grid-cols-5 gap-5">
              {/* Select Milestone */}
              <div className="lg:col-span-2 glass-card p-5">
                <h2 className="flex items-center gap-2 text-sm font-bold text-navy-900 mb-4">
                  <Sparkles size={14} className="text-navy-900/40" />
                  Select Active Milestone
                </h2>

                <div className="space-y-2">
                  {LIFE_EVENTS.map(event => {
                    const Icon = event.icon
                    const isSelected = selectedEvent.id === event.id
                    return (
                      <button
                        key={event.id}
                        onClick={() => handleSelectEvent(event)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm font-medium transition-all ${
                          isSelected
                            ? 'border-navy-900 bg-navy-900 text-white shadow-md'
                            : 'border-navy-900/[0.08] bg-white text-navy-900/70 hover:border-navy-900/20 hover:bg-navy-900/[0.02]'
                        }`}
                      >
                        <Icon size={16} className={isSelected ? 'text-white/80' : 'text-navy-900/40'} />
                        {event.label}
                        {isSelected && <Check size={14} className="ml-auto text-white/80" />}
                      </button>
                    )
                  })}
                </div>

                {/* Amount input */}
                <div className="mt-4 pt-4 border-t border-navy-900/[0.06]">
                  <label className="text-xs font-semibold text-navy-900/45 uppercase tracking-wider">Amount (₹)</label>
                  <input
                    type="text"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full mt-2 bg-navy-900/[0.03] border border-navy-900/10 rounded-xl px-4 py-3 text-navy-900 font-bold text-lg focus:outline-none focus:border-navy-900/30 font-mono"
                    placeholder="5,00,000"
                  />
                </div>



                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="btn-primary w-full mt-4 flex items-center justify-center gap-2 text-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Analyzing…
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      Generate AI Advisory
                    </>
                  )}
                </button>

                {error && (
                  <p className="mt-2 text-xs text-amber-600 text-center">{error}</p>
                )}
              </div>

              {/* Advisory Result */}
              <div className="lg:col-span-3">
                <AnimatePresence mode="wait">
                  {!advisory && !loading ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="glass-card p-10 flex flex-col items-center justify-center min-h-[400px] text-center"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-navy-900/[0.05] border border-navy-900/10 flex items-center justify-center mb-5">
                        <Sparkles size={28} className="text-navy-900/25" />
                      </div>
                      <h3 className="text-lg font-bold text-navy-900/60 mb-2">Select a Life Event & Analyze</h3>
                      <p className="text-sm text-navy-900/35 max-w-sm leading-relaxed">
                        Choose a milestone from the left, enter the amount, and our
                        Gemini-powered AI will generate a personalized financial strategy.
                      </p>
                    </motion.div>
                  ) : loading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="glass-card p-10 flex flex-col items-center justify-center min-h-[400px] text-center"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-navy-900/[0.06] border border-navy-900/10 flex items-center justify-center mb-5 relative">
                        <Sparkles size={28} className="text-navy-900/40" />
                        <motion.div
                          className="absolute inset-0 rounded-2xl border-2 border-navy-900/20"
                          animate={{ scale: [1, 1.25, 1], opacity: [1, 0, 1] }}
                          transition={{ repeat: Infinity, duration: 1.4 }}
                        />
                      </div>
                      <h3 className="text-lg font-bold text-navy-900/70 mb-2">AI Analyzing Your Event…</h3>
                      <div className="space-y-2 text-left mt-4">
                        {[
                          'Processing tax implications…',
                          'Evaluating asset allocation…',
                          'Calculating FIRE impact…',
                          'Generating advisory…',
                        ].map((step, i) => (
                          <motion.div
                            key={step}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.5 }}
                            className="flex items-center gap-2 text-xs text-navy-900/50"
                          >
                            <motion.div
                              className="w-1.5 h-1.5 rounded-full bg-navy-900"
                              animate={{ scale: [1, 1.5, 1] }}
                              transition={{ delay: i * 0.5, repeat: 1, duration: 0.4 }}
                            />
                            {step}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ) : advisory ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-5"
                    >
                      {/* Advisory Header */}
                      <div className="glass-card p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-1.5">AI Generated Advisory</p>
                            <h2 className="text-2xl font-extrabold text-navy-900 leading-snug">
                              {advisory.headline}
                            </h2>
                          </div>
                          <div className="flex-shrink-0 px-4 py-3 rounded-xl border border-navy-900/10 bg-navy-900/[0.02] text-center">
                            <p className="text-2xl font-extrabold text-navy-900">{advisory.confidence}%</p>
                            <p className="text-[9px] text-navy-900/40 font-medium">Strategy<br/>Confidence</p>
                          </div>
                        </div>
                      </div>

                      {/* Actions Grid */}
                      <div className="grid md:grid-cols-2 gap-5">
                        {/* Immediate Actions */}
                        <div className="glass-card p-5">
                          <h3 className="flex items-center gap-2 text-sm font-bold text-navy-900 mb-4">
                            <ChevronRight size={14} className="text-navy-900/40" />
                            Immediate Actions
                          </h3>
                          <div className="space-y-3">
                            {advisory.immediateActions?.map((action, i) => (
                              <div key={i} className="p-3.5 rounded-xl bg-navy-900/[0.02] border border-navy-900/[0.06] hover:border-navy-900/15 transition-colors">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <p className="text-sm font-semibold text-navy-900">{action.title}</p>
                                  <span className="text-sm font-bold text-navy-900 flex-shrink-0">{action.amount}</span>
                                </div>
                                <p className="text-xs text-navy-900/45 leading-relaxed">{action.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Long-term Allocation */}
                        <div className="glass-card p-5">
                          <h3 className="flex items-center gap-2 text-sm font-bold text-navy-900 mb-4">
                            <TrendingUp size={14} className="text-navy-900/40" />
                            Long-term Allocation
                          </h3>
                          <div className="space-y-3">
                            {advisory.longTermAllocation?.map((item, i) => (
                              <div key={i} className="p-3.5 rounded-xl bg-navy-900/[0.02] border border-navy-900/[0.06] hover:border-navy-900/15 transition-colors">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <p className="text-sm font-semibold text-navy-900">{item.title}</p>
                                  <span className="text-sm font-bold text-navy-900 flex-shrink-0">{item.amount}</span>
                                </div>
                                <p className="text-xs text-navy-900/45 leading-relaxed">{item.description}</p>
                              </div>
                            ))}
                          </div>

                          {/* FIRE Impact */}
                          {advisory.fireImpact && (
                            <div className="mt-4 p-3 rounded-xl bg-navy-900/[0.04] border border-navy-900/10 flex items-start gap-2.5">
                              <Flame size={14} className="text-navy-900/50 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-[10px] font-bold text-navy-900/50 uppercase tracking-wider mb-0.5">FIRE Impact</p>
                                <p className="text-xs text-navy-900/65 leading-relaxed">{advisory.fireImpact}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom row — Tax Impact + Health + Checklist */}
            <AnimatePresence>
              {advisory && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="grid md:grid-cols-3 gap-5"
                >
                  {/* Tax Impact Analysis */}
                  <div className="glass-card p-5 border-l-4 border-l-red-500 relative overflow-hidden">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-base font-bold text-navy-900">Tax Impact<br/>Analysis</h3>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200">
                        {advisory.taxImpact?.priority || 'HIGH'} PRIORITY
                      </span>
                    </div>
                    <div className="mb-3">
                      <p className="text-[10px] text-navy-900/40 uppercase tracking-wider">Estimated Liability</p>
                      <p className="text-3xl font-extrabold text-red-600 mt-1">{advisory.taxImpact?.estimatedLiability}</p>
                    </div>
                    <p className="text-sm text-navy-900/55 leading-relaxed">{advisory.taxImpact?.description}</p>
                    <button className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors">
                      <Download size={12} />
                      Download Tax Strategy PDF
                    </button>
                  </div>

                  {/* Money Health Impact */}
                  <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-bold text-navy-900">Money Health<br/>Impact</h3>
                      <div className="text-right">
                        <span className="text-green-600 text-xl font-extrabold">+{advisory.healthImpact?.points || 12}</span>
                        <p className="text-[10px] text-green-600 font-medium">pts</p>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={140}>
                      <BarChart data={chartData} barSize={32} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
                        <CartesianGrid vertical={false} stroke="rgba(10,25,47,0.05)" />
                        <XAxis
                          dataKey="quarter"
                          tick={{ fill: 'rgba(10,25,47,0.4)', fontSize: 10, fontFamily: 'Plus Jakarta Sans' }}
                          axisLine={false} tickLine={false}
                        />
                        <YAxis
                          tick={{ fill: 'rgba(10,25,47,0.25)', fontSize: 9 }}
                          axisLine={false} tickLine={false}
                          domain={[0, 100]}
                        />
                        <Tooltip content={<BarTooltipCustom />} cursor={{ fill: 'rgba(10,25,47,0.03)' }} />
                        <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                          {chartData.map((entry, i) => (
                            <Cell key={i} fill={entry.isNow ? '#10B981' : 'rgba(10,25,47,0.15)'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Execution Checklist */}
                  <div className="glass-card p-5">
                    <h3 className="text-base font-bold text-navy-900 mb-4">Execution Checklist</h3>
                    <div className="space-y-3">
                      {advisory.checklist?.map((item, i) => (
                        <button
                          key={i}
                          onClick={() => toggleCheck(i)}
                          className="w-full flex items-start gap-3 text-left group"
                        >
                          <div className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border transition-all ${
                            checkedItems[i]
                              ? 'bg-navy-900 border-navy-900 text-white'
                              : 'border-navy-900/20 bg-white group-hover:border-navy-900/40'
                          }`}>
                            {checkedItems[i] && <Check size={12} />}
                          </div>
                          <span className={`text-sm leading-snug transition-all ${
                            checkedItems[i]
                              ? 'text-navy-900/35 line-through'
                              : 'text-navy-900/70'
                          }`}>
                            {item}
                          </span>
                        </button>
                      ))}
                    </div>
                    <button className="btn-primary w-full mt-5 flex items-center justify-center gap-2 text-xs">
                      <CalendarSync size={13} />
                      Sync to Calendar & Bank
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Disclaimer */}
            {advisory && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <p className="text-[10px] text-navy-900/25 mt-2">
                  EDITORIAL INTELLIGENCE INSTITUTIONAL REPORT · Investment recommendations are based on
                  your risk profile 'Aggressive Growth'. Tax calculations are estimates based on FY2024-25
                  regulations. Consult your local chartered accountant for final verification.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
