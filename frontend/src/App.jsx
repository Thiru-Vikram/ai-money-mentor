import { useState } from 'react'
import './index.css'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import MoneyHealthScore from './components/MoneyHealthScore'
import FeatureBentoGrid from './components/FeatureBentoGrid'
import PortfolioXRay from './components/PortfolioXRay'
import SocialProof from './components/SocialProof'
import FooterCTA from './components/FooterCTA'
import MoneyHealthScoreFlow from './components/MoneyHealthScoreFlow'

function App() {
  const [isHealthScoreOpen, setIsHealthScoreOpen] = useState(false)

  return (
    <div className="min-h-screen overflow-x-hidden pt-16">
      <Navbar />
      <main>
        <HeroSection />
        <MoneyHealthScore onOpenFlow={() => setIsHealthScoreOpen(true)} />
        <FeatureBentoGrid />
        <PortfolioXRay />
        <SocialProof />
      </main>
      <FooterCTA />

      <MoneyHealthScoreFlow 
        isOpen={isHealthScoreOpen} 
        onClose={() => setIsHealthScoreOpen(false)} 
      />
    </div>
  )
}

export default App
