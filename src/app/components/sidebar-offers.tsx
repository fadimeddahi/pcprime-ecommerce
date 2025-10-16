"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { FaFire, FaTimes, FaShoppingCart, FaTag, FaClock } from "react-icons/fa";

interface TopOffer {
  id: number;
  name: string;
  image: string;
  price: number;
  oldPrice: number;
  discount: number;
  timeLeft: string;
}

const SidebarOffers = () => {
  const { theme } = useTheme();
  const { addToCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState<number | null>(null);

  const topOffers: TopOffer[] = [
    {
      id: 1,
      name: "PC Gamer RTX 4090",
      image: "/pc gamer.jpeg",
      price: 8999.99,
      oldPrice: 10999.99,
      discount: 18,
      timeLeft: "2h 15m",
    },
    {
      id: 3,
      name: "RTX 4070",
      image: "/rtx.jpeg",
      price: 2499.99,
      oldPrice: 3299.99,
      discount: 24,
      timeLeft: "5h 30m",
    },
    {
      id: 101,
      name: "PC RTX 3070 - Occasion",
      image: "/pc gamer.jpeg",
      price: 5999.99,
      oldPrice: 9999.99,
      discount: 40,
      timeLeft: "1h 45m",
    },
    {
      id: 2,
      name: "Laptop Dell XPS",
      image: "/laptob.jpeg",
      price: 4599.99,
      oldPrice: 6299.99,
      discount: 27,
      timeLeft: "3h 20m",
    },
  ];

  const handleAddToCart = (offer: TopOffer) => {
    addToCart(
      {
        id: offer.id,
        name: offer.name,
        price: offer.price,
        image: offer.image,
        category: "Promo",
      },
      1
    );
    setAddedToCart(offer.id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  // Auto-open sidebar after 3 seconds on first visit
  useEffect(() => {
    const hasSeenSidebar = sessionStorage.getItem("hasSeenOffersSidebar");
    if (!hasSeenSidebar) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("hasSeenOffersSidebar", "true");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      {/* Toggle Button - Fixed on right side - HIDDEN ON MOBILE */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`hidden md:block fixed right-0 top-1/2 -translate-y-1/2 z-40 py-8 px-4 rounded-l-3xl shadow-2xl transition-all duration-300 hover:px-5 hover:shadow-[#fe8002] group border-l-4 border-t-4 border-b-4 border-white/30 ${
            theme === 'light'
              ? 'bg-gradient-to-br from-[#fe8002] via-[#ff4500] to-[#ff6b35] text-white hover:from-[#ff4500] hover:via-[#fe8002] hover:to-[#ff4500]'
              : 'bg-gradient-to-br from-[#fe8002] via-[#ff4500] to-[#ff6b35] text-white hover:from-[#ff4500] hover:via-[#fe8002] hover:to-[#ff4500]'
          }`}
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed'
          }}
        >
          <div className="flex flex-col items-center gap-3">
            <FaFire className="text-3xl animate-bounce drop-shadow-lg" style={{ writingMode: 'horizontal-tb' }} />
            <div className="text-sm font-extrabold uppercase tracking-widest whitespace-nowrap">
              TOP OFFRES
            </div>
            <div className="w-8 h-0.5 bg-white/50 rounded-full" style={{ writingMode: 'horizontal-tb' }} />
            <FaTag className="text-2xl drop-shadow-lg" style={{ writingMode: 'horizontal-tb' }} />
            <div className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm border border-white/30">
              -40%
            </div>
          </div>
        </button>
      )}

      {/* Sidebar - HIDDEN ON MOBILE */}
      <div
        className={`hidden md:block fixed right-0 top-0 h-full w-80 lg:w-96 z-50 transform transition-transform duration-500 ease-in-out shadow-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } ${
          theme === 'light'
            ? 'bg-white'
            : 'bg-gradient-to-b from-[#1a1a1a] via-[#0f0f0f] to-[#0a0a0a]'
        }`}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] p-6 shadow-2xl overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          <div className="absolute inset-0">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
            }} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <FaFire className="text-4xl text-white animate-pulse drop-shadow-2xl" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-white uppercase tracking-wide drop-shadow-lg">
                    TOP OFFRES
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-white/90 text-xs font-bold uppercase tracking-wider">
                      Offres Flash
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:rotate-90 transition-all duration-300 p-2.5 hover:bg-white/20 rounded-xl backdrop-blur-sm border border-white/20 hover:scale-110"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <p className="text-white/95 text-sm font-semibold bg-black/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/20">
              ⚡ Offres limitées - Profitez-en maintenant !
            </p>
          </div>
        </div>

        {/* Offers List */}
        <div className="h-[calc(100%-180px)] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[#fe8002] scrollbar-track-transparent">
          {topOffers.map((offer, index) => (
            <div
              key={offer.id}
              className={`rounded-2xl p-4 border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl relative overflow-hidden group animate-slide-in ${
                theme === 'light'
                  ? 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-[#fe8002] hover:shadow-[#fe8002]/30'
                  : 'bg-gradient-to-br from-[#1f1f1f] via-[#1a1a1a] to-[#0f0f0f] border-[#2a2a2a] hover:border-[#fe8002] hover:shadow-[#fe8002]/40'
              }`}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Animated glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#fe8002]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
              
              {/* Discount Badge */}
              <div className="absolute top-3 right-3 z-10">
                <div className="relative">
                  <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white px-3 py-1.5 rounded-full text-xs font-extrabold shadow-2xl animate-pulse border-2 border-white/30 backdrop-blur-sm">
                    -{offer.discount}%
                  </div>
                  <div className="absolute inset-0 bg-red-500 rounded-full blur-md opacity-50 animate-ping" />
                </div>
              </div>

              {/* Product Image */}
              <div className={`relative h-36 w-full rounded-xl overflow-hidden mb-3 border-2 ${
                theme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-black/50 border-[#fe8002]/20'
              }`}>
                <Image
                  src={offer.image}
                  alt={offer.name}
                  fill
                  className="object-contain p-3 group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </div>

              {/* Product Info */}
              <h3 className={`font-bold text-sm mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-[#fe8002] transition-colors ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {offer.name}
              </h3>

              {/* Price */}
              <div className="mb-3">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-extrabold bg-gradient-to-r from-[#fe8002] to-[#ff4500] bg-clip-text text-transparent">
                    {offer.price.toLocaleString('fr-DZ', { minimumFractionDigits: 0 })}
                  </span>
                  <span className={`text-xs font-bold ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    DZD
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm line-through text-gray-500">
                    {offer.oldPrice.toLocaleString('fr-DZ', { minimumFractionDigits: 0 })} DZD
                  </span>
                  <span className="text-xs font-bold text-green-500">
                    Économisez {(offer.oldPrice - offer.price).toLocaleString('fr-DZ', { minimumFractionDigits: 0 })} DZD
                  </span>
                </div>
              </div>

              {/* Time Left */}
              <div className={`flex items-center gap-2 mb-3 px-3 py-2 rounded-lg border ${
                theme === 'light' 
                  ? 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200' 
                  : 'bg-gradient-to-r from-[#fe8002]/10 to-red-900/10 border-[#fe8002]/30'
              }`}>
                <FaClock className="text-[#fe8002] text-sm animate-pulse" />
                <span className="text-xs font-bold text-[#fe8002] flex-1">
                  Se termine dans: {offer.timeLeft}
                </span>
                <div className="w-2 h-2 bg-[#fe8002] rounded-full animate-pulse" />
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(offer)}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg border-2 ${
                  addedToCart === offer.id
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white border-white/30 shadow-green-500/50'
                    : 'bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-white hover:scale-105 shadow-[#fe8002]/50 border-white/30 hover:shadow-[#fe8002]/70'
                }`}
              >
                <FaShoppingCart className="text-base" />
                {addedToCart === offer.id ? '✓ AJOUTÉ' : 'AJOUTER'}
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className={`absolute bottom-0 left-0 right-0 p-5 border-t-2 shadow-2xl ${
          theme === 'light'
            ? 'bg-white border-gray-200'
            : 'bg-gradient-to-t from-[#0a0a0a] via-[#0f0f0f] to-transparent border-[#fe8002]/30'
        }`}>
          <button
            onClick={() => setIsOpen(false)}
            className="w-full bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-white font-extrabold py-3.5 rounded-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 shadow-lg shadow-[#fe8002]/50 border-2 border-white/30 uppercase tracking-wide text-sm"
          >
            ← CONTINUER MES ACHATS
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default SidebarOffers;
