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

function App() {
  return (
    <div className="min-h-screen overflow-x-hidden pt-16">
      <RouteScrollManager />
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/fire-calculator" element={<FireCalculator />} />
        <Route path="/tax-optimizer" element={<TaxOptimizer />} />
        <Route path="/couples-planner" element={<CouplesMoneyPlanner />} />
        <Route path="/couple-planner" element={<CouplePlanner />} />
      </Routes>
    </div>
  );
}

export default App;
