"use client";

import Image from "next/image";
import { useState } from "react";
import { FaShoppingCart, FaHeart, FaRegHeart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useTheme } from "../context/ThemeContext";
import { useAllProducts, useAllCategories } from "../hooks/useProducts";
import type { Product } from "../types/product";

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { theme } = useTheme();
  const [addedToCart, setAddedToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    addToCart(
      {
        id: Number(product.id),
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
    const productId = Number(product.id);
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
      setIsWishlisted(false);
    } else {
      addToWishlist({
        id: productId,
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
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className={`text-6xl ${theme === 'light' ? 'text-gray-300' : 'text-gray-700'}`}>
              📦
            </div>
          </div>
        )}
        <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300 ${
          theme === 'light'
            ? 'from-white/80'
            : 'from-black/80'
        }`} />
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-2xl z-10 ${
            isInWishlist(Number(product.id))
              ? "bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-white border-2 border-white/30"
              : theme === 'light'
                ? "bg-white/90 text-[#fe8002] hover:bg-[#fe8002] hover:text-white border-2 border-gray-200"
                : "bg-black/60 text-[#fe8002] hover:bg-[#fe8002] hover:text-white border-2 border-white/30"
          }`}
          title={isInWishlist(Number(product.id)) ? "Retirer de la liste" : "Ajouter à la liste"}
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
          <a href={`/product?id=${product.id}`} className="flex-1">
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
  
  // Fetch all products and categories from API
  const { data: productsData, isLoading, isError, error } = useAllProducts();
  const { data: categoriesData = [] } = useAllCategories();
  
  const allProducts = productsData || [];
  const categories = categoriesData || [];

  // Filter products
  const filteredProducts = allProducts.filter((product: Product) => {
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
        {/* Filters Section */}
        <div className={`rounded-xl p-4 md:p-6 mb-6 md:mb-8 border shadow-lg backdrop-blur-xl transition-all duration-300 ${
          theme === 'light'
            ? 'bg-white border-gray-200 shadow-gray-200/50'
            : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-[#fe8002]/30 shadow-[#fe8002]/10'
        }`}>
          
          {/* Mobile Compact Layout */}
          <div className="md:hidden">
            <div className="grid grid-cols-2 gap-2 mb-3">
              {/* Category & Condition in compact selects */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`border rounded-lg px-2 py-1.5 text-xs font-bold focus:outline-none focus:border-[#fe8002] transition-all ${
                  theme === 'light'
                    ? 'bg-white text-gray-800 border-gray-300'
                    : 'bg-[#0f0f0f] text-[#fe8002] border-[#fe8002]/40'
                }`}
              >
                <option value="all">Toutes</option>
                {categoriesData.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className={`border rounded-lg px-2 py-1.5 text-xs font-bold focus:outline-none focus:border-[#fe8002] transition-all ${
                  theme === 'light'
                    ? 'bg-white text-gray-800 border-gray-300'
                    : 'bg-[#0f0f0f] text-[#fe8002] border-[#fe8002]/40'
                }`}
              >
                <option value="all">Tous états</option>
                <option value="Neuf">Neuf</option>
                <option value="Excellent">Excellent</option>
                <option value="Très bon">Très bon</option>
                <option value="Bon">Bon</option>
                <option value="Acceptable">Acceptable</option>
              </select>
            </div>

            {/* Toggle buttons in single row */}
            <div className="flex gap-1">
              <button
                onClick={() => setShowPromoOnly(!showPromoOnly)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                  showPromoOnly
                    ? "bg-[#fe8002] text-white"
                    : theme === 'light'
                      ? "bg-gray-100 text-[#fe8002] border border-gray-300"
                      : "bg-[#0f0f0f] text-[#fe8002] border border-[#fe8002]/40"
                }`}
              >
                Promo
              </button>
              <button
                onClick={() => setShowTopSellersOnly(!showTopSellersOnly)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                  showTopSellersOnly
                    ? "bg-[#ff4500] text-white"
                    : theme === 'light'
                      ? "bg-gray-100 text-[#ff4500] border border-gray-300"
                      : "bg-[#0f0f0f] text-[#ff4500] border border-[#fe8002]/40"
                }`}
              >
                Top
              </button>
              {(selectedCategory !== "all" || selectedCondition !== "all" || showPromoOnly || showTopSellersOnly) && (
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedCondition("all");
                    setShowPromoOnly(false);
                    setShowTopSellersOnly(false);
                  }}
                  className="px-2 py-1.5 rounded-lg text-xs font-bold bg-[#fe8002] text-white"
                >
                  ↺
                </button>
              )}
            </div>

            {/* Compact results */}
            <div className={`mt-2 pt-2 border-t text-center ${
              theme === 'light' ? 'border-gray-200' : 'border-[#fe8002]/20'
            }`}>
              <span className="text-[#fe8002] font-bold text-sm">{filteredProducts.length} produits</span>
            </div>
          </div>

          {/* Desktop Layout - Hidden on mobile */}
          <div className="hidden md:block">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-[#fe8002] to-[#ff4500] rounded-full" />
              <h3 className={`font-bold text-xl uppercase tracking-wide ${
                theme === 'light' ? 'text-[#fe8002]' : 'text-[#fe8002]'
              }`}>Filtres</h3>
            </div>
            
            <div className="flex flex-row gap-6 flex-wrap items-end">
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
                  {categories.map((category) => (
                    <option 
                      key={category.id} 
                      value={category.name} 
                      className={theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-[#0f0f0f] text-white'} 
                      style={{ fontWeight: '500', padding: '12px' }}
                    >
                      {category.name.toUpperCase()}
                    </option>
                  ))}
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
              {(selectedCategory !== "all" || selectedCondition !== "all" || showPromoOnly || showTopSellersOnly) && (
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSelectedCondition("all");
                      setShowPromoOnly(false);
                      setShowTopSellersOnly(false);
                    }}
                    className={`px-8 py-3.5 rounded-xl font-extrabold hover:scale-105 transition-all duration-300 shadow-lg uppercase tracking-wide text-sm border-2 ${
                      theme === 'light'
                        ? 'bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-white border-white/20 shadow-[#fe8002]/40'
                        : 'bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-black border-white/20 shadow-[#fe8002]/40 backdrop-blur-sm'
                    }`}
                  >
                    ↺ Reset
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
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className={`rounded-2xl overflow-hidden shadow-xl border backdrop-blur-sm animate-pulse ${
                  theme === 'light'
                    ? 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
                    : 'bg-gradient-to-br from-[#1f1f1f] to-[#0f0f0f] border-[#2a2a2a]'
                }`}
              >
                <div className={`h-72 w-full ${
                  theme === 'light' ? 'bg-gray-200' : 'bg-[#181818]'
                }`} />
                <div className="p-6 space-y-4">
                  <div className={`h-6 rounded ${
                    theme === 'light' ? 'bg-gray-200' : 'bg-[#181818]'
                  }`} />
                  <div className={`h-4 rounded w-3/4 ${
                    theme === 'light' ? 'bg-gray-200' : 'bg-[#181818]'
                  }`} />
                  <div className={`h-8 rounded w-1/2 ${
                    theme === 'light' ? 'bg-gray-200' : 'bg-[#181818]'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="col-span-full text-center py-20">
            <div className={`inline-block p-10 rounded-3xl border-2 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
              theme === 'light'
                ? 'bg-white border-red-200 shadow-red-200/50'
                : 'bg-gradient-to-br from-[#1a1a1a] via-[#181818] to-[#0f0f0f] border-red-500/40 shadow-red-500/20'
            }`}>
              <div className="text-7xl mb-6">⚠️</div>
              <p className={`text-3xl font-extrabold mb-3 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent`}>
                Erreur de chargement
              </p>
              <p className={`mb-8 text-lg ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {error instanceof Error ? error.message : 'Impossible de charger les produits'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className={`px-10 py-4 rounded-xl font-extrabold hover:scale-105 transition-all duration-300 shadow-xl uppercase tracking-wide text-sm border-2 ${
                  theme === 'light'
                    ? 'bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-white border-white/20 shadow-[#fe8002]/40'
                    : 'bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-black border-white/20 shadow-[#fe8002]/40'
                }`}
              >
                ↻ Réessayer
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product: Product) => (
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
                      setSelectedCondition("all");
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
        )}
      </div>
    </section>
  );
};

export default Products;
