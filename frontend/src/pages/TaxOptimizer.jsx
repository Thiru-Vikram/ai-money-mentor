import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  Users, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight, 
  ChevronLeft, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Stethoscope,
  Coins,
  Search,
  Zap,
  Briefcase,
  Home
} from 'lucide-react';

const emptyPartner = {
  name: '',
  age: 30,
  employment: 'Salaried',
  ctc: 1200000,
  basic: 480000,
  hra: 192000,
  city: 'Metro',
  rent: 20000,
  existing80c: 100000,
  nps: 0,
  homeLoanPrincipal: 0,
  homeLoanInterest: 0,
  healthPremium: 0,
  regime: 'New'
};

const MotionDiv = motion.div;

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatNumber = (num) => {
  if (num === 0) return '';
  return new Intl.NumberFormat('en-IN').format(num);
};

const CurrencyInput = ({ label, value, onChange, placeholder = "0" }) => {
  const [displayValue, setDisplayValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    setDisplayValue(rawValue);
    onChange(rawValue === '' ? 0 : Number(rawValue));
  };

  const handleFocus = (e) => {
    const rawValue = value === 0 ? '' : String(value);
    setIsEditing(true);
    setDisplayValue(rawValue);

    requestAnimationFrame(() => {
      const cursorPosition = rawValue.length;
      e.target.setSelectionRange(cursorPosition, cursorPosition);
    });
  };

  const handleBlur = () => {
    setIsEditing(false);
    setDisplayValue('');
  };

  return (
    <div className="relative group">
      <label className="text-white/40 text-[10px] uppercase font-bold tracking-wider block mb-1.5 transition-colors group-focus-within:text-blue-growth">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 text-sm">₹</span>
        <input 
          type="text" 
          inputMode="numeric"
          value={isEditing ? displayValue : formatNumber(value)}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full bg-navy-950/50 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-sm font-semibold text-white focus:border-blue-growth focus:bg-navy-900 outline-none transition-all placeholder:text-white/5" 
        />
      </div>
    </div>
  );
};

const InputSection = ({ title, partner, setPartner, icon: Icon }) => {
  const iconSize = Icon ? 20 : 20;

  const handleValueChange = (field, val) => {
    const updated = { ...partner, [field]: val };

    if (field === 'ctc') {
      updated.basic = Math.round(val * 0.4);
      updated.hra = Math.round(updated.basic * 0.4);
    } else if (field === 'basic') {
      updated.hra = Math.round(val * 0.4);
    }

    setPartner(updated);
  };

  return (
    <div className="bg-navy-800/50 p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6 backdrop-blur-md">
      <h3 className="text-white font-bold flex items-center gap-3 text-lg">
        <div className="p-2 bg-blue-growth/20 rounded-lg">
          <Icon size={iconSize} className="text-blue-growth" />
        </div>
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="text-white/40 text-[10px] uppercase font-bold tracking-wider block mb-1.5">Full Name</label>
          <input 
            type="text" 
            value={partner.name}
            onChange={(e) => setPartner({ ...partner, name: e.target.value })}
            className="w-full bg-navy-950/50 border border-white/10 rounded-xl py-3 px-4 text-sm font-semibold text-white focus:border-blue-growth focus:bg-navy-900 outline-none transition-all" 
            placeholder="Enter name..."
          />
        </div>
        <CurrencyInput label="Annual CTC" value={partner.ctc} onChange={(v) => handleValueChange('ctc', v)} />
        <CurrencyInput label="Basic Salary" value={partner.basic} onChange={(v) => handleValueChange('basic', v)} />
        <CurrencyInput label="Monthly Rent" value={partner.rent} onChange={(v) => handleValueChange('rent', v)} />
        <CurrencyInput label="HRA Component (per yr)" value={partner.hra} onChange={(v) => handleValueChange('hra', v)} />
      </div>
    </div>
  );
};

