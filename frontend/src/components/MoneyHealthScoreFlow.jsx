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
    monthlyExpenses: '',
    liquidSavings: '',
    dependents: 'No',
    lifeCover: '',
    healthCover: '',
    investOutsideFd: 'Yes',
    equityPct: 50,
    debtPct: 50,
    monthlyIncome: '',
    monthlyEmi: '',
    exhausted80C: 'Yes',
    claim80D: 'Yes',
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
    let emergencyScore = Math.min(((savings / expenses) / 6) * 100, 100) || 0

    const dependents = formData.dependents === 'Yes'
    const lifeTarget = dependents ? expenses * 12 * 10 : 0
    const life = parseFloat(formData.lifeCover) || 0
    let lifeScore = dependents ? Math.min((life / lifeTarget) * 100, 100) : 100
    if (isNaN(lifeScore)) lifeScore = 0

    const health = parseFloat(formData.healthCover) || 0
    const healthTarget = 1000000
    let healthScore = Math.min((health / healthTarget) * 100, 100)
    let insuranceScore = (lifeScore + healthScore) / 2

    let investScore = formData.investOutsideFd === 'Yes' ? 50 : 20
    if (formData.investOutsideFd === 'Yes') {
      const equity = parseFloat(formData.equityPct) || 0
      if (equity >= 20 && equity <= 80) investScore += 50
      else investScore += 30
    }

    const income = parseFloat(formData.monthlyIncome) || 1
    const emi = parseFloat(formData.monthlyEmi) || 0
    const ratio = emi / income
    let debtScore = 100
    if (ratio > 0.2) {
      debtScore = Math.max(100 - ((ratio - 0.2) * 200), 0)
    }

    let taxScore = 0
    if (formData.exhausted80C === 'Yes') taxScore += 50
    if (formData.claim80D === 'Yes') taxScore += 50

    const age = parseFloat(formData.currentAge) || 30
    const corpus = parseFloat(formData.retirementCorpus) || 0
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

  const inputClass = "w-full bg-navy-900/[0.03] border border-navy-900/10 rounded-xl px-4 py-3 text-navy-900 focus:outline-none focus:border-navy-900/30 focus:ring-1 focus:ring-navy-900/15 transition-all font-mono placeholder-navy-900/25"

  const toggleButton = (field, opt, currentValue) => (
    <button
      key={opt}
      onClick={() => handleChange(field, opt)}
      className={`flex-1 py-3 rounded-xl border transition-all ${currentValue === opt ? 'border-navy-900 bg-navy-900/[0.06] text-navy-900 font-semibold' : 'border-navy-900/10 bg-navy-900/[0.02] text-navy-900/50 hover:bg-navy-900/[0.04]'}`}
    >
      {opt}
    </button>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream/95 backdrop-blur-xl overflow-y-auto">
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-full bg-navy-900/[0.05] hover:bg-navy-900/10 text-navy-900/60 transition-colors z-50"
      >
        <X size={24} />
      </button>

      <div className="w-full max-w-2xl mx-auto px-4 py-12 relative min-h-screen flex flex-col justify-center">
        
        {/* Progress Bar */}
        {currentStepIndex > 0 && currentStepIndex < steps.length - 1 && (
          <div className="absolute top-12 left-4 right-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-navy-900/45">
                Step {currentStepIndex} of {steps.length - 2}
              </span>
              <span className="text-xs font-medium text-navy-900">
                {Math.round((currentStepIndex / (steps.length - 2)) * 100)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-navy-900/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-navy-900"
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
                <div className="w-20 h-20 mx-auto rounded-full bg-navy-900/[0.06] flex items-center justify-center mb-8">
                  <Activity size={40} className="text-navy-900/60" />
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-navy-900 mb-4">
                  Find Your <span className="gradient-text">Vital Signs</span>
                </h2>
                <p className="text-navy-900/55 text-lg max-w-lg mx-auto leading-relaxed">
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
                  <div className="p-3 rounded-xl bg-blue-50"><Icon className="text-blue-600" /></div>
                  <h3 className="text-2xl font-bold text-navy-900">Emergency Preparedness</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-navy-900/70 mb-2">What are your average monthly expenses? (₹)</label>
                    <input 
                      type="number" 
                      value={formData.monthlyExpenses}
                      onChange={e => handleChange('monthlyExpenses', e.target.value)}
                      className={inputClass}
                      placeholder="e.g. 50000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-900/70 mb-2">Highly liquid savings (Savings Account, FDs, Liquid Funds)? (₹)</label>
                    <input 
                      type="number" 
                      value={formData.liquidSavings}
                      onChange={e => handleChange('liquidSavings', e.target.value)}
                      className={inputClass}
                      placeholder="e.g. 150000"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep.id === 'insurance' && (
              <div className="space-y-8 glass-card p-8 md:p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-green-50"><Icon className="text-green-600" /></div>
                  <h3 className="text-2xl font-bold text-navy-900">Insurance Coverage</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-navy-900/70 mb-2">Do you have financial dependents?</label>
                    <div className="flex gap-4">
                      {['Yes', 'No'].map(opt => toggleButton('dependents', opt, formData.dependents))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-900/70 mb-2">Total Life Insurance Cover (Term/Endowment) (₹)</label>
                    <input 
                      type="number" 
                      value={formData.lifeCover}
                      onChange={e => handleChange('lifeCover', e.target.value)}
                      className={inputClass}
                      placeholder="e.g. 10000000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-900/70 mb-2">Total Health Insurance Cover (Family Floater/Individual) (₹)</label>
                    <input 
                      type="number" 
                      value={formData.healthCover}
                      onChange={e => handleChange('healthCover', e.target.value)}
                      className={inputClass}
                      placeholder="e.g. 1000000"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep.id === 'investments' && (
              <div className="space-y-8 glass-card p-8 md:p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-purple-50"><Icon className="text-purple-600" /></div>
                  <h3 className="text-2xl font-bold text-navy-900">Investment Diversification</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-navy-900/70 mb-2">Do you invest outside of traditional FDs/Savings?</label>
                    <div className="flex gap-4">
                      {['Yes', 'No'].map(opt => toggleButton('investOutsideFd', opt, formData.investOutsideFd))}
                    </div>
                  </div>
                  
                  {formData.investOutsideFd === 'Yes' && (
                    <div className="pt-4 border-t border-navy-900/10">
                      <p className="text-sm text-navy-900/55 mb-4">Approximate portfolio split (must total 100%)</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-navy-900/70 mb-2">% Equity (Stocks, MFs)</label>
                          <input 
                            type="number" 
                            max="100"
                            value={formData.equityPct}
                            onChange={e => handleChange('equityPct', e.target.value)}
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-navy-900/70 mb-2">% Debt (Bonds, EPF, PPF)</label>
                          <input 
                            type="number" 
                            max="100"
                            value={formData.debtPct}
                            onChange={e => handleChange('debtPct', e.target.value)}
                            className={inputClass}
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
                  <div className="p-3 rounded-xl bg-red-50"><Icon className="text-red-500" /></div>
                  <h3 className="text-2xl font-bold text-navy-900">Debt Health</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-navy-900/70 mb-2">Net monthly take-home income (₹)</label>
                    <input 
                      type="number" 
                      value={formData.monthlyIncome}
                      onChange={e => handleChange('monthlyIncome', e.target.value)}
                      className={inputClass}
                      placeholder="e.g. 150000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-900/70 mb-2">Total monthly EMI payments (₹)</label>
                    <input 
                      type="number" 
                      value={formData.monthlyEmi}
                      onChange={e => handleChange('monthlyEmi', e.target.value)}
                      className={inputClass}
                      placeholder="e.g. 40000"
                    />
                    <p className="text-xs text-navy-900/35 mt-2">Include home loans, car loans, personal loans, and credit card EMIs.</p>
                  </div>
                </div>
              </div>
            )}

            {currentStep.id === 'tax' && (
              <div className="space-y-8 glass-card p-8 md:p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-amber-50"><Icon className="text-amber-600" /></div>
                  <h3 className="text-2xl font-bold text-navy-900">Tax Efficiency</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-navy-900/70 mb-2">Have you fully exhausted your Section 80C limit (₹1.5L)?</label>
                    <div className="flex gap-4">
                      {['Yes', 'No'].map(opt => toggleButton('exhausted80C', opt, formData.exhausted80C))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-900/70 mb-2">Do you claim health insurance under Section 80D?</label>
                    <div className="flex gap-4">
                      {['Yes', 'No'].map(opt => toggleButton('claim80D', opt, formData.claim80D))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep.id === 'retirement' && (
              <div className="space-y-8 glass-card p-8 md:p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-pink-50"><Icon className="text-pink-500" /></div>
                  <h3 className="text-2xl font-bold text-navy-900">Retirement Readiness</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-navy-900/70 mb-2">Current Age</label>
                      <input 
                        type="number" 
                        value={formData.currentAge}
                        onChange={e => handleChange('currentAge', e.target.value)}
                        className={inputClass}
                        placeholder="e.g. 30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-900/70 mb-2">Target Ret. Age</label>
                      <input 
                        type="number" 
                        value={formData.targetRetirementAge}
                        onChange={e => handleChange('targetRetirementAge', e.target.value)}
                        className={inputClass}
                        placeholder="e.g. 60"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-900/70 mb-2">Current accumulated retirement corpus (₹)</label>
                    <input 
                      type="number" 
                      value={formData.retirementCorpus}
                      onChange={e => handleChange('retirementCorpus', e.target.value)}
                      className={inputClass}
                      placeholder="e.g. 2500000"
                    />
                    <p className="text-xs text-navy-900/35 mt-2">Include EPF, PPF, NPS, and equity mutual funds mapped to retirement.</p>
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
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-navy-900/10 text-navy-900/60 hover:bg-navy-900/[0.03] transition-colors"
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
