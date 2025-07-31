import Image from "next/image";
import ValueSection from "@/components/ValueSection";

export default function AboutPage() {
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="text-center py-16 bg-border px-4">
        <h1 className="text-4xl font-bold text-foreground">Our Story</h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted">
          In classic Vancouver fashion, TEZUKURI VAN was born in a basement, is
          still in a basement, and will always be in a basement. We started out
          making things we love, shared them with friends and family, and have
          been winging it since then.
        </p>
      </section>

      {/* Image + Intro Section */}
      <section className="grid md:grid-cols-2 gap-10 px-6 md:px-24 py-16 items-center bg-background">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            How We Work
          </h2>
          <p className="text-muted leading-relaxed">
            Every item is designed and made by hand in Vancouver, Canada by us.
            We do this purely for the fun of it (which is an economically
            questionable practice), which means that we don't always have a ton
            of stock on hand. Your best bet is to find us at a local craft fair
            (check the Events page for more info) or, if you see something you
            like, shoot us a message! We're more than happy to work with you on
            custom orders if we're out of stock.
          </p>
        </div>
        <div className="relative w-full aspect-[4/3]">
          <Image
            src="/images/prod-all4.webp"
            alt="Our workshop"
            fill
            className="rounded-lg shadow object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
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
            title: "Craftsmanship",
            description:
              "We value the care, time, and technique that go into handmade work.",
          },
        ]}
      />
    </main>
  );
}
