"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { Product } from "../types/product";
import { FaTag, FaCheck, FaPlus, FaTimes } from "react-icons/fa";

interface CheckoutUpsellWidgetProps {
  cartItems: any[];
  onAddItem?: (product: Product) => void;
}

const CheckoutUpsellWidget = ({ cartItems, onAddItem }: CheckoutUpsellWidgetProps) => {
  const { theme } = useTheme();
  const { addToCart } = useCart();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [presentCategories, setPresentCategories] = useState<Set<string>>(new Set());
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
  const [showWidget, setShowWidget] = useState(false);
  const [addedItems, setAddedItems] = useState<Set<number | string>>(new Set());

  // Required categories for complete build
  const REQUIRED_CATEGORIES = [
    "Processeurs",
    "Cartes Mères",
    "RAM",
    "Stockage",
    "Alimentations",
    "Boîtiers",
    "Refroidissement",
  ];

  // Category mapping for smart recommendations
  const CATEGORY_RECOMMENDATIONS: Record<string, string[]> = {
    "Processeurs": ["Cartes Mères", "RAM", "Refroidissement"],
    "Cartes Mères": ["Processeurs", "RAM"],
    "RAM": ["Processeurs", "Stockage"],
    "Stockage": ["Alimentations", "Boîtiers"],
    "Alimentations": ["Boîtiers"],
    "Boîtiers": ["Refroidissement"],
    "Refroidissement": ["Processeurs"],
  };

  useEffect(() => {
    if (cartItems.length === 0) {
      setShowWidget(false);
      return;
    }

    // Get unique categories in cart
    const categories = new Set<string>();
    cartItems.forEach((item: any) => {
      if (item.category) {
        categories.add(item.category);
      }
    });

    setPresentCategories(categories);

    // Find missing categories
    const missingCategories = REQUIRED_CATEGORIES.filter(
      (cat) => !categories.has(cat)
    );

    // Get smart recommendations based on present categories
    const smartSuggested = new Set<string>();
    categories.forEach((cat: string) => {
      const suggestions = CATEGORY_RECOMMENDATIONS[cat] || [];
      suggestions.forEach((s) => {
        if (missingCategories.includes(s)) {
          smartSuggested.add(s);
        }
      });
    });

    setSuggestedCategories(Array.from(smartSuggested));
    setShowWidget(smartSuggested.size > 0);
  }, [cartItems]);

  const handleAddToCart = (product: Product) => {
    addToCart(
      {
        id: product.id,
        uuid: product.uuid,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      },
      1
    );

    setAddedItems((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }, 2000);

    if (onAddItem) {
      onAddItem(product);
    }
  };

  if (!showWidget || suggestedCategories.length === 0) {
    return null;
  }

  return (
    <div
      className={`rounded-2xl p-6 mb-6 border-2 backdrop-blur-md transition-all duration-300 ${
        theme === "light"
          ? "bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-300/50 shadow-lg shadow-orange-200/30"
          : "bg-gradient-to-br from-orange-950/20 to-orange-900/10 border-orange-700/30 shadow-lg shadow-orange-900/20"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-br from-[#fe8002] to-[#ff4500]">
            <FaTag className="text-white text-xl" />
          </div>
          <div>
            <h3
              className={`text-lg font-bold ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}
            >
              Complétez votre build !
            </h3>
            <p
              className={`text-sm ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Ajoutez les catégories manquantes pour obtenir une réduction de 10%
            </p>
          </div>
        </div>
      </div>

      {/* Missing Categories Display */}
      <div className="mb-4 p-4 rounded-lg bg-white/50 dark:bg-black/20">
        <p
          className={`text-sm font-semibold mb-2 ${
            theme === "light" ? "text-gray-800" : "text-gray-200"
          }`}
        >
          Catégories manquantes :
        </p>
        <div className="flex flex-wrap gap-2">
          {suggestedCategories.map((category) => (
            <span
              key={category}
              className={`px-3 py-1 rounded-full text-sm font-medium border-2 ${
                theme === "light"
                  ? "bg-red-100 border-red-300 text-red-700"
                  : "bg-red-900/30 border-red-700 text-red-300"
              }`}
            >
              {category}
            </span>
          ))}
        </div>
      </div>

      {/* Present Categories */}
      <div className="mb-6 p-4 rounded-lg bg-green-100/50 dark:bg-green-900/20">
        <p
          className={`text-sm font-semibold mb-2 ${
            theme === "light" ? "text-green-800" : "text-green-200"
          }`}
        >
          Catégories ajoutées :
        </p>
        <div className="flex flex-wrap gap-2">
          {Array.from(presentCategories).map((category) => (
            <span
              key={category}
              className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 border-2 ${
                theme === "light"
                  ? "bg-green-100 border-green-300 text-green-700"
                  : "bg-green-900/30 border-green-700 text-green-300"
              }`}
            >
              <FaCheck size={12} />
              {category}
            </span>
          ))}
        </div>
      </div>

      <p
        className={`text-xs ${
          theme === "light" ? "text-gray-600" : "text-gray-400"
        }`}
      >
        💡 Astuce : Ajouter des produits des catégories manquantes pour débloquer
        votre réduction !
      </p>
    </div>
  );
};

export default CheckoutUpsellWidget;
