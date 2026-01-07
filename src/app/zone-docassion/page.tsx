"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { useAllProducts, useAllCategories } from "../hooks/useProducts";
import { Product } from "../types/product";
import { FaShoppingCart, FaHeart, FaStar, FaCheckCircle, FaCertificate, FaClock } from "react-icons/fa";

const ZoneDocassion = () => {
  const { addToCart } = useCart();
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCondition, setSelectedCondition] = useState<string>("all");
  const [addedToCart, setAddedToCart] = useState<number | string | null>(null);

  // Fetch all products and categories from API
  const { data: allProducts = [], isLoading, isError } = useAllProducts();
  const { data: categoriesData = [] } = useAllCategories();

  // Filter only used products (products with condition field)
  const usedProducts = useMemo(() => {
    return allProducts.filter((product: Product) => 
      product.condition || product.etat
    );
  }, [allProducts]);

  // Get unique categories from used products
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    usedProducts.forEach((product: Product) => {
      if (product.category) {
        categorySet.add(product.category);
      }
    });
    return Array.from(categorySet).sort();
  }, [usedProducts]);

  const handleAddToCart = (product: Product) => {
    const productId = typeof product.id === 'number' ? product.id : parseInt(product.id as string, 10);
    addToCart(
      {
        id: productId,
        uuid: product.uuid,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      },
      1
    );
    setAddedToCart(product.id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  const filteredProducts = usedProducts.filter((product: Product) => {
    if (selectedCategory !== "all" && product.category !== selectedCategory) {
      return false;
    }
    const productCondition = product.condition || product.etat;
    if (selectedCondition !== "all" && productCondition !== selectedCondition) {
      return false;
    }
    return true;
  });

  // Calculate statistics from used products
  const stats = useMemo(() => {
    if (usedProducts.length === 0) {
      return { maxWarranty: 6, maxDiscount: 60, productsCount: 0 };
    }

    // Find max warranty months
    const warranties = usedProducts
      .map((p: Product) => p.warrantyMonths || p.warranty_months || 0)
      .filter((w) => w > 0);
    const maxWarranty = warranties.length > 0 ? Math.max(...warranties) : 6;

    // Find max discount percentage
    const discounts = usedProducts
      .map((p: Product) => p.discount || 0)
      .filter((d) => d > 0);
    const maxDiscount = discounts.length > 0 ? Math.max(...discounts) : 60;

    return {
      maxWarranty,
      maxDiscount,
      productsCount: usedProducts.length,
    };
  }, [usedProducts]);

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "Excellent":
        return "from-green-600 to-green-700";
      case "Très bon":
        return "from-blue-600 to-blue-700";
      case "Bon":
        return "from-yellow-600 to-yellow-700";
      case "Acceptable":
        return "from-orange-600 to-orange-700";
      default:
        return "from-gray-600 to-gray-700";
    }
  };

  return (
    <main className={`min-h-screen relative overflow-hidden transition-all duration-300 ${
      theme === 'light' ? 'bg-gradient-to-br from-gray-50 via-white to-gray-100' : 'bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a]'
    }`}>
      {/* Background Pattern */}
      <div className={`absolute inset-0 ${theme === 'light' ? 'opacity-[0.03]' : 'opacity-[0.02]'}`}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, #fe8002 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>
      
      {/* Subtle orange accent gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fe8002]/10 via-transparent to-[#ff4500]/10 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative z-10 py-8 md:py-10 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-white text-xs font-extrabold px-6 py-2 rounded-full shadow-2xl shadow-[#fe8002]/60 border-2 border-white/20 animate-pulse uppercase tracking-wider hover:scale-105 transition-all">
              BONNES AFFAIRES
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] bg-clip-text text-transparent mb-4 tracking-tight drop-shadow-sm">
            Zone d'Occasion
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#fe8002] to-transparent mx-auto mb-4 shadow-sm" />
          <p className={`text-base md:text-lg max-w-3xl mx-auto leading-relaxed font-semibold ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Découvrez nos produits d'occasion certifiés et testés.{" "}
            <span className="text-[#fe8002] font-extrabold">Économisez jusqu'à 60%</span> sur des
            équipements de qualité avec garantie.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 max-w-4xl mx-auto">
            <div className={`rounded-xl p-4 border-2 border-[#fe8002]/40 shadow-xl ${
              theme === 'light' ? 'bg-white' : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]'
            }`}>
              <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#fe8002] to-[#ff4500] bg-clip-text text-transparent mb-1">
                60%
              </div>
              <div className={`text-xs font-semibold ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Économie Max</div>
            </div>
            <div className={`rounded-xl p-4 border-2 border-[#fe8002]/40 shadow-xl ${
              theme === 'light' ? 'bg-white' : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]'
            }`}>
              <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#fe8002] to-[#ff4500] bg-clip-text text-transparent mb-1">
                3 mois
              </div>
              <div className="text-gray-400 text-xs font-semibold">Garantie</div>
            </div>
            <div className={`rounded-xl p-4 border-2 border-[#fe8002]/40 shadow-xl ${
              theme === 'light' ? 'bg-white' : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]'
            }`}>
              <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#fe8002] to-[#ff4500] bg-clip-text text-transparent mb-1">
                ✓
              </div>
              <div className="text-gray-400 text-xs font-semibold">Testé & Certifié</div>
            </div>
            <div className={`rounded-xl p-4 border-2 border-[#fe8002]/40 shadow-xl ${
              theme === 'light' ? 'bg-white' : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]'
            }`}>
              <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#fe8002] to-[#ff4500] bg-clip-text text-transparent mb-1">
                7/7
              </div>
              <div className="text-gray-400 text-xs font-semibold">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="relative z-10 py-8 px-4">
        <div className="container mx-auto">
          <div className={`rounded-2xl p-3 md:p-4 border border-[#fe8002]/30 shadow-2xl shadow-[#fe8002]/10 backdrop-blur-xl ${
            theme === 'light' ? 'bg-white' : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 bg-gradient-to-b from-[#fe8002] to-[#ff4500] rounded-full" />
              <h3 className="text-[#fe8002] font-bold text-lg">Filtrer les Produits</h3>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              {/* Category Filter */}
              <div className="flex-1">
                <label className={`text-sm font-bold mb-2 block uppercase tracking-wide flex items-center gap-2 ${
                  theme === 'light' ? 'text-gray-800' : 'text-white'
                }`}>
                  <span className="bg-gradient-to-r from-[#fe8002] to-[#ff4500] bg-clip-text text-transparent">
                    Catégorie
                  </span>
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-[#fe8002] border-2 border-[#fe8002]/40 rounded-xl px-5 py-3.5 shadow-lg shadow-[#fe8002]/10 focus:outline-none focus:border-[#fe8002] focus:shadow-[#fe8002]/30 focus:ring-2 focus:ring-[#fe8002]/20 transition-all cursor-pointer font-bold hover:border-[#fe8002] hover:shadow-xl hover:shadow-[#fe8002]/20 backdrop-blur-sm appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNSA3LjVMMTAgMTIuNUwxNSA3LjUiIHN0cm9rZT0iI2ZlODAwMiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=')] bg-[length:20px] bg-[right_0.75rem_center] bg-no-repeat pr-12"
                  style={{ colorScheme: "dark" }}
                >
                  <option value="all" className={theme === 'light' ? 'bg-white text-[#fe8002]' : 'bg-[#1a1a1a] text-[#fe8002]'} style={{ fontWeight: 'bold', padding: '12px' }}>
                    TOUTES LES CATÉGORIES
                  </option>
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                      className={theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-[#0f0f0f] text-white'}
                      style={{ fontWeight: '500', padding: '12px' }}
                    >
                      {category.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Condition Filter */}
              <div className="flex-1">
                <label className={`text-sm font-bold mb-2 block uppercase tracking-wide flex items-center gap-2 ${
                  theme === 'light' ? 'text-gray-800' : 'text-white'
                }`}>
                  <span className="bg-gradient-to-r from-[#fe8002] to-[#ff4500] bg-clip-text text-transparent">
                    État
                  </span>
                </label>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="w-full bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-[#fe8002] border-2 border-[#fe8002]/40 rounded-xl px-5 py-3.5 shadow-lg shadow-[#fe8002]/10 focus:outline-none focus:border-[#fe8002] focus:shadow-[#fe8002]/30 focus:ring-2 focus:ring-[#fe8002]/20 transition-all cursor-pointer font-bold hover:border-[#fe8002] hover:shadow-xl hover:shadow-[#fe8002]/20 backdrop-blur-sm appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNSA3LjVMMTAgMTIuNUwxNSA3LjUiIHN0cm9rZT0iI2ZlODAwMiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=')] bg-[length:20px] bg-[right_0.75rem_center] bg-no-repeat pr-12"
                  style={{ colorScheme: "dark" }}
                >
                  <option value="all" className={theme === 'light' ? 'bg-white text-[#fe8002]' : 'bg-[#1a1a1a] text-[#fe8002]'} style={{ fontWeight: 'bold', padding: '12px' }}>
                    TOUS LES ÉTATS
                  </option>
                  <option
                    value="Excellent"
                    className={theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-[#0f0f0f] text-white'}
                    style={{ fontWeight: '500', padding: '12px' }}
                  >
                    EXCELLENT
                  </option>
                  <option
                    value="Très bon"
                    className={theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-[#0f0f0f] text-white'}
                    style={{ fontWeight: '500', padding: '12px' }}
                  >
                    TRÈS BON
                  </option>
                  <option
                    value="Bon"
                    className={theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-[#0f0f0f] text-white'}
                    style={{ fontWeight: '500', padding: '12px' }}
                  >
                    BON
                  </option>
                  <option
                    value="Acceptable"
                    className={theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-[#0f0f0f] text-white'}
                    style={{ fontWeight: '500', padding: '12px' }}
                  >
                    ACCEPTABLE
                  </option>
                </select>
              </div>

              {/* Reset Button */}
              {(selectedCategory !== "all" || selectedCondition !== "all") && (
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSelectedCondition("all");
                    }}
                    className="px-8 py-3.5 rounded-xl font-extrabold bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-black hover:from-white hover:to-gray-200 transition-all duration-300 shadow-lg shadow-[#fe8002]/40 transform hover:scale-105 uppercase tracking-wide text-sm border-2 border-white/20 backdrop-blur-sm whitespace-nowrap"
                  >
                    ↺ Réinitialiser
                  </button>
                </div>
              )}
            </div>

            {/* Results Count */}
            <div className="mt-6 pt-6 border-t border-[#fe8002]/20">
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <div className="w-2 h-2 bg-[#fe8002] rounded-full animate-pulse" />
                <span className="text-[#fe8002] font-extrabold text-xl">
                  {filteredProducts.length}
                </span>
                <span className="font-semibold">produit(s) d'occasion disponible(s)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="relative z-10 py-12 px-4">
        <div className="container mx-auto">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block p-10 bg-gradient-to-br from-[#1a1a1a] via-[#181818] to-[#0f0f0f] rounded-3xl border-2 border-[#fe8002]/40 shadow-2xl shadow-[#fe8002]/20 backdrop-blur-xl">
                <div className="text-7xl mb-6 animate-spin">⌛</div>
                <p className="text-white text-3xl font-extrabold mb-3 bg-gradient-to-r from-[#fe8002] to-[#ff4500] bg-clip-text text-transparent">
                  Chargement...
                </p>
                <p className="text-gray-400 text-lg">
                  Chargement des produits d'occasion
                </p>
              </div>
            </div>
          ) : isError ? (
            <div className="text-center py-20">
              <div className="inline-block p-10 bg-gradient-to-br from-[#1a1a1a] via-[#181818] to-[#0f0f0f] rounded-3xl border-2 border-red-500/40 shadow-2xl shadow-red-500/20 backdrop-blur-xl">
                <div className="text-7xl mb-6">⚠️</div>
                <p className="text-white text-3xl font-extrabold mb-3 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                  Erreur de chargement
                </p>
                <p className="text-gray-400 text-lg">
                  Impossible de charger les produits
                </p>
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <a
                  key={product.id}
                  href={`/product/${product.id}`}
                  className={`group rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-[#fe8002]/50 transition-all duration-500 border hover:border-[#fe8002] hover:-translate-y-2 backdrop-blur-sm block cursor-pointer ${
                    theme === 'light'
                      ? 'bg-white border-gray-300'
                      : 'bg-gradient-to-br from-[#1f1f1f] to-[#0f0f0f] border-[#2a2a2a]'
                  }`}
                >
                  <div className={`relative h-72 w-full overflow-hidden ${
                    theme === 'light' ? 'bg-gray-100' : 'bg-gradient-to-br from-[#181818] to-[#000000]'
                  }`}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                      {(product.condition || product.etat) && (
                        <span
                          className={`bg-gradient-to-r ${getConditionColor(
                            product.condition || product.etat || ''
                          )} text-white text-xs font-extrabold px-4 py-1.5 rounded-full shadow-2xl backdrop-blur-md border border-white/20`}
                        >
                          {product.condition || product.etat}
                        </span>
                      )}
                      {product.discount && (
                        <span className="bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-white text-xs font-extrabold px-4 py-1.5 rounded-full shadow-2xl shadow-[#fe8002]/60 backdrop-blur-md border border-white/20 animate-pulse">
                          -{product.discount}% 🔥
                        </span>
                      )}
                    </div>

                    {/* Stock Status */}
                    <div className="absolute top-3 right-3">
                      {(product.quantity === undefined || product.quantity > 0) ? (
                        <span className="bg-green-600 text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-2xl backdrop-blur-md border border-white/20 flex items-center gap-1">
                          <FaCheckCircle className="text-xs" />
                          En stock
                        </span>
                      ) : (
                        <span className="bg-red-600 text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-2xl backdrop-blur-md border border-white/20">
                          Épuisé
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#fe8002] bg-gradient-to-r from-[#1a1a1a] to-[#0f0f0f] px-4 py-1.5 rounded-full border border-[#fe8002]/40 shadow-md shadow-[#fe8002]/20 uppercase tracking-wider">
                        {product.category}
                      </span>
                      {(product.rating || product.reviews) && (
                        <div className="flex items-center gap-1">
                          <FaStar className="text-yellow-400 text-sm" />
                          <span className={`font-bold text-sm ${
                            theme === 'light' ? 'text-gray-800' : 'text-white'
                          }`}>
                            {product.rating || 4.5}
                          </span>
                          <span className="text-gray-400 text-xs">({product.reviews || 0})</span>
                        </div>
                      )}
                    </div>

                    <h3 className={`font-bold text-xl leading-tight group-hover:text-[#fe8002] transition-colors duration-300 line-clamp-2 ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      {product.name}
                    </h3>

                    <div className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <p className="text-[#fe8002] font-extrabold text-2xl bg-gradient-to-r from-[#fe8002] to-[#ff4500] bg-clip-text text-transparent">
                          {product.price.toLocaleString("fr-DZ", {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                        <span className="text-gray-400 text-sm font-semibold">DZD</span>
                      </div>
                      {(product.originalPrice || product.old_price || product.oldPrice) && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-sm line-through">
                            {(product.originalPrice || product.old_price || product.oldPrice || 0).toLocaleString("fr-DZ", {
                              minimumFractionDigits: 2,
                            })}{" "}
                            DZD
                          </span>
                          <span className="bg-gradient-to-r from-green-600 to-green-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            Économisez{" "}
                            {((product.originalPrice || product.old_price || product.oldPrice || 0) - product.price).toLocaleString("fr-DZ", {
                              minimumFractionDigits: 0,
                            })}{" "}
                            DZD
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Warranty */}
                    {(product.warrantyMonths || product.warranty_months) && (
                      <div className="flex items-center gap-2 text-sm">
                        <FaClock className="text-[#fe8002]" />
                        <span className="text-gray-300">
                          <span className="text-[#fe8002] font-bold">
                            {product.warrantyMonths || product.warranty_months} mois
                          </span>{" "}
                          de garantie
                        </span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        disabled={product.quantity !== undefined && product.quantity === 0}
                        className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 transform flex items-center justify-center gap-2 text-sm uppercase tracking-wide ${
                          product.quantity !== undefined && product.quantity === 0
                            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                            : addedToCart === product.id
                            ? "bg-gradient-to-r from-green-600 to-green-700 text-white border border-white/20 shadow-lg shadow-green-500/50"
                            : "bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-black hover:from-[#ff4500] hover:to-[#fe8002] hover:scale-105 shadow-lg shadow-[#fe8002]/50 border border-white/20"
                        }`}
                      >
                        <FaShoppingCart className="text-base" />
                        {product.quantity !== undefined && product.quantity === 0
                          ? "Épuisé"
                          : addedToCart === product.id
                          ? "✓ Ajouté"
                          : "Ajouter"}
                      </button>
                      <button className="flex-1 bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-[#fe8002] font-bold py-3 px-4 rounded-xl border-2 border-[#fe8002]/40 hover:border-[#fe8002] hover:shadow-lg hover:shadow-[#fe8002]/30 transition-all duration-300 transform hover:scale-105 uppercase tracking-wide text-sm">
                        Détails
                      </button>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="col-span-full text-center py-20">
              <div className="inline-block p-10 bg-gradient-to-br from-[#1a1a1a] via-[#181818] to-[#0f0f0f] rounded-3xl border-2 border-[#fe8002]/40 shadow-2xl shadow-[#fe8002]/20 backdrop-blur-xl">
                <div className="text-7xl mb-6 animate-bounce">🔍</div>
                <p className="text-white text-3xl font-extrabold mb-3 bg-gradient-to-r from-[#fe8002] to-[#ff4500] bg-clip-text text-transparent">
                  Aucun produit trouvé
                </p>
                <p className="text-gray-400 mb-8 text-lg">
                  Essayez de modifier vos critères de recherche
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedCondition("all");
                  }}
                  className="px-10 py-4 rounded-xl font-extrabold bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-black hover:from-white hover:to-gray-200 transition-all duration-300 shadow-xl shadow-[#fe8002]/40 transform hover:scale-105 uppercase tracking-wide text-sm border-2 border-white/20"
                >
                  ↺ Réinitialiser les filtres
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="relative z-10 py-16 px-4">
        <div className="container mx-auto">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-3xl p-8 md:p-12 border-2 border-[#fe8002]/40 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[#fe8002] to-[#ff4500] bg-clip-text text-transparent text-center mb-8">
              Pourquoi choisir nos produits d'occasion ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl mb-4">✓</div>
                <h3 className="text-[#fe8002] font-bold text-xl mb-3">Testé & Certifié</h3>
                <p className="text-gray-400 leading-relaxed">
                  Chaque produit est rigoureusement testé et certifié par nos experts avant la
                  vente
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">🛡️</div>
                <h3 className="text-[#fe8002] font-bold text-xl mb-3">Garantie Incluse</h3>
                <p className="text-gray-400 leading-relaxed">
                  Tous nos produits d'occasion bénéficient d'une garantie jusqu'à{" "}
                  <span className="text-[#fe8002] font-bold">{stats.maxWarranty} mois</span>
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">💰</div>
                <h3 className="text-[#fe8002] font-bold text-xl mb-3">Prix Imbattables</h3>
                <p className="text-gray-400 leading-relaxed">
                  Économisez jusqu'à{" "}
                  <span className="text-[#fe8002] font-bold">{stats.maxDiscount}%</span> sur des
                  équipements de qualité professionnelle
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ZoneDocassion;
