"use client";

import { useState } from "react";
import Image from "next/image";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { UpsellOffer } from "../types/upsell";
import { FaPlus, FaCheck, FaTag, FaFire } from "react-icons/fa";

interface UpsellWidgetProps {
  products: UpsellOffer[];
  title?: string;
  subtitle?: string;
}

const UpsellWidget = ({ 
  products, 
  title = "Recommandé pour vous",
  subtitle = "Complétez votre configuration"
}: UpsellWidgetProps) => {
  const { theme } = useTheme();
  const { addToCart, isInCart, isEnterprise } = useCart();
  const [addedItems, setAddedItems] = useState<Set<number | string>>(new Set());

  const handleAddToCart = (product: UpsellOffer) => {
    addToCart({
      id: product.id,
      uuid: product.uuid,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    }, 1, isEnterprise);

    setAddedItems(prev => new Set(prev).add(product.id));
    
    // Remove from added items after 3 seconds
    setTimeout(() => {
      setAddedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }, 3000);
  };

  if (products.length === 0) return null;

  return (
    <div className={`rounded-2xl border-2 p-3 transition-all ${
      theme === 'light'
        ? 'bg-gradient-to-br from-orange-50 to-white border-[#fe8002]/30'
        : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-[#fe8002]/30'
    }`}>
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <FaFire className="text-[#fe8002] text-lg" />
          <h3 className={`text-lg font-extrabold ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            {title}
          </h3>
        </div>
        <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
          {subtitle}
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        {products.map((product) => {
          const isAdded = addedItems.has(product.id);
          const alreadyInCart = isInCart(product.id);

          return (
            <a
              key={product.id}
              href={`/product/${product.id}`}
              className={`rounded-xl border-2 overflow-hidden transition-all hover:scale-105 cursor-pointer ${
                theme === 'light'
                  ? 'bg-white border-gray-200 hover:border-[#fe8002]/50 shadow-lg'
                  : 'bg-[#1a1a1a] border-gray-800 hover:border-[#fe8002]/50'
              }`}
            >
              {/* Promo Badge */}
              {product.is_promo && product.discount && (
                <div className="bg-gradient-to-r from-red-600 to-red-500 text-white px-2 py-0.5 text-[10px] font-bold flex items-center gap-0.5">
                  <FaTag size={8} />
                  -{product.discount}% PROMO
                </div>
              )}

              {/* Product Image */}
              <div className="relative h-20 bg-gray-100">
                <Image
                  src={product.image || '/placeholder.png'}
                  alt={product.name}
                  fill
                  className="object-contain p-2"
                />
              </div>

              {/* Product Info */}
              <div className="p-2">
                <h4 className={`text-xs font-bold mb-1 line-clamp-2 h-6 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {product.name}
                </h4>

                {/* Price */}
                <div className="mb-2">
                  {product.old_price ? (
                    <div>
                      <div className="flex items-center gap-1">
                        <span className={`text-[10px] line-through ${
                          theme === 'light' ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          {product.old_price.toLocaleString('fr-DZ')} DZD
                        </span>
                      </div>
                      <div className="text-[#fe8002] font-extrabold text-xs">
                        {product.price.toLocaleString('fr-DZ')} DZD
                      </div>
                    </div>
                  ) : (
                    <div className={`font-bold text-xs ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      {product.price.toLocaleString('fr-DZ')} DZD
                    </div>
                  )}
                </div>

                {/* Add Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  disabled={alreadyInCart || isAdded}
                  className={`w-full py-1 px-2 rounded-lg font-bold text-[10px] transition-all flex items-center justify-center gap-1 ${
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
                      <FaCheck /> Déjà ajouté
                    </>
                  ) : isAdded ? (
                    <>
                      <FaCheck /> Ajouté!
                    </>
                  ) : (
                    <>
                      <FaPlus /> Ajouter
                    </>
                  )}
                </button>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default UpsellWidget;
