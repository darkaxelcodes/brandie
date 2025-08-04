import React from 'react';

interface PoweredBySectionProps {
  className?: string;
}

export const PoweredBySection: React.FC<PoweredBySectionProps> = ({ className = '' }) => {
  const logos = [
    {
      src: "https://bpwrjziidqhrsdivfizn.supabase.co/storage/v1/object/public/brandie/bolt_logo.svg",
      alt: "Bolt",
      width: 100,
      url: "https://bolt.new"
    },
    {
      src: "https://bpwrjziidqhrsdivfizn.supabase.co/storage/v1/object/public/brandie/eleven_labs_logo.svg",
      alt: "Eleven Labs",
      width: 120,
      url: "https://elevenlabs.io"
    },
    {
      src: "https://bpwrjziidqhrsdivfizn.supabase.co/storage/v1/object/public/brandie/entri_logo.svg",
      alt: "Entri",
      width: 100,
      url: "https://entri.com"
    },
    {
      src: "https://bpwrjziidqhrsdivfizn.supabase.co/storage/v1/object/public/brandie/netlify_logo.svg",
      alt: "Netlify",
      width: 100,
      url: "https://netlify.com"
    },
    {
      src: "https://bpwrjziidqhrsdivfizn.supabase.co/storage/v1/object/public/brandie/supabase_logo.svg",
      alt: "Supabase",
      width: 130,
      url: "https://supabase.co"
    }
  ];

  return (
    <div className={`${className}`}>
      <h3 className="text-center text-secondary-400 dark:text-secondary-500 text-sm mb-6 font-medium tracking-wide uppercase">Powered By</h3>
      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
        {logos.map((logo, index) => (
          <a 
            key={index} 
            href={logo.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center transition-all duration-300 hover:scale-110 group"
          >
            <img 
              src={logo.src} 
              alt={logo.alt} 
              className="h-8 md:h-10 object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300 filter dark:brightness-0 dark:invert"
              style={{ maxWidth: logo.width }}
            />
          </a>
        ))}
      </div>
    </div>
  );
};