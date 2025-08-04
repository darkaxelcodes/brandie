import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Terminal } from 'lucide-react';

interface ScrollToTopProps {
  showBelow?: number;
  className?: string;
}

export const ScrollToTop: React.FC<ScrollToTopProps> = ({ 
  showBelow = 300,
  className = ''
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > showBelow) {
        if (!show) setShow(true);
      } else {
        if (show) setShow(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [show, showBelow]);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
          onClick={handleClick}
          className={`fixed bottom-8 right-8 z-50 p-3 rounded-lg bg-gradient-ai text-void shadow-cyber hover:shadow-neon focus:outline-none focus:ring-2 focus:ring-neon-green focus:ring-offset-2 focus:ring-offset-void neon-glow group ${className}`}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5 group-hover:animate-pulse" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};