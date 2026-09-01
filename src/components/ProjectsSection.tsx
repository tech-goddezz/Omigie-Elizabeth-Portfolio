import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollAnimation } from '../utils/motion';
import { ProjectMediaFrame } from './ProjectMediaFrame';

gsap.registerPlugin(ScrollTrigger);

export interface ProjectItem {
  id: number;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  accent: 'violet' | 'orange';
  description: string;
  tags: string[];
  image: string;
  poster?: string;
  video?: string;
  frameType?: 'browser' | 'phone';
  liveUrl: string;
}

interface ProjectCardProps {
  project: ProjectItem;
  onClick?: () => void;
  cardRef: (el: HTMLDivElement | null) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onClick,
  cardRef,
}) => {
  const handleCardClick = () => {
    if (project.liveUrl) {
      window.open(project.liveUrl, '_blank', 'noopener,noreferrer');
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div
      ref={cardRef}
      className="w-[92vw] max-w-[1100px] sm:w-full sm:max-w-none h-[78vh] sm:h-[420px] md:h-[410px] lg:h-[390px] xl:h-[415px] min-h-[520px] sm:min-h-0 mx-auto sm:mx-0 will-change-transform bg-[#0B0D14] rounded-2xl sm:rounded-2xl lg:rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.95)] flex flex-col"
    >
      <div
        onClick={handleCardClick}
        role="link"
        tabIndex={0}
        aria-label={`View live project: ${project.title} (${project.subtitle})`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
          }
        }}
        className="w-full h-full group rounded-2xl sm:rounded-2xl lg:rounded-2xl bg-[#0B0D14] border border-[#7C3AED]/25 hover:border-[#7C3AED]/50 transition-all duration-300 ease-out hover:scale-[1.01] active:scale-[0.99] shadow-[0_0_18px_rgba(124,58,237,0.10),0_12px_40px_rgba(0,0,0,0.85)] hover:shadow-[0_0_28px_rgba(124,58,237,0.2),0_20px_60px_rgba(0,0,0,0.95)] flex flex-col cursor-pointer relative overflow-hidden focus-visible:ring-2 focus-visible:ring-[#FF4D1A] focus-visible:outline-none"
      >
        {/* Soft Outer Diffuse Ambient Glow Aura */}
        <div className="absolute -inset-4 sm:-inset-6 rounded-[2.5rem] opacity-15 group-hover:opacity-30 blur-2xl pointer-events-none -z-10 transition-opacity duration-300 bg-[#7C3AED]/15" aria-hidden="true" />

        {/* Media Container – Full-bleed Edge-to-Edge Media with Top Corner Radius */}
        <div className="flex-1 min-h-[220px] sm:min-h-[180px] md:min-h-[175px] xl:min-h-[190px] relative w-full overflow-hidden bg-[#0B0D14]">
          <ProjectMediaFrame
            image={project.image}
            poster={project.poster}
            video={project.video}
            title={project.title}
            category={project.category}
            url={project.liveUrl}
          />

          {/* Category Pill Badge Overlaid on Image Top-Right */}
          <div className="absolute top-3.5 right-3.5 sm:top-3 sm:right-3 md:top-2.5 md:right-2.5 z-20 inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-2.5 sm:py-1 md:px-2.5 md:py-1 rounded-full bg-[#120F20]/90 backdrop-blur-md border border-[#7C3AED]/30 shadow-[0_0_10px_rgba(124,58,237,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-[#A855F7] shadow-[0_0_4px_#A855F7]" />
            <span className="text-[11px] sm:text-[10px] md:text-[10px] xl:text-[10.5px] font-semibold text-white tracking-wide">
              {project.category}
            </span>
          </div>
        </div>

        {/* Bottom Details Footer – 100% Solid Opaque Background */}
        <div className="shrink-0 relative z-10 p-5 sm:p-4 md:p-4 lg:p-3.5 xl:p-4 bg-[#0B0D14] border-t border-white/5">
          <div className="flex items-start justify-between">
            <div className="min-w-0 pr-2 sm:pr-3 md:pr-4">
              <h3 className="text-xl sm:text-lg md:text-xl lg:text-[15px] xl:text-base font-bold text-white tracking-tight group-hover:text-[#FF4D1A] transition-colors line-clamp-1">
                {project.title}
              </h3>
              <p className="text-xs sm:text-xs md:text-xs lg:text-[11.5px] xl:text-xs text-zinc-400 font-normal mt-1.5 sm:mt-1 md:mt-1 leading-snug line-clamp-2">
                {project.description}
              </p>
            </div>

            {/* Preserved Circular Arrow Button in Corner */}
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Open ${project.title} live application in a new tab`}
              className="shrink-0 ml-1.5 w-11 h-11 sm:w-8 sm:h-8 md:w-8 md:h-8 lg:w-8 lg:h-8 xl:w-8.5 xl:h-8.5 rounded-full bg-white/[0.04] border border-white/10 text-[#FF4D1A] group-hover:bg-[#FF4D1A]/10 group-hover:border-[#FF4D1A]/40 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shadow-[0_0_10px_rgba(255,77,26,0.1)] flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D1A] focus-visible:outline-none"
            >
              <ExternalLink className="w-4 h-4 sm:w-3.5 sm:h-3.5 md:w-3.5 md:h-3.5" aria-hidden="true" />
            </a>
          </div>

          {/* Tech-Stack Tag Chips – Translucent Filled Violet Tint with Matching Border & Soft Glow */}
          <div className="flex flex-wrap items-center gap-1.5 mt-4 sm:mt-2.5 md:mt-2.5 lg:mt-2.5 xl:mt-3">
            {project.tags.map((tag, tIdx) => (
              <span
                key={tIdx}
                className="px-3 py-1.5 sm:px-2 sm:py-0.5 md:px-2 md:py-0.5 xl:px-2.5 xl:py-1 rounded-md text-xs sm:text-[10.5px] md:text-[10px] xl:text-[11px] font-medium tracking-wide text-purple-200 bg-[#7C3AED]/15 border border-[#7C3AED]/25 hover:bg-[#7C3AED]/25 hover:border-[#7C3AED]/45 shadow-[0_0_5px_rgba(124,58,237,0.12)] transition-all"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProjectsSectionProps {
  onProjectClick: () => void;
  onViewAll?: () => void;
}

type ProjectFilter = 'All' | 'AI Products' | 'Frontend Engineering';

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  onProjectClick,
  onViewAll,
}) => {
  const { getFadeUp } = useScrollAnimation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardContainersRef = useRef<(HTMLDivElement | null)[]>([]);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>('All');

  const projects: ProjectItem[] = [
    {
      id: 1,
      number: '01',
      title: 'DevClarity',
      subtitle: 'AI Thinking Assistant',
      category: 'AI Product',
      accent: 'violet',
      description: 'An AI-powered thinking assistant that helps developers structure their approach before writing code - built on the Groq API with Llama 3.3, not just another code generator.',
      tags: ['React', 'TypeScript', 'Groq API', 'Vite'],
      image: '',
      poster: 'https://res.cloudinary.com/eltckiww/image/upload/f_auto,q_auto/v1787638296/file_00000000b7a8821093a060f0daf00ec5_drbbns.png',
      video: 'https://res.cloudinary.com/eltckiww/video/upload/f_auto,q_auto/v1787636084/lv_0_20260825062815_w9cgdc.mp4',
      liveUrl: 'https://dev-clarity-mv-git-0f5bdc-omigieelizabeth2018gmailcoms-projects.vercel.app/',
    },
    {
      id: 2,
      number: '02',
      title: 'GTCO GTWorld App',
      subtitle: 'Mobile Application',
      category: 'Frontend Engineering',
      accent: 'orange',
      description: 'A pixel-perfect mobile banking app clone built screen-by-screen from Figma, with a full KYC flow, transaction history, and biometric-secured transfers.',
      tags: ['React Native', 'Expo Router', 'Zustand', 'NativeWind'],
      image: '',
      poster: 'https://res.cloudinary.com/eltckiww/image/upload/f_auto,q_auto/v1787638301/file_000000006d1c81f489645c17654aa4f5_ji7zee.png',
      video: 'https://res.cloudinary.com/eltckiww/video/upload/f_auto,q_auto/v1787636076/lv_0_20260825055409_p86efa.mp4',
      liveUrl: 'https://gtbank-clone.onrender.com',
    },
    {
      id: 3,
      number: '03',
      title: 'Coalition Patient Dashboard',
      subtitle: 'Healthcare Dashboard',
      category: 'Frontend Engineering',
      accent: 'violet',
      description: 'Comprehensive medical dashboard tracking patient vital stats, diagnostic history, and health metrics with interactive charts.',
      tags: ['React', 'Chart.js', 'TypeScript', 'Tailwind CSS'],
      image: '',
      poster: 'https://res.cloudinary.com/eltckiww/image/upload/f_auto,q_auto/v1787638300/file_0000000031b881f4bf6538ecc069498b_yssaym.png',
      video: 'https://res.cloudinary.com/eltckiww/video/upload/f_auto,q_auto/v1787636071/lv_0_20260825053937_cuvf9p.mp4',
      liveUrl: 'https://dashboard-inky-chi.vercel.app/',
    },
    {
      id: 4,
      number: '04',
      title: 'Simple Mini Portfolio',
      subtitle: 'Personal Portfolio UI',
      category: 'Frontend Engineering',
      accent: 'orange',
      description: 'A clean, responsive mini portfolio showcasing technical projects, skillset hierarchy, and direct contact channels with refined animations.',
      tags: ['HTML5', 'CSS3', 'Flexbox', 'Responsive UI'],
      image: '',
      poster: 'https://res.cloudinary.com/eltckiww/image/upload/f_auto,q_auto/v1787638298/file_000000009ec882109918718f6534a4f9_nvxgep.png',
      video: 'https://res.cloudinary.com/eltckiww/video/upload/f_auto,q_auto/v1787636077/lv_0_20260825061727_jyzsrs.mp4',
      liveUrl: 'https://elizabeth-personal-website-six.vercel.app/',
    },
    {
      id: 5,
      number: '05',
      title: 'Testimonials Grid Section',
      subtitle: 'Complex Grid Layout',
      category: 'Frontend Engineering',
      accent: 'violet',
      description: 'Dynamic testimonial layout showcasing responsive asymmetric grid positioning and verified customer reviews.',
      tags: ['CSS Grid', 'Tailwind CSS', 'Responsive UI'],
      image: '',
      poster: 'https://res.cloudinary.com/eltckiww/image/upload/f_auto,q_auto/v1787638299/file_00000000420c8210b4eeb9dca36537eb_j6amfm.png',
      video: 'https://res.cloudinary.com/eltckiww/video/upload/f_auto,q_auto/v1787636071/lv_0_20260825061159_shqxes.mp4',
      liveUrl: 'https://testimonials-grid-section-umber.vercel.app/',
    },
    {
      id: 6,
      number: '06',
      title: 'Simple Omelette Recipe',
      subtitle: 'Clean Content Layout',
      category: 'Frontend Engineering',
      accent: 'orange',
      description: 'Accessible and clean culinary preparation guide with structured nutritional data, ingredients list, and method steps.',
      tags: ['Semantic HTML', 'CSS3', 'Typography'],
      image: '',
      poster: 'https://res.cloudinary.com/eltckiww/image/upload/f_auto,q_auto/v1787638302/file_00000000633882438944193d4b7eec70_frb9lp.png',
      video: 'https://res.cloudinary.com/eltckiww/video/upload/f_auto,q_auto/v1787636064/lv_0_20260825060628_sbqcuh.mp4',
      liveUrl: 'https://recipe-page-lac-three.vercel.app/',
    },
    {
      id: 7,
      number: '07',
      title: 'Blog Preview Card',
      subtitle: 'Interactive Content Card',
      category: 'Frontend Engineering',
      accent: 'violet',
      description: 'An interactive publication preview card with hover micro-interactions, responsive typography hierarchy, and tag filtering.',
      tags: ['HTML5', 'CSS3', 'Tailwind CSS', 'Micro-interactions'],
      image: '',
      poster: 'https://res.cloudinary.com/eltckiww/image/upload/f_auto,q_auto/v1787638300/file_00000000b4b48210a90ba9bb2a5aacce_csviy7.png',
      video: 'https://res.cloudinary.com/eltckiww/video/upload/f_auto,q_auto/v1787636067/lv_0_20260825055031_iz2037.mp4',
      liveUrl: 'https://blog-preview-card-pi-lovat.vercel.app/',
    },
    {
      id: 8,
      number: '08',
      title: 'QR Code Component',
      subtitle: 'Component UI Design',
      category: 'Frontend Engineering',
      accent: 'orange',
      description: 'A pixel-perfect QR code preview card matching exact design specs with clean CSS styling, optical centering, and elevation shadows.',
      tags: ['HTML5', 'CSS3', 'Responsive UI'],
      image: '',
      poster: 'https://res.cloudinary.com/eltckiww/image/upload/v1788190364/file_000000004cbc81f49882c8d0d631a475_jhb3gt.png',
      video: 'https://res.cloudinary.com/eltckiww/video/upload/v1788190374/lv_0_20260831161637_bgnfwi.mp4',
      liveUrl: 'https://qr-code-component-gamma-liart.vercel.app/',
    },
    {
      id: 9,
      number: '09',
      title: 'Social Links Profile',
      subtitle: 'Profile Interface Card',
      category: 'Frontend Engineering',
      accent: 'violet',
      description: 'A high-contrast bio-link interface with accessible >=44px touch targets, smooth keyboard focus rings, and zero dependencies.',
      tags: ['HTML5', 'CSS3', 'Flexbox', 'Mobile-First'],
      image: '',
      poster: 'https://res.cloudinary.com/eltckiww/image/upload/v1788190364/file_000000009f7c81f4a5bf5f45414a9e8a_bdomh4.png',
      video: 'https://res.cloudinary.com/eltckiww/video/upload/v1788190372/lv_0_20260831160550_gux19m.mp4',
      liveUrl: 'https://social-links-profile-neon-rho.vercel.app/',
    },
  ];

  const filteredProjects = projects.filter((project) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'AI Products') return project.category === 'AI Product';
    if (activeFilter === 'Frontend Engineering') return project.category === 'Frontend Engineering';
    return true;
  });

  useEffect(() => {
    cardContainersRef.current = cardContainersRef.current.slice(0, filteredProjects.length);
    cardsRef.current = cardsRef.current.slice(0, filteredProjects.length);

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    let rafId: number | null = null;

    /**
     * updateCardDepths:
     * Computes the sticky stack depth for each card on mobile viewports (< 640px).
     * On tablet and desktop (>= 640px), cards flow as a standard 2-column or 3-column grid,
     * so all transform/filter properties are reset to default neutral values.
     */
    const updateCardDepths = () => {
      // Tablet (sm: >= 640px) and Desktop (lg: >= 1024px): Standard CSS Grid layout
      if (window.innerWidth >= 640) {
        cardsRef.current.forEach((card) => {
          if (!card) return;
          gsap.set(card, {
            scale: 1,
            opacity: 1,
            y: 0,
            filter: 'blur(0px) brightness(1)',
            pointerEvents: 'auto',
            transformOrigin: 'top center',
          });
        });
        return;
      }

      // Mobile (< 640px): Dynamic sticky docking & depth calculation
      const pinnedTop = 72; // Uniform sticky docking top offset directly under header
      const coverageSpan = Math.min(window.innerHeight * 0.48, 360); // Distance threshold over which incoming card covers preceding card

      // Compute how much each subsequent card (j > 0) has advanced toward its sticky docking point (0 = unpinned, 1 = fully pinned)
      const progressArray = filteredProjects.map((_, j) => {
        const container = cardContainersRef.current[j];
        if (!container) return 0;
        const rect = container.getBoundingClientRect();
        const startCover = pinnedTop + coverageSpan;
        if (rect.top >= startCover) return 0;
        if (rect.top <= pinnedTop) return 1;
        return (startCover - rect.top) / (startCover - pinnedTop);
      });

      // Recalculate depth state for every card based on real-time scroll progress of incoming cards
      filteredProjects.forEach((_, i) => {
        const card = cardsRef.current[i];
        if (!card) return;

        // Sum the progress of all cards currently stacked in front of card i
        let stackDepth = 0;
        for (let j = i + 1; j < filteredProjects.length; j++) {
          stackDepth += progressArray[j];
        }

        // Active front card: perfectly sharp, fully opaque, full scale
        if (stackDepth <= 0.001) {
          gsap.set(card, {
            scale: 1,
            opacity: 1,
            y: 0,
            filter: 'blur(0px) brightness(1)',
            pointerEvents: 'auto',
            transformOrigin: 'top center',
          });
          return;
        }

        // Card 1 level deep: subtle scale down, soft dimming, and minor vertical tuck
        if (stackDepth <= 1) {
          const t = stackDepth;
          const scale = 1 - t * 0.04; // 1.0 -> 0.96
          const opacity = 1 - t * 0.52; // 1.0 -> 0.48
          const y = -t * 6; // subtle tuck
          const blur = t * 3; // 0 -> 3px
          const brightness = 1 - t * 0.3; // 1.0 -> 0.7
          gsap.set(card, {
            scale,
            opacity,
            y,
            filter: `blur(${blur.toFixed(2)}px) brightness(${brightness.toFixed(2)})`,
            pointerEvents: stackDepth < 0.1 ? 'auto' : 'none',
            transformOrigin: 'top center',
          });
        } else if (stackDepth <= 2) {
          // Card 2 levels deep: further recessed into the background
          const t = stackDepth - 1;
          const scale = 0.96 - t * 0.04; // 0.96 -> 0.92
          const opacity = 0.48 - t * 0.38; // 0.48 -> 0.10
          const y = -6 - t * 6; // -6 -> -12px
          const blur = 3 + t * 2; // 3 -> 5px
          const brightness = 0.7 - t * 0.2; // 0.7 -> 0.5
          gsap.set(card, {
            scale,
            opacity,
            y,
            filter: `blur(${blur.toFixed(2)}px) brightness(${brightness.toFixed(2)})`,
            pointerEvents: 'none',
            transformOrigin: 'top center',
          });
        } else {
          // Buried 2+ cards deep: cleanly hidden to eliminate composite layers and clutter
          gsap.set(card, {
            scale: 0.92,
            opacity: 0,
            y: -12,
            filter: 'blur(5px) brightness(0.5)',
            pointerEvents: 'none',
            transformOrigin: 'top center',
          });
        }
      });
    };

    // RequestAnimationFrame throttled handler for smooth 60fps performance
    const handleScrollOrResize = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        updateCardDepths();
        rafId = null;
      });
    };

    // Trigger initial calculation
    updateCardDepths();

    // Bind to GSAP ScrollTrigger lifecycle and global scroll
    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: handleScrollOrResize,
      onRefresh: () => {
        updateCardDepths();
      },
    });

    // Refresh after DOM layout settles
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
      updateCardDepths();
    }, 100);

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      clearTimeout(refreshTimer);
      st.kill();
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [filteredProjects.length, activeFilter]);

  return (
    <section 
      ref={sectionRef} 
      id="projects" 
      aria-label="Featured Projects Portfolio"
      className="scroll-mt-20 px-4 sm:px-6 md:px-10 lg:px-8 max-w-6xl mx-auto pt-8 sm:pt-12 md:pt-14 lg:pt-10 pb-8 sm:pb-10 md:pb-12 lg:pb-14 relative"
    >
      <span id="portfolio" className="sr-only pointer-events-none" aria-hidden="true" />
      <span id="work" className="sr-only pointer-events-none" aria-hidden="true" />
      {/* Header */}
      <motion.div 
        {...getFadeUp(0, 20, 0.45)}
        className="flex items-center justify-between mb-6 sm:mb-8"
      >
        <div className="space-y-1">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF4D1A]">
            FEATURED PROJECTS
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            My Recent Work
          </h2>
        </div>

        {/* View All Projects Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onViewAll || onProjectClick}
          aria-label="View all projects in modal gallery"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 border border-[#7C3AED]/40 hover:border-[#7C3AED]/80 text-zinc-300 hover:text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xl transition-all cursor-pointer shadow-[0_4px_20px_rgba(124,58,237,0.15)] focus-visible:ring-2 focus-visible:ring-[#FF4D1A] focus-visible:outline-none"
        >
          <span>VIEW ALL PROJECTS</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#FF4D1A]" aria-hidden="true" />
        </motion.button>
      </motion.div>

      {/* Filter Control Options */}
      <motion.div
        {...getFadeUp(0.08, 16, 0.45)}
        role="tablist"
        aria-label="Filter projects by category"
        className="flex items-center gap-2 sm:gap-2.5 mb-6 sm:mb-8 overflow-x-auto no-scrollbar py-1 -my-1 max-w-full"
      >
        {(['All', 'AI Products', 'Frontend Engineering'] as const).map((tab) => {
          const isActive = activeFilter === tab;
          return (
            <button
              key={tab}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveFilter(tab)}
              className={`relative shrink-0 whitespace-nowrap px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-[#FF4D1A] focus-visible:outline-none ${
                isActive
                  ? 'text-white bg-[#7C3AED]/25 border border-[#7C3AED]/80 shadow-[0_0_15px_rgba(124,58,237,0.3)]'
                  : 'text-zinc-400 hover:text-zinc-200 bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-white/20'
              }`}
            >
              <span className="flex items-center gap-1.5 sm:gap-2">
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] shadow-[0_0_6px_#FF7A00]" aria-hidden="true" />
                )}
                <span>{tab}</span>
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* Project Cards Grid: 3-column Desktop / 2-column Tablet & Medium (sm: & md:) / Single Column Scroll-Stack on Mobile */}
      <div 
        ref={containerRef} 
        className="relative pb-8 sm:pb-12 md:pb-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-5 md:gap-5 lg:gap-5 xl:gap-6 gap-y-6 sm:gap-y-6 md:gap-y-6 lg:gap-y-8 xl:gap-y-10 max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto"
      >
        {filteredProjects.map((project, idx) => {
          // Mobile sticky offset: uniform 72px under header across all cards
          const stickyTop = 72;

          return (
            <div
              key={`${activeFilter}-${project.id}`}
              ref={(el) => {
                cardContainersRef.current[idx] = el;
              }}
              style={{
                top: `${stickyTop}px`,
                zIndex: idx + 10,
              }}
              className="sticky sm:static min-h-[100vh] min-h-[100svh] sm:min-h-0 sm:h-auto flex flex-col justify-start sm:block pt-2 sm:pt-0 mb-8 sm:mb-0"
            >
              <ProjectCard
                project={project}
                onClick={onProjectClick}
                cardRef={(el) => {
                  cardsRef.current[idx] = el;
                }}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};
