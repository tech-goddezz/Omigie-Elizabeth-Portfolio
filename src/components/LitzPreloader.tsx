import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import gsap from 'gsap';

interface LitzPreloaderProps {
  onComplete: () => void;
  onStartReveal?: () => void;
}

export const LitzPreloader: React.FC<LitzPreloaderProps> = ({
  onComplete,
  onStartReveal,
}) => {
  const [phase, setPhase] = useState<'loading' | 'stabilized' | 'revealing' | 'done'>('loading');
  const [activeLetterCount, setActiveLetterCount] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for prefers-reduced-motion or returning visitor in current session
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasSeenIntro = sessionStorage.getItem('litz_intro_seen') === 'true';

    if (isReducedMotion || hasSeenIntro) {
      // Fast path for returning users or reduced motion
      sessionStorage.setItem('litz_intro_seen', 'true');
      onStartReveal?.();
      onComplete();
      setPhase('done');
      return;
    }

    sessionStorage.setItem('litz_intro_seen', 'true');

    // Stagger letter reveals (L -> Li -> Lit -> Litz)
    const letterTimers = [
      setTimeout(() => setActiveLetterCount(1), 120),  // 'L'
      setTimeout(() => setActiveLetterCount(2), 520),  // 'Li'
      setTimeout(() => setActiveLetterCount(3), 920),  // 'Lit'
      setTimeout(() => setActiveLetterCount(4), 1320), // 'Litz'
    ];

    // Transition to stabilized state
    const stabilizeTimer = setTimeout(() => {
      setPhase('stabilized');
    }, 1650);

    // Transition to reveal state
    const revealTimer = setTimeout(() => {
      setPhase('revealing');
      onStartReveal?.();
    }, 2250);

    // Complete intro
    const completeTimer = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 2850);

    // Fallback safety timer to ensure user is NEVER stuck
    const safetyTimer = setTimeout(() => {
      onStartReveal?.();
      onComplete();
      setPhase('done');
    }, 3800);

    return () => {
      letterTimers.forEach(clearTimeout);
      clearTimeout(stabilizeTimer);
      clearTimeout(revealTimer);
      clearTimeout(completeTimer);
      clearTimeout(safetyTimer);
    };
  }, [onComplete, onStartReveal]);

  // GSAP 3D depth and chromatic flare enhancement on the wordmark
  useEffect(() => {
    if (phase === 'done') return;

    const ctx = gsap.context(() => {
      if (wordmarkRef.current) {
        gsap.fromTo(
          wordmarkRef.current,
          {
            transformPerspective: 1200,
            rotationX: 8,
            rotationY: -6,
            scale: 0.94,
          },
          {
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            duration: 2.2,
            ease: 'power3.out',
          }
        );
      }

      if (lightRef.current) {
        gsap.to(lightRef.current, {
          x: '160%',
          duration: 1.8,
          repeat: -1,
          ease: 'power2.inOut',
          yoyo: true,
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [phase]);

  if (phase === 'done') return null;

  const letters = [
    { char: 'L', width: 'auto', delay: 0.1 },
    { char: 'i', width: 'auto', delay: 0.5 },
    { char: 't', width: 'auto', delay: 0.9 },
    { char: 'z', width: 'auto', delay: 1.3 },
  ];

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 1 }}
        animate={{
          opacity: phase === 'revealing' ? 0 : 1,
          scale: phase === 'revealing' ? 1.06 : 1,
          filter: phase === 'revealing' ? 'blur(12px)' : 'blur(0px)',
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0A0A0D] overflow-hidden select-none pointer-events-none"
      >
        {/* Subtle Ambient Radial Glows in Preloader matching the brand colors */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] sm:w-[650px] sm:h-[650px] bg-gradient-to-tr from-[#7C3AED]/20 via-[#FF4D1A]/15 to-transparent rounded-full blur-3xl opacity-60 animate-pulse duration-1000" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,13,0.85)_100%)]" />
        </div>

        {/* Ambient Grid Accent Lines */}
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* Center Container */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          
          {/* Main Cinematic Wordmark */}
          <div
            ref={wordmarkRef}
            className="relative flex items-baseline tracking-[-0.03em] px-8 py-4"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Ambient Shimmer Beam across word */}
            <div
              ref={lightRef}
              className="absolute -left-1/2 top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none blur-sm opacity-70"
            />

            {/* Individual Letter Construction */}
            {letters.map((item, index) => {
              const isVisible = activeLetterCount > index;
              return (
                <div
                  key={index}
                  className="relative inline-flex items-center justify-center font-extrabold text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white font-sans tracking-tight select-none"
                  style={{
                    perspective: '800px',
                  }}
                >
                  <motion.span
                    initial={{
                      opacity: 0,
                      y: 35,
                      scale: 1.35,
                      rotateX: -45,
                      rotateY: 20,
                      filter: 'blur(10px)',
                    }}
                    animate={
                      isVisible
                        ? {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            rotateX: 0,
                            rotateY: 0,
                            filter: 'blur(0px)',
                          }
                        : {}
                    }
                    transition={{
                      duration: 0.45,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`inline-block transition-colors duration-300 ${
                      index === 0
                        ? 'text-white drop-shadow-[0_0_25px_rgba(124,58,237,0.6)]'
                        : index === 3
                        ? 'text-white drop-shadow-[0_0_25px_rgba(255,77,26,0.6)]'
                        : 'text-zinc-100 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                    }`}
                  >
                    {item.char}
                  </motion.span>
                </div>
              );
            })}

            {/* Glowing Accent Period Dot */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={
                activeLetterCount >= 4
                  ? { scale: [0, 1.4, 1], opacity: 1 }
                  : { scale: 0, opacity: 0 }
              }
              transition={{ duration: 0.35, delay: 0.1 }}
              className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#FF4D1A] ml-1.5 shadow-[0_0_15px_#FF4D1A]"
            />
          </div>

          {/* Subtitle / Brand Signature Pill */}
          <motion.div
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={
              activeLetterCount >= 4
                ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                : { opacity: 0, y: 10 }
            }
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex items-center gap-2.5 mt-4 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D1A] animate-ping" />
            <span className="text-[11px] sm:text-xs tracking-[0.25em] uppercase text-zinc-400 font-medium">
              PORTFOLIO EXPERIENCE
            </span>
          </motion.div>
        </div>

        {/* Bottom Cinematic Loading Progress Bar */}
        <div className="absolute bottom-10 inset-x-12 sm:inset-x-24 md:inset-x-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{
              width:
                activeLetterCount === 0
                  ? '0%'
                  : activeLetterCount === 1
                  ? '25%'
                  : activeLetterCount === 2
                  ? '50%'
                  : activeLetterCount === 3
                  ? '75%'
                  : '100%',
            }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-[#7C3AED] via-purple-400 to-[#FF4D1A] shadow-[0_0_12px_#7C3AED]"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
