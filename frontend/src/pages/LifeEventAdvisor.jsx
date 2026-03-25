import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageLayout from '../components/PageLayout'
import { Gift, HeartPulse, Baby, Home, Briefcase, Landmark, Send, Bot, User, CheckCircle2 } from 'lucide-react'

// Indian number formatter
function fmt(n) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

const EVENTS = [
  { id: 'bonus', icon: Gift, title: 'Received a Bonus', desc: 'Got a year-end performance bonus or windfall', color: 'var(--color-growth)', prompt: "I just received a ₹5L year-end bonus after tax. I have an ongoing car loan of ₹4L at 9.5% interest, and my emergency fund is only 2 months. How should I allocate this windfall?" },
  { id: 'marriage', icon: HeartPulse, title: 'Getting Married', desc: 'Planning a wedding or recently married', color: '#ec4899', prompt: "I'm getting married in 6 months. We both work, combined take-home is ₹2L/mo. We're currently managing our finances separately. What are the first 3 things we must do to combine our financial lives efficiently?" },
  { id: 'baby', icon: Baby, title: 'Having a Baby', desc: 'Expecting or just had a child', color: 'var(--color-trust)', prompt: "We just had our first child. I want to start investing for their higher education 18 years from now. If I want a ₹1Cr corpus, what instrument should I choose and how much should I put via SIP?" },
  { id: 'home', icon: Home, title: 'Buying a Home', desc: 'Planning to buy first home or upgrade', color: 'var(--color-gain)', prompt: "I'm looking to buy a ₹80L flat. I have ₹20L saved up for a downpayment. My current rent is ₹25K/mo. Should I buy now on a 20-year home loan at 8.7%, or continue renting and investing the EMI difference?" },
  { id: 'inheritance', icon: Landmark, title: 'Received Inheritance', desc: 'Received a large inheritance or property', color: '#8b5cf6', prompt: "I unexpectedly inherited ₹40L from a grandparent. I've never invested an amount this large before. Should I put it all in the market at once (lumpsum) or stagger it? How do I avoid blowing it away?" },
  { id: 'job', icon: Briefcase, title: 'New Job / Promotion', desc: 'Switched jobs or got a major salary hike', color: 'var(--color-ai)', prompt: "I just got a 40% salary hike, bringing my CTC to ₹24L. My current SIPs are only ₹10K/mo. How should I structure my increased cash flow to avoid lifestyle inflation?" },
]

