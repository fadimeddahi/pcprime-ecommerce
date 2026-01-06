"use client";

import { useState, useEffect } from "react";
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

interface Slider {
  id: string;
  title: string;
  image_url: string;
  link: string;
  order: number;
  is_active: boolean;
}

const HeroProductCarousel = () => {
  const { theme } = useTheme();
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await fetch('https://api.primecomputerdz.dz/sliders');
        if (!response.ok) throw new Error('Failed to fetch sliders');
        const data = await response.json();
        // Sort by order field
        const sortedSliders = data.sort((a: Slider, b: Slider) => a.order - b.order);
        setSliders(sortedSliders);
      } catch (err) {
        console.error('Error fetching sliders:', err);
        setError('Failed to load sliders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSliders();
  }, []);

  const plugin = Autoplay({
    delay: 5000,
    stopOnInteraction: false,
  });

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-black to-[#0a0a0a]">
        <div className="text-[#fe8002] text-xl font-bold animate-pulse">Chargement...</div>
      </div>
    );
  }

  if (error || sliders.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-black to-[#0a0a0a]">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-[#fe8002] mb-4">Prime Computer</h2>
          <p className="text-white text-lg">Solutions informatiques premium</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[plugin]}
        className="w-full h-full"
      >
        <CarouselContent className="h-full">
          {sliders.map((slider, index) => (
            <CarouselItem key={slider.id} className="h-full">
              <a href={slider.link} className="block h-full w-full">
                <div className="relative h-full w-full min-h-[50vh] md:min-h-[60vh] overflow-hidden">
                  {/* Background Image */}
                  <Image
                    src={slider.image_url}
                    alt={slider.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 flex items-center">
                    <div className="container mx-auto px-4 md:px-8 lg:px-16">
                      <div className="max-w-2xl space-y-6">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white drop-shadow-2xl">
                          {slider.title}
                        </h1>
                        <div className="inline-block bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-white font-bold text-lg md:text-xl px-10 py-5 rounded-xl hover:scale-105 transition-all duration-300 shadow-2xl shadow-[#fe8002]/50 hover:shadow-[#fe8002]/70">
                          Découvrir
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
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
