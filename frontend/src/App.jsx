import { useState } from 'react'
import './index.css'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import MoneyHealthScore from './components/MoneyHealthScore'
import TaxWizard from './components/TaxWizard'
import FeatureBentoGrid from './components/FeatureBentoGrid'
import PortfolioXRay from './components/PortfolioXRay'
import SocialProof from './components/SocialProof'
import FooterCTA from './components/FooterCTA'
import MoneyHealthScoreFlow from './components/MoneyHealthScoreFlow'
import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./index.css";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import FireCalculator from "./pages/FireCalculator";
import TaxOptimizer from "./pages/TaxOptimizer";
import CouplesMoneyPlanner from "./pages/CouplesMoneyPlanner";
import CouplePlanner from "./pages/CouplePlanner";

function RouteScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const scrollToTarget = () => {
      if (hash) {
        const target = document.getElementById(hash.slice(1));

        if (target) {
          const navOffset = 88;
          const top =
            target.getBoundingClientRect().top + window.scrollY - navOffset;
          window.scrollTo({ top, behavior: "smooth" });
          return;
        }
      }

      window.scrollTo({ top: 0, behavior: "auto" });
    };

    const frame = window.requestAnimationFrame(scrollToTarget);
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}
import { Routes, Route } from 'react-router-dom'
import './index.css'
import Navbar from './components/Navbar'
import FooterCTA from './components/FooterCTA'
import Home from './pages/Home'
import FireCalculator from './pages/FireCalculator'
import LifeAdvisor from './pages/LifeAdvisor'

function App() {
  const [isHealthScoreOpen, setIsHealthScoreOpen] = useState(false)

  return (
    <div className="min-h-screen overflow-x-hidden pt-16">
      <RouteScrollManager />
      <Navbar />
      <main>
        <HeroSection />
        <MoneyHealthScore onOpenFlow={() => setIsHealthScoreOpen(true)} />
        <TaxWizard />
        <FeatureBentoGrid />
        <PortfolioXRay />
        <SocialProof />
      </main>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fire-calculator" element={<FireCalculator />} />
        <Route path="/tax-optimizer" element={<TaxOptimizer />} />
        <Route path="/couples-planner" element={<CouplesMoneyPlanner />} />
        <Route path="/couple-planner" element={<CouplePlanner />} />
        <Route path="/life-advisor" element={<LifeAdvisor />} />
      </Routes>
      
      <FooterCTA />
      
      <MoneyHealthScoreFlow 
        isOpen={isHealthScoreOpen} 
        onClose={() => setIsHealthScoreOpen(false)} 
      />
    </div>
  );
}

export default App;
