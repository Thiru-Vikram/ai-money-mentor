import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, ChevronLeft, ShieldAlert, Activity, ShieldCheck, PieChart, TrendingDown, PiggyBank, Landmark } from 'lucide-react'
import MoneyHealthScoreResults from './MoneyHealthScoreResults'

const steps = [
  { id: 'welcome', title: 'Welcome' },
  { id: 'emergency', title: 'Emergency Preparedness', icon: ShieldAlert },
  { id: 'insurance', title: 'Insurance Coverage', icon: ShieldCheck },
  { id: 'investments', title: 'Investment Diversification', icon: PieChart },
  { id: 'debt', title: 'Debt Health', icon: TrendingDown },
  { id: 'tax', title: 'Tax Efficiency', icon: Landmark },
  { id: 'retirement', title: 'Retirement Readiness', icon: PiggyBank },
  { id: 'results', title: 'Your Report' }
]

export default function MoneyHealthScoreFlow({ isOpen, onClose }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [formData, setFormData] = useState({
    // Emergency
    monthlyExpenses: '',
    liquidSavings: '',
    // Insurance
    dependents: 'No',
    lifeCover: '',
    healthCover: '',
    // Investments
    investOutsideFd: 'Yes',
    equityPct: 50,
    debtPct: 50,
    // Debt
    monthlyIncome: '',
    monthlyEmi: '',
    // Tax
    exhausted80C: 'Yes',
    claim80D: 'Yes',
    // Retirement
    currentAge: '',
    targetRetirementAge: '60',
    retirementCorpus: ''
  })
  const [results, setResults] = useState(null)

  if (!isOpen) return null

  const handleNext = () => {
    if (currentStepIndex < steps.length - 2) {
      setCurrentStepIndex(i => i + 1)
    } else if (currentStepIndex === steps.length - 2) {
      calculateResults()
      setCurrentStepIndex(i => i + 1)
    }
  }

  const handlePrev = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(i => i - 1)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const calculateResults = () => {
    const expenses = parseFloat(formData.monthlyExpenses) || 40000
    const savings = parseFloat(formData.liquidSavings) || 0
    // 1. Emergency (Target 6 months)
    let emergencyScore = Math.min(((savings / expenses) / 6) * 100, 100) || 0

    // 2. Insurance
    const dependents = formData.dependents === 'Yes'
    const lifeTarget = dependents ? expenses * 12 * 10 : 0
    const life = parseFloat(formData.lifeCover) || 0
    let lifeScore = dependents ? Math.min((life / lifeTarget) * 100, 100) : 100
    if (isNaN(lifeScore)) lifeScore = 0

    const health = parseFloat(formData.healthCover) || 0
    const healthTarget = 1000000 // 10L baseline
    let healthScore = Math.min((health / healthTarget) * 100, 100)
    let insuranceScore = (lifeScore + healthScore) / 2

    // 3. Investments
    let investScore = formData.investOutsideFd === 'Yes' ? 50 : 20
    if (formData.investOutsideFd === 'Yes') {
      const equity = parseFloat(formData.equityPct) || 0
      if (equity >= 20 && equity <= 80) investScore += 50
      else investScore += 30
    }

    // 4. Debt
    const income = parseFloat(formData.monthlyIncome) || 1
    const emi = parseFloat(formData.monthlyEmi) || 0
    const ratio = emi / income
    let debtScore = 100
    if (ratio > 0.2) {
      debtScore = Math.max(100 - ((ratio - 0.2) * 200), 0)
    }

    // 5. Tax
    let taxScore = 0
    if (formData.exhausted80C === 'Yes') taxScore += 50
    if (formData.claim80D === 'Yes') taxScore += 50

    // 6. Retirement
    const age = parseFloat(formData.currentAge) || 30
    const corpus = parseFloat(formData.retirementCorpus) || 0
    // Rough heuristic: should have (age-25) * 2 * annual expenses
    const targetCorpus = Math.max((age - 25) * 2 * (expenses * 12), 1)
    let retirementScore = age < 25 ? 100 : Math.min((corpus / targetCorpus) * 100, 100)

    setResults({
      emergency: Math.round(emergencyScore),
      insurance: Math.round(insuranceScore),
      investments: Math.round(investScore),
      debt: Math.round(debtScore),
      tax: Math.round(taxScore),
      retirement: Math.round(retirementScore),
      details: formData
    })
  }

  const currentStep = steps[currentStepIndex]
  const Icon = currentStep.icon || Activity

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/95 backdrop-blur-xl overflow-y-auto">
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors z-50"
      >
        <X size={24} />
      </button>

      <div className="w-full max-w-2xl mx-auto px-4 py-12 relative min-h-screen flex flex-col justify-center">
        
        {/* Progress Bar (hide on welcome/results) */}
        {currentStepIndex > 0 && currentStepIndex < steps.length - 1 && (
          <div className="absolute top-12 left-4 right-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-white/50">
                Step {currentStepIndex} of {steps.length - 2}
              </span>
              <span className="text-xs font-medium text-green-growth">
                {Math.round((currentStepIndex / (steps.length - 2)) * 100)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-green-growth"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStepIndex / (steps.length - 2)) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {currentStep.id === 'welcome' && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-green-growth/20 flex items-center justify-center mb-8">
                  <Activity size={40} className="text-green-growth" />
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  Find Your <span className="gradient-text">Vital Signs</span>
                </h2>
                <p className="text-white/60 text-lg max-w-lg mx-auto leading-relaxed">
                  Take our 5-minute audit to get a comprehensive health score across 6 crucial dimensions of your financial life.
                </p>
                <div className="pt-8">
                  <button onClick={handleNext} className="btn-primary w-full sm:w-auto px-12 py-4 text-lg">
                    Start Audit
                  </button>
                </div>
              </div>
            )}

            {currentStep.id === 'emergency' && (
              <div className="space-y-8 glass-card p-8 md:p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-white/5"><Icon className="text-blue-400" /></div>
                  <h3 className="text-2xl font-bold text-white">Emergency Preparedness</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">What are your average monthly expenses? (₹)</label>
                    <input 
                      type="number" 
                      value={formData.monthlyExpenses}
                      onChange={e => handleChange('monthlyExpenses', e.target.value)}
                      className="w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-growth focus:ring-1 focus:ring-green-growth/50 transition-all font-mono"
                      placeholder="e.g. 50000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Highly liquid savings (Savings Account, FDs, Liquid Funds)? (₹)</label>
                    <input 
                      type="number" 
                      value={formData.liquidSavings}
                      onChange={e => handleChange('liquidSavings', e.target.value)}
                      className="w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-growth focus:ring-1 focus:ring-green-growth/50 transition-all font-mono"
                      placeholder="e.g. 150000"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep.id === 'insurance' && (
              <div className="space-y-8 glass-card p-8 md:p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-white/5"><Icon className="text-green-400" /></div>
                  <h3 className="text-2xl font-bold text-white">Insurance Coverage</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Do you have financial dependents?</label>
                    <div className="flex gap-4">
                      {['Yes', 'No'].map(opt => (
                        <button
                          key={opt}
                          onClick={() => handleChange('dependents', opt)}
                          className={`flex-1 py-3 rounded-xl border transition-all ${formData.dependents === opt ? 'border-green-growth bg-green-growth/10 text-green-growth' : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Total Life Insurance Cover (Term/Endowment) (₹)</label>
                    <input 
                      type="number" 
                      value={formData.lifeCover}
                      onChange={e => handleChange('lifeCover', e.target.value)}
                      className="w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-growth focus:ring-1 focus:ring-green-growth/50 transition-all font-mono"
                      placeholder="e.g. 10000000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Total Health Insurance Cover (Family Floater/Individual) (₹)</label>
                    <input 
                      type="number" 
                      value={formData.healthCover}
                      onChange={e => handleChange('healthCover', e.target.value)}
                      className="w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-growth focus:ring-1 focus:ring-green-growth/50 transition-all font-mono"
                      placeholder="e.g. 1000000"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep.id === 'investments' && (
              <div className="space-y-8 glass-card p-8 md:p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-white/5"><Icon className="text-purple-400" /></div>
                  <h3 className="text-2xl font-bold text-white">Investment Diversification</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Do you invest outside of traditional FDs/Savings?</label>
                    <div className="flex gap-4">
                      {['Yes', 'No'].map(opt => (
                        <button
                          key={opt}
                          onClick={() => handleChange('investOutsideFd', opt)}
                          className={`flex-1 py-3 rounded-xl border transition-all ${formData.investOutsideFd === opt ? 'border-green-growth bg-green-growth/10 text-green-growth' : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {formData.investOutsideFd === 'Yes' && (
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-sm text-white/60 mb-4">Approximate portfolio split (must total 100%)</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-white/80 mb-2">% Equity (Stocks, MFs)</label>
                          <input 
                            type="number" 
                            max="100"
                            value={formData.equityPct}
                            onChange={e => handleChange('equityPct', e.target.value)}
                            className="w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-growth focus:ring-1 focus:ring-green-growth/50 transition-all font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-white/80 mb-2">% Debt (Bonds, EPF, PPF)</label>
                          <input 
                            type="number" 
                            max="100"
                            value={formData.debtPct}
                            onChange={e => handleChange('debtPct', e.target.value)}
                            className="w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-growth focus:ring-1 focus:ring-green-growth/50 transition-all font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentStep.id === 'debt' && (
              <div className="space-y-8 glass-card p-8 md:p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-white/5"><Icon className="text-red-400" /></div>
                  <h3 className="text-2xl font-bold text-white">Debt Health</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Net monthly take-home income (₹)</label>
                    <input 
                      type="number" 
                      value={formData.monthlyIncome}
                      onChange={e => handleChange('monthlyIncome', e.target.value)}
                      className="w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-growth focus:ring-1 focus:ring-green-growth/50 transition-all font-mono"
                      placeholder="e.g. 150000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Total monthly EMI payments (₹)</label>
                    <input 
                      type="number" 
                      value={formData.monthlyEmi}
                      onChange={e => handleChange('monthlyEmi', e.target.value)}
                      className="w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-growth focus:ring-1 focus:ring-green-growth/50 transition-all font-mono"
                      placeholder="e.g. 40000"
                    />
                    <p className="text-xs text-white/40 mt-2">Include home loans, car loans, personal loans, and credit card EMIs.</p>
                  </div>
                </div>
              </div>
            )}

            {currentStep.id === 'tax' && (
              <div className="space-y-8 glass-card p-8 md:p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-white/5"><Icon className="text-yellow-400" /></div>
                  <h3 className="text-2xl font-bold text-white">Tax Efficiency</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Have you fully exhausted your Section 80C limit (₹1.5L)?</label>
                    <div className="flex gap-4">
                      {['Yes', 'No'].map(opt => (
                        <button
                          key={opt}
                          onClick={() => handleChange('exhausted80C', opt)}
                          className={`flex-1 py-3 rounded-xl border transition-all ${formData.exhausted80C === opt ? 'border-green-growth bg-green-growth/10 text-green-growth' : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Do you claim health insurance under Section 80D?</label>
                    <div className="flex gap-4">
                      {['Yes', 'No'].map(opt => (
                        <button
                          key={opt}
                          onClick={() => handleChange('claim80D', opt)}
                          className={`flex-1 py-3 rounded-xl border transition-all ${formData.claim80D === opt ? 'border-green-growth bg-green-growth/10 text-green-growth' : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep.id === 'retirement' && (
              <div className="space-y-8 glass-card p-8 md:p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-white/5"><Icon className="text-pink-400" /></div>
                  <h3 className="text-2xl font-bold text-white">Retirement Readiness</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Current Age</label>
                      <input 
                        type="number" 
                        value={formData.currentAge}
                        onChange={e => handleChange('currentAge', e.target.value)}
                        className="w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-growth focus:ring-1 focus:ring-green-growth/50 transition-all font-mono"
                        placeholder="e.g. 30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Target Ret. Age</label>
                      <input 
                        type="number" 
                        value={formData.targetRetirementAge}
                        onChange={e => handleChange('targetRetirementAge', e.target.value)}
                        className="w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-growth focus:ring-1 focus:ring-green-growth/50 transition-all font-mono"
                        placeholder="e.g. 60"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Current accumulated retirement corpus (₹)</label>
                    <input 
                      type="number" 
                      value={formData.retirementCorpus}
                      onChange={e => handleChange('retirementCorpus', e.target.value)}
                      className="w-full bg-navy-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-growth focus:ring-1 focus:ring-green-growth/50 transition-all font-mono"
                      placeholder="e.g. 2500000"
                    />
                    <p className="text-xs text-white/40 mt-2">Include EPF, PPF, NPS, and equity mutual funds mapped to retirement.</p>
                  </div>
                </div>
              </div>
            )}

            {currentStep.id === 'results' && results && (
              <MoneyHealthScoreResults results={results} onRetake={() => setCurrentStepIndex(0)} />
            )}

          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {currentStep.id !== 'welcome' && currentStep.id !== 'results' && (
          <div className="mt-8 flex items-center justify-between">
            <button 
              onClick={handlePrev}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 transition-colors"
            >
              <ChevronLeft size={18} />
              Back
            </button>
            <button 
              onClick={handleNext}
              className="btn-primary flex items-center gap-2"
            >
              {currentStepIndex === steps.length - 2 ? 'Calculate My Score' : 'Continue'}
              <ChevronRight size={18} />
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
