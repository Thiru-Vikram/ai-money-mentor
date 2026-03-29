import './index.css'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import MoneyHealthScore from './components/MoneyHealthScore'
import TaxWizard from './components/TaxWizard'
import FeatureBentoGrid from './components/FeatureBentoGrid'
import LifeEventAdvisor from './components/LifeEventAdvisor'
import CouplesMoneyPlanner from './components/CouplesMoneyPlanner'
import PortfolioXRay from './components/PortfolioXRay'
import FirePathPlanner from './components/FirePathPlanner'
import FooterCTA from './components/FooterCTA'

function App() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <FeatureBentoGrid />
        <FirePathPlanner />
        <MoneyHealthScore />
        <TaxWizard />
        <LifeEventAdvisor />
        <CouplesMoneyPlanner />
        <PortfolioXRay />
      </main>
      <FooterCTA />
    </div>
  )
}

export default App
