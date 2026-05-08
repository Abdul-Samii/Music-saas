"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Faqs from "@/page-components/pricing/Faqs";
import PricingCta from "@/page-components/pricing/PricingCta";
import PricingHero from "@/page-components/pricing/PricingHero";
export default function PricingPageClient() {
  return (
    <main className="bg-body-2">
      <Navbar />
      <PricingHero />
      <Faqs />
      <PricingCta />
      <Footer />
    </main>
  );
}
