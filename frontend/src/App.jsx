import { Routes, Route } from 'react-router-dom'
import './index.css'
import Navbar from './components/Navbar'
import FooterCTA from './components/FooterCTA'
import Home from './pages/Home'
import FireCalculator from './pages/FireCalculator'
import LifeAdvisor from './pages/LifeAdvisor'

function App() {
  return (
    <div className="min-h-screen overflow-x-hidden pt-16">
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fire-calculator" element={<FireCalculator />} />
        <Route path="/life-advisor" element={<LifeAdvisor />} />
      </Routes>
      
      <FooterCTA />
    </div>
  )
}

export default App
