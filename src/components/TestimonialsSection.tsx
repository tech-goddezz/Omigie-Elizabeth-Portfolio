import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import { motion } from 'motion/react';
import { useScrollAnimation } from '../utils/motion';
import { optimizeCloudinaryUrl } from '../utils/cloudinary';

export const TestimonialsSection: React.FC = () => {
  const { getFadeUp, shouldReduceMotion } = useScrollAnimation();

  const reflections = [
    {
      quote: "Great software isn't just about clean syntax or fast renders - it's about understanding how someone will actually experience and rely on what you build every day.",
      name: "Omigie Elizabeth",
      role: "Frontend Developer & AI Product Engineer",
      avatar: optimizeCloudinaryUrl("https://res.cloudinary.com/eltckiww/image/upload/v1787584948/IMG_20251125_164217_warlbx.jpg", { width: 96 }),
    },
    {
      quote: "AI works best when it disappears into the interface - transforming complex intelligence into fluid, intuitive interactions that feel completely natural.",
      name: "Omigie Elizabeth",
      role: "Frontend Developer & AI Product Engineer",
      avatar: optimizeCloudinaryUrl("https://res.cloudinary.com/eltckiww/image/upload/v1787584969/IMG_20251212_154846_cehi91.jpg", { width: 96 }),
    },
    {
      quote: "I bridge the gap between rigorous engineering architecture and high-polish creative design, ensuring every pixel and state transition serves a clear purpose.",
      name: "Omigie Elizabeth",
      role: "Frontend Developer & AI Product Engineer",
      avatar: optimizeCloudinaryUrl("https://res.cloudinary.com/eltckiww/image/upload/v1787584971/IMG_20251212_154916_mrsti3.jpg", { width: 96 }),
    },
  ];

  const marqueeRef = useRef<HTMLDivElement>(null);
  const [isManualScrolling, setIsManualScrolling] = useState(false);
  const [isAutoplayReady, setIsAutoplayReady] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const manualScrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [deemphasizedSide, setDeemphasizedSide] = useState<'left' | 'right' | null>(null);
  const deemphasizeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const marqueeItems = [...reflections, ...reflections, ...reflections];

  // Delay autoplay on initial mount so first card renders in stable state immediately
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAutoplayReady(true);
    }, 1200);

    return () => {
      clearTimeout(timer);
      if (deemphasizeTimerRef.current) {
        clearTimeout(deemphasizeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const container = marqueeRef.current;
    if (!container || !isAutoplayReady || isManualScrolling || isHovered || shouldReduceMotion) return;

    let animId: number;
    const speed = 0.6;

    const step = () => {
      if (container && !isManualScrolling && isAutoplayReady && !isHovered) {
        container.scrollLeft += speed;
        const oneSetWidth = container.scrollWidth / 3;
        const maxLoopScroll = oneSetWidth * 2;

        if (container.scrollLeft >= maxLoopScroll) {
          container.scrollLeft -= oneSetWidth;
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isAutoplayReady, isManualScrolling, isHovered, shouldReduceMotion]);

  const handleManualScroll = (direction: 'left' | 'right') => {
    const container = marqueeRef.current;
    if (!container) return;

    // Temporarily de-emphasize the opposite arrow
    if (deemphasizeTimerRef.current) {
      clearTimeout(deemphasizeTimerRef.current);
    }
    setDeemphasizedSide(direction === 'left' ? 'right' : 'left');
    deemphasizeTimerRef.current = setTimeout(() => {
      setDeemphasizedSide(null);
    }, 2800);

    setIsManualScrolling(true);
    if (manualScrollTimerRef.current) {
      clearTimeout(manualScrollTimerRef.current);
    }

    const scrollAmount = 380;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });

    manualScrollTimerRef.current = setTimeout(() => {
      setIsManualScrolling(false);
    }, 900);
  };

  return (
    <section 
      id="testimonials" 
      aria-label="Personal Reflections and Approach"
      className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto pt-4 sm:pt-6 md:pt-8 lg:pt-10 pb-10 sm:py-14 md:py-16 relative overflow-hidden"
    >
      {/* Header */}
      <motion.div 
        {...getFadeUp(0, 20, 0.45)}
        className="text-center space-y-1.5 mb-6 sm:mb-8"
      >
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF4D1A]">
          PERSPECTIVE
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          My Approach
        </h2>
      </motion.div>

      {/* Carousel Container */}
      <motion.div 
        {...getFadeUp(0.1, 20, 0.45)}
        className="relative flex items-center justify-between gap-3 sm:gap-5"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left Arrow Button (Original Design with Press De-emphasis) */}
        <button
          id="testimonials-prev-btn"
          type="button"
          onClick={() => handleManualScroll('left')}
          className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 border border-amber-500/25 text-zinc-300 hover:text-amber-300 hover:border-amber-500/60 hover:bg-amber-500/10 backdrop-blur-xl transition-all duration-300 flex items-center justify-center cursor-pointer shadow-xl active:scale-95 z-20 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none ${
            deemphasizedSide === 'left' ? 'opacity-35' : 'opacity-100'
          }`}
          aria-label="Scroll testimonials backward"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
        </button>

        {/* Marquee Carousel Track */}
        <div className="relative w-full overflow-hidden py-3 [mask-image:_linear-gradient(to_right,_transparent_0%,_black_6%,_black_94%,_transparent_100%)]">
          <div
            ref={marqueeRef}
            tabIndex={0}
            aria-label="Reflections carousel"
            className="flex gap-8 sm:gap-10 overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-2 focus-visible:ring-1 focus-visible:ring-amber-500/40 rounded-2xl"
          >
            {marqueeItems.map((item, idx) => (
              <div
                key={idx}
                className="w-[290px] sm:w-[360px] shrink-0 bg-black/20 border border-amber-500/18 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-amber-500/40 hover:shadow-[0_8px_24px_rgba(245,158,11,0.08)] transition-all duration-300 shadow-md backdrop-blur-xl group"
              >
                <div className="space-y-3">
                  <div className="text-amber-400/80 group-hover:text-amber-400 transition-colors origin-left">
                    <Quote className="w-7 h-7 fill-amber-400/15 stroke-amber-400/80 group-hover:fill-amber-400/25 group-hover:stroke-amber-400 transition-colors" aria-hidden="true" />
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed">
                    "{item.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 mt-4 border-t border-white/10">
                  <img
                    src={item.avatar}
                    alt={`Photo of ${item.name}`}
                    width={40}
                    height={40}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-500/30 group-hover:ring-amber-500/60 transition-colors"
                  />
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-zinc-400 font-normal">
                      {item.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow Button (Original Design with Press De-emphasis) */}
        <button
          id="testimonials-next-btn"
          type="button"
          onClick={() => handleManualScroll('right')}
          className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 border border-amber-500/25 text-zinc-300 hover:text-amber-300 hover:border-amber-500/60 hover:bg-amber-500/10 backdrop-blur-xl transition-all duration-300 flex items-center justify-center cursor-pointer shadow-xl active:scale-95 z-20 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none ${
            deemphasizedSide === 'right' ? 'opacity-35' : 'opacity-100'
          }`}
          aria-label="Scroll testimonials forward"
        >
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
        </button>
      </motion.div>
    </section>
  );
};
