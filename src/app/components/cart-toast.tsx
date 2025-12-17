"use client";

import Image from "next/image";
import { FaCheck, FaTimes, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";

interface CartToastProps {
  onViewCart: () => void;
}

const CartToast = ({ onViewCart }: CartToastProps) => {
  const { toast, hideToast, getCartItemsCount } = useCart();
  const { theme } = useTheme();

  if (!toast.show || !toast.item) return null;

  const handleViewCart = () => {
    hideToast();
    onViewCart();
  };

  return (
    <div
      className={`fixed top-20 right-4 z-[9999] w-80 max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl border-2 transform transition-all duration-300 animate-slide-in ${
        theme === 'light'
          ? 'bg-white border-[#fe8002]/30 shadow-[#fe8002]/20'
          : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-[#fe8002]/50 shadow-[#fe8002]/30'
      }`}
    >
      {/* Success Header */}
      <div className={`flex items-center gap-2 px-4 py-2.5 border-b ${
        theme === 'light' ? 'border-gray-200 bg-green-50' : 'border-white/10 bg-green-900/20'
      }`}>
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
          <FaCheck className="text-white text-xs" />
        </div>
        <span className={`font-semibold text-sm ${
          theme === 'light' ? 'text-green-700' : 'text-green-400'
        }`}>
          Ajouté au panier !
        </span>
        <button
          onClick={hideToast}
          className={`ml-auto p-1 rounded-full hover:bg-gray-200/50 transition-colors ${
            theme === 'light' ? 'text-gray-500 hover:text-gray-700' : 'text-gray-400 hover:text-white'
          }`}
        >
          <FaTimes className="text-sm" />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4 flex gap-3">
        <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
          <Image
            src={toast.item.image || "/placeholder.png"}
            alt={toast.item.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold text-sm line-clamp-2 ${
            theme === 'light' ? 'text-gray-800' : 'text-white'
          }`}>
            {toast.item.name}
          </h4>
          <p className="text-[#fe8002] font-bold text-sm mt-1">
            {toast.item.price.toLocaleString()} DA
          </p>
          <p className={`text-xs mt-0.5 ${
            theme === 'light' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            Qté: {toast.item.quantity}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className={`px-4 pb-4 flex gap-2`}>
        <button
          onClick={hideToast}
          className={`flex-1 py-2 px-3 rounded-xl font-semibold text-sm transition-all ${
            theme === 'light'
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          Continuer
        </button>
        <button
          onClick={handleViewCart}
          className="flex-1 py-2 px-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-white hover:shadow-lg hover:shadow-[#fe8002]/40 transition-all flex items-center justify-center gap-2"
        >
          <FaShoppingCart className="text-xs" />
          Voir ({getCartItemsCount()})
        </button>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CartToast;
