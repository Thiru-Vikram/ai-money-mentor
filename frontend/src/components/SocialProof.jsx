import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function SocialProof() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="social" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 grid-dot-bg opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Left: Trust badges */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <div className="section-tag mb-4">
                Trusted by 50,000+ investors
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Built on <span className="gradient-text">Real Data.</span>
                <br />
                Trusted by Real People.
              </h2>
            </div>

            {/* Badge grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  emoji: "🏦",
                  title: "Demat-Ready",
                  desc: "Works with all NSDL/CDSL Demat accounts",
                },
                {
                  emoji: "📊",
                  title: "ET Markets Data",
                  desc: "Powered by real-time Economic Times data",
                },
                {
                  emoji: "🔒",
                  title: "256-bit SSL",
                  desc: "Bank-grade encryption. Your data is safe.",
                },
                {
                  emoji: "✅",
                  title: "SEBI Compliant",
                  desc: "SEBI RIA framework compliant advisory",
                },
              ].map((b) => (
                <div key={b.title} className="glass-card p-4 space-y-1.5">
                  <span className="text-xl">{b.emoji}</span>
                  <p className="text-sm font-bold text-white">{b.title}</p>
                  <p className="text-xs text-white/40 leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div className="flex gap-6 pt-2">
              {[
                { value: "₹420Cr+", label: "Assets analyzed" },
                { value: "50,000+", label: "Users" },
                { value: "4.9★", label: "App rating" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-extrabold text-white">
                    {s.value}
                  </p>
                  <p className="text-xs text-white/40">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
