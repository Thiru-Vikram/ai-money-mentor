import { Routes, Route } from 'react-router-dom'
import './index.css'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import FireCalculator from './pages/FireCalculator'
import LifeEventAdvisor from './pages/LifeEventAdvisor'

function App() {
  return (
    <div className="min-h-screen overflow-x-hidden pt-16">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/fire-calculator" element={<FireCalculator />} />
        <Route path="/life-advisor" element={<LifeEventAdvisor />} />
      </Routes>
    </div>
  )
}

export default App
