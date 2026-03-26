import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Wallet, Coins, Target, Flame, Info, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function FireCalculator() {
  const [monthlyExpense, setMonthlyExpense] = useState(50000);
  const [currentAge, setCurrentAge] = useState(25);
  const [retirementAge, setRetirementAge] = useState(45);
  const [inflationRate, setInflationRate] = useState(8);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [coastFireAge, setCoastFireAge] = useState(30);
  const [currentSavings, setCurrentSavings] = useState(500000);

  const results = useMemo(() => {
    const expenseToday = monthlyExpense * 12;
    const yearsToRetire = Math.max(0, retirementAge - currentAge);
    
    // Future value of expenses at retirement
    const expenseAtRetirement = expenseToday * Math.pow(1 + inflationRate / 100, yearsToRetire);
    
    const leanFire = expenseAtRetirement * 20;
    const standardFire = expenseAtRetirement * 25;
    const fatFire = expenseAtRetirement * 50;
    
    const yearsToGrowForCoast = Math.max(0, retirementAge - coastFireAge);
    const coastFire = standardFire / Math.pow(1 + expectedReturn / 100, yearsToGrowForCoast);

    // SIP Calculation
    // FV = P * ((1 + r)^n - 1) / r * (1 + r) + PV * (1 + r)^n
    // Standard FIRE = MonthlySIP * (((1 + r/12)^(years*12) - 1) / (r/12)) * (1 + r/12) + CurrentSavings * (1 + r/12)^(years*12)
    
    const r = expectedReturn / 100 / 12;
    const n = yearsToRetire * 12;
    const pv = currentSavings;
    const fv = standardFire;
    
    let requiredMonthlySip = 0;
    if (n > 0) {
      const fvFromSavings = pv * Math.pow(1 + r, n);
      const remainingFv = Math.max(0, fv - fvFromSavings);
      requiredMonthlySip = remainingFv / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    }

    // Chart Data
    const chartData = [];
    for (let i = 0; i <= yearsToRetire; i++) {
      const age = currentAge + i;
      const months = i * 12;
      const value = pv * Math.pow(1 + r, months) + (requiredMonthlySip * ((Math.pow(1 + r, months) - 1) / r) * (1 + r));
      chartData.push({
        age,
        portfolio: Math.round(value),
        fireGoal: Math.round(standardFire)
      });
    }

    return {
      expenseToday,
      expenseAtRetirement,
      leanFire,
      standardFire,
      fatFire,
      coastFire,
      requiredMonthlySip,
      chartData
    };
  }, [monthlyExpense, currentAge, retirementAge, inflationRate, expectedReturn, coastFireAge, currentSavings]);

  const InputField = ({ label, value, onChange, min = 0, max = 100, step = 1, icon: Icon, prefix = '', suffix = '' }) => (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <label className="text-sm font-medium text-white/90 flex items-center gap-2">
          {Icon && <Icon size={16} className="text-green-growth" />}
          {label}
        </label>
        <div className="flex items-center gap-1">
          {prefix && <span className="text-white/50 text-sm">{prefix}</span>}
          <input 
            type="number"
            id={`input-${label.replace(/\s+/g, '-').toLowerCase()}`}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="bg-transparent border-b border-white/20 text-white font-bold w-24 text-right focus:outline-none focus:border-green-growth [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            min={min}
            max={max}
            step={step}
          />
          {suffix && <span className="text-white/50 text-sm">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-green-growth"
      />
    </div>
  );

  const ResultCard = ({ title, amount, description, highlight = false, icon: Icon, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`p-6 rounded-2xl border ${
        highlight 
          ? 'bg-gradient-to-br from-green-growth/20 to-navy-800 border-green-growth/50 shadow-[0_0_30px_rgba(46,204,113,0.15)]' 
          : 'bg-navy-900/50 border-white/[0.05]'
      } backdrop-blur-sm relative overflow-hidden`}
    >
      <div className="absolute -top-4 -right-4 p-4 opacity-5">
        {Icon && <Icon size={120} />}
      </div>
      <h3 className="text-white/70 text-sm font-medium mb-1 relative z-10 flex items-center gap-2">
        {Icon && <Icon size={16} className={highlight ? "text-green-growth" : "text-white/50"} />}
        {title}
      </h3>
      <div className={`text-3xl font-bold mb-2 relative z-10 ${highlight ? 'text-white' : 'text-white/90'}`}>
        {formatCurrency(amount)}
      </div>
      <p className="text-xs text-white/50 relative z-10 leading-relaxed max-w-[90%]">{description}</p>
    </motion.div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-navy-800 border border-white/10 p-4 rounded-xl backdrop-blur-md shadow-xl">
          <p className="text-white font-bold mb-1">Age: {label}</p>
          <p className="text-green-growth">Portfolio: {formatCurrency(payload[0].value)}</p>
          <p className="text-white/40 text-[10px] mt-1">Goal: {formatCurrency(payload[0].payload.fireGoal)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-navy-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 mt-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 rounded-2xl bg-green-growth/20 border border-green-growth/40 flex items-center justify-center mx-auto mb-6"
          >
            <Flame size={32} className="text-green-growth" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Discover Your <span className="text-green-growth">FIRE</span> Number
          </h1>
          <p className="text-lg text-white/60">
            Financial Independence, Retire Early. Calculate exactly how much you need to invest today to secure your tomorrow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Inputs Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 space-y-8"
          >
            <div className="bg-navy-800/80 rounded-3xl p-6 sm:p-8 border border-white/[0.05] backdrop-blur-xl hover:border-white/[0.1] transition-colors relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-growth/5 rounded-full blur-3xl -mr-10 -mt-10" />
              
              <h2 className="text-xl font-semibold text-white mb-8 flex items-center gap-2 relative z-10">
                <Calculator className="text-green-growth" size={20} />
                Your Parameters
              </h2>
              
              <div className="relative z-10">
                <InputField 
                  label="Monthly Expenses" 
                  value={monthlyExpense} 
                  onChange={setMonthlyExpense} 
                  min={10000} max={500000} step={5000} prefix="₹" 
                  icon={Wallet}
                />
                <InputField 
                  label="Current Savings" 
                  value={currentSavings} 
                  onChange={setCurrentSavings} 
                  min={0} max={10000000} step={50000} prefix="₹" 
                  icon={Coins}
                />
                <InputField 
                  label="Current Age" 
                  value={currentAge} 
                  onChange={setCurrentAge} 
                  min={18} max={80} 
                  icon={Target}
                />
                <InputField 
                  label="Retirement Age" 
                  value={retirementAge} 
                  onChange={setRetirementAge} 
                  min={currentAge + 1} max={90} 
                  icon={Flame}
                />
                <InputField 
                  label="Inflation Rate" 
                  value={inflationRate} 
                  onChange={setInflationRate} 
                  min={1} max={15} step={0.5} suffix="%" 
                  icon={TrendingUp}
                />
                <InputField 
                  label="Expected Return" 
                  value={expectedReturn} 
                  onChange={setExpectedReturn} 
                  min={1} max={20} step={0.5} suffix="%" 
                  icon={TrendingUp}
                />
              </div>
            </div>
          </motion.div>

          {/* Results Section */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <div className="bg-gradient-to-r from-green-growth/20 to-navy-800 border border-green-growth/50 p-8 rounded-3xl relative overflow-hidden">
                   <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div>
                        <h3 className="text-green-growth font-medium mb-1 flex items-center gap-2">
                          <Target size={18} />
                          Target FIRE Number
                        </h3>
                        <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                          {formatCurrency(results.standardFire)}
                        </div>
                        <p className="text-white/50 text-sm max-w-md">The nest egg required to sustain your lifestyle indefinitely at age {retirementAge}.</p>
                      </div>
                      <div className="bg-navy-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 min-w-[240px]">
                        <h4 className="text-white/60 text-xs uppercase tracking-wider font-bold mb-2">Monthly SIP Required</h4>
                        <div className="text-2xl font-bold text-white">
                          {formatCurrency(results.requiredMonthlySip)}
                        </div>
                        <p className="text-white/40 text-[10px] mt-2 italic">Assuming {expectedReturn}% annual returns</p>
                      </div>
                   </div>
                   <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-green-growth/10 rounded-full blur-3xl" />
                </div>
              </div>

              <ResultCard 
                title="Coast FIRE" 
                amount={results.coastFire} 
                description={`Invest this much by age ${coastFireAge} and let it compound to your FIRE number without contributing another rupee.`}
                icon={Coins}
                delay={0.1}
              />

              <ResultCard 
                title="Annual Retirement Expense" 
                amount={results.expenseAtRetirement} 
                description={`Your current ${formatCurrency(results.expenseToday)}/yr expenses will grow to this by age ${retirementAge} due to ${inflationRate}% inflation.`}
                icon={TrendingUp}
                delay={0.2}
              />
            </div>

            {/* Growth Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-navy-800/50 border border-white/[0.05] rounded-3xl p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">Portfolio Projection</h3>
                  <p className="text-white/40 text-sm">Visualizing your journey from {currentAge} to {retirementAge}</p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5 text-green-growth">
                    <span className="w-2 h-2 rounded-full bg-green-growth" /> Portfolio
                  </div>
                  <div className="flex items-center gap-1.5 text-white/20">
                    <span className="w-2 h-2 rounded-full bg-white/20" /> FIRE Limit
                  </div>
                </div>
              </div>
              
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={results.chartData}>
                    <defs>
                      <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2ecc71" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2ecc71" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis 
                      dataKey="age" 
                      stroke="#ffffff20" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      dy={10}
                    />
                    <YAxis 
                      hide={true}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="portfolio" 
                      stroke="#2ecc71" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorPortfolio)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <ResultCard 
                title="Lean FIRE" 
                amount={results.leanFire} 
                description="The 'Barebones' target. 20x annual expenses for a minimalist lifestyle."
                icon={Wallet}
                delay={0.4}
              />
              <ResultCard 
                title="Fat FIRE" 
                amount={results.fatFire} 
                description="The 'Luxury' target. 50x annual expenses for high-end living and safety."
                icon={TrendingUp}
                delay={0.5}
              />
            </div>
          </div>
        </div>

        {/* About FIRE Section */}
        <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           className="border-t border-white/5 pt-16 pb-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <div className="sticky top-24">
                <h2 className="text-3xl font-bold text-white mb-6">What is <span className="text-green-growth">FIRE</span>?</h2>
                <div className="space-y-4 text-white/60 leading-relaxed">
                  <p>FIRE stands for <strong>Financial Independence, Retire Early</strong>. It is a financial movement defined by frugality and extreme savings and investment.</p>
                  <p>By saving up to 50–70% of your income, FIRE followers reach a "FIRE Number"—the point where investment returns can cover all living expenses forever.</p>
                  <div className="pt-4">
                    <button className="flex items-center gap-2 text-green-growth font-bold hover:gap-3 transition-all">
                      Read more on our blog <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-3xl bg-navy-900/30 border border-white/5 hover:border-green-growth/30 transition-colors">
                <CheckCircle2 className="text-green-growth mb-4" size={24} />
                <h4 className="text-white font-bold text-lg mb-3">The 4% Rule</h4>
                <p className="text-white/50 text-sm leading-relaxed">Most FIRE calculators use the 4% rule (yielding a 25x multiple). If you withdraw 4% of your nest egg annually, inflation-adjusted, your money is statistically likely to last 30+ years.</p>
              </div>

              <div className="p-8 rounded-3xl bg-navy-900/30 border border-white/5 hover:border-green-growth/30 transition-colors">
                <CheckCircle2 className="text-green-growth mb-4" size={24} />
                <h4 className="text-white font-bold text-lg mb-3">Lean vs Fat FIRE</h4>
                <p className="text-white/50 text-sm leading-relaxed"><strong>Lean FIRE</strong> is for those planning a minimalist retirement. <strong>Fat FIRE</strong> is for those wanting a standard of living higher than their current one, often requiring a 50x multiple.</p>
              </div>

              <div className="p-8 rounded-3xl bg-navy-900/30 border border-white/5 hover:border-green-growth/30 transition-colors">
                <CheckCircle2 className="text-green-growth mb-4" size={24} />
                <h4 className="text-white font-bold text-lg mb-3">Coast FIRE</h4>
                <p className="text-white/50 text-sm leading-relaxed">The point where you have enough in retirement accounts that, even if you never contribute another cent, your accounts will grow to support you by your traditional retirement age.</p>
              </div>

              <div className="p-8 rounded-3xl bg-navy-900/30 border border-white/5 hover:border-green-growth/30 transition-colors">
                <CheckCircle2 className="text-green-growth mb-4" size={24} />
                <h4 className="text-white font-bold text-lg mb-3">Inflation Impact</h4>
                <p className="text-white/50 text-sm leading-relaxed">A crucial parameter. If current inflation is 6-8%, your expenses double roughly every 10 years. Our calculator compounds your current lifestyle costs into the future to ensure accuracy.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
