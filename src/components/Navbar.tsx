import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onGetStarted: () => void;
  onDownloadCV?: () => void;
  isRevealed?: boolean;
  isServicePage?: boolean;
  onNavigateHome?: (targetHrefOrId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onGetStarted,
  isRevealed = true,
  isServicePage = false,
  onNavigateHome,
}) => {
  const [activeTab, setActiveTab] = useState<string>('Home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const navItems = [
    { id: 'Home', label: 'Home', href: '#home' },
    { id: 'About', label: 'About', href: '#about' },
    { id: 'Services', label: 'Services', href: '#services' },
    { id: 'Portfolio', label: 'Portfolio', href: '#portfolio' },
    { id: 'Contact', label: 'Contact', href: '#contact' },
  ];

  const scrollToTarget = (targetHrefOrId: string) => {
    if (isServicePage && onNavigateHome) {
      onNavigateHome(targetHrefOrId);
      return;
    }

    const cleanId = targetHrefOrId.replace(/^#/, '').toLowerCase();
    let element: HTMLElement | null = document.getElementById(cleanId);
    if (!element) {
      if (cleanId === 'home') {
        element = document.getElementById('home') || document.body;
      } else if (cleanId === 'about') {
        element = document.getElementById('about');
      } else if (cleanId === 'services') {
        element = document.getElementById('services');
      } else if (cleanId === 'portfolio' || cleanId === 'projects' || cleanId === 'work') {
        element = document.getElementById('portfolio') || document.getElementById('projects') || document.getElementById('work');
      } else if (cleanId === 'blog' || cleanId === 'how-i-think' || cleanId === 'insights' || cleanId === 'skills') {
        element = document.getElementById('blog') || document.getElementById('how-i-think') || document.getElementById('skills');
      } else if (cleanId === 'contact') {
        element = document.getElementById('contact');
      }
      if (!element) {
        try {
          element = document.querySelector(targetHrefOrId);
        } catch (e) {
          // ignore query error
        }
      }
    }

    if (element) {
      const navOffset = 76;
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const targetTop = Math.max(0, rect.top + scrollTop - navOffset);
      
      window.scrollTo({
        top: targetTop,
        behavior: 'smooth',
      });

      if (window.history && window.history.pushState) {
        window.history.pushState(null, '', `#${cleanId}`);
      }
    } else if (onNavigateHome) {
      onNavigateHome(targetHrefOrId);
    }
  };

  // Dynamic scroll spy with accurate bounding rect calculations
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;
      let currentSection = 'Home';

      if (window.scrollY < 300) {
        currentSection = 'Home';
      } else {
        for (const item of navItems) {
          const cleanId = item.href.replace(/^#/, '').toLowerCase();
          let element = document.getElementById(cleanId);
          if (!element) {
            if (cleanId === 'portfolio') element = document.getElementById('projects') || document.getElementById('work');
            if (cleanId === 'blog') element = document.getElementById('how-i-think') || document.getElementById('skills');
            if (!element) element = document.querySelector(item.href);
          }

          if (element) {
            const rect = element.getBoundingClientRect();
            const top = rect.top + window.scrollY;
            const height = element.offsetHeight || rect.height;
            if (scrollPosition >= top - 120 && scrollPosition < top + height) {
              currentSection = item.id;
            }
          }
        }
      }

      // If at bottom of page, activate Contact
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
        currentSection = 'Contact';
      }

      setActiveTab(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string, href: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    // Allow DOM to settle after closing mobile dropdown before scrolling
    setTimeout(() => {
      scrollToTarget(href);
    }, 60);
  };

  const smoothEase = [0.16, 1, 0.3, 1] as const;

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={isRevealed ? { y: 0, opacity: 1 } : { y: -30, opacity: 0 }}
      transition={{ duration: 0.85, delay: 0.1, ease: smoothEase }}
      className="sticky top-0 z-50 w-full px-4 sm:px-6 py-3.5 bg-[#0A0A0D]/40 backdrop-blur-md backdrop-saturate-150 border-b border-white/[0.04] shadow-[0_4px_30px_rgba(0,0,0,0.2)]"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            setMobileMenuOpen(false);
            scrollToTarget('#home');
          }}
          className="flex items-center gap-2.5 group cursor-pointer select-none touch-manipulation min-h-[44px]"
          aria-label="Litz Portfolio Home"
        >
          <div className="relative w-8 h-8 flex items-center justify-center">
            {/* Custom 4-block polygon icon */}
            <div className="grid grid-cols-2 gap-0.5 w-6 h-6 transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
              <div className="bg-[#FF3B00] rounded-tl-[2px] rounded-br-[2px] shadow-sm shadow-orange-600/50"></div>
              <div className="bg-[#FF5500] rounded-tr-[2px] rounded-bl-[2px]"></div>
              <div className="bg-[#FF2E00] rounded-tr-[2px] rounded-bl-[2px]"></div>
              <div className="bg-[#FF6600] rounded-br-[2px] rounded-tl-[2px]"></div>
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
            Litz<span className="text-[#FF4D1A]">.</span>
          </span>
        </a>

        {/* Center Navigation (Desktop) */}
        <nav className="hidden md:flex items-center" aria-label="Main Navigation">
          <div className="flex items-center gap-6 lg:gap-8 xl:gap-9">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.id, item.href);
                  }}
                  className={`relative py-1 text-[13px] lg:text-[14px] font-medium transition-colors duration-200 cursor-pointer select-none touch-manipulation font-sans ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavUnderline"
                      className="absolute -bottom-1 left-1 right-1 h-[1.5px] bg-[#FF4D1A]/50 rounded-full"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>
        </nav>

        {/* Right CTA / Mobile Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setMobileMenuOpen(false);
              scrollToTarget('#projects');
            }}
            className="relative group overflow-hidden rounded-full p-px cursor-pointer select-none touch-manipulation min-h-[40px] focus-visible:ring-2 focus-visible:ring-[#FF4D1A] focus-visible:outline-none"
            aria-label="View Projects"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#FF4D1A] via-purple-500 to-[#FF4D1A] rounded-full group-hover:opacity-100 opacity-70 blur-sm transition-opacity duration-300"></span>
            <span className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs font-bold text-white bg-[#141419] rounded-full group-hover:bg-[#1a1a22] transition-colors border border-white/10">
              <span>View Projects</span>
              <svg
                viewBox="0 0 16 16"
                className="w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:rotate-[3deg] drop-shadow-[0_0_5px_rgba(255,77,26,0.45)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="navPaperPlaneGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF4D1A" />
                    <stop offset="100%" stopColor="#FF7A00" />
                  </linearGradient>
                </defs>
                <path
                  d="M14.5 1.5L1.8 7.3C1.1 7.6 1.1 8.5 1.8 8.8L6.4 10.4L8 15C8.3 15.7 9.2 15.7 9.5 15L15.3 2.3C15.6 1.6 15.1 1.1 14.5 1.5Z"
                  stroke="url(#navPaperPlaneGrad)"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="url(#navPaperPlaneGrad)"
                  fillOpacity="0.15"
                />
                <path
                  d="M6.4 10.4L14.5 1.5"
                  stroke="url(#navPaperPlaneGrad)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setMobileMenuOpen((prev) => !prev);
            }}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            className="md:hidden p-2.5 text-zinc-300 hover:text-white active:text-white bg-[#121216] border border-white/10 rounded-xl cursor-pointer select-none touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center shadow-md active:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#FF4D1A] focus-visible:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-white" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden mt-3 pt-3 border-t border-white/10 flex flex-col gap-1.5 overflow-hidden"
          >
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.id, item.href);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center cursor-pointer select-none touch-manipulation min-h-[48px] ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF4D1A]/25 to-[#FF3B00]/15 text-[#FF4D1A] font-semibold border border-[#FF4D1A]/30 shadow-sm'
                      : 'text-zinc-200 bg-white/[0.03] hover:bg-white/[0.08] active:bg-white/[0.12] border border-transparent'
                  }`}
                >
                  <span className="text-[15px]">{item.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

