"use client";

import { useState } from "react";
import Image from "next/image";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { UpsellOffer } from "../types/upsell";
import { FaXmark, FaPlus, FaCheck, FaTag } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";

interface PostOrderUpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueShopping: () => void;
  products: UpsellOffer[];
}

const PostOrderUpsellModal = ({ 
  isOpen, 
  onClose, 
  onContinueShopping,
  products 
}: PostOrderUpsellModalProps) => {
  const { theme } = useTheme();
  const { addToCart, isInCart } = useCart();
  const [addedItems, setAddedItems] = useState<Set<number | string>>(new Set());

  const handleAddToCart = (product: UpsellOffer) => {
    addToCart({
      id: product.id,
      uuid: product.uuid,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    }, 1);

    setAddedItems(prev => new Set(prev).add(product.id));
    
    setTimeout(() => {
      setAddedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }, 2000);
  };

  const handleContinue = () => {
    if (addedItems.size > 0) {
      onContinueShopping();
    } else {
      onClose();
    }
  };

  if (!isOpen || products.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10001] p-4">
      <div
        className={`rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto ${
          theme === 'light'
            ? 'bg-white'
            : 'bg-[#1a1a1a] border-2 border-gray-700'
        }`}
      >
        {/* Header */}
        <div className={`sticky top-0 z-10 p-6 border-b-2 ${
          theme === 'light'
            ? 'bg-gradient-to-r from-orange-50 to-white border-[#fe8002]/30'
            : 'bg-gradient-to-r from-[#1a1a1a] to-[#0f0f0f] border-[#fe8002]/30'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaShoppingCart className="text-[#fe8002] text-3xl" />
              <div>
                <h2 className={`text-2xl font-extrabold ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  N'oubliez pas ces essentiels!
                </h2>
                <p className={`text-sm ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  Profitez de ces offres avant de finaliser
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-all ${
                theme === 'light'
                  ? 'hover:bg-gray-200 text-gray-600'
                  : 'hover:bg-gray-800 text-gray-400'
              }`}
            >
              <FaXmark size={24} />
            </button>
          </div>
        </div>

        {/* Products */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => {
            const isAdded = addedItems.has(product.id);
            const alreadyInCart = isInCart(product.id);

            return (
              <div
                key={product.id}
                className={`rounded-xl border-2 p-4 transition-all ${
                  theme === 'light'
                    ? 'bg-white border-gray-200 hover:border-[#fe8002]/50 shadow-md'
                    : 'bg-[#2a2a2a] border-gray-700 hover:border-[#fe8002]/50'
                }`}
              >
                {/* Promo Badge */}
                {product.is_promo && product.discount && (
                  <div className="bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-1 text-xs font-bold rounded-lg mb-2 inline-flex items-center gap-1">
                    <FaTag size={10} />
                    PROMO -{product.discount}%
                  </div>
                )}

                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg">
                    <Image
                      src={product.image || '/placeholder.png'}
                      alt={product.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className={`text-sm font-bold mb-2 line-clamp-2 ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      {product.name}
                    </h3>

                    {/* Price */}
                    <div className="mb-3">
                      {product.old_price ? (
                        <div>
                          <div className={`text-xs line-through ${
                            theme === 'light' ? 'text-gray-500' : 'text-gray-600'
                          }`}>
                            {product.old_price.toLocaleString('fr-DZ')} DZD
                          </div>
                          <div className="text-[#fe8002] font-extrabold text-lg">
                            {product.price.toLocaleString('fr-DZ')} DZD
                          </div>
                        </div>
                      ) : (
                        <div className={`font-bold text-lg ${
                          theme === 'light' ? 'text-gray-900' : 'text-white'
                        }`}>
                          {product.price.toLocaleString('fr-DZ')} DZD
                        </div>
                      )}
                    </div>

                    {/* Add Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={alreadyInCart || isAdded}
                      className={`w-full py-2 px-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                        alreadyInCart
                          ? theme === 'light'
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : isAdded
                          ? 'bg-green-500 text-white'
                          : 'bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-white hover:scale-105'
                      }`}
                    >
                      {alreadyInCart ? (
                        <>
                          <FaCheck /> Déjà dans le panier
                        </>
                      ) : isAdded ? (
                        <>
                          <FaCheck /> Ajouté!
                        </>
                      ) : (
                        <>
                          <FaPlus /> Ajouter au panier
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className={`sticky bottom-0 p-6 border-t-2 ${
          theme === 'light'
            ? 'bg-gradient-to-r from-white to-orange-50 border-[#fe8002]/30'
            : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] border-[#fe8002]/30'
        }`}>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all border-2 ${
                theme === 'light'
                  ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  : 'bg-[#2a2a2a] border-gray-600 text-white hover:bg-[#333]'
              }`}
            >
              Non merci
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 py-3 px-6 rounded-xl font-bold bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-white hover:scale-105 transition-all shadow-lg"
            >
              {addedItems.size > 0 ? 'Continuer les achats' : 'Terminer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostOrderUpsellModal;
