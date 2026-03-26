export default function LifeAdvisor() {
  return (
    <div className="pt-32 pb-24 text-center min-h-[70vh] flex flex-col items-center justify-center">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
        Life Event <span className="gradient-text">Advisor</span>
      </h1>
      <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
        Get personalized financial guidance for major life transitions like getting married or having a child.
      </p>
      <div className="p-8 rounded-2xl glass-card border border-white/10 max-w-xl w-full text-center">
         <div className="w-16 h-16 mx-auto bg-blue-400/20 text-blue-400 rounded-full flex items-center justify-center mb-4">
            💡
         </div>
         <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
         <p className="text-white/50 text-sm">Our AI is being trained to handle complex real-world financial scenarios. Stay tuned!</p>
      </div>
    </div>
  )
}
