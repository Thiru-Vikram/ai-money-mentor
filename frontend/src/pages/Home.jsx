import HeroSection from '../components/HeroSection'
import MoneyHealthScore from '../components/MoneyHealthScore'
import FeatureBentoGrid from '../components/FeatureBentoGrid'
import PortfolioXRay from '../components/PortfolioXRay'
import SocialProof from '../components/SocialProof'
import { useState } from 'react'
import MoneyHealthScoreFlow from '../components/MoneyHealthScoreFlow'

export default function Home() {
  const [isHealthScoreOpen, setIsHealthScoreOpen] = useState(false)

  return (
    <main>
      <HeroSection />
      <MoneyHealthScore onOpenFlow={() => setIsHealthScoreOpen(true)} />
      <FeatureBentoGrid />
      <PortfolioXRay />
      <SocialProof />
      <MoneyHealthScoreFlow 
        isOpen={isHealthScoreOpen} 
        onClose={() => setIsHealthScoreOpen(false)} 
      />
    </main>
  )
}
