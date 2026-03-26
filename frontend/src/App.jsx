import './index.css'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import MoneyHealthScore from './components/MoneyHealthScore'
import FeatureBentoGrid from './components/FeatureBentoGrid'
import PortfolioXRay from './components/PortfolioXRay'
import SocialProof from './components/SocialProof'
import FooterCTA from './components/FooterCTA'

function App() {
  const [isHealthScoreOpen, setIsHealthScoreOpen] = useState(false)

  return (
    <div className="min-h-screen overflow-x-hidden pt-16">
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

export default App
