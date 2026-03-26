import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Wallet, Coins, Target, Flame, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';

const MotionDiv = motion.div;
const scenarioButtons = [
  { id: 'save-more', label: 'Save ₹5,000 more/month' },
  { id: 'retire-earlier', label: 'Retire 5 years earlier' },
  { id: 'ten-percent', label: 'Expect 10% returns' },
];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatCompactCurrency = (amount) => {
  const absoluteAmount = Math.abs(amount);

  if (absoluteAmount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2).replace(/\.?0+$/, '')} Cr`;
  }

  if (absoluteAmount >= 100000) {
    return `₹${(amount / 100000).toFixed(2).replace(/\.?0+$/, '')} L`;
  }

  return formatCurrency(amount);
};

const formatInputValue = (value, step) => {
  if (!Number.isFinite(value)) return '';
  if (step < 1) {
    return String(value);
  }

  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(value);
};

const sanitizeInputValue = (rawValue, step) => {
  const pattern = step < 1 ? /[^0-9.]/g : /[^0-9]/g;
  let cleaned = rawValue.replace(pattern, '');

  if (step < 1) {
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      cleaned = `${parts[0]}.${parts.slice(1).join('')}`;
    }
  }

  return cleaned;
};

const clampValue = (value, min, max) => Math.min(max, Math.max(min, value));

const NumberSliderInput = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  icon: Icon,
  prefix = '',
  suffix = '',
}) => {
  const [displayValue, setDisplayValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const commitValue = (nextValue) => {
    const clampedValue = clampValue(nextValue, min, max);
    onChange(clampedValue);
    return clampedValue;
  };

  const handleInputChange = (e) => {
    const cleanedValue = sanitizeInputValue(e.target.value, step);
    setDisplayValue(cleanedValue);

    if (cleanedValue === '' || cleanedValue === '.') {
      return;
    }

    const parsedValue = Number(cleanedValue);
    if (!Number.isNaN(parsedValue)) {
      onChange(clampValue(parsedValue, min, max));
    }
  };

  const handleFocus = (e) => {
    const rawValue = String(value);
    setIsEditing(true);
    setDisplayValue(rawValue);

    requestAnimationFrame(() => {
      const cursorPosition = rawValue.length;
      e.target.setSelectionRange(cursorPosition, cursorPosition);
    });
  };

  const handleBlur = () => {
    setIsEditing(false);

    if (displayValue === '' || displayValue === '.') {
      const resetValue = commitValue(min);
      setDisplayValue(formatInputValue(resetValue, step));
      return;
    }

    const parsedValue = Number(displayValue);
    const finalValue = Number.isNaN(parsedValue) ? min : commitValue(parsedValue);
    setDisplayValue(formatInputValue(finalValue, step));
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2 gap-4">
        <label className="text-sm font-medium text-white/90 flex items-center gap-2">
          {Icon && <Icon size={16} className="text-green-growth" />}
          {label}
        </label>
        <div className="flex items-center gap-1">
          {prefix && <span className="text-white/50 text-sm">{prefix}</span>}
          <input
            type="text"
            inputMode={step < 1 ? 'decimal' : 'numeric'}
            id={`input-${label.replace(/\s+/g, '-').toLowerCase()}`}
            value={isEditing ? displayValue : formatInputValue(value, step)}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="bg-transparent border-b border-white/20 text-white font-bold w-24 text-right focus:outline-none focus:border-green-growth"
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
};

const ResultCard = ({ title, amount, description, highlight = false, icon: Icon, delay = 0 }) => (
  <MotionDiv
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
  </MotionDiv>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const point = payload[0].payload;

    return (
      <div className="bg-navy-800 border border-white/10 p-4 rounded-xl backdrop-blur-md shadow-xl">
        <p className="text-white font-bold mb-1">Age: {label}</p>
        <p className="text-green-growth">Portfolio: {formatCompactCurrency(point.portfolio)}</p>
        <p className="text-white/40 text-[10px] mt-1">Threshold crossed: {point.crossedThreshold}</p>
      </div>
    );
  }
  return null;
};

const MilestoneLabel = ({ viewBox, value, fill }) => {
  if (!viewBox) return null;

  return (
    <text
      x={viewBox.x}
      y={viewBox.y - 14}
      textAnchor="middle"
      fill={fill}
      fontSize={11}
      fontWeight={700}
    >
      {value}
    </text>
  );
};

export default function FireCalculator() {
  const [monthlyExpense, setMonthlyExpense] = useState(50000);
  const [monthlyIncome, setMonthlyIncome] = useState(150000);
  const [currentAge, setCurrentAge] = useState(25);
  const [retirementAge, setRetirementAge] = useState(45);
  const [inflationRate, setInflationRate] = useState(8);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [coastFireAge] = useState(30);
  const [currentSavings, setCurrentSavings] = useState(500000);
  const [activeScenario, setActiveScenario] = useState(null);

  const effectiveMonthlyExpense = activeScenario === 'save-more'
    ? Math.max(10000, monthlyExpense - 5000)
    : monthlyExpense;
  const effectiveRetirementAge = activeScenario === 'retire-earlier'
    ? Math.max(currentAge + 1, retirementAge - 5)
    : retirementAge;
  const effectiveExpectedReturn = activeScenario === 'ten-percent'
    ? 10
    : expectedReturn;

  const results = useMemo(() => {
    const expenseToday = effectiveMonthlyExpense * 12;
    const yearsToRetire = Math.max(0, effectiveRetirementAge - currentAge);
    
    // Future value of expenses at retirement
    const expenseAtRetirement = expenseToday * Math.pow(1 + inflationRate / 100, yearsToRetire);
    
    const leanFire = expenseAtRetirement * 20;
    const standardFire = expenseAtRetirement * 25;
    const fatFire = expenseAtRetirement * 50;
    
    const yearsToGrowForCoast = Math.max(0, effectiveRetirementAge - coastFireAge);
    const coastFire = standardFire / Math.pow(1 + effectiveExpectedReturn / 100, yearsToGrowForCoast);

    // SIP Calculation
    // FV = P * ((1 + r)^n - 1) / r * (1 + r) + PV * (1 + r)^n
    // Standard FIRE = MonthlySIP * (((1 + r/12)^(years*12) - 1) / (r/12)) * (1 + r/12) + CurrentSavings * (1 + r/12)^(years*12)
    
    const r = effectiveExpectedReturn / 100 / 12;
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
        leanFire: Math.round(leanFire),
        fatFire: Math.round(fatFire),
        fireGoal: Math.round(standardFire),
      });
    }

    const chartDataWithThresholds = chartData.map((point) => {
      let crossedThreshold = 'None yet';

      if (point.portfolio >= fatFire) {
        crossedThreshold = 'Fat FIRE';
      } else if (point.portfolio >= standardFire) {
        crossedThreshold = 'FIRE';
      } else if (point.portfolio >= leanFire) {
        crossedThreshold = 'Lean FIRE';
      }

      return {
        ...point,
        crossedThreshold,
      };
    });

    const coastMilestone = chartDataWithThresholds.find((point) => point.portfolio >= coastFire) ?? null;
    const fireMilestone = chartDataWithThresholds.find((point) => point.portfolio >= standardFire) ?? null;

    return {
      expenseToday,
      expenseAtRetirement,
      leanFire,
      standardFire,
      fatFire,
      coastFire,
      requiredMonthlySip,
      chartData: chartDataWithThresholds,
      coastMilestone,
      fireMilestone,
    };
  }, [
    effectiveMonthlyExpense,
    currentAge,
    effectiveRetirementAge,
    inflationRate,
    effectiveExpectedReturn,
    coastFireAge,
    currentSavings,
  ]);

  const savingsRate = monthlyIncome > 0
    ? Math.round((results.requiredMonthlySip / monthlyIncome) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-navy-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 mt-4">
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 rounded-2xl bg-green-growth/20 border border-green-growth/40 flex items-center justify-center mx-auto mb-6"
          >
            <Flame size={32} className="text-green-growth" />
          </MotionDiv>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Discover Your <span className="text-green-growth">FIRE</span> Number
          </h1>
          <p className="text-lg text-white/60">
            Financial Independence, Retire Early. Calculate exactly how much you need to invest today to secure your tomorrow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Inputs Section */}
          <MotionDiv 
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
                <NumberSliderInput 
                  label="Monthly Expenses" 
                  value={monthlyExpense} 
                  onChange={setMonthlyExpense} 
                  min={10000} max={500000} step={5000} prefix="₹" 
                  icon={Wallet}
                />
                <NumberSliderInput 
                  label="Monthly Income" 
                  value={monthlyIncome} 
                  onChange={setMonthlyIncome} 
                  min={10000} max={500000} step={5000} prefix="₹" 
                  icon={Wallet}
                />
                <NumberSliderInput 
                  label="Current Savings" 
                  value={currentSavings} 
                  onChange={setCurrentSavings} 
                  min={0} max={10000000} step={50000} prefix="₹" 
                  icon={Coins}
                />
                <NumberSliderInput 
                  label="Current Age" 
                  value={currentAge} 
                  onChange={setCurrentAge} 
                  min={18} max={80} 
                  icon={Target}
                />
                <NumberSliderInput 
                  label="Retirement Age" 
                  value={retirementAge} 
                  onChange={setRetirementAge} 
                  min={currentAge + 1} max={90} 
                  icon={Flame}
                />
                <NumberSliderInput 
                  label="Inflation Rate" 
                  value={inflationRate} 
                  onChange={setInflationRate} 
                  min={1} max={15} step={0.5} suffix="%" 
                  icon={TrendingUp}
                />
                <NumberSliderInput 
                  label="Expected Return" 
                  value={expectedReturn} 
                  onChange={setExpectedReturn} 
                  min={1} max={20} step={0.5} suffix="%" 
                  icon={TrendingUp}
                />
                <div className="mb-6">
                  <span className="inline-flex items-center rounded-full border border-green-growth/20 bg-green-growth/10 px-3 py-1 text-sm font-semibold text-green-growth">
                    Savings Rate: {savingsRate}%
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {scenarioButtons.map((scenario) => {
                    const isActive = activeScenario === scenario.id;

                    return (
                      <button
                        key={scenario.id}
                        type="button"
                        onClick={() => setActiveScenario(isActive ? null : scenario.id)}
                        className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition-colors ${
                          isActive
                            ? 'border-green-growth/40 bg-green-growth/15 text-green-growth'
                            : 'border-white/10 bg-navy-900/50 text-white/65 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        {scenario.label}
                      </button>
                    );
                  })}
                </div>
                {activeScenario && (
                  <p className="mt-3 text-xs font-medium text-white/45">
                    Scenario active — original values paused
                  </p>
                )}
              </div>
            </div>
          </MotionDiv>

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
                        <p className="text-white/50 text-sm max-w-md">The nest egg required to sustain your lifestyle indefinitely at age {effectiveRetirementAge}.</p>
                      </div>
                      <div className="bg-navy-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 min-w-[240px]">
                        <h4 className="text-white/60 text-xs uppercase tracking-wider font-bold mb-2">Monthly SIP Required</h4>
                        <div className="text-2xl font-bold text-white">
                          {formatCurrency(results.requiredMonthlySip)}
                        </div>
                        <p className="text-white/40 text-[10px] mt-2 italic">Assuming {effectiveExpectedReturn}% annual returns</p>
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
                description={`Your current ${formatCurrency(results.expenseToday)}/yr expenses will grow to this by age ${effectiveRetirementAge} due to ${inflationRate}% inflation.`}
                icon={TrendingUp}
                delay={0.2}
              />
            </div>

            {/* Growth Chart */}
            <MotionDiv 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-navy-800/50 border border-white/[0.05] rounded-3xl p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">Portfolio Projection</h3>
                  <p className="text-white/40 text-sm">Visualizing your journey from {currentAge} to {effectiveRetirementAge}</p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5 text-[#1D9E75]">
                    <span className="w-2 h-2 rounded-full bg-[#1D9E75]" /> Portfolio
                  </div>
                  <div className="flex items-center gap-1.5 text-[#EF9F27]">
                    <span className="w-2 h-2 rounded-full bg-[#EF9F27]" /> Lean FIRE
                  </div>
                  <div className="flex items-center gap-1.5 text-[#E24B4A]">
                    <span className="w-2 h-2 rounded-full bg-[#E24B4A]" /> Fat FIRE
                  </div>
                </div>
              </div>
              
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={results.chartData}>
                    <defs>
                      <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1D9E75" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#1D9E75" stopOpacity={0}/>
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
                    <Line
                      type="monotone"
                      dataKey="leanFire"
                      stroke="#EF9F27"
                      strokeWidth={2}
                      strokeDasharray="6 6"
                      dot={false}
                      isAnimationActive={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="fatFire"
                      stroke="#E24B4A"
                      strokeWidth={2}
                      strokeDasharray="6 6"
                      dot={false}
                      isAnimationActive={false}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="portfolio" 
                      stroke="#1D9E75" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorPortfolio)" 
                      animationDuration={1500}
                    />
                    {results.coastMilestone && (
                      <ReferenceDot
                        x={results.coastMilestone.age}
                        y={results.coastMilestone.portfolio}
                        r={5}
                        fill="#1D9E75"
                        stroke="#0B1220"
                        strokeWidth={2}
                        label={<MilestoneLabel value={`Coast ✓ age ${results.coastMilestone.age}`} fill="#1D9E75" />}
                      />
                    )}
                    {results.fireMilestone && (
                      <ReferenceDot
                        x={results.fireMilestone.age}
                        y={results.fireMilestone.portfolio}
                        r={5}
                        fill="#1D9E75"
                        stroke="#0B1220"
                        strokeWidth={2}
                        label={<MilestoneLabel value={`FIRE ✓ age ${results.fireMilestone.age}`} fill="#ffffff" />}
                      />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </MotionDiv>

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
        <MotionDiv
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
        </MotionDiv>
export default function FireCalculator() {
  return (
    <div className="pt-32 pb-24 text-center min-h-[70vh] flex flex-col items-center justify-center">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
        FIRE <span className="gradient-text">Calculator</span>
      </h1>
      <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
        Plan your financial independence and retire early. This specialized tool is coming soon!
      </p>
      <div className="p-8 rounded-2xl glass-card border border-white/10 max-w-xl w-full text-center">
         <div className="w-16 h-16 mx-auto bg-green-growth/20 text-green-growth rounded-full flex items-center justify-center mb-4">
            🔥
         </div>
         <h3 className="text-xl font-bold mb-2">Under Construction</h3>
         <p className="text-white/50 text-sm">We are building advanced AI models to accurately project your retirement trajectory.</p>
      </div>
    </div>
  )
}
