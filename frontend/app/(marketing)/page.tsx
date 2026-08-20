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

export default function LandingPage() {
  return (
    <>
      <Header />
      <main className="flex flex-col">
        <Hero />
        <TrustStrip />
        <LogoMarquee />
        <TwoModes />
        <HowItWorks />
        <StatsBand />
        <FeaturesGrid />
        <Audience />
        <LivePreview />
        <Testimonials />
        <TryItNow />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
