import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Menu, X, ArrowRight, Zap, Terminal, Grid3X3 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  // Track scroll position for glass morphism effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: '/for-startups', label: 'For Startups' },
    { path: '/for-agencies', label: 'For Agencies' },
    { path: '/features', label: 'Features' },
    { path: '/pricing', label: 'Pricing' },
  ];

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled || mobileMenuOpen 
          ? 'glass-dark border-b border-dark-500 shadow-cyber' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="max-w-7xl mx-auto container-padding-cyber">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="w-10 h-10 bg-gradient-ai rounded-xl flex items-center justify-center neon-glow">
                <Terminal className="w-6 h-6 text-void" />
              </div>
              <div className="absolute inset-0 bg-gradient-ai rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
            </motion.div>
            <div>
              <span className="text-2xl font-black text-light">Brandie</span>
              <div className="text-xs text-neon-green font-terminal tracking-wider">AI BRAND BUILDER</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <Link to="/dashboard">
                <Button className="btn-ai-primary flex items-center space-x-2">
                  <Grid3X3 className="w-4 h-4" />
                  <span>Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth" className="nav-link-cyber">
                  <span className="font-terminal">./login</span>
                </Link>
                <Link to="/auth">
                  <Button className="btn-ai-primary flex items-center space-x-2 group">
                    <Zap className="w-4 h-4 group-hover:animate-pulse" />
                    <span className="font-terminal">./start_building</span>
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 rounded-xl hover:bg-dark-800 transition-colors border border-dark-500"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6 text-light" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6 text-light" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="lg:hidden glass-dark border-t border-dark-500 overflow-hidden"
          >
            <div className="container-padding-cyber py-6 space-y-6">
              {/* Navigation Links */}
              <div className="space-y-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link 
                      to={item.path}
                      className="block py-3 text-lg font-semibold text-light hover:text-neon-green transition-colors font-terminal"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      ./{item.label.toLowerCase().replace(' ', '_')}
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              {/* Mobile CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-6 border-t border-dark-500 space-y-4"
              >
                {user ? (
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="btn-ai-primary w-full justify-center">
                      <span className="font-terminal">./dashboard</span>
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="btn-ai-primary w-full justify-center">
                        <span className="font-terminal">./start_building</span>
                      </Button>
                    </Link>
                    <Link 
                      to="/auth" 
                      className="block text-center text-dark-100 hover:text-neon-green font-medium font-terminal"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      ./login
                    </Link>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

// Enhanced NavLink component with cyber aesthetics
interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`relative font-semibold transition-all duration-300 group font-terminal ${
        isActive 
          ? 'text-neon-green' 
          : 'text-dark-100 hover:text-light'
      }`}
    >
      ./{children.toString().toLowerCase().replace(' ', '_')}
      
      {/* Animated underline */}
      <motion.div
        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-ai rounded-full"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isActive ? 1 : 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      />
      
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-neon-green/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
    </Link>
  );
};