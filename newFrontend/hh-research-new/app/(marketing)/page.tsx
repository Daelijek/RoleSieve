import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { TrustStrip } from "@/components/landing/TrustStrip";
import { LogoMarquee } from "@/components/landing/LogoMarquee";
import { TwoModes } from "@/components/landing/TwoModes";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { StatsBand } from "@/components/landing/StatsBand";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { Audience } from "@/components/landing/Audience";
import { LivePreview } from "@/components/landing/LivePreview";
import { Testimonials } from "@/components/landing/Testimonials";
import { TryItNow } from "@/components/landing/TryItNow";
import { Faq } from "@/components/landing/Faq";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";
import { Reveal } from "@/components/ui/Reveal";

export default function LandingPage() {
  return (
    <>
      <Header />
      <main className="flex flex-col">
        <Hero />
        <Reveal>
          <TrustStrip />
        </Reveal>
        <Reveal>
          <LogoMarquee />
        </Reveal>
        <Reveal>
          <TwoModes />
        </Reveal>
        <Reveal>
          <HowItWorks />
        </Reveal>
        <Reveal>
          <StatsBand />
        </Reveal>
        <Reveal>
          <FeaturesGrid />
        </Reveal>
        <Reveal>
          <Audience />
        </Reveal>
        <Reveal>
          <LivePreview />
        </Reveal>
        <Reveal>
          <Testimonials />
        </Reveal>
        <Reveal>
          <TryItNow />
        </Reveal>
        <Reveal>
          <Faq />
        </Reveal>
        <Reveal>
          <FinalCta />
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
