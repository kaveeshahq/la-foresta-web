import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

import { ArtistLineupSection } from "@/components/sections/home/artist-lineup-section";
import { ExperienceSection } from "@/components/sections/home/experience-section";
import { FinalCtaSection } from "@/components/sections/home/final-cta-section";
import { HeroSection } from "@/components/sections/home/hero-section";
import { MomentsSection } from "@/components/sections/home/moments-section";
import { UpcomingEventSection } from "@/components/sections/home/upcoming-event-section";

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main>
        <HeroSection />

        <ExperienceSection />

        <UpcomingEventSection />

        <ArtistLineupSection />

        <MomentsSection />

        <FinalCtaSection />
      </main>

      <SiteFooter />
    </>
  );
}