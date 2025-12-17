"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { FaShoppingCart, FaTimes, FaTrash } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { useRouter } from "next/navigation";
import UpsellWidget from "./upsell-widget";
import { useCartRecommendations } from "../hooks/useRecommendations";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart = ({ isOpen, onClose }: CartProps) => {
  const router = useRouter();
  const { theme } = useTheme();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartItemsCount } = useCart();
  
  // Get recommendations based on cart items
  const cartItemsForRec = cartItems.map(item => ({ id: item.id, category: item.category }));
  const { data: recommendations = [] } = useCartRecommendations(cartItemsForRec);

  const handleCheckoutClick = () => {
    onClose();
    router.push("/checkout");
  };

  return (
    <>
      {/* Full-Screen Cart Overlay */}
      <div
        className={`fixed inset-0 z-[10000] flex transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {/* Background Overlay */}
        <div 
          className={`absolute inset-0 backdrop-blur-md ${
            theme === 'light' ? 'bg-black/60' : 'bg-black/80'
          }`}
          onClick={onClose}
        />
        
        {/* Cart Modal */}
        <div
          className={`relative w-full h-screen md:w-[85vw] md:h-[90vh] lg:w-[82vw] lg:h-[90vh] xl:w-[80vw] xl:h-[90vh] shadow-2xl border-0 md:border-4 border-[#fe8002] rounded-none md:rounded-3xl transform transition-all duration-300 overflow-hidden flex flex-col ${
            isOpen ? "scale-100" : "scale-95"
          } ${
            theme === 'light' 
              ? 'bg-gradient-to-br from-white via-gray-50 to-gray-100' 
              : 'bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0a0a0a]'
          }`}
        >
          {/* Header */}
          <div className={`flex flex-col sm:flex-row justify-between items-center gap-3 p-4 md:p-6 border-b-4 shadow-2xl flex-shrink-0 relative ${
            theme === 'light'
              ? 'border-gray-300/50 bg-gradient-to-r from-white via-gray-50 to-white'
              : 'border-white/20 bg-gradient-to-r from-[#1a1a1a] via-[#0f0f0f] to-black'
          }`}>
            <div className={`absolute top-0 left-0 right-0 h-1 ${
              theme === 'light' 
                ? 'bg-gradient-to-r from-transparent via-orange-300/30 to-transparent' 
                : 'bg-gradient-to-r from-transparent via-white/30 to-transparent'
            }`} />
            <h2 className={`text-2xl md:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r bg-clip-text text-transparent flex items-center gap-3 ${
              theme === 'light'
                ? 'from-gray-800 via-[#fe8002] to-gray-800 drop-shadow-md'
                : 'from-white via-[#fe8002] to-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]'
            }`}>
              <FaShoppingCart className="text-[#fe8002] text-2xl md:text-3xl" />
              Mon Panier
              {getCartItemsCount() > 0 && (
                <span className="text-sm md:text-lg bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-white px-3 py-1 rounded-full shadow-xl shadow-[#fe8002]/60 border-2 border-white/30 animate-pulse">
                  {getCartItemsCount()}
                </span>
              )}
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className={`font-extrabold px-6 py-2 rounded-xl hover:scale-110 transition-all duration-300 shadow-lg border-2 text-sm uppercase tracking-wide ${
                  theme === 'light'
                    ? 'bg-gradient-to-r from-white to-gray-100 text-black shadow-gray-300/50 hover:shadow-gray-300/70 border-gray-300/40'
                    : 'bg-gradient-to-r from-white to-gray-100 text-black shadow-white/50 hover:shadow-white/70 border-white/40'
                }`}
              >
                Retour à la boutique
              </button>
              <button
                onClick={onClose}
                className={`text-[#fe8002] text-2xl md:text-3xl hover:scale-125 hover:rotate-90 transition-all duration-300 p-2 rounded-full ${
                  theme === 'light' ? 'hover:bg-[#fe8002]/10' : 'hover:bg-[#fe8002]/20'
                }`}
                aria-label="Close cart"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto flex flex-col">
            {cartItems.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className={`p-12 md:p-16 rounded-3xl border-4 border-[#fe8002]/40 shadow-2xl backdrop-blur-xl max-w-2xl ${
                    theme === 'light'
                      ? 'bg-white shadow-[#fe8002]/30'
                      : 'bg-gradient-to-br from-[#1a1a1a] via-[#181818] to-[#0f0f0f] shadow-[#fe8002]/20'
                  }`}>
                    <FaShoppingCart className="text-7xl md:text-8xl text-[#fe8002] mb-6 animate-bounce mx-auto" />
                    <p className="text-3xl md:text-4xl font-extrabold mb-4 bg-gradient-to-r from-[#fe8002] to-[#ff4500] bg-clip-text text-transparent">
                      Votre panier est vide
                    </p>
                    <p className={`text-lg md:text-xl mb-8 leading-relaxed ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      Ajoutez des produits pour commencer vos achats
                    </p>
                    <button 
                      onClick={onClose}
                      className="bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-white font-extrabold py-4 px-10 text-lg rounded-2xl hover:scale-110 transition-all duration-300 shadow-2xl shadow-[#fe8002]/60 uppercase tracking-wide border-2 border-white/30"
                    >
                      Continuer mes achats
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 md:p-6 scrollbar-hide">
                <div className="w-full max-w-5xl mx-auto space-y-4">
                  {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-xl p-1.5 border-2 hover:border-[#fe8002] transition-all duration-300 shadow-xl hover:shadow-[#fe8002]/40 backdrop-blur-sm ${
                      theme === 'light'
                        ? 'bg-white border-gray-300'
                        : 'bg-gradient-to-br from-[#1f1f1f] via-[#1a1a1a] to-[#0f0f0f] border-[#2a2a2a]'
                    }`}
                  >
                    {/* Mobile Layout */}
                    <div className="md:hidden">
                      <div className="flex gap-1.5 mb-1.5">
                        {/* Product Image */}
                        <div className={`relative w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden border-2 border-[#fe8002]/40 shadow-lg ${
                          theme === 'light' ? 'bg-gray-50' : 'bg-gradient-to-br from-[#0f0f0f] to-black'
                        }`}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="40px"
                            className="object-contain"
                          />
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-bold text-[10px] leading-tight hover:text-[#fe8002] transition-colors mb-0.5 ${
                            theme === 'light' ? 'text-gray-800' : 'text-white'
                          }`}>
                            {item.name}
                          </h3>
                          <div className="flex items-baseline gap-0.5">
                            <p className="text-xs font-extrabold bg-gradient-to-r from-[#fe8002] to-[#ff4500] bg-clip-text text-transparent">
                              {item.price.toLocaleString('fr-DZ', { minimumFractionDigits: 0 })}
                            </p>
                            <span className={`text-[8px] font-bold ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>DZD</span>
                          </div>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-5 h-5 flex-shrink-0 bg-gradient-to-r from-red-600 via-red-700 to-red-600 text-white rounded-lg hover:from-red-500 hover:to-red-600 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-red-500/60 flex items-center justify-center border border-white/20"
                          title="Supprimer"
                        >
                          <FaTrash className="text-[8px]" />
                        </button>
                      </div>
                      
                      {/* Bottom Row: Quantity and Total */}
                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className={`flex items-center gap-2 rounded-lg border border-[#fe8002]/40 p-1.5 shadow-lg ${
                          theme === 'light' ? 'bg-gray-50' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a]'
                        }`}>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-white font-extrabold text-sm rounded-md hover:shadow-lg hover:shadow-[#fe8002]/60 transition-all duration-300 hover:scale-110 border border-white/30 flex items-center justify-center"
                          >
                            −
                          </button>
                          <span className={`font-extrabold text-base w-10 text-center ${
                            theme === 'light' ? 'text-gray-800' : 'text-white'
                          }`}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-white font-extrabold text-sm rounded-md hover:shadow-lg hover:shadow-[#fe8002]/60 transition-all duration-300 hover:scale-110 border border-white/30 flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                        
                        {/* Total Price */}
                        <div className="text-right">
                          <p className={`text-xs font-semibold mb-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Total:</p>
                          <p className="text-lg font-extrabold text-[#fe8002]">
                            {(item.price * item.quantity).toLocaleString('fr-DZ', { minimumFractionDigits: 0 })} DZD
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:flex gap-1.5 items-center">
                      {/* Product Image */}
                      <div className={`relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden border-2 border-[#fe8002]/40 shadow-lg group ${
                        theme === 'light' ? 'bg-gray-50' : 'bg-gradient-to-br from-[#0f0f0f] to-black'
                      }`}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-[10px] leading-tight hover:text-[#fe8002] transition-colors line-clamp-1 mb-0.5 ${
                          theme === 'light' ? 'text-gray-800' : 'text-white'
                        }`}>
                          {item.name}
                        </h3>
                        <div className="flex items-baseline gap-0.5 mb-0.5">
                          <p className="text-xs font-extrabold bg-gradient-to-r from-[#fe8002] to-[#ff4500] bg-clip-text text-transparent">
                            {item.price.toLocaleString('fr-DZ', { minimumFractionDigits: 0 })}
                          </p>
                          <span className={`text-[8px] font-bold ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>DZD</span>
                        </div>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className={`flex items-center gap-0.5 rounded-lg border border-[#fe8002]/40 p-0.5 shadow-lg flex-shrink-0 ${
                        theme === 'light' ? 'bg-gray-50' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a]'
                      }`}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-4 h-4 bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-white font-extrabold text-[8px] rounded-md hover:shadow-lg hover:shadow-[#fe8002]/60 transition-all duration-300 hover:scale-110 border border-white/30 flex items-center justify-center"
                        >
                          −
                        </button>
                        <span className={`font-extrabold text-[10px] w-5 text-center ${
                          theme === 'light' ? 'text-gray-800' : 'text-white'
                        }`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-4 h-4 bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-white font-extrabold text-[8px] rounded-md hover:shadow-lg hover:shadow-[#fe8002]/60 transition-all duration-300 hover:scale-110 border border-white/30 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                      
                      {/* Total Price */}
                      <div className="text-right flex-shrink-0 min-w-[60px]">
                        <p className={`text-[8px] font-semibold mb-0.5 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Total:</p>
                        <p className="text-[10px] font-extrabold text-[#fe8002]">
                          {(item.price * item.quantity).toLocaleString('fr-DZ', { minimumFractionDigits: 0 })} DZD
                        </p>
                      </div>
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-5 h-5 flex-shrink-0 bg-gradient-to-r from-red-600 via-red-700 to-red-600 text-white rounded-lg hover:from-red-500 hover:to-red-600 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-red-500/60 flex items-center justify-center border border-white/20"
                        title="Supprimer"
                      >
                        <FaTrash className="text-[8px]" />
                      </button>
                    </div>
                  </div>
                ))}
                </div>

                {/* Upsell Widget */}
                {cartItems.length > 0 && recommendations.length > 0 && (
                  <div className="mt-6 px-4 md:px-6">
                    <UpsellWidget
                      products={recommendations}
                      title="Complétez votre configuration"
                      subtitle="Ces produits s'adaptent parfaitement à votre sélection"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer/Checkout Section */}
          {cartItems.length > 0 && (
            <div className={`flex-shrink-0 border-t-4 border-[#fe8002] p-2 md:p-3 shadow-2xl backdrop-blur-xl ${
              theme === 'light'
                ? 'bg-gradient-to-br from-white via-gray-50 to-gray-100'
                : 'bg-gradient-to-br from-[#1a1a1a] via-[#181818] to-[#0f0f0f]'
            }`}>
              <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-center">
                <div className={`rounded-2xl p-2.5 md:p-3 border-2 border-[#fe8002]/40 shadow-2xl ${
                  theme === 'light'
                    ? 'bg-gradient-to-r from-gray-50 to-white'
                    : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a]'
                }`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`font-bold text-xs md:text-sm ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                    }`}>Sous-total:</span>
                    <span className={`font-bold text-sm md:text-base ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                      {getCartTotal().toLocaleString('fr-DZ', { minimumFractionDigits: 2 })} DZD
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`font-bold text-xs md:text-sm ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                    }`}>Livraison:</span>
                    <span className="text-green-400 font-extrabold text-xs md:text-sm flex items-center gap-1">
                      <span className="text-lg">✓</span> Gratuite
                    </span>
                  </div>
                  <div className="h-0.5 bg-gradient-to-r from-transparent via-[#fe8002] to-transparent my-2 rounded-full" />
                  <div className="flex justify-between items-center">
                    <span className={`font-extrabold text-sm md:text-base ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>Total:</span>
                    <span className="text-lg md:text-xl lg:text-2xl font-extrabold bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] bg-clip-text text-transparent">
                      {getCartTotal().toLocaleString('fr-DZ', { minimumFractionDigits: 2 })} DZD
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <button 
                    onClick={handleCheckoutClick}
                    className={`w-full bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] font-extrabold py-2 md:py-3 rounded-2xl transition-all duration-300 shadow-2xl shadow-[#fe8002]/60 hover:shadow-[#fe8002]/80 hover:scale-105 uppercase tracking-wider border-2 border-white/30 text-xs md:text-sm relative overflow-hidden group ${
                      theme === 'light' ? 'text-white hover:from-[#ff6002] hover:to-[#ff3500]' : 'text-white hover:from-white hover:to-gray-200 hover:text-black'
                    }`}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <span className="relative flex items-center justify-center gap-2">
                      <FaShoppingCart className="text-lg md:text-xl animate-pulse" />
                      Commander Maintenant
                    </span>
                  </button>
                  <button 
                    onClick={onClose}
                    className={`w-full text-[#fe8002] font-bold py-2 md:py-2.5 rounded-2xl hover:border-[#fe8002] transition-all duration-300 shadow-lg border-2 border-[#fe8002]/40 hover:shadow-[#fe8002]/40 hover:scale-105 uppercase tracking-wider text-xs md:text-sm ${
                      theme === 'light' ? 'bg-white' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a]'
                    }`}
                  >
                    ← Continuer mes achats
                  </button>
                </div>
              </div>
            </div>
            </div>
          )}
        </div>
      </div>

    </>
  );
};

export default Cart;
