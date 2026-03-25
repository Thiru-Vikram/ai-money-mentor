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
  { name: 'Large Cap Equity', value: 47, color: '#10B981' },
  { name: 'Mid & Small Cap',  value: 28, color: '#34D399' },
  { name: 'Debt / Bonds',     value: 14, color: '#6EE7B7' },
  { name: 'International',    value:  7, color: '#065F46' },
  { name: 'Gold / REITs',     value:  4, color: '#A7F3D0' },
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
  { label: 'Your Portfolio', xirr: 16.1, color: '#10B981' },
  { label: 'Nifty 50',       xirr: 12.8, color: '#334155' },
  { label: 'Sensex',         xirr: 12.4, color: '#334155' },
  { label: 'Category Avg',   xirr: 13.6, color: '#334155' },
]

const overlappingStocks = [
  { stock: 'HDFC Bank',    funds: 5, weight: '8.2%' },
  { stock: 'Infosys',      funds: 4, weight: '5.7%' },
  { stock: 'Reliance Ind.',funds: 4, weight: '4.9%' },
  { stock: 'ICICI Bank',   funds: 3, weight: '6.1%' },
]

const portfolioXirr    = 16.1
const totalExpenseDrag = 0.78   // % p.a. weighted avg ER
const overlapScore     = 68     // 0–100, lower is better
const totalValue       = 18.4   // ₹ lakhs

/* ─── Helpers ───────────────────────────────────────────────────────────────── */
const sectorColor = {
  'Large Cap': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  'Mid Cap':   'text-purple-400 bg-purple-400/10 border-purple-400/20',
  'Flexi Cap': 'text-teal-400 bg-teal-400/10 border-teal-400/20',
  'Small Cap': 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  'ELSS':      'text-pink-400 bg-pink-400/10 border-pink-400/20',
  'Index':     'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
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
    <div className="bg-navy-800/90 border border-white/10 backdrop-blur-md rounded-xl px-3 py-2 text-xs">
      <p className="text-white font-semibold">{d.name}</p>
      <p style={{ color: d.payload.color }}>{d.value}%</p>
    </div>
  )
}

const BarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-navy-800/90 border border-white/10 backdrop-blur-md rounded-xl px-3 py-2 text-xs">
      <p className="text-white/60 mb-1">{label}</p>
      <p className="text-green-growth font-bold">{payload[0].value}% XIRR</p>
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
      className="absolute inset-0 z-20 flex items-center justify-center bg-navy-900/80 backdrop-blur-sm rounded-2xl"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="glass-card p-8 max-w-md w-full mx-4 text-center relative">
        <button onClick={onDismiss}
          className="absolute top-4 right-4 text-white/30 hover:text-white/70 transition-colors">
          <X size={16} />
        </button>

        {!file && !scanning && !done && (
          <>
            <div className="w-14 h-14 rounded-2xl bg-green-growth/10 border border-green-growth/20
              flex items-center justify-center mx-auto mb-5">
              <Upload size={24} className="text-green-growth" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Upload Your Statement</h3>
            <p className="text-white/50 text-sm mb-6 leading-relaxed">
              Supports <span className="text-white font-medium">CAMS</span> and{' '}
              <span className="text-white font-medium">KFintech</span> consolidated account
              statements (PDF or XLSX). Your data never leaves your device.
            </p>
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
              className={`border-2 border-dashed rounded-xl p-8 transition-all duration-200 cursor-pointer
                ${dragging ? 'border-green-growth/60 bg-green-growth/5' : 'border-white/10 hover:border-white/25'}`}
              onClick={() => document.getElementById('xray-file-input').click()}>
              <FileText size={32} className="mx-auto mb-3 text-white/20" />
              <p className="text-white/40 text-sm">Drag & drop or <span className="text-green-growth">browse</span></p>
              <p className="text-white/25 text-xs mt-1">PDF, XLSX — max 10 MB</p>
            </div>
            <input id="xray-file-input" type="file" accept=".pdf,.xlsx,.xls" className="hidden"
              onChange={e => handleFile(e.target.files[0])} />
          </>
        )}

        {file && scanning && (
          <div className="py-4">
            <div className="w-14 h-14 rounded-2xl bg-green-growth/10 border border-green-growth/20
              flex items-center justify-center mx-auto mb-5 relative">
              <ScanSearch size={24} className="text-green-growth" />
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-green-growth"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Analysing Portfolio…</h3>
            <p className="text-white/40 text-sm mb-6">{file.name}</p>
            <div className="space-y-2 text-left">
              {['Reconstructing transactions…', 'Calculating XIRR…', 'Running overlap analysis…', 'Generating AI insights…'].map((step, i) => (
                <motion.div key={step}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.55 }}
                  className="flex items-center gap-2 text-xs text-white/50">
                  <motion.div className="w-1.5 h-1.5 rounded-full bg-green-growth"
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
            <div className="w-14 h-14 rounded-2xl bg-green-growth/20 border border-green-growth/40
              flex items-center justify-center mx-auto mb-5">
              <ShieldCheck size={24} className="text-green-growth" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">X-Ray Complete!</h3>
            <p className="text-white/50 text-sm">Your full report is ready. Loading results…</p>
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

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px]
        bg-green-growth/5 rounded-full blur-3xl pointer-events-none" />

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
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            10-Second Portfolio <span className="gradient-text">Reconstruction</span>
          </h2>
          <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base leading-relaxed">
            Upload your <span className="text-white font-medium">CAMS</span> or{' '}
            <span className="text-white font-medium">KFintech</span> statement and instantly get
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
          <p className="mt-3 text-white/25 text-xs">Supports CAMS · KFintech · Results in &lt;10 seconds</p>
        </motion.div>

        {/* ── Stats strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Portfolio Value',  value: `₹${totalValue}L`,     sub: 'across 7 funds',           icon: <TrendingUp size={14} className="text-green-growth" /> },
            { label: 'True XIRR',        value: `${portfolioXirr}%`,   sub: '+3.3% vs category avg',    icon: <TrendingUp size={14} className="text-green-growth" /> },
            { label: 'Expense Drag',     value: `${totalExpenseDrag}%`, sub: '₹14,352/yr eroded',        icon: <TrendingDown size={14} className="text-red-400" /> },
            { label: 'Overlap Score',    value: `${overlapScore}/100`,  sub: 'Moderate — action needed', icon: <AlertTriangle size={14} className="text-yellow-400" /> },
          ].map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.07 }}
              className="glass-card p-4">
              <div className="flex items-center gap-1.5 text-white/40 text-xs mb-1.5">
                {s.icon}{s.label}
              </div>
              <p className="text-2xl font-extrabold text-white">{s.value}</p>
              <p className="text-xs text-white/35 mt-0.5">{s.sub}</p>
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
              <p className="text-sm font-semibold text-white/70 mb-4">Asset Allocation</p>
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
                      <span className="text-white/55">{a.name}</span>
                    </div>
                    <span className="font-bold text-white">{a.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Overlap detector */}
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-white/70">Stock Overlap</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border
                  text-yellow-400 bg-yellow-400/10 border-yellow-400/20">Moderate</span>
              </div>
              <p className="text-xs text-white/40 mb-3 leading-relaxed">
                These stocks appear across 3+ of your funds — you're more concentrated than you think.
              </p>
              <div className="space-y-2">
                {overlappingStocks.map(s => (
                  <div key={s.stock}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-yellow-400/[0.04]
                      border border-yellow-400/[0.12] text-xs">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={11} className="text-yellow-400 flex-shrink-0" />
                      <span className="text-white font-medium">{s.stock}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/45">
                      <span>{s.funds} funds</span>
                      <span className="font-bold text-white/70">{s.weight}</span>
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
              <p className="text-sm font-semibold text-white/70 mb-4">Your Holdings</p>
              <div className="space-y-2">
                {holdings.map((h, i) => (
                  <motion.div key={h.fund}
                    initial={{ opacity: 0, x: -8 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.35 + i * 0.06 }}
                    className={`p-3 rounded-xl border transition-all duration-200 hover:bg-white/[0.04]
                      ${h.overlap >= 3 ? 'border-yellow-400/20 bg-yellow-400/[0.03]' : 'border-white/[0.06] bg-white/[0.02]'}`}>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {h.overlap >= 3 && <AlertTriangle size={10} className="text-yellow-400 flex-shrink-0 mt-0.5" />}
                        <span className="text-xs font-semibold text-white truncate">{h.fund}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border flex-shrink-0 ${sectorColor[h.sector]}`}>
                        {h.sector}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-white/45">
                      <span className="font-bold text-white/75">{h.weight}%</span>
                      <span>XIRR <span className="text-green-growth font-bold">{h.xirr}%</span></span>
                      <span>ER <span className={`font-bold ${h.er > 1 ? 'text-red-400' : 'text-white/60'}`}>{h.er}%</span></span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Benchmark bar chart */}
            <div className="glass-card p-5">
              <p className="text-sm font-semibold text-white/70 mb-1">Benchmark Comparison</p>
              <p className="text-xs text-white/35 mb-4">5Y XIRR vs indices</p>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={benchmark} barSize={28}
                  margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'Plus Jakarta Sans' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} domain={[10, 20]} unit="%" />
                  <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="xirr" radius={[4, 4, 0, 0]}>
                    {benchmark.map((entry) => (
                      <Cell key={entry.label} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-3 p-2.5 rounded-lg bg-green-growth/10 border border-green-growth/20 text-center">
                <p className="text-[10px] text-white/40">Your alpha over Nifty 50</p>
                <p className="text-sm font-extrabold text-green-growth mt-0.5">+3.3% per year</p>
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
              <div className="w-7 h-7 rounded-lg bg-green-growth/15 border border-green-growth/25 flex items-center justify-center">
                <Zap size={13} className="text-green-growth" />
              </div>
              <p className="text-sm font-semibold text-white/70">AI Rebalancing Plan</p>
            </div>

            {/* Expense ratio alert */}
            <div className="p-3 rounded-xl bg-red-400/[0.06] border border-red-400/20 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border text-red-400 bg-red-400/10 border-red-400/20">Critical</span>
              </div>
              <p className="text-sm font-semibold text-white">Switch to Direct Plans</p>
              <p className="text-xs text-white/45 leading-relaxed">
                Axis ELSS charges <span className="text-red-400 font-medium">1.59% ER</span>. Switching to direct
                saves <span className="text-white font-medium">₹9,200/yr</span> at current NAV.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-yellow-400/[0.06] border border-yellow-400/20 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border text-yellow-400 bg-yellow-400/10 border-yellow-400/20">High</span>
              </div>
              <p className="text-sm font-semibold text-white">Reduce HDFC–ICICI Overlap</p>
              <p className="text-xs text-white/45 leading-relaxed">
                Both funds hold 7 identical top-10 stocks. Consider replacing ICICI BlueChip with a
                mid-cap or international fund for true diversification.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-blue-400/[0.06] border border-blue-400/20 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border text-blue-400 bg-blue-400/10 border-blue-400/20">Medium</span>
              </div>
              <p className="text-sm font-semibold text-white">Add Debt for Stability</p>
              <p className="text-xs text-white/45 leading-relaxed">
                At 86% equity your portfolio is high-risk. Add a short-duration debt fund to reach
                your 70/30 target allocation.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-green-400/[0.06] border border-green-400/20 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border text-green-400 bg-green-400/10 border-green-400/20">Great</span>
              </div>
              <p className="text-sm font-semibold text-white">Parag Parikh — Keep & Top Up</p>
              <p className="text-xs text-white/45 leading-relaxed">
                Lowest overlap, direct plan, 17.3% XIRR. Ideal core holding — increase SIP by
                ₹2,000/month.
              </p>
            </div>

            {/* Impact summary */}
            <div className="pt-1 p-3 rounded-xl bg-white/[0.03] border border-white/[0.07]">
              <p className="text-[10px] text-white/40 mb-2 uppercase tracking-wider">Estimated Impact</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'Annual Saving', value: '₹23.5K' },
                  { label: 'XIRR Gain',     value: '+1.8%' },
                  { label: 'Risk Reduced',  value: '↓ 12%' },
                ].map(m => (
                  <div key={m.label}>
                    <p className="text-sm font-extrabold text-green-growth">{m.value}</p>
                    <p className="text-[9px] text-white/35 mt-0.5">{m.label}</p>
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
            <p className="text-center text-[10px] text-white/25">No signup required · 100% private</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
