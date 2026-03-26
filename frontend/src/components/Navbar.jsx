import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const MotionDiv = motion.div;

const navLinks = [
  { label: "Portfolio X-Ray", href: "/#xray" },
  { label: "Health Score", href: "/#health" },
  { label: "Couple's Planner", href: "/couple-planner" },
  { label: "FIRE Calculator", href: "/fire-calculator" },
  { label: "Life Advisor", href: "/life-advisor" },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigateToHome = () => {
    setMenuOpen(false);
    navigate("/");
  };

  const isActiveLink = (link) => {
    const current = `${location.pathname}${location.hash || ""}`;
    return current === link.href;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-md bg-navy-900/80 border-b border-white/[0.06] shadow-xl shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to="/"
          onClick={navigateToHome}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-lg bg-green-growth/20 border border-green-growth/40 flex items-center justify-center group-hover:bg-green-growth/30 transition-colors">
            <Zap size={16} className="text-green-growth fill-green-growth" />
          </div>
          <span className="font-bold text-white text-base tracking-tight">
            AI<span className="text-green-growth">Money</span>Mentor
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={`nav-link ${isActiveLink(l) ? "text-white" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/[0.05] transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <MotionDiv
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/[0.06] backdrop-blur-md bg-navy-900/90"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {navLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className={`py-2 text-sm font-medium border-b border-white/[0.05] ${
                    isActiveLink(l)
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </header>
  );
}
