import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Tooltip
} from 'recharts'
import {
  Flame, Sparkles, Home, GraduationCap, Palmtree, ShieldAlert, MessageSquare, Download, CalendarCheck
} from 'lucide-react'

const formatUSD = (val) => {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(val >= 10000000 ? 0 : 1)}M`
  if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`
  return `$${val}`
}

function generateChartData(currentAge, goalAge, monthlyIncome, monthlyExpenses, corpus) {
  const data = []
  const annualSavings = (monthlyIncome - monthlyExpenses) * 12
  const growthRate = 0.10
  const inflationRate = 0.06
  const annualExpenses = monthlyExpenses * 12
  const fiNumber = annualExpenses * 25

  let wealth = corpus
  for (let age = currentAge; age <= Math.max(goalAge + 5, 55); age++) {
    const adjustedFI = fiNumber * Math.pow(1 + inflationRate, age - currentAge)
    data.push({
      age,
      wealth: Math.round(wealth),
      fiNumber: Math.round(adjustedFI),
    })
    wealth = wealth * (1 + growthRate) + annualSavings
  }
  return data
}

function findCrossover(data) {
  for (let i = 1; i < data.length; i++) {
    if (data[i - 1].wealth < data[i - 1].fiNumber && data[i].wealth >= data[i].fiNumber) {
      const prev = data[i - 1]
      const curr = data[i]
      const ratio = (prev.fiNumber - prev.wealth) / ((curr.wealth - prev.wealth) - (curr.fiNumber - prev.fiNumber))
      return (prev.age + ratio).toFixed(1)
    }
  }
  return null
}

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-navy-900/10 shadow-xl rounded-xl px-4 py-3 text-xs">
      <p className="text-navy-900/50 mb-1.5 font-medium">Age {label}</p>
      <p className="text-navy-900 font-bold">Wealth: {formatUSD(payload[0]?.value)}</p>
      <p className="text-navy-900/50">FI Number: {formatUSD(payload[1]?.value)}</p>
    </div>
  )
}

