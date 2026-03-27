import { useState, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, ArrowRight, ArrowLeft, User, Wallet, PiggyBank, Target, Plus, X, Loader2, Sparkles, RotateCcw, TrendingUp, Shield, Receipt, Calendar, ChevronRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

// Icons mapped to common FIRE section keywords
const SECTION_META = [
  { match: ['summary', 'fire summary', 'fire number'], icon: Flame, color: 'orange' },
  { match: ['sip', 'allocation', 'investment'], icon: TrendingUp, color: 'emerald' },
  { match: ['goal', 'breakdown'], icon: Target, color: 'blue' },
  { match: ['timeline', 'milestone', 'year'], icon: Calendar, color: 'purple' },
  { match: ['insurance', 'safety', 'emergency'], icon: Shield, color: 'cyan' },
  { match: ['tax', 'saving', 'deduction', '80c', 'regime'], icon: Receipt, color: 'amber' },
]

function getSectionMeta(title) {
  const lower = title.toLowerCase()
  for (const s of SECTION_META) {
    if (s.match.some(kw => lower.includes(kw))) return s
  }
  return { icon: Sparkles, color: 'orange' }
}

function parseSections(markdown) {
  if (!markdown) return []
  const lines = markdown.split('\n')
  const sections = []
  let current = null

  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.+)/)
    if (h2Match) {
      if (current) sections.push(current)
      const rawTitle = h2Match[1].replace(/[🔥📊🎯📅🛡️💰]/g, '').trim()
      const emoji = h2Match[1].match(/[🔥📊🎯📅🛡️💰]/)?.[0] || '✨'
      current = { title: rawTitle, emoji, content: '', ...getSectionMeta(rawTitle) }
    } else if (current) {
      current.content += line + '\n'
    }
  }
  if (current) sections.push(current)
  return sections
}

