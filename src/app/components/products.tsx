"use client";

import Image from "next/image";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
  price: number;
  isPromo?: boolean;
  isTopSeller?: boolean;
}

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="bg-gradient-to-br from-[#232323] to-[#1a1a2e] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#9333ea]/40 transition-all duration-300 border-2 border-[#181818] hover:border-[#9333ea]">
      <div className="relative h-64 w-full bg-gradient-to-br from-[#181818] to-[#1a0a2e]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {product.isPromo && (
            <span className="bg-gradient-to-r from-[#fe8002] to-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              PROMO
            </span>
          )}
          {product.isTopSeller && (
            <span className="bg-gradient-to-r from-[#00d4ff] to-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              TOP VENTE
            </span>
          )}
        </div>
      </div>
      <div className="p-4">
        <span className="text-xs font-semibold text-[#00d4ff] bg-[#181818] px-3 py-1 rounded-full border border-[#00d4ff]/30">
          {product.category}
        </span>
        <h3 className="text-white font-bold text-lg mt-3 mb-2">
          {product.name}
        </h3>
        <p className="text-[#fe8002] font-bold text-xl mb-4">
          {product.price.toFixed(2)} DZD
        </p>
        <button className="w-full bg-gradient-to-r from-[#fe8002] to-[#00d4ff] text-black font-bold py-2 px-4 rounded-full hover:from-[#00d4ff] hover:to-[#fe8002] transition-all duration-300">
          Voir Détails
        </button>
      </div>
    </div>
  );
};

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showPromoOnly, setShowPromoOnly] = useState(false);
  const [showTopSellersOnly, setShowTopSellersOnly] = useState(false);

  const allProducts: Product[] = [
    {
      id: 1,
      name: "PC Gamer RTX 4090",
      category: "PC Bureau",
      image: "/pc gamer.jpeg",
      price: 8999.99,
      isTopSeller: true,
    },
    {
      id: 2,
      name: "Laptop Dell XPS",
      category: "PC Portable",
      image: "/laptob.jpeg",
      price: 4599.99,
      isPromo: true,
    },
    {
      id: 3,
      name: "Carte Graphique RTX 4070",
      category: "Composants",
      image: "/rtx.jpeg",
      price: 2499.99,
      isTopSeller: true,
      isPromo: true,
    },
    {
      id: 4,
      name: "PC Gaming RGB",
      category: "PC Bureau",
      image: "/pc gamer.jpeg",
      price: 6999.99,
    },
    {
      id: 5,
      name: "Laptop Gaming",
      category: "PC Portable",
      image: "/laptob.jpeg",
      price: 5299.99,
      isTopSeller: true,
    },
    {
      id: 6,
      name: "RTX 3060 Ti",
      category: "Composants",
      image: "/rtx.jpeg",
      price: 1799.99,
      isPromo: true,
    },
  ];

  // Filter products
  const filteredProducts = allProducts.filter((product) => {
    if (selectedCategory !== "all" && product.category !== selectedCategory) {
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
    <section className="py-16 px-4 bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#181818]">
      <div className="container mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#fe8002] via-[#9333ea] to-[#00d4ff] bg-clip-text text-transparent text-center mb-8 font-mono">
          Nos Produits
        </h2>

        {/* Filters Section */}
        <div className="bg-gradient-to-r from-[#232323] to-[#1a1a2e] rounded-lg p-6 mb-8 border-2 border-[#9333ea]/30 shadow-lg shadow-[#9333ea]/20">
          <h3 className="text-[#9333ea] font-bold text-lg mb-4">Filtres</h3>
          
          <div className="flex flex-col md:flex-row gap-4 flex-wrap">
            {/* Category Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="text-white text-sm font-semibold mb-2 block">
                Catégorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#181818] text-[#fe8002] border-2 border-[#fe8002] rounded-full px-4 py-2 shadow-md focus:outline-none focus:border-white transition-all cursor-pointer"
              >
                <option value="all">Toutes les catégories</option>
                <option value="PC Bureau">PC Bureau</option>
                <option value="PC Portable">PC Portable</option>
                <option value="Composants">Composants</option>
              </select>
            </div>

            {/* Promo Filter */}
            <div className="flex items-end">
              <button
                onClick={() => setShowPromoOnly(!showPromoOnly)}
                className={`px-6 py-2 rounded-full font-bold transition-all ${
                  showPromoOnly
                    ? "bg-gradient-to-r from-[#fe8002] to-red-600 text-white border-2 border-[#fe8002]"
                    : "bg-[#181818] text-[#fe8002] border-2 border-[#fe8002] hover:bg-[#fe8002] hover:text-black"
                }`}
              >
                🔥 Promotions
              </button>
            </div>

            {/* Top Sellers Filter */}
            <div className="flex items-end">
              <button
                onClick={() => setShowTopSellersOnly(!showTopSellersOnly)}
                className={`px-6 py-2 rounded-full font-bold transition-all ${
                  showTopSellersOnly
                    ? "bg-gradient-to-r from-[#00d4ff] to-green-600 text-white border-2 border-[#00d4ff]"
                    : "bg-[#181818] text-[#00d4ff] border-2 border-[#00d4ff] hover:bg-[#00d4ff] hover:text-black"
                }`}
              >
                ⭐ Top Ventes
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
                  className="px-6 py-2 rounded-full font-bold bg-[#fe8002] text-black hover:bg-white transition-all"
                >
                  Réinitialiser
                </button>
              </div>
            )}
          </div>

          {/* Results count */}
          <div className="mt-4 text-white text-sm">
            <span className="text-[#fe8002] font-bold">{filteredProducts.length}</span> produit(s) trouvé(s)
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <p className="text-white text-xl">Aucun produit trouvé avec ces filtres.</p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setShowPromoOnly(false);
                  setShowTopSellersOnly(false);
                }}
                className="mt-4 px-6 py-2 rounded-full font-bold bg-[#fe8002] text-black hover:bg-white transition-all"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Products;
