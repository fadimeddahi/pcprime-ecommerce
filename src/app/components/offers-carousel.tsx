"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight, FaShoppingCart, FaClock, FaFire, FaTag } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";

interface SpecialOffer {
  id: number;
  name: string;
  image: string;
  price: number;
  oldPrice: number;
  discount: number;
  timeLeft: string;
  category: string;
}

const OffersCarousel = () => {
  const { theme } = useTheme();
  const { addToCart } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [addedToCart, setAddedToCart] = useState<number | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const specialOffers: SpecialOffer[] = [
    {
      id: 1,
      name: "PC Gamer RTX 4090 Ultimate",
      image: "/pc gamer.jpeg",
      price: 8999.99,
      oldPrice: 10999.99,
      discount: 18,
      timeLeft: "2h 15m",
      category: "PC Bureau",
    },
    {
      id: 3,
      name: "Carte Graphique RTX 4070",
      image: "/rtx.jpeg",
      price: 2499.99,
      oldPrice: 3299.99,
      discount: 24,
      timeLeft: "5h 30m",
      category: "Composants",
    },
    {
      id: 101,
      name: "PC Gamer RTX 3070 - Occasion",
      image: "/pc gamer.jpeg",
      price: 5999.99,
      oldPrice: 9999.99,
      discount: 40,
      timeLeft: "1h 45m",
      category: "PC Bureau",
    },
    {
      id: 2,
      name: "Laptop Dell XPS 15",
      image: "/laptob.jpeg",
      price: 4599.99,
      oldPrice: 6299.99,
      discount: 27,
      timeLeft: "3h 20m",
      category: "PC Portable",
    },
  ];

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % specialOffers.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, specialOffers.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % specialOffers.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + specialOffers.length) % specialOffers.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const handleAddToCart = (offer: SpecialOffer) => {
    addToCart(
      {
        id: offer.id,
        name: offer.name,
        price: offer.price,
        image: offer.image,
        category: offer.category,
      },
      1
    );
    setAddedToCart(offer.id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  return (
    <div className={`relative rounded-3xl overflow-hidden border-4 shadow-2xl mb-12 w-full ${
      theme === 'light'
        ? 'bg-white border-[#fe8002]/30 shadow-[#fe8002]/20'
        : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-[#fe8002]/30 shadow-[#fe8002]/20'
    }`}>
      {/* Header Badge */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-3 bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] px-6 py-3 rounded-full shadow-2xl border-2 border-white/30 animate-pulse">
        <FaFire className="text-white text-xl" />
        <span className="text-white font-extrabold text-sm uppercase tracking-wider">
          Offres Spéciales
        </span>
        <FaTag className="text-white text-lg" />
      </div>

      {/* Carousel Container */}
      <div 
        className="relative h-[600px] sm:h-[500px] md:h-[550px] lg:h-[600px] w-full"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        onTouchStart={() => setIsAutoPlaying(false)}
        onTouchEnd={() => setTimeout(() => setIsAutoPlaying(true), 500)}
      >
        {specialOffers.map((offer, index) => (
          <div
            key={offer.id}
            className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${
              index === currentSlide
                ? "opacity-100 translate-x-0"
                : index < currentSlide
                ? "opacity-0 -translate-x-full"
                : "opacity-0 translate-x-full"
            }`}
          >
            <div className="flex flex-col md:grid md:grid-cols-2 w-full h-full gap-0">
              {/* Left Side - Image */}
              <div className={`relative overflow-hidden h-48 sm:h-64 md:h-full ${
                theme === 'light' ? 'bg-gradient-to-br from-gray-100 to-gray-50' : 'bg-gradient-to-br from-[#0f0f0f] to-black'
              }`}>
                <div className="relative h-full w-full">
                  <Image
                    src={offer.image}
                    alt={offer.name}
                    fill
                    className="object-contain p-4 sm:p-6 md:p-8 lg:p-12"
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                
                {/* Discount Badge */}
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 md:top-6 md:right-6 bg-gradient-to-br from-red-600 via-red-500 to-orange-500 text-white px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl shadow-2xl transform rotate-12 border-2 md:border-4 border-white/30 z-10">
                  <div className="text-xl sm:text-2xl md:text-4xl font-extrabold leading-none">-{offer.discount}%</div>
                  <div className="text-[0.6rem] sm:text-xs font-bold uppercase tracking-wider">Remise</div>
                </div>

                {/* Animated overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent ${
                  theme === 'light' ? 'from-gray-200/30' : 'from-black/40'
                }`} />
              </div>

              {/* Right Side - Details */}
              <div className={`flex flex-col justify-center p-4 sm:p-6 md:p-8 lg:p-12 pb-16 sm:pb-20 md:pb-12 relative overflow-y-auto w-full h-full ${
                theme === 'light' ? 'bg-white' : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]'
              }`}>
                {/* Category Badge */}
                <div className="inline-block mb-2 sm:mb-3 md:mb-4">
                  <span className={`text-[0.65rem] sm:text-xs font-bold text-[#fe8002] px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full border border-[#fe8002]/40 shadow-md uppercase tracking-wider ${
                    theme === 'light' ? 'bg-orange-50' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a]'
                  }`}>
                    {offer.category}
                  </span>
                </div>

                {/* Product Name */}
                <h3 className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold mb-2 sm:mb-3 md:mb-4 leading-tight ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {offer.name}
                </h3>

                {/* Price Section */}
                <div className="mb-2 sm:mb-3 md:mb-4">
                  <div className="flex items-baseline gap-2 sm:gap-3 mb-1 sm:mb-2 flex-wrap">
                    <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-[#fe8002] to-[#ff4500] bg-clip-text text-transparent">
                      {offer.price.toLocaleString('fr-DZ', { minimumFractionDigits: 2 })}
                    </span>
                    <span className={`text-sm sm:text-base md:text-lg lg:text-xl font-bold ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      DZD
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <span className={`text-xs sm:text-sm md:text-base lg:text-lg line-through ${theme === 'light' ? 'text-gray-500' : 'text-gray-600'}`}>
                      {offer.oldPrice.toLocaleString('fr-DZ', { minimumFractionDigits: 2 })} DZD
                    </span>
                    <span className="bg-green-600 text-white text-[0.65rem] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full whitespace-nowrap">
                      Économisez {(offer.oldPrice - offer.price).toLocaleString('fr-DZ', { minimumFractionDigits: 0 })} DZD
                    </span>
                  </div>
                </div>

                {/* Time Left */}
                <div className={`flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-6 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 w-fit ${
                  theme === 'light'
                    ? 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-300'
                    : 'bg-gradient-to-r from-[#fe8002]/10 to-red-900/10 border-[#fe8002]/40'
                }`}>
                  <FaClock className="text-[#fe8002] text-sm sm:text-base md:text-lg animate-pulse flex-shrink-0" />
                  <div>
                    <div className={`text-[0.65rem] sm:text-xs font-semibold uppercase ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      Offre expire dans
                    </div>
                    <div className="text-base sm:text-lg md:text-xl font-extrabold text-[#fe8002]">{offer.timeLeft}</div>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(offer)}
                  disabled={addedToCart === offer.id}
                  className={`w-full px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-extrabold text-sm sm:text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-xl border-2 border-white/30 flex items-center justify-center gap-2 ${
                    addedToCart === offer.id
                      ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-green-500/50"
                      : "bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-white hover:shadow-[#fe8002]/60"
                  }`}
                >
                  {addedToCart === offer.id ? (
                    <>
                      <span className="text-lg sm:text-xl">✓</span>
                      <span className="text-xs sm:text-sm md:text-base">AJOUTÉ</span>
                    </>
                  ) : (
                    <>
                      <FaShoppingCart className="text-sm sm:text-base md:text-lg" />
                      <span className="text-xs sm:text-sm md:text-base">AJOUTER AU PANIER</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Hidden on mobile */}
      <button
        onClick={prevSlide}
        className={`hidden md:block absolute left-4 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full transition-all duration-300 hover:scale-110 shadow-2xl border-2 border-white/30 ${
          theme === 'light'
            ? 'bg-white/90 text-[#fe8002] hover:bg-[#fe8002] hover:text-white'
            : 'bg-black/50 backdrop-blur-md text-white hover:bg-[#fe8002]'
        }`}
      >
        <FaChevronLeft className="text-2xl" />
      </button>
      
      <button
        onClick={nextSlide}
        className={`hidden md:block absolute right-4 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full transition-all duration-300 hover:scale-110 shadow-2xl border-2 border-white/30 ${
          theme === 'light'
            ? 'bg-white/90 text-[#fe8002] hover:bg-[#fe8002] hover:text-white'
            : 'bg-black/50 backdrop-blur-md text-white hover:bg-[#fe8002]'
        }`}
      >
        <FaChevronRight className="text-2xl" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2 sm:gap-3 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
        {specialOffers.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full border-2 border-white/50 ${
              index === currentSlide
                ? "w-8 sm:w-12 h-3 sm:h-4 bg-gradient-to-r from-[#fe8002] to-[#ff4500]"
                : "w-3 sm:w-4 h-3 sm:h-4 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${
        theme === 'light' ? 'bg-gray-300/40' : 'bg-gray-800/20'
      }`}>
        <div
          className="h-full bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] transition-all duration-300"
          style={{
            width: `${((currentSlide + 1) / specialOffers.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};

export default OffersCarousel;
