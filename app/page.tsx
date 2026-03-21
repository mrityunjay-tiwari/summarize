import BgGradient from "@/components/common/bg-gradient";
import CTASection from "@/components/home/cta-section";
import DemoSection from "@/components/home/demo-section";
import Footer from "@/components/home/footer";
import Hero from "@/components/home/hero";
import HeroSection from "@/components/home/hero-section";
import HowItWorksSection from "@/components/home/how-it-works-section";
import PricingSection from "@/components/home/pricing-section";
import CardStack from "@/components/home/stack";

export default function Home() {
  return (
    <div className="relative w-full">
        <BgGradient />
      <div className="flex flex-col">
        <Hero />
        <HowItWorksSection />
        <PricingSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
}
