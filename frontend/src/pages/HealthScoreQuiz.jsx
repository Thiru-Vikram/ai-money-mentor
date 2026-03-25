import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts'
import PageLayout from '../components/PageLayout'
import { ChevronRight, Check, Bot, TrendingUp } from 'lucide-react'

// ─── QUESTIONS ───────────────────────────────────────────────
const QUESTIONS = [
  { dim: 'Emergency', id: 'q1', label: 'EMERGENCY FUND',
    text: 'How many months of expenses do you have in liquid savings?',
    options: [{ text: 'Less than 1 month', score: 10 }, { text: '1–3 months', score: 40 }, { text: '3–6 months', score: 75 }, { text: '6+ months', score: 100 }] },
  { dim: 'Emergency', id: 'q2', label: 'EMERGENCY FUND',
    text: 'Where is your emergency fund parked?',
    options: [{ text: 'No emergency fund', score: 0 }, { text: 'Savings account', score: 50 }, { text: 'Liquid MF / FD', score: 90 }, { text: 'Mix + instant access', score: 100 }] },
  { dim: 'Insurance', id: 'q3', label: 'INSURANCE COVERAGE',
    text: 'What is your life insurance cover as a multiple of your annual income?',
    options: [{ text: 'No life cover', score: 0 }, { text: 'Under 5x', score: 30 }, { text: '5–10x', score: 65 }, { text: '10x or more', score: 100 }] },
  { dim: 'Insurance', id: 'q4', label: 'INSURANCE COVERAGE',
    text: 'Do you have health insurance independent of employer?',
    options: [{ text: 'Only employer cover', score: 30 }, { text: 'Individual + employer', score: 75 }, { text: 'Family floater ≥ ₹10L', score: 100 }, { text: 'No cover', score: 0 }] },
  { dim: 'Diversification', id: 'q5', label: 'INVESTMENT MIX',
    text: 'What does your investment portfolio look like?',
    options: [{ text: 'Only FD/savings', score: 20 }, { text: 'FD + some equity', score: 55 }, { text: 'Equity + debt + gold', score: 90 }, { text: 'Multi-asset with rebalancing', score: 100 }] },
  { dim: 'Diversification', id: 'q6', label: 'INVESTMENT MIX',
    text: 'How many funds do you hold in your MF portfolio?',
    options: [{ text: 'None', score: 0 }, { text: '1–2', score: 50 }, { text: '3–5 complementary', score: 95 }, { text: '6+ (likely over-diversified)', score: 60 }] },
  { dim: 'Debt', id: 'q7', label: 'DEBT HEALTH',
    text: 'What % of your monthly income goes to EMIs?',
    options: [{ text: 'No EMIs', score: 100 }, { text: 'Under 20%', score: 80 }, { text: '20–40%', score: 50 }, { text: 'Over 40%', score: 15 }] },
  { dim: 'Debt', id: 'q8', label: 'DEBT HEALTH',
    text: 'Do you pay your full credit card bill every month?',
    options: [{ text: 'Always full payment', score: 100 }, { text: 'Usually', score: 70 }, { text: 'Sometimes minimum', score: 25 }, { text: 'Often missed', score: 0 }] },
  { dim: 'Tax', id: 'q9', label: 'TAX EFFICIENCY',
    text: 'Have you compared Old vs New income tax regime for the current year?',
    options: [{ text: 'Yes, with a CA', score: 100 }, { text: 'Yes, self-calculated', score: 80 }, { text: 'No, just went with default', score: 20 }, { text: 'Don\'t know there\'s a choice', score: 0 }] },
  { dim: 'Tax', id: 'q10', label: 'TAX EFFICIENCY',
    text: 'Are you maximizing your 80C deductions (₹1.5L limit)?',
    options: [{ text: 'Fully maxed out', score: 100 }, { text: 'Partially (>₹75K)', score: 60 }, { text: 'Partially (<₹75K)', score: 30 }, { text: 'Not claiming at all', score: 0 }] },
  { dim: 'Retirement', id: 'q11', label: 'RETIREMENT READINESS',
    text: 'Are you investing specifically for retirement beyond EPF?',
    options: [{ text: 'NPS + equity MF', score: 100 }, { text: 'Equity MF only', score: 75 }, { text: 'PPF only', score: 60 }, { text: 'Only EPF', score: 25 }, { text: 'Nothing extra', score: 0 }] },
  { dim: 'Retirement', id: 'q12', label: 'RETIREMENT READINESS',
    text: 'Do you know your FIRE number (target retirement corpus)?',
    options: [{ text: 'Yes, calculated precisely', score: 100 }, { text: 'Rough estimate', score: 60 }, { text: 'Not really', score: 20 }, { text: 'Never thought about it', score: 0 }] },
]

