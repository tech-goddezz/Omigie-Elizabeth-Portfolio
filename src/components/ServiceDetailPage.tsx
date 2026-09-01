import React, { useEffect } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  Layout,
  Code,
  Palette,
  CheckCircle2,
  Compass,
  Layers,
  Workflow,
  MessageCircle,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useScrollAnimation } from '../utils/motion';

export type ServiceSlug =
  | 'frontend-engineering'
  | 'ai-product-integration'
  | 'product-prototyping';

export interface ServiceDetailData {
  slug: ServiceSlug;
  path: string;
  title: string;
  eyebrow: string;
  accentColor: string;
  glowColor: string;
  borderColor: string;
  iconBg: string;
  iconType: 'layout' | 'code' | 'palette';
  description: string;
  skills: string[];
  highlights: {
    title: string;
    desc: string;
  }[];
  ctaTitle: string;
  ctaDesc: string;
}

export const SERVICES_DATA: Record<ServiceSlug, ServiceDetailData> = {
  'frontend-engineering': {
    slug: 'frontend-engineering',
    path: '/services/frontend-engineering',
    title: 'Frontend Engineering',
    eyebrow: 'WEB & MOBILE INTERFACES',
    accentColor: '#FF4D1A',
    glowColor: 'rgba(255, 77, 26, 0.18)',
    borderColor: 'border-[#FF4D1A]/30',
    iconBg: 'bg-orange-500/10 border-orange-500/30 text-[#FF4D1A]',
    iconType: 'layout',
    description:
      'Building fast, responsive interfaces with React, React Native, and TypeScript. From Figma handoff to deployed product, focused on performance, accessibility, and clean component architecture.',
    skills: [
      'React',
      'React Native (Expo Router)',
      'TypeScript',
      'Tailwind CSS',
      'NativeWind',
    ],
    highlights: [
      {
        title: 'Pixel-Perfect Figma Translation',
        desc: 'Translating design specifications into responsive, accessible components with fluid animations.',
      },
      {
        title: 'Cross-Platform Mobile Development',
        desc: 'Crafting native-feeling iOS and Android user experiences with Expo Router and NativeWind.',
      },
      {
        title: 'Performance & Optimization',
        desc: 'Fine-tuning render cycles, asset loading, and bundle sizes for maximum speed and Core Web Vitals.',
      },
      {
        title: 'Modular Component Architecture',
        desc: 'Structuring typed, maintainable, and thoroughly reusable component hierarchies and state flows.',
      },
    ],
    ctaTitle: 'Ready to build high-performance interfaces?',
    ctaDesc:
      "Let's discuss how we can bring your designs to life with robust React and React Native engineering.",
  },
  'ai-product-integration': {
    slug: 'ai-product-integration',
    path: '/services/ai-product-integration',
    title: 'AI Product Integration',
    eyebrow: 'LLM & FAST INFERENCE APIS',
    accentColor: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.18)',
    borderColor: 'border-[#A855F7]/30',
    iconBg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    iconType: 'code',
    description:
      'Embedding LLM-powered features into real products using the Groq API and Llama 3.3 — not AI for its own sake, but AI that solves an actual user problem.',
    skills: ['Groq API', 'Llama 3.3', 'React', 'TypeScript', 'Supabase'],
    highlights: [
      {
        title: 'Ultra-Fast Inference Workflows',
        desc: 'Leveraging the Groq LPU engine and Llama 3.3 for sub-second model responses and live streaming.',
      },
      {
        title: 'Pragmatic, User-Centric AI',
        desc: 'Designing intelligent assistance, code analysis, and smart automation that eliminate real product friction.',
      },
      {
        title: 'Secure Full-Stack Data Pipelines',
        desc: 'Connecting inference endpoints with Supabase persistence, role-based auth, and edge functions.',
      },
      {
        title: 'Resilient UI Streaming & Feedback',
        desc: 'Implementing error boundaries, optimistic updates, and token streaming with crystal-clear UX states.',
      },
    ],
    ctaTitle: 'Want to embed pragmatic AI into your product?',
    ctaDesc:
      'Let’s build intelligent, lightning-fast features powered by Groq and modern LLM architectures.',
  },
  'product-prototyping': {
    slug: 'product-prototyping',
    path: '/services/product-prototyping',
    title: 'Product Prototyping',
    eyebrow: 'RAPID VALIDATION & MVP BUILDS',
    accentColor: '#FF7A00',
    glowColor: 'rgba(255, 122, 0, 0.18)',
    borderColor: 'border-[#FF7A00]/30',
    iconBg: 'bg-orange-500/10 border-orange-500/30 text-[#FF7A00]',
    iconType: 'palette',
    description:
      'Turning a rough idea or Figma concept into a working, testable product quickly, so direction can be validated before investing in a full build.',
    skills: ['Figma', 'React', 'Tailwind CSS', 'Vite', 'Vercel'],
    highlights: [
      {
        title: 'Rapid Concept-to-Code',
        desc: 'Transforming Figma wireframes and ideas into interactive, working web apps in days.',
      },
      {
        title: 'Stakeholder & User Validation',
        desc: 'Providing functional test builds to validate core mechanics before allocating long-term engineering resources.',
      },
      {
        title: 'Technical Feasibility Spikes',
        desc: 'Evaluating integration bottlenecks and architecture viability with real, runnable prototypes.',
      },
      {
        title: 'Zero-to-One Deployment',
        desc: 'Configuring instantaneous preview deployments on Vite and Vercel for fast feedback loops.',
      },
    ],
    ctaTitle: 'Have a product concept you need to validate?',
    ctaDesc:
      'Let’s rapidly turn your idea into a working, testable prototype ready for users and stakeholders.',
  },
};

