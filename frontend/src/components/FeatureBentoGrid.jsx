import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ScanLine, Calculator, Users, Flame, LifeBuoy, Baby, ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const FEATURES = [
  {
    icon: ScanLine,
    color: '#60a5fa',
    highlightGradient: 'from-blue-500/20 to-transparent',
    borderColor: 'rgba(59,130,246,0.3)',
    title: 'Portfolio X-Ray',
    href: '/portfolio-xray',
    desc: 'Upload your CAMS or KFintech statement. Get instant XIRR, fund overlap heatmap, expense drag, and a rebalancing plan.',
    highlight: 'HDFC Bank appears in 4 of 5 of your funds. You have 72% overlap.',
    highlightColor: '#f87171',
    tag: 'Upload PDF',
  },
  {
    icon: Calculator,
    color: '#fbbf24',
    highlightGradient: 'from-amber-500/20 to-transparent',
    borderColor: 'rgba(245,158,11,0.3)',
    title: 'Tax Wizard',
    href: '/tax-wizard',
    desc: 'Compare Old vs New regime in real time. Discover every rupee of deduction you are silently missing this year.',
    highlight: 'You are missing ₹54,000/yr in tax deductions. Old regime saves more.',
    highlightColor: '#fbbf24',
    tag: 'FY 2024-25',
  },
  {
    icon: Users,
    color: '#22d3ee',
    highlightGradient: 'from-cyan-500/20 to-transparent',
    borderColor: 'rgba(6,182,212,0.3)',
    title: "Couple's Planner",
    href: '/couples-planner',
    desc: 'Joint income, dual HRA claims, NPS matching, and optimized SIP splits. Built for two-income Indian households.',
    highlight: 'Your joint after-tax investable surplus is ₹43,200/mo.',
    highlightColor: '#22d3ee',
    tag: 'For Couples',
  },
]

const CHIPS = [
  { icon: Flame, color: '#f97316', label: 'FIRE Path Planner', desc: 'Month-by-month roadmap to retire early.', href: '/fire-planner' },
  { icon: LifeBuoy, color: '#34d399', label: 'Life Event Advisor', desc: 'Bonus, marriage, baby — instant AI guidance.', href: '/life-event' },
  { icon: Baby, color: '#ec4899', label: 'Money Health Quiz', desc: '12 questions. 6 dimensions. One score.', href: '/health-score' },
]

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  visible: (i) => ({
    opacity: 1, scale: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function FeatureBentoGrid() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-32 relative bg-[#02040a] overflow-hidden">
      {/* Subtle organic noise texture */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDIiLz4KPHBhdGggZD0iTTAgMEwyIDBMMiAyTDAgMlpNMiAyTDQgMkw0IDRMMiA0Wk00IDRMNiA0TDYgNkw0IDZaTTYgNkw4IDZMMiA4TDYgOFoiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4xIi8+Cjwvc3ZnPg==')] opacity-[0.15] mix-blend-overlay pointer-events-none" />

      <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-cyan-500/5 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-24 text-center"
        >
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
            <Sparkles size={14} className="text-amber-400" />
            <span className="text-[10px] font-mono text-amber-100 tracking-[0.2em] uppercase">6 AI-Powered Tools</span>
          </div>
          
          <h2 className="font-display text-[3.5rem] md:text-6xl font-normal leading-[1.05] text-[#fafafa] max-w-3xl mx-auto tracking-tight">
            Everything your CA <br className="hidden md:block"/>
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-500 font-light">
              charges ₹25,000 for.
            </span>
          </h2>
          <p className="mt-6 text-lg max-w-xl mx-auto text-slate-400 font-light">
            Financial algorithms engineered precisely for Indian salaried professionals. Every insight is local, not a generic template.
          </p>
        </motion.div>

        {/* Main 3-column grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                className="group relative h-full"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${f.highlightGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[28px] blur-xl`} />
                
                <div className="card-hover p-8 flex flex-col h-full bg-[rgba(15,20,35,0.4)] backdrop-blur-2xl border border-white/10 rounded-[28px] relative z-10 transition-all duration-500 group-hover:border-white/20 group-hover:bg-[#0f1523]/80">
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 flex-shrink-0 transition-transform duration-500 group-hover:scale-110 shadow-lg"
                    style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0))`, border: `1px solid ${f.borderColor}` }}
                  >
                    <Icon size={24} style={{ color: f.color }} className="drop-shadow-[0_0_10px_currentColor]" />
                  </div>

                  {/* Title + tag */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <h3 className="text-xl font-display font-normal text-[#f1f5f9] tracking-wide">{f.title}</h3>
                    <span className="text-[9px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full whitespace-nowrap" style={{
                      background: `rgba(255,255,255,0.05)`,
                      border: `1px solid ${f.borderColor}`,
                      color: f.color,
                    }}>{f.tag}</span>
                  </div>

                  <p className="text-[14px] leading-relaxed flex-1 text-slate-400 font-light">
                    {f.desc}
                  </p>

                  {/* Headline insight */}
                  <div className="mt-8 rounded-xl p-4 bg-black/40 border border-white/5 relative overflow-hidden group-hover:border-white/10 transition-colors">
                    <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: f.highlightColor, opacity: 0.5 }} />
                    <p className="text-xs font-medium leading-relaxed" style={{ color: f.color }}>
                      {f.highlight}
                    </p>
                  </div>

                  <Link
                    to={f.href}
                    className="mt-8 inline-flex items-center gap-2 text-[13px] font-semibold tracking-wide transition-all group/link"
                    style={{ color: '#e2e8f0' }}
                  >
                    Explore capability 
                    <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" style={{ color: f.color }} />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Chip row - Mini tools */}
        <div className="mt-8 grid md:grid-cols-3 gap-5 md:gap-8">
          {CHIPS.map((c, i) => {
            const Icon = c.icon
            return (
              <motion.div
                key={c.label}
                custom={i + 3}
                variants={cardVariants}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
              >
                <Link to={c.href} className="p-5 md:p-6 flex items-center gap-5 group block bg-[rgba(15,20,35,0.3)] backdrop-blur-xl border border-white/5 rounded-2xl hover:bg-[rgba(25,30,45,0.5)] hover:border-white/10 transition-all duration-300">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-inner"
                    style={{ background: `linear-gradient(135deg, ${c.color}20, transparent)`, border: `1px solid ${c.color}40` }}
                  >
                    <Icon size={18} style={{ color: c.color }} className="drop-shadow-[0_0_8px_currentColor]" />
                  </div>
                  <div className="min-w-0 pr-2">
                    <p className="text-[15px] font-medium text-slate-200 group-hover:text-white transition-colors">{c.label}</p>
                    <p className="text-[12px] mt-1 text-slate-400 truncate opacity-80">{c.desc}</p>
                  </div>
                  <ArrowRight size={16} className="flex-shrink-0 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" style={{ color: c.color }} />
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Disclaimer */}
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-600 mt-20 text-center max-w-2xl mx-auto">
          Calculations leverage FY2024-25 IT slabs & SEBI-registered framework protocols. Not formal financial advice.
        </p>
      </div>
    </section>
  )
}