function AIChat({ event, onBack }) {
  const [messages, setMessages] = useState([
    { role: 'user', content: event.prompt }
  ])
  const [typing, setTyping] = useState(true)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    const timer = setTimeout(() => {
      setTyping(false)
      const aiResponse = getMockResponse(event.id)
      setMessages(p => [...p, { role: 'ai', content: aiResponse, structure: getMockStructure(event.id) }])
    }, 2500)
    return () => clearTimeout(timer)
  }, [event])

  const handleSend = (e) => {
    e.preventDefault()
    const form = e.target
    const input = form.elements.msg
    const val = input.value.trim()
    if (!val) return
    setMessages(p => [...p, { role: 'user', content: val }])
    input.value = ''
    setTyping(true)

    // Mock quick follow up
    setTimeout(() => {
      setTyping(false)
      setMessages(p => [...p, { role: 'ai', content: "That makes sense. In that context, I would adjust the strategy slightly to account for the new priority. Make sure to claim the tax benefits on the older ongoing investments first before opening new ones." }])
    }, 1500)
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      {/* Chat header */}
      <div className="flex items-center gap-4 pb-4 mb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <button onClick={onBack} className="btn-ghost text-xs px-3 py-1.5 focus:outline-none">← Events</button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${event.color}15`, border: `1px solid ${event.color}30` }}>
            <event.icon size={16} style={{ color: event.color }} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>{event.title}</p>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>AI Advisor Assistant</p>
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-6 pb-20 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'ai' && (
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-1"
                  style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)' }}>
                  <Bot size={14} style={{ color: 'var(--color-ai)' }} />
                </div>
              )}

              <div className={`max-w-[85%] ${
                m.role === 'user'
                  ? 'bg-blue-600/20 border border-blue-500/30 rounded-2xl p-4'
                  : 'card-ai p-5'
              }`}>
                {m.role === 'user' ? (
                  <p className="text-[14px] leading-relaxed" style={{ color: '#f1f5f9' }}>{m.content}</p>
                ) : (
                  <div className="space-y-4 text-[14px] leading-relaxed" style={{ color: '#e2e8f0' }}>
                    <p>{m.content}</p>

                    {/* Highly structured AI components */}
                    {m.structure && (
                      <div className="mt-4 space-y-3">
                        {m.structure.map((item, idx) => (
                          <div key={idx} className="flex gap-3 bg-black/20 p-3.5 rounded-xl border border-white/5">
                            <div className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 border border-cyan-500/20">
                              {idx + 1}
                            </div>
                            <div>
                              <p className="font-semibold text-cyan-100 text-sm mb-1">{item.title}</p>
                              <p className="text-slate-400 text-xs">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-1"
                  style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)' }}>
                  <Bot size={14} style={{ color: 'var(--color-ai)' }} />
              </div>
              <div className="card-ai px-5 py-4 flex items-center gap-2 max-w-fit">
                <span className="w-2 h-2 rounded-full bg-cyan-400/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-cyan-400/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-cyan-400/60 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="absolute bottom-6 left-0 right-0 max-w-3xl mx-auto px-4">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            name="msg"
            type="text"
            placeholder="Ask a follow-up about your situation..."
            className="w-full bg-[#1e293b]/80 backdrop-blur-md border border-slate-700/50 rounded-2xl py-4 pl-4 pr-14 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 shadow-2xl transition-all"
            autoComplete="off"
            disabled={typing}
          />
          <button
            type="submit"
            disabled={typing}
            className={`absolute right-2.5 p-2 rounded-xl transition-all ${
              typing ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 hover:scale-105'
            }`}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  )
}


export default function LifeEventAdvisor() {
  const [activeEvent, setActiveEvent] = useState(null)

  if (activeEvent) {
    return (
      <PageLayout backLabel="Back to Events">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
          <AIChat event={activeEvent} onBack={() => setActiveEvent(null)} />
        </motion.div>
      </PageLayout>
    )
  }

  return (
    <PageLayout
      title={<>Life Event <em className="text-gradient-cyan not-italic">Advisor</em></>}
      subtitle="Got a bonus, having a baby, buying a home? Get personalized AI-powered financial guidance for your specific life moment without the ₹25,000 advisor fee."
      sourceLabel="Guidance powered by verified Indian personal finance frameworks."
    >
      <div className="mb-8">
        <p className="text-xs font-semibold mb-6 uppercase tracking-wider" style={{ color: 'var(--color-label)' }}>
          Select the life event you're experiencing:
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {EVENTS.map((e, i) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group cursor-pointer"
              onClick={() => setActiveEvent(e)}
            >
              <div className="card-hover p-6 h-full flex flex-col justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
                <div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                    style={{ background: `${e.color}15`, border: `1px solid ${e.color}30` }}>
                    <e.icon size={20} style={{ color: e.color }} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#f1f5f9' }}>{e.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-label)' }}>{e.desc}</p>
                </div>
                <div className="mt-6 flex items-center text-xs font-bold transition-all" style={{ color: e.color, opacity: 0.8 }}>
                  <span className="group-hover:mr-2 transition-all">Get advice</span>
                  <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all ml-1">→</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}

// Mock AI responses and structured data for exact designs
function getMockResponse(eventId) {
  const responses = {
    bonus: "A ₹5L windfall is a great opportunity. The standard rule for windfalls is the 30/30/40 split: 30% for fun, 30% for debt, 40% for investing. However, given your 9.5% car loan and low emergency fund, we should prioritize risk mitigation first.",
    marriage: "Congratulations! Combining finances doesn't mean merging every account, but rather operating as a synchronized unit. Since you both have similar take-home pay, a 'Yours, Mine, and Ours' structure works best.",
    baby: "Congratulations on the new addition! For an 18-year horizon, equity is the absolute best vehicle to beat inflation. To build a ₹1Cr corpus in 18 years (assuming a conservative 12% CAGR), you need to SIP exactly ₹13,000/month.",
    home: "This is the classic 'Buy vs Rent' dilemma in India. Your rent is ₹25K for an ₹80L flat (rental yield ~3.75%). A ₹60L loan at 8.7% for 20 years means an EMI of ~₹53,000. Let's look at the math strictly.",
    inheritance: "I'm sorry for your loss. Receiving ₹40L suddenly can be overwhelming. The golden rule here is first: Do nothing for 6 months. Put it in a Liquid MF or FD to park it safely while the dust settles.",
    job: "Congratulations on the 40% hike! This is the most critical juncture for wealth creation. If you capture this hike now, you avoid 'lifestyle creep' entirely. Let's deploy the 'Save the Raise' framework."
  }
  return responses[eventId] || "That's an important financial milestone. Let's break down the optimal tax and investment strategies for your specific situation in the Indian context."
}

function getMockStructure(eventId) {
  const structs = {
    bonus: [
      { title: "Immediate: Fill the Emergency Fund (₹1.5L)", desc: "Move ₹1.5L to a separate Liquid Mutual Fund. This bumps your safety net from 2 to 6 months, giving you absolute peace of mind." },
      { title: "High Priority: Kill the Car Loan (₹2.5L)", desc: "Prepay ₹2.5L against your car loan principal. A guaranteed 9.5% post-tax return is impossible to find elsewhere safely. This will free up significant monthly cash flow." },
      { title: "Fun & Reward (₹1.0L)", desc: "Spend ₹1L guilt-free. Take a trip, buy the gadget. You earned it, and strict deprivation leads to financial burnout." }
    ],
    marriage: [
      { title: "Open a Joint 'Ours' Account", desc: "Map all common expenses (rent, groceries, utilities). Both transfer exactly 50% of this total + 20% buffer into this joint account on the 1st of every month." },
      { title: "Update Nominations Everywhere", desc: "Log into EPFO, your MF AMC portals, demat accounts, and bank accounts. Ensure your spouse is listed as the 100% nominee." },
      { title: "Align Health Insurance", desc: "Check whose employer offers better family floater terms. Drop the weaker one and add the spouse to the stronger policy, OR buy a private ₹10L base cover for both of you immediately." }
    ],
    baby: [
      { title: "The Vehicle: Flexi-Cap or Multi-Cap Fund", desc: "Do not buy 'Child Plans' or LIC policies. Start a ₹13,000/mo SIP in a direct growth regular equity mutual fund." },
      { title: "Step-up Sub-Strategy", desc: "If ₹13,000/mo is tight right now, start with ₹8,000/mo, but commit to increasing it by 10% every year on your child's birthday." },
      { title: "Term Insurance Priority", desc: "If either of you do not have pure term life insurance (at least ₹1Cr each), this is actually more urgent than the SIP. Protect the child's future income first." }
    ]
  }

  return structs[eventId] || [
    { title: "Gather Documentation", desc: "Collect Form 16, interest certificates, and capital gains statements." },
    { title: "Calculate Baseline", desc: "Determine your committed expenses and existing run rate." },
    { title: "Deploy Capital", desc: "Allocate funds strictly according to your target asset allocation." }
  ]
}
