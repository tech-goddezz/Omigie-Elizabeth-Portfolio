import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PreloaderProps {
  onComplete: () => void;
  onPortalStart?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete, onPortalStart }) => {
  // Stages:
  // 1. 'spin': Minimal two-bar icon centered and rotating (0.0s - 0.9s)
  // 2. 'reveal': Icon anchors left and reveals letters "Litz" in sequence (0.9s - 2.1s)
  // 3. 'portal': Seamless continuous unmasking into homepage (2.1s - 3.0s)
  const [stage, setStage] = useState<'spin' | 'reveal' | 'portal'>('spin');
  const [shouldRender, setShouldRender] = useState<boolean>(true);
  const onCompleteRef = useRef(onComplete);
  const onPortalStartRef = useRef(onPortalStart);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    onPortalStartRef.current = onPortalStart;
  }, [onPortalStart]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isReduced) {
        onPortalStartRef.current?.();
        onCompleteRef.current?.();
        setShouldRender(false);
        return;
      }
    }

    // Step 1: Icon spins in center -> glides left & reveals letters
    const t1 = setTimeout(() => {
      setStage('reveal');
    }, 900);

    // Step 2: Full "Litz" lockup assembled -> initiates continuous homepage reveal
    const t2 = setTimeout(() => {
      setStage('portal');
      onPortalStartRef.current?.();
    }, 2100);

    // Step 3: Transition finishes smoothly -> unmounts preloader from DOM
    const t3 = setTimeout(() => {
      onPortalStartRef.current?.();
      onCompleteRef.current?.();
      setShouldRender(false);
    }, 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (!shouldRender) return null;

  // Ultra-smooth, high-end motion easing curve
  const brandEase = [0.22, 1, 0.36, 1] as const;

  // Letters of "Litz" with tuned stagger delays
  const letterList = [
    { char: 'L', delay: 0.06 },
    { char: 'i', delay: 0.16 },
    { char: 't', delay: 0.26 },
    { char: 'z', delay: 0.36 },
  ];

  return (
    <AnimatePresence>
      <motion.div
        key="litz-intro-container"
        initial={{ opacity: 1 }}
        animate={
          stage === 'portal'
            ? {
                opacity: 0,
                scale: 1.08,
                pointerEvents: 'none',
              }
            : {
                opacity: 1,
                scale: 1,
                pointerEvents: 'auto',
              }
        }
        exit={{ opacity: 0, scale: 1.08 }}
        transition={{ duration: 0.85, ease: brandEase }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          backgroundColor: '#0A0A0D',
        }}
        className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden select-none"
      >
        {/* Solid Pure Dark Backing */}
        <div
          aria-hidden="true"
          style={{ backgroundColor: '#0A0A0D' }}
          className="absolute inset-0 z-0 pointer-events-none"
        />

        {/* Central Litz Brand Lockup */}
        <motion.div
          animate={
            stage === 'portal'
              ? {
                  scale: 1.2,
                  opacity: 0,
                  y: -16,
                }
              : {
                  scale: 1,
                  opacity: 1,
                  y: 0,
                }
          }
          transition={{ duration: 0.8, ease: brandEase }}
          className="relative z-10 flex items-center justify-center"
        >
          {/* Logo Mark */}
          <motion.div
            initial={{ x: 0 }}
            className="relative flex items-center justify-center shrink-0 mr-3 sm:mr-4"
          >
            {stage === 'spin' ? (
              // Initial Spinning Two-Bar Mark
              <motion.div
                key="spinning-mark"
                initial={{ rotate: 0, scale: 0.9 }}
                animate={{
                  rotate: 360,
                  scale: [0.9, 1.04, 0.96],
                }}
                transition={{
                  rotate: { duration: 0.9, ease: [0.4, 0, 0.2, 1] },
                  scale: { duration: 0.9, ease: 'easeInOut' },
                }}
                className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-between"
              >
                <motion.div
                  animate={{
                    height: ['20px', '30px', '24px'],
                    y: [-3, 3, 0],
                  }}
                  transition={{ duration: 0.9, ease: 'easeInOut' }}
                  className="w-2.5 sm:w-3 rounded-full bg-[#FF4D1A]"
                />
                <motion.div
                  animate={{
                    height: ['30px', '20px', '26px'],
                    y: [3, -3, 0],
                  }}
                  transition={{ duration: 0.9, ease: 'easeInOut' }}
                  className="w-2.5 sm:w-3 rounded-full bg-white"
                />
              </motion.div>
            ) : (
              // Resolved Brand Polygon Emblem
              <motion.div
                key="resolved-emblem"
                initial={{ scale: 0.7, rotate: -25, opacity: 0 }}
                animate={{ scale: 1, rotate: -6, opacity: 1 }}
                transition={{ duration: 0.45, ease: brandEase }}
                className="grid grid-cols-2 gap-0.5 w-7 h-7 sm:w-8 sm:h-8"
              >
                <div className="bg-[#FF3B00] rounded-tl-[2px] rounded-br-[2px]" />
                <div className="bg-[#FF5500] rounded-tr-[2px] rounded-bl-[2px]" />
                <div className="bg-[#FF2E00] rounded-tr-[2px] rounded-bl-[2px]" />
                <div className="bg-[#FF6600] rounded-br-[2px] rounded-tl-[2px]" />
              </motion.div>
            )}
          </motion.div>

          {/* Letter Reveal Mask Container */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={
              stage !== 'spin'
                ? { width: 'auto', opacity: 1 }
                : { width: 0, opacity: 0 }
            }
            transition={{
              duration: 0.75,
              ease: brandEase,
            }}
            className="overflow-hidden flex items-baseline"
          >
            <div className="flex items-baseline font-bold tracking-tight text-white select-none text-4xl sm:text-5xl md:text-6xl font-sans">
              {letterList.map((item) => (
                <motion.span
                  key={item.char}
                  initial={{
                    opacity: 0,
                    x: -20,
                    filter: 'blur(3px)',
                  }}
                  animate={
                    stage !== 'spin'
                      ? {
                          opacity: 1,
                          x: 0,
                          filter: 'blur(0px)',
                        }
                      : {
                          opacity: 0,
                          x: -20,
                          filter: 'blur(3px)',
                        }
                  }
                  transition={{
                    duration: 0.55,
                    delay: stage !== 'spin' ? item.delay : 0,
                    ease: brandEase,
                  }}
                  className="inline-block"
                >
                  {item.char}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
