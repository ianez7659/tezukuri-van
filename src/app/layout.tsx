//
// src/app/layout.tsx
import "@/styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <Header />
        <main className="pt-20 px-6 md:px-12 lg:px-24 py-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
