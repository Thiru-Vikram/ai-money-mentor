import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer, Bengaluru',
    avatar: 'PS',
    avatarBg: 'from-purple-500 to-blue-500',
    text: 'I had no clue about my portfolio overlap. The X-Ray feature found 38% overlap in 10 seconds. Rebalanced in a day. My returns improved by 2.4% in 6 months.',
    score: 84,
    stars: 5,
  },
  {
    name: 'Arjun & Meera Nair',
    role: 'Couple, Mumbai',
    avatar: 'AN',
    avatarBg: 'from-green-500 to-teal-500',
    text: 'The Couple\'s Planner showed us we were wasting ₹14,500/month due to unoptimised HRA and NPS splits. Now we hit our home goal 3 years earlier.',
    score: 91,
    stars: 5,
  },
  {
    name: 'Ravi Krishnamurthy',
    role: 'CA, Chennai',
    avatar: 'RK',
    avatarBg: 'from-amber-500 to-orange-500',
    text: 'As a CA I was skeptical, but the Tax Wizard found deductions even I missed for my salaried clients. Section 80CCD(1B) NPS is criminally underused.',
    score: 78,
    stars: 5,
  },
]

const tickerItems = [
  'Sensex  79,432  ▲ 0.43%',
  'Nifty 50  24,058  ▲ 0.31%',
  'NIFTY MidCap  55,210  ▲ 0.78%',
  'Gold  ₹73,420  ▲ 0.12%',
  'USD/INR  83.42  ▼ 0.05%',
  '10Y Bond  7.14%  ▼ 0.03%',
  'SBI Bluechip  1Y: +22.4%',
  'Mirae Asset  XIRR: +18.7%',
]

export default function SocialProof() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [idx, setIdx] = useState(0)

  const prev = () => setIdx(i => (i - 1 + testimonials.length) % testimonials.length)
  const next = () => setIdx(i => (i + 1) % testimonials.length)

  useEffect(() => {
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, []) // eslint-disable-line

  const t = testimonials[idx]

  return (
    <section id="social" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 grid-dot-bg opacity-20 pointer-events-none" />

      {/* ET Markets Ticker */}
      <div className="w-full bg-navy-950/70 border-y border-white/[0.05] py-2.5 mb-16 overflow-hidden">
        <div className="flex gap-12 animate-ticker whitespace-nowrap" style={{ width: 'max-content' }}>
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="text-xs font-mono text-white/50 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-green-growth/60 inline-block" />
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: Trust badges */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <div className="section-tag mb-4">Trusted by 50,000+ investors</div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Built on <span className="gradient-text">Real Data.</span>
                <br />Trusted by Real People.
              </h2>
            </div>

            {/* Badge grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { emoji: '🏦', title: 'Demat-Ready', desc: 'Works with all NSDL/CDSL Demat accounts' },
                { emoji: '📊', title: 'ET Markets Data', desc: 'Powered by real-time Economic Times data' },
                { emoji: '🔒', title: '256-bit SSL', desc: 'Bank-grade encryption. Your data is safe.' },
                { emoji: '✅', title: 'SEBI Compliant', desc: 'SEBI RIA framework compliant advisory' },
              ].map(b => (
                <div key={b.title} className="glass-card p-4 space-y-1.5">
                  <span className="text-xl">{b.emoji}</span>
                  <p className="text-sm font-bold text-white">{b.title}</p>
                  <p className="text-xs text-white/40 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div className="flex gap-6 pt-2">
              {[
                { value: '₹420Cr+', label: 'Assets analyzed' },
                { value: '50,000+', label: 'Users' },
                { value: '4.9★', label: 'App rating' },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-2xl font-extrabold text-white">{s.value}</p>
                  <p className="text-xs text-white/40">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Testimonial slider */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="glass-card p-7 relative overflow-hidden min-h-[300px]">
              <Quote size={32} className="absolute top-6 right-6 text-white/[0.06]" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-5"
                >
                  {/* Stars */}
                  <div className="flex gap-1">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-white/80 text-base leading-relaxed">"{t.text}"</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.avatarBg} flex items-center justify-center text-xs font-bold text-white`}>
                        {t.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{t.name}</p>
                        <p className="text-xs text-white/40">{t.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/30 mb-0.5">Health Score</p>
                      <p className="text-xl font-extrabold text-green-growth">{t.score}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIdx(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === idx ? 'w-6 bg-green-growth' : 'w-1.5 bg-white/20'
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={prev} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-white/30 transition-colors">
                  <ChevronLeft size={15} className="text-white/50" />
                </button>
                <button onClick={next} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-white/30 transition-colors">
                  <ChevronRight size={15} className="text-white/50" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