export default function TaxOptimizer() {
  const [step, setStep] = useState(1);
  const [partnerA, setPartnerA] = useState({ ...emptyPartner, name: 'Partner A' });
  const [partnerB, setPartnerB] = useState({ ...emptyPartner, name: 'Partner B' });
  const [combined] = useState({
    hasFloater: 'no',
    floaterPremium: 0,
    savingsGoal: 50000,
    totalAssets: 2000000,
    totalLiabilities: 0
  });

  const calculationResults = useMemo(() => {
    const optimizeHRA = (p) => {
      if (p.rent <= 0) return { exemption: 0, recommendation: 'No rent paid' };
      const rule1 = p.hra;
      const rule2 = p.city === 'Metro' ? 0.5 * p.basic : 0.4 * p.basic;
      const rule3 = Math.max(0, (p.rent * 12) - (0.1 * p.basic));
      const exemption = Math.min(rule1, rule2, rule3);
      
      let recommendation = '';
      if (exemption < rule1) {
        recommendation = `Restricted by ${exemption === rule3 ? 'Rent Paid' : 'Basic Salary'}. Consider increasing rent or basic.`;
      } else {
        recommendation = 'HRA fully utilized.';
      }

      return { 
        exemption, 
        recommendation, 
        actionNeeded: p.rent * 12 > 100000 ? 'Landlord PAN required' : 'Keep rent receipts' 
      };
    };

    const optimizeNPS = (p) => {
      const headroom80ccd1b = 50000 - p.nps;
      const recommendedTopUp = Math.max(0, headroom80ccd1b);
      const taxSaving = recommendedTopUp * (p.ctc > 1500000 ? 0.3 : p.ctc > 1000000 ? 0.2 : 0.1);
      return { currentContribution: p.nps, recommendedTopUp, taxSaving };
    };

    const optimize80C = (p) => {
      const totalUsed = p.existing80c + p.homeLoanPrincipal;
      const gap = Math.max(0, 150000 - totalUsed);
      return { elssRecommended: gap, headroomUsed: totalUsed };
    };

    const calculateIncomeTax = (income, regime, deductions = 0) => {
      const standardDeduction = 75000; // FY 2025-26 New Regime SD
      let taxable = Math.max(0, income - standardDeduction);
      
      if (regime === 'Old') {
         // Old regime has 50k SD and specific deductions
         taxable = Math.max(0, income - 50000 - deductions);
         if (taxable <= 500000) return 0;
         let tax = 0;
         if (taxable > 1000000) tax += (taxable - 1000000) * 0.3 + 112500;
         else if (taxable > 500000) tax += (taxable - 500000) * 0.2 + 12500;
         else if (taxable > 250000) tax += (taxable - 250000) * 0.05;
         return tax * 1.04; // Cess
      } else {
         // New regime FY 2025-26
         if (taxable <= 1200000) return 0; // Tax free up to 12L (Rebate 87A)
         let tax = 0;
         if (taxable > 1500000) tax += (taxable - 1500000) * 0.3 + 150000;
         else if (taxable > 1200000) tax += (taxable - 1200000) * 0.2 + 90000;
         else if (taxable > 900000) tax += (taxable - 900000) * 0.15 + 45000;
         else if (taxable > 600000) tax += (taxable - 600000) * 0.1 + 15000;
         else if (taxable > 300000) tax += (taxable - 300000) * 0.05;
         return tax * 1.04;
      }
    };

    const resA = {
      hra: optimizeHRA(partnerA),
      nps: optimizeNPS(partnerA),
      sip: optimize80C(partnerA),
    };

    const resB = {
      hra: optimizeHRA(partnerB),
      nps: optimizeNPS(partnerB),
      sip: optimize80C(partnerB),
    };

    // Regime Comparison
    const oldDeductionsA = resA.hra.exemption + resA.sip.headroomUsed + (partnerA.homeLoanInterest || 0) + (partnerA.healthPremium || 0) + partnerA.nps;
    const oldTaxA = calculateIncomeTax(partnerA.ctc, 'Old', oldDeductionsA);
    const newTaxA = calculateIncomeTax(partnerA.ctc, 'New');

    const oldDeductionsB = resB.hra.exemption + resB.sip.headroomUsed + (partnerB.homeLoanInterest || 0) + (partnerB.healthPremium || 0) + partnerB.nps;
    const oldTaxB = calculateIncomeTax(partnerB.ctc, 'Old', oldDeductionsB);
    const newTaxB = calculateIncomeTax(partnerB.ctc, 'New');

    const netWorth = combined.totalAssets - combined.totalLiabilities;
    const annualExpenses = (partnerA.ctc + partnerB.ctc) * 0.4; // Rough estimate
    const fireNumber = annualExpenses * 25;

    return {
      hraOptimization: {
        partnerA: resA.hra,
        partnerB: resB.hra,
        combinedSaving: 0 // Simplified
      },
      npsOptimization: {
        partnerA: resA.nps,
        partnerB: resB.nps
      },
      sipTaxSplit: {
        partnerA: resA.sip,
        partnerB: resB.sip,
        ltcgHarvestingNote: "LTCG on equity < ₹1.25L is tax-free. Harvest gains every March."
      },
      insuranceAudit: {
        recommendation: (partnerA.ctc + partnerB.ctc) > 2000000 ? "Upgrade to ₹20L individual covers." : "Current floater is adequate.",
        coverageGap: "Term Life cover missing for Partner B",
        eightyDMaximization: { partnerA: partnerA.healthPremium, partnerB: partnerB.healthPremium }
      },
      regimeComparison: {
        partnerA: { oldRegimeTax: oldTaxA, newRegimeTax: newTaxA, recommended: newTaxA < oldTaxA ? 'New' : 'Old', saving: Math.abs(newTaxA - oldTaxA) },
        partnerB: { oldRegimeTax: oldTaxB, newRegimeTax: newTaxB, recommended: newTaxB < oldTaxB ? 'New' : 'Old', saving: Math.abs(newTaxB - oldTaxB) },
        combinedTaxSaving: Math.max(0, (oldTaxA + oldTaxB) - (newTaxA + newTaxB))
      },
      netWorthSnapshot: {
        combinedNetWorth: netWorth,
        monthlySurplus: Math.round(((partnerA.ctc + partnerB.ctc) - (oldTaxA + oldTaxB)) / 12 - (combined.savingsGoal || 0)),
        fireNumber: fireNumber,
        monthsToFire: Math.round(fireNumber / (combined.savingsGoal || 1))
      },
      topActionCards: [
        { priority: 1, title: 'Switch Regime', description: `Partner A can save ${formatCurrency(Math.abs(newTaxA - oldTaxA))} by switching to the ${newTaxA < oldTaxA ? 'New' : 'Old'} regime.`, annualImpact: Math.abs(newTaxA - oldTaxA), section: '87A' },
        { priority: 2, title: 'NPS Top-up', description: `Top up ₹50k in NPS for Partner A to save tax under 80CCD(1B).`, annualImpact: resA.nps.taxSaving, section: '80CCD' }
      ]
    };
  }, [partnerA, partnerB, combined]);

  return (
    <div className="min-h-screen bg-navy-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <MotionDiv
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-16 h-16 rounded-2xl bg-blue-growth/20 border border-blue-growth/40 flex items-center justify-center mx-auto mb-6"
          >
            <ShieldCheck size={32} className="text-blue-growth" />
          </MotionDiv>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Couple<span className="text-blue-growth">Tax Planner</span> 2025</h1>
          <p className="text-gray-400 max-w-xl mx-auto">A shared tax-planning workspace for couples, with regime strategy and deduction optimization for FY 2025-26.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Side */}
          <div className="lg:col-span-12 space-y-8">
            <div className="flex gap-4 border-b border-white/5 pb-4 mb-4 overflow-x-auto">
              {['Partner A', 'Partner B', 'Combined & Review'].map((t, i) => (
                <button 
                  key={t}
                  onClick={() => setStep(i + 1)}
                  className={`px-6 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all ${
                    step === i + 1 ? 'bg-blue-growth text-navy-950' : 'text-white/40 hover:text-white'
                  }`}
                >
                  {i + 1}. {t}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <MotionDiv key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <InputSection title="Partner A Details" partner={partnerA} setPartner={setPartnerA} icon={Users} />
                  <div className="bg-navy-800/50 p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6">
                    <h4 className="text-white text-lg font-bold">Existing Deductions & Preferences</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <CurrencyInput label="Existing 80C" value={partnerA.existing80c} onChange={(v) => setPartnerA({ ...partnerA, existing80c: v })} />
                      <CurrencyInput label="Health Premium (80D)" value={partnerA.healthPremium} onChange={(v) => setPartnerA({ ...partnerA, healthPremium: v })} />
                      <div>
                        <label className="text-white/40 text-[10px] uppercase font-bold tracking-wider block mb-1.5">Current Regime</label>
                        <select 
                          value={partnerA.regime} 
                          onChange={(e) => setPartnerA({ ...partnerA, regime: e.target.value })} 
                          className="w-full bg-navy-950/50 border border-white/10 rounded-xl py-3 px-4 text-sm font-semibold text-white focus:border-blue-growth outline-none cursor-pointer hover:bg-navy-900 transition-all"
                        >
                          <option>New</option>
                          <option>Old</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setStep(2)} className="btn-primary w-full py-4 rounded-xl flex items-center justify-center gap-2">Next: Partner B <ArrowRight size={20} /></button>
                </MotionDiv>
              )}

              {step === 2 && (
                <MotionDiv key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <InputSection title="Partner B Details" partner={partnerB} setPartner={setPartnerB} icon={Users} />
                  <div className="bg-navy-800/50 p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6">
                    <h4 className="text-white text-lg font-bold">Existing Deductions & Preferences</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <CurrencyInput label="Existing 80C" value={partnerB.existing80c} onChange={(v) => setPartnerB({ ...partnerB, existing80c: v })} />
                      <CurrencyInput label="Health Premium" value={partnerB.healthPremium} onChange={(v) => setPartnerB({ ...partnerB, healthPremium: v })} />
                      <div>
                        <label className="text-white/40 text-[10px] uppercase font-bold tracking-wider block mb-1.5">Current Regime</label>
                        <select 
                          value={partnerB.regime} 
                          onChange={(e) => setPartnerB({ ...partnerB, regime: e.target.value })} 
                          className="w-full bg-navy-950/50 border border-white/10 rounded-xl py-3 px-4 text-sm font-semibold text-white focus:border-blue-growth outline-none cursor-pointer hover:bg-navy-900 transition-all"
                        >
                          <option>New</option>
                          <option>Old</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setStep(1)} className="btn-ghost py-4 flex-1 rounded-xl">Back</button>
                    <button onClick={() => setStep(3)} className="btn-primary py-4 flex-1 rounded-xl flex items-center justify-center gap-2">Results <ChevronLeft size={20} className="rotate-180" /></button>
                  </div>
                </MotionDiv>
              )}

              {step === 3 && (
                <MotionDiv key="step3" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 pb-20">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-growth/20 to-navy-900 border border-blue-growth/30 p-6 rounded-3xl">
                      <div className="text-blue-growth text-xs uppercase font-black tracking-widest mb-1">Combined Net Worth</div>
                      <div className="text-3xl font-bold text-white">{formatCurrency(calculationResults.netWorthSnapshot.combinedNetWorth)}</div>
                    </div>
                    <div className="bg-navy-900/80 border border-white/5 p-6 rounded-3xl">
                      <div className="text-white/40 text-xs uppercase font-black tracking-widest mb-1">Monthly Surplus</div>
                      <div className="text-3xl font-bold text-white">{formatCurrency(calculationResults.netWorthSnapshot.monthlySurplus)}</div>
                    </div>
                    <div className="bg-navy-900/80 border border-white/5 p-6 rounded-3xl">
                      <div className="text-white/40 text-xs uppercase font-black tracking-widest mb-1">Combined Tax Saving</div>
                      <div className="text-3xl font-bold text-green-growth">{formatCurrency(calculationResults.regimeComparison.combinedTaxSaving)}/yr</div>
                    </div>
                  </div>

                  {/* Top Recommendations */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <Zap size={24} className="text-blue-growth animate-pulse" />
                      Top Action Points
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {calculationResults.topActionCards.map((card, i) => (
                        <div key={i} className="bg-navy-900 border-l-4 border-blue-growth p-6 rounded-r-2xl shadow-xl flex items-start gap-4 hover:bg-navy-800/80 transition-colors">
                          <div className="bg-blue-growth/20 p-2 rounded-lg text-blue-growth font-bold text-lg">#{card.priority}</div>
                          <div>
                            <h4 className="text-white font-bold text-lg mb-1">{card.title}</h4>
                            <p className="text-white/60 text-sm mb-3">{card.description}</p>
                            <div className="bg-blue-growth/10 px-3 py-1 rounded inline-block text-blue-growth text-xs font-bold">Annual Impact: {formatCurrency(card.annualImpact)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Deep Analysis Tabs */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                    {/* HRA Section */}
                    <div className="space-y-4">
                      <div className="p-4 bg-navy-900/50 rounded-2xl border border-white/5">
                        <h4 className="text-white font-bold flex items-center gap-2 mb-4">
                          <Building2 size={18} className="text-blue-growth" />
                          HRA Optimization
                        </h4>
                        <div className="space-y-4">
                          {[partnerA, partnerB].map((p, i) => (
                            <div key={i} className="flex justify-between items-center bg-navy-950 p-4 rounded-xl border border-white/[0.03]">
                              <div>
                                <span className="text-white/50 text-xs font-bold block">{p.name} Exemption</span>
                                <span className="text-white font-bold">{formatCurrency(i === 0 ? calculationResults.hraOptimization.partnerA.exemption : calculationResults.hraOptimization.partnerB.exemption)}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-white/30 text-[10px] block uppercase">Action Needed</span>
                                <span className="text-blue-growth text-xs font-medium">{i === 0 ? calculationResults.hraOptimization.partnerA.actionNeeded : calculationResults.hraOptimization.partnerB.actionNeeded}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Regime Comparison */}
                      <div className="p-4 bg-navy-900/50 rounded-2xl border border-white/5">
                         <h4 className="text-white font-bold flex items-center gap-2 mb-4">
                           <Calculator size={18} className="text-blue-growth" />
                           Optimal Regime
                         </h4>
                         <div className="space-y-4">
                           {[partnerA, partnerB].map((p, i) => {
                             const data = i === 0 ? calculationResults.regimeComparison.partnerA : calculationResults.regimeComparison.partnerB;
                             return (
                               <div key={i} className="bg-navy-950 p-4 rounded-xl border border-white/[0.03]">
                                 <div className="flex justify-between mb-2">
                                   <span className="text-white font-bold text-sm">{p.name}</span>
                                   <span className="bg-green-growth/20 text-green-growth text-[10px] px-2 py-0.5 rounded-full font-bold">Recommended: {data.recommended}</span>
                                 </div>
                                 <div className="grid grid-cols-2 gap-4 text-xs">
                                   <div className="text-white/40">Old: {formatCurrency(data.oldRegimeTax)}</div>
                                   <div className="text-white/40">New: {formatCurrency(data.newRegimeTax)}</div>
                                 </div>
                               </div>
                             );
                           })}
                         </div>
                      </div>
                    </div>

                    {/* Investment & Insurance */}
                    <div className="space-y-4">
                       <div className="p-4 bg-navy-900/50 rounded-2xl border border-white/5">
                         <h4 className="text-white font-bold flex items-center gap-2 mb-4">
                           <Coins size={18} className="text-blue-growth" />
                           ELSS & NPS Strategy
                         </h4>
                         <div className="space-y-4 text-sm">
                            <div className="bg-navy-950 p-4 rounded-xl">
                               <p className="text-white/60 mb-2">Recommended ELSS SIP (80C Headroom):</p>
                               <div className="flex justify-between">
                                  <span className="text-white font-bold">{partnerA.name}: {formatCurrency(calculationResults.sipTaxSplit.partnerA.elssRecommended / 12)}/mo</span>
                                  <span className="text-white font-bold">{partnerB.name}: {formatCurrency(calculationResults.sipTaxSplit.partnerB.elssRecommended / 12)}/mo</span>
                               </div>
                            </div>
                            <div className="bg-navy-950 p-4 rounded-xl">
                               <p className="text-white/60 mb-2">NPS 80CCD(1B) Top-up Required:</p>
                               <div className="flex justify-between items-center">
                                  <span className="text-white font-bold">{partnerA.name}: {formatCurrency(calculationResults.npsOptimization.partnerA.recommendedTopUp)}</span>
                                  <div className="text-green-growth text-xs font-bold">+ {formatCurrency(calculationResults.npsOptimization.partnerA.taxSaving)} tax saved</div>
                               </div>
                            </div>
                         </div>
                       </div>

                       <div className="p-4 bg-navy-900/50 rounded-2xl border border-white/5">
                         <h4 className="text-white font-bold flex items-center gap-2 mb-4">
                           <Stethoscope size={18} className="text-blue-growth" />
                           Insurance Audit
                         </h4>
                         <div className="bg-navy-950 p-4 rounded-xl text-sm leading-relaxed">
                            <p className="text-blue-growth font-bold mb-2">Recommendation:</p>
                            <p className="text-white/60 mb-4">{calculationResults.insuranceAudit.recommendation}</p>
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-3 text-red-100">
                               <AlertCircle size={20} className="shrink-0" />
                               <div>
                                 <p className="font-bold text-xs uppercase tracking-wider mb-1">Coverage Gap Found</p>
                                 <p className="text-xs">{calculationResults.insuranceAudit.coverageGap}</p>
                               </div>
                            </div>
                         </div>
                       </div>
                    </div>
                  </div>
                </MotionDiv>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