const DIMS = ['Emergency', 'Insurance', 'Diversification', 'Debt', 'Tax', 'Retirement']
const DIM_LABELS = {
  Emergency: 'Emergency Fund', Insurance: 'Insurance Coverage',
  Diversification: 'Investment Mix', Debt: 'Debt Health',
  Tax: 'Tax Efficiency', Retirement: 'Retirement Readiness',
}

function scoreColor(s) {
  if (s >= 70) return '#10b981'
  if (s >= 45) return '#f59e0b'
  return '#ef4444'
}

// Animated SVG score ring
function ScoreRing({ score, size = 180 }) {
  const [p, setP] = useState(0)
  useEffect(() => {
    const start = Date.now()
    const raf = () => {
      const t = Math.min((Date.now() - start) / 1200, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setP(Math.round(score * eased))
      if (t < 1) requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [score])
  const r = (size - 24) / 2
  const circ = 2 * Math.PI * r
  const color = scoreColor(p)
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth={9} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ - (circ * p) / 100}
          style={{ transition: 'stroke-dashoffset 0.05s', filter: `drop-shadow(0 0 10px ${color}80)` }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl num" style={{ color, lineHeight: 1 }}>{p}</span>
        <span className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>/ 100</span>
        <span className="text-xs font-bold mt-1" style={{ color }}>
          {score >= 70 ? 'Good' : score >= 45 ? 'Fair' : 'Needs Work'}
        </span>
      </div>
    </div>
  )
}

// AI advice generator
function genAdvice(dim, score) {
  const tips = {
    Emergency: score < 50 ? 'Build 6 months of expenses in a liquid fund first. This is your financial safety net — everything else waits.' : 'Emergency fund is healthy. Make sure it earns 6–7% in a liquid MF, not 3.5% in a savings account.',
    Insurance: score < 50 ? 'You are severely underinsured. Get a ₹1Cr term plan for under ₹12,000/year and a ₹10L family floater health plan immediately.' : 'Good coverage. Check if your employer health cover includes parents — most don\'t.',
    Diversification: score < 50 ? 'You likely have all your money in FDs or savings. Add a Nifty 50 index fund SIP — even ₹1,000/mo to start.' : 'Check your MF portfolio via Portfolio X-Ray for hidden overlap between funds.',
    Debt: score < 50 ? 'High EMI burden is your biggest wealth destroyer. Aggressively prepay high-interest debt (personal loans, CC) before investing.' : 'Debt under control. Use 80C deductions to reduce your home loan EMI burden further.',
    Tax: score < 50 ? 'You are leaving ₹30,000–₹62,000/year on the table by not comparing tax regimes. Run the Tax Wizard to see which regime saves you more.' : 'Good start. Also explore: NPS 80CCD(1B) ₹50K extra deduction, HRA optimization if renting.',
    Retirement: score < 50 ? 'Start a Nifty 50 index SIP dedicated to retirement — as little as ₹2,000/mo started at 28 becomes ₹2Cr by 58 at 12% CAGR.' : 'On track. Aim to increase your SIP by 10% every April. This "SIP step-up" doubles your corpus.',
  }
  return tips[dim] || ''
}

export default function HealthScoreQuiz() {
  const [answers, setAnswers] = useState({})
  const [step, setStep] = useState(0) // 0-based index
  const [stage, setStage] = useState('quiz') // 'quiz' | 'results'
  const [selected, setSelected] = useState(null)

  const q = QUESTIONS[step]
  const total = QUESTIONS.length
  const progress = (step / total) * 100

  const dimScores = useMemo_lite(() => {
    const scores = {}
    for (const dim of DIMS) {
      const qs = QUESTIONS.filter(q => q.dim === dim)
      const answered = qs.filter(q => answers[q.id] !== undefined)
      if (answered.length === 0) { scores[dim] = 0; continue }
      scores[dim] = Math.round(answered.reduce((s, q) => s + answers[q.id], 0) / answered.length)
    }
    return scores
  }, [answers])

  const overall = Math.round(Object.values(dimScores).reduce((s, v) => s + v, 0) / DIMS.length)

  function pick(score) {
    setSelected(score)
    setTimeout(() => {
      setAnswers(a => ({ ...a, [q.id]: score }))
      setSelected(null)
      if (step < total - 1) setStep(s => s + 1)
      else setStage('results')
    }, 320)
  }

  function reset() { setAnswers({}); setStep(0); setStage('quiz'); setSelected(null) }

  const radarData = DIMS.map(d => ({ dim: d.substring(0, 5), score: dimScores[d] }))

  const weakest = DIMS.reduce((w, d) => dimScores[d] < dimScores[w] ? d : w, DIMS[0])
  const strongest = DIMS.reduce((s, d) => dimScores[d] > dimScores[s] ? d : s, DIMS[0])

  if (stage === 'results') {
    return (
      <PageLayout
        title={<>Your Money <em className="text-gradient-blue not-italic">Health Score</em></>}
        subtitle="Based on your answers across 6 financial dimensions."
      >
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Score ring */}
          <div className="card p-8 flex flex-col items-center gap-6">
            <ScoreRing score={overall} size={190} />

            {/* Headline insights */}
            <div className="w-full space-y-3">
              <div className="headline-insight">
                <p className="text-xs font-bold mb-0.5" style={{ color: 'var(--color-gain)' }}>⚠️ Weakest area</p>
                <p className="text-sm" style={{ color: '#e2e8f0' }}>{DIM_LABELS[weakest]}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-label)' }}>Score: {dimScores[weakest]}/100 — focus here first</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <p className="text-xs font-bold mb-0.5" style={{ color: 'var(--color-growth)' }}>✅ Strongest area</p>
                <p className="text-sm" style={{ color: '#e2e8f0' }}>{DIM_LABELS[strongest]}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-label)' }}>Score: {dimScores[strongest]}/100 — keep it up</p>
              </div>
            </div>
            <button onClick={reset} className="btn-ghost w-full justify-center text-xs">Retake Quiz</button>
          </div>

          {/* Dimension bars */}
          <div className="card p-7 space-y-5">
            <p className="text-xs font-semibold" style={{ color: 'var(--color-label)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Dimension Scores
            </p>
            {DIMS.map((d, i) => {
              const s = dimScores[d]
              const color = scoreColor(s)
              return (
                <motion.div key={d} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span style={{ color: 'var(--color-label)' }}>{DIM_LABELS[d]}</span>
                    <span className="font-bold num" style={{ color }}>{s}</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s}%` }}
                      transition={{ delay: i * 0.07 + 0.1, duration: 0.7, ease: 'easeOut' }}
                      className="progress-fill"
                      style={{ background: color, boxShadow: `0 0 6px ${color}40` }}
                    />
                  </div>
                </motion.div>
              )
            })}

            {/* Radar */}
            <div className="mt-4 pt-5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <ResponsiveContainer width="100%" height={180}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(148,163,184,0.08)" />
                  <PolarAngleAxis dataKey="dim" tick={{ fill: 'var(--color-muted)', fontSize: 10 }} />
                  <Radar dataKey="score" stroke="var(--color-ai)" fill="var(--color-ai)" fillOpacity={0.15} strokeWidth={1.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="space-y-4">
            <p className="text-xs font-semibold" style={{ color: 'var(--color-label)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              AI Recommendations
            </p>
            {DIMS.filter(d => dimScores[d] < 75).sort((a, b) => dimScores[a] - dimScores[b]).slice(0, 4).map((d, i) => (
              <motion.div
                key={d}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card-ai p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)' }}>
                    <Bot size={10} style={{ color: 'var(--color-ai)' }} />
                  </div>
                  <span className="text-xs font-bold" style={{ color: 'var(--color-ai)' }}>{DIM_LABELS[d]}</span>
                  <span className="text-xs num" style={{ color: scoreColor(dimScores[d]) }}>Score: {dimScores[d]}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-label)' }}>
                  {genAdvice(d, dimScores[d])}
                </p>
              </motion.div>
            ))}
            <p className="source-label">Advice based on standard Indian financial planning guidelines · FY2024-25</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout
      title={<>Money <em className="text-gradient-blue not-italic">Health Score</em></>}
      subtitle="12 questions across 6 financial dimensions. Takes 3 minutes. Reveals where you're losing money silently."
    >
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-8 space-y-3">
          <div className="flex justify-between text-xs" style={{ color: 'var(--color-muted)' }}>
            <span>Question {step + 1} of {total}</span>
            <span className="num" style={{ color: 'var(--color-trust)' }}>{Math.round((step / total) * 100)}% complete</span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
              style={{ background: 'var(--color-trust)', boxShadow: '0 0 8px rgba(59,130,246,0.4)' }}
            />
          </div>
          {/* Dimension pills */}
          <div className="flex flex-wrap gap-2">
            {DIMS.map(d => {
              const active = q.dim === d
              const done = QUESTIONS.filter(q => q.dim === d).every(q => answers[q.id] !== undefined)
              return (
                <span key={d} className={`tag ${active ? 'tag-blue' : done ? 'tag-green' : ''}`}
                  style={!active && !done ? { background: 'var(--bg-700)', border: '1px solid var(--border-subtle)', color: 'var(--color-muted)' } : {}}>
                  {done && !active && <Check size={8} />}
                  {DIM_LABELS[d].split(' ')[0]}
                </span>
              )
            })}
          </div>
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
            className="card p-8"
          >
            <span className="tag-blue mb-4 block w-fit">{q.label}</span>
            <h2 className="font-display text-xl font-normal mb-6 leading-snug" style={{ color: '#f1f5f9' }}>
              {q.text}
            </h2>

            <div className="space-y-2.5">
              {q.options.map(opt => (
                <button
                  key={opt.text}
                  onClick={() => pick(opt.score)}
                  className="w-full text-left px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200"
                  style={{
                    background: selected === opt.score ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)',
                    border: selected === opt.score ? '1px solid rgba(59,130,246,0.5)' : '1px solid var(--border-subtle)',
                    color: selected === opt.score ? '#60a5fa' : '#e2e8f0',
                    transform: selected === opt.score ? 'scale(0.99)' : 'none',
                  }}
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Skip / Back */}
        <div className="flex justify-between mt-5">
          {step > 0 ? (
            <button onClick={() => setStep(s => Math.max(0, s - 1))} className="btn-ghost text-xs px-3 py-2">
              ← Back
            </button>
          ) : <div />}
          <button
            onClick={() => { setAnswers(a => ({ ...a, [q.id]: 50 })); if (step < total - 1) setStep(s => s + 1); else setStage('results') }}
            className="text-xs cursor-pointer transition-colors"
            style={{ color: 'var(--color-muted)' }}
          >
            Skip →
          </button>
        </div>
      </div>
    </PageLayout>
  )
}

// Tiny useMemo without import
function useMemo_lite(fn, deps) {
  const ref = useRef({ deps: null, value: null })
  if (!ref.current.deps || deps.some((d, i) => d !== ref.current.deps[i])) {
    ref.current.value = fn()
    ref.current.deps = deps
  }
  return ref.current.value
}
