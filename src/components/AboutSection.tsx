import React from 'react';
import { CheckCircle2, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { useScrollAnimation } from '../utils/motion';
import { optimizeCloudinaryUrl, getCloudinarySrcSet } from '../utils/cloudinary';

export const AboutSection: React.FC = () => {
  const { getFadeUp, shouldReduceMotion } = useScrollAnimation();

  const rawAboutImageUrl = 'https://res.cloudinary.com/eltckiww/image/upload/v1787729177/z1_jcc9l4.png';
  const optimizedAboutImageUrl = optimizeCloudinaryUrl(rawAboutImageUrl, { width: 720 });
  const aboutImageSrcSet = getCloudinarySrcSet(rawAboutImageUrl, [360, 540, 720, 960]);

  const highlights = [
    'Clean & Efficient Code',
    'Modern & Responsive Design',
    'Performance Optimization',
    'Great User Experience',
  ];

  return (
    <section 
      id="about" 
      aria-label="About Omigie Elizabeth"
      className="scroll-mt-20 px-4 sm:px-6 md:px-10 lg:px-8 max-w-5xl xl:max-w-[1080px] mx-auto py-8 sm:py-12 lg:py-4 relative w-full lg:min-h-screen lg:h-screen lg:flex lg:flex-col lg:justify-center"
    >
      <motion.div
        {...getFadeUp(0, 20, 0.45)}
        className="relative rounded-3xl bg-black/20 border border-[#7C3AED]/25 hover:border-[#5b6ef5]/40 p-6 sm:p-8 lg:p-7 xl:p-8 backdrop-blur-xl shadow-[0_8px_24px_rgba(124,58,237,0.10)] overflow-hidden transition-all duration-300 w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-center relative z-10">
          {/* Left Column: Info & Content */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-4 lg:space-y-3 xl:space-y-3.5">
            {/* About Tag */}
            <div className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#FF4D1A]">
              ABOUT ME
            </div>

            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-[34px] font-extrabold text-white tracking-tight leading-[1.18]">
              Engineering Products{' '}
              <span className="text-[#FF4D1A]">That Actually Work</span>
            </h2>

            {/* Description */}
            <p className="text-zinc-300 text-xs sm:text-sm lg:text-[13px] xl:text-sm leading-relaxed font-normal max-w-xl">
              I'm a self-taught Frontend Developer and AI Product Engineer with a background in Petroleum Engineering. That engineering foundation shows up in how I work - breaking problems down systematically before I write a single line of code. I build interfaces that are fast, clean, and genuinely useful, and I integrate AI where it adds real value to the product.
            </p>

            {/* Checklist with staggered entrance */}
            <div className="space-y-2 lg:space-y-1.5 xl:space-y-2 pt-0.5">
              {highlights.map((item, idx) => (
                <motion.div 
                  key={idx}
                  {...getFadeUp(0.05 + idx * 0.05, 14, 0.45)}
                  className="flex items-center gap-2.5 text-xs lg:text-[13px] xl:text-sm text-zinc-200"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF4D1A] shrink-0" aria-hidden="true" />
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>

            {/* Signature */}
            <motion.div
              {...getFadeUp(0.25, 14, 0.45)}
              className="pt-1"
            >
              <span className="font-signature text-2xl sm:text-3xl lg:text-3xl xl:text-4xl text-[#FF4D1A] select-none tracking-wide block">
                Omigie Elizabeth
              </span>
            </motion.div>
          </div>

          {/* Right Column: Image with Floating Stat Badge */}
          <div className="lg:col-span-5 w-full">
            <motion.div
              {...getFadeUp(0.3, 20, 0.5)}
              className="relative rounded-2xl"
            >
              <div className="relative rounded-2xl border border-white/10 overflow-hidden bg-black/40 group shadow-2xl">
                <img
                  src={optimizedAboutImageUrl}
                  srcSet={aboutImageSrcSet}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
                  alt="Elizabeth's modern engineering workspace setup"
                  width={640}
                  height={420}
                  className="w-full h-60 sm:h-64 lg:h-[250px] xl:h-[285px] object-cover object-center opacity-90 group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" aria-hidden="true" />

                {/* 4+ Years Experience Badge with floating animation positioned on the bottom-left overlapping the image */}
                <motion.div
                  animate={shouldReduceMotion ? {} : { y: [0, -4, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 lg:bottom-3 lg:left-3 flex items-center gap-2.5 px-3.5 py-1.5 lg:px-3 lg:py-1.5 rounded-xl bg-black/75 border border-[#7C3AED]/40 backdrop-blur-xl shadow-2xl z-20"
                >
                  <div className="p-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-[#FF4D1A]">
                    <Award className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-bold text-white leading-tight">4+</div>
                    <div className="text-[9.5px] sm:text-[10px] text-zinc-400 font-medium">Years Experience</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

