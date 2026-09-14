export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  portfolio: string;
  portfolio2?: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  dateRange: string;
  bullets: string[];
}

export interface ResumeProject {
  title: string;
  subtitle: string;
  stack: string;
  tags: string[];
  description: string;
  bullets?: string[];
  onPdfResume?: boolean;
}

export interface SkillCategory {
  category: string;
  items: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  dateRange: string;
}

export const personalInfo: PersonalInfo = {
  name: 'OMIGIE ELIZABETH',
  title: 'Frontend Developer & AI Product Engineer',
  location: 'Lagos, Nigeria (Open to Remote/Hybrid)',
  email: 'techupwithliz@gmail.com',
  phone: '+234 808 281 7092',
  github: 'github.com/tech-goddezz',
  linkedin: 'linkedin.com/in/elizabethomigie',
  portfolio: 'elizabeth-personal-website-six.vercel.app',
  portfolio2: 'omigie-elizabeth-portfolio.vercel.app',
};

export const careerSummary: string =
  'Frontend Developer and AI Product Engineer with hands-on experience designing and shipping responsive web and mobile applications, improving site performance and client retention, and integrating AI capabilities into real products. Background in Petroleum Engineering (B.Eng, University of Benin) brings a systematic, problem-first approach to building software. Also builds an audience as a technical content creator, translating complex engineering and AI concepts into accessible material for 3,000+ followers.';

export const experience: ExperienceItem[] = [
  {
    role: 'Frontend Developer, Product Team Project',
    company: 'Top Universe Community Program',
    dateRange: 'Cross-functional team collaboration - April 2026 - July 2026',
    bullets: [
      'Collaborated with a cross-functional team of 2 designers, 1 backend developer, and 1 product manager to build the Instant Transfer Assurance feature for a GTCO GTWorld mobile banking app rebuild, addressing failed and uncertain interbank transfers.',
      'Owned frontend implementation using React Native, Expo Router, Zustand, and NativeWind, integrating with a Supabase backend.',
      'Participated in product research and team briefings to ground the feature in real user pain points before development began.',
    ],
  },
  {
    role: 'Content Creator',
    company: 'TechUp with LIZ',
    dateRange: 'YouTube and Blog - December 2024 - Present',
    bullets: [
      'Create educational videos and articles on frontend development, Web3, and AI, growing a community of 3,000+ followers on LinkedIn.',
      'Publish tutorials on React development, blockchain fundamentals, and productivity, maintaining high audience retention.',
    ],
  },
  {
    role: 'Frontend Developer, promoted to Manager',
    company: 'V3 Design',
    dateRange: 'Aug 2024 - March 2025',
    bullets: [
      'Designed and developed responsive web applications using React.js and Tailwind CSS, improving website performance by 35% and increasing client retention by 15%.',
      'Led an e-commerce redesign that increased user engagement by 25% and conversions by 20%.',
      'Promoted from Frontend Developer to Manager; led both technical delivery and team management initiatives.',
      'Used Excel for project tracking, performance analysis, and reporting to support data-driven decisions.',
    ],
  },
  {
    role: 'Freelance Frontend Developer',
    company: '',
    dateRange: 'Remote - April 2023 - January 2024',
    bullets: [
      'Designed and built responsive client websites, increasing user engagement by up to 30%.',
      'Developed and maintained a 3D developer portfolio site using React and Three.js with interactive animations.',
      'Delivered custom web solutions through iterative client feedback loops, achieving 100% client satisfaction.',
    ],
  },
];

