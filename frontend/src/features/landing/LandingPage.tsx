"use client";

import { LandingHeader, LandingHero, LandingAbout, LandingBenefits, LandingFooter, AnimatedBackground } from "./components";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#141619]">
      <AnimatedBackground />
      <LandingHeader />

      <main className="relative">
        <LandingHero />
        <LandingAbout />
        <LandingBenefits />
      </main>

      <LandingFooter />
    </div>
  );
}
