import React, { useRef, useEffect } from 'react';
import { ArrowRight, Download, Youtube, Github, Linkedin, Twitter, MessageCircle } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { optimizeCloudinaryUrl } from '../utils/cloudinary';

interface HeroSectionProps {
  onStartProject: () => void;
  onViewPortfolio: () => void;
  onDownloadCV?: () => void;
  isRevealed?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartProject,
  onViewPortfolio,
  onDownloadCV,
  isRevealed = true,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const smoothEase = [0.16, 1, 0.3, 1] as const;

  // Cloudinary optimized hero video URLs: auto-format, auto-quality, responsive dimensions
  const baseHeroVideoUrl =
    'https://res.cloudinary.com/eltckiww/video/upload/v1785765451/kling_20260802_VIDEO_Cinematic__1324_0_ymj9qx.mp4';
  const desktopHeroVideo = optimizeCloudinaryUrl(baseHeroVideoUrl, {
    width: 1280,
    videoCodec: 'auto',
  });
  const mobileHeroVideo = optimizeCloudinaryUrl(baseHeroVideoUrl, {
    width: 720,
    videoCodec: 'auto',
  });
  const heroPosterUrl = optimizeCloudinaryUrl(
    'https://res.cloudinary.com/eltckiww/video/upload/v1785765451/kling_20260802_VIDEO_Cinematic__1324_0_ymj9qx.jpg',
    { width: 1280 }
  );

