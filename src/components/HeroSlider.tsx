"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const images = [
  "/images/prod-all1.jpg",
  "/images/prod-all2.jpg",
  "/images/prod-all3.jpg",
  "/images/prod-all4.jpg",
];

export default function HeroSlider() {
  return (
    <Swiper
      modules={[Autoplay]}
      spaceBetween={20}
      slidesPerView={1}
      loop={true}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
    >
      {images.map((src, i) => (
        <SwiperSlide key={i}>
          <img
            src={src}
            alt={`slide-${i}`}
            className="w-full w-fullaspect-[4/3] h-64 md:h-120 object-cover rounded"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
