"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import products from "@/data/products.json";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Thumbs, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import "swiper/css/autoplay";

type Product = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  brand: string;
  inStock: boolean;
  galleryImages?: string[];
};

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  useEffect(() => {
    const found = products.find((p) => p.id === id);
    setProduct(found || null);
  }, [id]);

  if (!product) return <p className="p-6">Loading...</p>;

  const images = [product.imageUrl, ...(product.galleryImages || [])];

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Link
        href="/products"
        className="inline-block mb-6 text-blue-500 hover:underline"
      >
        ← Back to Products
      </Link>

      <h1 className="text-3xl font-bold text-heading mb-2">{product.name}</h1>
      <p className="text-muted mb-4">{product.description}</p>

      {/* Main Swiper */}
      <Swiper
        modules={[Autoplay, Thumbs]}
        spaceBetween={10}
        slidesPerView={1}
        loop
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        thumbs={{ swiper: thumbsSwiper }}
        className="max-w-lg mb-6 mx-auto rounded-lg shadow"
      >
        {images.map((img: string, i: number) => (
          <SwiperSlide key={i}>
            <img
              src={img}
              alt={`${product.name} main ${i}`}
              className="w-full h-auto rounded-lg"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail Swiper */}
      <Swiper
        modules={[FreeMode, Thumbs]}
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode
        watchSlidesProgress
        className="max-w-lg mx-auto"
      >
        {images.map((img: string, i: number) => (
          <SwiperSlide key={i}>
            <img
              src={img}
              alt={`${product.name} thumbnail ${i}`}
              className="w-full h-auto cursor-pointer rounded border hover:border-[3px] transition duration-200"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <p className="mt-6 font-semibold text-green-600 text-center">
        {product.inStock ? "In stock" : "Out of stock"}
      </p>
    </motion.div>
  );
}