export const selectedProjects: ResumeProject[] = [
  {
    title: 'Personal Portfolio',
    subtitle: 'Omigie Elizabeth',
    stack: 'React 19, TypeScript, Vite, Tailwind CSS, Three.js, React Three Fiber, GSAP, Motion, Google Gemini API',
    tags: ['React 19', 'TypeScript', 'Three.js', 'GSAP', 'Gemini API'],
    description:
      'An animation-heavy, AI-integrated portfolio site featuring interactive 3D scenes, GSAP and Motion scroll interactions, and Gemini API capabilities.',
    bullets: [
      'Designed and built an animation-heavy, AI-integrated portfolio site with 3D scenes (Three.js/React Three Fiber) for the hero, network, and terminal sections, GSAP and Motion-driven scroll interactions, and a custom preloader.',
      'Integrated the Google Gemini API to power AI-driven interactive features within the site.',
      'Built dedicated service detail pages (Frontend Engineering, AI Product Integration, Product Prototyping), an interactive projects showcase with modals, and a script that programmatically generates an up-to-date PDF resume using pdf-lib.',
      'Implemented client-side routing, browser history-aware modals, and full responsive behavior across desktop, tablet, and mobile.',
    ],
    onPdfResume: true,
  },
  {
    title: 'DevClarity',
    subtitle: 'AI Thinking Assistant',
    stack: 'React, TypeScript, Vite, Groq API (Llama 3.3)',
    tags: ['React', 'TypeScript', 'Groq API', 'Vite'],
    description:
      'An AI-powered thinking assistant that helps developers structure their approach before writing code - built on the Groq API with Llama 3.3, not just another code generator.',
    bullets: [
      'Built a tool that helps developers structure their reasoning before writing code, using the Groq API with Llama 3.3 rather than functioning as a generic code generator.',
      'Owned the full build end-to-end - architecture, UI, and AI integration; deployed on Vercel.',
    ],
    onPdfResume: true,
  },
  {
    title: 'GTCO GTWorld App',
    subtitle: 'Mobile Application',
    stack: 'React Native, Expo Router, Zustand, NativeWind',
    tags: ['React Native', 'Expo Router', 'Zustand', 'NativeWind'],
    description:
      'A pixel-perfect mobile banking app clone built screen-by-screen from Figma, with a full KYC flow, transaction history, and biometric-secured transfers.',
    bullets: [
      'Collaborated on rebuilding the GTCO GTWorld mobile banking app with React Native and Expo Router.',
      'Implemented full KYC onboarding, biometric transfer authorization, and Zustand ledger state.',
    ],
    onPdfResume: false,
  },
  {
    title: 'Coalition Patient Dashboard',
    subtitle: 'Healthcare Dashboard',
    stack: 'React, Chart.js',
    tags: ['React', 'Chart.js', 'TypeScript', 'Tailwind CSS'],
    description:
      'Comprehensive medical dashboard tracking patient vital stats, diagnostic history, and health metrics with interactive charts.',
    bullets: [
      'Built a healthcare dashboard for visualizing patient data trends using React and Chart.js.',
    ],
    onPdfResume: true,
  },
  {
    title: 'Simple Mini Portfolio',
    subtitle: 'Personal Portfolio UI',
    stack: 'HTML5, CSS3, Flexbox, Responsive UI',
    tags: ['HTML5', 'CSS3', 'Flexbox', 'Responsive UI'],
    description:
      'A clean, responsive mini portfolio showcasing technical projects, skillset hierarchy, and direct contact channels with refined animations.',
    onPdfResume: false,
  },
  {
    title: 'Testimonials Grid Section',
    subtitle: 'Complex Grid Layout',
    stack: 'CSS Grid, Tailwind CSS, Responsive UI',
    tags: ['CSS Grid', 'Tailwind CSS', 'Responsive UI'],
    description:
      'Dynamic testimonial layout showcasing responsive asymmetric grid positioning and verified customer reviews.',
    onPdfResume: false,
  },
  {
    title: 'Simple Omelette Recipe',
    subtitle: 'Clean Content Layout',
    stack: 'Semantic HTML, CSS3, Typography',
    tags: ['Semantic HTML', 'CSS3', 'Typography'],
    description:
      'Accessible and clean culinary preparation guide with structured nutritional data, ingredients list, and method steps.',
    onPdfResume: false,
  },
  {
    title: 'Blog Preview Card',
    subtitle: 'Interactive Content Card',
    stack: 'HTML5, CSS3, Tailwind CSS, Micro-interactions',
    tags: ['HTML5', 'CSS3', 'Tailwind CSS', 'Micro-interactions'],
    description:
      'An interactive publication preview card with hover micro-interactions, responsive typography hierarchy, and tag filtering.',
    onPdfResume: false,
  },
  {
    title: 'QR Code Component',
    subtitle: 'Component UI Design',
    stack: 'HTML5, CSS3, Responsive UI',
    tags: ['HTML5', 'CSS3', 'Responsive UI'],
    description:
      'A pixel-perfect QR code preview card matching exact design specs with clean CSS styling, optical centering, and elevation shadows.',
    onPdfResume: false,
  },
  {
    title: 'Social Links Profile',
    subtitle: 'Profile Interface Card',
    stack: 'HTML5, CSS3, Flexbox, Mobile-First',
    tags: ['HTML5', 'CSS3', 'Flexbox', 'Mobile-First'],
    description:
      'A high-contrast bio-link interface with accessible >=44px touch targets, smooth keyboard focus rings, and zero dependencies.',
    onPdfResume: false,
  },
  {
    title: 'Apply Fast',
    subtitle: 'Job Search & Rapid Application Platform',
    stack: 'React, TypeScript, Tailwind CSS, Vite',
    tags: ['React', 'TypeScript', 'Job Automation', 'Tailwind CSS'],
    description:
      'A high-velocity job search and application platform designed for candidates to discover matching roles, auto-fill credentials, and submit rapid job applications.',
    bullets: [
      'Built a fast job search and application platform enabling job seekers to search, track, and apply quickly to job opportunities.',
      'Designed responsive dashboard interfaces with application tracking, resume matching, and streamlined submission workflows.',
    ],
    onPdfResume: false,
  },
  {
    title: 'Frontend Mentor Challenges',
    subtitle: 'Applied UI Practice',
    stack: 'React, Tailwind CSS, Responsive Design',
    tags: ['React', 'Tailwind CSS', 'Responsive Design'],
    description:
      'Completed and deployed multiple real-world UI challenges built to match provided design specs precisely.',
    bullets: [
      'Completed and deployed multiple real-world UI challenges - including a QR code component, four-card feature section, testimonials grid, recipe page, blog preview card, social links profile, and product preview card - each built to match provided design specs precisely.',
    ],
    onPdfResume: true,
  },
];

