import React from 'react';
import { MessageCircle, ArrowUpRight, Zap, Shield, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { useScrollAnimation } from '../utils/motion';

interface ContactBannerProps {
  onContactClick: () => void;
}

export const ContactBanner: React.FC<ContactBannerProps> = ({ onContactClick }) => {
  const { getFadeUp } = useScrollAnimation();

  return (
    <section id="contact" className="scroll-mt-20 px-4 sm:px-6 md:px-8 max-w-4xl xl:max-w-[920px] mx-auto py-10 sm:py-14 md:py-16 relative z-10">
      <motion.div
        {...getFadeUp(0, 20, 0.45)}
        className="relative w-full rounded-[28px] sm:rounded-[36px] bg-[#050505] border border-purple-500/20 shadow-[0_0_80px_rgba(109,74,255,0.15),0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden p-6 sm:p-8 md:p-10 lg:p-12 text-center"
      >
        {/* Ambient Glows */}
        {/* Radial Purple Glow bleeding from top-left */}
        <div 
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-br from-[#581C87]/25 via-purple-900/15 to-transparent blur-3xl pointer-events-none -z-10" 
          aria-hidden="true"
        />
        {/* Faint Orange Glow bleeding from bottom-right */}
        <div 
          className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-tl from-[#FF6A1A]/20 via-orange-600/10 to-transparent blur-3xl pointer-events-none -z-10" 
          aria-hidden="true"
        />

        {/* Orbital System Background Details */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 opacity-70" aria-hidden="true">
          <svg className="w-full h-full" viewBox="0 0 1000 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer Ellipse */}
            <ellipse cx="500" cy="270" rx="460" ry="190" stroke="rgba(168, 85, 247, 0.12)" strokeWidth="1" strokeDasharray="3 6" />
            {/* Mid Ellipse */}
            <ellipse cx="500" cy="270" rx="350" ry="145" stroke="rgba(255, 255, 255, 0.07)" strokeWidth="1" />
            {/* Inner Ellipse */}
            <ellipse cx="500" cy="270" rx="240" ry="100" stroke="rgba(168, 85, 247, 0.15)" strokeWidth="1" strokeDasharray="2 4" />
          </svg>

          {/* Glowing orbital particles */}
          {/* Particle 1: Purple on mid-left */}
          <div className="absolute top-[32%] left-[14%] w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_#C084FC,0_0_20px_#A855F7]" />
          {/* Particle 2: Faint purple on inner-left */}
          <div className="absolute top-[48%] left-[21%] w-1.5 h-1.5 rounded-full bg-purple-300 shadow-[0_0_8px_#A855F7]" />
          {/* Particle 3: Orange on top-right */}
          <div className="absolute top-[23%] right-[17%] w-2 h-2 rounded-full bg-[#FF6A1A] shadow-[0_0_10px_#FF6A1A,0_0_18px_#FF8C42]" />
          {/* Particle 4: Soft orange on bottom-right */}
          <div className="absolute bottom-[28%] right-[22%] w-1.5 h-1.5 rounded-full bg-[#FF7A00] shadow-[0_0_8px_#FF7A00]" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          
          {/* Top Floating Glass Squircle Icon */}
          <div className="relative mb-5 sm:mb-6">
            {/* Soft purple bloom behind it */}
            <div className="absolute -inset-3 bg-purple-600/35 rounded-full blur-xl pointer-events-none" />
            
            <motion.div 
              whileHover={{ scale: 1.06, rotate: 3 }}
              className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] bg-black/60 backdrop-blur-2xl border border-purple-400/30 flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2)] cursor-pointer"
            >
              {/* Electric highlight on top-right corner */}
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-purple-300 shadow-[0_0_10px_#E9D5FF,0_0_20px_#C084FC]" />
              
              <ArrowUpRight className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[1.8]" />
            </motion.div>
          </div>

          {/* Eyebrow Text */}
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-3.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#A855F7]" />
            <span className="text-[#B4A2FF] text-xs sm:text-sm font-medium tracking-[0.25em] uppercase">
              LET'S WORK TOGETHER
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold tracking-tight text-white leading-[1.12] mb-3.5 sm:mb-4">
            Let's Build Something <br className="hidden sm:inline" />
            <span className="text-[#FF6A1A]">Exceptional.</span>
          </h2>

          {/* Supporting Text */}
          <p className="text-zinc-400 text-xs sm:text-sm md:text-base font-normal leading-relaxed max-w-lg mx-auto mb-7 sm:mb-8">
            Have an idea worth building? Let's talk about how we can bring it to life and create real impact.
          </p>

          {/* CTA Pill Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={onContactClick}
            id="start-conversation-btn"
            aria-label="Start a conversation"
            className="inline-flex items-center justify-center gap-3 py-3.5 px-6 sm:px-8 rounded-full bg-gradient-to-r from-[#4C1D95] via-[#5B21B6] to-[#4C1D95] hover:from-[#5B21B6] hover:via-[#6D28D9] hover:to-[#5B21B6] text-white border border-purple-500/30 hover:border-purple-400/50 shadow-[0_8px_24px_rgba(0,0,0,0.5),0_0_20px_rgba(124,58,237,0.2),inset_0_1px_0_rgba(255,255,255,0.15)] hover:shadow-[0_8px_28px_rgba(124,58,237,0.35)] transition-all duration-300 cursor-pointer group mb-10 sm:mb-12 focus-visible:ring-2 focus-visible:ring-[#FF4D1A] focus-visible:outline-none"
          >
            {/* Left Message Circle */}
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-200/90 shrink-0" aria-hidden="true" />

            {/* Center Label */}
            <span className="font-semibold text-xs sm:text-xs tracking-wider uppercase text-zinc-100 whitespace-nowrap">
              START A CONVERSATION
            </span>

            {/* Right Arrow in circular outline */}
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-white/20 bg-white/10 flex items-center justify-center group-hover:bg-white/20 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0">
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-200 group-hover:text-white" aria-hidden="true" />
            </div>
          </motion.button>

          {/* Trust Indicators: Horizontal 3-column row on tablet (sm: and md:) and desktop, vertical on mobile */}
          <div className="w-full pt-6 sm:pt-8 border-t border-white/[0.07] grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-2 md:gap-3 text-left">
            {/* Feature 1: Fast Response */}
            <div className="flex items-center gap-3 sm:gap-2.5 md:gap-3.5 sm:justify-center sm:px-1.5 md:px-2">
              <div className="w-10 h-10 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-black/60 border border-purple-500/25 shadow-[0_0_16px_rgba(168,85,247,0.15)] flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 text-purple-300" />
              </div>
              <div className="min-w-0">
                <h4 className="text-white text-xs sm:text-xs md:text-sm font-semibold tracking-tight whitespace-nowrap">Fast Response</h4>
                <p className="text-zinc-400 text-[11px] sm:text-[10.5px] md:text-xs whitespace-nowrap">Usually within 24h</p>
              </div>
            </div>

            {/* Feature 2: Professional */}
            <div className="flex items-center gap-3 sm:gap-2.5 md:gap-3.5 sm:justify-center sm:px-1.5 md:px-2 sm:border-l sm:border-white/[0.07]">
              <div className="w-10 h-10 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-black/60 border border-purple-500/25 shadow-[0_0_16px_rgba(168,85,247,0.15)] flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 text-purple-300" />
              </div>
              <div className="min-w-0">
                <h4 className="text-white text-xs sm:text-xs md:text-sm font-semibold tracking-tight whitespace-nowrap">Professional</h4>
                <p className="text-zinc-400 text-[11px] sm:text-[10.5px] md:text-xs whitespace-nowrap">Reliable & Clear</p>
              </div>
            </div>

            {/* Feature 3: Confidential */}
            <div className="flex items-center gap-3 sm:gap-2.5 md:gap-3.5 sm:justify-center sm:px-1.5 md:px-2 sm:border-l sm:border-white/[0.07]">
              <div className="w-10 h-10 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-black/60 border border-purple-500/25 shadow-[0_0_16px_rgba(168,85,247,0.15)] flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 text-purple-300" />
              </div>
              <div className="min-w-0">
                <h4 className="text-white text-xs sm:text-xs md:text-sm font-semibold tracking-tight whitespace-nowrap">Confidential</h4>
                <p className="text-zinc-400 text-[11px] sm:text-[10.5px] md:text-xs whitespace-nowrap">Your ideas are safe</p>
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </section>
  );
};



