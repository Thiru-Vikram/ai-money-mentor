import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Sparkles, Loader2, ChevronRight, ChevronLeft, Plus, X } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

const inputClass = "w-full bg-navy-900/[0.03] border border-navy-900/10 rounded-xl px-4 py-3 text-navy-900 font-bold text-sm focus:outline-none focus:border-navy-900/30 focus:ring-1 focus:ring-navy-900/15 transition-all placeholder-navy-900/25 font-mono"

async function fetchFirePlan(profile) {
  const response = await fetch('http://localhost:8080/api/fire/planner', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  })
  const data = await response.json()
  if (data.error) throw new Error(data.error)
  return data.response
}

export default function FirePathPlanner() {
  const [step, setStep] = useState('form') // form | loading | results
  const [formPage, setFormPage] = useState(0)
  const [aiResponse, setAiResponse] = useState('')
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    currentAge: '',
    retirementAge: '',
    monthlyIncome: '',
    monthlyExpenses: '',
    annualBonus: '',
    currentSavings: '',
    existingSips: '',
    ppfEpfBalance: '',
    emergencyFund: '',
    lifeGoals: [],
  })

  const [newGoal, setNewGoal] = useState({ name: '', years: '', amount: '' })

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addGoal = () => {
    if (!newGoal.name) return
    setFormData(prev => ({
      ...prev,
      lifeGoals: [...prev.lifeGoals, { ...newGoal, id: Date.now() }],
    }))
    setNewGoal({ name: '', years: '', amount: '' })
  }

  const removeGoal = (id) => {
    setFormData(prev => ({
      ...prev,
      lifeGoals: prev.lifeGoals.filter(g => g.id !== id),
    }))
  }

  const formPages = [
    {
      title: 'Personal Info',
      fields: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-900/50 uppercase tracking-wider mb-1.5">Current Age</label>
              <input type="number" value={formData.currentAge} onChange={e => handleChange('currentAge', e.target.value)} className={inputClass} placeholder="e.g. 28" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy-900/50 uppercase tracking-wider mb-1.5">Target Retirement Age</label>
              <input type="number" value={formData.retirementAge} onChange={e => handleChange('retirementAge', e.target.value)} className={inputClass} placeholder="e.g. 45" />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Income & Expenses',
      fields: (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy-900/50 uppercase tracking-wider mb-1.5">Monthly Post-Tax Income (₹)</label>
            <input type="number" value={formData.monthlyIncome} onChange={e => handleChange('monthlyIncome', e.target.value)} className={inputClass} placeholder="e.g. 150000" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy-900/50 uppercase tracking-wider mb-1.5">Monthly Expenses (₹)</label>
            <input type="number" value={formData.monthlyExpenses} onChange={e => handleChange('monthlyExpenses', e.target.value)} className={inputClass} placeholder="e.g. 50000" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy-900/50 uppercase tracking-wider mb-1.5">Annual Bonus (₹)</label>
            <input type="number" value={formData.annualBonus} onChange={e => handleChange('annualBonus', e.target.value)} className={inputClass} placeholder="e.g. 300000" />
          </div>
        </div>
      ),
    },
    {
      title: 'Existing Investments',
      fields: (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy-900/50 uppercase tracking-wider mb-1.5">Current Savings & Investments (₹)</label>
            <input type="number" value={formData.currentSavings} onChange={e => handleChange('currentSavings', e.target.value)} className={inputClass} placeholder="e.g. 2500000" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy-900/50 uppercase tracking-wider mb-1.5">Existing Monthly SIPs (₹)</label>
            <input type="number" value={formData.existingSips} onChange={e => handleChange('existingSips', e.target.value)} className={inputClass} placeholder="e.g. 25000" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy-900/50 uppercase tracking-wider mb-1.5">PPF/EPF Balance (₹)</label>
            <input type="number" value={formData.ppfEpfBalance} onChange={e => handleChange('ppfEpfBalance', e.target.value)} className={inputClass} placeholder="e.g. 500000" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy-900/50 uppercase tracking-wider mb-1.5">Emergency Fund (₹)</label>
            <input type="number" value={formData.emergencyFund} onChange={e => handleChange('emergencyFund', e.target.value)} className={inputClass} placeholder="e.g. 300000" />
          </div>
        </div>
      ),
    },
    {
      title: 'Life Goals',
      fields: (
        <div className="space-y-4">
          <p className="text-sm text-navy-900/50">Add your major financial goals. AI will factor these into your FIRE roadmap.</p>

          {formData.lifeGoals.length > 0 && (
            <div className="space-y-2">
              {formData.lifeGoals.map(goal => (
                <div key={goal.id} className="flex items-center justify-between p-3 rounded-xl bg-navy-900/[0.03] border border-navy-900/[0.06]">
                  <div>
                    <p className="text-sm font-semibold text-navy-900">{goal.name}</p>
                    <p className="text-xs text-navy-900/40">₹{Number(goal.amount).toLocaleString('en-IN')} in {goal.years} years</p>
                  </div>
                  <button onClick={() => removeGoal(goal.id)} className="p-1 rounded-lg hover:bg-navy-900/[0.05] text-navy-900/40">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="p-4 rounded-xl border border-dashed border-navy-900/15 space-y-3">
            <input
              type="text"
              value={newGoal.name}
              onChange={e => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
              className={inputClass}
              placeholder="Goal name (e.g. Dream House)"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                value={newGoal.years}
                onChange={e => setNewGoal(prev => ({ ...prev, years: e.target.value }))}
                className={inputClass}
                placeholder="Years (e.g. 7)"
              />
              <input
                type="number"
                value={newGoal.amount}
                onChange={e => setNewGoal(prev => ({ ...prev, amount: e.target.value }))}
                className={inputClass}
                placeholder="Target ₹ (e.g. 5000000)"
              />
            </div>
            <button
              onClick={addGoal}
              disabled={!newGoal.name}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-navy-900/15 text-sm text-navy-900/60 hover:bg-navy-900/[0.03] transition-colors disabled:opacity-30"
            >
              <Plus size={14} /> Add Goal
            </button>
          </div>
        </div>
      ),
    },
  ]

  const handleGenerate = async () => {
    if (!formData.currentAge || !formData.monthlyIncome) {
      setError('Please fill in at least your age and monthly income.')
      return
    }

    setStep('loading')
    setError(null)

    try {
      const response = await fetchFirePlan(formData)
      setAiResponse(response)
      setStep('results')
    } catch (err) {
      console.error('FIRE planner error:', err)
      setError('AI analysis failed. Please try again.')
      setStep('form')
    }
  }

  return (
    <section id="fire" className="py-16 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="section-tag mx-auto mb-4">
            <Flame size={11} />
            AI-Powered
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">FIRE Path Planner</h1>
          <p className="text-navy-900/50 text-base mt-2 max-w-xl mx-auto">
            Enter your financial profile and let AI create a personalized roadmap to Financial Independence and Early Retirement.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {/* ── FORM ── */}
          {step === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="glass-card p-6 sm:p-8">
                {/* Progress */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-navy-900/45">
                    Step {formPage + 1} of {formPages.length}
                  </span>
                  <span className="text-xs font-bold text-navy-900">
                    {formPages[formPage].title}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-navy-900/10 rounded-full overflow-hidden mb-6">
                  <motion.div
                    className="h-full bg-navy-900 rounded-full"
                    animate={{ width: `${((formPage + 1) / formPages.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={formPage}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {formPages[formPage].fields}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-navy-900/[0.06]">
                  <button
                    onClick={() => setFormPage(p => p - 1)}
                    disabled={formPage === 0}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-navy-900/10 text-navy-900/50 hover:bg-navy-900/[0.03] transition-colors text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} /> Back
                  </button>

                  {formPage < formPages.length - 1 ? (
                    <button
                      onClick={() => setFormPage(p => p + 1)}
                      className="btn-primary flex items-center gap-1.5 text-sm"
                    >
                      Continue <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={handleGenerate}
                      className="btn-primary flex items-center gap-2 text-sm"
                    >
                      <Sparkles size={14} />
                      Generate My FIRE Roadmap
                    </button>
                  )}
                </div>

                {error && (
                  <p className="mt-3 text-xs text-red-500 text-center">{error}</p>
                )}
              </div>
            </motion.div>
          )}

          {/* ── LOADING ── */}
          {step === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-20 h-20 rounded-full bg-navy-900/[0.05] flex items-center justify-center mb-6">
                <Loader2 size={36} className="text-navy-900/40 animate-spin" />
              </div>
              <p className="text-lg font-semibold text-navy-900 mb-2">Building your FIRE roadmap…</p>
              <p className="text-sm text-navy-900/40">Analyzing your profile with AI</p>
            </motion.div>
          )}

          {/* ── RESULTS ── */}
          {step === 'results' && aiResponse && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="glass-card p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles size={16} className="text-navy-900/40" />
                  <h2 className="text-lg font-bold text-navy-900">Your AI-Generated FIRE Roadmap</h2>
                </div>

                <div className="prose prose-sm max-w-none text-navy-900/75 prose-headings:text-navy-900 prose-headings:font-extrabold prose-strong:text-navy-900 prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-h3:text-base prose-ul:text-navy-900/60 prose-li:marker:text-navy-900/30 prose-table:text-sm">
                  <ReactMarkdown>{aiResponse}</ReactMarkdown>
                </div>

                <div className="mt-8 pt-6 border-t border-navy-900/[0.06] flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => { setStep('form'); setFormPage(0); setAiResponse('') }}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-navy-900/15 text-navy-900/70 text-sm font-medium hover:border-navy-900/30 transition-colors"
                  >
                    Re-plan with Updated Data
                  </button>
                </div>
              </div>

              <p className="text-center text-navy-900/25 text-[10px] mt-4">
                * AI-generated roadmap for educational purposes only. Consult a SEBI-registered financial advisor before investing.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
