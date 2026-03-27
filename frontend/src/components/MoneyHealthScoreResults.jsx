import { motion } from 'framer-motion'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { RefreshCcw } from 'lucide-react'

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

function ScoreBar({ value, color }) {
  return (
    <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
      />
    </div>
  )
}

export default function MoneyHealthScoreResults({ results, onRetake }) {
  const scoreData = [
    { dimension: 'Emergency', value: results.emergency || 0 },
    { dimension: 'Insurance', value: results.insurance || 0 },
    { dimension: 'Diversification', value: results.investments || 0 },
    { dimension: 'Debt Health', value: results.debt || 0 },
    { dimension: 'Tax Efficiency', value: results.tax || 0 },
    { dimension: 'Retirement', value: results.retirement || 0 },
  ]

  const overall = Math.round(scoreData.reduce((s, d) => s + d.value, 0) / scoreData.length)

  const getColor = (val) => {
    if (val >= 80) return '#10B981'; // green
    if (val >= 50) return '#F59E0B'; // yellow
    return '#EF4444'; // red
  }

  const dimensionDetails = [
    { label: 'Emergency Fund', value: results.emergency || 0, color: getColor(results.emergency) },
    { label: 'Insurance Coverage', value: results.insurance || 0, color: getColor(results.insurance) },
    { label: 'Investment Diversification', value: results.investments || 0, color: getColor(results.investments) },
    { label: 'Debt Health', value: results.debt || 0, color: getColor(results.debt) },
    { label: 'Tax Efficiency', value: results.tax || 0, color: getColor(results.tax) },
    { label: 'Retirement Readiness', value: results.retirement || 0, color: getColor(results.retirement) },
  ]

  // Identify biggest opportunity
  const sorted = [...scoreData].sort((a, b) => a.value - b.value)
  const biggestOpportunity = sorted[0].dimension

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight mb-2">
          Your Health <span className="gradient-text">Report</span>
        </h2>
        <p className="text-white/50 text-sm">Based on the 6 critical dimensions of your financial life.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* Overall Score */}
        <div className="glass-card p-6 space-y-5 border border-white/10">
          <div className="text-center py-4">
            <div className="relative inline-flex items-center justify-center w-28 h-28 mx-auto mb-3">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                <motion.circle
                  cx="50" cy="50" r="44"
                  fill="none"
                  stroke={getColor(overall)}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 44}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 44 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 44 * (1 - overall / 100) }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-white">{overall}</span>
                <span className="text-xs text-white/40">/100</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-white">Overall Score</p>
            <p className="text-xs font-medium mt-0.5" style={{ color: getColor(overall) }}>
              {overall >= 80 ? 'Excellent' : overall >= 50 ? 'Needs Attention' : 'Critical'}
            </p>
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
        </div>

        {/* Radar chart */}
        <div className="glass-card p-6 flex flex-col items-center h-full justify-between border border-white/10">
          <p className="text-sm font-semibold text-white/70 mb-4 self-start">Dimension Radar</p>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart cx="50%" cy="50%" outerRadius="72%" data={scoreData}>
              <PolarGrid stroke="rgba(255,255,255,0.07)" />
              <PolarAngleAxis
                dataKey="dimension"
                tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 10, fontFamily: 'Plus Jakarta Sans' }}
              />
              <Radar
                name="Score"
                dataKey="value"
                stroke={getColor(overall)}
                fill={getColor(overall)}
                fillOpacity={0.18}
                strokeWidth={2}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>

          <div className="mt-4 w-full space-y-3">
            <div className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-xs text-white/50">Biggest opportunity for improvement</p>
              <p className="text-sm font-bold mt-0.5" style={{ color: getColor(overall) }}>{biggestOpportunity}</p>
            </div>
            <button
              onClick={onRetake}
              className="w-full flex justify-center items-center gap-2 py-3 border border-white/10 hover:bg-white/10 text-white/80 transition-colors rounded-xl text-sm font-medium"
            >
              <RefreshCcw size={16} /> Update Details
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
