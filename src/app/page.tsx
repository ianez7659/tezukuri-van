"use client";
// import Link from "next/link";
import products from "@/data/products.json";
import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import AboutPreview from "@/components/AboutPreview";
import ValueSection from "@/components/ValueSection";
import ContactCTA from "@/components/ContactCTA";

export default function HomePage() {
  const featured = products.slice(0, 3);

  return (
    <main className="bg-background text-foreground">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* About Preview */}
      <AboutPreview />

      {/* Our Values */}
      <ValueSection
        title="What We Value"
        className="bg-background"
        values={[
          {
            title: "Simplicity",
            description:
              "We remove the excess and focus on what matters most. The simplicity of our designs reflects our commitment to clarity and purpose.",
          },
          {
            title: "Sustainability",
            description:
              "We create responsibly for a more mindful lifestyle. Our products are designed to last, minimizing waste and environmental impact.",
          },
          {
            title: "Craftsmanship",
            description:
              "Each product is a result of skill, intention, and care. We believe in the art of making, where every detail is thoughtfully considered.",
          },
        ]}
      />

      {/* Contact CTA */}
      <ContactCTA />
    </main>
  );
}
