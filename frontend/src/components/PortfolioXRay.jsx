import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts'
import {
  ScanSearch, Upload, AlertTriangle, TrendingUp,
  TrendingDown, Zap, ShieldCheck, ChevronRight, X, FileText
} from 'lucide-react'

/* ─── Demo Data ─────────────────────────────────────────────────────────────── */
const allocation = [
  { name: 'Large Cap Equity', value: 47, color: '#0A192F' },
  { name: 'Mid & Small Cap',  value: 28, color: '#1A3550' },
  { name: 'Debt / Bonds',     value: 14, color: '#6B7280' },
  { name: 'International',    value:  7, color: '#9CA3AF' },
  { name: 'Gold / REITs',     value:  4, color: '#D1D5DB' },
]

const holdings = [
  { fund: 'HDFC Top 100',        weight: 22.4, xirr: 14.2, er: 0.52, sector: 'Large Cap',  overlap: 3 },
  { fund: 'Mirae Asset Emerging',weight: 18.1, xirr: 19.8, er: 0.54, sector: 'Mid Cap',    overlap: 2 },
  { fund: 'Parag Parikh Flexi',  weight: 16.7, xirr: 17.3, er: 0.63, sector: 'Flexi Cap',  overlap: 1 },
  { fund: 'ICICI Pru BlueChip',  weight: 14.9, xirr: 13.1, er: 1.05, sector: 'Large Cap',  overlap: 4 },
  { fund: 'SBI Small Cap',       weight: 12.3, xirr: 22.6, er: 0.70, sector: 'Small Cap',  overlap: 0 },
  { fund: 'Axis Long Term Eq.',  weight:  9.2, xirr: 11.7, er: 1.59, sector: 'ELSS',       overlap: 2 },
  { fund: 'UTI Nifty 50 Index',  weight:  6.4, xirr: 12.9, er: 0.20, sector: 'Index',      overlap: 1 },
]

const benchmark = [
  { label: 'Your Portfolio', xirr: 16.1, color: '#0A192F' },
  { label: 'Nifty 50',       xirr: 12.8, color: '#D1D5DB' },
  { label: 'Sensex',         xirr: 12.4, color: '#D1D5DB' },
  { label: 'Category Avg',   xirr: 13.6, color: '#D1D5DB' },
]

const overlappingStocks = [
  { stock: 'HDFC Bank',    funds: 5, weight: '8.2%' },
  { stock: 'Infosys',      funds: 4, weight: '5.7%' },
  { stock: 'Reliance Ind.',funds: 4, weight: '4.9%' },
  { stock: 'ICICI Bank',   funds: 3, weight: '6.1%' },
]

const portfolioXirr    = 16.1
const totalExpenseDrag = 0.78
const overlapScore     = 68
const totalValue       = 18.4

/* ─── Helpers ───────────────────────────────────────────────────────────────── */
const sectorColor = {
  'Large Cap': 'text-blue-600 bg-blue-50 border-blue-200',
  'Mid Cap':   'text-purple-600 bg-purple-50 border-purple-200',
  'Flexi Cap': 'text-teal-600 bg-teal-50 border-teal-200',
  'Small Cap': 'text-orange-600 bg-orange-50 border-orange-200',
  'ELSS':      'text-pink-600 bg-pink-50 border-pink-200',
  'Index':     'text-cyan-600 bg-cyan-50 border-cyan-200',
}

function PieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.06) return null
  const RADIAN = Math.PI / 180
  const r = innerRadius + (outerRadius - innerRadius) * 0.55
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      fontSize={11} fontWeight={700} fontFamily="Plus Jakarta Sans">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-white border border-navy-900/10 shadow-lg rounded-xl px-3 py-2 text-xs">
      <p className="text-navy-900 font-semibold">{d.name}</p>
      <p style={{ color: d.payload.color }} className="font-bold">{d.value}%</p>
    </div>
  )
}

const BarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-navy-900/10 shadow-lg rounded-xl px-3 py-2 text-xs">
      <p className="text-navy-900/60 mb-1">{label}</p>
      <p className="text-navy-900 font-bold">{payload[0].value}% XIRR</p>
    </div>
  )
}

