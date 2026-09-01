import React from 'react';
import { Github, Linkedin, Mail, Twitter, Youtube, MessageCircle } from 'lucide-react';

interface FooterProps {
  isServicePage?: boolean;
  onNavigateHome?: (targetAnchor?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ isServicePage = false, onNavigateHome }) => {
  const handleLinkClick = (e: React.MouseEvent, targetAnchor: string) => {
    e.preventDefault();
    if (isServicePage && onNavigateHome) {
      onNavigateHome(targetAnchor);
      return;
    }

    if (targetAnchor === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const cleanId = targetAnchor.replace(/^#/, '');
    let el = document.getElementById(cleanId);
    if (!el) {
      if (cleanId === 'projects') el = document.getElementById('work');
      if (cleanId === 'work') el = document.getElementById('projects');
    }

    if (el) {
      const navOffset = 80;
      window.scrollTo({
        top: Math.max(0, el.getBoundingClientRect().top + window.pageYOffset - navOffset),
        behavior: 'smooth',
      });
    } else if (onNavigateHome) {
      onNavigateHome(targetAnchor);
    }
  };

  return (
    <footer className="w-full bg-[#050505] text-zinc-400 text-sm relative z-10 pt-12 pb-10 px-4 sm:px-6 md:px-8 lg:px-12 border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8 md:gap-12">
        
        {/* Left: Brand Identity */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1.5 shrink-0">
          <div className="flex items-center gap-2.5 mb-1">
            {/* Orange Four-Square Logo */}
            <div className="grid grid-cols-2 gap-1 w-6 h-6">
              <div className="bg-[#FF6A1A] rounded-[2.5px]"></div>
              <div className="bg-[#FF7A00] rounded-[2.5px]"></div>
              <div className="bg-[#FF5500] rounded-[2.5px]"></div>
              <div className="bg-[#FF4D1A] rounded-[2.5px]"></div>
            </div>
            {/* Wordmark */}
            <span className="text-xl font-bold tracking-tight text-white font-sans">
              Litz<span className="text-[#FF6A1A]">.</span>
            </span>
          </div>

          <p className="text-xs sm:text-[13px] text-zinc-300 font-medium tracking-tight">
            AI Product Engineer & Frontend Engineer
          </p>
          <p className="text-[11px] sm:text-xs text-zinc-500 font-normal">
            building intelligent, beautiful products.
          </p>
        </div>

        {/* Center: Quick Links */}
        <div className="flex flex-col items-center justify-center space-y-2.5 text-center">
          <span className="text-zinc-500 font-medium tracking-widest text-[10px] sm:text-[11px] uppercase">
            QUICK LINKS
          </span>
          <nav aria-label="Footer Navigation" className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-7 gap-y-2 text-xs sm:text-[13px] font-semibold uppercase tracking-wider text-white">
            <a
              href="#home"
              onClick={(e) => handleLinkClick(e, '#home')}
              className="hover:text-[#FF6A1A] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D1A] focus-visible:outline-none rounded"
            >
              HOME
            </a>
            <a
              href="#about"
              onClick={(e) => handleLinkClick(e, '#about')}
              className="hover:text-[#FF6A1A] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D1A] focus-visible:outline-none rounded"
            >
              ABOUT
            </a>
            <a
              href="#services"
              onClick={(e) => handleLinkClick(e, '#services')}
              className="hover:text-[#FF6A1A] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D1A] focus-visible:outline-none rounded"
            >
              SERVICES
            </a>
            <a
              href="#projects"
              onClick={(e) => handleLinkClick(e, '#projects')}
              className="hover:text-[#FF6A1A] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D1A] focus-visible:outline-none rounded"
            >
              WORK
            </a>
            <a
              href="#contact"
              onClick={(e) => handleLinkClick(e, '#contact')}
              className="hover:text-[#FF6A1A] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D1A] focus-visible:outline-none rounded"
            >
              CONTACT
            </a>
          </nav>
        </div>

        {/* Right: Circular Outline Social Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0" aria-label="Social media links">
          <a 
            href="https://github.com/tech-goddezz" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.08] hover:border-white/30 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D1A] focus-visible:outline-none" 
            aria-label="Visit GitHub Profile"
          >
            <Github className="w-4 h-4" aria-hidden="true" />
          </a>
          <a 
            href="https://www.linkedin.com/in/elizabethomigie" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.08] hover:border-white/30 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D1A] focus-visible:outline-none" 
            aria-label="Visit LinkedIn Profile"
          >
            <Linkedin className="w-4 h-4" aria-hidden="true" />
          </a>
          <a 
            href="https://x.com/real_litz" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.08] hover:border-white/30 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D1A] focus-visible:outline-none" 
            aria-label="Visit X (formerly Twitter) Profile"
          >
            <Twitter className="w-4 h-4" aria-hidden="true" />
          </a>
          <a 
            href="https://youtube.com/@build_with_litz" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.08] hover:border-white/30 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D1A] focus-visible:outline-none" 
            aria-label="Visit YouTube Channel"
          >
            <Youtube className="w-4 h-4" aria-hidden="true" />
          </a>
          <a 
            href="https://wa.me/2348082817092" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.08] hover:border-white/30 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D1A] focus-visible:outline-none" 
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
          </a>
          <a 
            href="mailto:techupwithliz@gmail.com" 
            className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.08] hover:border-white/30 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D1A] focus-visible:outline-none" 
            aria-label="Send an Email"
          >
            <Mail className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>

      </div>

      {/* Bottom Center Copyright */}
      <div className="max-w-6xl mx-auto mt-10 pt-6 text-center text-xs text-zinc-500 px-2">
        © 2025 Litz. All rights reserved.
      </div>
    </footer>
  );
};



