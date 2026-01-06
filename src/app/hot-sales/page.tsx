"use client";

import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAllProducts } from "../hooks/useProducts";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { Product } from "../types/product";
import { FaFire, FaClock, FaPercent, FaShoppingCart, FaRegHeart, FaHeart } from "react-icons/fa";

interface HotSale {
  id: number;
  name: string;
  discount: number;
  timeLeft: number; // in seconds
  productCount: number;
  image: string;
  endTime: Date;
}

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
  isEnded: boolean;
}

const calculateTimeLeft = (endTime: Date): TimeLeft => {
  const now = new Date();
  const difference = endTime.getTime() - now.getTime();

  if (difference <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, isEnded: true };
  }

  return {
    hours: Math.floor(difference / (1000 * 60 * 60)),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isEnded: false,
  };
};

// Product Card Component for Hot Sales
const ProductCardItem = ({ product }: { product: Product }) => {
  const { theme } = useTheme();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const productId = typeof product.id === 'number' ? product.id : parseInt(product.id as string, 10);
    setIsWishlisted(isInWishlist(productId));
  }, [product.id, isInWishlist]);

  const handleWishlistToggle = () => {
    const productId = typeof product.id === 'number' ? product.id : parseInt(product.id as string, 10);
    if (isWishlisted) {
      removeFromWishlist(productId);
    } else {
      addToWishlist({
        id: productId,
        name: product.name,
        price: product.price || 0,
        image: product.image || '',
        category: product.category || 'Unknown',
      });
    }
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = () => {
    addToCart({
      id: typeof product.id === 'number' ? product.id : parseInt(product.id as string, 10),
      uuid: product.uuid,
      name: product.name,
      price: product.price || 0,
      image: product.image,
      category: product.category || 'Unknown',
    }, 1);
  };

  const discount = product.price ? Math.round(((product.price - (product.price * 0.9)) / product.price) * 100) : 0;

  return (
    <a
      href={`/product/${product.id}`}
      className={`group rounded-2xl overflow-hidden shadow-xl border backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
        theme === "light"
          ? "bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-orange-200"
          : "bg-gradient-to-br from-[#1f1f1f] to-[#0f0f0f] border-[#2a2a2a] hover:shadow-[#fe8002]/20"
      }`}
    >
      {/* Image Container */}
      <div className="relative h-72 w-full overflow-hidden bg-gray-200">
        <img
          src={product.image || "https://via.placeholder.com/300x300?text=No+Image"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-2">
          <div className="flex gap-2">
            {product.isPromo && (
              <span className="bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-white px-3 py-1 rounded-lg text-xs font-extrabold">
                PROMO
              </span>
            )}
            {product.isTopSeller && (
              <span className="bg-gradient-to-r from-[#ff4500] to-[#fe8002] text-white px-3 py-1 rounded-lg text-xs font-extrabold">
                TOP SELLER
              </span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleWishlistToggle();
            }}
            className={`p-2 rounded-lg transition-all ${
              isWishlisted
                ? "bg-red-500 text-white"
                : theme === "light"
                  ? "bg-white/90 text-gray-800 hover:bg-red-500 hover:text-white"
                  : "bg-[#1a1a1a]/90 text-[#fe8002] hover:bg-red-500 hover:text-white"
            }`}
          >
            {isWishlisted ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
          </button>
        </div>

        {/* Condition Badge */}
        <div
          className={`absolute bottom-3 left-3 px-3 py-1 rounded-lg text-xs font-bold ${
            product.condition === "Neuf"
              ? "bg-green-500 text-white"
              : product.condition === "Excellent"
                ? "bg-blue-500 text-white"
                : product.condition === "Très bon"
                  ? "bg-cyan-500 text-white"
                  : product.condition === "Bon"
                    ? "bg-yellow-500 text-white"
                    : "bg-orange-500 text-white"
          }`}
        >
          {product.condition}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3
          className={`font-bold text-base mb-3 line-clamp-2 group-hover:text-[#fe8002] transition-colors ${
            theme === "light" ? "text-gray-800" : "text-white"
          }`}
        >
          {product.name}
        </h3>

        {/* Category & Rating */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <span
            className={`${
              theme === "light" ? "text-gray-600" : "text-gray-400"
            }`}
          >
            {product.category}
          </span>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-extrabold text-[#fe8002]">
              ${product.price?.toFixed(2)}
            </span>
            {discount > 0 && (
              <span
                className={`text-sm font-bold px-2 py-1 rounded-lg ${
                  theme === "light"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-orange-900/30 text-orange-400"
                }`}
              >
                -{discount}%
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            handleAddToCart();
          }}
          className={`w-full py-3 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 ${
            theme === "light"
              ? "bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-white hover:shadow-lg hover:shadow-[#fe8002]/50"
              : "bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-black hover:shadow-lg hover:shadow-[#fe8002]/50"
          }`}
        >
          <FaShoppingCart size={16} />
          Ajouter au Panier
        </button>
      </div>
    </a>
  );
};

const HotSalesPage = () => {
  const { theme } = useTheme();
  const { data: allProducts = [] } = useAllProducts();
  const [hotSales, setHotSales] = useState<HotSale[]>([]);
  const [hotSalesProducts, setHotSalesProducts] = useState<Product[]>([]);
  const [selectedSale, setSelectedSale] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<{ [key: number]: TimeLeft }>({});
  const [currentPage, setCurrentPage] = useState(1);

  const PRODUCTS_PER_PAGE = 12;

  // Initialize hot sales from API (to be implemented by backend)
  useEffect(() => {
    const sales: HotSale[] = [];

    // Get hot sale products from all products
    const filteredForSales = allProducts.filter(
      (product: Product) => product.isPromo || product.isTopSeller
    );

    // If we have products, create dynamic sales based on product data
    if (filteredForSales.length > 0) {
      // For now, we'll just show all promo/topseller products without dummy sales
      setHotSalesProducts(filteredForSales);
    }

    // This will be replaced with actual API call to GET /api/hot-sales
    // For now, we'll leave sales empty and show a message if no data
    setHotSales(sales);
  }, [allProducts]);

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft: { [key: number]: TimeLeft } = {};
      hotSales.forEach((sale) => {
        newTimeLeft[sale.id] = calculateTimeLeft(sale.endTime);
      });
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [hotSales]);

  const handleSaleSelect = (saleId: number) => {
    setSelectedSale(saleId);
    setCurrentPage(1);
  };

  // Filter products based on selected sale (you can customize this based on category)
  const filteredProducts = hotSalesProducts.filter((product: Product) => {
    if (selectedSale === 1 && product.category === "Processeurs") return true;
    if (selectedSale === 2 && product.category === "Cartes Mères") return true;
    if (selectedSale === 3 && product.category === "Cartes Graphiques") return true;
    if (selectedSale === 4 && product.category === "RAM") return true;
    // Default: show all hot sale products
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const currentSale = hotSales.find((s) => s.id === selectedSale) || hotSales[0];
  const currentTimeLeft = timeLeft[selectedSale] || { hours: 0, minutes: 0, seconds: 0, isEnded: false };

  return (
    <main
      className={`min-h-screen py-10 px-4 transition-all duration-300 ${
        theme === "light"
          ? "bg-gradient-to-br from-gray-50 via-white to-gray-100"
          : "bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a]"
      }`}
    >
      {/* Background Pattern */}
      <div className={`fixed inset-0 pointer-events-none ${theme === "light" ? "opacity-[0.03]" : "opacity-[0.02]"}`}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, #fe8002 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-[#fe8002]/10 via-transparent to-[#ff4500]/10 pointer-events-none" />

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 md:gap-6 mb-3">
            {/* Professional Fire Icon Left */}
            <div className="relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-[#ff4500] via-[#fe8002] to-[#ffa500] rounded-full blur-lg opacity-75 animate-pulse" />
              <FaFire className="text-4xl md:text-5xl text-white drop-shadow-2xl relative z-10 animate-bounce" />
            </div>
            
            <h1
              className={`text-4xl md:text-5xl font-extrabold uppercase tracking-wider bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] bg-clip-text text-transparent animate-pulse`}
            >
              PROMOTIONS
            </h1>
            
            {/* Professional Fire Icon Right */}
            <div className="relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center" style={{ animationDelay: "0.2s" }}>
              <div className="absolute inset-0 bg-gradient-to-t from-[#ff4500] via-[#fe8002] to-[#ffa500] rounded-full blur-lg opacity-75 animate-pulse" style={{ animationDelay: "0.2s" }} />
              <FaFire className="text-4xl md:text-5xl text-white drop-shadow-2xl relative z-10 animate-bounce" style={{ animationDelay: "0.2s" }} />
            </div>
          </div>
          <p
            className={`text-lg md:text-xl font-bold mb-2 ${
              theme === "light" ? "text-gray-700" : "text-gray-300"
            }`}
          >
            Offres à Durée Limitée - Ne Ratez Pas! 🚀
          </p>
          <div
            className={`inline-block px-6 py-2 rounded-full border-2 ${
              theme === "light"
                ? "bg-white border-[#fe8002]/40 text-gray-700"
                : "bg-[#0f0f0f] border-[#fe8002]/60 text-[#fe8002]"
            }`}
          >
            <span className="font-bold">
              {hotSales.length > 0 ? "Ventes Flash Mises à Jour Toutes les Heures" : "Parcourez Nos Dernières Offres"}
            </span>
          </div>
        </div>

        {/* Hot Sales Carousel - Only show if sales are scheduled */}
        {hotSales.length > 0 && (
        <div className="mb-6">
          <div
            className={`rounded-2xl p-6 md:p-8 border backdrop-blur-xl shadow-2xl transition-all duration-300 ${
              theme === "light"
                ? "bg-white border-gray-200 shadow-gray-200/50"
                : "bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-[#fe8002]/30 shadow-[#fe8002]/10"
            }`}
          >
            {/* Desktop Carousel */}
            <div className="hidden md:grid grid-cols-4 gap-4 mb-6">
              {hotSales.map((sale) => (
                <button
                  key={sale.id}
                  onClick={() => handleSaleSelect(sale.id)}
                  className={`p-4 rounded-xl transition-all duration-300 transform hover:scale-105 border-2 relative overflow-hidden group ${
                    selectedSale === sale.id
                      ? theme === "light"
                        ? "bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-white border-white/50 shadow-lg shadow-[#fe8002]/50 scale-105"
                        : "bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-black border-white/30 shadow-lg shadow-[#fe8002]/50 scale-105"
                      : theme === "light"
                        ? "bg-gray-100 border-gray-300 text-gray-900 hover:border-[#fe8002]"
                        : "bg-[#0f0f0f] border-[#fe8002]/30 text-white hover:border-[#fe8002]"
                  }`}
                >
                  {selectedSale === sale.id && (
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse" />
                    </div>
                  )}
                  <div className="relative z-10">
                    <div className="flex items-center justify-center mb-2">
                      {sale.image === "🔥" ? (
                        <div className="relative w-10 h-10 flex items-center justify-center">
                          <div className="absolute inset-0 bg-gradient-to-t from-[#ff4500] via-[#fe8002] to-[#ffa500] rounded-full blur-md opacity-60" />
                          <FaFire className="text-3xl text-white relative z-10" />
                        </div>
                      ) : (
                        <span className="text-4xl">{sale.image}</span>
                      )}
                    </div>
                    <div className="font-bold text-sm mb-1">{sale.name}</div>
                    <div className="text-lg font-extrabold text-[#fe8002]">-{sale.discount}%</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Mobile Carousel */}
            <div className="md:hidden overflow-x-auto pb-4 mb-6">
              <div className="flex gap-3 min-w-min">
                {hotSales.map((sale) => (
                  <button
                    key={sale.id}
                    onClick={() => handleSaleSelect(sale.id)}
                    className={`flex-shrink-0 p-3 rounded-lg transition-all duration-300 border-2 w-24 relative overflow-hidden group ${
                      selectedSale === sale.id
                        ? theme === "light"
                          ? "bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-white border-white/50 shadow-lg"
                          : "bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-black border-white/30 shadow-lg"
                        : theme === "light"
                          ? "bg-gray-100 border-gray-300 text-gray-900"
                          : "bg-[#0f0f0f] border-[#fe8002]/30 text-white"
                    }`}
                  >
                    {selectedSale === sale.id && (
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse" />
                      </div>
                    )}
                    <div className="relative z-10">
                      <div className="flex items-center justify-center mb-1">
                        {sale.image === "🔥" ? (
                          <div className="relative w-8 h-8 flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#ff4500] via-[#fe8002] to-[#ffa500] rounded-full blur-sm opacity-50" />
                            <FaFire className="text-2xl text-white relative z-10" />
                          </div>
                        ) : (
                          <span className="text-2xl">{sale.image}</span>
                        )}
                      </div>
                      <div className="font-bold text-xs">{sale.name}</div>
                      <div className="text-sm font-extrabold text-[#fe8002]">-{sale.discount}%</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sale Details */}
            {currentSale && (
              <div
                className={`rounded-xl p-6 md:p-8 border-2 ${
                  theme === "light"
                    ? "bg-gradient-to-r from-[#fe8002]/10 to-[#ff4500]/10 border-[#fe8002]/40"
                    : "bg-gradient-to-r from-[#fe8002]/5 to-[#ff4500]/5 border-[#fe8002]/60"
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Sale Name & Image */}
                  <div className="flex items-center gap-4">
                    {currentSale.image === "🔥" ? (
                      <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#ff4500] via-[#fe8002] to-[#ffa500] rounded-full blur-xl opacity-70 animate-pulse" />
                        <FaFire className="text-7xl text-white drop-shadow-2xl relative z-10" />
                      </div>
                    ) : (
                      <div className="text-6xl flex-shrink-0">{currentSale.image}</div>
                    )}
                    <div>
                      <h2 className={`text-2xl font-extrabold mb-2 ${
                        theme === "light" ? "text-gray-900" : "text-white"
                      }`}>
                        {currentSale.name}
                      </h2>
                      <div className="text-4xl font-extrabold bg-gradient-to-r from-[#fe8002] to-[#ff4500] bg-clip-text text-transparent">
                        -{currentSale.discount}%
                      </div>
                    </div>
                  </div>

                  {/* Countdown Timer */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 mb-3">
                      <FaClock className="text-[#fe8002] text-xl" />
                      <span className={`font-bold ${
                        theme === "light" ? "text-gray-700" : "text-gray-300"
                      }`}>
                        Time Left
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 md:gap-3">
                      <div
                        className={`rounded-lg p-3 text-center border-2 ${
                          theme === "light"
                            ? "bg-white border-[#fe8002]/40 text-gray-900"
                            : "bg-[#1a1a1a] border-[#fe8002]/40 text-white"
                        }`}
                      >
                        <div className="text-2xl font-extrabold text-[#fe8002]">
                          {String(currentTimeLeft.hours).padStart(2, "0")}
                        </div>
                        <div className={`text-xs font-bold ${
                          theme === "light" ? "text-gray-600" : "text-gray-400"
                        }`}>
                          Heures
                        </div>
                      </div>
                      <div
                        className={`rounded-lg p-3 text-center border-2 ${
                          theme === "light"
                            ? "bg-white border-[#fe8002]/40 text-gray-900"
                            : "bg-[#1a1a1a] border-[#fe8002]/40 text-white"
                        }`}
                      >
                        <div className="text-2xl font-extrabold text-[#fe8002]">
                          {String(currentTimeLeft.minutes).padStart(2, "0")}
                        </div>
                        <div className={`text-xs font-bold ${
                          theme === "light" ? "text-gray-600" : "text-gray-400"
                        }`}>
                          Mins
                        </div>
                      </div>
                      <div
                        className={`rounded-lg p-3 text-center border-2 ${
                          theme === "light"
                            ? "bg-white border-[#fe8002]/40 text-gray-900"
                            : "bg-[#1a1a1a] border-[#fe8002]/40 text-white"
                        }`}
                      >
                        <div className="text-2xl font-extrabold text-[#fe8002]">
                          {String(currentTimeLeft.seconds).padStart(2, "0")}
                        </div>
                        <div className={`text-xs font-bold ${
                          theme === "light" ? "text-gray-600" : "text-gray-400"
                        }`}>
                          Secs
                        </div>
                      </div>
                      <div
                        className={`rounded-lg p-3 text-center border-2 flex items-center justify-center ${
                          currentTimeLeft.isEnded
                            ? theme === "light"
                              ? "bg-red-50 border-red-400 text-red-600"
                              : "bg-red-950 border-red-700 text-red-400"
                            : theme === "light"
                              ? "bg-green-50 border-green-400 text-green-600"
                              : "bg-green-950 border-green-700 text-green-400"
                        }`}
                      >
                        <span className="font-bold text-xs text-center">
                          {currentTimeLeft.isEnded ? "ENDED" : "LIVE"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl font-extrabold text-[#fe8002] mb-2">
                        {hotSalesProducts.length}
                      </div>
                      <p className={`font-bold ${
                        theme === "light" ? "text-gray-700" : "text-gray-300"
                      }`}>
                        Produits Disponibles
                      </p>
                      <div
                        className={`mt-4 px-6 py-2 rounded-lg font-bold inline-block ${
                          theme === "light"
                            ? "bg-[#fe8002]/20 text-[#fe8002]"
                            : "bg-[#fe8002]/20 text-[#fe8002]"
                        }`}
                      >
                        <FaPercent className="inline mr-2" />
                        Save up to {currentSale.discount}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        )}

        {/* Products Grid */}
        <div>
          <div className="mb-8">
            <h2
              className={`text-3xl font-extrabold mb-2 flex items-center gap-3 ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}
            >
              <FaFire className="text-[#fe8002] animate-pulse" />
              {hotSales.length > 0 ? "Produits en Promotion Flash" : "Produits Promotionnels"}
            </h2>
            <p
              className={`${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              {hotSales.length > 0 
                ? `${filteredProducts.length} produits correspondant à cette vente flash`
                : `${filteredProducts.length} produits promotionnels et meilleures ventes disponibles`
              }
            </p>
          </div>

          {paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 mb-12">
                {paginatedProducts.map((product: Product) => (
                  <ProductCardItem key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-12">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 flex items-center gap-2 ${
                      currentPage === 1
                        ? theme === "light"
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-[#0f0f0f] text-gray-600 cursor-not-allowed"
                        : theme === "light"
                          ? "bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-white hover:shadow-lg hover:shadow-[#fe8002]/30 hover:scale-105"
                          : "bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-black hover:shadow-lg hover:shadow-[#fe8002]/30 hover:scale-105"
                    }`}
                  >
                    ← Previous
                  </button>

                  <div
                    className={`px-6 py-3 rounded-lg font-bold ${
                      theme === "light"
                        ? "bg-gray-100 text-gray-900"
                        : "bg-[#1a1a1a] text-white border border-[#fe8002]/30"
                    }`}
                  >
                    Page {currentPage} of {totalPages}
                  </div>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 flex items-center gap-2 ${
                      currentPage === totalPages
                        ? theme === "light"
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-[#0f0f0f] text-gray-600 cursor-not-allowed"
                        : theme === "light"
                          ? "bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-white hover:shadow-lg hover:shadow-[#fe8002]/30 hover:scale-105"
                          : "bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-black hover:shadow-lg hover:shadow-[#fe8002]/30 hover:scale-105"
                    }`}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div
              className={`rounded-3xl p-10 text-center border-2 shadow-2xl backdrop-blur-xl ${
                theme === "light"
                  ? "bg-white border-gray-200 shadow-gray-200/50"
                  : "bg-gradient-to-br from-[#1a1a1a] via-[#181818] to-[#0f0f0f] border-[#fe8002]/40 shadow-[#fe8002]/20"
              }`}
            >
              <div className="text-7xl mb-6">🔍</div>
              <p
                className={`text-3xl font-extrabold mb-3 bg-gradient-to-r from-[#fe8002] to-[#ff4500] bg-clip-text text-transparent`}
              >
                Aucun Produit Trouvé
              </p>
              <p
                className={`mb-8 text-lg ${
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Revenez bientôt pour plus d'offres exceptionnelles!
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default HotSalesPage;
