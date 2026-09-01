import { useRef, useState, useEffect } from 'react';
import { useScroll, useSpring } from 'motion/react';
import { JourneyCheckpoint, JourneyDeviceConfig, CheckpointPhase } from './types';
import { getActiveCheckpoint, evaluateCheckpointState } from './curve';

export interface UseJourneyControllerReturn<T = unknown> {
  containerRef: React.RefObject<HTMLElement | null>;
  scrollProgressRef: React.MutableRefObject<number>;
  activeCheckpoint: JourneyCheckpoint<T>;
  activePhase: CheckpointPhase;
  activeCheckpointIndex: number;
  isInView: boolean;
  isTabVisible: boolean;
  isJourneyActive: boolean;
  prefersReducedMotion: boolean;
  containerClassName: string;
  viewportClassName: string;
}

const DEFAULT_CONFIG: JourneyDeviceConfig = {
  desktopHeightVh: 600,
  tabletHeightVh: 420,
  mobileHeightVh: 320,
  springStiffness: 55,
  springDamping: 18,
  cameraLerpFactor: 0.09,
  dwellDeceleration: 0.35,
};

export function useJourneyController<T = unknown>(
  checkpoints: JourneyCheckpoint<T>[],
  config: Partial<JourneyDeviceConfig> = {},
  onActiveCheckpointChange?: (checkpoint: JourneyCheckpoint<T>) => void
): UseJourneyControllerReturn<T> {
  const finalConfig: JourneyDeviceConfig = { ...DEFAULT_CONFIG, ...config };
  const containerRef = useRef<HTMLElement | null>(null);
  const scrollProgressRef = useRef<number>(0);
  const activeCheckpointIdRef = useRef<string>(checkpoints[0]?.id || '');
  const activePhaseRef = useRef<CheckpointPhase>('approach');

  const [activeCheckpoint, setActiveCheckpoint] = useState<JourneyCheckpoint<T>>(checkpoints[0]);
  const [activePhase, setActivePhase] = useState<CheckpointPhase>('approach');
  const [isInView, setIsInView] = useState<boolean>(false);
  const [isTabVisible, setIsTabVisible] = useState<boolean>(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // Framer Motion native scroll binding
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: finalConfig.springStiffness,
    damping: finalConfig.springDamping,
    restDelta: 0.001,
  });

  // Keep non-reactive animation ref updated at full frame-rate without React state overhead
  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (latest) => {
      scrollProgressRef.current = latest;

      // Check for discrete checkpoint & phase transitions
      const currentActive = getActiveCheckpoint(latest, checkpoints);
      const state = evaluateCheckpointState(latest, currentActive);

      if (currentActive.id !== activeCheckpointIdRef.current) {
        activeCheckpointIdRef.current = currentActive.id;
        setActiveCheckpoint(currentActive);
        if (onActiveCheckpointChange) {
          onActiveCheckpointChange(currentActive);
        }
      }

      if (state.phase !== activePhaseRef.current) {
        activePhaseRef.current = state.phase;
        setActivePhase(state.phase);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [smoothProgress, checkpoints, onActiveCheckpointChange]);

  // Reduced motion media query listener
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleMotionChange);
    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  // Viewport intersection observer & tab visibility
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: '150px 0px', threshold: 0.01 }
    );
    observer.observe(el);

    const handleVisibility = () => {
      setIsTabVisible(document.visibilityState !== 'hidden');
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const activeCheckpointIndex = Math.max(
    0,
    checkpoints.findIndex((cp) => cp.id === activeCheckpoint.id)
  );

  const isJourneyActive = isInView && isTabVisible;

  // Responsive class string mapping according to device-height configuration
  const containerClassName = `relative w-full h-[${finalConfig.mobileHeightVh}vh] sm:h-[${finalConfig.tabletHeightVh}vh] md:h-[${finalConfig.desktopHeightVh}vh] bg-[#0A0A0D] text-white select-none overflow-clip`;
  const viewportClassName = 'sticky top-0 h-[100svh] min-h-[100svh] w-full flex flex-col justify-between overflow-hidden';

  return {
    containerRef,
    scrollProgressRef,
    activeCheckpoint,
    activePhase,
    activeCheckpointIndex,
    isInView,
    isTabVisible,
    isJourneyActive,
    prefersReducedMotion,
    containerClassName,
    viewportClassName,
  };
}
