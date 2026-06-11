'use client';

import { PageLoadTransition } from '@/components/PageLoadTransition';
import { CustomCursor } from '@/components/CustomCursor';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { TimelineSection } from '@/components/TimelineSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <>
      <PageLoadTransition />
      <CustomCursor />
      <Navigation />

      <main className="min-h-screen">
        <HeroSection />
        <FeaturesSection />
        <TimelineSection />
        <ContactSection />
      </main>

      <Footer />
    </>
  );
}
