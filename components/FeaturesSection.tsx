'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FeatureCard {
  title: string;
  description: string;
  icon: string;
}

const features: FeatureCard[] = [
  {
    title: 'Performance',
    description: 'Lightning-fast load times and smooth interactions optimized for every device.',
    icon: '⚡',
  },
  {
    title: 'Innovation',
    description: 'Cutting-edge technologies like Three.js, AI integration, and modern web patterns.',
    icon: '🚀',
  },
  {
    title: 'Design',
    description: 'Visually distinctive interfaces that blend luxury, precision, and intentionality.',
    icon: '✨',
  },
];

interface CardRef {
  card: HTMLDivElement | null;
  highlight: HTMLDivElement | null;
}

export function FeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<CardRef[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Animate cards in sequentially on scroll
    const cards = container.querySelectorAll('[data-feature-card]');
    gsap.from(cards, {
      scrollTrigger: {
        trigger: container,
        start: 'top center+=100px',
        markers: false,
      },
      y: 100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
    });

    // 3D tilt and highlight effect
    const setupCard = (cardRef: CardRef) => {
      const card = cardRef.card;
      const highlight = cardRef.highlight;

      if (!card || !highlight) return;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the card
        const y = e.clientY - rect.top; // y position within the card

        // Calculate center of card
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate distance from center (-1 to 1)
        const rotateX = ((y - centerY) / centerY) * 15; // Up to 15 degrees
        const rotateY = ((centerX - x) / centerX) * 15; // Up to 15 degrees

        // Apply 3D tilt
        gsap.to(card, {
          rotationX: rotateX,
          rotationY: rotateY,
          duration: 0.3,
          ease: 'power2.out',
          transformPerspective: 1200,
        });

        // Move highlight to cursor position
        gsap.to(highlight, {
          left: `${x}px`,
          top: `${y}px`,
          opacity: 0.6,
          duration: 0.2,
          ease: 'power1.out',
        });
      };

      const handleMouseLeave = () => {
        // Reset tilt
        gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.5,
          ease: 'power2.out',
        });

        // Hide highlight
        gsap.to(highlight, {
          opacity: 0,
          duration: 0.3,
        });
      };

      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      };
    };

    const unsubscribers: Array<void | (() => void)> = [];
    cardsRef.current.forEach((cardRef) => {
      const unsub = setupCard(cardRef);
      if (unsub) unsubscribers.push(unsub);
    });

    return () => {
      unsubscribers.forEach((unsub) => {
        if (typeof unsub === 'function') unsub();
      });
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full py-24 px-6 md:px-12 lg:px-20 bg-background"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-20">
          <h2 className="font-cormorant font-light text-5xl md:text-6xl text-gold mb-4">
            Why Work With Me
          </h2>
          <p className="font-inter text-text-muted max-w-2xl mx-auto">
            I bring technical excellence, innovative thinking, and meticulous design to every project.
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="grid md:grid-cols-3 gap-8" style={{ perspective: '1200px' }}>
          {features.map((feature, idx) => (
            <div
              key={idx}
              ref={(el) => {
                if (el) {
                  if (!cardsRef.current[idx]) {
                    cardsRef.current[idx] = { card: null, highlight: null };
                  }
                  cardsRef.current[idx].card = el;
                }
              }}
              data-feature-card
              className="relative p-8 bg-surface border border-gold-subtle transition-colors duration-300 overflow-hidden cursor-none"
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: 'center',
              }}
            >
              {/* Specular highlight that follows cursor */}
              <div
                ref={(el) => {
                  if (el && cardsRef.current[idx]) {
                    cardsRef.current[idx].highlight = el;
                  }
                }}
                className="absolute w-24 h-24 bg-gradient-to-br from-gold via-gold-glow to-transparent rounded-full blur-xl pointer-events-none"
                style={{
                  opacity: 0,
                  left: '0px',
                  top: '0px',
                  transform: 'translate(-50%, -50%)',
                }}
              />

              {/* Content */}
              <div className="relative z-10">
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className="font-cormorant font-light text-2xl text-gold-glow mb-4">
                  {feature.title}
                </h3>
                <p className="font-inter text-text-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
