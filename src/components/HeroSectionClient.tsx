"use client";

import Link from "next/link";

type Props = {
  title: string;
  content: string;
};

export default function HeroSectionClient({ title, content }: Props) {
  return (
    <>
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight tracking-tight">
        {title}
      </h1>
      <p className="text-base sm:text-lg md:text-xl mt-6 mb-8 max-w-2xl mx-auto text-gray-600">
        {content}
      </p>
      <Link
        href="/products"
        className="bg-foreground text-background px-6 py-3 rounded hover:bg-gray-800 transition"
      >
        Browse Products
      </Link>
    </>
  );
}
