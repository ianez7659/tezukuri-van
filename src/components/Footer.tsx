import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background text-foreground border-t border-border text-sm">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <Link href="/" className="text-xl font-bold text-heading">
            Tezukuri Van
          </Link>
          <p className="mt-2 text-muted">
            Handcrafted modern wear for vanlife.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-semibold text-heading mb-2">Quick Links</h3>
          <ul className="space-y-1">
            <li>
              <Link href="/about" className="text-subtle hover:underline">
                About
              </Link>
            </li>
            <li>
              <Link href="/products" className="text-subtle hover:underline">
                Products
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-subtle hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="font-semibold text-heading mb-2">Connect</h3>
          <ul className="space-y-1">
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-subtle hover:underline"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="mailto:hello@tezukurivan.com"
                className="text-subtle hover:underline"
              >
                Email Us
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-xs py-4 border-t border-border text-muted">
        © {new Date().getFullYear()} Tezukuri Van. All rights reserved.
      </div>
    </footer>
  );
}
