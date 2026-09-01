import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  ArrowUpRight,
  BadgeCheck,
  Check,
  FileText,
  Download,
  Lock,
  MessageSquare,
  MessageCircle,
  User,
  Mail,
  Zap,
  ShieldCheck,
  Star,
  AlertCircle,
  TrendingUp,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProjectMediaFrame } from './ProjectMediaFrame';
import { optimizeCloudinaryUrl, optimizeCloudinaryVideoUrl } from '../utils/cloudinary';

export type ModalType = 'get-started' | 'view-work' | 'download-cv' | null;

interface InteractiveModalsProps {
  type: ModalType;
  onClose: () => void;
}

export const InteractiveModals: React.FC<InteractiveModalsProps> = ({ type, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState<string | null>(null);
  const [caseFilter, setCaseFilter] = useState<'All' | 'AI Products' | 'Frontend Engineering' | 'Mobile'>('All');

  // Handle ESC key and scroll lock
  useEffect(() => {
    if (!type) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [type, onClose]);

  if (!type) return null;

  const validateForm = () => {
    const errors: { name?: string; email?: string; message?: string } = {};
    if (!formData.name.trim()) {
      errors.name = 'Please enter your name.';
    }
    if (!formData.email.trim()) {
      errors.email = 'Please enter your work email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!formData.message.trim()) {
      errors.message = 'Please enter your message.';
    }
    return errors;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setServerError(null);
    setSubmitStatus('submitting');

    try {
      const response = await fetch('https://formspree.io/f/mvkoznjd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        const data = await response.json().catch(() => null);
        const errorMessage =
          data?.errors?.map((err: { message: string }) => err.message).join(', ') ||
          'Failed to send message. Please try again.';
        setServerError(errorMessage);
        setSubmitStatus('error');
      }
    } catch {
      setServerError('Network error. Please check your connection and try again.');
      setSubmitStatus('error');
    }
  };

  const allProjects = [
    {
      id: 'devclarity',
      number: '01',
      title: 'DevClarity',
      subtitle: 'AI Thinking Assistant',
      category: 'AI Product',
      group: 'AI Products',
      problem: 'Developers often jump straight into syntax without structuring architecture, leading to logical errors and hallucinated patterns.',
      caseStudy: 'Engineered an AI reasoning assistant using Groq API (Llama 3.3) providing rapid structured step breakdowns, architecture planning, and pseudo-code before writing production code.',
      url: 'https://dev-clarity-mv-git-0f5bdc-omigieelizabeth2018gmailcoms-projects.vercel.app/',
      tags: ['React', 'TypeScript', 'Groq API', 'Llama 3.3', 'Vite'],
      poster: optimizeCloudinaryUrl('https://res.cloudinary.com/eltckiww/image/upload/v1787638296/file_00000000b7a8821093a060f0daf00ec5_drbbns.png', { width: 640 }),
      video: optimizeCloudinaryVideoUrl('https://res.cloudinary.com/eltckiww/video/upload/v1787636084/lv_0_20260825062815_w9cgdc.mp4', { width: 720 }),
    },
    {
      id: 'gtco',
      number: '02',
      title: 'GTCO GTWorld App',
      subtitle: 'Mobile Banking Application',
      category: 'Frontend Engineering',
      group: 'Mobile',
      problem: 'Legacy banking applications often suffer from high user friction, slow biometric authentication handoffs, and rigid navigation systems.',
      caseStudy: 'Rebuilt screen-by-screen from Figma design systems into a high-performance React Native / Expo application with full KYC onboarding, Zustand ledger state, and biometric authorization.',
      url: 'https://gtbank-clone.onrender.com',
      tags: ['React Native', 'Expo Router', 'Zustand', 'NativeWind'],
      poster: optimizeCloudinaryUrl('https://res.cloudinary.com/eltckiww/image/upload/v1787638301/file_000000006d1c81f489645c17654aa4f5_ji7zee.png', { width: 640 }),
      video: optimizeCloudinaryVideoUrl('https://res.cloudinary.com/eltckiww/video/upload/v1787636076/lv_0_20260825055409_p86efa.mp4', { width: 720 }),
    },
    {
      id: 'coalition',
      number: '03',
      title: 'Coalition Patient Dashboard',
      subtitle: 'Healthcare Analytics System',
      category: 'Frontend Engineering',
      group: 'Frontend Engineering',
      problem: 'Medical practitioners struggle with fragmented EHR systems and poor longitudinal visualization of vital patient statistics over time.',
      caseStudy: 'Architected a responsive diagnostic dashboard tracking blood pressure, respiratory rates, and diagnostic history with Chart.js, dynamic timeframe filters, and diagnosis timelines.',
      url: 'https://dashboard-inky-chi.vercel.app/',
      tags: ['React', 'Chart.js', 'TypeScript', 'Tailwind CSS'],
      poster: optimizeCloudinaryUrl('https://res.cloudinary.com/eltckiww/image/upload/v1787638300/file_0000000031b881f4bf6538ecc069498b_yssaym.png', { width: 640 }),
      video: optimizeCloudinaryVideoUrl('https://res.cloudinary.com/eltckiww/video/upload/v1787636071/lv_0_20260825053937_cuvf9p.mp4', { width: 720 }),
    },
    {
      id: 'mini-portfolio',
      number: '04',
      title: 'Simple Mini Portfolio',
      subtitle: 'Personal Portfolio UI',
      category: 'Frontend Engineering',
      group: 'Frontend Engineering',
      problem: 'Heavy portfolio websites with excessive bloat degrade mobile performance and obscure key technical credentials from recruiters.',
      caseStudy: 'Built an ultra-fast, lightweight personal UI with fluid flexbox architecture, high-contrast typography hierarchy, and smooth CSS micro-interactions.',
      url: 'https://elizabeth-personal-website-six.vercel.app/',
      tags: ['HTML5', 'CSS3', 'Flexbox', 'Responsive UI'],
      poster: optimizeCloudinaryUrl('https://res.cloudinary.com/eltckiww/image/upload/v1787638298/file_000000009ec882109918718f6534a4f9_nvxgep.png', { width: 640 }),
      video: optimizeCloudinaryVideoUrl('https://res.cloudinary.com/eltckiww/video/upload/v1787636077/lv_0_20260825061727_jyzsrs.mp4', { width: 720 }),
    },
    {
      id: 'testimonials',
      number: '05',
      title: 'Testimonials Grid Section',
      subtitle: 'Complex Grid Layout',
      category: 'Frontend Engineering',
      group: 'Frontend Engineering',
      problem: 'Asymmetric multi-column review layouts frequently collapse or cause cumulative layout shifts across varying tablet and mobile breakpoints.',
      caseStudy: 'Implemented a robust CSS Grid masonry-inspired architecture with responsive card spanning, refined typographic rhythm, and strict WCAG contrast compliance.',
      url: 'https://testimonials-grid-section-umber.vercel.app/',
      tags: ['CSS Grid', 'Tailwind CSS', 'Responsive UI'],
      poster: optimizeCloudinaryUrl('https://res.cloudinary.com/eltckiww/image/upload/v1787638299/file_00000000420c8210b4eeb9dca36537eb_j6amfm.png', { width: 640 }),
      video: optimizeCloudinaryVideoUrl('https://res.cloudinary.com/eltckiww/video/upload/v1787636071/lv_0_20260825061159_shqxes.mp4', { width: 720 }),
    },
    {
      id: 'recipe',
      number: '06',
      title: 'Simple Omelette Recipe',
      subtitle: 'Clean Content Layout',
      category: 'Frontend Engineering',
      group: 'Frontend Engineering',
      problem: 'Content-heavy instructional web pages often lack semantic HTML structure, making accessibility screen reader navigation nearly impossible.',
      caseStudy: 'Crafted a fully accessible, semantic culinary platform featuring structured nutritional tables, customized list markers, and responsive fluid layout.',
      url: 'https://recipe-page-lac-three.vercel.app/',
      tags: ['Semantic HTML', 'CSS3', 'Typography', 'A11y'],
      poster: optimizeCloudinaryUrl('https://res.cloudinary.com/eltckiww/image/upload/v1787638302/file_00000000633882438944193d4b7eec70_frb9lp.png', { width: 640 }),
      video: optimizeCloudinaryVideoUrl('https://res.cloudinary.com/eltckiww/video/upload/v1787636064/lv_0_20260825060628_sbqcuh.mp4', { width: 720 }),
    },
    {
      id: 'blog-preview',
      number: '07',
      title: 'Blog Preview Card',
      subtitle: 'Interactive Content Card',
      category: 'Frontend Engineering',
      group: 'Frontend Engineering',
      problem: 'Static publication cards fail to provide intuitive touch feedback or clear interactive signifiers for mobile users.',
      caseStudy: 'Created a modular, reusable publication preview component with smooth hover lift transitions, dynamic tag badges, and crisp typography.',
      url: 'https://blog-preview-card-pi-lovat.vercel.app/',
      tags: ['HTML5', 'CSS3', 'Tailwind CSS', 'Micro-interactions'],
      poster: optimizeCloudinaryUrl('https://res.cloudinary.com/eltckiww/image/upload/v1787638300/file_00000000b4b48210a90ba9bb2a5aacce_csviy7.png', { width: 640 }),
      video: optimizeCloudinaryVideoUrl('https://res.cloudinary.com/eltckiww/video/upload/v1787636067/lv_0_20260825055031_iz2037.mp4', { width: 720 }),
    },
    {
      id: 'qr-code',
      number: '08',
      title: 'QR Code Component',
      subtitle: 'Component UI Design',
      category: 'Frontend Engineering',
      group: 'Frontend Engineering',
      problem: 'Physical onboarding and scanner cards frequently suffer from distorted scan frames and unclear instructional copy.',
      caseStudy: 'Built a pixel-perfect QR code preview card matching exact design specs with clean CSS styling, optical centering, and elevation shadows.',
      url: 'https://qr-code-component-gamma-liart.vercel.app/',
      tags: ['HTML5', 'CSS3', 'Responsive UI'],
      poster: optimizeCloudinaryUrl('https://res.cloudinary.com/eltckiww/image/upload/v1788190364/file_000000004cbc81f49882c8d0d631a475_jhb3gt.png', { width: 640 }),
      video: optimizeCloudinaryVideoUrl('https://res.cloudinary.com/eltckiww/video/upload/v1788190374/lv_0_20260831161637_bgnfwi.mp4', { width: 720 }),
    },
    {
      id: 'social-links',
      number: '09',
      title: 'Social Links Profile',
      subtitle: 'Profile Interface Card',
      category: 'Frontend Engineering',
      group: 'Frontend Engineering',
      problem: 'Bio-link hubs regularly load slowly and feature cramped touch targets that fail mobile accessibility guidelines.',
      caseStudy: 'Engineered a high-contrast bio-link interface with accessible >=44px touch targets, smooth keyboard focus rings, and zero dependencies.',
      url: 'https://social-links-profile-neon-rho.vercel.app/',
      tags: ['HTML5', 'CSS3', 'Flexbox', 'Mobile-First'],
      poster: optimizeCloudinaryUrl('https://res.cloudinary.com/eltckiww/image/upload/v1788190364/file_000000009f7c81f4a5bf5f45414a9e8a_bdomh4.png', { width: 640 }),
      video: optimizeCloudinaryVideoUrl('https://res.cloudinary.com/eltckiww/video/upload/v1788190372/lv_0_20260831160550_gux19m.mp4', { width: 720 }),
    },
    {
      id: 'product-preview',
      number: '10',
      title: 'Product Preview Card',
      subtitle: 'E-Commerce Component',
      category: 'Frontend Engineering',
      group: 'Frontend Engineering',
      problem: 'E-commerce product cards often misalign promotional pricing and crop product images awkwardly on mobile screens.',
      caseStudy: 'Developed an e-commerce preview card with responsive image art-direction switching, clear price hierarchy, and accessible add-to-cart actions.',
      url: 'https://product-preview-card-iota-two.vercel.app/',
      tags: ['HTML5', 'CSS3', 'Responsive Design'],
      poster: optimizeCloudinaryUrl('https://res.cloudinary.com/eltckiww/image/upload/v1788190366/file_00000000144081f485f854056aa8a786_frstcz.png', { width: 640 }),
      video: optimizeCloudinaryVideoUrl('https://res.cloudinary.com/eltckiww/video/upload/v1788190376/lv_0_20260831161252_xqbtdm.mp4', { width: 720 }),
    },
  ];

  const filteredProjects = allProjects.filter((p) => {
    if (caseFilter === 'All') return true;
    return p.group === caseFilter;
  });

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-5 md:p-8 bg-black/85 backdrop-blur-xl overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby={
            type === 'view-work'
              ? 'modal-case-studies-heading'
              : type === 'download-cv'
              ? 'modal-resume-heading'
              : 'modal-get-started-heading'
          }
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className={`relative w-full ${
            type === 'view-work'
              ? 'max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-6xl xl:max-w-7xl p-4 sm:p-6 md:p-8 lg:p-9 h-auto my-auto sm:my-8'
              : type === 'download-cv'
              ? 'max-w-[480px] md:max-w-[520px] lg:max-w-[560px] p-4 sm:p-5 md:p-6 h-auto my-auto overflow-hidden'
              : 'max-w-[500px] sm:max-w-[580px] md:max-w-[660px] lg:max-w-[700px] p-4 sm:p-6 md:p-7 h-auto my-auto'
          } bg-[#0B0D14] border border-[#7C3AED]/30 rounded-[20px] sm:rounded-[24px] md:rounded-[28px] shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_60px_rgba(124,58,237,0.18)] flex flex-col`}
        >
          {/* Ambient Background Glows & VisionOS Starburst */}
          <div className="absolute -top-16 -right-16 w-60 h-60 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
          <div className="absolute top-1/2 -left-20 w-48 h-48 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
          <div className="absolute -bottom-10 right-10 w-40 h-40 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

          {/* Celestial dotted overlay pattern */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none rounded-[30px] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"
            aria-hidden="true"
          />

          {/* =========================================================================
              MODAL 1: FEATURED CASE STUDIES
             ========================================================================= */}
          {type === 'view-work' && (
            <div className="relative z-10 flex flex-col space-y-3.5 sm:space-y-4 md:space-y-5">
              {/* Header Bar */}
              <div className="flex items-start justify-between">
                {/* Glass Squircle Icon */}
                <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-13 md:h-13 rounded-xl sm:rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-purple-500/30 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.25)] flex items-center justify-center relative backdrop-blur-md" aria-hidden="true">
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-purple-300/40 to-transparent" />
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" />
                </div>

                {/* Circular Glass Close Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClose();
                  }}
                  className="relative z-30 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white/[0.06] hover:bg-white/[0.15] border border-white/15 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-[0_0_12px_rgba(0,0,0,0.5)] active:scale-95 focus-visible:ring-2 focus-visible:ring-[#FF4D1A] focus-visible:outline-none"
                  aria-label="Close featured case studies dialog"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5 pointer-events-none" aria-hidden="true" />
                </button>
              </div>

              {/* Title & Subtitle */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-3">
                <div>
                  <h2 
                    id="modal-case-studies-heading"
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight"
                  >
                    Featured Case{' '}
                    <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-300 bg-clip-text text-transparent">
                      Studies
                    </span>
                  </h2>
                  <p className="text-zinc-400 text-[11px] sm:text-xs md:text-sm lg:text-base mt-1 sm:mt-1.5 leading-relaxed">
                    Selected AI-integrated applications, mobile systems & frontend engineering builds.
                  </p>
                </div>
                <div className="text-[10px] sm:text-[11px] md:text-xs font-mono px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 self-start sm:self-auto shrink-0">
                  {filteredProjects.length} Projects
                </div>
              </div>

              {/* Category Filter Tabs */}
              <div 
                role="tablist"
                aria-label="Filter case studies by category"
                className="flex items-center gap-1 sm:gap-1.5 md:gap-2 p-1 rounded-xl bg-white/[0.03] border border-white/10 overflow-x-auto no-scrollbar"
              >
                {(['All', 'AI Products', 'Frontend Engineering', 'Mobile'] as const).map((filter) => (
                  <button
                    key={filter}
                    role="tab"
                    aria-selected={caseFilter === filter}
                    onClick={() => setCaseFilter(filter)}
                    className={`px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg text-[10px] sm:text-xs md:text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none ${
                      caseFilter === filter
                        ? 'bg-purple-600/40 text-white border border-purple-400/40 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] border border-transparent'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Responsive Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-7 gap-y-6 sm:gap-y-8 md:gap-y-9 pt-2">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="w-full bg-[#0B0D14] rounded-xl sm:rounded-2xl border border-[#7C3AED]/25 hover:border-[#7C3AED]/55 transition-all duration-300 ease-out hover:scale-[1.01] active:scale-[0.99] shadow-[0_0_15px_rgba(124,58,237,0.08),0_8px_30px_rgba(0,0,0,0.85)] hover:shadow-[0_0_24px_rgba(124,58,237,0.2),0_15px_45px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden group cursor-pointer relative"
                    onClick={() => window.open(project.url, '_blank', 'noopener,noreferrer')}
                  >
                    {/* Media Frame – Edge to Edge Preview */}
                    <div className="w-full aspect-[16/9] max-h-[175px] sm:max-h-[195px] md:max-h-[215px] relative overflow-hidden bg-[#0B0D14] shrink-0">
                      <ProjectMediaFrame
                        poster={project.poster}
                        video={project.video}
                        title={project.title}
                        category={project.category}
                        url={project.url}
                      />

                      {/* Category Pill Badge Overlaid on Image Top-Right */}
                      <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-20 inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full bg-[#120F20]/90 backdrop-blur-md border border-[#7C3AED]/30 shadow-[0_0_8px_rgba(124,58,237,0.2)]">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-[#A855F7] shadow-[0_0_4px_#A855F7]" aria-hidden="true" />
                        <span className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-white tracking-wide">
                          {project.category}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Details Body */}
                    <div className="p-3 sm:p-3.5 md:p-4 bg-[#0B0D14] border-t border-white/5 flex-1 flex flex-col justify-between">
                      <div className="space-y-2.5 sm:space-y-3">
                        {/* Title & External Link Button */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm sm:text-base md:text-lg font-bold text-white tracking-tight group-hover:text-[#FF4D1A] transition-colors line-clamp-1">
                              {project.title}
                            </h3>
                            <p className="text-[10.5px] sm:text-[11.5px] md:text-xs text-zinc-400 font-medium mt-0.5 line-clamp-1">
                              {project.subtitle}
                            </p>
                          </div>

                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Open project live demo: ${project.title}`}
                            className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/[0.04] border border-white/10 text-[#FF4D1A] group-hover:bg-[#FF4D1A]/10 group-hover:border-[#FF4D1A]/40 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shadow-[0_0_8px_rgba(255,77,26,0.1)] flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D1A] focus-visible:outline-none"
                          >
                            <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
                          </a>
                        </div>

                        {/* Recruiter Section 1: Problem Solved */}
                        <div className="p-2 sm:p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                          <div className="text-[9px] sm:text-[10px] md:text-[10.5px] font-bold text-[#FF7A00] uppercase tracking-wider flex items-center gap-1">
                            <span>PROBLEM SOLVED</span>
                          </div>
                          <p className="text-[10.5px] sm:text-[11.5px] md:text-xs text-zinc-300/95 leading-relaxed mt-1 font-normal">
                            {project.problem}
                          </p>
                        </div>

                        {/* Recruiter Section 2: Case Study & Key Solution */}
                        <div className="p-2 sm:p-2.5 rounded-lg bg-purple-950/20 border border-purple-500/15">
                          <div className="text-[9px] sm:text-[10px] md:text-[10.5px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                            <TrendingUp className="w-3 h-3 text-purple-300 shrink-0" aria-hidden="true" />
                            <span>CASE STUDY & IMPACT</span>
                          </div>
                          <p className="text-[10.5px] sm:text-[11.5px] md:text-xs text-zinc-400 leading-relaxed mt-1 font-normal">
                            {project.caseStudy}
                          </p>
                        </div>
                      </div>

                      {/* Tech Stack Chips & Live Link */}
                      <div className="mt-2.5 pt-2.5 border-t border-white/5">
                        <div className="flex flex-wrap gap-1.5">
                          {project.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] md:text-[10.5px] font-medium tracking-wide text-purple-200 bg-[#7C3AED]/15 border border-[#7C3AED]/25"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              MODAL 2: RESUME / PROFILE & CREDENTIALS
             ========================================================================= */}
          {type === 'download-cv' && (
            <div className="relative z-10 flex flex-col space-y-3 sm:space-y-3.5 md:space-y-4">
              {/* Header Bar */}
              <div className="flex items-start justify-between">
                {/* Glass Squircle Icon */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-purple-500/30 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.25)] flex items-center justify-center relative backdrop-blur-md" aria-hidden="true">
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-purple-300/40 to-transparent" />
                  <BadgeCheck className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300" />
                </div>

                {/* Circular Glass Close Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClose();
                  }}
                  className="relative z-30 w-8 h-8 sm:w-9 sm:h-9 md:w-9 md:h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.15] border border-white/15 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-[#FF4D1A] focus-visible:outline-none"
                  aria-label="Close credentials and resume dialog"
                >
                  <X className="w-4 h-4 md:w-4.5 md:h-4.5 pointer-events-none" aria-hidden="true" />
                </button>
              </div>

              {/* Title & Subtitle with Orbital lines */}
              <div className="relative">
                {/* Subtle orbital trajectory vector lines */}
                <svg
                  className="absolute -top-6 right-0 w-36 h-20 pointer-events-none opacity-35 hidden sm:block"
                  viewBox="0 0 180 100"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M 10 90 Q 90 10 170 30"
                    stroke="#A855F7"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <circle cx="115" cy="40" r="3" fill="#A855F7" />
                  <circle cx="150" cy="55" r="2" fill="#FF7A00" />
                </svg>

                <div className="text-[10px] sm:text-xs font-bold text-purple-400 uppercase tracking-widest">
                  PROFILE & CREDENTIALS
                </div>
                <h2 
                  id="modal-resume-heading"
                  className="text-xl sm:text-2xl md:text-[26px] lg:text-3xl font-extrabold text-white tracking-tight mt-0.5 sm:mt-1"
                >
                  Omigie Elizabeth
                </h2>
                <p className="text-zinc-400 text-xs sm:text-sm mt-0.5 sm:mt-1 font-medium">
                  AI Product Engineer & Frontend Engineer
                </p>
              </div>

              {/* Credential Glass Card (3 Rows) */}
              <div className="rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 p-3 sm:p-3.5 md:p-4.5 space-y-2.5 sm:space-y-3 md:space-y-3.5 backdrop-blur-md">
                {/* Row 1: Frontend Engineering */}
                <div className="flex items-start gap-2.5 sm:gap-3 md:gap-3.5">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/40 flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_8px_rgba(255,122,0,0.2)]" aria-hidden="true">
                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF7A00] stroke-[3]" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs sm:text-sm md:text-[15px]">Frontend Engineering</div>
                    <div className="text-[10px] sm:text-xs text-zinc-400 font-mono mt-0.5">
                      React • React Native • TypeScript
                    </div>
                    <p className="text-[11px] sm:text-xs md:text-[13px] text-zinc-400/80 mt-0.5 leading-snug">
                      Building fast, accessible and scalable user experiences.
                    </p>
                  </div>
                </div>

                {/* Row 2: AI Product Engineering */}
                <div className="flex items-start gap-2.5 sm:gap-3 md:gap-3.5 pt-2 sm:pt-2.5 md:pt-3 border-t border-white/5">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/40 flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_8px_rgba(255,122,0,0.2)]" aria-hidden="true">
                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF7A00] stroke-[3]" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs sm:text-sm md:text-[15px]">AI Product Engineering</div>
                    <div className="text-[10px] sm:text-xs text-zinc-400 font-mono mt-0.5">
                      Groq API • LLM Integrations
                    </div>
                    <p className="text-[11px] sm:text-xs md:text-[13px] text-zinc-400/80 mt-0.5 leading-snug">
                      Integrating AI where it drives real user value and product impact.
                    </p>
                  </div>
                </div>

                {/* Row 3: Background & Education */}
                <div className="flex items-start gap-2.5 sm:gap-3 md:gap-3.5 pt-2 sm:pt-2.5 md:pt-3 border-t border-white/5">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/40 flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_8px_rgba(255,122,0,0.2)]" aria-hidden="true">
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF7A00] stroke-[3]" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs sm:text-sm md:text-[15px]">Background & Education</div>
                    <div className="text-[10px] sm:text-xs text-zinc-400 mt-0.5">
                      Petroleum Engineering • Udacity Scholar (2022)
                    </div>
                    <p className="text-[11px] sm:text-xs md:text-[13px] text-zinc-400/80 mt-0.5 leading-snug">
                      Strong analytical foundation with a passion for technology and innovation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Resume Strip */}
              <div className="p-2.5 sm:p-3 md:p-3.5 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center gap-2.5 sm:gap-3 md:gap-3.5">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 flex items-center justify-center shrink-0" aria-hidden="true">
                    <FileText className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm md:text-[15px] font-semibold text-white">Resume.pdf</div>
                    <div className="text-[10px] sm:text-xs text-zinc-400">Updated July 2026</div>
                  </div>
                </div>

                <a
                  href="https://raw.githubusercontent.com/tech-goddezz/My-Resume/main/Omigie_Elizabeth_Resume(CV).pdf"
                  download="OMIGIE_ELIZABETH_RESUME.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download Omigie Elizabeth Resume PDF"
                  className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-white/[0.04] hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/40 flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none"
                >
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
                </a>
              </div>

              {/* Main Download Button */}
              <a
                href="https://raw.githubusercontent.com/tech-goddezz/My-Resume/main/Omigie_Elizabeth_Resume(CV).pdf"
                download="OMIGIE_ELIZABETH_RESUME.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                aria-label="Download Omigie Elizabeth full resume"
                className="w-full py-2.5 sm:py-3 md:py-3.5 px-4 sm:px-5 md:px-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#D946EF] hover:brightness-110 text-white font-bold text-xs sm:text-sm md:text-[13px] uppercase tracking-wider flex items-center justify-center gap-2 md:gap-2.5 transition-all shadow-[0_0_25px_rgba(139,92,246,0.35)] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D1A] focus-visible:outline-none"
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" aria-hidden="true" />
                <span>DOWNLOAD RESUME</span>
              </a>

              {/* Bottom Security / Privacy Note */}
              <div className="flex items-center justify-center gap-1.5 text-zinc-500 text-[10px] sm:text-xs">
                <Lock className="w-3 h-3 pointer-events-none" aria-hidden="true" />
                <span>Your information is secure and private</span>
              </div>
            </div>
          )}

          {/* =========================================================================
              MODAL 3: CONTACT ("LET'S BUILD SOMETHING EXCEPTIONAL")
             ========================================================================= */}
          {type === 'get-started' && (
            submitStatus === 'success' ? (
              <div className="relative z-10 flex flex-col items-center justify-center text-center py-4 sm:py-6 space-y-4 sm:space-y-5">
                {/* Header Close Button */}
                <div className="w-full flex justify-end">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSubmitStatus('idle');
                      onClose();
                    }}
                    className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white/[0.06] hover:bg-white/[0.15] border border-white/15 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-[0_0_12px_rgba(0,0,0,0.5)] focus-visible:ring-2 focus-visible:ring-[#FF4D1A] focus-visible:outline-none"
                    aria-label="Close confirmation dialog"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" aria-hidden="true" />
                  </button>
                </div>

                {/* Success Icon */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.35)] text-purple-300" aria-hidden="true">
                  <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-[#A855F7]" />
                </div>

                <div className="space-y-1 sm:space-y-1.5 max-w-md mx-auto">
                  <div className="text-[10px] sm:text-xs font-bold text-purple-400 uppercase tracking-widest">
                    THANK YOU
                  </div>
                  <h2 
                    id="modal-get-started-heading"
                    className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight"
                  >
                    Message received!
                  </h2>
                  <p className="text-zinc-300 text-xs sm:text-sm md:text-base leading-relaxed pt-1">
                    Message sent — I'll get back to you within 24h
                  </p>
                </div>

                {/* Disabled Button to Prevent Double-Submits */}
                <div className="w-full pt-2">
                  <button
                    type="button"
                    disabled
                    className="w-full py-2.5 sm:py-3 md:py-3.5 px-4 sm:px-5 rounded-xl bg-white/[0.05] border border-white/10 text-zinc-400 font-bold text-xs sm:text-sm md:text-base uppercase tracking-wider flex items-center justify-center gap-2 cursor-not-allowed opacity-75"
                  >
                    <Check className="w-4 h-4 text-[#A855F7]" aria-hidden="true" />
                    <span>MESSAGE SENT</span>
                  </button>
                </div>

                {/* Bottom Privacy Note */}
                <div className="flex items-center justify-center gap-1.5 text-zinc-400 text-[10px] sm:text-xs pt-1">
                  <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-400" aria-hidden="true" />
                  <span>We respect your privacy. No spam, ever.</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="relative z-10 flex flex-col space-y-3 sm:space-y-3.5 md:space-y-4">
                {/* Header Bar */}
                <div className="flex items-start justify-between">
                  {/* Glass Squircle Icon */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-purple-500/30 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.25)] flex items-center justify-center relative backdrop-blur-md" aria-hidden="true">
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-purple-300/40 to-transparent" />
                    <MessageSquare className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-purple-300" />
                  </div>

                  {/* Circular Glass Close Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onClose();
                    }}
                    className="relative z-30 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white/[0.06] hover:bg-white/[0.15] border border-white/15 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-[0_0_12px_rgba(0,0,0,0.5)] focus-visible:ring-2 focus-visible:ring-[#FF4D1A] focus-visible:outline-none"
                    aria-label="Close contact dialog"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" aria-hidden="true" />
                  </button>
                </div>

                {/* Heading */}
                <div>
                  <div className="text-[10px] sm:text-xs md:text-[13px] font-bold text-purple-400 uppercase tracking-widest">
                    GET IN TOUCH
                  </div>
                  <h2 
                    id="modal-get-started-heading"
                    className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-extrabold text-white tracking-tight leading-tight mt-1"
                  >
                    Let's Build Something <span className="text-[#FF5500]">Exceptional.</span>
                  </h2>
                  <p className="text-zinc-300/90 text-xs sm:text-sm md:text-base mt-1 sm:mt-1.5 leading-relaxed">
                    Whether it's an ambitious product idea or an AI engineering challenge, I'd love to hear about it and see how I can help.
                  </p>
                </div>

                {/* Server Error Alert if POST Fails */}
                {serverError && (
                  <div className="p-2 sm:p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-center gap-2" role="alert">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" aria-hidden="true" />
                    <span>{serverError}</span>
                  </div>
                )}

                {/* Floating Input Fields */}
                <div className="space-y-2 sm:space-y-2.5">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="contact-name-input" className="sr-only">Your Name</label>
                    <div className="relative flex items-center">
                      <User className="absolute left-3.5 w-4 h-4 sm:w-4.5 sm:h-4.5 text-zinc-500 pointer-events-none" aria-hidden="true" />
                      <input
                        id="contact-name-input"
                        type="text"
                        placeholder="Your Name"
                        value={formData.name}
                        disabled={submitStatus === 'submitting'}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, name: e.target.value }));
                          if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }));
                          if (serverError) setServerError(null);
                        }}
                        className={`w-full bg-white/[0.03] focus:bg-white/[0.06] border ${
                          fieldErrors.name ? 'border-red-500/70 focus:border-red-500' : 'border-white/10 focus:border-purple-500/60'
                        } rounded-xl pl-10 sm:pl-11 pr-3.5 py-2.5 sm:py-3 text-xs sm:text-sm md:text-base text-white placeholder-zinc-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D1A] transition-all`}
                      />
                    </div>
                    {fieldErrors.name && (
                      <p className="text-[11px] sm:text-xs text-red-400 mt-1 pl-1 flex items-center gap-1" role="alert">
                        <AlertCircle className="w-3 h-3 shrink-0" aria-hidden="true" />
                        <span>{fieldErrors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="contact-email-input" className="sr-only">Work Email</label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3.5 w-4 h-4 sm:w-4.5 sm:h-4.5 text-zinc-500 pointer-events-none" aria-hidden="true" />
                      <input
                        id="contact-email-input"
                        type="email"
                        placeholder="Work Email"
                        value={formData.email}
                        disabled={submitStatus === 'submitting'}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, email: e.target.value }));
                          if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                          if (serverError) setServerError(null);
                        }}
                        className={`w-full bg-white/[0.03] focus:bg-white/[0.06] border ${
                          fieldErrors.email ? 'border-red-500/70 focus:border-red-500' : 'border-white/10 focus:border-purple-500/60'
                        } rounded-xl pl-10 sm:pl-11 pr-3.5 py-2.5 sm:py-3 text-xs sm:text-sm md:text-base text-white placeholder-zinc-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D1A] transition-all`}
                      />
                    </div>
                    {fieldErrors.email && (
                      <p className="text-[11px] sm:text-xs text-red-400 mt-1 pl-1 flex items-center gap-1" role="alert">
                        <AlertCircle className="w-3 h-3 shrink-0" aria-hidden="true" />
                        <span>{fieldErrors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* Message Field */}
                  <div>
                    <label htmlFor="contact-message-input" className="sr-only">Message</label>
                    <div className="relative flex items-start">
                      <MessageSquare className="absolute left-3.5 top-3 w-4 h-4 sm:w-4.5 sm:h-4.5 text-zinc-500 pointer-events-none" aria-hidden="true" />
                      <textarea
                        id="contact-message-input"
                        rows={2}
                        placeholder="Tell me about your product, startup, or engineering challenge..."
                        value={formData.message}
                        disabled={submitStatus === 'submitting'}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, message: e.target.value }));
                          if (fieldErrors.message) setFieldErrors((prev) => ({ ...prev, message: undefined }));
                          if (serverError) setServerError(null);
                        }}
                        className={`w-full bg-white/[0.03] focus:bg-white/[0.06] border ${
                          fieldErrors.message ? 'border-red-500/70 focus:border-red-500' : 'border-white/10 focus:border-purple-500/60'
                        } rounded-xl pl-10 sm:pl-11 pr-3.5 py-2.5 sm:py-3 text-xs sm:text-sm md:text-base text-white placeholder-zinc-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D1A] transition-all resize-none min-h-[60px] sm:min-h-[70px]`}
                      />
                    </div>
                    {fieldErrors.message && (
                      <p className="text-[11px] sm:text-xs text-red-400 mt-1 pl-1 flex items-center gap-1" role="alert">
                        <AlertCircle className="w-3 h-3 shrink-0" aria-hidden="true" />
                        <span>{fieldErrors.message}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Primary Button with Loading State */}
                <button
                  type="submit"
                  disabled={submitStatus === 'submitting'}
                  className={`w-full py-2.5 sm:py-3 md:py-3.5 px-4 sm:px-5 rounded-xl bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#D946EF] ${
                    submitStatus === 'submitting'
                      ? 'opacity-80 cursor-not-allowed'
                      : 'hover:brightness-110 cursor-pointer'
                  } text-white font-bold text-xs sm:text-sm md:text-base uppercase tracking-wider flex items-center justify-between transition-all shadow-[0_0_20px_rgba(139,92,246,0.35)] group focus-visible:ring-2 focus-visible:ring-[#FF4D1A] focus-visible:outline-none`}
                >
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    {submitStatus === 'submitting' ? (
                      <>
                        <Loader2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white animate-spin shrink-0" aria-hidden="true" />
                        <span className="tracking-wider font-bold">SENDING...</span>
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white shrink-0" aria-hidden="true" />
                        <span className="tracking-wider font-bold">START THE CONVERSATION</span>
                      </>
                    )}
                  </div>
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-all">
                    {submitStatus === 'submitting' ? (
                      <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white animate-spin" aria-hidden="true" />
                    ) : (
                      <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" aria-hidden="true" />
                    )}
                  </div>
                </button>

                {/* Trust Section (3 Badges) */}
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 pt-0.5">
                  {/* Badge 1 */}
                  <div className="p-2 sm:p-2.5 md:p-3 rounded-xl bg-white/[0.02] border border-white/10 text-center backdrop-blur-md">
                    <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-purple-400 mx-auto" aria-hidden="true" />
                    <div className="text-[11px] sm:text-xs md:text-sm font-bold text-white mt-1">
                      Fast Response
                    </div>
                    <div className="text-[9px] sm:text-[10px] md:text-xs text-zinc-400 mt-0.5">
                      Usually within 24h
                    </div>
                  </div>

                  {/* Badge 2 */}
                  <div className="p-2 sm:p-2.5 md:p-3 rounded-xl bg-white/[0.02] border border-white/10 text-center backdrop-blur-md">
                    <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-purple-400 mx-auto" aria-hidden="true" />
                    <div className="text-[11px] sm:text-xs md:text-sm font-bold text-white mt-1">
                      Confidential
                    </div>
                    <div className="text-[9px] sm:text-[10px] md:text-xs text-zinc-400 mt-0.5">
                      Your ideas are safe
                    </div>
                  </div>

                  {/* Badge 3 */}
                  <div className="p-2 sm:p-2.5 md:p-3 rounded-xl bg-white/[0.02] border border-white/10 text-center backdrop-blur-md">
                    <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-purple-400 mx-auto" aria-hidden="true" />
                    <div className="text-[11px] sm:text-xs md:text-sm font-bold text-white mt-1">
                      Open to Roles
                    </div>
                    <div className="text-[9px] sm:text-[10px] md:text-xs text-zinc-400 mt-0.5">
                      Frontend & AI
                    </div>
                  </div>
                </div>

                {/* Bottom Privacy Statement */}
                <div className="flex items-center justify-center gap-1.5 text-zinc-400 text-[10px] sm:text-xs md:text-[13px] pt-0.5">
                  <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-400" aria-hidden="true" />
                  <span>We respect your privacy. No spam, ever.</span>
                </div>
              </form>
            )
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
