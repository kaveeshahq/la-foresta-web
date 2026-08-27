import { SiteHeader } from "@/components/layout/site-header";
import { HeroSection } from "@/components/sections/home/hero-section";
import { ExperienceSection } from "@/components/sections/home/experience-section";
import { UpcomingEventSection } from "@/components/sections/home/upcoming-event-section";
import { ArtistLineupSection } from "@/components/sections/home/artist-lineup-section";
import { MomentsSection } from "@/components/sections/home/moments-section";
import { FinalCtaSection } from "@/components/sections/home/final-cta-section";
import { SiteFooter } from "@/components/layout/site-footer";

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main>
        <HeroSection />
        <ExperienceSection />
        <UpcomingEventSection/>
        <ArtistLineupSection/>
        <MomentsSection/>
        <FinalCtaSection/>
      </main>

      <SiteFooter/>
    </>
  );
}