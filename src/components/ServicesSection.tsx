import React, { useState, useRef } from 'react';
import { Layout, Palette, Code, ArrowUpRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useScrollAnimation } from '../utils/motion';
import { ServiceSlug } from './ServiceDetailPage';

interface ServicesSectionProps {
  onSelectService?: (slug: ServiceSlug) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const { getFadeUp, shouldReduceMotion } = useScrollAnimation();
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const containerRef = useRef<HTMLElement>(null);

  // Restrained scroll parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const subtleParallaxY = useTransform(scrollYProgress, [0, 1], [-8, 8]);

  const services: {
    id: number;
    slug: ServiceSlug;
    path: string;
    icon: React.ReactNode;
    iconBg: string;
    title: string;
    desc: string;
    connectedTo: number[];
    accentColor: string;
    glowColor: string;
    borderColor: string;
    activeBorder: string;
  }[] = [
    {
      id: 0,
      slug: 'frontend-engineering',
      path: '/services/frontend-engineering',
      icon: <Layout className="w-5 h-5 text-[#FF4D1A]" />,
      iconBg: 'bg-orange-500/10 border-orange-500/20 group-hover:border-[#FF4D1A]/50 group-hover:bg-[#FF4D1A]/20',
      title: 'Frontend Engineering',
      desc: 'Building fast, responsive interfaces with React, TypeScript, and modern tooling.',
      connectedTo: [1, 2],
      accentColor: '#FF4D1A',
      glowColor: 'rgba(255, 77, 26, 0.25)',
      borderColor: 'border-[#FF4D1A]/20 hover:border-[#FF4D1A]/60',
      activeBorder: 'border-[#FF4D1A] shadow-[0_8px_32px_rgba(255,77,26,0.25)]',
    },
    {
      id: 1,
      slug: 'ai-product-integration',
      path: '/services/ai-product-integration',
      icon: <Code className="w-5 h-5 text-purple-400" />,
      iconBg: 'bg-purple-500/10 border-purple-500/20 group-hover:border-purple-400/50 group-hover:bg-purple-500/20',
      title: 'AI Product Integration',
      desc: 'Embedding LLM-powered features (AI APIs, intelligent flows) into real products.',
      connectedTo: [0, 2],
      accentColor: '#A855F7',
      glowColor: 'rgba(168, 85, 247, 0.25)',
      borderColor: 'border-[#A855F7]/20 hover:border-[#A855F7]/60',
      activeBorder: 'border-[#A855F7] shadow-[0_8px_32px_rgba(168,85,247,0.25)]',
    },
    {
      id: 2,
      slug: 'product-prototyping',
      path: '/services/product-prototyping',
      icon: <Palette className="w-5 h-5 text-[#FF7A00]" />,
      iconBg: 'bg-orange-500/10 border-orange-500/20 group-hover:border-[#FF7A00]/50 group-hover:bg-[#FF7A00]/20',
      title: 'Product Prototyping',
      desc: 'Turning a Figma concept into a fully working, polished product.',
      connectedTo: [0, 1],
      accentColor: '#FF7A00',
      glowColor: 'rgba(255, 122, 0, 0.25)',
      borderColor: 'border-[#FF7A00]/20 hover:border-[#FF7A00]/60',
      activeBorder: 'border-[#FF7A00] shadow-[0_8px_32px_rgba(255,122,0,0.25)]',
    },
  ];

  const handleCardClick = (e: React.MouseEvent, slug: ServiceSlug) => {
    e.preventDefault();
    if (onSelectService) {
      onSelectService(slug);
    }
  };

  return (
    <section
      ref={containerRef}
      id="services"
      aria-label="Engineering Services Offered"
      className="scroll-mt-20 relative px-4 sm:px-6 md:px-12 max-w-7xl mx-auto py-10 sm:py-14 md:py-18 overflow-visible"
    >
      {/* Header */}
      <motion.div 
        {...getFadeUp(0, 20, 0.45)}
        className="text-center space-y-1.5 mb-8 sm:mb-12"
      >
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF4D1A]">
          WHAT I DO
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Services
        </h2>
      </motion.div>

