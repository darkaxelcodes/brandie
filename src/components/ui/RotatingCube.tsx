import React, { useEffect, useRef } from 'react';

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

  const logos = [
    {
      url: "https://bpwrjziidqhrsdivfizn.supabase.co/storage/v1/object/public/brandie/bolt_logo.svg",
      link: "https://bolt.new",
      bgColor: "bg-blue-600"
    },
    {
      url: "https://bpwrjziidqhrsdivfizn.supabase.co/storage/v1/object/public/brandie/eleven_labs_logo.svg",
      link: "https://elevenlabs.io",
      bgColor: "bg-purple-600"
    },
    {
      url: "https://bpwrjziidqhrsdivfizn.supabase.co/storage/v1/object/public/brandie/entri_logo.svg",
      link: "https://entri.com",
      bgColor: "bg-green-600"
    },
    {
      url: "https://bpwrjziidqhrsdivfizn.supabase.co/storage/v1/object/public/brandie/netlify_logo.svg",
      link: "https://netlify.com",
      bgColor: "bg-red-600"
    },
    {
      url: "https://bpwrjziidqhrsdivfizn.supabase.co/storage/v1/object/public/brandie/supabase_logo.svg",
      link: "https://supabase.co",
      bgColor: "bg-amber-600"
    },
    {
      url: "https://bpwrjziidqhrsdivfizn.supabase.co/storage/v1/object/public/brandie/Logo.png",
      link: "/",
      bgColor: "bg-teal-600"
    }
  ];

  const handleClick = (link: string) => {
    window.open(link, '_blank');
  };

  return (
    <div className={`perspective-500 ${className}`}>
      <div 
        ref={cubeRef}
        className="relative w-16 h-16 transform-style-3d transition-transform duration-500 cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front face */}
        <div 
          className={`absolute w-full h-full flex items-center justify-center ${logos[0].bgColor} text-white rounded-lg shadow-lg`}
          style={{ transform: 'translateZ(8rem)' }}
          onClick={() => handleClick(logos[0].link)}
        >
          <img src={logos[0].url} alt="Logo" className="w-10 h-10 object-contain" />
        </div>
        
        {/* Back face */}
        <div 
          className={`absolute w-full h-full flex items-center justify-center ${logos[1].bgColor} text-white rounded-lg shadow-lg`}
          style={{ transform: 'rotateY(180deg) translateZ(8rem)' }}
          onClick={() => handleClick(logos[1].link)}
        >
          <img src={logos[1].url} alt="Logo" className="w-10 h-10 object-contain" />
        </div>
        
        {/* Right face */}
        <div 
          className={`absolute w-full h-full flex items-center justify-center ${logos[2].bgColor} text-white rounded-lg shadow-lg`}
          style={{ transform: 'rotateY(90deg) translateZ(8rem)' }}
          onClick={() => handleClick(logos[2].link)}
        >
          <img src={logos[2].url} alt="Logo" className="w-10 h-10 object-contain" />
        </div>
        
        {/* Left face */}
        <div 
          className={`absolute w-full h-full flex items-center justify-center ${logos[3].bgColor} text-white rounded-lg shadow-lg`}
          style={{ transform: 'rotateY(-90deg) translateZ(8rem)' }}
          onClick={() => handleClick(logos[3].link)}
        >
          <img src={logos[3].url} alt="Logo" className="w-10 h-10 object-contain" />
        </div>
        
        {/* Top face */}
        <div 
          className={`absolute w-full h-full flex items-center justify-center ${logos[4].bgColor} text-white rounded-lg shadow-lg`}
          style={{ transform: 'rotateX(90deg) translateZ(8rem)' }}
          onClick={() => handleClick(logos[4].link)}
        >
          <img src={logos[4].url} alt="Logo" className="w-10 h-10 object-contain" />
        </div>
        
        {/* Bottom face */}
        <div 
          className={`absolute w-full h-full flex items-center justify-center ${logos[5].bgColor} text-white rounded-lg shadow-lg`}
          style={{ transform: 'rotateX(-90deg) translateZ(8rem)' }}
          onClick={() => handleClick(logos[5].link)}
        >
          <img src={logos[5].url} alt="Logo" className="w-10 h-10 object-contain" />
        </div>
      </div>
    </div>
  );
};