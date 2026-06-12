'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

const timelineEvents: TimelineItem[] = [
  {
    year: '2020',
    title: 'Foundation',
    description: 'Started journey as a frontend developer, mastering React and TypeScript.',
  },
  {
    year: '2021',
    title: 'Advanced Skills',
    description: 'Expanded expertise to include Three.js, GSAP, and advanced animations.',
  },
  {
    year: '2022',
    title: 'AI Integration',
    description: 'Began integrating AI and machine learning into web applications.',
  },
  {
    year: '2023',
    title: 'Athera Founded',
    description: 'Founded Athera Intelligence, a startup for AI content detection.',
  },
  {
    year: '2024',
    title: 'Enterprise Scale',
    description: 'Scaled AI detection platform to serve universities and enterprises.',
  },
  {
    year: '2025',
    title: 'Continuous Innovation',
    description: 'Building next-generation tools and pushing the boundaries of web tech.',
  },
];

export function TimelineSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;

    if (!container || !track) return;

    // Calculate scroll distance
    const scrollWidth = track.scrollWidth - container.clientWidth;

    gsap.to(track, {
      scrollTrigger: {
        trigger: container,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
        markers: false,
      },
      x: -scrollWidth,
      ease: 'none',
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full py-24 bg-background overflow-hidden"
    >
      {/* Section heading */}
      <div className="px-6 md:px-12 lg:px-20 mb-16">
        <h2 className="font-cormorant font-light text-5xl md:text-6xl text-gold">
          Journey & Timeline
        </h2>
      </div>

      {/* Horizontal scroll track */}
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-8 px-6 md:px-12 lg:px-20 pb-12"
          style={{ width: 'fit-content' }}
        >
          {timelineEvents.map((event, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-80 p-8 bg-surface border border-gold-subtle hover:border-gold transition-colors duration-300"
            >
              <div className="font-mono text-sm text-gold mb-3">{event.year}</div>
              <h3 className="font-cormorant font-light text-2xl text-gold-glow mb-4">
                {event.title}
              </h3>
              <p className="font-inter text-text-muted text-sm leading-relaxed">
                {event.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="px-6 md:px-12 lg:px-20 mt-8">
        <div className="h-1 bg-gold-subtle rounded-full overflow-hidden">
          <div className="h-full bg-gold rounded-full" style={{ width: '0%' }} />
        </div>
      </div>
    </section>
  );
}
