"use client";

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAllProducts } from '../hooks/useProducts';
import { useTheme } from '../context/ThemeContext';
import { useScrollToTop } from '../hooks/useScrollToTop';
import Image from 'next/image';
import { FaSearch, FaSpinner, FaExclamationTriangle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const SearchContent = () => {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 12;

  // Update search query when URL parameter changes
  useEffect(() => {
    setSearchQuery(queryParam);
    setCurrentPage(0);
  }, [queryParam]);

  // Fetch all products
  const { data: allProducts, isLoading, isError, error } = useAllProducts();

  // Fuzzy search function - helps find products even with typos
  const fuzzyMatch = (text: string, query: string): number => {
    text = text.toLowerCase();
    query = query.toLowerCase();
    
    // Exact match gets highest score
    if (text.includes(query)) return 100;
    
    // Calculate similarity score
    let score = 0;
    const queryWords = query.split(' ');
    const textWords = text.split(' ');
    
    queryWords.forEach(qWord => {
      textWords.forEach(tWord => {
        if (tWord.includes(qWord) || qWord.includes(tWord)) {
          score += 50;
        } else {
          // Check character overlap
          let matches = 0;
          for (let char of qWord) {
            if (tWord.includes(char)) matches++;
          }
          score += (matches / qWord.length) * 20;
        }
      });
    });
    
    return score;
  };

  // Client-side search with fuzzy matching and sorting by relevance
  const { filteredProducts, totalPages } = useMemo(() => {
    if (!allProducts || !searchQuery.trim()) {
      return { filteredProducts: [], totalPages: 0 };
    }

    const query = searchQuery.toLowerCase().trim();
    
    // Score each product based on relevance
    const scoredProducts = allProducts.map((product) => {
      let score = 0;
      
      // Search in different fields with different weights
      score += fuzzyMatch(product.name, query) * 3; // Name is most important
      score += fuzzyMatch(product.category || '', query) * 2;
      score += fuzzyMatch(product.description || '', query) * 1;
      score += fuzzyMatch(product.brand || '', query) * 2;
      score += fuzzyMatch(product.condition || '', query) * 1;
      
      return { product, score };
    });

    // Filter products with score > 0 and sort by score
    const filtered = scoredProducts
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.product);

    const pages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    return { filteredProducts: filtered, totalPages: pages };
  }, [allProducts, searchQuery]);

  // Get products for current page
  const paginatedProducts = useMemo(() => {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  // Scroll to top when page changes
  useScrollToTop(currentPage, undefined, 'smooth');

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    // Update URL without page reload
    window.history.pushState({}, '', `/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className={`py-12 px-4 min-h-screen transition-all duration-300 ${
      theme === 'light'
        ? 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
        : 'bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a]'
    }`}>
      <div className="container mx-auto max-w-6xl">
        {/* Search Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] bg-clip-text text-transparent mb-6">
            Rechercher des Produits
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#fe8002] to-transparent mx-auto mb-6" />
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className={`max-w-2xl mx-auto mb-12 rounded-2xl p-2 border-2 shadow-2xl ${
          theme === 'light'
            ? 'bg-white border-[#fe8002]/40'
            : 'bg-gradient-to-r from-[#1a1a1a] to-[#0f0f0f] border-[#fe8002]/30'
        }`}>
          <div className="flex items-center gap-4">
            <FaSearch className="text-[#fe8002] text-2xl ml-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un produit..."
              className={`flex-1 bg-transparent py-4 px-2 text-lg font-semibold focus:outline-none ${
                theme === 'light' ? 'text-gray-800 placeholder-gray-500' : 'text-white placeholder-gray-400'
              }`}
            />
            {isLoading && (
              <FaSpinner className="text-[#fe8002] text-2xl mr-4 animate-spin" />
            )}
          </div>
        </form>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <FaSpinner className="text-[#fe8002] text-6xl animate-spin mb-6" />
            <p className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              Chargement des produits...
            </p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className={`rounded-2xl p-8 border-2 border-red-500/50 text-center ${
            theme === 'light'
              ? 'bg-red-50'
              : 'bg-gradient-to-br from-red-900/20 to-red-800/10'
          }`}>
            <FaExclamationTriangle className="text-red-500 text-6xl mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-red-500 mb-2">Erreur de recherche</h3>
            <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              {error instanceof Error ? error.message : 'Une erreur est survenue'}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && searchQuery && filteredProducts.length === 0 && (
          <div className={`rounded-2xl p-12 border-2 border-[#fe8002]/30 text-center ${
            theme === 'light'
              ? 'bg-white'
              : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]'
          }`}>
            <FaSearch className="text-[#fe8002] text-6xl mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-[#fe8002] mb-4">
              Aucun résultat trouvé
            </h3>
            <p className={`text-lg mb-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              Aucun produit ne correspond à "{searchQuery}"
            </p>
            <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>
              Essayez des mots-clés différents ou vérifiez l'orthographe
            </p>
          </div>
        )}

        {/* Results */}
        {!isLoading && !isError && searchQuery && filteredProducts.length > 0 && (
          <>
            <div className="mb-6">
              <p className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                <span className="text-[#fe8002] font-extrabold">{filteredProducts.length}</span> produit(s) trouvé(s) pour "{searchQuery}"
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {paginatedProducts.map((product) => (
                <a
                  key={product.id}
                  href={`/product/${product.id}`}
                  className={`rounded-2xl p-6 border-2 border-[#fe8002]/30 hover:border-[#fe8002] transition-all duration-300 hover:scale-105 shadow-xl cursor-pointer ${
                    theme === 'light'
                      ? 'bg-white'
                      : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]'
                  }`}
                >
                  {/* Product Image */}
                  <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-100">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <h3 className={`font-bold text-lg mb-2 line-clamp-2 ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    {product.name}
                  </h3>

                  <p className={`text-sm mb-3 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    {product.category}
                  </p>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-extrabold bg-gradient-to-r from-[#fe8002] to-[#ff4500] bg-clip-text text-transparent">
                      {product.price.toLocaleString('fr-DZ')} DZD
                    </span>
                    {product.oldPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        {product.oldPrice.toLocaleString('fr-DZ')} DZD
                      </span>
                    )}
                  </div>

                  {product.condition && (
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      product.condition === 'Neuf'
                        ? 'bg-green-500/20 text-green-500'
                        : 'bg-[#fe8002]/20 text-[#fe8002]'
                    }`}>
                      {product.condition}
                    </span>
                  )}
                </a>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={`flex items-center justify-center gap-4 mt-8 p-4 rounded-2xl border-2 ${
                theme === 'light'
                  ? 'bg-white border-[#fe8002]/30'
                  : 'bg-gradient-to-r from-[#1a1a1a] to-[#0f0f0f] border-[#fe8002]/30'
              }`}>
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                    currentPage === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-white hover:scale-105 shadow-lg'
                  }`}
                >
                  <FaChevronLeft />
                  Précédent
                </button>

                <span className={`font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Page {currentPage + 1} / {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                    currentPage >= totalPages - 1
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-white hover:scale-105 shadow-lg'
                  }`}
                >
                  Suivant
                  <FaChevronRight />
                </button>
              </div>
            )}
          </>
        )}

        {/* Initial State */}
        {!isLoading && !searchQuery && (
          <div className={`text-center py-20 rounded-2xl border-2 border-dashed ${
            theme === 'light'
              ? 'bg-gray-50 border-gray-300'
              : 'bg-[#0f0f0f] border-[#fe8002]/30'
          }`}>
            <FaSearch className="text-[#fe8002] text-6xl mx-auto mb-6 opacity-50" />
            <p className={`text-xl font-semibold ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              Commencez à taper pour rechercher des produits...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const SearchPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="text-[#fe8002] text-4xl animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
};

export default SearchPage;