      {/* Connected Intelligent System Grid Container */}
      <motion.div
        style={{ y: shouldReduceMotion ? 0 : subtleParallaxY }}
        className="relative max-w-6xl mx-auto"
      >
        {/* Subtle Neural Network Grid Interconnects (SVG Bus Conduits) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none -z-10 hidden md:block"
        >
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bus-3-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF4D1A" stopOpacity={activeCard === 0 ? '0.8' : '0.2'} />
                <stop offset="50%" stopColor="#A855F7" stopOpacity={activeCard === 1 ? '0.8' : '0.2'} />
                <stop offset="100%" stopColor="#FF7A00" stopOpacity={activeCard === 2 ? '0.8' : '0.2'} />
              </linearGradient>
            </defs>

            {/* Horizontal Continuous Bridge Line */}
            <line x1="16.6%" y1="50%" x2="83.3%" y2="50%" stroke="url(#bus-3-gradient)" strokeWidth="1.5" strokeDasharray="3 4" />

            {/* Node Synapses */}
            <circle cx="16.6%" cy="50%" r="4" fill="#0A0A0D" stroke={activeCard === 0 ? '#FF4D1A' : 'rgba(255, 77, 26, 0.4)'} strokeWidth="1.5" />
            <circle cx="50%" cy="50%" r="4" fill="#0A0A0D" stroke={activeCard === 1 ? '#A855F7' : 'rgba(168, 85, 247, 0.4)'} strokeWidth="1.5" />
            <circle cx="83.3%" cy="50%" r="4" fill="#0A0A0D" stroke={activeCard === 2 ? '#FF7A00' : 'rgba(255, 122, 0, 0.4)'} strokeWidth="1.5" />
          </svg>
        </div>

        {/* 3-Card Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {services.map((svc, idx) => {
            const isHovered = activeCard === idx;

            const borderStyle = isHovered
              ? svc.activeBorder
              : svc.borderColor;

            return (
              <motion.a
                key={idx}
                href={svc.path}
                onClick={(e) => handleCardClick(e, svc.slug)}
                aria-label={`View detailed service overview for ${svc.title}`}
                {...getFadeUp(0.05 + idx * 0.05, 20, 0.45)}
                onMouseEnter={() => setActiveCard(idx)}
                onMouseLeave={() => setActiveCard(null)}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className={`relative bg-black/20 border ${borderStyle} rounded-2xl p-6 sm:p-7 flex flex-col items-center text-center space-y-3 transition-all duration-300 group backdrop-blur-xl shadow-lg cursor-pointer overflow-hidden block no-underline select-none focus-visible:ring-2 focus-visible:ring-[#FF4D1A] focus-visible:outline-none`}
              >
                {/* Top-Right Arrow Affordance Indicator */}
                <div className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-white/[0.03] border border-white/10 group-hover:border-white/25 group-hover:bg-white/[0.08] transition-all duration-300">
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" aria-hidden="true" />
                </div>

                {/* Ambient Internal Glow reacting ONLY when the card itself is hovered */}
                <div
                  aria-hidden="true"
                  style={{
                    backgroundColor: svc.accentColor,
                    opacity: isHovered ? 0.18 : 0,
                  }}
                  className="absolute -inset-10 rounded-full blur-2xl pointer-events-none transition-opacity duration-400"
                />

                {/* Service Icon Badge */}
                <div className={`p-3 rounded-2xl ${svc.iconBg} border group-hover:scale-105 transition-all flex items-center justify-center`} aria-hidden="true">
                  {svc.icon}
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-[#FF4D1A] transition-colors">
                  {svc.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed max-w-md">
                  {svc.desc}
                </p>

                {/* Bottom Affordance Cue */}
                <div className="pt-2 mt-auto flex items-center gap-1.5 text-xs font-semibold text-zinc-400 group-hover:text-white transition-colors duration-200">
                  <span>View details</span>
                  <ArrowUpRight
                    className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                    style={{ color: svc.accentColor }}
                    aria-hidden="true"
                  />
                </div>
              </motion.a>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};
