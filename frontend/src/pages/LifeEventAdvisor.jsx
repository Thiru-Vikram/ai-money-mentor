import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Gift, 
  Baby, 
  Heart, 
  TrendingUp, 
  ArrowRight, 
  ChevronLeft, 
  ShieldCheck, 
  Banknote, 
  Zap,
  Target,
  PieChart,
  ShieldAlert
} from 'lucide-react';

const events = [
  { id: 'bonus', title: 'Work Bonus', icon: Gift, color: 'text-blue-growth' },
  { id: 'inheritance', title: 'Inheritance', icon: Banknote, color: 'text-green-growth' },
  { id: 'marriage', title: 'Gets Married', icon: Heart, color: 'text-pink-500' },
  { id: 'baby', title: 'New Baby', icon: Baby, color: 'text-yellow-500' },
];

const taxBrackets = ['0% (Basic)', '10%', '20%', '30% (Highest)'];
const riskProfiles = ['Conservative', 'Moderate', 'Aggressive'];

export default function LifeEventAdvisor() {
  const [step, setStep] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [amount, setAmount] = useState(100000);
  const [taxBracket, setTaxBracket] = useState('30% (Highest)');
  const [riskProfile, setRiskProfile] = useState('Moderate');
  const [isProcessing, setIsProcessing] = useState(false);

  const startAnalysis = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(4);
    }, 2000);
  };

  const adviceReport = useMemo(() => {
    if (!selectedEvent) return [];

    const sections = [];

    if (selectedEvent === 'bonus' || selectedEvent === 'inheritance') {
      const isTaxHeavy = taxBracket.includes('30%');
      
      sections.push({
        title: 'Immediate Tax Optimization',
        icon: ShieldCheck,
        points: isTaxHeavy 
          ? [`Utilize Section 80C fully using ₹1.5L from this ${selectedEvent}.`, `Invest ₹50k in NPS (Tier-1) for additional 80CCD(1B) benefit.`, 'Ensure TDS has been correctly deducted if applicable.']
          : ['Check if you can use this for lower bracket tax-saving instruments.', 'Standard 80C deductions still apply.']
      });

      sections.push({
        title: 'Investment Strategy',
        icon: TrendingUp,
        points: riskProfile === 'Aggressive' 
          ? [`Lump sum 30% in Nifty 50 Index Fund, 70% via STP over 6 months.`, 'Increase allocation to Mid-cap/Small-cap based on goals.', 'Rebalance portfolio back to target weightages.']
          : ['Stick to Balanced Advantage Funds.', 'Keep 25% in high-yield Fixed Deposits or Liquid Funds.', 'Avoid speculative stocks with this windfall.']
      });
    }

    if (selectedEvent === 'marriage' || selectedEvent === 'baby') {
      sections.push({
        title: 'Risk Protection (Priority)',
        icon: ShieldAlert,
        points: selectedEvent === 'marriage'
          ? ['Purchase a joint Term Insurance life cover (10-15x annual income).', 'Add your spouse to your corporate or private health insurance Floater plan.', 'Update nominees in all existing bank accounts and demat profiles.']
          : ['Instantly increase Term Life insurance cover for the new dependent.', 'Start a dedicated Medical Emergency Fund for pediatric visits.', 'Check for maternity reimbursement limits if any bills are pending.']
      });

      sections.push({
        title: 'Future Goal Mapping',
        icon: Target,
        points: selectedEvent === 'marriage'
          ? ['Create a joint "Emergency Buffer" equivalent to 6 months of combined expenses.', 'Start a goal-based SIP for your first house or international travel.', 'Align your risk profiles - marriage often shifts risk towards moderate.']
          : ['Create an "Education Fund" SIP today - every year delayed costs significantly more.', 'Maximize PPF in the child\'s name (tax-free EEE instrument).', 'Shift some liquid assets to safer debt funds for shorter-term baby milestones.']
      });
    }

    return sections;
  }, [selectedEvent, taxBracket, riskProfile]);

  return (
    <div className="min-h-screen bg-navy-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-12 h-12 rounded-xl bg-blue-growth/20 border border-blue-growth/40 flex items-center justify-center mx-auto mb-6"
          >
            <Sparkles size={24} className="text-blue-growth" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-4">Life Event <span className="text-blue-growth">Advisor</span></h1>
          <p className="text-gray-400 max-w-xl mx-auto text-lg leading-relaxed">
            Personalized AI-powered strategies for major life transitions. Navigate changes with confidence.
          </p>
        </div>

        {/* Wizard Container */}
        <div className="bg-navy-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-growth/5 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 flex flex-col items-center justify-center text-center"
              >
                <div className="w-16 h-16 border-4 border-blue-growth/20 border-t-blue-growth rounded-full animate-spin mb-6" />
                <h3 className="text-xl font-bold text-white mb-2 italic">Consulting AI Knowledge Base...</h3>
                <p className="text-gray-400">Analyzing your tax bracket, risk profile, and the {selectedEvent} impact.</p>
              </motion.div>
            ) : step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-white mb-8">What life event occurred?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {events.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => {
                        setSelectedEvent(event.id);
                        setStep(2);
                      }}
                      className={`p-6 rounded-2xl border transition-all text-left flex items-center gap-4 ${
                        selectedEvent === event.id 
                          ? 'bg-blue-growth/10 border-blue-growth' 
                          : 'bg-white/5 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className={`p-3 rounded-lg bg-navy-900 ${event.color}`}>
                        <event.icon size={24} />
                      </div>
                      <span className="text-xl font-semibold text-white">{event.title}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : step === 2 ? (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button onClick={() => setStep(1)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
                  <ChevronLeft size={20} /> Back to Event Selection
                </button>
                <h2 className="text-2xl font-bold text-white mb-8">How much is the {selectedEvent}?</h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-end mb-4">
                      <label className="text-gray-400 text-sm">Monetary Impact</label>
                      <span className="text-3xl font-bold text-blue-growth">₹ {amount.toLocaleString('en-IN')}</span>
                    </div>
                    <input 
                      type="range" 
                      min={10000} 
                      max={10000000} 
                      step={50000}
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-growth" 
                    />
                  </div>
                  <div className="pt-8">
                    <button 
                      onClick={() => setStep(3)}
                      className="w-full bg-blue-growth text-navy-950 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-growth/90 transition-all shadow-lg shadow-blue-growth/20"
                    >
                      Continue to Advisor Details <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : step === 3 ? (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button onClick={() => setStep(2)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
                  <ChevronLeft size={20} /> Back to Amounts
                </button>
                <h2 className="text-2xl font-bold text-white mb-8 text-center sm:text-left font-display">Personal Financial Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div>
                     <label className="text-white/60 text-sm font-medium mb-3 block">Tax Bracket</label>
                     <div className="flex flex-col gap-3">
                       {taxBrackets.map((bracket) => (
                         <button
                           key={bracket}
                           onClick={() => setTaxBracket(bracket)}
                           className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all text-left ${
                             taxBracket === bracket ? 'bg-blue-growth text-navy-950 border-blue-growth' : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'
                           }`}
                         >
                           {bracket}
                         </button>
                       ))}
                     </div>
                  </div>
                  <div>
                     <label className="text-white/60 text-sm font-medium mb-3 block">Risk Appetite</label>
                     <div className="flex flex-col gap-3">
                        {riskProfiles.map((p) => (
                          <button
                            key={p}
                            onClick={() => setRiskProfile(p)}
                            className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all text-left ${
                              riskProfile === p ? 'bg-blue-growth text-navy-950 border-blue-growth' : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                     </div>
                  </div>
                </div>
                <button 
                  onClick={startAnalysis}
                  className="w-full bg-blue-growth text-navy-950 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-growth/90 transition-all shadow-lg shadow-blue-growth/20 ring-4 ring-blue-growth/10"
                >
                  Generate Recommendation
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-4"
              >
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-growth/20 rounded-xl">
                        <Zap className="text-blue-growth" size={24} />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-xl uppercase tracking-tight">AI Advisor Report</h3>
                        <p className="text-gray-400 text-sm">Analysis for: <span className="text-white font-semibold capitalize">{selectedEvent}</span> • ₹{amount.toLocaleString('en-IN')}</p>
                      </div>
                   </div>
                   <button onClick={() => setStep(1)} className="text-blue-growth text-sm font-bold hover:underline">New Analysis</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {adviceReport.map((section, idx) => (
                    <div key={idx} className="bg-navy-950/40 p-6 rounded-2xl border border-white/5 relative group">
                       <div className="mb-4 flex items-center gap-3">
                          <section.icon size={20} className="text-blue-growth" />
                          <h4 className="text-white font-bold text-lg">{section.title}</h4>
                       </div>
                       <ul className="space-y-4">
                          {section.points.map((p, i) => (
                            <li key={i} className="flex gap-3 text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                               <div className="w-1.5 h-1.5 rounded-full bg-blue-growth mt-1.5 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                               {p}
                            </li>
                          ))}
                       </ul>
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-gradient-to-r from-blue-growth/10 to-navy-900 border border-blue-growth/30 rounded-2xl relative overflow-hidden group cursor-pointer transition-all hover:border-blue-growth/60">
                    <div className="relative z-10 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <PieChart className="text-blue-growth" size={24} />
                          <div>
                            <h4 className="text-white font-bold mb-1">Detailed Portfolio Allocation</h4>
                            <p className="text-gray-400 text-xs">Unlock granular asset weightages based on your current ₹{amount.toLocaleString()} goal.</p>
                          </div>
                       </div>
                       <button className="p-3 bg-white/10 rounded-full group-hover:bg-blue-growth group-hover:text-navy-950 transition-all">
                          <ArrowRight size={20} />
                       </button>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-growth/5 rounded-full blur-2xl group-hover:bg-blue-growth/10 transition-all" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info Support */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p className="flex items-center justify-center gap-2">
            <ShieldCheck size={16} /> Data is processed locally. We do not store your private financial details.
          </p>
        </div>
      </div>
    </div>
  );
}
