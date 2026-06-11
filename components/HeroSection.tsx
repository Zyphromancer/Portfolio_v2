'use client';

import { useEffect, useRef } from 'react';

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure video plays on load
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Autoplay may be blocked, user will need to interact
      });
    }
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Full-bleed video background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for text contrast */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />

      {/* Centered content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
        <h1 className="font-cormorant font-light text-heading text-gold mb-4 max-w-4xl leading-tight">
          Frontend Developer. / AI Builder. / Based in Norway.
        </h1>
        <p className="font-inter text-lg text-text-muted max-w-2xl leading-relaxed">
          I build things that are technically sharp and visually distinct.
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center animate-bounce">
        <div className="w-0.5 h-12 bg-gradient-to-b from-gold to-transparent" />
        <div className="w-1.5 h-1.5 bg-gold rounded-full mt-2" />
      </div>
    </section>
  );
}
