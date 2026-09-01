import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* 
        ========================================================================
        Subtle, Sleek Ambient Atmospheric Radial Gradient Glows
        - 10-20% opacity range
        - Large, softly blurred radii (140px - 220px blur)
        - Shifting organic positions across page sections (Linear / Apple style)
        - Existing purple (#8B5CF6 / #6344F5) and orange/amber (#FF4D1A / #F59E0B)
        ========================================================================
      */}

      {/* 1. Upper Section Glows (Around Stats & About Area) */}
      <div className="absolute top-[600px] -left-32 w-[600px] h-[600px] rounded-full bg-[#FF4D1A]/10 blur-[170px]" />
      <div className="absolute top-[850px] -right-28 w-[650px] h-[650px] rounded-full bg-[#7C3AED]/12 blur-[190px]" />

      {/* 2. Mid Section Glows (Around Services & Projects Area) */}
      <div className="absolute top-[1550px] right-[5%] w-[550px] h-[550px] rounded-full bg-[#6344F5]/14 blur-[180px]" />
      <div className="absolute top-[1800px] -left-20 w-[500px] h-[500px] rounded-full bg-[#FF7A00]/8 blur-[160px]" />

      {/* 3. Lower Mid Section Glows (Around Testimonials Area) */}
      <div className="absolute top-[2450px] left-[15%] w-[600px] h-[600px] rounded-full bg-[#A855F7]/10 blur-[180px]" />
      <div className="absolute top-[2700px] -right-20 w-[500px] h-[500px] rounded-full bg-[#FF4D1A]/10 blur-[170px]" />

      {/* 4. Lower Section Glows (Around Skills, Education & Work Process Area) */}
      <div className="absolute top-[3200px] -left-28 w-[650px] h-[650px] rounded-full bg-[#FF4D1A]/12 blur-[190px]" />
      <div className="absolute top-[3450px] right-[10%] w-[580px] h-[580px] rounded-full bg-[#7928CA]/12 blur-[180px]" />

      {/* 5. Bottom Section Glows (Around Contact Banner & Footer Area) */}
      <div className="absolute bottom-[250px] right-0 w-[650px] h-[650px] rounded-full bg-[#6344F5]/15 blur-[180px]" />
      <div className="absolute bottom-[50px] -left-20 w-[600px] h-[600px] rounded-full bg-[#FF4D1A]/12 blur-[170px]" />

      {/* 
        ========================================================================
        Extremely Subtle Tactile Grain/Noise Layer for Matte Depth (Apple/Linear)
        ========================================================================
      */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.025] mix-blend-overlay pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="ambient-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#ambient-grain)" />
      </svg>
    </div>
  );
};
