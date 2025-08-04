import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  // Track scroll position for luxury navbar effect
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
    { path: '/pricing', label: 'Pricing' }
  ];

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled || mobileMenuOpen 
          ? 'bg-white/80 dark:bg-secondary-950/80 backdrop-blur-xl shadow-luxury-lg border-b border-secondary-200/50 dark:border-secondary-700/50 py-4' 
          : 'bg-transparent py-6'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo with luxury styling */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/for-startups" className="flex items-center space-x-3 group">
              <div className="relative">
                <img 
                  src="https://bpwrjziidqhrsdivfizn.supabase.co/storage/v1/object/public/brandie/Logo.png" 
                  alt="Brandie Logo" 
                  className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-gold-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
              </div>
              <div className="flex flex-col">
                <span className={`text-2xl font-bold transition-colors duration-300 ${
                  isScrolled || mobileMenuOpen 
                    ? 'text-secondary-900 dark:text-white' 
                    : 'text-secondary-900 dark:text-white'
                }`}>
                  Brandie
                </span>
                <span className="text-xs font-medium text-primary-600 dark:text-primary-400 tracking-wider uppercase">
                  AI-Powered Branding
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation with luxury styling */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <NavLink 
                  to={item.path} 
                  isScrolled={isScrolled}
                  isActive={location.pathname === item.path}
                >
                  {item.label}
                </NavLink>
              </motion.div>
            ))}
          </nav>

          {/* CTA Buttons with luxury styling */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link to="/dashboard">
                  <Button variant="luxury" glow>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link 
                    to="/auth" 
                    className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 font-semibold transition-colors duration-300 px-4 py-2 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20"
                  >
                    Sign In
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link to="/auth">
                    <Button variant="luxury" glow>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Get Started
                    </Button>
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Menu Button with luxury styling */}
          <motion.button 
            className="lg:hidden p-3 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-xl transition-colors duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu with luxury styling */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden bg-white/95 dark:bg-secondary-950/95 backdrop-blur-xl border-t border-secondary-200/50 dark:border-secondary-700/50"
          >
            <div className="py-6 px-6 space-y-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    to={item.path}
                    className="block py-3 px-4 text-lg font-semibold text-secondary-900 dark:text-secondary-100 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              
              <div className="pt-6 border-t border-secondary-200/50 dark:border-secondary-700/50 space-y-4">
                {user ? (
                  <Link to="/dashboard">
                    <Button variant="luxury" className="w-full" glow>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/auth">
                      <Button variant="luxury" className="w-full mb-3" glow>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Get Started
                      </Button>
                    </Link>
                    <Link 
                      to="/auth" 
                      className="block text-center text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 font-semibold transition-colors duration-300"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

// Luxury NavLink component
interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  isScrolled: boolean;
  isActive: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, isScrolled, isActive }) => {
  return (
    <Link 
      to={to} 
      className={`
        relative px-6 py-3 font-semibold transition-all duration-300 rounded-xl group
        ${isActive 
          ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' 
          : isScrolled 
            ? 'text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20' 
            : 'text-secondary-800 dark:text-secondary-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white/10 dark:hover:bg-secondary-800/50'
        }
      `}
    >
      {children}
      
      {/* Luxury active indicator */}
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-primary-500 to-accent-gold-500 rounded-full"
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
        />
      )}
      
      {/* Luxury hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-accent-gold-500/0 group-hover:from-primary-500/5 group-hover:to-accent-gold-500/5 rounded-xl transition-all duration-300" />
    </Link>
  );
};