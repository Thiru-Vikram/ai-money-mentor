import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip
} from 'recharts'
import { Activity } from 'lucide-react'

const scoreData = [
  { dimension: 'Emergency', value: 72 },
  { dimension: 'Insurance',  value: 58 },
  { dimension: 'Diversification', value: 81 },
  { dimension: 'Debt Health', value: 65 },
  { dimension: 'Tax Efficiency', value: 43 },
  { dimension: 'Retirement', value: 56 },
]

const overall = Math.round(scoreData.reduce((s, d) => s + d.value, 0) / scoreData.length)

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-navy-800/90 border border-white/10 backdrop-blur-md rounded-xl px-3 py-2 text-xs">
        <p className="text-white font-semibold">{payload[0].payload.dimension}</p>
        <p className="text-green-growth">{payload[0].value}<span className="text-white/40">/100</span></p>
      </div>
    )
  }
  return null
}

const dimensionDetails = [
  { label: 'Emergency Fund', value: 72, color: '#10B981', desc: '3.6 months of expenses covered' },
  { label: 'Insurance Coverage', value: 58, color: '#F59E0B', desc: 'Life cover gap: ₹48L' },
  { label: 'Investment Diversification', value: 81, color: '#10B981', desc: 'Well spread across 7 asset classes' },
  { label: 'Debt Health', value: 65, color: '#10B981', desc: 'EMI-to-income ratio: 28%' },
  { label: 'Tax Efficiency', value: 43, color: '#EF4444', desc: '₹54,000 in deductions missed' },
  { label: 'Retirement Readiness', value: 56, color: '#F59E0B', desc: 'FIRE gap: ₹82L at age 60' },
]

function ScoreBar({ value, color }) {
  return (
    <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
      />
    </div>
  )
}

export default function MoneyHealthScore({ onOpenFlow }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="health" className="py-24 relative">
      <div className="absolute inset-0 grid-dot-bg opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="section-tag mx-auto mb-4">
            <Activity size={11} />
            Money Health Score
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Your Financial <span className="gradient-text">Vital Signs</span>
          </h2>
          <p className="mt-4 text-white/50 max-w-xl mx-auto text-base leading-relaxed">
            Our AI audits <span className="text-white font-medium">2,000+ data points</span> to give
            you a score out of 100 across 6 critical dimensions.
          </p>
        </motion.div>

        {/* 3-col grid */}
        <div className="grid lg:grid-cols-3 gap-6 items-start">

          {/* Col 1: Overall + dimensions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="glass-card p-6 space-y-5"
          >
            <div className="text-center py-4">
              <div className="relative inline-flex items-center justify-center w-28 h-28 mx-auto mb-3">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                  <motion.circle
                    cx="50" cy="50" r="44"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 44}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 44 }}
                    animate={inView ? { strokeDashoffset: 2 * Math.PI * 44 * (1 - overall / 100) } : {}}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-white">{overall}</span>
                  <span className="text-xs text-white/40">/100</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-white">Overall Score</p>
              <p className="text-xs text-yellow-400 font-medium mt-0.5">Needs Attention</p>
            </div>

            <div className="space-y-3">
              {dimensionDetails.map(d => (
                <div key={d.label} className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/60">{d.label}</span>
                    <span className="text-xs font-bold" style={{ color: d.color }}>{d.value}</span>
                  </div>
                  <ScoreBar value={d.value} color={d.color} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Col 2: Radar chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="glass-card p-6 flex flex-col items-center"
          >
            <p className="text-sm font-semibold text-white/70 mb-4 self-start">Dimension Radar</p>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart cx="50%" cy="50%" outerRadius="72%" data={scoreData}>
                <PolarGrid stroke="rgba(255,255,255,0.07)" />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'Plus Jakarta Sans' }}
                />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.18}
                  strokeWidth={2}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="mt-4 w-full p-3 rounded-xl bg-green-growth/10 border border-green-growth/20 text-center">
              <p className="text-xs text-white/50">Biggest opportunity</p>
              <p className="text-sm font-bold text-green-growth mt-0.5">Tax Efficiency (+₹54,000/yr)</p>
            </div>
          </motion.div>

          {/* Col 3: Action items */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="glass-card p-6 space-y-4"
          >
            <p className="text-sm font-semibold text-white/70">AI Recommendations</p>
            {[
              {
                priority: 'Critical',
                color: 'text-red-400 bg-red-400/10 border-red-400/20',
                title: 'Claim Section 80D deductions',
                detail: 'Missing ₹25,000 health insurance deduction under old regime.',
              },
              {
                priority: 'High',
                color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
                title: 'Increase term insurance cover',
                detail: 'Current ₹50L cover is 3.2x income. Recommended: minimum 10x.',
              },
              {
                priority: 'Medium',
                color: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
                title: 'Start NPS for extra ₹50k deduction',
                detail: 'Section 80CCD(1B) allows ₹50,000 over and above 80C limit.',
              },
              {
                priority: 'Good',
                color: 'text-green-400 bg-green-400/10 border-green-400/20',
                title: 'Portfolio diversification is solid',
                detail: 'Low overlap across your 5 mutual funds. No action needed.',
              },
            ].map(item => (
              <div key={item.title} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.color}`}>
                    {item.priority}
                  </span>
                </div>
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="text-xs text-white/45 leading-relaxed">{item.detail}</p>
              </div>
            ))}

            <button onClick={onOpenFlow} className="btn-primary w-full justify-center text-sm mt-2">
              Get My Full Report
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
