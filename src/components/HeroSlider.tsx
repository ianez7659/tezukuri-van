"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Image from "next/image";

type Props = { images: string[] };

export default function HeroSlider({ images }: Props) {
  const list = images?.length
    ? images
    : [
        "/images/prod-all2.webp",
        "/images/prod-all3.webp",
        "/images/prod-all4.webp",
      ];

  return (
    <Swiper modules={[Autoplay]} spaceBetween={20} slidesPerView={1} loop>
      {list.map((src, i) => (
        <SwiperSlide key={i}>
          <div className="relative w-full h-64 md:h-130 rounded overflow-hidden">
            <Image
              src={src}
              alt={`slide-${i}`}
              fill
              className="object-cover md:scale-90"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 100vw"
              priority={i === 0}
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
