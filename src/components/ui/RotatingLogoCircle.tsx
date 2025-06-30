import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RotatingLogoCircleProps {
  className?: string;
}

export const RotatingLogoCircle: React.FC<RotatingLogoCircleProps> = ({ className = '' }) => {
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);
  
  const logos = [
    {
      url: "https://bpwrjziidqhrsdivfizn.supabase.co/storage/v1/object/public/brandie//bolt_logo_dark.svg",
      link: "https://bolt.new",
    },
    {
      url: "https://bpwrjziidqhrsdivfizn.supabase.co/storage/v1/object/public/brandie/eleven_labs_logo.svg",
      link: "https://elevenlabs.io",
    },
    {
      url: "https://bpwrjziidqhrsdivfizn.supabase.co/storage/v1/object/public/brandie/entri_logo.svg",
      link: "https://entri.com",
    },
    {
      url: "https://bpwrjziidqhrsdivfizn.supabase.co/storage/v1/object/public/brandie/netlify_logo.svg",
      link: "https://netlify.com",
    },
    {
      url: "https://bpwrjziidqhrsdivfizn.supabase.co/storage/v1/object/public/brandie/supabase_logo.svg",
      link: "https://supabase.co",
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLogoIndex((prevIndex) => (prevIndex + 1) % logos.length);
    }, 3000); // Change logo every 3 seconds
    
    return () => clearInterval(interval);
  }, [logos.length]);

  const handleClick = () => {
    window.open(logos[currentLogoIndex].link, '_blank');
  };

  // Create the circular text
  const createCircularText = () => {
    const text = "POWERED BY • POWERED BY • ";
    const characters = text.split('');
    const degree = 360 / characters.length;
    
    return characters.map((char, i) => (
      <div
        key={i}
        className="absolute text-xs text-black opacity-70"
        style={{
          height: '100%',
          width: '20px',
          transformOrigin: 'bottom center',
          left: '50%',
          top: '-5px',
          transform: `rotate(${i * degree}deg)`
        }}
      >
        {char}
      </div>
    ));
  };

  return (
    <div className={`relative ${className}`}>
      {/* Circular text - slightly bigger than the main circle */}
      <div className="absolute w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center">
        {createCircularText()}
      </div>
      
      {/* Black circle with logo */}
      <div 
        className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-black flex items-center justify-center cursor-pointer m-2"
        onClick={handleClick}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentLogoIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <img 
              src={logos[currentLogoIndex].url} 
              alt={`${logos[currentLogoIndex].link} Logo`}
              className="w-10 h-10 md:w-12 md:h-12 object-contain"
              style={{ filter: 'brightness(0) invert(1)' }} // Make logos white
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};