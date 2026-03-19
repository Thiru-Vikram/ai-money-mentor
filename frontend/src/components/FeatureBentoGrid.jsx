import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ScanLine, CheckCircle2, Calculator, Users, LayoutGrid, ArrowRight } from 'lucide-react'

function PortfolioXRayCard() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
          <ScanLine size={17} className="text-blue-400" />
        </div>
        <div>
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Portfolio X-Ray</p>
          <h3 className="text-base font-bold text-white">Instant Portfolio Audit</h3>
        </div>
      </div>

      {/* PDF scan animation */}
      <div className="relative rounded-xl overflow-hidden bg-navy-950/60 border border-white/[0.06] p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-12 rounded bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
            <span className="text-[9px] text-white/30 font-mono">PDF</span>
          </div>
          <div className="flex-1">
            <p className="text-xs text-white/50 font-mono">CAMS_Statement_2024.pdf</p>
            <div className="mt-1.5 h-1 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-blue-400"
                initial={{ width: '0%' }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.5 }}
              />
            </div>
          </div>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 2.1 }}
          >
            <CheckCircle2 size={20} className="text-green-growth" />
          </motion.div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'True XIRR', value: '14.2%' },
            { label: 'Overlap', value: '38%' },
            { label: 'Exp. Ratio', value: '1.4%' },
          ].map(m => (
            <div key={m.label} className="rounded-lg bg-white/[0.04] p-2 text-center">
              <p className="text-sm font-bold text-white">{m.value}</p>
              <p className="text-[10px] text-white/35">{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-sm text-white/50 leading-relaxed">
        Upload CAMS/KFintech PDFs. Detect hidden commissions, fund overlap, and get an AI rebalancing plan in <span className="text-blue-400 font-medium">10 seconds</span>.
      </p>
    </div>
  )
}

function TaxWizardCard() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <Calculator size={17} className="text-amber-400" />
        </div>
        <div>
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Tax Wizard</p>
          <h3 className="text-base font-bold text-white">Old vs. New Regime</h3>
        </div>
      </div>

      {/* Split comparison */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { regime: 'Old Regime', tax: '₹1,24,500', savings: null, dim: true },
          { regime: 'New Regime', tax: '₹87,300', savings: '₹37,200', dim: false },
        ].map(r => (
          <div
            key={r.regime}
            className={`rounded-xl p-3 border text-center transition-all ${
              r.dim
                ? 'bg-white/[0.03] border-white/[0.06] opacity-60'
                : 'bg-green-growth/10 border-green-growth/30'
            }`}
          >
            <p className="text-[10px] text-white/50 mb-1">{r.regime}</p>
            <p className={`text-lg font-extrabold ${r.dim ? 'text-white/60' : 'text-white'}`}>{r.tax}</p>
            {r.savings && (
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-green-growth/20 text-green-growth text-[10px] font-bold">
                Save {r.savings}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-amber-400/10 border border-amber-400/20 p-3">
        <p className="text-xs font-semibold text-amber-400">Deductions you're missing</p>
        <div className="mt-2 space-y-1.5">
          {[
            { label: 'Section 80D (Health)', amount: '₹25,000' },
            { label: 'NPS 80CCD(1B)', amount: '₹50,000' },
            { label: 'HRA claim', amount: '₹18,000' },
          ].map(d => (
            <div key={d.label} className="flex justify-between text-xs">
              <span className="text-white/50">{d.label}</span>
              <span className="text-amber-300 font-semibold">{d.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CouplesCard() {
  const [isJoint, setIsJoint] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
          <Users size={17} className="text-purple-400" />
        </div>
        <div>
          <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Couple's Planner</p>
          <h3 className="text-base font-bold text-white">Optimize Together</h3>
        </div>
      </div>

      {/* Toggle */}
      <div className="flex items-center justify-between p-1 rounded-xl bg-white/[0.05] border border-white/[0.06]">
        {['Individual', 'Joint'].map(mode => (
          <button
            key={mode}
            onClick={() => setIsJoint(mode === 'Joint')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-300 ${
              (mode === 'Joint') === isJoint
                ? 'bg-purple-500/30 text-purple-300 border border-purple-500/30'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      <motion.div
        key={isJoint ? 'joint' : 'individual'}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-2"
      >
        {isJoint ? (
          <>
            {[
              { label: 'Combined Monthly SIP', value: '₹42,500', tag: 'Optimised', color: 'text-green-growth' },
              { label: 'HRA Claim Split', value: '70/30', tag: 'Tax efficient', color: 'text-purple-400' },
              { label: 'Combined Net Worth', value: '₹1.2Cr', tag: 'Tracked', color: 'text-blue-400' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.05]">
                <span className="text-xs text-white/50">{item.label}</span>
                <div className="text-right">
                  <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
                  <p className="text-[10px] text-white/30">{item.tag}</p>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {[
              { label: 'Your Monthly SIP', value: '₹28,000', note: 'Based on income' },
              { label: 'Tax Saving Gap', value: '₹41,200', note: 'Unoptimised' },
              { label: 'Net Worth', value: '₹68L', note: 'Individual' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.05]">
                <span className="text-xs text-white/50">{item.label}</span>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{item.value}</p>
                  <p className="text-[10px] text-white/30">{item.note}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </motion.div>

      {isJoint && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center"
        >
          <p className="text-xs text-purple-300 font-semibold">
            🎉 Joint planning saves you <span className="text-white">₹14,500/mo</span>
          </p>
        </motion.div>
      )}
    </div>
  )
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: i => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: 'easeOut' },
  }),
}

export default function FeatureBentoGrid() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="features" className="py-24 relative">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="section-tag mx-auto mb-4">
            <LayoutGrid size={11} />
            Core Features
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Everything You Need to <span className="gradient-text">Grow Wealth</span>
          </h2>
          <p className="mt-4 text-white/50 max-w-lg mx-auto">
            Six AI-powered modules that cover every dimension of your financial life — from taxes to retirement.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid md:grid-cols-3 gap-5">
          {[
            <PortfolioXRayCard key="xray" />,
            <TaxWizardCard key="tax" />,
            <CouplesCard key="couple" />,
          ].map((card, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="glass-card-hover p-6 cursor-pointer group"
            >
              {card}
              <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-green-growth/70 group-hover:text-green-growth transition-colors">
                Explore feature <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Extra 3 feature chips */}
        <div className="mt-5 grid md:grid-cols-3 gap-4">
          {[
            { icon: '🔥', title: 'FIRE Path Planner', desc: 'Month-by-month roadmap to retire early on your terms.' },
            { icon: '💡', title: 'Life Event Advisor', desc: 'Bonus? Baby? Marriage? Instant AI guidance on every milestone.' },
            { icon: '🩺', title: '5-Min Health Quiz', desc: 'Comprehensive financial wellness score in under 5 minutes.' },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              custom={i + 3}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="glass-card-hover p-5 flex items-start gap-4 cursor-pointer"
            >
              <span className="text-2xl">{f.icon}</span>
              <div>
                <p className="text-sm font-bold text-white">{f.title}</p>
                <p className="text-xs text-white/50 mt-1 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
