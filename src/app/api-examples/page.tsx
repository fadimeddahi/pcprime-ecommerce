"use client";

import { useState } from 'react';
import { useProduct, useAllProducts, useSearchProducts } from '../hooks/useProducts';
import { useTheme } from '../context/ThemeContext';

/**
 * Example page demonstrating all three API endpoints:
 * 1. GET /products/:id - Get single product
 * 2. GET /products/all - Get all products
 * 3. GET /products/search?q=query&limit=10&offset=0 - Search products
 */

export default function APIExamplesPage() {
  const { theme } = useTheme();
  const [productId, setProductId] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 10;

  // Example 1: Get single product
  const singleProduct = useProduct(productId, {
    enabled: !!productId, // Only fetch if productId is set
  });

  // Example 2: Get all products
  const allProducts = useAllProducts();

  // Example 3: Search products with pagination
  const searchResults = useSearchProducts(
    searchQuery,
    pageSize,
    page * pageSize
  );

  return (
    <div className={`min-h-screen p-8 ${
      theme === 'light' ? 'bg-gray-50' : 'bg-[#0a0a0a]'
    }`}>
      <div className="max-w-7xl mx-auto space-y-12">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-[#fe8002] to-[#ff4500] bg-clip-text text-transparent">
          Product API Examples
        </h1>

        {/* Example 1: Get Single Product */}
        <section className={`p-6 rounded-xl border-2 border-[#fe8002]/40 ${
          theme === 'light' ? 'bg-white' : 'bg-[#1a1a1a]'
        }`}>
          <h2 className="text-2xl font-bold mb-4 text-[#fe8002]">
            1. Get Single Product (GET /products/:id)
          </h2>
          
          <input
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="Enter product ID"
            className={`px-4 py-2 rounded-lg border-2 border-[#fe8002]/40 mb-4 ${
              theme === 'light' ? 'bg-white text-gray-900' : 'bg-[#0f0f0f] text-white'
            }`}
          />

          {singleProduct.isLoading && <p>Loading product...</p>}
          {singleProduct.isError && (
            <p className="text-red-500">Error: {singleProduct.error.message}</p>
          )}
          {singleProduct.data && (
            <div className={`p-4 rounded-lg ${
              theme === 'light' ? 'bg-gray-50' : 'bg-[#0f0f0f]'
            }`}>
              <h3 className={`font-bold text-lg ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {singleProduct.data.name}
              </h3>
              <p className="text-[#fe8002] font-bold">
                {singleProduct.data.price.toLocaleString()} DZD
              </p>
            </div>
          )}
        </section>

        {/* Example 2: Get All Products */}
        <section className={`p-6 rounded-xl border-2 border-[#fe8002]/40 ${
          theme === 'light' ? 'bg-white' : 'bg-[#1a1a1a]'
        }`}>
          <h2 className="text-2xl font-bold mb-4 text-[#fe8002]">
            2. Get All Products (GET /products/all)
          </h2>

          {allProducts.isLoading && <p>Loading all products...</p>}
          {allProducts.isError && (
            <p className="text-red-500">Error: {allProducts.error.message}</p>
          )}
          {allProducts.data && (
            <div>
              <p className={`mb-4 font-bold ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                Total Products: {allProducts.data.length}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allProducts.data.slice(0, 6).map((product) => (
                  <div
                    key={product.id}
                    className={`p-4 rounded-lg ${
                      theme === 'light' ? 'bg-gray-50' : 'bg-[#0f0f0f]'
                    }`}
                  >
                    <h3 className={`font-bold ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      {product.name}
                    </h3>
                    <p className="text-[#fe8002] font-bold">
                      {product.price.toLocaleString()} DZD
                    </p>
                  </div>
                ))}
              </div>
              {allProducts.data.length > 6 && (
                <p className={`mt-4 ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  ... and {allProducts.data.length - 6} more products
                </p>
              )}
            </div>
          )}
        </section>

        {/* Example 3: Search Products with Pagination */}
        <section className={`p-6 rounded-xl border-2 border-[#fe8002]/40 ${
          theme === 'light' ? 'bg-white' : 'bg-[#1a1a1a]'
        }`}>
          <h2 className="text-2xl font-bold mb-4 text-[#fe8002]">
            3. Search Products (GET /products/search?q=query&limit=10&offset=0)
          </h2>

          <div className="mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0); // Reset to first page on new search
              }}
              placeholder="Search products..."
              className={`w-full px-4 py-2 rounded-lg border-2 border-[#fe8002]/40 ${
                theme === 'light' ? 'bg-white text-gray-900' : 'bg-[#0f0f0f] text-white'
              }`}
            />
          </div>

          {searchResults.isLoading && <p>Searching...</p>}
          {searchResults.isError && (
            <p className="text-red-500">Error: {searchResults.error.message}</p>
          )}
          
          {searchQuery && searchResults.data && (
            <>
              <p className={`mb-4 font-bold ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                Found {searchResults.data.total} results
              </p>

              {searchResults.data.products.length === 0 ? (
                <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                  No products found
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {searchResults.data.products.map((product) => (
                      <div
                        key={product.id}
                        className={`p-4 rounded-lg ${
                          theme === 'light' ? 'bg-gray-50' : 'bg-[#0f0f0f]'
                        }`}
                      >
                        <h3 className={`font-bold ${
                          theme === 'light' ? 'text-gray-900' : 'text-white'
                        }`}>
                          {product.name}
                        </h3>
                        <p className="text-[#fe8002] font-bold">
                          {product.price.toLocaleString()} DZD
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex items-center gap-4 justify-center">
                    <button
                      onClick={() => setPage(p => p - 1)}
                      disabled={page === 0}
                      className={`px-4 py-2 rounded-lg font-bold ${
                        page === 0
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:scale-105'
                      } ${
                        theme === 'light'
                          ? 'bg-gray-200 text-gray-900'
                          : 'bg-[#0f0f0f] text-white border-2 border-[#fe8002]/40'
                      }`}
                    >
                      Previous
                    </button>

                    <span className={`font-bold ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      Page {page + 1} of {Math.ceil(searchResults.data.total / pageSize)}
                    </span>

                    <button
                      onClick={() => setPage(p => p + 1)}
                      disabled={(page + 1) * pageSize >= searchResults.data.total}
                      className={`px-4 py-2 rounded-lg font-bold ${
                        (page + 1) * pageSize >= searchResults.data.total
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:scale-105'
                      } ${
                        theme === 'light'
                          ? 'bg-gray-200 text-gray-900'
                          : 'bg-[#0f0f0f] text-white border-2 border-[#fe8002]/40'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
