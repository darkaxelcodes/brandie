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
        isScrolled || mobileMenuOpen ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="https://bpwrjziidqhrsdivfizn.supabase.co/storage/v1/object/public/brandie/Logo.png" 
              alt="Brandie Logo" 
              className="w-10 h-10 object-contain"
            />
            <span className={`text-xl font-bold ${
              isScrolled || mobileMenuOpen ? 'text-gray-900' : 'text-gray-900'
            }`}>
              Brandie
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" isScrolled={isScrolled}>Home</NavLink>
            <NavLink to="/features" isScrolled={isScrolled}>Features</NavLink>
            <NavLink to="/pricing" isScrolled={isScrolled}>Pricing</NavLink>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <Link to="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/auth" className="text-gray-700 hover:text-gray-900 font-medium">
                  Log in
                </Link>
                <Link to="/auth">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700"
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
          className="md:hidden bg-white border-t border-gray-200 mt-3"
        >
          <div className="py-4 px-6 space-y-4">
            <Link 
              to="/" 
              className="block py-2 text-gray-900 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/features" 
              className="block py-2 text-gray-900 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className="block py-2 text-gray-900 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            
            <div className="pt-4 border-t border-gray-200">
              {user ? (
                <Link to="/dashboard">
                  <Button className="w-full">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth">
                    <Button className="w-full mb-3">Get Started</Button>
                  </Link>
                  <Link to="/auth" className="block text-center text-gray-700 hover:text-gray-900 font-medium">
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
      className={`font-medium transition-colors ${
        isActive 
          ? 'text-blue-600' 
          : isScrolled 
            ? 'text-gray-700 hover:text-gray-900' 
            : 'text-gray-800 hover:text-gray-900'
      }`}
    >
      {children}
    </Link>
  );
};