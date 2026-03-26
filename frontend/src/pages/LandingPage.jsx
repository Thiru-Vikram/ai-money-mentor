import HeroSection from '../components/HeroSection'
import MoneyHealthScore from '../components/MoneyHealthScore'
import FeatureBentoGrid from '../components/FeatureBentoGrid'
import PortfolioXRay from '../components/PortfolioXRay'
import SocialProof from '../components/SocialProof'
import FooterCTA from '../components/FooterCTA'

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <MoneyHealthScore />
      <FeatureBentoGrid />
      <PortfolioXRay />
      <SocialProof />
      <FooterCTA />
    </main>
  )
}
