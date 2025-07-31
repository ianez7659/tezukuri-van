import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <section className="pt-10 grid md:grid-cols-2 min-h-screen">
      {/* Left side: image */}
      <div
        className="hidden md:block h-full bg-cover bg-center"
        style={{ backgroundImage: "url('/images/prod-all3.webp')" }}
      />

      {/* Right side: form */}
      <div className="flex flex-col items-center justify-center p-8 bg-background h-full">
        <span className="text-4xl font-bold mb-2 text-center text-muted">
          TEZUKURI VAN
        </span>

        <p className="text-lg text-muted mt-6 mb-14 text-center">
          would love to hear from you!
        </p>

        <div className="w-full max-w-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-heading">
            Contact Us
          </h1>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