export default function FirePathPlanner() {
  const [currentAge, setCurrentAge] = useState(28)
  const [goalAge, setGoalAge] = useState(45)
  const [monthlyIncome, setMonthlyIncome] = useState(8500)
  const [monthlyExpenses, setMonthlyExpenses] = useState(3200)
  const [corpus, setCorpus] = useState(125000)

  const chartData = useMemo(
    () => generateChartData(currentAge, goalAge, monthlyIncome, monthlyExpenses, corpus),
    [currentAge, goalAge, monthlyIncome, monthlyExpenses, corpus]
  )
  const crossoverAge = useMemo(() => findCrossover(chartData), [chartData])

  const annualExpenses = monthlyExpenses * 12
  const yearsToFreedom = crossoverAge ? (crossoverAge - currentAge).toFixed(1) : (goalAge - currentAge)
  const projectedCorpus = chartData.find(d => d.age === goalAge)?.wealth || 0
  const annualSWR = Math.round(projectedCorpus * 0.04)

  const goals = [
    { icon: Home, label: 'DREAM HOUSE', name: 'Dream House', sip: '$1,250', years: '7 YEARS LEFT', status: 'ON TRACK', statusColor: 'text-green-600 bg-green-50' },
    { icon: GraduationCap, label: 'CHILD EDUCATION', name: 'Child Education', sip: '$800', years: '12 YEARS LEFT', status: 'ON TRACK', statusColor: 'text-green-600 bg-green-50' },
    { icon: Palmtree, label: 'EARLY RETREAT', name: 'Early Retreat', sip: '$3,150', years: '16.5 YEARS LEFT', status: 'NEEDS BOOST', statusColor: 'text-red-600 bg-red-50' },
  ]

  return (
    <section id="fire" className="py-16 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">FIRE Path Planner</h1>
          <p className="text-navy-900/50 text-base mt-2 max-w-2xl">
            Engineer your escape from the 9-to-5. Our AI-driven engine maps your route
            to Financial Independence and Early Retirement with precision.
          </p>
        </div>

        {/* Main 2-column: Parameters + Chart */}
        <div className="grid lg:grid-cols-5 gap-6 mb-6">
          {/* Profile Parameters */}
          <div className="lg:col-span-2 glass-card p-6">
            <h2 className="flex items-center gap-2 text-base font-bold text-navy-900 mb-6">
              <Sparkles size={16} className="text-navy-900/40" />
              Profile Parameters
            </h2>

            <div className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-navy-900/50 uppercase tracking-wider">Current Age & Goal Age</label>
                <div className="flex gap-3 mt-2">
                  <input
                    type="number" value={currentAge}
                    onChange={e => setCurrentAge(Math.max(18, +e.target.value))}
                    className="w-full bg-navy-900/[0.03] border border-navy-900/10 rounded-lg px-4 py-2.5 text-navy-900 font-bold text-sm focus:outline-none focus:border-navy-900/30"
                  />
                  <input
                    type="number" value={goalAge}
                    onChange={e => setGoalAge(Math.max(currentAge + 1, +e.target.value))}
                    className="w-full bg-navy-900/[0.03] border border-navy-900/10 rounded-lg px-4 py-2.5 text-navy-900 font-bold text-sm focus:outline-none focus:border-navy-900/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-navy-900/50 uppercase tracking-wider">Monthly Post-Tax Income</label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-900/40 text-sm font-medium">$</span>
                  <input
                    type="number" value={monthlyIncome}
                    onChange={e => setMonthlyIncome(Math.max(0, +e.target.value))}
                    className="w-full bg-navy-900/[0.03] border border-navy-900/10 rounded-lg pl-8 pr-4 py-2.5 text-navy-900 font-bold text-sm focus:outline-none focus:border-navy-900/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-navy-900/50 uppercase tracking-wider">Monthly Core Expenses</label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-900/40 text-sm font-medium">$</span>
                  <input
                    type="number" value={monthlyExpenses}
                    onChange={e => setMonthlyExpenses(Math.max(0, +e.target.value))}
                    className="w-full bg-navy-900/[0.03] border border-navy-900/10 rounded-lg pl-8 pr-4 py-2.5 text-navy-900 font-bold text-sm focus:outline-none focus:border-navy-900/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-navy-900/50 uppercase tracking-wider">Current Investable Corpus</label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-900/40 text-sm font-medium">$</span>
                  <input
                    type="number" value={corpus}
                    onChange={e => setCorpus(Math.max(0, +e.target.value))}
                    className="w-full bg-navy-900/[0.03] border border-navy-900/10 rounded-lg pl-8 pr-4 py-2.5 text-navy-900 font-bold text-sm focus:outline-none focus:border-navy-900/30"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Accumulation Arc Chart */}
          <div className="lg:col-span-3 glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-navy-900">The Accumulation Arc</h2>
                <p className="text-xs text-navy-900/40 mt-0.5">Wealth trajectory vs. Withdrawal threshold</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-navy-900/50">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-navy-900"></span>Wealth</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>FI Number</span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="wealthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0A192F" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#0A192F" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(10,25,47,0.06)" />
                <XAxis dataKey="age" tick={{ fill: 'rgba(10,25,47,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={formatUSD} tick={{ fill: 'rgba(10,25,47,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} width={55} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="wealth" stroke="#0A192F" strokeWidth={2.5} fill="url(#wealthGrad)" />
                <Area type="monotone" dataKey="fiNumber" stroke="#10B981" strokeWidth={2} strokeDasharray="6 4" fill="none" />
                {crossoverAge && (
                  <ReferenceLine x={Math.round(parseFloat(crossoverAge))} stroke="#0A192F" strokeDasharray="3 3" strokeWidth={1} />
                )}
              </AreaChart>
            </ResponsiveContainer>

            {crossoverAge && (
              <div className="flex justify-center mt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-900 text-white text-[10px] font-bold uppercase tracking-wider">
                  Crossover: Age {crossoverAge}
                </span>
              </div>
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-navy-900/[0.06]">
              <div className="text-center">
                <p className="text-[10px] font-semibold text-navy-900/40 uppercase tracking-wider">Projected FIRE Corpus</p>
                <p className="text-xl font-extrabold text-navy-900 mt-1">{formatUSD(projectedCorpus)}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-semibold text-navy-900/40 uppercase tracking-wider">Annual SWR (4%)</p>
                <p className="text-xl font-extrabold text-green-600 mt-1">{formatUSD(annualSWR)}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-semibold text-navy-900/40 uppercase tracking-wider">Years to Freedom</p>
                <p className="text-xl font-extrabold text-navy-900 mt-1">{yearsToFreedom}</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendation + Goal Cards */}
        <div className="grid lg:grid-cols-4 gap-4 mb-6">
          {/* AI Recommendation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-5 border-l-4 border-l-navy-900"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-navy-900/50" />
              <span className="text-xs font-bold text-navy-900 uppercase tracking-wider">AI Recommendation</span>
            </div>
            <p className="text-sm text-navy-900/65 leading-relaxed">
              Increasing your SIP by 12% annually aligns your "Fat FIRE" goal with your {goalAge}th birthday. Current path leads to "Lean FIRE" at {Math.min(goalAge + 2, 55)}.
            </p>
          </motion.div>

          {/* Goal Cards */}
          {goals.map(g => (
            <motion.div
              key={g.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <g.icon size={14} className="text-navy-900/40" />
                <span className="text-[10px] font-bold text-navy-900/50 uppercase tracking-wider">{g.label}</span>
              </div>
              <p className="text-xs text-navy-900/40">Monthly SIP</p>
              <p className="text-2xl font-extrabold text-navy-900">{g.sip}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] text-navy-900/40 font-medium">{g.years}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${g.statusColor}`}>{g.status}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Insurance Gap + Glide Path */}
        <div className="grid lg:grid-cols-5 gap-4 mb-6">
          {/* Insurance Coverage Gap */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 glass-card p-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base font-bold text-red-600">Insurance Coverage Gap</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white">CRITICAL</span>
            </div>
            <p className="text-sm text-navy-900/50 leading-relaxed mb-4">
              Your current Life and Health coverage is $450k below the architect's safety threshold for a FIRE journey.
            </p>
            <div className="w-full h-2 rounded-full bg-navy-900/[0.06] overflow-hidden mb-3">
              <div className="h-full rounded-full bg-red-500" style={{ width: '25%' }}></div>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-navy-900/40 font-medium">CURRENT: $150K</span>
              <span className="text-navy-900/40 font-medium">TARGET: $600K</span>
            </div>
          </motion.div>

          {/* Glide Path */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 glass-card p-5"
          >
            <h3 className="text-base font-bold text-navy-900 mb-6">Glide Path: Asset Allocation Timeline</h3>
            <div className="flex items-end justify-between px-2">
              {[
                { age: currentAge, label: 'AGGRESSIVE', sub: `Equity: 90%\nDebt: 10%`, color: 'bg-navy-900 text-white' },
                { age: 35, label: 'GROWTH', sub: `Equity: 75%\nDebt: 25%`, color: 'bg-navy-800 text-white' },
                { age: 40, label: 'BALANCED', sub: `Equity: 60%\nDebt: 40%`, color: 'bg-navy-900/20 text-navy-900' },
                { age: goalAge, label: 'CAPITAL PRES.', sub: `Equity: 30%\nDebt: 70%`, color: 'bg-navy-900 text-white', highlight: true },
              ].map((phase, i) => (
                <div key={i} className="flex flex-col items-center text-center flex-1">
                  <div className={`w-10 h-10 rounded-full ${phase.color} flex items-center justify-center text-sm font-bold mb-2`}>
                    {phase.age}
                  </div>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${phase.highlight ? 'text-green-600' : 'text-navy-900/60'}`}>{phase.label}</p>
                  <p className="text-[9px] text-navy-900/35 mt-1 whitespace-pre-line">{phase.sub}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Ask AI + Chat Bubble floating */}
        <div className="fixed bottom-6 left-6 z-40">
          <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-navy-900 text-white text-sm font-semibold shadow-lg hover:bg-navy-800 transition-colors">
            <Sparkles size={16} />
            Ask AI Mentor
          </button>
        </div>
        <div className="fixed bottom-6 right-6 z-40">
          <button className="w-12 h-12 rounded-full bg-navy-900 text-white flex items-center justify-center shadow-lg hover:bg-navy-800 transition-colors">
            <MessageSquare size={20} />
          </button>
        </div>

        {/* Footer */}
        <div className="glass-card p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-navy-900/10 flex items-center justify-center">
              <span className="text-xs font-bold text-navy-900">AM</span>
            </div>
            <div>
              <p className="text-sm font-bold text-navy-900">Arjun Mehta, CFA</p>
              <p className="text-[10px] text-navy-900/40 uppercase tracking-wider">Chief Financial Strategist, ET Intel</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-navy-900/15 text-navy-900/70 text-sm font-medium hover:border-navy-900/30 transition-colors">
              <Download size={14} />
              Download Roadmap PDF
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors">
              <CalendarCheck size={14} />
              Schedule Portfolio Review
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-navy-900/25 text-[10px] mt-4">
          * AI-generated roadmap for educational purposes only. Consult a SEBI-registered financial advisor before investing.
        </p>
      </div>
    </section>
  )
}
