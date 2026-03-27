import { useState, useMemo, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell
} from 'recharts'
import {
  Users, Sparkles, Shield, Target, TrendingUp, Heart,
  ChevronRight, Loader2, Plus, RefreshCw, Check, AlertTriangle
} from 'lucide-react'

/* ─── Defaults ────────────────────────────────────────────────────────────── */
const defaultPartner = (name, role) => ({
  name,
  role,
  salary: '',
  slab: '30',
  declarations80C: '',
  investments: '',
})

const SLAB_OPTIONS = ['0', '5', '10', '15', '20', '25', '30']

const FALLBACK_INSIGHTS = [
  {
    category: 'HRA Optimization',
    impactLabel: 'High Impact',
    impactType: 'high',
    insight: 'Rahul should claim HRA for the shared apartment due to his 30% tax slab. Ananya\'s 20% benefit is lower.',
    estimatedSaving: '₹40,000/yr',
  },
  {
    category: 'NPS Strategy',
    impactLabel: 'Retirement Boost',
    impactType: 'retirement',
    insight: 'Prioritize maxing out Rahul\'s Tier 1 NPS (₹50K) first to leverage higher slab deduction before Ananya\'s contribution.',
    estimatedSaving: '₹15,000/yr',
  },
  {
    category: 'SIP Split for Tax Efficiency',
    impactLabel: 'Portfolio Optimization',
    impactType: 'portfolio',
    insight: 'Shift ₹25K/month from Rahul\'s individual SIP to a Joint Portfolio. This utilizes Ananya\'s unused STCG limit of 20K remaining.',
    estimatedSaving: '₹12,000/yr',
  },
]

const SHARED_GOALS_DEFAULT = [
  { id: 1, name: 'New Apartment', target: '₹60,00,000', deadline: 'Dec 2025', progress: 75, saved: '₹19.1L', remaining: '₹16.6L Left' },
  { id: 2, name: 'European Sabbatical', target: '₹8,00,000', deadline: 'Jun 2026', progress: 90, saved: '₹1.2L', remaining: '₹1.8L Left' },
  { id: 3, name: 'Education Fund', target: '₹1.5 Cr', deadline: 'Apr 2038', progress: 15, saved: '₹7.4L', remaining: 'Just Started' },
]

const INSURANCE_DATA = [
  { type: 'Family Floater Health', status: 'Optimized', cover: '₹25,00,000', isOptimized: true },
  { type: 'Term Life Insurance', ananya: '₹2.0 Cr', rahul: '₹1.5 Cr', warning: 'Rahul is under-insured by ₹1.2 Cr based on current joint liabilities (Home Loan + Education Fund).' },
]

/* ─── Backend API ─────────────────────────────────────────────────────────── */
async function fetchCoupleInsights(prompt) {
  const response = await fetch('http://localhost:8080/api/couples-planner/insights', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })
  const text = await response.text()
  const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim()
  return JSON.parse(cleaned)
}

/* ─── Chart Tooltip ───────────────────────────────────────────────────────── */
const NetWorthTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-navy-900/10 shadow-lg rounded-xl px-3 py-2 text-xs">
      <p className="text-navy-900/50">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-bold" style={{ color: p.color }}>
          {p.name}: ₹{(p.value / 100000).toFixed(1)}L
        </p>
      ))}
    </div>
  )
}