interface ServiceDetailPageProps {
  slug: ServiceSlug;
  onBack: () => void;
  onConnect: () => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  slug,
  onBack,
  onConnect,
}) => {
  const { getFadeUp } = useScrollAnimation();
  const service = SERVICES_DATA[slug] || SERVICES_DATA['frontend-engineering'];

  // Scroll to top upon page entrance
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const renderIcon = () => {
    switch (service.iconType) {
      case 'layout':
        return <Layout className="w-7 h-7" />;
      case 'code':
        return <Code className="w-7 h-7" />;
      case 'palette':
        return <Palette className="w-7 h-7" />;
      default:
        return <Layout className="w-7 h-7" />;
    }
  };

  return (
    <div className="relative z-10 px-4 sm:px-6 md:px-12 max-w-5xl mx-auto pt-6 sm:pt-8 md:pt-10 pb-16 sm:pb-24">
      {/* Top Navigation Bar: Back Button */}
      <motion.div {...getFadeUp(0, 15, 0.4)} className="mb-4 sm:mb-6">
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#FF4D1A]/50 text-zinc-300 hover:text-white text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer shadow-sm"
          aria-label="Back to Services"
        >
          <ArrowLeft className="w-4 h-4 text-[#FF4D1A] group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Back to Services</span>
        </button>
      </motion.div>

      {/* Main Service Card Container matching existing design system */}
      <motion.div
        {...getFadeUp(0.08, 20, 0.45)}
        className="relative rounded-3xl bg-black/30 border border-white/10 p-6 sm:p-10 md:p-12 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] overflow-hidden"
      >
        {/* Ambient Radial Accent Glow */}
        <div
          aria-hidden="true"
          style={{ backgroundColor: service.accentColor }}
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl pointer-events-none"
        />

        {/* Header Block: Icon + Eyebrow + Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 pb-8 border-b border-white/10">
          <div
            className={`p-4 rounded-2xl ${service.iconBg} border shadow-lg flex items-center justify-center shrink-0`}
          >
            {renderIcon()}
          </div>
          <div className="space-y-1.5">
            <div
              style={{ color: service.accentColor }}
              className="text-xs font-bold uppercase tracking-[0.2em]"
            >
              {service.eyebrow}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {service.title}
            </h1>
          </div>
        </div>

        {/* Expanded Description Section */}
        <div className="py-8 space-y-4">
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#FF4D1A]" />
            <span>OVERVIEW & SCOPE</span>
          </div>
          <p className="text-base sm:text-lg text-zinc-200 leading-relaxed font-normal">
            {service.description}
          </p>
        </div>

        {/* Relevant Skills & Tools (Pills matching existing Skills section) */}
        <div className="py-6 border-t border-white/10 space-y-4">
          <div className="text-xs font-bold text-[#FF4D1A] uppercase tracking-widest flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span>RELEVANT SKILLS & TOOLS</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {service.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-white/[0.05] border border-white/10 hover:border-indigo-400/50 hover:bg-indigo-500/10 text-xs font-bold tracking-wider text-zinc-200 hover:text-white rounded-full transition-all select-none shadow-sm flex items-center gap-1.5"
              >
                <span
                  style={{ backgroundColor: service.accentColor }}
                  className="w-1.5 h-1.5 rounded-full"
                />
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Key Delivery Pillars / Highlights */}
        <div className="py-8 border-t border-white/10 space-y-6">
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <Workflow className="w-4 h-4 text-[#FF7A00]" />
            <span>HOW I DELIVER</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {service.highlights.map((highlight, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/15 transition-all duration-300 space-y-2 group"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2
                    style={{ color: service.accentColor }}
                    className="w-4 h-4 shrink-0"
                  />
                  <h3 className="text-sm font-bold text-white group-hover:text-[#FF4D1A] transition-colors">
                    {highlight.title}
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed pl-6">
                  {highlight.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Closing Call-To-Action Card */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="relative rounded-2xl bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
            <div
              aria-hidden="true"
              style={{ backgroundColor: service.accentColor }}
              className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-15 pointer-events-none"
            />
            <div className="space-y-1.5 max-w-xl">
              <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                {service.ctaTitle}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                {service.ctaDesc}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
              <button
                onClick={onConnect}
                className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-[#14121B] hover:bg-[#1A1824] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 border border-[#FF4D1A]/35 hover:border-[#FF4D1A]/70 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(255,77,26,0.22)] transition-all duration-300 cursor-pointer group"
              >
                <MessageCircle className="w-4 h-4 text-[#FF4D1A] group-hover:scale-110 transition-transform" />
                <span>LET'S CONNECT</span>
                <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
