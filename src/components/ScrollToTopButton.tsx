import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp } from 'lucide-react';

interface ScrollToTopButtonProps {
  /** Distance in pixels to scroll before the button is eligible to appear (default: 480px) */
  scrollThreshold?: number;
  /** Milliseconds to wait after scroll stops before showing the button (default: 250ms) */
  scrollEndDelay?: number;
  /** Milliseconds the button stays visible before fading out from inactivity (default: 2800ms) */
  inactivityTimeout?: number;
}

export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({
  scrollThreshold = 480,
  scrollEndDelay = 250,
  inactivityTimeout = 2800,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const scrollStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    const clearTimers = () => {
      if (scrollStopTimerRef.current) {
        clearTimeout(scrollStopTimerRef.current);
        scrollStopTimerRef.current = null;
      }
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };

    const startInactivityTimer = () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
      hideTimerRef.current = setTimeout(() => {
        if (!isHoveredRef.current) {
          setIsVisible(false);
        }
      }, inactivityTimeout);
    };

    const handleScroll = () => {
      if (typeof window === 'undefined') return;

      // Immediately hide when scrolling is active
      setIsVisible(false);
      clearTimers();

      const currentScrollY = window.scrollY || window.pageYOffset;

      // Only prepare to show if past threshold
      if (currentScrollY > scrollThreshold) {
        scrollStopTimerRef.current = setTimeout(() => {
          setIsVisible(true);
          startInactivityTimer();
        }, scrollEndDelay);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimers();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollThreshold, scrollEndDelay, inactivityTimeout]);

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    // Resume inactivity timer after pointer leaves
    if (isVisible) {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        setIsVisible(false);
      }, inactivityTimeout);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          key="frosted-scroll-to-top"
          id="frosted-scroll-to-top-btn"
          initial={{ opacity: 0, scale: 0.9, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 8 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={scrollToTop}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="fixed bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-40 group cursor-pointer select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-white/10"
          aria-label="Scroll back to top"
        >
          {/* Ultra-subtle Rim & Faint Ambient Shadow */}
          <div className="relative p-[1px] rounded-full bg-gradient-to-b from-white/[0.08] via-white/[0.02] to-transparent transition-all duration-300 group-hover:from-white/20 group-hover:via-white/[0.05] group-hover:to-transparent shadow-[0_4px_16px_rgba(0,0,0,0.25)] group-hover:shadow-[0_6px_20px_rgba(0,0,0,0.4)] transform group-hover:scale-[1.02] active:scale-95">
            
            {/* Minimal Whisper Glass Core */}
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.03] backdrop-blur-sm group-hover:bg-white/[0.07] transition-all duration-300 flex items-center justify-center overflow-hidden border border-white/[0.04] group-hover:border-white/[0.08]">
              
              {/* Soft Specular Arc Light Catch */}
              <div 
                className="absolute top-0 inset-x-0 h-1/2 rounded-t-full bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-300" 
                aria-hidden="true"
              />

              {/* Barely-there Brand Tint Reflex */}
              <div 
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FF4D1A]/[0.01] via-transparent to-[#7C3AED]/[0.015] pointer-events-none group-hover:from-[#FF4D1A]/[0.03] group-hover:to-[#7C3AED]/[0.04] transition-colors duration-300"
                aria-hidden="true"
              />

              {/* Soft Semi-Translucent Chevron Icon */}
              <ChevronUp 
                className="relative z-10 w-3.5 h-3.5 text-white/30 group-hover:text-white/70 transition-all duration-200 stroke-[1.5] transform group-hover:-translate-y-0.5" 
              />
            </div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
