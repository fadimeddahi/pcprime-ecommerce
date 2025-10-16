"use client";

import Image from "next/image";
import { useState } from "react";
import { FaShoppingCart, FaHeart, FaRegHeart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useTheme } from "../context/ThemeContext";

interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
  price: number;
  originalPrice?: number;
  condition?: "Neuf" | "Excellent" | "Très bon" | "Bon" | "Acceptable";
  discount?: number;
  isPromo?: boolean;
  isTopSeller?: boolean;
  warrantyMonths?: number;
}

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { theme } = useTheme();
  const [addedToCart, setAddedToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      },
      1
    );
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      setIsWishlisted(false);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      });
      setIsWishlisted(true);
      setTimeout(() => setIsWishlisted(false), 2000);
    }
  };

  return (
    <div className={`group rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border hover:-translate-y-2 backdrop-blur-sm ${
      theme === 'light'
        ? 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-[#fe8002] hover:shadow-[#fe8002]/30'
        : 'bg-gradient-to-br from-[#1f1f1f] to-[#0f0f0f] border-[#2a2a2a] hover:border-[#fe8002] hover:shadow-[#fe8002]/50'
    }`}>
      <div className={`relative h-72 w-full overflow-hidden ${
        theme === 'light' 
          ? 'bg-gradient-to-br from-gray-100 to-gray-50'
          : 'bg-gradient-to-br from-[#181818] to-[#000000]'
      }`}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300 ${
          theme === 'light'
            ? 'from-white/80'
            : 'from-black/80'
        }`} />
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-2xl z-10 ${
            isInWishlist(product.id)
              ? "bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-white border-2 border-white/30"
              : theme === 'light'
                ? "bg-white/90 text-[#fe8002] hover:bg-[#fe8002] hover:text-white border-2 border-gray-200"
                : "bg-black/60 text-[#fe8002] hover:bg-[#fe8002] hover:text-white border-2 border-white/30"
          }`}
          title={isInWishlist(product.id) ? "Retirer de la liste" : "Ajouter à la liste"}
        >
          <FaHeart className="text-sm" />
        </button>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.condition && product.condition !== "Neuf" && (
            <span className={`text-white text-xs font-extrabold px-4 py-1.5 rounded-full shadow-2xl backdrop-blur-md border border-white/20 bg-gradient-to-r ${
              product.condition === "Excellent" ? "from-green-600 to-green-700" :
              product.condition === "Très bon" ? "from-blue-600 to-blue-700" :
              product.condition === "Bon" ? "from-yellow-600 to-yellow-700" :
              "from-orange-600 to-orange-700"
            }`}>
              {product.condition.toUpperCase()}
            </span>
          )}
          {product.discount && (
            <span className="bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-white text-xs font-extrabold px-4 py-1.5 rounded-full shadow-2xl shadow-[#fe8002]/60 backdrop-blur-md border border-white/20 animate-pulse">
              -{product.discount}%
            </span>
          )}
          {product.isPromo && (
            <span className="bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-white text-xs font-extrabold px-4 py-1.5 rounded-full shadow-2xl shadow-[#fe8002]/60 backdrop-blur-md border border-white/20 animate-pulse">
              PROMO
            </span>
          )}
          {product.isTopSeller && (
            <span className="bg-gradient-to-r from-[#ff4500] via-[#fe8002] to-[#ff6b35] text-white text-xs font-extrabold px-4 py-1.5 rounded-full shadow-2xl shadow-[#ff4500]/60 backdrop-blur-md border border-white/20">
              TOP VENTE
            </span>
          )}
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold px-4 py-1.5 rounded-full border shadow-md uppercase tracking-wider ${
            theme === 'light'
              ? 'text-[#fe8002] bg-white border-[#fe8002]/40 shadow-[#fe8002]/20'
              : 'text-[#fe8002] bg-gradient-to-r from-[#1a1a1a] to-[#0f0f0f] border-[#fe8002]/40 shadow-[#fe8002]/20'
          }`}>
            {product.category}
          </span>
        </div>
        
        <h3 className={`font-bold text-xl leading-tight group-hover:text-[#fe8002] transition-colors duration-300 line-clamp-2 ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          {product.name}
        </h3>
        
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <p className="text-[#fe8002] font-extrabold text-2xl bg-gradient-to-r from-[#fe8002] to-[#ff4500] bg-clip-text text-transparent">
              {product.price.toLocaleString('fr-DZ', { minimumFractionDigits: 2 })}
            </p>
            <span className={`text-sm font-semibold ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>DZD</span>
          </div>
          {product.originalPrice && (
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm line-through">
                {product.originalPrice.toLocaleString('fr-DZ', { minimumFractionDigits: 2 })} DZD
              </span>
              {product.discount && (
                <span className="bg-gradient-to-r from-green-600 to-green-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  -{product.discount}%
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 transform flex items-center justify-center gap-2 text-sm uppercase tracking-wide ${
              addedToCart
                ? "bg-gradient-to-r from-green-600 to-green-700 text-white border border-white/20 shadow-lg shadow-green-500/50"
                : "bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-white hover:from-[#ff4500] hover:to-[#fe8002] hover:scale-105 shadow-lg shadow-[#fe8002]/50 border border-white/20"
            }`}
          >
            <FaShoppingCart className="text-base" />
            {addedToCart ? "✓" : "Panier"}
          </button>
          <a href="/product" className="flex-1">
            <button className={`w-full font-bold py-3 px-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 uppercase tracking-wide text-sm ${
              theme === 'light'
                ? 'bg-white text-[#fe8002] border-[#fe8002]/40 hover:border-[#fe8002] hover:shadow-lg hover:shadow-[#fe8002]/30'
                : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-[#fe8002] border-[#fe8002]/40 hover:border-[#fe8002] hover:shadow-lg hover:shadow-[#fe8002]/30'
            }`}>
              Détails
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCondition, setSelectedCondition] = useState<string>("all");
  const [showPromoOnly, setShowPromoOnly] = useState(false);
  const [showTopSellersOnly, setShowTopSellersOnly] = useState(false);
  const { theme } = useTheme();

  const allProducts: Product[] = [
    // New Products
    {
      id: 1,
      name: "PC Gamer RTX 4090",
      category: "PC Bureau",
      image: "/pc gamer.jpeg",
      price: 8999.99,
      condition: "Neuf",
      isTopSeller: true,
    },
    {
      id: 2,
      name: "Laptop Dell XPS",
      category: "PC Portable",
      image: "/laptob.jpeg",
      price: 4599.99,
      condition: "Neuf",
      isPromo: true,
    },
    {
      id: 3,
      name: "Carte Graphique RTX 4070",
      category: "Composants",
      image: "/rtx.jpeg",
      price: 2499.99,
      condition: "Neuf",
      isTopSeller: true,
      isPromo: true,
    },
    {
      id: 4,
      name: "PC Gaming RGB",
      category: "PC Bureau",
      image: "/pc gamer.jpeg",
      price: 6999.99,
      condition: "Neuf",
    },
    {
      id: 5,
      name: "Laptop Gaming",
      category: "PC Portable",
      image: "/laptob.jpeg",
      price: 5299.99,
      condition: "Neuf",
      isTopSeller: true,
    },
    {
      id: 6,
      name: "RTX 3060 Ti",
      category: "Composants",
      image: "/rtx.jpeg",
      price: 1799.99,
      condition: "Neuf",
      isPromo: true,
    },
    // Used Products
    {
      id: 101,
      name: "PC Gamer RTX 3070 - Occasion",
      category: "PC Bureau",
      image: "/pc gamer.jpeg",
      price: 5999.99,
      originalPrice: 9999.99,
      condition: "Excellent",
      discount: 40,
      warrantyMonths: 6,
    },
    {
      id: 102,
      name: "Laptop Dell XPS 15 - Occasion",
      category: "PC Portable",
      image: "/laptob.jpeg",
      price: 3299.99,
      originalPrice: 5999.99,
      condition: "Très bon",
      discount: 45,
      warrantyMonths: 3,
    },
    {
      id: 103,
      name: "RTX 3060 Ti - Occasion",
      category: "Composants",
      image: "/rtx.jpeg",
      price: 1399.99,
      originalPrice: 2499.99,
      condition: "Excellent",
      discount: 44,
      warrantyMonths: 6,
    },
    {
      id: 104,
      name: "PC Gaming RGB - Occasion",
      category: "PC Bureau",
      image: "/pc gamer.jpeg",
      price: 4599.99,
      originalPrice: 7999.99,
      condition: "Bon",
      discount: 42,
      warrantyMonths: 3,
    },
    {
      id: 105,
      name: "MacBook Pro 2020 - Occasion",
      category: "PC Portable",
      image: "/laptob.jpeg",
      price: 4999.99,
      originalPrice: 8999.99,
      condition: "Très bon",
      discount: 44,
      warrantyMonths: 6,
    },
    {
      id: 106,
      name: "RTX 2080 Super - Occasion",
      category: "Composants",
      image: "/rtx.jpeg",
      price: 999.99,
      originalPrice: 2199.99,
      condition: "Bon",
      discount: 55,
      warrantyMonths: 3,
    },
  ];

  // Filter products
  const filteredProducts = allProducts.filter((product) => {
    if (selectedCategory !== "all" && product.category !== selectedCategory) {
      return false;
    }
    if (selectedCondition !== "all" && product.condition !== selectedCondition) {
      return false;
    }
    if (showPromoOnly && !product.isPromo) {
      return false;
    }
    if (showTopSellersOnly && !product.isTopSeller) {
      return false;
    }
    return true;
  });

  return (
    <section id="products" className={`py-20 px-4 relative overflow-hidden transition-all duration-300 ${
      theme === 'light'
        ? 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
        : 'bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a]'
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
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className={`text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] bg-clip-text text-transparent mb-4 tracking-tight ${
            theme === 'light' ? 'drop-shadow-sm' : 'drop-shadow-lg drop-shadow-[#fe8002]/50'
          }`}>
            Nos Produits
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#fe8002] to-transparent mx-auto mb-4 shadow-lg shadow-[#fe8002]/50" />
          <p className={`text-lg font-semibold ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>Découvrez notre sélection premium</p>
        </div>

        {/* Filters Section */}
        <div className={`rounded-2xl p-8 mb-12 border shadow-2xl backdrop-blur-xl transition-all duration-300 ${
          theme === 'light'
            ? 'bg-white border-gray-200 shadow-gray-200/50'
            : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-[#fe8002]/30 shadow-[#fe8002]/10'
        }`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-[#fe8002] to-[#ff4500] rounded-full" />
            <h3 className={`font-bold text-xl uppercase tracking-wide ${
              theme === 'light' ? 'text-[#fe8002]' : 'text-[#fe8002]'
            }`}>Filtres de Recherche</h3>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 flex-wrap items-end">
            {/* Category Filter */}
            <div className="flex-1 min-w-[240px]">
              <label className={`text-sm font-bold mb-3 block uppercase tracking-wide flex items-center gap-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-white'
              }`}>
                <span className="bg-gradient-to-r from-[#fe8002] to-[#ff4500] bg-clip-text text-transparent">Catégorie</span>
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full border-2 rounded-xl px-5 py-3.5 shadow-lg focus:outline-none focus:border-[#fe8002] focus:shadow-[#fe8002]/30 focus:ring-2 focus:ring-[#fe8002]/20 transition-all cursor-pointer font-bold hover:border-[#fe8002] hover:shadow-xl hover:shadow-[#fe8002]/20 backdrop-blur-sm appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNSA3LjVMMTAgMTIuNUwxNSA3LjUiIHN0cm9rZT0iI2ZlODAwMiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=')] bg-[length:20px] bg-[right_0.75rem_center] bg-no-repeat pr-12 ${
                  theme === 'light'
                    ? 'bg-white text-gray-800 border-[#fe8002]/40 shadow-[#fe8002]/20'
                    : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-[#fe8002] border-[#fe8002]/40 shadow-[#fe8002]/10'
                }`}
                style={{
                  colorScheme: theme === 'light' ? 'light' : 'dark'
                }}
              >
                <option value="all" className={theme === 'light' ? 'bg-white text-[#fe8002]' : 'bg-[#1a1a1a] text-[#fe8002]'} style={{ fontWeight: 'bold', padding: '12px' }}>TOUTES LES CATÉGORIES</option>
                <option value="PC Bureau" className={theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-[#0f0f0f] text-white'} style={{ fontWeight: '500', padding: '12px' }}>PC BUREAU</option>
                <option value="PC Portable" className={theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-[#0f0f0f] text-white'} style={{ fontWeight: '500', padding: '12px' }}>PC PORTABLE</option>
                <option value="Composants" className={theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-[#0f0f0f] text-white'} style={{ fontWeight: '500', padding: '12px' }}>COMPOSANTS</option>
              </select>
            </div>

            {/* Condition Filter */}
            <div className="flex-1 min-w-[240px]">
              <label className={`text-sm font-bold mb-3 block uppercase tracking-wide flex items-center gap-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-white'
              }`}>
                <span className="bg-gradient-to-r from-[#fe8002] to-[#ff4500] bg-clip-text text-transparent">État</span>
              </label>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className={`w-full border-2 rounded-xl px-5 py-3.5 shadow-lg focus:outline-none focus:border-[#fe8002] focus:shadow-[#fe8002]/30 focus:ring-2 focus:ring-[#fe8002]/20 transition-all cursor-pointer font-bold hover:border-[#fe8002] hover:shadow-xl hover:shadow-[#fe8002]/20 backdrop-blur-sm appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNSA3LjVMMTAgMTIuNUwxNSA3LjUiIHN0cm9rZT0iI2ZlODAwMiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=')] bg-[length:20px] bg-[right_0.75rem_center] bg-no-repeat pr-12 ${
                  theme === 'light'
                    ? 'bg-white text-gray-800 border-[#fe8002]/40 shadow-[#fe8002]/20'
                    : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-[#fe8002] border-[#fe8002]/40 shadow-[#fe8002]/10'
                }`}
                style={{
                  colorScheme: theme === 'light' ? 'light' : 'dark'
                }}
              >
                <option value="all" className={theme === 'light' ? 'bg-white text-[#fe8002]' : 'bg-[#1a1a1a] text-[#fe8002]'} style={{ fontWeight: 'bold', padding: '12px' }}>TOUS LES ÉTATS</option>
                <option value="Neuf" className={theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-[#0f0f0f] text-white'} style={{ fontWeight: '500', padding: '12px' }}>NEUF</option>
                <option value="Excellent" className={theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-[#0f0f0f] text-white'} style={{ fontWeight: '500', padding: '12px' }}>EXCELLENT</option>
                <option value="Très bon" className={theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-[#0f0f0f] text-white'} style={{ fontWeight: '500', padding: '12px' }}>TRÈS BON</option>
                <option value="Bon" className={theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-[#0f0f0f] text-white'} style={{ fontWeight: '500', padding: '12px' }}>BON</option>
                <option value="Acceptable" className={theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-[#0f0f0f] text-white'} style={{ fontWeight: '500', padding: '12px' }}>ACCEPTABLE</option>
              </select>
            </div>

            {/* Promo Filter */}
            <div className="flex items-end">
              <button
                onClick={() => setShowPromoOnly(!showPromoOnly)}
                className={`px-8 py-3.5 rounded-xl font-extrabold transition-all duration-300 transform hover:scale-105 shadow-lg uppercase tracking-wide text-sm ${
                  showPromoOnly
                    ? "bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-white border-2 border-white/20 shadow-[#fe8002]/50 animate-pulse"
                    : theme === 'light'
                      ? "bg-white text-[#fe8002] border-2 border-[#fe8002]/40 hover:border-[#fe8002] hover:shadow-[#fe8002]/30"
                      : "bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-[#fe8002] border-2 border-[#fe8002]/40 hover:border-[#fe8002] hover:shadow-[#fe8002]/30 backdrop-blur-sm"
                }`}
              >
                PROMOTIONS
              </button>
            </div>

            {/* Top Sellers Filter */}
            <div className="flex items-end">
              <button
                onClick={() => setShowTopSellersOnly(!showTopSellersOnly)}
                className={`px-8 py-3.5 rounded-xl font-extrabold transition-all duration-300 transform hover:scale-105 shadow-lg uppercase tracking-wide text-sm ${
                  showTopSellersOnly
                    ? "bg-gradient-to-r from-[#ff4500] via-[#fe8002] to-[#ff6b35] text-white border-2 border-white/20 shadow-[#ff4500]/50"
                    : theme === 'light'
                      ? "bg-white text-[#ff4500] border-2 border-[#ff4500]/40 hover:border-[#ff4500] hover:shadow-[#ff4500]/30"
                      : "bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-[#ff4500] border-2 border-[#ff4500]/40 hover:border-[#ff4500] hover:shadow-[#ff4500]/30 backdrop-blur-sm"
                }`}
              >
                TOP VENTES
              </button>
            </div>

            {/* Reset Filters */}
            {(selectedCategory !== "all" || showPromoOnly || showTopSellersOnly) && (
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setShowPromoOnly(false);
                    setShowTopSellersOnly(false);
                  }}
                  className={`px-8 py-3.5 rounded-xl font-extrabold hover:scale-105 transition-all duration-300 shadow-lg uppercase tracking-wide text-sm border-2 ${
                    theme === 'light'
                      ? 'bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-white border-white/20 shadow-[#fe8002]/40'
                      : 'bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-black border-white/20 shadow-[#fe8002]/40 backdrop-blur-sm'
                  }`}
                >
                  ↺ Réinitialiser
                </button>
              </div>
            )}
          </div>

          {/* Results count */}
          <div className={`mt-6 pt-6 border-t ${
            theme === 'light' ? 'border-gray-200' : 'border-[#fe8002]/20'
          }`}>
            <div className={`flex items-center gap-3 text-sm ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              <div className="w-2 h-2 bg-[#fe8002] rounded-full animate-pulse" />
              <span className="text-[#fe8002] font-extrabold text-xl">{filteredProducts.length}</span>
              <span className="font-semibold">produit(s) trouvé(s)</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <div className={`inline-block p-10 rounded-3xl border-2 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
                theme === 'light'
                  ? 'bg-white border-gray-200 shadow-gray-200/50'
                  : 'bg-gradient-to-br from-[#1a1a1a] via-[#181818] to-[#0f0f0f] border-[#fe8002]/40 shadow-[#fe8002]/20'
              }`}>
                <div className="text-7xl mb-6 animate-bounce">🔍</div>
                <p className={`text-3xl font-extrabold mb-3 bg-gradient-to-r from-[#fe8002] to-[#ff4500] bg-clip-text text-transparent`}>Aucun produit trouvé</p>
                <p className={`mb-8 text-lg ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>Essayez de modifier vos critères de recherche</p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setShowPromoOnly(false);
                    setShowTopSellersOnly(false);
                  }}
                  className={`px-10 py-4 rounded-xl font-extrabold hover:scale-105 transition-all duration-300 shadow-xl uppercase tracking-wide text-sm border-2 ${
                    theme === 'light'
                      ? 'bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-white border-white/20 shadow-[#fe8002]/40'
                      : 'bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-black border-white/20 shadow-[#fe8002]/40'
                  }`}
                >
                  ↺ Réinitialiser les filtres
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Products;
