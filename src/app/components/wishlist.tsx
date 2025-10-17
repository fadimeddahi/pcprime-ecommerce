"use client";

import Image from "next/image";
import { FaHeart, FaTimes, FaTrash, FaShoppingCart } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { useState } from "react";

interface WishlistProps {
  isOpen: boolean;
  onClose: () => void;
}

const Wishlist = ({ isOpen, onClose }: WishlistProps) => {
  const { wishlistItems, removeFromWishlist, getWishlistItemsCount } = useWishlist();
  const { addToCart } = useCart();
  const { theme } = useTheme();
  const [addedToCart, setAddedToCart] = useState<number | null>(null);

  const handleAddToCart = (item: any) => {
    addToCart(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
      },
      1
    );
    setAddedToCart(item.id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  return (
    <>
      {/* Inline Theme Detection Script for Wishlist */}
      {isOpen && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      )}
      
      {/* Full-Screen Wishlist Overlay */}
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Background Overlay */}
        <div 
          className={`absolute inset-0 backdrop-blur-md z-[101] ${
            theme === 'light' ? 'bg-black/60' : 'bg-black/80'
          }`}
          onClick={onClose}
        />
        
        {/* Wishlist Modal */}
        <div
          className={`relative z-[102] w-full h-full shadow-2xl border-0 md:border-4 md:border-[#fe8002] rounded-none md:rounded-3xl transform transition-all duration-300 overflow-hidden flex flex-col ${
            isOpen ? "scale-100" : "scale-95"
          } ${
            theme === 'light' 
              ? 'bg-gradient-to-br from-gray-50 via-white to-gray-100' 
              : 'bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0a0a0a]'
          }`}
        >
          {/* Header */}
          <div className={`flex flex-col sm:flex-row justify-between items-center gap-3 p-4 md:p-6 border-b-4 shadow-2xl flex-shrink-0 relative ${
            theme === 'light'
              ? 'bg-white border-gray-200'
              : 'bg-gradient-to-r from-[#1a1a1a] via-[#0f0f0f] to-black border-white/20'
          }`}>
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent to-transparent ${
              theme === 'light' ? 'via-[#fe8002]/30' : 'via-white/30'
            }`} />
            <h2 className={`text-2xl md:text-3xl lg:text-4xl font-extrabold flex items-center gap-3 ${
              theme === 'light'
                ? 'text-gray-900'
                : 'bg-gradient-to-r from-white via-[#fe8002] to-white bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]'
            }`}>
              <FaHeart className="text-[#fe8002] text-2xl md:text-3xl" />
              MA LISTE DE SOUHAITS
              {getWishlistItemsCount() > 0 && (
                <span className="text-sm md:text-lg bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-white px-3 py-1 rounded-full shadow-xl shadow-[#fe8002]/60 border-2 border-white/30 animate-pulse">
                  {getWishlistItemsCount()}
                </span>
              )}
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-white to-gray-100 text-black font-extrabold px-6 py-2 rounded-xl hover:scale-110 transition-all duration-300 shadow-lg shadow-white/50 hover:shadow-white/70 border-2 border-white/40 text-sm uppercase tracking-wide"
              >
                RETOUR
              </button>
              <button
                onClick={onClose}
                className="text-[#fe8002] text-2xl md:text-3xl hover:scale-125 hover:rotate-90 transition-all duration-300 p-2 rounded-full hover:bg-[#fe8002]/20"
                aria-label="Close wishlist"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Wishlist Content */}
          <div className="flex-1 overflow-y-auto p-3 md:p-6 scrollbar-hide scroll-smooth">
            <div className="min-h-full flex items-center justify-center">
              {wishlistItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center px-4">
                  <div className={`p-12 md:p-16 rounded-3xl border-4 border-[#fe8002]/40 shadow-2xl shadow-[#fe8002]/20 backdrop-blur-xl max-w-2xl ${
                    theme === 'light'
                      ? 'bg-white'
                      : 'bg-gradient-to-br from-[#1a1a1a] via-[#181818] to-[#0f0f0f]'
                  }`}>
                    <FaHeart className="text-7xl md:text-8xl text-[#fe8002] mb-6 animate-bounce mx-auto" />
                    <p className="text-3xl md:text-4xl font-extrabold mb-4 bg-gradient-to-r from-[#fe8002] to-[#ff4500] bg-clip-text text-transparent">
                      VOTRE LISTE EST VIDE
                    </p>
                    <p className="text-gray-400 text-lg md:text-xl mb-8 leading-relaxed">
                      Ajoutez vos produits préférés à votre liste de souhaits
                    </p>
                    <button 
                      onClick={onClose}
                      className="bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-black font-extrabold py-4 px-10 text-lg rounded-2xl hover:scale-110 transition-all duration-300 shadow-2xl shadow-[#fe8002]/60 uppercase tracking-wide border-2 border-white/30"
                    >
                      DÉCOUVRIR NOS PRODUITS
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-5xl mx-auto space-y-3 py-4">
                  {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-xl p-3 border-2 hover:border-[#fe8002] transition-all duration-300 shadow-xl hover:shadow-[#fe8002]/40 backdrop-blur-sm flex gap-3 items-center ${
                      theme === 'light'
                        ? 'bg-white border-gray-300'
                        : 'bg-gradient-to-br from-[#1f1f1f] via-[#1a1a1a] to-[#0f0f0f] border-[#2a2a2a]'
                    }`}
                  >
                    {/* Product Image */}
                    <div className={`relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 border-[#fe8002]/40 shadow-lg group ${
                      theme === 'light' ? 'bg-gray-100' : 'bg-gradient-to-br from-[#0f0f0f] to-black'
                    }`}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="100px"
                        className="object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold text-sm md:text-base leading-tight hover:text-[#fe8002] transition-colors line-clamp-1 mb-1 ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>
                        {item.name}
                      </h3>
                      <span className={`text-xs font-bold text-[#fe8002] px-3 py-1 rounded-full border border-[#fe8002]/40 shadow-md shadow-[#fe8002]/20 uppercase tracking-wider inline-block mb-2 ${
                        theme === 'light' ? 'bg-orange-50' : 'bg-gradient-to-r from-[#1a1a1a] to-[#0f0f0f]'
                      }`}>
                        {item.category}
                      </span>
                      <div className="flex items-baseline gap-1">
                        <p className="text-base md:text-lg font-extrabold bg-gradient-to-r from-[#fe8002] to-[#ff4500] bg-clip-text text-transparent">
                          {item.price.toLocaleString('fr-DZ', { minimumFractionDigits: 0 })}
                        </p>
                        <span className="text-gray-400 text-xs font-bold">DZD</span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 transform flex items-center justify-center gap-2 text-xs uppercase tracking-wide ${
                          addedToCart === item.id
                            ? "bg-gradient-to-r from-green-600 to-green-700 text-white border border-white/20 shadow-lg shadow-green-500/50"
                            : "bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-black hover:scale-105 shadow-lg shadow-[#fe8002]/50 border border-white/20"
                        }`}
                      >
                        <FaShoppingCart className="text-sm" />
                        {addedToCart === item.id ? "✓" : "PANIER"}
                      </button>
                      
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="px-4 py-2 bg-gradient-to-r from-red-600 via-red-700 to-red-600 text-white rounded-xl hover:from-red-500 hover:to-red-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-red-500/60 flex items-center justify-center gap-2 border border-white/20 font-bold text-xs uppercase tracking-wide"
                        title="Supprimer"
                      >
                        <FaTrash className="text-xs" />
                        RETIRER
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>

          {/* Footer */}
          {wishlistItems.length > 0 && (
            <div className={`flex-shrink-0 border-t-4 border-[#fe8002] p-4 md:p-6 shadow-2xl backdrop-blur-xl ${
              theme === 'light'
                ? 'bg-white'
                : 'bg-gradient-to-br from-[#1a1a1a] via-[#181818] to-[#0f0f0f]'
            }`}>
              <div className="max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaHeart className="text-[#fe8002] text-2xl animate-pulse" />
                    <span className={`font-bold text-lg ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      <span className="text-[#fe8002] font-extrabold text-2xl">{getWishlistItemsCount()}</span> PRODUIT(S) DANS VOTRE LISTE
                    </span>
                  </div>
                  
                  <button 
                    onClick={onClose}
                    className="w-full sm:w-auto bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-black font-extrabold py-3 px-8 rounded-2xl hover:from-white hover:to-gray-200 transition-all duration-300 shadow-xl shadow-[#fe8002]/60 hover:shadow-[#fe8002]/80 hover:scale-105 uppercase tracking-wider border-2 border-white/30"
                  >
                    ← CONTINUER MES ACHATS
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Wishlist;
