// "use client";
// import Link from "next/link";
// import products from "@/data/products.json";
import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import AboutPreview from "@/components/AboutPreview";
// import ValueSection from "@/components/ValueSection";
import ContactCTA from "@/components/ContactCTA";

export default function HomePage() {
  // const featured = products.slice(0, 3);

  return (
    <main className="bg-background text-foreground">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* About Preview */}
      <AboutPreview />

      <ContactCTA />
    </main>
  );
}
