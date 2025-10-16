"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import Image from "next/image";
import { FaHeart, FaShoppingCart, FaTrash, FaArrowLeft } from "react-icons/fa";

const WishlistPage = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { wishlistItems, removeFromWishlist, clearWishlist, getWishlistItemsCount } = useWishlist();
  const { addToCart } = useCart();
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

  const handleAddAllToCart = () => {
    wishlistItems.forEach((item) => {
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
    });
  };

  return (
    <main className={`min-h-screen relative overflow-hidden transition-all duration-300 ${
      theme === 'light' ? 'bg-gradient-to-br from-gray-50 via-white to-gray-100' : 'bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a]'
    }`}>
      {/* Background Pattern */}
      <div className={`absolute inset-0 ${theme === 'light' ? 'opacity-[0.03]' : 'opacity-[0.02]'}`}>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #fe8002 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      {/* Subtle orange accent gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fe8002]/10 via-transparent to-[#ff4500]/10 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={() => router.push("/")}
                className="text-[#fe8002] hover:text-[#ff4500] transition-colors flex items-center gap-2 font-bold text-lg group"
              >
                <FaArrowLeft className="group-hover:-translate-x-2 transition-transform" />
                RETOUR
              </button>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] bg-clip-text text-transparent mb-6 tracking-tight flex items-center justify-center gap-4 drop-shadow-lg drop-shadow-[#fe8002]/50">
              <FaHeart className="text-[#fe8002]" />
              MA LISTE DE SOUHAITS
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[#fe8002] to-transparent mx-auto mb-6 shadow-lg shadow-[#fe8002]/50" />
            <p className="text-gray-400 text-xl max-w-2xl mx-auto font-semibold">
              {getWishlistItemsCount() > 0 
                ? `Vous avez ${getWishlistItemsCount()} produit(s) dans votre liste de souhaits`
                : "Votre liste de souhaits est vide"}
            </p>
          </div>
        </div>
      </section>

      {/* Wishlist Content */}
      <section className="relative z-10 pb-20 px-4">
        <div className="container mx-auto">
          {wishlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20">
              <div className={`p-16 rounded-3xl border-4 border-[#fe8002]/40 shadow-2xl shadow-[#fe8002]/20 backdrop-blur-xl max-w-2xl ${
                theme === 'light'
                  ? 'bg-white'
                  : 'bg-gradient-to-br from-[#1a1a1a] via-[#181818] to-[#0f0f0f]'
              }`}>
                <FaHeart className="text-8xl text-[#fe8002] mb-6 animate-bounce mx-auto" />
                <p className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-[#fe8002] to-[#ff4500] bg-clip-text text-transparent">
                  VOTRE LISTE EST VIDE
                </p>
                <p className="text-gray-400 text-xl mb-8 leading-relaxed">
                  Ajoutez vos produits préférés à votre liste de souhaits
                </p>
                <button 
                  onClick={() => router.push("/")}
                  className="bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-black font-extrabold py-4 px-10 text-lg rounded-2xl hover:scale-110 transition-all duration-300 shadow-2xl shadow-[#fe8002]/60 uppercase tracking-wide border-2 border-white/30"
                >
                  DÉCOUVRIR NOS PRODUITS
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Action Buttons */}
              <div className={`flex flex-col sm:flex-row gap-4 justify-between items-center mb-8 p-6 rounded-2xl border-2 border-[#fe8002]/30 shadow-xl ${
                theme === 'light' 
                  ? 'bg-white' 
                  : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]'
              }`}>
                <div className="flex items-center gap-3">
                  <FaHeart className="text-[#fe8002] text-3xl animate-pulse" />
                  <span className={`font-bold text-xl ${
                    theme === 'light' ? 'text-gray-800' : 'text-white'
                  }`}>
                    <span className="text-[#fe8002] font-extrabold text-3xl">{getWishlistItemsCount()}</span> PRODUIT(S)
                  </span>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleAddAllToCart}
                    className="bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-black font-extrabold py-3 px-6 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-[#fe8002]/60 uppercase tracking-wide text-sm border-2 border-white/30 flex items-center gap-2"
                  >
                    <FaShoppingCart />
                    TOUT AJOUTER AU PANIER
                  </button>
                  <button
                    onClick={clearWishlist}
                    className="bg-gradient-to-r from-red-600 to-red-700 text-white font-extrabold py-3 px-6 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-red-500/60 uppercase tracking-wide text-sm border-2 border-white/30 flex items-center gap-2"
                  >
                    <FaTrash />
                    TOUT SUPPRIMER
                  </button>
                </div>
              </div>

              {/* Wishlist Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className={`group rounded-2xl overflow-hidden shadow-2xl hover:shadow-[#fe8002]/60 transition-all duration-500 border-2 hover:border-[#fe8002] hover:-translate-y-3 hover:scale-105 backdrop-blur-sm ${
                      theme === 'light'
                        ? 'bg-white border-gray-300'
                        : 'bg-gradient-to-br from-[#1a1a1a] via-[#181818] to-[#0f0f0f] border-[#2a2a2a]'
                    }`}
                  >
                    <div className={`relative h-64 w-full overflow-hidden border-b-2 border-[#fe8002]/20 ${
                      theme === 'light' ? 'bg-gray-100' : 'bg-gradient-to-br from-[#0f0f0f] to-black'
                    }`}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity duration-300" />
                      
                      {/* Remove from Wishlist Button */}
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="absolute top-3 right-3 bg-gradient-to-r from-red-600 to-red-700 text-white p-3 rounded-xl hover:from-red-500 hover:to-red-600 transition-all duration-300 hover:scale-110 shadow-2xl shadow-red-500/50 border-2 border-white/20 z-10 backdrop-blur-sm"
                        title="Retirer de la liste"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                      
                      {/* Favorite Badge */}
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-white px-3 py-1.5 rounded-full text-xs font-extrabold shadow-xl shadow-[#fe8002]/50 border border-white/20 flex items-center gap-1 backdrop-blur-sm">
                        <FaHeart className="text-xs" />
                        FAVORI
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold text-[#fe8002] px-4 py-1.5 rounded-full border border-[#fe8002]/40 shadow-md shadow-[#fe8002]/20 uppercase tracking-wider ${
                          theme === 'light' ? 'bg-orange-50' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a]'
                        }`}>
                          {item.category}
                        </span>
                      </div>
                      
                      <h3 className={`font-bold text-lg leading-tight group-hover:text-[#fe8002] transition-colors duration-300 line-clamp-2 min-h-[3.5rem] ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>
                        {item.name}
                      </h3>
                      
                      <div className={`rounded-xl p-3 border border-[#fe8002]/20 ${
                        theme === 'light' ? 'bg-gray-50' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a]'
                      }`}>
                        <div className="flex items-baseline gap-2 justify-center">
                          <p className="text-3xl font-extrabold bg-gradient-to-r from-[#fe8002] to-[#ff4500] bg-clip-text text-transparent">
                            {item.price.toLocaleString('fr-DZ', { minimumFractionDigits: 0 })}
                          </p>
                          <span className="text-gray-400 text-sm font-semibold">DZD</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleAddToCart(item)}
                        className={`w-full py-4 px-4 rounded-xl font-extrabold transition-all duration-300 transform flex items-center justify-center gap-3 text-sm uppercase tracking-wide shadow-2xl ${
                          addedToCart === item.id
                            ? "bg-gradient-to-r from-green-600 via-green-500 to-green-600 text-white border-2 border-white/30 shadow-green-500/60 scale-105"
                            : "bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-black hover:scale-105 hover:shadow-[#fe8002]/70 border-2 border-white/30"
                        }`}
                      >
                        <FaShoppingCart className="text-lg" />
                        {addedToCart === item.id ? "✓ AJOUTÉ AU PANIER" : "AJOUTER AU PANIER"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default WishlistPage;
