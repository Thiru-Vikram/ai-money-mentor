import './index.css'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import MoneyHealthScore from './components/MoneyHealthScore'
import FeatureBentoGrid from './components/FeatureBentoGrid'
import SocialProof from './components/SocialProof'
import FooterCTA from './components/FooterCTA'

function App() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <MoneyHealthScore />
        <FeatureBentoGrid />
        <SocialProof />
      </main>
      <FooterCTA />
    </div>
  )
}

export default App
