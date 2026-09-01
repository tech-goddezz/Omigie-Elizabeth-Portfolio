import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import {
  Lightbulb,
  Search,
  Compass,
  Palette,
  Code2,
  Cpu,
  ShieldCheck,
  Rocket,
  GraduationCap,
} from 'lucide-react';
import { useScrollAnimation } from '../utils/motion';

export const EducationProcessSection: React.FC = () => {
  const { getFadeUp, shouldReduceMotion } = useScrollAnimation();
  const sectionRef = useRef<HTMLElement>(null);
  const pipelineRef = useRef<HTMLDivElement>(null);
  const quoteCardRef = useRef<HTMLDivElement>(null);

  // Typewriter text definition
  const fullWordmarkText = 'Elizabeth';

  // Intersection observer trigger (fires only once upon entering viewport)
  const isQuoteCardInView = useInView(quoteCardRef, {
    once: true,
    amount: 0.25,
  });

  const [wordmarkCharsShown, setWordmarkCharsShown] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? fullWordmarkText.length : 0;
    }
    return 0;
  });

  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (shouldReduceMotion) {
      setWordmarkCharsShown(fullWordmarkText.length);
      return;
    }

    if (isQuoteCardInView && !hasAnimatedRef.current) {
      hasAnimatedRef.current = true;
      let wordmarkTimer: NodeJS.Timeout | null = null;

      const startDelay = setTimeout(() => {
        let wmIdx = 0;
        wordmarkTimer = setInterval(() => {
          wmIdx++;
          setWordmarkCharsShown(wmIdx);
          if (wmIdx >= fullWordmarkText.length) {
            if (wordmarkTimer) clearInterval(wordmarkTimer);
          }
        }, 80);
      }, 300);

      return () => {
        clearTimeout(startDelay);
        if (wordmarkTimer) clearInterval(wordmarkTimer);
      };
    }
  }, [isQuoteCardInView, shouldReduceMotion, fullWordmarkText.length]);

  // Scroll tracking to drive the glowing traveling signal through the pipeline
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 75%', 'end 35%'],
  });

  // Signal position smoothly traveling from 0% to 100% of pipeline height
  const signalYPercent = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const signalGlowOpacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0.5]);

  const educationList = [
    {
      degree: 'B.Eng. in Petroleum Engineering',
      institution: 'University of Benin',
      year: '2018 – 2024',
    },
    {
      degree: 'Frontend Web Development Certificate',
      institution: 'Udacity',
      year: '2022',
    },
    {
      degree: 'UI/UX Design Certification',
      institution: 'Google Career Certificates',
      year: '2023',
    },
  ];

  const skillsList = [
    'REACT',
    'TYPESCRIPT',
    'REACT NATIVE',
    'JAVASCRIPT',
    'TAILWIND CSS',
    'ZUSTAND',
    'FIREBASE',
    'SUPABASE',
    'THREE.JS',
    'GROQ API',
    'FIGMA',
    'HTML / CSS',
  ];

  // Continuous 8-stage product-building pipeline: IDEA → DISCOVER → DEFINE → DESIGN → BUILD → AI → TEST → SHIP
  const pipelineStages = [
    {
      id: 'idea',
      number: '01',
      title: 'IDEA',
      desc: 'Strategic inspiration, problem framing & opportunity mapping.',
      icon: Lightbulb,
      color: '#FF7A00',
    },
    {
      id: 'discover',
      number: '02',
      title: 'DISCOVER',
      desc: 'Deep user research, audience empathy & behavioral analysis.',
      icon: Search,
      color: '#FF4D1A',
    },
    {
      id: 'define',
      number: '03',
      title: 'DEFINE',
      desc: 'Information architecture, wireframes & system specifications.',
      icon: Compass,
      color: '#A855F7',
    },
    {
      id: 'design',
      number: '04',
      title: 'DESIGN',
      desc: 'High-fidelity UI, spatial typography & micro-interactions.',
      icon: Palette,
      color: '#C084FC',
    },
    {
      id: 'build',
      number: '05',
      title: 'BUILD',
      desc: 'Fast, responsive frontend & robust server-side architecture.',
      icon: Code2,
      color: '#FF4D1A',
    },
    {
      id: 'ai',
      number: '06',
      title: 'AI',
      desc: 'Intelligent neural workflows, cognitive models & adaptive flows.',
      icon: Cpu,
      color: '#7C3AED',
    },
    {
      id: 'test',
      number: '07',
      title: 'TEST',
      desc: 'Performance audits, cross-device QA & latency optimization.',
      icon: ShieldCheck,
      color: '#A855F7',
    },
    {
      id: 'ship',
      number: '08',
      title: 'SHIP',
      desc: 'Zero-downtime deployment, telemetry monitoring & launch.',
      icon: Rocket,
      color: '#FF4D1A',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="skills"
      aria-label="Education, Skills, and Engineering Pipeline"
      className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto py-10 sm:py-14 md:py-20"
    >
      {/* Unified Glassmorphic Container */}
      <motion.div 
        {...getFadeUp(0, 20, 0.45)}
        className="relative rounded-3xl bg-black/20 border border-[#7C3AED]/25 hover:border-[#7C3AED]/40 overflow-hidden shadow-[0_8px_24px_rgba(124,58,237,0.10)] backdrop-blur-xl transition-all duration-300"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 relative z-10">
          
          {/* COLUMN 1: Education & Skills (4 cols) */}
          <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between space-y-6 relative z-10">
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight text-white mb-5 uppercase">
                EDUCATION & SKILLS
              </h3>

              {/* Education Sub-section */}
              <div className="space-y-4">
                <div className="text-xs font-bold text-[#FF4D1A] uppercase tracking-widest flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>EDUCATION</span>
                </div>
                <div className="space-y-3.5">
                  {educationList.map((edu, idx) => (
                    <motion.div
                      key={idx}
                      {...getFadeUp(0.05 + idx * 0.05, 14, 0.45)}
                      className="group"
                    >
                      <div className="flex justify-between items-baseline gap-2">
                        <div className="text-xs sm:text-sm font-bold text-white group-hover:text-[#FF4D1A] transition-colors">
                          {edu.degree}
                        </div>
                        <span className="text-[11px] font-mono text-zinc-400 shrink-0">
                          {edu.year}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5 font-normal">
                        {edu.institution}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Inset Divider */}
              <div className="border-t border-white/10 my-5" aria-hidden="true" />

              {/* Skills Sub-section with evenly spaced pills */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-[#FF4D1A] uppercase tracking-widest">
                  SKILLS
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillsList.map((skill, idx) => (
                    <motion.span
                      key={idx}
                      {...getFadeUp(0.15 + idx * 0.02, 10, 0.35)}
                      whileHover={{ scale: 1.05 }}
                      className="px-3 py-1.5 bg-white/[0.04] border border-white/10 hover:border-[#7C3AED]/40 hover:bg-[#7C3AED]/15 text-[11px] font-bold tracking-wider text-zinc-300 hover:text-white rounded-full transition-all select-none cursor-default shadow-sm"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>

            {/* Inset Vertical Divider Line */}
            <div className="hidden lg:block absolute right-0 top-6 bottom-6 w-[1px] bg-white/10" aria-hidden="true" />
          </div>

          {/* COLUMN 2: Continuous Product-Building Pipeline (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 space-y-5 relative z-10">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold tracking-tight text-white uppercase">
                PRODUCT PIPELINE
              </h3>
              <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 border border-white/10 px-2 py-0.5 rounded-full">
                8 STAGES
              </span>
            </div>

            {/* Continuous Pipeline Timeline */}
            <div ref={pipelineRef} className="relative space-y-4 py-1">
              {/* Static Background Rail Line */}
              <div className="absolute left-[49px] top-3 bottom-3 w-[2px] bg-white/10 rounded-full pointer-events-none" aria-hidden="true" />

              {/* Active Animated Traveling Signal on Scroll */}
              <motion.div
                aria-hidden="true"
                style={{
                  top: shouldReduceMotion ? '50%' : signalYPercent,
                  opacity: signalGlowOpacity,
                }}
                className="absolute left-[46px] w-2 h-2 rounded-full bg-white shadow-[0_0_12px_4px_#FF4D1A,0_0_24px_8px_#A855F7] z-20 pointer-events-none -translate-y-1/2"
              />

              {pipelineStages.map((stage, idx) => {
                const IconComponent = stage.icon;
                return (
                  <motion.div
                    key={stage.id}
                    {...getFadeUp(0.04 + idx * 0.03, 12, 0.4)}
                    className="relative z-10 flex items-start gap-3.5 group cursor-default"
                  >
                    {/* Stage Number on Left in theme orange */}
                    <span className="text-xs font-bold text-[#FF4D1A] font-mono w-5 shrink-0 text-right mt-1.5 transition-colors">
                      {stage.number}
                    </span>

                    {/* Stage Icon Node with theme orange accent border */}
                    <div
                      className="w-8 h-8 rounded-full border border-[#FF4D1A]/35 bg-[#0D0D12] group-hover:border-[#FF4D1A] group-hover:shadow-[0_0_15px_rgba(255,77,26,0.35)] flex items-center justify-center shrink-0 transition-all duration-300 z-10 mt-0.5"
                    >
                      <IconComponent
                        className="w-3.5 h-3.5 text-zinc-200 group-hover:text-[#FF4D1A] transition-transform duration-300 group-hover:scale-110"
                        aria-hidden="true"
                      />
                    </div>

                    {/* Stage Details with theme orange title */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-[13px] font-bold text-[#FF4D1A] tracking-wider uppercase transition-colors">
                          {stage.title}
                        </h4>
                        {idx === 0 && (
                          <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest">
                            [START]
                          </span>
                        )}
                        {idx === pipelineStages.length - 1 && (
                          <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest">
                            [LIVE]
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] sm:text-xs text-zinc-400 font-normal leading-relaxed mt-0.5 group-hover:text-zinc-300 transition-colors">
                        {stage.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Vertical Divider */}
            <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[1px] bg-white/10" aria-hidden="true" />
          </div>

          {/* COLUMN 3: Quote & Signature (3 cols) with moody violet-to-orange gradient matching reference structure */}
          <motion.div 
            ref={quoteCardRef}
            {...getFadeUp(0.15, 16, 0.45)}
            className="lg:col-span-3 p-6 sm:p-8 lg:p-7 xl:p-8 bg-gradient-to-b from-[#19092B]/95 via-[#230C1E]/95 to-[#2B0E06]/95 border-t lg:border-t-0 lg:border-l border-[#7C3AED]/25 flex flex-col justify-between space-y-8 relative z-10 overflow-hidden shadow-[inset_0_0_35px_rgba(124,58,237,0.12)]"
          >
            {/* Ambient theme glow: Violet bleeding top-right, subtle warm orange bleeding bottom */}
            <div className="absolute -top-12 -right-12 w-44 h-44 bg-[#7C3AED]/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#FF4D1A]/15 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#FF4D1A]/05 via-transparent to-[#7C3AED]/10 pointer-events-none" aria-hidden="true" />

            {/* TOP & MIDDLE SECTION: Quotation mark + Quote lines + Signature */}
            <div className="space-y-6 relative z-10">
              {/* 1) Large decorative quotation mark icon at top */}
              <div className="flex items-center">
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8 text-[#FF4D1A] fill-current opacity-95 drop-shadow-[0_0_12px_rgba(255,77,26,0.35)]"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* 2) Quote text with short line breaks (roughly 3-4 words per line) in clean sans-serif, medium weight */}
              <div 
                id="education-quote-text"
                className="text-[17px] sm:text-[18px] lg:text-[18px] xl:text-[19px] font-medium text-white/95 leading-[1.38] tracking-[-0.01em]"
              >
                <div>Good design</div>
                <div>is not just how</div>
                <div>it looks, but how</div>
                <div>it works.</div>
              </div>

              {/* 3) Elizabeth handwritten signature in script font, left-aligned in the center section and in website theme orange */}
              <div className="pt-4 pb-2 text-left">
                <span className="font-signature text-3xl sm:text-4xl lg:text-[40px] text-[#FF4D1A] block select-none leading-none tracking-wide text-left drop-shadow-[0_0_15px_rgba(255,77,26,0.35)]">
                  <span>{fullWordmarkText.slice(0, wordmarkCharsShown)}</span>
                  {wordmarkCharsShown > 0 && wordmarkCharsShown < fullWordmarkText.length && (
                    <span className="inline-block w-[2px] h-[0.9em] bg-[#FF4D1A] ml-0.5 align-middle animate-pulse" />
                  )}
                  <span className="invisible select-none pointer-events-none" aria-hidden="true">
                    {fullWordmarkText.slice(wordmarkCharsShown)}
                  </span>
                </span>
              </div>
            </div>

            {/* BOTTOM SECTION: 4) All-caps 3-line tagline & 5) Decorative star icon */}
            <div className="space-y-3 pt-4 relative z-10">
              {/* 4) Multi-line all-caps tagline with enlarged font size matching reference */}
              <div className="text-xs sm:text-[13px] lg:text-[13px] xl:text-[14px] font-bold text-zinc-300 tracking-[0.14em] uppercase leading-tight space-y-0.5">
                <div>LET'S CREATE</div>
                <div>SOMETHING GREAT</div>
                <div>TOGETHER.</div>
              </div>

              {/* 5) Small decorative asterisk/star mark */}
              <div className="flex items-center pt-0.5">
                <svg 
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF4D1A] drop-shadow-[0_0_8px_rgba(255,77,26,0.6)]" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
              </div>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
};
