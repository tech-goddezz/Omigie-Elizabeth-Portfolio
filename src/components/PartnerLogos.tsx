import React from 'react';
import { motion } from 'motion/react';
import { useScrollAnimation } from '../utils/motion';

export const PartnerLogos: React.FC = () => {
  const { getFadeUp, shouldReduceMotion } = useScrollAnimation();

  const partners = [
    {
      name: 'React',
      icon: (
        <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-4 h-4 text-[#61DAFB] fill-none stroke-current shrink-0" strokeWidth="1">
          <circle cx="0" cy="0" r="2.05" fill="currentColor" stroke="none" />
          <g stroke="currentColor">
            <ellipse rx="11" ry="4.2" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
          </g>
        </svg>
      ),
      style: 'font-bold text-sm sm:text-base',
    },
    {
      name: 'TypeScript',
      icon: (
        <span className="w-4 h-4 rounded-[3px] bg-[#3178C6] text-white flex items-center justify-center font-mono font-bold text-[9px] leading-none shrink-0">
          TS
        </span>
      ),
      style: 'font-bold text-sm sm:text-base',
    },
    {
      name: 'Tailwind CSS',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#38BDF8] fill-current shrink-0">
          <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"/>
        </svg>
      ),
      style: 'font-bold text-sm sm:text-base',
    },
    {
      name: 'Firebase',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#FFA000] fill-current shrink-0">
          <path d="M3.89 15.672L6.65 1.764a.7.7 0 0 1 1.31-.102l2.06 3.916 1.74-3.3a.7.7 0 0 1 1.26.071l3.94 12.28-7.86 4.371a1.4 1.4 0 0 1-1.37 0l-7.73-4.298z" />
          <path d="M16.96 14.63L13.02 2.35a.7.7 0 0 0-1.26-.071L10.02 5.58l3.64 6.94 3.3 2.11z" fill="#FFCA28" />
          <path d="M3.89 15.672l4.98-9.452 3.64 6.94-8.62 2.512z" fill="#FFA000" />
        </svg>
      ),
      style: 'font-bold text-sm sm:text-base',
    },
    {
      name: 'Three.js',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-none stroke-current shrink-0" strokeWidth="1.5">
          <polygon points="12 2 2 22 22 22" />
          <line x1="12" y1="2" x2="12" y2="22" />
          <line x1="2" y1="22" x2="17" y2="12" />
        </svg>
      ),
      style: 'font-bold text-sm sm:text-base font-mono',
    },
  ];

  return (
    <section className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto py-6 sm:py-8 md:py-10" aria-label="Technologies and frameworks used">
      <motion.div
        {...getFadeUp(0, 20, 0.45)}
        className="w-full text-center space-y-4"
      >
        <div className="text-[11px] font-medium tracking-wide text-zinc-400">
          Built With
        </div>

        {/* Smooth infinite marquee for all screen sizes */}
        <div className="overflow-hidden relative w-full py-1 [mask-image:_linear-gradient(to_right,_transparent_0%,_black_12%,_black_88%,_transparent_100%)]">
          <div className={`flex gap-8 sm:gap-12 md:gap-16 w-max ${shouldReduceMotion ? 'flex-wrap justify-center w-full' : 'animate-marquee'}`}>
            {(shouldReduceMotion ? partners : [...partners, ...partners, ...partners, ...partners]).map((partner, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-2 text-zinc-300 hover:text-white shrink-0 transition-colors cursor-pointer ${partner.style}`}
              >
                {partner.icon}
                <span>{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};