  // Guarantee continuous video autoplay across all browsers and iframe preview environments
  useEffect(() => {
    const videos = containerRef.current?.querySelectorAll('video');
    if (!videos || videos.length === 0) return;

    const attemptPlay = () => {
      videos.forEach((video) => {
        if (video && video.paused) {
          video.defaultMuted = true;
          video.muted = true;
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Autoplay blocked by browser policy until interaction
            });
          }
        }
      });
    };

    attemptPlay();

    const events = ['loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough', 'playing', 'pause'];
    const handleVideoEvent = () => attemptPlay();
    videos.forEach((video) => {
      events.forEach((evt) => video.addEventListener(evt, handleVideoEvent));
    });

    const handleInteraction = () => {
      attemptPlay();
    };

    window.addEventListener('click', handleInteraction, { passive: true });
    window.addEventListener('touchstart', handleInteraction, { passive: true });
    window.addEventListener('scroll', handleInteraction, { passive: true });

    return () => {
      videos.forEach((video) => {
        events.forEach((evt) => video.removeEventListener(evt, handleVideoEvent));
      });
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
    };
  }, []);

  // Track scroll progress through and past the hero section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Character graceful recession into 3D background as user scrolls
  const characterScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.92, 0.82]);
  const characterY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const characterOpacity = useTransform(scrollYProgress, [0, 0.35, 0.75, 1], [1, 0.95, 0.5, 0.1]);
  const characterBlur = useTransform(scrollYProgress, [0, 0.4, 1], ['blur(0px)', 'blur(1.5px)', 'blur(6px)']);

  // Foreground text content smooth upward parallax exit
  const contentY = useTransform(scrollYProgress, [0, 0.8], ['0px', '-40px']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.15]);

  return (
    <section
      ref={containerRef}
      id="home"
      aria-label="Hero Introduction"
      className="hero-full-height relative w-full min-h-[100vh] min-h-[100svh] lg:h-screen lg:min-h-screen lg:max-h-screen flex flex-col justify-start lg:justify-center -mt-[60px] pt-[76px] sm:pt-[84px] lg:pt-[60px] pb-12 sm:pb-16 lg:pb-0 overflow-hidden"
    >
      {/* Background Character Video Layer – Contained full bleed layer behind content */}
      <motion.div
        style={{
          scale: characterScale,
          y: characterY,
          opacity: characterOpacity,
          filter: characterBlur,
        }}
        initial={{ scale: 1.08, opacity: 0.5 }}
        animate={isRevealed ? { scale: 1, opacity: 1 } : { scale: 1.08, opacity: 0.5 }}
        transition={{ duration: 1.25, ease: smoothEase }}
        className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden select-none flex items-center justify-center will-change-transform"
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={heroPosterUrl}
          crossOrigin="anonymous"
          width={1920}
          height={1080}
          aria-hidden="true"
          style={{ filter: 'brightness(0.9) saturate(0.92)' }}
          className="w-full h-full min-w-full min-h-full object-cover object-center md:object-[78%_center] lg:object-[85%_center] xl:object-[90%_center] 2xl:object-[92%_center] md:translate-x-[8%] lg:translate-x-[15%] xl:translate-x-[20%] 2xl:translate-x-[22%] pointer-events-none transition-transform duration-500"
        >
          {/* Responsive media sources: mobile pulls w_720, desktop pulls w_1280 with f_auto/q_auto */}
          <source
            media="(max-width: 768px)"
            src={mobileHeroVideo}
            type="video/mp4"
          />
          <source
            src={desktopHeroVideo}
            type="video/mp4"
          />
        </video>
        {/* Subtle Backdrop Dimming Overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/20 to-black/35 pointer-events-none"
        />
      </motion.div>

      {/* Atmospheric Bottom Gradient Transition into network environment */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none z-0 bg-gradient-to-t from-[#0A0A0D] via-[#0A0A0D]/60 to-transparent select-none"
      />

      {/* Subtle directional text readability gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(ellipse_80%_65%_at_10%_25%,rgba(5,5,10,0.50)_0%,rgba(5,5,10,0.20)_55%,transparent_100%)] sm:bg-[radial-gradient(ellipse_65%_70%_at_20%_35%,rgba(5,5,10,0.45)_0%,rgba(5,5,10,0.15)_60%,transparent_100%)] lg:bg-[radial-gradient(ellipse_60%_75%_at_25%_45%,rgba(5,5,10,0.65)_0%,rgba(5,5,10,0.25)_65%,transparent_100%)]"
      />

      {/* Foreground Hero Content – Responsive Layout on Desktop */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-20 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto w-full pt-1 sm:pt-2 flex-1 lg:flex-initial flex flex-col justify-between lg:justify-center"
      >
        {/* Text & CTAs (Vertically Centered on Desktop) */}
        <div className="flex flex-col max-w-2xl flex-1 lg:flex-initial justify-between lg:justify-center lg:py-4">
          <div>
            {/* 1. Availability Status Pill */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.65, delay: 0.18, ease: smoothEase }}
              className="w-fit mb-3 sm:mb-3.5"
            >
              <div
                id="hero-availability-pill"
                className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A0812]/75 border border-[#7C3AED]/25 hover:border-[#FF7A00]/35 backdrop-blur-md shadow-[0_0_15px_rgba(124,58,237,0.12),0_2px_8px_rgba(0,0,0,0.5)] transition-all duration-300 select-none max-w-full"
              >
                <motion.span
                  animate={{
                    boxShadow: [
                      '0 0 4px #FF7A00, 0 0 8px rgba(255,122,0,0.35)',
                      '0 0 7px #FF7A00, 0 0 14px rgba(255,122,0,0.7)',
                      '0 0 4px #FF7A00, 0 0 8px rgba(255,122,0,0.35)',
                    ],
                    opacity: [0.85, 1, 0.85],
                  }}
                  transition={{
                    duration: 3.0,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] shrink-0"
                />
                <span className="text-[11.5px] sm:text-[12.5px] font-medium text-zinc-200 tracking-wide">
                  Available for New Opportunities
                </span>
              </div>
            </motion.div>

            {/* 2. Role Tag with Accent Line */}
            <motion.div
              initial={{ opacity: 0, y: 18, clipPath: 'inset(0% 100% 0% 0%)' }}
              animate={
                isRevealed
                  ? { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)' }
                  : { opacity: 0, y: 18, clipPath: 'inset(0% 100% 0% 0%)' }
              }
              transition={{ duration: 0.75, delay: 0.26, ease: smoothEase }}
              className="flex items-center gap-3 w-fit mt-2 sm:mt-2.5"
            >
              <span className="w-8 sm:w-11 h-[2px] bg-[#FF4D1A] shrink-0 shadow-[0_0_8px_rgba(255,77,26,0.5)]" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 leading-[1.3]">
                <span
                  style={{ fontSize: '13px', letterSpacing: '2.2px', fontWeight: 800 }}
                  className="uppercase text-[#EDECE9] drop-shadow-sm whitespace-nowrap"
                >
                  AI PRODUCT ENGINEER
                </span>
                <span className="hidden sm:inline text-[#D6D4CF] font-bold select-none">•</span>
                <span
                  style={{ fontSize: '13px', letterSpacing: '2.2px', fontWeight: 800 }}
                  className="uppercase text-[#D6D4CF] drop-shadow-sm whitespace-nowrap"
                >
                  FRONTEND DEVELOPER
                </span>
              </div>
            </motion.div>

            {/* 3. Main Name Title */}
            <div className="overflow-hidden" style={{ marginTop: '8px' }}>
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.85, delay: 0.34, ease: smoothEase }}
                className="text-[42px] lg:text-[68px] xl:text-[78px] font-medium leading-[1.04] tracking-tight text-white drop-shadow-md flex flex-wrap items-baseline gap-2.5 lg:gap-3.5"
              >
                <span>OMIGIE</span>{' '}
                <span
                  className="font-serif-italic text-[#FF4D1A] tracking-normal"
                >
                  ELIZABETH
                </span>
              </motion.h1>
            </div>

            {/* 4. Subtitle / Main Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.75, delay: 0.42, ease: smoothEase }}
              className="text-[15px] sm:text-[17px] md:text-[18px] font-bold mt-3.5 uppercase tracking-[0.06em] sm:tracking-[0.10em] text-white drop-shadow-sm max-w-xl leading-snug"
            >
              BUILDING DIGITAL EXPERIENCES WITH AI AT THE CORE
            </motion.h2>

            {/* 5. Description Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.75, delay: 0.50, ease: smoothEase }}
              style={{ fontSize: '16px', fontWeight: 400, lineHeight: 1.5, marginTop: '16px' }}
              className="text-zinc-200 max-w-xl drop-shadow-sm"
            >
              I build fast, thoughtful frontends and AI-powered product experiences - from Figma to shipped code.
            </motion.p>

            {/* 6. Social Icons Row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.65, delay: 0.58, ease: smoothEase }}
              style={{ marginTop: '20px' }}
              className="flex items-center gap-4 text-zinc-300"
            >
              <motion.a
                whileHover={{ scale: 1.1, color: '#FF4D1A' }}
                whileTap={{ scale: 1.1, color: '#FF4D1A' }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                href="https://github.com/tech-goddezz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-300 hover:text-[#FF4D1A] active:text-[#FF4D1A] transition-colors duration-200 flex items-center justify-center min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 -m-3 sm:m-0 rounded-lg focus-visible:ring-2 focus-visible:ring-[#FF4D1A] focus-visible:outline-none"
                aria-label="Visit Elizabeth's GitHub profile"
              >
                <Github className="w-4 h-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, color: '#FF4D1A' }}
                whileTap={{ scale: 1.1, color: '#FF4D1A' }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                href="https://www.linkedin.com/in/elizabethomigie"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-300 hover:text-[#FF4D1A] active:text-[#FF4D1A] transition-colors duration-200 flex items-center justify-center min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 -m-3 sm:m-0 rounded-lg focus-visible:ring-2 focus-visible:ring-[#FF4D1A] focus-visible:outline-none"
                aria-label="Visit Elizabeth's LinkedIn profile"
              >
                <Linkedin className="w-4 h-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, color: '#FF4D1A' }}
                whileTap={{ scale: 1.1, color: '#FF4D1A' }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                href="https://x.com/real_litz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-300 hover:text-[#FF4D1A] active:text-[#FF4D1A] transition-colors duration-200 flex items-center justify-center min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 -m-3 sm:m-0 rounded-lg focus-visible:ring-2 focus-visible:ring-[#FF4D1A] focus-visible:outline-none"
                aria-label="Visit Elizabeth's X (Twitter) profile"
              >
                <Twitter className="w-4 h-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, color: '#FF4D1A' }}
                whileTap={{ scale: 1.1, color: '#FF4D1A' }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                href="https://youtube.com/@build_with_litz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-300 hover:text-[#FF4D1A] active:text-[#FF4D1A] transition-colors duration-200 flex items-center justify-center min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 -m-3 sm:m-0 rounded-lg focus-visible:ring-2 focus-visible:ring-[#FF4D1A] focus-visible:outline-none"
                aria-label="Visit Elizabeth's YouTube channel"
              >
                <Youtube className="w-4 h-4" />
              </motion.a>
              <motion.a
                whileHover={{
                  scale: 1.1,
                  color: '#25D366',
                  filter: 'drop-shadow(0 0 8px rgba(37, 211, 102, 0.35))',
                }}
                whileTap={{
                  scale: 1.1,
                  color: '#25D366',
                  filter: 'drop-shadow(0 0 8px rgba(37, 211, 102, 0.35))',
                }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                href="https://wa.me/2348082817092"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-300 hover:text-[#25D366] active:text-[#25D366] transition-colors duration-200 flex items-center justify-center min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 -m-3 sm:m-0 rounded-lg focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:outline-none"
                aria-label="Chat directly on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </motion.a>
            </motion.div>
          </div>

          {/* Bottom Actions & Credibility Block */}
          <div className="mt-8 sm:mt-10 lg:mt-8 flex flex-col gap-4 sm:gap-5">
            {/* 7. Action Buttons (View My Work & Download CV) */}
            <div className="flex flex-col sm:flex-row gap-3.5 w-fit min-w-[210px]">
              <motion.button
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={isRevealed ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.96 }}
                transition={{ duration: 0.75, delay: 0.60, ease: smoothEase }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onViewPortfolio}
                className="group bg-gradient-to-r from-[#6344F5] via-[#703DE8] to-[#7928CA] hover:brightness-110 text-white font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-2xl flex items-center justify-between gap-3 transition-all shadow-lg shadow-purple-950/60 cursor-pointer min-h-[48px] w-full sm:w-auto focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none"
              >
                <span>View My Work</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              {/* CV Button (Download CV) */}
              <motion.button
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={isRevealed ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.96 }}
                transition={{ duration: 0.75, delay: 0.66, ease: smoothEase }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onDownloadCV || onStartProject}
                className="bg-black/60 hover:bg-black/80 text-white border border-white/20 font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-2xl flex items-center justify-between gap-3 transition-all cursor-pointer min-h-[48px] backdrop-blur-md w-full sm:w-auto focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
              >
                <span>Download CV</span>
                <Download className="w-4 h-4 text-zinc-300" />
              </motion.button>
            </div>

            {/* 8. 4+ Years Building Row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.7, delay: 0.72, ease: smoothEase }}
              whileHover={{ scale: 1.03 }}
              className="flex items-center gap-3 w-fit cursor-default pt-2 pb-1"
            >
              <div className="flex -space-x-2">
                {/* React */}
                <div
                  title="React"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-black bg-[#0A101D] flex items-center justify-center shrink-0 shadow-sm"
                >
                  <svg
                    viewBox="-11.5 -10.23174 23 20.46348"
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#61DAFB] fill-none stroke-current"
                    strokeWidth="1.2"
                  >
                    <circle cx="0" cy="0" r="2.05" fill="currentColor" stroke="none" />
                    <g stroke="currentColor">
                      <ellipse rx="11" ry="4.2" />
                      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
                    </g>
                  </svg>
                </div>

                {/* TypeScript */}
                <div
                  title="TypeScript"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-black bg-[#3178C6] flex items-center justify-center shrink-0 shadow-sm"
                >
                  <span className="font-sans font-black text-[9px] sm:text-[10px] text-white tracking-tight leading-none">
                    TS
                  </span>
                </div>

                {/* Figma */}
                <div
                  title="Figma"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-black bg-[#18181B] flex items-center justify-center shrink-0 shadow-sm"
                >
                  <svg viewBox="0 0 38 57" className="w-3 h-3 sm:w-3.5 sm:h-3.5">
                    <path d="M19 28.5A9.5 9.5 0 1 1 28.5 19 9.5 9.5 0 0 1 19 28.5z" fill="#1ABCFE" />
                    <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
                    <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19z" fill="#FF7262" />
                    <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
                    <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
                  </svg>
                </div>
              </div>
              <div className="text-[12px] leading-tight">
                <div className="font-bold text-white">4+ Years Building</div>
                <div className="text-zinc-400 font-normal text-[11px]">Self-Taught to Shipped</div>
              </div>
            </motion.div>
          </div>

        </div>

      </motion.div>
    </section>
  );
};

