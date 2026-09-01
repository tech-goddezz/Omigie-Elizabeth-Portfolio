import { useReducedMotion } from 'motion/react';

/**
 * Shared hook for scroll-triggered entrance animations.
 * Provides opacity: 0 -> 1, translateY: 24px -> 0 over 500-600ms,
 * with stagger delays for cards and once: true viewport triggering.
 * Respects prefers-reduced-motion: reduce by using instant/quick simple fades with no movement.
 */
export const useScrollAnimation = () => {
  const shouldReduceMotion = useReducedMotion();

  const getFadeUp = (delay = 0, yOffset = 24, duration = 0.55) => {
    if (shouldReduceMotion) {
      return {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true, margin: '-30px' },
        transition: { duration: 0.25, delay: 0 },
      };
    }

    return {
      initial: { opacity: 0, y: yOffset },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: '-30px' },
      transition: { duration, delay, ease: [0.25, 0.1, 0.25, 1.0] as const },
    };
  };

  return { shouldReduceMotion, getFadeUp };
};