function HeroStats({ formData }) {
  const yearsToFire = Math.max(0, formData.retirementAge - formData.currentAge)
  const annualExpenses = formData.monthlyExpenses * 12
  const fireNumber = Math.round(annualExpenses * 25 * Math.pow(1.06, yearsToFire))
  const savingsRate = formData.monthlyIncome > 0 ? Math.round(((formData.monthlyIncome - formData.monthlyExpenses) / formData.monthlyIncome) * 100) : 0
  const monthlySurplus = formData.monthlyIncome - formData.monthlyExpenses

  const formatCr = (v) => {
    if (v >= 10000000) return `₹${(v / 10000000).toFixed(1)}Cr`
    if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`
    return `₹${new Intl.NumberFormat('en-IN').format(v)}`
  }

  const stats = [
    { label: 'FIRE Number', value: formatCr(fireNumber), sub: '25× expenses (inflation adj.)', color: 'text-orange-400' },
    { label: 'Years to FIRE', value: `${yearsToFire} yrs`, sub: `Age ${formData.currentAge} → ${formData.retirementAge}`, color: 'text-red-400' },
    { label: 'Savings Rate', value: `${savingsRate}%`, sub: savingsRate >= 50 ? 'FIRE-ready!' : 'Target 50%+', color: savingsRate >= 50 ? 'text-green-400' : 'text-yellow-400' },
    { label: 'Monthly Surplus', value: formatCr(monthlySurplus), sub: 'Available to invest', color: 'text-emerald-400' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {stats.map(s => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card border border-white/10 rounded-xl p-4 text-center"
        >
          <p className={`text-xl sm:text-2xl font-extrabold ${s.color}`}>{s.value}</p>
          <p className="text-xs font-semibold text-white/80 mt-1">{s.label}</p>
          <p className="text-[10px] text-white/35 mt-0.5">{s.sub}</p>
        </motion.div>
      ))}
    </div>
  )
}

function TabbedResult({ sections, activeTab, setActiveTab }) {
  const active = sections[activeTab]
  if (!active) return null
  const Icon = active.icon
  const colorMap = {
    orange: 'border-orange-500/40 bg-orange-500/10 text-orange-400',
    emerald: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
    blue: 'border-blue-500/40 bg-blue-500/10 text-blue-400',
    purple: 'border-purple-500/40 bg-purple-500/10 text-purple-400',
    cyan: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400',
    amber: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
  }
  const tabBg = {
    orange: 'bg-orange-500/20 border-orange-500/40 text-orange-300',
    emerald: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
    blue: 'bg-blue-500/20 border-blue-500/40 text-blue-300',
    purple: 'bg-purple-500/20 border-purple-500/40 text-purple-300',
    cyan: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300',
    amber: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
  }

  return (
    <div>
      {/* Tab bar — horizontal scroll on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
        {sections.map((s, i) => {
          const SIcon = s.icon
          const isActive = i === activeTab
          return (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all duration-200 ${
                isActive
                  ? tabBg[s.color] || tabBg.orange
                  : 'bg-white/[0.03] border-white/[0.06] text-white/40 hover:text-white/60 hover:border-white/10'
              }`}
            >
              <SIcon size={13} />
              {s.title.length > 22 ? s.title.slice(0, 20) + '…' : s.title}
            </button>
          )
        })}
      </div>

      {/* Active section content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className={`glass-card border rounded-2xl p-5 sm:p-6 ${colorMap[active.color]?.split(' ').filter(c => c.startsWith('border-'))[0] || 'border-white/10'} border-opacity-30`}
          style={{ borderColor: undefined }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${colorMap[active.color] || colorMap.orange}`}>
              <Icon size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{active.emoji} {active.title}</h3>
            </div>
          </div>
          <div className="prose prose-invert max-w-none prose-sm
            prose-headings:text-white prose-headings:font-bold
            prose-h3:text-sm prose-h3:mt-4 prose-h3:mb-2
            prose-p:text-white/70 prose-p:text-sm prose-p:leading-relaxed prose-p:my-2
            prose-li:text-white/70 prose-li:text-sm prose-li:my-0.5
            prose-strong:text-white
            prose-table:text-xs
            prose-th:text-white/80 prose-th:font-semibold prose-th:text-left prose-th:px-2 prose-th:py-1.5 prose-th:bg-white/[0.04] prose-th:border prose-th:border-white/[0.06]
            prose-td:text-white/60 prose-td:px-2 prose-td:py-1.5 prose-td:border prose-td:border-white/[0.06]
          ">
            <ReactMarkdown>{active.content.trim()}</ReactMarkdown>
          </div>

          {/* Nav hint */}
          {activeTab < sections.length - 1 && (
            <button
              onClick={() => setActiveTab(prev => prev + 1)}
              className="mt-4 flex items-center gap-1.5 text-xs font-medium text-white/30 hover:text-white/60 transition-colors"
            >
              Next: {sections[activeTab + 1]?.title} <ChevronRight size={12} />
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

const MotionDiv = motion.div

const STEPS = [
  { id: 0, label: 'Personal', icon: User },
  { id: 1, label: 'Income', icon: Wallet },
  { id: 2, label: 'Investments', icon: PiggyBank },
  { id: 3, label: 'Goals', icon: Target },
]

const formatINR = (val) => {
  if (!val && val !== 0) return ''
  return new Intl.NumberFormat('en-IN').format(val)
}

const parseINR = (str) => {
  const cleaned = str.replace(/[^0-9]/g, '')
  return cleaned === '' ? '' : Number(cleaned)
}

function SliderInput({ label, value, onChange, min, max, step = 1, prefix = '', suffix = '', icon: Icon }) {
  return (
    <div className="mb-5">
      <div className="flex justify-between mb-2 gap-4">
        <label className="text-sm font-medium text-white/80 flex items-center gap-2">
          {Icon && <Icon size={15} className="text-orange-400" />}
          {label}
        </label>
        <div className="flex items-center gap-1">
          {prefix && <span className="text-white/40 text-sm">{prefix}</span>}
          <input
            type="text"
            inputMode="numeric"
            value={typeof value === 'number' ? formatINR(value) : value}
            onChange={(e) => {
              const parsed = parseINR(e.target.value)
              if (parsed !== '' && !isNaN(parsed)) onChange(Math.min(max, Math.max(min, parsed)))
              else if (parsed === '') onChange(min)
            }}
            className="bg-transparent border-b border-white/20 text-white font-bold w-28 text-right focus:outline-none focus:border-orange-400 text-sm"
          />
          {suffix && <span className="text-white/40 text-sm">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500"
      />
    </div>
  )
}

function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-1 mb-8">
      {STEPS.map((s, i) => {
        const Icon = s.icon
        const isActive = i === currentStep
        const isDone = i < currentStep
        return (
          <div key={s.id} className="flex items-center">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
              isActive
                ? 'bg-orange-500/20 border border-orange-500/40 text-orange-400'
                : isDone
                  ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                  : 'bg-white/[0.04] border border-white/[0.06] text-white/30'
            }`}>
              <Icon size={12} />
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-6 h-px mx-1 ${isDone ? 'bg-green-500/40' : 'bg-white/10'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function GoalRow({ goal, onUpdate, onRemove }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
      <input
        type="text"
        placeholder="Goal name (e.g. Buy a house)"
        value={goal.name}
        onChange={(e) => onUpdate({ ...goal, name: e.target.value })}
        className="flex-1 bg-transparent text-sm text-white placeholder-white/25 focus:outline-none"
      />
      <input
        type="text"
        inputMode="numeric"
        placeholder="₹ Amount"
        value={goal.amount ? formatINR(goal.amount) : ''}
        onChange={(e) => onUpdate({ ...goal, amount: parseINR(e.target.value) })}
        className="w-28 bg-transparent text-sm text-white text-right placeholder-white/25 focus:outline-none border-b border-white/10 focus:border-orange-400"
      />
      <input
        type="number"
        placeholder="Yrs"
        min={1}
        max={40}
        value={goal.years || ''}
        onChange={(e) => onUpdate({ ...goal, years: e.target.value })}
        className="w-14 bg-transparent text-sm text-white text-right placeholder-white/25 focus:outline-none border-b border-white/10 focus:border-orange-400"
      />
      <button onClick={onRemove} className="text-white/20 hover:text-red-400 transition-colors">
        <X size={16} />
      </button>
    </div>
  )
}

export default function FirePathPlanner() {
  const [step, setStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [roadmap, setRoadmap] = useState(null)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState(0)
  const resultRef = useRef(null)

  const sections = useMemo(() => parseSections(roadmap), [roadmap])

  // Form state
  const [formData, setFormData] = useState({
    currentAge: 28,
    retirementAge: 45,
    monthlyIncome: 150000,
    monthlyExpenses: 60000,
    annualBonus: 200000,
    currentSavings: 500000,
    existingSips: 20000,
    ppfEpfBalance: 300000,
    emergencyFund: 100000,
    lifeGoals: [
      { name: 'Buy a house', amount: 5000000, years: 5 },
    ],
  })

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }))

  const addGoal = () => {
    setFormData(prev => ({
      ...prev,
      lifeGoals: [...prev.lifeGoals, { name: '', amount: '', years: '' }]
    }))
  }

  const updateGoal = (idx, updated) => {
    setFormData(prev => ({
      ...prev,
      lifeGoals: prev.lifeGoals.map((g, i) => i === idx ? updated : g)
    }))
  }

  const removeGoal = (idx) => {
    setFormData(prev => ({
      ...prev,
      lifeGoals: prev.lifeGoals.filter((_, i) => i !== idx)
    }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)
    setRoadmap(null)

    try {
      const response = await fetch('http://localhost:8080/api/fire/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()

      if (response.ok && data.response) {
        setRoadmap(data.response)
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
      } else {
        setError(data.error || 'Failed to generate roadmap. Please try again.')
      }
    } catch (err) {
      console.error(err)
      setError("Couldn't reach the backend server. Make sure Spring Boot is running on port 8080.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetPlanner = () => {
    setRoadmap(null)
    setError(null)
    setStep(0)
    setActiveTab(0)
  }

  const canProceed = () => {
    if (step === 0) return formData.currentAge > 0 && formData.retirementAge > formData.currentAge
    if (step === 1) return formData.monthlyIncome > 0 && formData.monthlyExpenses > 0
    return true
  }

  const renderStep = () => {
    const variants = {
      enter: { opacity: 0, x: 30 },
      center: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -30 },
    }

    return (
      <AnimatePresence mode="wait">
        <MotionDiv
          key={step}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25 }}
        >
          {step === 0 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Personal Info</h3>
              <p className="text-white/40 text-sm mb-6">Let's start with the basics about you.</p>
              <SliderInput label="Current Age" value={formData.currentAge} onChange={v => updateField('currentAge', v)} min={18} max={65} suffix="yrs" icon={User} />
              <SliderInput label="Target Retirement Age" value={formData.retirementAge} onChange={v => updateField('retirementAge', v)} min={formData.currentAge + 1} max={80} suffix="yrs" icon={Flame} />
              <div className="mt-4 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <p className="text-xs text-orange-300 font-medium">
                  🔥 You have <span className="text-white font-bold">{Math.max(0, formData.retirementAge - formData.currentAge)} years</span> to achieve FIRE
                </p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Income & Expenses</h3>
              <p className="text-white/40 text-sm mb-6">Your monthly cash flow determines your savings runway.</p>
              <SliderInput label="Monthly Income" value={formData.monthlyIncome} onChange={v => updateField('monthlyIncome', v)} min={10000} max={1000000} step={5000} prefix="₹" icon={Wallet} />
              <SliderInput label="Monthly Expenses" value={formData.monthlyExpenses} onChange={v => updateField('monthlyExpenses', v)} min={5000} max={500000} step={5000} prefix="₹" icon={Wallet} />
              <SliderInput label="Annual Bonus" value={formData.annualBonus} onChange={v => updateField('annualBonus', v)} min={0} max={2000000} step={10000} prefix="₹" icon={Wallet} />
              {formData.monthlyIncome > formData.monthlyExpenses && (
                <div className="mt-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                  <p className="text-xs text-green-300 font-medium">
                    💚 Current savings rate: <span className="text-white font-bold">{Math.round(((formData.monthlyIncome - formData.monthlyExpenses) / formData.monthlyIncome) * 100)}%</span> — {((formData.monthlyIncome - formData.monthlyExpenses) / formData.monthlyIncome) >= 0.5 ? 'Excellent! FIRE-ready pace.' : 'Good start! FIRE typically needs 50%+.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Existing Investments</h3>
              <p className="text-white/40 text-sm mb-6">What you've already built towards financial freedom.</p>
              <SliderInput label="Current Savings & Investments" value={formData.currentSavings} onChange={v => updateField('currentSavings', v)} min={0} max={50000000} step={50000} prefix="₹" icon={PiggyBank} />
              <SliderInput label="Existing Monthly SIPs" value={formData.existingSips} onChange={v => updateField('existingSips', v)} min={0} max={500000} step={1000} prefix="₹" icon={PiggyBank} />
              <SliderInput label="PPF / EPF Balance" value={formData.ppfEpfBalance} onChange={v => updateField('ppfEpfBalance', v)} min={0} max={50000000} step={50000} prefix="₹" icon={PiggyBank} />
              <SliderInput label="Emergency Fund" value={formData.emergencyFund} onChange={v => updateField('emergencyFund', v)} min={0} max={5000000} step={10000} prefix="₹" icon={PiggyBank} />
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Life Goals</h3>
              <p className="text-white/40 text-sm mb-6">What are you saving for? Add goals and the AI will plan SIPs around each one.</p>
              <div className="space-y-3 mb-4">
                {formData.lifeGoals.map((goal, idx) => (
                  <GoalRow
                    key={idx}
                    goal={goal}
                    onUpdate={(updated) => updateGoal(idx, updated)}
                    onRemove={() => removeGoal(idx)}
                  />
                ))}
              </div>
              <button
                onClick={addGoal}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-white/10 text-white/40 text-sm hover:border-orange-500/40 hover:text-orange-400 transition-colors w-full justify-center"
              >
                <Plus size={14} /> Add another goal
              </button>
              {formData.lifeGoals.length === 0 && (
                <p className="text-center text-white/20 text-xs mt-4">No goals added yet. The AI will focus on general FIRE planning.</p>
              )}
            </div>
          )}
        </MotionDiv>
      </AnimatePresence>
    )
  }

  return (
    <section id="fire" className="py-24 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 bg-orange-900/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-red-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="section-tag mx-auto mb-4 border-orange-400/20 bg-orange-400/10 text-orange-400">
            <Flame size={11} />
            AI-Powered Planner
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">FIRE</span> Roadmap
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Input your financials. Our AI builds a complete month-by-month plan — SIP allocations, tax moves, insurance gaps, and your exact path to financial independence.
          </p>
        </div>

        {/* Form Card */}
        {!roadmap && (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="p-6 sm:p-8">
              <StepIndicator currentStep={step} />
              {renderStep()}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/[0.06]">
                <button
                  onClick={() => setStep(s => s - 1)}
                  disabled={step === 0}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft size={16} /> Back
                </button>

                {step < 3 ? (
                  <button
                    onClick={() => setStep(s => s + 1)}
                    disabled={!canProceed()}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
                  >
                    Next <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-sm hover:from-orange-400 hover:to-red-400 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Generating Roadmap...
                      </>
                    ) : (
                      <>
                        <Flame size={16} /> Generate My FIRE Roadmap
                      </>
                    )}
                  </button>
                )}
              </div>

              {error && (
                <MotionDiv
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm"
                >
                  {error}
                </MotionDiv>
              )}
            </div>
          </MotionDiv>
        )}

        {/* Loading Skeleton */}
        {isLoading && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 glass-card border border-white/10 rounded-2xl p-8 text-center"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center">
                <Loader2 size={28} className="text-orange-400 animate-spin" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">Building your FIRE roadmap...</p>
                <p className="text-white/40 text-sm mt-1">Our AI is crunching numbers across SIPs, taxes, insurance, and your life goals.</p>
              </div>
              <div className="w-full max-w-md mt-4 space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-4 rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-orange-500/20"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2, delay: i * 0.4, ease: 'easeInOut' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </MotionDiv>
        )}

        {/* AI Roadmap Result */}
        {roadmap && (
          <MotionDiv
            ref={resultRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Result header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center">
                  <Sparkles size={20} className="text-orange-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Your FIRE Roadmap</h3>
                  <p className="text-white/40 text-xs">AI-generated • {sections.length} sections</p>
                </div>
              </div>
              <button
                onClick={resetPlanner}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-white/50 text-sm hover:border-orange-500/30 hover:text-orange-400 transition-colors"
              >
                <RotateCcw size={14} /> Start Over
              </button>
            </div>

            {/* Hero stat cards */}
            <HeroStats formData={formData} />

            {/* Tabbed sections */}
            {sections.length > 0 ? (
              <TabbedResult sections={sections} activeTab={activeTab} setActiveTab={setActiveTab} />
            ) : (
              <div className="glass-card border border-white/10 rounded-2xl p-6">
                <div className="prose prose-invert prose-sm max-w-none prose-p:text-white/70 prose-strong:text-white prose-li:text-white/70">
                  <ReactMarkdown>{roadmap}</ReactMarkdown>
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <p className="text-center text-white/30 text-[10px] mt-6">
              * AI-generated roadmap for educational purposes only. Consult a SEBI-registered financial advisor before investing.
            </p>
          </MotionDiv>
        )}
      </div>
    </section>
  )
}
