import { useState } from 'react'
import './index.css'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import MoneyHealthScore from './components/MoneyHealthScore'
import TaxWizard from './components/TaxWizard'
import FeatureBentoGrid from './components/FeatureBentoGrid'
import LifeEventAdvisor from './components/LifeEventAdvisor'
import PortfolioXRay from './components/PortfolioXRay'
import FirePathPlanner from './components/FirePathPlanner'
import FooterCTA from './components/FooterCTA'
import MoneyHealthScoreFlow from './components/MoneyHealthScoreFlow'

function App() {
  const [isHealthScoreOpen, setIsHealthScoreOpen] = useState(false)

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <MoneyHealthScore onOpenFlow={() => setIsHealthScoreOpen(true)} />
        <TaxWizard />
        <FeatureBentoGrid />
        <LifeEventAdvisor />
        <PortfolioXRay />
        <FirePathPlanner />
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
