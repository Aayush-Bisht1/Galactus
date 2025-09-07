import Header from "./_components/Header";
import Hero from "./_components/Hero";
import { FeaturesSection } from "./_components/FeatureSection";
import CTA from "./_components/CTA";
import Footer from "./_components/Footer";
import BenefitsSection from "./_components/BenefitsSection";
import StatsSection from "./_components/StatsSection";
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <FeaturesSection />
      <BenefitsSection />
      <StatsSection />
      <CTA />
      <Footer />
    </div>
  );
}