/* ─── Upload State ──────────────────────────────────────────────────────────── */
function UploadOverlay({ onDismiss }) {
  const [dragging, setDragging] = useState(false)
  const [file, setFile]         = useState(null)
  const [scanning, setScanning] = useState(false)
  const [done, setDone]         = useState(false)

  const handleFile = (f) => {
    if (!f) return
    setFile(f)
    setScanning(true)
    setTimeout(() => { setScanning(false); setDone(true) }, 2800)
    setTimeout(() => onDismiss(), 4500)
  }

  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-center justify-center bg-cream/80 backdrop-blur-sm rounded-2xl"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="glass-card p-8 max-w-md w-full mx-4 text-center relative">
        <button onClick={onDismiss}
          className="absolute top-4 right-4 text-navy-900/30 hover:text-navy-900/70 transition-colors">
          <X size={16} />
        </button>

        {!file && !scanning && !done && (
          <>
            <div className="w-14 h-14 rounded-2xl bg-navy-900/[0.06] border border-navy-900/10
              flex items-center justify-center mx-auto mb-5">
              <Upload size={24} className="text-navy-900/60" />
            </div>
            <h3 className="text-lg font-bold text-navy-900 mb-2">Upload Your Statement</h3>
            <p className="text-navy-900/50 text-sm mb-6 leading-relaxed">
              Supports <span className="text-navy-900 font-medium">CAMS</span> and{' '}
              <span className="text-navy-900 font-medium">KFintech</span> consolidated account
              statements (PDF or XLSX). Your data never leaves your device.
            </p>
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
              className={`border-2 border-dashed rounded-xl p-8 transition-all duration-200 cursor-pointer
                ${dragging ? 'border-navy-900/40 bg-navy-900/[0.04]' : 'border-navy-900/15 hover:border-navy-900/25'}`}
              onClick={() => document.getElementById('xray-file-input').click()}>
              <FileText size={32} className="mx-auto mb-3 text-navy-900/20" />
              <p className="text-navy-900/40 text-sm">Drag & drop or <span className="text-navy-900 font-medium">browse</span></p>
              <p className="text-navy-900/25 text-xs mt-1">PDF, XLSX — max 10 MB</p>
            </div>
            <input id="xray-file-input" type="file" accept=".pdf,.xlsx,.xls" className="hidden"
              onChange={e => handleFile(e.target.files[0])} />
          </>
        )}

        {file && scanning && (
          <div className="py-4">
            <div className="w-14 h-14 rounded-2xl bg-navy-900/[0.06] border border-navy-900/10
              flex items-center justify-center mx-auto mb-5 relative">
              <ScanSearch size={24} className="text-navy-900/60" />
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-navy-900/30"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }} />
            </div>
            <h3 className="text-lg font-bold text-navy-900 mb-2">Analysing Portfolio…</h3>
            <p className="text-navy-900/40 text-sm mb-6">{file.name}</p>
            <div className="space-y-2 text-left">
              {['Reconstructing transactions…', 'Calculating XIRR…', 'Running overlap analysis…', 'Generating AI insights…'].map((step, i) => (
                <motion.div key={step}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.55 }}
                  className="flex items-center gap-2 text-xs text-navy-900/50">
                  <motion.div className="w-1.5 h-1.5 rounded-full bg-navy-900"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ delay: i * 0.55, repeat: 1, duration: 0.4 }} />
                  {step}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {done && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-4">
            <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-200
              flex items-center justify-center mx-auto mb-5">
              <ShieldCheck size={24} className="text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-navy-900 mb-2">X-Ray Complete!</h3>
            <p className="text-navy-900/50 text-sm">Your full report is ready. Loading results…</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

/* ─── Main Component ────────────────────────────────────────────────────────── */
export default function PortfolioXRay() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [showUpload, setShowUpload] = useState(false)

  return (
    <section id="xray" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 grid-dot-bg opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14">
          <div className="section-tag mx-auto mb-4">
            <ScanSearch size={11} />
            MF Portfolio X-Ray
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-navy-900">
            10-Second Portfolio <span className="gradient-text">Reconstruction</span>
          </h2>
          <p className="mt-4 text-navy-900/50 max-w-2xl mx-auto text-base leading-relaxed">
            Upload your <span className="text-navy-900 font-medium">CAMS</span> or{' '}
            <span className="text-navy-900 font-medium">KFintech</span> statement and instantly get
            true XIRR, overlap analysis, expense drag, benchmark comparison, and an
            AI-generated rebalancing plan.
          </p>

          {/* Upload CTA */}
          <motion.button
            onClick={() => setShowUpload(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mt-8 inline-flex items-center gap-2.5 btn-primary px-7 py-3 text-base">
            <Upload size={16} />
            Upload Statement — Free
          </motion.button>
          <p className="mt-3 text-navy-900/25 text-xs">Supports CAMS · KFintech · Results in &lt;10 seconds</p>
        </motion.div>

        {/* ── Stats strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Portfolio Value',  value: `₹${totalValue}L`,     sub: 'across 7 funds',           icon: <TrendingUp size={14} className="text-navy-900/40" /> },
            { label: 'True XIRR',        value: `${portfolioXirr}%`,   sub: '+3.3% vs category avg',    icon: <TrendingUp size={14} className="text-green-600" /> },
            { label: 'Expense Drag',     value: `${totalExpenseDrag}%`, sub: '₹14,352/yr eroded',        icon: <TrendingDown size={14} className="text-red-500" /> },
            { label: 'Overlap Score',    value: `${overlapScore}/100`,  sub: 'Moderate — action needed', icon: <AlertTriangle size={14} className="text-amber-500" /> },
          ].map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.07 }}
              className="glass-card p-4">
              <div className="flex items-center gap-1.5 text-navy-900/40 text-xs mb-1.5">
                {s.icon}{s.label}
              </div>
              <p className="text-2xl font-extrabold text-navy-900">{s.value}</p>
              <p className="text-xs text-navy-900/35 mt-0.5">{s.sub}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Main 3-column grid ── */}
        <div className="grid lg:grid-cols-3 gap-6 items-start relative">
          <AnimatePresence>
            {showUpload && <UploadOverlay onDismiss={() => setShowUpload(false)} />}
          </AnimatePresence>

          {/* ── Col 1: Allocation donut + overlap ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-5">

            {/* Donut */}
            <div className="glass-card p-5">
              <p className="text-sm font-semibold text-navy-900/70 mb-4">Asset Allocation</p>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={allocation}
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={85}
                    dataKey="value"
                    labelLine={false}
                    label={PieLabel}
                    strokeWidth={0}>
                    {allocation.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="mt-3 space-y-1.5">
                {allocation.map(a => (
                  <div key={a.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: a.color }} />
                      <span className="text-navy-900/55">{a.name}</span>
                    </div>
                    <span className="font-bold text-navy-900">{a.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Overlap detector */}
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-navy-900/70">Stock Overlap</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border
                  text-amber-600 bg-amber-50 border-amber-200">Moderate</span>
              </div>
              <p className="text-xs text-navy-900/40 mb-3 leading-relaxed">
                These stocks appear across 3+ of your funds — you're more concentrated than you think.
              </p>
              <div className="space-y-2">
                {overlappingStocks.map(s => (
                  <div key={s.stock}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50/50
                      border border-amber-200/60 text-xs">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={11} className="text-amber-500 flex-shrink-0" />
                      <span className="text-navy-900 font-medium">{s.stock}</span>
                    </div>
                    <div className="flex items-center gap-3 text-navy-900/45">
                      <span>{s.funds} funds</span>
                      <span className="font-bold text-navy-900/70">{s.weight}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Col 2: Holdings table + benchmark ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-5">

            {/* Holdings */}
            <div className="glass-card p-5">
              <p className="text-sm font-semibold text-navy-900/70 mb-4">Your Holdings</p>
              <div className="space-y-2">
                {holdings.map((h, i) => (
                  <motion.div key={h.fund}
                    initial={{ opacity: 0, x: -8 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.35 + i * 0.06 }}
                    className={`p-3 rounded-xl border transition-all duration-200 hover:bg-navy-900/[0.02]
                      ${h.overlap >= 3 ? 'border-amber-200 bg-amber-50/30' : 'border-navy-900/[0.06] bg-navy-900/[0.01]'}`}>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {h.overlap >= 3 && <AlertTriangle size={10} className="text-amber-500 flex-shrink-0 mt-0.5" />}
                        <span className="text-xs font-semibold text-navy-900 truncate">{h.fund}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border flex-shrink-0 ${sectorColor[h.sector]}`}>
                        {h.sector}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-navy-900/45">
                      <span className="font-bold text-navy-900/75">{h.weight}%</span>
                      <span>XIRR <span className="text-green-600 font-bold">{h.xirr}%</span></span>
                      <span>ER <span className={`font-bold ${h.er > 1 ? 'text-red-500' : 'text-navy-900/60'}`}>{h.er}%</span></span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Benchmark bar chart */}
            <div className="glass-card p-5">
              <p className="text-sm font-semibold text-navy-900/70 mb-1">Benchmark Comparison</p>
              <p className="text-xs text-navy-900/35 mb-4">5Y XIRR vs indices</p>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={benchmark} barSize={28}
                  margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="rgba(10,25,47,0.05)" />
                  <XAxis dataKey="label" tick={{ fill: 'rgba(10,25,47,0.45)', fontSize: 10, fontFamily: 'Plus Jakarta Sans' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(10,25,47,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} domain={[10, 20]} unit="%" />
                  <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(10,25,47,0.03)' }} />
                  <Bar dataKey="xirr" radius={[4, 4, 0, 0]}>
                    {benchmark.map((entry) => (
                      <Cell key={entry.label} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-3 p-2.5 rounded-lg bg-navy-900/[0.03] border border-navy-900/[0.06] text-center">
                <p className="text-[10px] text-navy-900/40">Your alpha over Nifty 50</p>
                <p className="text-sm font-extrabold text-navy-900 mt-0.5">+3.3% per year</p>
              </div>
            </div>
          </motion.div>

          {/* ── Col 3: AI rebalancing plan ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-card p-5 space-y-4">

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-navy-900/[0.06] border border-navy-900/10 flex items-center justify-center">
                <Zap size={13} className="text-navy-900/60" />
              </div>
              <p className="text-sm font-semibold text-navy-900/70">AI Rebalancing Plan</p>
            </div>

            {/* Expense ratio alert */}
            <div className="p-3 rounded-xl bg-red-50/60 border border-red-200 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border text-red-600 bg-red-50 border-red-200">Critical</span>
              </div>
              <p className="text-sm font-semibold text-navy-900">Switch to Direct Plans</p>
              <p className="text-xs text-navy-900/50 leading-relaxed">
                Axis ELSS charges <span className="text-red-600 font-medium">1.59% ER</span>. Switching to direct
                saves <span className="text-navy-900 font-medium">₹9,200/yr</span> at current NAV.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border text-amber-600 bg-amber-50 border-amber-200">High</span>
              </div>
              <p className="text-sm font-semibold text-navy-900">Reduce HDFC–ICICI Overlap</p>
              <p className="text-xs text-navy-900/50 leading-relaxed">
                Both funds hold 7 identical top-10 stocks. Consider replacing ICICI BlueChip with a
                mid-cap or international fund for true diversification.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border text-blue-600 bg-blue-50 border-blue-200">Medium</span>
              </div>
              <p className="text-sm font-semibold text-navy-900">Add Debt for Stability</p>
              <p className="text-xs text-navy-900/50 leading-relaxed">
                At 86% equity your portfolio is high-risk. Add a short-duration debt fund to reach
                your 70/30 target allocation.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-green-50/60 border border-green-200 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border text-green-600 bg-green-50 border-green-200">Great</span>
              </div>
              <p className="text-sm font-semibold text-navy-900">Parag Parikh — Keep & Top Up</p>
              <p className="text-xs text-navy-900/50 leading-relaxed">
                Lowest overlap, direct plan, 17.3% XIRR. Ideal core holding — increase SIP by
                ₹2,000/month.
              </p>
            </div>

            {/* Impact summary */}
            <div className="pt-1 p-3 rounded-xl bg-navy-900/[0.02] border border-navy-900/[0.06]">
              <p className="text-[10px] text-navy-900/40 mb-2 uppercase tracking-wider">Estimated Impact</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'Annual Saving', value: '₹23.5K' },
                  { label: 'XIRR Gain',     value: '+1.8%' },
                  { label: 'Risk Reduced',  value: '↓ 12%' },
                ].map(m => (
                  <div key={m.label}>
                    <p className="text-sm font-extrabold text-navy-900">{m.value}</p>
                    <p className="text-[9px] text-navy-900/35 mt-0.5">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowUpload(true)}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-1">
              <Upload size={14} />
              Upload My Statement
              <ChevronRight size={14} />
            </button>
            <p className="text-center text-[10px] text-navy-900/25">No signup required · 100% private</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
