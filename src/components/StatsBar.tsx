import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, Users, Award, Smile } from 'lucide-react';
import { useScrollAnimation } from '../utils/motion';

export const StatsBar: React.FC = () => {
  const { getFadeUp } = useScrollAnimation();

  const stats = [
    {
      icon: <Briefcase className="w-5 h-5 text-[#FF4D1A]" />,
      iconBg: 'bg-orange-500/10 border-orange-500/20',
      number: '10+',
      label: 'PROJECTS SHIPPED',
    },
    {
      icon: <Users className="w-5 h-5 text-purple-400" />,
      iconBg: 'bg-purple-500/10 border-purple-500/20',
      number: '2',
      label: 'FULL-STACK PRODUCTS',
    },
    {
      icon: <Award className="w-5 h-5 text-[#FF4D1A]" />,
      iconBg: 'bg-orange-500/10 border-orange-500/20',
      number: '4+',
      label: 'YEARS SELF-TAUGHT',
    },
    {
      icon: <Smile className="w-5 h-5 text-purple-400" />,
      iconBg: 'bg-purple-500/10 border-purple-500/20',
      number: '100%',
      label: 'SHIPPED & DEPLOYED',
    },
  ];

  return (
    <section className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto py-8 sm:py-12">
      <motion.div
        {...getFadeUp(0, 20, 0.45)}
        className="relative"
      >
        <div className="relative grid grid-cols-2 md:grid-cols-4 bg-gradient-to-b from-white/[0.08] via-[#0E0E14]/70 to-[#0A0A0E]/85 border border-white/[0.14] rounded-2xl p-2 md:p-3 backdrop-blur-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Top specular reflection rim */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none" />

          {/* Ambient Glass Reflections */}
          <div
            className="absolute -top-20 -left-20 w-56 h-56 rounded-full pointer-events-none opacity-30 blur-[70px]"
            style={{ background: 'radial-gradient(circle, rgba(255, 77, 26, 0.25) 0%, transparent 70%)' }}
          />
          <div
            className="absolute -bottom-20 -right-20 w-56 h-56 rounded-full pointer-events-none opacity-25 blur-[70px]"
            style={{ background: 'radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 70%)' }}
          />

          {stats.map((stat, idx) => {
            const borderClasses = `
              ${idx % 2 === 0 ? 'border-r' : ''} 
              ${idx < 2 ? 'border-b md:border-b-0' : ''} 
              ${idx < 3 ? 'md:border-r' : ''} 
              border-white/[0.08]
            `;

            return (
              <motion.div
                key={idx}
                {...getFadeUp(0.05 + idx * 0.05, 16, 0.45)}
                className={`relative z-10 flex flex-col items-center justify-center text-center p-4 sm:p-6 cursor-default transition-all duration-300 ${borderClasses}`}
              >
                <div className={`p-2.5 rounded-xl ${stat.iconBg} border mb-2.5 flex items-center justify-center backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]`}>
                  {stat.icon}
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1 font-sans">
                  {stat.number}
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold text-zinc-400 tracking-wider uppercase">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};
