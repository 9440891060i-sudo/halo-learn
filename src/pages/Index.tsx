import HeroSection from "@/components/HeroSection";
import GlassesSpecs from "@/components/GlassesSpecs";
import BundleOffer from "@/components/BundleOffer";
import AppPreview from "@/components/AppPreview";
import VoiceCommands from "@/components/VoiceCommands";
import PricingSection from "@/components/PricingSection";
import ShippingSection from "@/components/ShippingSection";
import PrivacySection from "@/components/PrivacySection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="overflow-hidden">
      <HeroSection />
      <GlassesSpecs />
      <BundleOffer />
      <AppPreview />
      <VoiceCommands />
      <PricingSection />
      <ShippingSection />
      <PrivacySection />
      <Footer />
    </main>
  );
};

export default Index;
