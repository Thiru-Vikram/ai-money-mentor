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
