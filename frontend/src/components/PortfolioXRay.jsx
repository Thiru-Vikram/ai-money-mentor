import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  ScanSearch, Upload, ShieldCheck, X, FileText, Sparkles, Loader2
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'

async function fetchPortfolioAnalysis(prompt) {
  const response = await fetch('http://localhost:8080/api/portfolio/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })
  const data = await response.json()
  if (data.error) throw new Error(data.error)
  return data.response
}

export default function PortfolioXRay() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [step, setStep] = useState('upload') // upload | scanning | results
  const [fileName, setFileName] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [error, setError] = useState(null)
  const [dragging, setDragging] = useState(false)

  // Manual entry state
  const [manualFunds, setManualFunds] = useState('')

  const handleFile = (f) => {
    if (!f) return
    setFileName(f.name)
    // Since we can't extract PDF on client, prompt user to enter fund names
    setStep('manual')
  }

  const handleManualAnalyze = async () => {
    if (!manualFunds.trim()) {
      setError('Please enter your fund holdings below.')
      return
    }

    setStep('scanning')
    setError(null)

    const prompt = `Analyze this mutual fund portfolio for an Indian investor. Provide asset allocation breakdown, fund overlap analysis, expense ratio recommendations, benchmark comparison, and an AI rebalancing plan.

Portfolio Holdings:
${manualFunds}

Please provide a comprehensive analysis with specific ₹ amounts and percentages.`

    try {
      const data = await fetchPortfolioAnalysis(prompt)
      setAiResponse(data)
      setStep('results')
    } catch (err) {
      console.error('Portfolio X-Ray error:', err)
      setError('AI analysis failed. Please try again.')
      setStep('upload')
    }
  }

  return (
    <section id="xray" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 grid-dot-bg opacity-20 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="section-tag mx-auto mb-4">
            <ScanSearch size={11} />
            MF Portfolio X-Ray
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-navy-900">
            Portfolio <span className="gradient-text">Reconstruction</span>
          </h2>
          <p className="mt-4 text-navy-900/50 max-w-xl mx-auto text-base leading-relaxed">
            Enter your mutual fund holdings and get AI-powered overlap analysis, expense ratio audit, and a rebalancing plan.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* ── UPLOAD / ENTRY STATE ── */}
          {(step === 'upload' || step === 'manual') && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="glass-card p-6 sm:p-8 max-w-2xl mx-auto">
                {/* Upload area */}
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-navy-900/[0.06] border border-navy-900/10 flex items-center justify-center mx-auto mb-4">
                    <Upload size={24} className="text-navy-900/60" />
                  </div>
                  <h3 className="text-lg font-bold text-navy-900 mb-1">Enter Your Holdings</h3>
                  <p className="text-navy-900/50 text-sm">
                    List your mutual fund names and approximate investment amounts.
                  </p>
                </div>

                {/* Text input area for manual entry */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-navy-900/50 uppercase tracking-wider mb-2">Fund Holdings</label>
                  <textarea
                    value={manualFunds}
                    onChange={e => setManualFunds(e.target.value)}
                    className="w-full bg-navy-900/[0.03] border border-navy-900/10 rounded-xl px-4 py-3 text-sm text-navy-900 focus:outline-none focus:border-navy-900/30 focus:ring-1 focus:ring-navy-900/15 transition-all placeholder-navy-900/25 min-h-[160px] font-mono resize-none"
                    placeholder={`e.g.\nHDFC Top 100 — ₹3,00,000\nMirae Asset Emerging Bluechip — ₹2,50,000\nSBI Small Cap — ₹1,50,000\nParag Parikh Flexi Cap — ₹2,00,000\nAxis Long Term Equity (ELSS) — ₹80,000`}
                  />
                </div>

                <button
                  onClick={handleManualAnalyze}
                  className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
                >
                  <Sparkles size={14} />
                  Analyze My Portfolio
                </button>

                {error && (
                  <p className="mt-3 text-xs text-red-500 text-center">{error}</p>
                )}

                <p className="text-center text-[10px] text-navy-900/25 mt-3">
                  No signup required · Your data is never stored
                </p>
              </div>
            </motion.div>
          )}

          {/* ── SCANNING STATE ── */}
          {step === 'scanning' && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-20 h-20 rounded-full bg-navy-900/[0.05] flex items-center justify-center mb-6 relative">
                <ScanSearch size={32} className="text-navy-900/40" />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-navy-900/20"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                />
              </div>
              <p className="text-lg font-semibold text-navy-900 mb-2">Analyzing your portfolio…</p>
              <p className="text-sm text-navy-900/40">Running overlap analysis, expense audit & AI insights</p>
            </motion.div>
          )}

          {/* ── RESULTS STATE ── */}
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
                  <h2 className="text-lg font-bold text-navy-900">AI Portfolio Analysis</h2>
                </div>

                <div className="prose prose-sm max-w-none text-navy-900/75 prose-headings:text-navy-900 prose-headings:font-extrabold prose-strong:text-navy-900 prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-h3:text-base prose-ul:text-navy-900/60 prose-li:marker:text-navy-900/30 prose-table:text-sm">
                  <ReactMarkdown>{aiResponse}</ReactMarkdown>
                </div>

                <div className="mt-8 pt-6 border-t border-navy-900/[0.06]">
                  <button
                    onClick={() => { setStep('upload'); setAiResponse(''); setManualFunds('') }}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-navy-900/15 text-navy-900/70 text-sm font-medium hover:border-navy-900/30 transition-colors"
                  >
                    Analyze Another Portfolio
                  </button>
                </div>
              </div>

              <p className="text-center text-navy-900/25 text-[10px] mt-4">
                * AI-generated analysis for educational purposes. Past returns don't guarantee future results.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