/* ─── Impact Badge ─────────────────────────────────────────────────────────── */
function ImpactBadge({ type, label }) {
  const styles = {
    high: 'bg-red-50 text-red-600 border-red-200',
    retirement: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    portfolio: 'bg-blue-50 text-blue-600 border-blue-200',
  }
  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${styles[type] || styles.high}`}>
      {label}
    </span>
  )
}

/* ─── Main Component ──────────────────────────────────────────────────────── */
export default function CouplesMoneyPlanner() {
  const [partners, setPartners] = useState({
    partner1: defaultPartner('Ananya', 'Lead Developer · 30% Slab'),
    partner2: defaultPartner('Rahul', 'Product Manager · 30% Slab'),
  })
  const [viewMode, setViewMode] = useState('monthly') // monthly | annual
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [goals, setGoals] = useState(SHARED_GOALS_DEFAULT)

  const updatePartner = useCallback((key, field, value) => {
    setPartners(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }))
  }, [])

  // Computed values
  const computedData = useMemo(() => {
    const p1Salary = parseFloat(partners.partner1.salary.replace(/,/g, '')) || 0
    const p2Salary = parseFloat(partners.partner2.salary.replace(/,/g, '')) || 0
    const p1Inv = parseFloat(partners.partner1.investments.replace(/,/g, '')) || 0
    const p2Inv = parseFloat(partners.partner2.investments.replace(/,/g, '')) || 0
    const multiplier = viewMode === 'annual' ? 12 : 1

    const p1Total = (p1Salary + p1Inv) * multiplier
    const p2Total = (p2Salary + p2Inv) * multiplier
    const joint = (p1Inv + p2Inv) * multiplier * 0.3
    const combined = p1Total + p2Total + joint

    return {
      partner1Total: p1Total,
      partner2Total: p2Total,
      jointAssets: joint,
      combinedNetWorth: combined,
      growthIndex: combined > 0 ? 'High' : '—',
    }
  }, [partners, viewMode])

  // Net worth chart data
  const chartData = useMemo(() => {
    const base = computedData.combinedNetWorth || 48250000
    return [
      { month: 'Aug', p1: base * 0.35, p2: base * 0.30, joint: base * 0.10 },
      { month: 'Sep', p1: base * 0.36, p2: base * 0.31, joint: base * 0.11 },
      { month: 'Oct', p1: base * 0.37, p2: base * 0.31, joint: base * 0.12 },
      { month: 'Nov', p1: base * 0.38, p2: base * 0.32, joint: base * 0.13 },
      { month: 'Dec', p1: base * 0.39, p2: base * 0.33, joint: base * 0.14 },
      { month: 'Jan', p1: base * 0.41, p2: base * 0.34, joint: base * 0.16 },
    ]
  }, [computedData.combinedNetWorth])

  const handleGenerateInsights = async () => {
    const p1 = partners.partner1
    const p2 = partners.partner2

    if (!p1.salary || !p2.salary) {
      setError('Please enter salary for both partners')
      return
    }

    setLoading(true)
    setError(null)

    const prompt = `
Given these two partners' financial data:
Partner 1 - ${p1.name}: Monthly Salary ₹${p1.salary}, Tax Slab ${p1.slab}%, 80C Declarations ₹${p1.declarations80C || '0'}, Investments ₹${p1.investments || '0'}/month
Partner 2 - ${p2.name}: Monthly Salary ₹${p2.salary}, Tax Slab ${p2.slab}%, 80C Declarations ₹${p2.declarations80C || '0'}, Investments ₹${p2.investments || '0'}/month
Generate exactly 3 cross-income optimization insights as a JSON array.`

    try {
      const data = await fetchCoupleInsights(prompt)
      if (data.error) throw new Error(data.error)
      setInsights(Array.isArray(data) ? data : FALLBACK_INSIGHTS)
    } catch (err) {
      console.error('Couple planner API error:', err)
      setError('AI analysis failed. Showing sample insights.')
      setInsights(FALLBACK_INSIGHTS)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (val) => {
    if (!val || val === 0) return '₹0'
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`
    return `₹${val.toLocaleString('en-IN')}`
  }

  return (
    <section id="couples" className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10">
          <div className="section-tag mb-4">
            <Users size={11} />
            Collaborative Suite
          </div>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
                Couple's Money Planner
              </h1>
              <p className="text-navy-900/50 text-base mt-2 max-w-2xl">
                Harmonize your household wealth. Use AI to optimize cross-income
                benefits and build a unified legacy.
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-700">Partner Sync Active</span>
            </div>
          </div>
        </div>

        {/* ── Top Row: Net Worth + AI Insights ── */}
        <div className="grid lg:grid-cols-5 gap-5 mb-5">
          {/* Combined Net Worth */}
          <div className="lg:col-span-3 glass-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-navy-900 flex items-center gap-2">
                  <TrendingUp size={14} className="text-navy-900/40" />
                  Combined Net Worth
                </h2>
                <p className="text-[10px] text-navy-900/40 mt-0.5">Aggregated across all joint and individual accounts</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-extrabold text-navy-900 font-mono tracking-tight">
                  {computedData.combinedNetWorth > 0
                    ? formatCurrency(computedData.combinedNetWorth)
                    : '₹4,82,50,000'}
                </p>
                <p className="text-xs text-emerald-600 font-semibold mt-0.5">+1.2% this month</p>
              </div>
            </div>

            {/* Chart */}
            <div className="h-44 -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={28} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="rgba(10,25,47,0.05)" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: 'rgba(10,25,47,0.4)', fontSize: 10 }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'rgba(10,25,47,0.25)', fontSize: 9 }}
                    axisLine={false} tickLine={false}
                    tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`}
                  />
                  <Tooltip content={<NetWorthTooltip />} cursor={{ fill: 'rgba(10,25,47,0.03)' }} />
                  <Bar dataKey="p1" stackId="a" fill="#0A192F" radius={[0, 0, 0, 0]} name={partners.partner1.name} />
                  <Bar dataKey="p2" stackId="a" fill="rgba(10,25,47,0.45)" name={partners.partner2.name} />
                  <Bar dataKey="joint" stackId="a" fill="rgba(10,25,47,0.15)" radius={[4, 4, 0, 0]} name="Joint Assets" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-navy-900/[0.06]">
              {[
                { label: `${partners.partner1.name}'s Share`, value: computedData.partner1Total > 0 ? formatCurrency(computedData.partner1Total) : '₹2.1 Cr' },
                { label: `${partners.partner2.name}'s Share`, value: computedData.partner2Total > 0 ? formatCurrency(computedData.partner2Total) : '₹1.9 Cr' },
                { label: 'Joint Assets', value: computedData.jointAssets > 0 ? formatCurrency(computedData.jointAssets) : '₹0.82 Cr' },
                { label: 'Growth Index', value: computedData.growthIndex, isHighlight: true },
              ].map((item, i) => (
                <div key={i} className="text-center p-3 rounded-xl bg-navy-900/[0.02] border border-navy-900/[0.06]">
                  <p className="text-xs text-navy-900/40 mb-1">{item.label}</p>
                  <p className={`text-sm font-extrabold ${item.isHighlight ? 'text-emerald-600' : 'text-navy-900'}`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Strategy Insights */}
          <div className="lg:col-span-2 glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-navy-900 flex items-center gap-2">
                <Sparkles size={14} className="text-navy-900/40" />
                AI Strategy Insights
              </h2>
              <button
                onClick={handleGenerateInsights}
                disabled={loading}
                className="p-1.5 rounded-lg hover:bg-navy-900/[0.05] transition-colors text-navy-900/40 hover:text-navy-900"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              </button>
            </div>
            <p className="text-[10px] text-navy-900/35 -mt-2 mb-4">Cross-income optimization</p>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <Loader2 size={28} className="text-navy-900/30 animate-spin mb-3" />
                  <p className="text-sm text-navy-900/40">Analyzing cross-income data…</p>
                </motion.div>
              ) : insights ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  {insights.map((item, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-navy-900/[0.02] border border-navy-900/[0.06] hover:border-navy-900/15 transition-colors">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-[10px] font-bold text-navy-900/50 uppercase tracking-wider">{item.category}</p>
                        <ImpactBadge type={item.impactType} label={item.impactLabel} />
                      </div>
                      <p className="text-xs text-navy-900/65 leading-relaxed">{item.insight}</p>
                      {item.estimatedSaving && (
                        <p className="text-xs font-bold text-emerald-600 mt-2">
                          Est. Savings: {item.estimatedSaving}
                        </p>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={handleGenerateInsights}
                    className="btn-primary w-full mt-2 flex items-center justify-center gap-2 text-xs"
                  >
                    <Sparkles size={13} />
                    Apply All Recommendations
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-10 text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-navy-900/[0.05] border border-navy-900/10 flex items-center justify-center mb-4">
                    <Sparkles size={20} className="text-navy-900/25" />
                  </div>
                  <p className="text-sm text-navy-900/50 mb-1">Enter partner data below</p>
                  <p className="text-xs text-navy-900/30">AI will generate cross-income insights</p>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <p className="mt-2 text-xs text-amber-600 text-center">{error}</p>
            )}
          </div>
        </div>

        {/* ── Middle Row: Financial Input + Insurance ── */}
        <div className="grid lg:grid-cols-5 gap-5 mb-5">
          {/* Financial Profile Input */}
          <div className="lg:col-span-3 glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-navy-900">Financial Profile Input</h2>
              <div className="flex rounded-lg overflow-hidden border border-navy-900/10">
                {['monthly', 'annual'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors capitalize ${
                      viewMode === mode
                        ? 'bg-navy-900 text-white'
                        : 'text-navy-900/50 hover:text-navy-900 hover:bg-navy-900/[0.03]'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {['partner1', 'partner2'].map(key => {
                const p = partners[key]
                const avatarColor = key === 'partner1' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                return (
                  <div key={key}>
                    {/* Partner Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center font-bold text-sm`}>
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <input
                          type="text"
                          value={p.name}
                          onChange={e => updatePartner(key, 'name', e.target.value)}
                          className="text-sm font-bold text-navy-900 bg-transparent border-none p-0 focus:outline-none w-32"
                        />
                        <input
                          type="text"
                          value={p.role}
                          onChange={e => updatePartner(key, 'role', e.target.value)}
                          className="text-[10px] text-navy-900/40 bg-transparent border-none p-0 focus:outline-none block w-48"
                        />
                      </div>
                    </div>

                    {/* Fields */}
                    <div className="space-y-3">
                      {[
                        { label: 'Monthly Base Salary', field: 'salary', prefix: '₹' },
                        { label: 'Individual Investments', field: 'investments', prefix: '₹' },
                        { label: 'Tax Declarations (80C)', field: 'declarations80C', prefix: '₹' },
                      ].map(({ label, field, prefix }) => (
                        <div key={field}>
                          <label className="text-[10px] font-semibold text-navy-900/40 uppercase tracking-wider">{label}</label>
                          <div className="mt-1 flex items-center bg-navy-900/[0.03] border border-navy-900/10 rounded-xl overflow-hidden">
                            <span className="pl-3 text-sm text-navy-900/40 font-mono">{prefix}</span>
                            <input
                              type="text"
                              value={p[field]}
                              onChange={e => updatePartner(key, field, e.target.value)}
                              className="w-full bg-transparent px-2 py-2.5 text-sm text-navy-900 font-bold font-mono focus:outline-none"
                              placeholder="0"
                            />
                          </div>
                        </div>
                      ))}

                      {/* Tax Slab */}
                      <div>
                        <label className="text-[10px] font-semibold text-navy-900/40 uppercase tracking-wider">Tax Slab</label>
                        <select
                          value={p.slab}
                          onChange={e => updatePartner(key, 'slab', e.target.value)}
                          className="mt-1 w-full bg-navy-900/[0.03] border border-navy-900/10 rounded-xl px-3 py-2.5 text-sm text-navy-900 font-bold focus:outline-none appearance-none"
                        >
                          {SLAB_OPTIONS.map(s => (
                            <option key={s} value={s}>{s}%</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateInsights}
              disabled={loading}
              className="btn-primary w-full mt-6 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Generate AI Cross-Income Strategy
                </>
              )}
            </button>
          </div>

          {/* Insurance Coverage */}
          <div className="lg:col-span-2 glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-navy-900">Insurance Coverage</h2>
              <Shield size={16} className="text-navy-900/30" />
            </div>

            <div className="space-y-4">
              {/* Family Floater */}
              <div className="p-4 rounded-xl bg-navy-900/[0.02] border border-navy-900/[0.06]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Heart size={14} className="text-emerald-600" />
                    <span className="text-sm font-semibold text-navy-900">Family Floater Health</span>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                    Optimized
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-[10px] text-navy-900/40 uppercase tracking-wider">Combined Cover</p>
                  <p className="text-2xl font-extrabold text-navy-900 mt-0.5">₹25,00,000</p>
                </div>
                <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                  <p className="text-xs text-emerald-700">
                    <span className="font-bold">AI Recommendation:</span> Add a ₹7.62L top-up via Rahul's employer portal for only ₹4,000 premium.
                  </p>
                </div>
              </div>

              {/* Term Life */}
              <div className="p-4 rounded-xl bg-navy-900/[0.02] border border-navy-900/[0.06]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-navy-900/50" />
                    <span className="text-sm font-semibold text-navy-900">Term Life Insurance</span>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                    Action Required
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div>
                    <p className="text-[10px] text-navy-900/40 uppercase tracking-wider">{partners.partner1.name}</p>
                    <p className="text-lg font-extrabold text-navy-900">₹2.0 Cr</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-navy-900/40 uppercase tracking-wider">{partners.partner2.name}</p>
                    <p className="text-lg font-extrabold text-navy-900">₹1.5 Cr</p>
                  </div>
                </div>
                <div className="mt-3 p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-xs text-amber-700">
                    <AlertTriangle size={11} className="inline mr-1" />
                    {partners.partner2.name} is under-insured by ₹1.2 Cr based on current joint liabilities (Home Loan + Education Fund).
                  </p>
                </div>
              </div>

              <button className="w-full text-center py-3 rounded-xl border border-navy-900/10 text-xs font-semibold text-navy-900/50 hover:bg-navy-900/[0.03] transition-colors">
                View Full Risk & Liability Analysis
              </button>
            </div>
          </div>
        </div>

        {/* ── Bottom Row: Shared Goals Dashboard ── */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-extrabold text-navy-900">Shared Goals Dashboard</h2>
            <button className="flex items-center gap-1.5 text-xs font-semibold text-navy-900/50 hover:text-navy-900 transition-colors">
              <Plus size={13} />
              Add New Goal
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {goals.map(goal => {
              const progressColor = goal.progress >= 90 ? 'bg-emerald-500' : goal.progress >= 50 ? 'bg-blue-500' : 'bg-amber-500'
              const tagColor = goal.progress >= 90 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : goal.progress >= 50 ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200'
              const tagText = goal.progress >= 90 ? `${goal.progress}% Reached` : goal.progress >= 50 ? `${goal.progress}% Reached` : 'Steady Progress'

              return (
                <div key={goal.id} className="p-4 rounded-xl bg-navy-900/[0.02] border border-navy-900/[0.06] hover:border-navy-900/15 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg bg-navy-900/[0.06] flex items-center justify-center">
                      <Target size={16} className="text-navy-900/50" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tagColor}`}>
                      {tagText}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-navy-900 mb-0.5">{goal.name}</h3>
                  <p className="text-[10px] text-navy-900/40">Target: {goal.target} · {goal.deadline}</p>

                  {/* Progress Bar */}
                  <div className="mt-3 h-1.5 bg-navy-900/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${goal.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`h-full ${progressColor} rounded-full`}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-bold text-navy-900">₹ {goal.saved} Saved</span>
                    <span className="text-xs text-navy-900/40">{goal.remaining}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-6"
        >
          <p className="text-[10px] text-navy-900/25">
            COLLABORATIVE FINANCIAL SUITE · Couple's planner recommendations are based on combined
            financial profiles and Indian tax regulations (FY 2024-25). Cross-income optimizations
            are estimates. Consult your chartered accountant for final verification.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