export const skills: SkillCategory[] = [
  {
    category: 'Languages & Core',
    items: 'JavaScript, TypeScript, HTML5, CSS3',
  },
  {
    category: 'Frontend',
    items: 'React.js (incl. React 19), React Native (Expo Router), Tailwind CSS, NativeWind',
  },
  {
    category: '3D & Animation',
    items: 'Three.js, React Three Fiber, GSAP, Motion (Framer Motion)',
  },
  {
    category: 'State, Data & AI',
    items: 'Zustand, Firebase, Supabase, Groq API, Llama 3.3, Google Gemini API',
  },
  {
    category: 'Backend & Tooling',
    items: 'Node.js, Express, pdf-lib, Git/GitHub, Figma, VS Code, Vite, Vercel, Render, Excel',
  },
];

export const achievements: string[] = [
  'Achieved 30% faster project delivery through optimized development workflows.',
  'Recognized for simplifying complex technical concepts for a LinkedIn audience of 3,000+ followers.',
  'Consistently surpassed client expectations across freelance and agency engagements.',
];

export const education: EducationItem[] = [
  {
    degree: 'B.Eng, Petroleum Engineering',
    institution: 'University of Benin',
    dateRange: '2018 - 2024',
  },
  {
    degree: 'Frontend Web Development Certificate',
    institution: 'Udacity',
    dateRange: 'February - August 2022',
  },
  {
    degree: 'UI/UX Design Certification',
    institution: 'Google Career Certificates',
    dateRange: '2023',
  },
];
