"use client";

import { useState } from "react";
import Image from "next/image";
import { useTheme } from "../context/ThemeContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

// Banner data with Unsplash images
const banners = [
  {
    id: 1,
    title: "Modern Tech Solutions",
    subtitle: "Discover the latest in computing",
    image: "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=1600&q=80",
    cta: "Shop Now",
    ctaLink: "#products",
  },
  {
    id: 2,
    title: "Premium Laptops",
    subtitle: "Power meets elegance",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1600&q=80",
    cta: "Explore",
    ctaLink: "#products",
  },
  {
    id: 3,
    title: "Futuristic Gadgets",
    subtitle: "Tomorrow's tech, today",
    image: "https://images.unsplash.com/photo-1593642634367-d91a135587b5?auto=format&fit=crop&w=1600&q=80",
    cta: "Discover",
    ctaLink: "#products",
  },
  {
    id: 4,
    title: "Tech Accessories",
    subtitle: "Complete your setup",
    image: "https://images.unsplash.com/photo-1612810806563-dffd9ecf6b88?auto=format&fit=crop&w=1600&q=80",
    cta: "Browse",
    ctaLink: "#products",
  },
];

const HeroProductCarousel = () => {
  const { theme } = useTheme();

  const plugin = Autoplay({
    delay: 5000,
    stopOnInteraction: false,
  });

  return (
    <div className="w-full">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[plugin]}
        className="w-full"
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <div className="relative h-[350px] md:h-[400px] lg:h-[450px] w-full overflow-hidden">
                {/* Background Image */}
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover"
                  priority={banner.id === 1}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4 md:px-8 lg:px-16">
                    <div className="max-w-2xl space-y-6">
                      <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white drop-shadow-2xl">
                        {banner.title}
                      </h1>
                      <p className="text-2xl md:text-3xl lg:text-4xl text-gray-100 font-semibold drop-shadow-lg">
                        {banner.subtitle}
                      </p>
                      <a
                        href={banner.ctaLink}
                        className="inline-block bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-white font-bold text-lg md:text-xl px-10 py-5 rounded-xl hover:scale-105 transition-all duration-300 shadow-2xl shadow-[#fe8002]/50 hover:shadow-[#fe8002]/70"
                      >
                        {banner.cta}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className={`left-4 ${theme === 'light' ? 'bg-white/90' : 'bg-black/90'} border-[#fe8002] hover:bg-[#fe8002] hover:text-white`} />
        <CarouselNext className={`right-4 ${theme === 'light' ? 'bg-white/90' : 'bg-black/90'} border-[#fe8002] hover:bg-[#fe8002] hover:text-white`} />
      </Carousel>
    </div>
  );
};

export default HeroProductCarousel;
