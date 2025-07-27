import ValueSection from "@/components/ValueSection";

export default function AboutPage() {
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="text-center py-16 bg-border px-4">
        <h1 className="text-4xl font-bold text-foreground">Our Story</h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted">
          Tezukuri Van is founded on a commitment to craftsmanship and
          minimalism — designing essential products for life on the road.
        </p>
      </section>

      {/* Image + Intro Section */}
      <section className="grid md:grid-cols-2 gap-10 px-6 md:px-24 py-16 items-center bg-background">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            The Origin of Our Craft
          </h2>
          <p className="text-muted leading-relaxed">
            Every item is carefully designed and made in Vancouver, Canada. We
            believe in honest, slow production and creating tools that enhance
            simple, sustainable living.
          </p>
        </div>
        <div>
          <img
            src="/images/prod-all4.jpg"
            alt="Our workshop"
            className="w-full h-auto rounded-lg shadow"
          />
        </div>
      </section>

      {/* Mission / Values Section */}
      <ValueSection
        title="Our Values"
        className="bg-border"
        values={[
          {
            title: "Simplicity",
            description:
              "We strip away the unnecessary to focus on what matters.",
          },
          {
            title: "Sustainability",
            description:
              "Our products are made with long-term use and environmental harmony in mind.",
          },
          {
            title: "Craftsmanship",
            description:
              "We value the care, time, and technique that go into handmade work.",
          },
        ]}
      />
    </main>
  );
}
