import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const SAMPLE_SCORES = [
  { dim: 'Emergency', score: 58, label: 'Emergency Fund' },
  { dim: 'Insurance', score: 42, label: 'Insurance Coverage' },
  { dim: 'Diversification', score: 73, label: 'Investment Mix' },
  { dim: 'Debt', score: 82, label: 'Debt Health' },
  { dim: 'Tax', score: 35, label: 'Tax Efficiency' },
  { dim: 'Retirement', score: 61, label: 'Retirement Readiness' },
]
const OVERALL = Math.round(SAMPLE_SCORES.reduce((s, d) => s + d.score, 0) / SAMPLE_SCORES.length)

// Circular progress ring
function ScoreRing({ score, size = 200, animate: doAnimate = true }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!inView) return
    const start = Date.now()
    const duration = 1200
    const raf = () => {
      const elapsed = Date.now() - start
      const t = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setProgress(Math.round(score * eased))
      if (t < 1) requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [inView, score])

  const radius = (size - 28) / 2
  const circumference = 2 * Math.PI * radius
  const dashoffset = circumference - (circumference * progress) / 100

  const scoreColor = score >= 70 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'
  const scoreGrade = score >= 70 ? 'Good' : score >= 50 ? 'Fair' : 'Needs Work'

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth={10}
          />
          {/* Fill */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={scoreColor}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            style={{ transition: 'stroke-dashoffset 0.05s linear', filter: `drop-shadow(0 0 8px ${scoreColor}60)` }}
          />
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-5xl font-normal num" style={{ color: scoreColor, lineHeight: 1 }}>
            {progress}
          </span>
          <span className="text-xs mt-1 font-medium" style={{ color: 'var(--color-muted)' }}>/ 100</span>
          <span className="text-xs font-bold mt-1" style={{ color: scoreColor }}>{scoreGrade}</span>
        </div>
      </div>
      <p className="text-xs mt-2" style={{ color: 'var(--color-muted)' }}>Money Health Score</p>
    </div>
  )
}

function DimBar({ dim, delay }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const color = dim.score >= 70 ? '#10b981' : dim.score >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -10 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration: 0.4 }}
      className="space-y-1.5"
    >
      <div className="flex justify-between text-xs">
        <span style={{ color: 'var(--color-label)' }}>{dim.label}</span>
        <span className="font-semibold num" style={{ color }}>{dim.score}</span>
      </div>
      <div className="progress-bar">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={inView ? { width: `${dim.score}%` } : {}}
          transition={{ delay: delay + 0.1, duration: 0.8, ease: 'easeOut' }}
          style={{ background: color, boxShadow: `0 0 8px ${color}40` }}
        />
      </div>
    </motion.div>
  )
}

export default function MoneyHealthScore() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  const weakest = SAMPLE_SCORES.reduce((w, d) => d.score < w.score ? d : w, SAMPLE_SCORES[0])

  return (
    <section ref={ref} className="py-24 relative" style={{ borderTop: '1px solid var(--border-subtle)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <div className="tag-blue mx-auto mb-4">
            Your Financial Wellness
          </div>
          <h2 className="font-display text-4xl font-normal" style={{ color: '#f1f5f9' }}>
            Money Health Score
          </h2>
          <p className="mt-3 text-sm max-w-lg mx-auto" style={{ color: 'var(--color-label)' }}>
            Answer 12 questions across 6 dimensions to get your personalized financial wellness score.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Score ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="card p-8 flex flex-col items-center gap-6"
          >
            <ScoreRing score={OVERALL} size={200} />

            {/* Headline insight */}
            <div className="headline-insight w-full text-center">
              <p className="text-xs font-bold mb-1" style={{ color: 'var(--color-gain)' }}>💡 Key Insight</p>
              <p className="text-sm" style={{ color: 'var(--color-label)' }}>
                Your <strong style={{ color: '#fff' }}>{weakest.label}</strong> score is low.
                This is where you lose the most money silently.
              </p>
            </div>

            <Link to="/health-score" className="btn-primary w-full justify-center">
              Take the Quiz <ArrowRight size={13} />
            </Link>
          </motion.div>

          {/* Dimension bars — 2×3 grid */}
          <div className="lg:col-span-2 card p-7">
            <p className="text-xs font-semibold mb-6" style={{ color: 'var(--color-label)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              6 Dimensions · Sample Results
            </p>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
              {SAMPLE_SCORES.map((d, i) => (
                <DimBar key={d.dim} dim={d} delay={i * 0.08} />
              ))}
            </div>

            {/* Radar chart */}
            <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <p className="text-xs mb-4" style={{ color: 'var(--color-muted)' }}>Radar view</p>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={SAMPLE_SCORES}>
                  <PolarGrid stroke="rgba(148,163,184,0.1)" />
                  <PolarAngleAxis
                    dataKey="dim"
                    tick={{ fill: 'var(--color-label)', fontSize: 10, fontFamily: 'Sora' }}
                  />
                  <Radar
                    dataKey="score"
                    stroke="var(--color-ai)"
                    fill="var(--color-ai)"
                    fillOpacity={0.12}
                    strokeWidth={1.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
