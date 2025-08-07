"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Thumbs, FreeMode, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import "swiper/css/autoplay";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Image from "next/image";
import type { Swiper as SwiperClass } from "swiper";

type Product = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  brand: string;
  in_stock: boolean;
  gallery_images: string[];
};

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Failed to fetch product:", error.message);
      } else {
        setProduct(data);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <p className="p-6">Loading...</p>;

  const images = [product.image_url, ...(product.gallery_images || [])];

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

      <Swiper
        modules={[Autoplay, Thumbs]}
        spaceBetween={10}
        slidesPerView={1}
        loop
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        thumbs={{ swiper: thumbsSwiper }}
        className="max-w-lg mb-6 mx-auto rounded-lg shadow"
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full aspect-[4/3]">
              <Image
                src={img}
                alt={`${product.name} main ${i}`}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        modules={[FreeMode, Thumbs, Navigation]}
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode
        watchSlidesProgress
        navigation={{
          nextEl: ".thumbs-next",
          prevEl: ".thumbs-prev",
        }}
        className="max-w-lg mx-auto relative"
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full aspect-square">
              <Image
                src={img}
                alt={`${product.name} thumbnail ${i}`}
                fill
                className="object-cover cursor-pointer rounded border hover:border-[3px] transition duration-200"
                sizes="25vw"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="hidden md:flex justify-between max-w-lg mx-auto mt-2 px-2">
        <button className="thumbs-prev text-xl hover:text-blue-500">
          <ChevronLeft size={30} />
        </button>
        <button className="thumbs-next text-xl hover:text-blue-500">
          <ChevronRight size={30} />
        </button>
      </div>

      <p className="mt-6 font-semibold text-green-600 text-center">
        {product.in_stock ? "In stock" : "Out of stock"}
      </p>
    </motion.div>
  );
}
