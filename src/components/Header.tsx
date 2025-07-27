"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 w-full bg-background text-foreground border-b border-border px-6 py-4 text-sm z-50">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="block w-40 md:w-52">
          <div className="relative">
            <img
              src="/images/TEZUKURI_VAN_LOGO_LOGO1_Black_L_clearB.png"
              alt="Tezukuri Van logo"
              className="w-full h-auto object-contain logo-light"
            />
            <img
              src="/images/TEZUKURI_VAN_LOGO_LOGO1_White_L_clearB.png"
              alt="Dark Logo"
              className="w-full h-auto object-contain hidden logo-dark"
            />
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6 font-medium items-center">
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/products" className="hover:underline">
            Product
          </Link>
          <a href="/events" className="hover:underline">
            Events
          </a>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
          <ThemeToggle />
        </nav>

        {/* Burger Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden z-50 focus:outline-none"
          aria-label="Toggle navigation"
        >
          {menuOpen ? (
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 w-3/4 max-w-sm h-full bg-background py-14 text-foreground shadow-lg z-40 transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden flex flex-col gap-4 px-6 py-8 border-l border-border`}
      >
        <ThemeToggle />
        <Link href="/about" className="hover:underline">
          About
        </Link>
        <Link href="/products" className="hover:underline">
          Product
        </Link>
        <a href="/events" className="hover:underline">
          Events
        </a>
        <Link href="/contact" className="hover:underline">
          Contact
        </Link>
      </div>
    </header>
  );
}
