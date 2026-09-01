import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import Scene3D from './components/Scene3D';
import { AmbientBackground } from './components/AmbientBackground';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HowIThinkSection } from './components/HowIThinkSection';
import { PartnerLogos } from './components/PartnerLogos';
import { StatsBar } from './components/StatsBar';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { ProjectsSection } from './components/ProjectsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { EducationProcessSection } from './components/EducationProcessSection';
import { ContactBanner } from './components/ContactBanner';
import { Footer } from './components/Footer';
import { InteractiveModals, ModalType } from './components/InteractiveModals';
import { Preloader } from './components/Preloader';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { ServiceDetailPage, ServiceSlug } from './components/ServiceDetailPage';

const getServiceSlugFromPath = (pathname: string): ServiceSlug | null => {
  const normalized = pathname.replace(/\/+$/, '');
  if (normalized === '/services/frontend-engineering') return 'frontend-engineering';
  if (normalized === '/services/ai-product-integration') return 'ai-product-integration';
  if (normalized === '/services/product-prototyping') return 'product-prototyping';
  return null;
};

export default function App() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const activeModalRef = useRef<ModalType>(null);
  activeModalRef.current = activeModal;

  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  });

  const currentServiceSlug = getServiceSlugFromPath(currentPath);

  // Browser history sync for back button modal dismiss & page navigation
  const handleOpenModal = useCallback((type: ModalType) => {
    if (!type) return;
    window.history.pushState({ modal: type }, '', window.location.href);
    setActiveModal(type);
  }, []);

  const handleCloseModal = useCallback(() => {
    if (activeModalRef.current) {
      if (window.history.state?.modal) {
        window.history.back();
      } else {
        setActiveModal(null);
      }
    }
  }, []);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (activeModalRef.current) {
        setActiveModal(null);
      }
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Preloader active on initial entrance (skipped if deep linking directly to a service page or reduced motion)
  const [isPreloaderActive, setIsPreloaderActive] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const isService = !!getServiceSlugFromPath(window.location.pathname);
      if (isService) return false;
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      return !isReduced;
    }
    return false;
  });

  // isRevealed triggers the continuous coordinated entrance cascade across all homepage elements
  const [isRevealed, setIsRevealed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const isService = !!getServiceSlugFromPath(window.location.pathname);
      if (isService) return true;
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isReduced) return true;
    }
    return false;
  });

  // Ensure homepage is 100% visible if preloader is not active
  useEffect(() => {
    if (!isPreloaderActive) {
      setIsRevealed(true);
    }
  }, [isPreloaderActive]);

  const handleDownloadCV = useCallback(() => {
    handleOpenModal('download-cv');
  }, [handleOpenModal]);

  const handlePortalStart = useCallback(() => {
    setIsRevealed(true);
  }, []);

  const handlePreloaderComplete = useCallback(() => {
    setIsRevealed(true);
    setIsPreloaderActive(false);
  }, []);

  // Service Page Navigation Handlers
  const handleSelectService = useCallback((slug: ServiceSlug) => {
    const path = `/services/${slug}`;
    window.history.pushState({ page: 'service', slug }, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBackToServices = useCallback(() => {
    window.history.pushState({}, '', '/#services');
    setCurrentPath('/');
    setTimeout(() => {
      const el = document.getElementById('services');
      if (el) {
        const navOffset = 80;
        window.scrollTo({
          top: Math.max(0, el.getBoundingClientRect().top + window.pageYOffset - navOffset),
          behavior: 'smooth',
        });
      }
    }, 60);
  }, []);

  const handleNavigateHome = useCallback((targetHrefOrId?: string) => {
    const cleanId = (targetHrefOrId || '#services').replace(/^#/, '');
    window.history.pushState({}, '', `/#${cleanId}`);
    setCurrentPath('/');
    setTimeout(() => {
      const el =
        document.getElementById(cleanId) ||
        document.getElementById('projects') ||
        document.getElementById('work');
      if (el) {
        const navOffset = 80;
        window.scrollTo({
          top: Math.max(0, el.getBoundingClientRect().top + window.pageYOffset - navOffset),
          behavior: 'smooth',
        });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 60);
  }, []);

  return (
    <div className="relative min-h-screen text-white selection:bg-purple-500/30 selection:text-purple-200 overflow-x-clip font-sans bg-[#0A0A0D]">
      {/* Full-Screen Cinematic Litz Intro Preloader – Seamless Continuous Portal Transition */}
      {isPreloaderActive && (
        <Preloader
          onPortalStart={handlePortalStart}
          onComplete={handlePreloaderComplete}
        />
      )}

      {/* 3D Scene Background Canvas (z-index 0) */}
      <Scene3D />

      {/* Page Content Flow – Continuous Viewport Portal Entrance Transition */}
      <motion.div
        initial={false}
        animate={
          isRevealed || !isPreloaderActive
            ? { opacity: 1, scale: 1, y: 0 }
            : { opacity: 0.35, scale: 0.96, y: 14 }
        }
        transition={{
          duration: 1.0,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative z-10 origin-top"
      >
        {/* Top Floating Navigation with progressive masked slide-down */}
        <Navbar
          onGetStarted={() => handleOpenModal('get-started')}
          onDownloadCV={handleDownloadCV}
          isRevealed={isRevealed || !isPreloaderActive}
          isServicePage={!!currentServiceSlug}
          onNavigateHome={handleNavigateHome}
        />

        {/* Dynamic Route Switching: Dedicated Service Detail Page vs Main Content Flow */}
        {currentServiceSlug ? (
          <main className="relative">
            <ServiceDetailPage
              slug={currentServiceSlug}
              onBack={handleBackToServices}
              onConnect={() => handleOpenModal('get-started')}
            />
          </main>
        ) : (
          <main className="relative">
            {/* 1. Hero Section (Progressively constructed through the portal unroll) */}
            <HeroSection
              onStartProject={() => handleOpenModal('get-started')}
              onViewPortfolio={() => handleOpenModal('view-work')}
              onDownloadCV={handleDownloadCV}
              isRevealed={isRevealed || !isPreloaderActive}
            />

            {/* 2. HOW I THINK Section (Immediately after hero: 6 Neural Nodes converging into PRODUCT) */}
            <HowIThinkSection />

            {/* Main Content Wrapper below (holds AmbientBackground, top fade overlay, and all subsequent sections) */}
            <div className="relative space-y-8 sm:space-y-12 md:space-y-16 pb-8 sm:pb-12">
              {/* Sleek, Subtle Ambient Background (Soft Radial Glows & Fine Grain Texture) */}
              <AmbientBackground />

              {/* Top Fade-in Overlay: Smooth gradient from solid #0a0a0d at top to transparent over top 15% */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[15%] pointer-events-none z-[1] bg-gradient-to-b from-[#0a0a0d] to-transparent select-none"
              />

              {/* Section cards sitting on top of the ambient background & fade overlay */}
              <div className="relative z-10 space-y-8 sm:space-y-12 md:space-y-16">
                {/* 3. Partner Logos (Trusted by Clients & Partners) */}
                <PartnerLogos />

                {/* 4. Stats Bar */}
                <StatsBar />

                {/* 5. About Section */}
                <AboutSection />

                {/* 6. Services Section (What I Do) */}
                <ServicesSection onSelectService={handleSelectService} />

                {/* 7. Featured Projects (My Recent Work with Stacking Scroll Effect) */}
                <ProjectsSection
                  onProjectClick={() => handleOpenModal('view-work')}
                  onViewAll={() => handleOpenModal('view-work')}
                />

                {/* 8. Testimonials Section (What Clients Say) */}
                <TestimonialsSection />

                {/* 9. Education & Skills Section */}
                <EducationProcessSection />

                {/* 10. Contact Banner (Let's Work Together!) */}
                <ContactBanner
                  onContactClick={() => handleOpenModal('get-started')}
                />
              </div>
            </div>
          </main>
        )}

        {/* 11. Footer */}
        <Footer
          isServicePage={!!currentServiceSlug}
          onNavigateHome={handleNavigateHome}
        />
      </motion.div>

      {/* Floating Frosted Glass Scroll to Top Button */}
      <ScrollToTopButton />

      {/* Interactive Modals */}
      <InteractiveModals
        type={activeModal}
        onClose={handleCloseModal}
      />
    </div>
  );
}
