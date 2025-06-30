import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Palette, MessageSquare, FileText, CheckCircle } from 'lucide-react';

interface RotatingCubeProps {
  className?: string;
}

export const RotatingCube: React.FC<RotatingCubeProps> = ({ className = '' }) => {
  const cubeRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const cube = cubeRef.current;
    if (!cube) return;
    
    let rotationX = 0;
    let rotationY = 0;
    let animationId: number;
    
    const animate = () => {
      rotationY += 0.5; // Rotate around Y axis
      if (rotationY >= 360) rotationY = 0;
      
      cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className={`perspective-500 ${className}`}>
      <div 
        ref={cubeRef}
        className="relative w-24 h-24 transform-style-3d transition-transform duration-500"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front face */}
        <div 
          className="absolute w-full h-full flex items-center justify-center bg-blue-600 text-white rounded-lg shadow-lg"
          style={{ transform: 'translateZ(12rem)' }}
        >
          <Sparkles className="w-12 h-12" />
        </div>
        
        {/* Back face */}
        <div 
          className="absolute w-full h-full flex items-center justify-center bg-purple-600 text-white rounded-lg shadow-lg"
          style={{ transform: 'rotateY(180deg) translateZ(12rem)' }}
        >
          <Brain className="w-12 h-12" />
        </div>
        
        {/* Right face */}
        <div 
          className="absolute w-full h-full flex items-center justify-center bg-green-600 text-white rounded-lg shadow-lg"
          style={{ transform: 'rotateY(90deg) translateZ(12rem)' }}
        >
          <Palette className="w-12 h-12" />
        </div>
        
        {/* Left face */}
        <div 
          className="absolute w-full h-full flex items-center justify-center bg-red-600 text-white rounded-lg shadow-lg"
          style={{ transform: 'rotateY(-90deg) translateZ(12rem)' }}
        >
          <MessageSquare className="w-12 h-12" />
        </div>
        
        {/* Top face */}
        <div 
          className="absolute w-full h-full flex items-center justify-center bg-amber-600 text-white rounded-lg shadow-lg"
          style={{ transform: 'rotateX(90deg) translateZ(12rem)' }}
        >
          <FileText className="w-12 h-12" />
        </div>
        
        {/* Bottom face */}
        <div 
          className="absolute w-full h-full flex items-center justify-center bg-teal-600 text-white rounded-lg shadow-lg"
          style={{ transform: 'rotateX(-90deg) translateZ(12rem)' }}
        >
          <CheckCircle className="w-12 h-12" />
        </div>
      </div>
    </div>
  );
};