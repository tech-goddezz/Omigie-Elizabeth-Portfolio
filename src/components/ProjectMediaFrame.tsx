import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import { optimizeCloudinaryUrl } from '../utils/cloudinary';

export interface ProjectMediaFrameProps {
  image?: string;
  poster?: string;
  video?: string;
  frameType?: 'browser' | 'phone';
  title: string;
  category?: string;
  url?: string;
  className?: string;
}

export { optimizeCloudinaryUrl };

export const ProjectMediaFrame: React.FC<ProjectMediaFrameProps> = ({
  image,
  poster,
  video,
  title,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);

  const posterSrc = poster || image;
  const optimizedPoster = optimizeCloudinaryUrl(posterSrc, { width: 960 });
  const optimizedVideo = video
    ? optimizeCloudinaryUrl(video, { width: 960, videoCodec: 'auto' })
    : undefined;

  const hasPoster = Boolean(optimizedPoster && optimizedPoster.trim().length > 0);
  const hasVideo = Boolean(optimizedVideo && optimizedVideo.trim().length > 0);

  // Lazy-load media when element scrolls within proximity of the viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsInViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Control video playback once in view and when video source is mounted
  useEffect(() => {
    if (!videoRef.current || !hasVideo || !isInViewport) return;

    if (isPlaying) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay handled silently
        });
      }
    } else {
      videoRef.current.pause();
    }
  }, [optimizedVideo, isPlaying, hasVideo, isInViewport]);

  const togglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      className={`group/media relative w-full h-full overflow-hidden select-none bg-[#0B0D14] ${className}`}
    >
      {/* Lightweight Instant Poster Image (Fallback while video streams / loads frames) */}
      {hasPoster && isInViewport && (
        <img
          src={optimizedPoster}
          alt={`Preview of ${title}`}
          width={800}
          height={500}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 group-hover:scale-[1.03] ${
            isVideoLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        />
      )}

      {/* Full-Bleed Autoplay Video Element - Activated when scrolled near view */}
      {hasVideo && isInViewport && (
        <video
          ref={videoRef}
          src={optimizedVideo}
          poster={optimizedPoster}
          preload="metadata"
          muted
          playsInline
          autoPlay
          loop
          width={800}
          height={500}
          aria-label={`Video demonstration of ${title}`}
          onPlaying={() => setIsVideoLoaded(true)}
          onCanPlay={() => {
            setIsVideoLoaded(true);
            videoRef.current?.play().catch(() => {});
          }}
          onLoadedData={() => {
            setIsVideoLoaded(true);
            videoRef.current?.play().catch(() => {});
          }}
          className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 group-hover:scale-[1.03] ${
            isVideoLoaded || !hasPoster ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />
      )}

      {/* Subtle Bottom Vignette Gradient for Depth and Legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D14] via-black/25 to-transparent opacity-70 group-hover:opacity-40 transition-opacity pointer-events-none" aria-hidden="true" />

      {/* Subtle Transparent Frosted Glass Play/Pause Overlay for Video */}
      {hasVideo && isInViewport && (
        <button
          type="button"
          onClick={togglePlayPause}
          aria-label={isPlaying ? `Pause video for ${title}` : `Play video for ${title}`}
          className="group/playbtn absolute bottom-3 right-3 z-30 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/[0.07] hover:bg-white/[0.16] active:bg-white/[0.22] backdrop-blur-xl border border-white/[0.18] hover:border-white/35 text-white/80 hover:text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),0_8px_24px_rgba(0,0,0,0.35)] opacity-70 md:opacity-0 group-hover/media:opacity-85 hover:!opacity-100 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4D1A] focus-visible:outline-none"
        >
          {isPlaying ? (
            <Pause className="w-3 h-3 text-white/80 group-hover/playbtn:text-white transition-colors" aria-hidden="true" />
          ) : (
            <Play className="w-3 h-3 fill-white/80 text-white/80 group-hover/playbtn:fill-white group-hover/playbtn:text-white translate-x-[0.5px] transition-colors" aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  );
};


