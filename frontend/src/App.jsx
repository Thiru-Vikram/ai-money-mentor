import { Routes, Route } from 'react-router-dom'
import './index.css'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import MoneyHealthScore from './components/MoneyHealthScore'
import FeatureBentoGrid from './components/FeatureBentoGrid'
import PortfolioXRay from './components/PortfolioXRay'
import SocialProof from './components/SocialProof'
import FooterCTA from './components/FooterCTA'

// Feature Pages
import FIREPlanner from './pages/FIREPlanner'
import HealthScoreQuiz from './pages/HealthScoreQuiz'
import TaxWizard from './pages/TaxWizard'
import PortfolioXRayPage from './pages/PortfolioXRayPage'
import LifeEventAdvisor from './pages/LifeEventAdvisor'
import CouplesPlanner from './pages/CouplesPlanner'

function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <MoneyHealthScore />
        <FeatureBentoGrid />
        <PortfolioXRay />
        <SocialProof />
      </main>
      <FooterCTA />
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/fire-planner" element={<FIREPlanner />} />
      <Route path="/health-score" element={<HealthScoreQuiz />} />
      <Route path="/tax-wizard" element={<TaxWizard />} />
      <Route path="/portfolio-xray" element={<PortfolioXRayPage />} />
      <Route path="/life-event" element={<LifeEventAdvisor />} />
      <Route path="/couples-planner" element={<CouplesPlanner />} />
    </Routes>
  )
}

export default App
