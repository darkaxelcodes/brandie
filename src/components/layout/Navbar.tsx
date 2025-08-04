import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  // Track scroll position to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || mobileMenuOpen 
          ? 'bg-white/95 backdrop-blur-md shadow-luxury border-b border-neutral-200/50 py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container-luxury">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="https://bpwrjziidqhrsdivfizn.supabase.co/storage/v1/object/public/brandie/Logo.png" 
              alt="Brandie Logo" 
              className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-110"
            />
            <span className={`text-2xl font-heading font-bold transition-colors duration-300 ${
              isScrolled || mobileMenuOpen ? 'text-neutral-900' : 'text-neutral-900'
            }`}>
              Brandie
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-10">
            <NavLink to="/for-startups" isScrolled={isScrolled}>For Startups</NavLink>
            <NavLink to="/for-agencies" isScrolled={isScrolled}>For Agencies</NavLink>
            <NavLink to="/features" isScrolled={isScrolled}>Features</NavLink>
            <NavLink to="/pricing" isScrolled={isScrolled}>Pricing</NavLink>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <Link to="/dashboard">
                <Button variant="primary" className="shadow-glow">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/auth" className={`font-heading font-medium transition-colors duration-300 ${
                  isScrolled ? 'text-neutral-700 hover:text-neutral-900' : 'text-neutral-800 hover:text-neutral-900'
                }`}>
                  Log in
                </Link>
                <Link to="/auth">
                  <Button variant="primary" className="shadow-glow">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 rounded-xl text-neutral-700 hover:bg-neutral-100 transition-colors duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="lg:hidden bg-white/95 backdrop-blur-md border-t border-neutral-200/50 mt-4"
        >
          <div className="py-6 px-6 space-y-6">
            <Link 
              to="/for-startups" 
              className="block py-3 text-neutral-900 font-heading font-medium text-lg hover:text-primary-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              For Startups
            </Link>
            <Link 
              to="/for-agencies" 
              className="block py-3 text-neutral-900 font-heading font-medium text-lg hover:text-primary-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              For Agencies
            </Link>
            <Link 
              to="/features" 
              className="block py-3 text-neutral-900 font-heading font-medium text-lg hover:text-primary-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className="block py-3 text-neutral-900 font-heading font-medium text-lg hover:text-primary-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            
            <div className="pt-6 border-t border-neutral-200/50">
              {user ? (
                <Link to="/dashboard">
                  <Button variant="primary" className="w-full shadow-glow">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="primary" className="w-full mb-4 shadow-glow">Get Started</Button>
                  </Link>
                  <Link to="/auth" className="block text-center text-neutral-700 hover:text-neutral-900 font-heading font-medium">
                    Log in
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

// NavLink component for consistent styling
interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  isScrolled: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, isScrolled }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`font-heading font-medium transition-all duration-300 relative group ${
        isActive 
          ? 'text-primary-600' 
          : isScrolled 
            ? 'text-neutral-700 hover:text-neutral-900' 
            : 'text-neutral-800 hover:text-neutral-900'
      }`}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="activeNavLink"
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-600 rounded-full"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
};