import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <section className="pt-10 grid md:grid-cols-2 min-h-screen">
      {/* Left side: image */}
      <div
        className="hidden md:block h-full bg-cover bg-center"
        style={{ backgroundImage: "url('/images/prod-all3.jpg')" }}
      />

      {/* Right side: form */}
      <div className="flex flex-col items-center justify-center p-8 bg-background h-full">
        <span className="text-4xl font-bold mb-2 text-center text-muted">
          Tezukuri Van
        </span>
        <p className="text-lg text-muted mb-0 text-center">is always</p>
        <p className="text-lg text-muted mb-14 text-center">
          Welcome to get in touch with you!
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
