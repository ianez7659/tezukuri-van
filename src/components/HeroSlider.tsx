"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Image from "next/image";

const images = [
  "/images/prod-all2.webp",
  "/images/prod-all3.webp",
  "/images/prod-all4.webp",
];

export default function HeroSlider() {
  return (
    <Swiper
      modules={[Autoplay]}
      spaceBetween={20}
      slidesPerView={1}
      loop={true}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      speed={1200}
    >
      {images.map((src, i) => (
        <SwiperSlide key={i}>
          <div className="relative w-full aspect-[4/3] h-64 md:h-120 rounded overflow-hidden">
            <Image
              src={src}
              alt={`slide-${i}`}
              fill
              className="object-cover md:px-12"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 100vw"
              priority={i === 0}
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
