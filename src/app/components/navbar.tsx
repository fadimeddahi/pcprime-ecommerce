"use client";

import { FaSearch, FaUser, FaRegHeart, FaShoppingCart, FaBars, FaTimes, FaMoon, FaSun } from "react-icons/fa";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useTheme } from "../context/ThemeContext";
import { useAllCategories } from "../hooks/useProducts";
import Cart from "./cart";
import Wishlist from "./wishlist";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const { getCartItemsCount } = useCart();
  const { getWishlistItemsCount } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const { data: categories = [] } = useAllCategories();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const toggleWishlist = () => {
    setIsWishlistOpen(!isWishlistOpen);
  };

  return (
    <header className={`w-full z-50 shadow-2xl backdrop-blur-xl sticky top-0 transition-all duration-300 ${
      theme === 'light' 
        ? 'bg-gradient-to-r from-white via-gray-50 to-white border-b-2 border-[#fe8002]/40' 
        : 'bg-gradient-to-r from-black via-[#0f0f0f] to-black border-b-2 border-[#fe8002]/30'
    }`}>
      {/* --- UNIFIED NAVBAR --- */}
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <a href="/">
            <img
              src={theme === 'light' ? '/logo_white.png' : '/logo.png'}
              alt="Prime Computer Logo"
              className={`w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg hover:scale-110 transition-all duration-300 cursor-pointer ${
                theme === 'light'
                  ? 'border-2 border-[#fe8002]/60 shadow-[#fe8002]/40 hover:border-[#fe8002]'
                  : 'border-2 border-[#fe8002]/50 shadow-[#fe8002]/30 hover:border-[#fe8002]'
              }`}
            />
          </a>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-6">
            <a href="/" className={`relative font-bold transition-colors group ${
              theme === 'light' ? 'text-gray-800 hover:text-[#fe8002]' : 'text-[#fe8002] hover:text-white'
            }`}>
              Accueil
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#fe8002] to-[#ff4500] group-hover:w-full transition-all duration-300" />
            </a>
            <a href="/pc-builder" className={`relative font-bold transition-colors group ${
              theme === 'light' ? 'text-gray-800 hover:text-[#fe8002]' : 'text-[#fe8002] hover:text-white'
            }`}>
              PC Builder
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#fe8002] to-[#ff4500] group-hover:w-full transition-all duration-300" />
            </a>
            <a href="/espace-society" className={`relative font-bold transition-colors group ${
              theme === 'light' ? 'text-gray-800 hover:text-[#fe8002]' : 'text-[#fe8002] hover:text-white'
            }`}>
              Espace Society
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#fe8002] to-[#ff4500] group-hover:w-full transition-all duration-300" />
            </a>
            <a href="/contact" className={`relative font-bold transition-colors group ${
              theme === 'light' ? 'text-gray-800 hover:text-[#fe8002]' : 'text-[#fe8002] hover:text-white'
            }`}>
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#fe8002] to-[#ff4500] group-hover:w-full transition-all duration-300" />
            </a>
          </div>

          {/* Search Bar */}
          <div className={`hidden md:flex items-center border-2 rounded-xl px-4 py-2.5 flex-1 max-w-md shadow-lg transition-all ${
            theme === 'light'
              ? 'border-[#fe8002]/40 hover:border-[#fe8002]/70 bg-white'
              : 'border-[#fe8002]/30 hover:border-[#fe8002]/50 bg-gradient-to-r from-[#1a1a1a] to-[#0f0f0f]'
          }`}>
            <input
              type="text"
              placeholder="Rechercher..."
              className={`outline-none bg-transparent w-full text-sm ${
                theme === 'light' ? 'text-gray-800 placeholder-gray-500' : 'text-white placeholder-gray-400'
              }`}
            />
            <FaSearch className="text-[#fe8002] ml-2 text-lg hover:scale-125 transition-transform cursor-pointer" />
          </div>

          {/* Categories Dropdown */}
          <select 
            className={`hidden lg:block border-2 rounded-xl px-4 py-2.5 shadow-lg focus:outline-none transition-all text-sm font-semibold cursor-pointer appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNSA3LjVMMTAgMTIuNUwxNSA3LjUiIHN0cm9rZT0iI2ZlODAwMiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=')] bg-[length:18px] bg-[right_0.5rem_center] bg-no-repeat pr-10 ${
              theme === 'light'
                ? 'bg-white text-gray-800 border-[#fe8002]/40 hover:border-[#fe8002] focus:border-[#fe8002] shadow-[#fe8002]/20'
                : 'bg-gradient-to-r from-[#1a1a1a] to-[#0f0f0f] text-[#fe8002] border-[#fe8002]/40 hover:border-[#fe8002] focus:border-[#fe8002] shadow-[#fe8002]/10'
            }`}
            defaultValue=""
          >
            <option value="" disabled hidden>CATÉGORIES</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name.toUpperCase()}
              </option>
            ))}
          </select>

          {/* Icons */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`text-xl md:text-2xl cursor-pointer hover:scale-125 transition-transform ${
                theme === 'light' ? 'text-gray-800 hover:text-[#fe8002]' : 'text-[#fe8002] hover:text-white'
              }`}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </button>
            
            <div className="relative group">
              <a href="/profile">
                <FaUser className={`text-xl md:text-2xl cursor-pointer hover:scale-125 transition-transform ${
                  theme === 'light' ? 'text-gray-800 hover:text-[#fe8002]' : 'text-[#fe8002]'
                }`} />
              </a>
            </div>
            <div className="relative">
              <a href="/wishlist" className="relative inline-block">
                <FaRegHeart className={`text-xl md:text-2xl cursor-pointer hover:scale-125 transition-transform ${
                  theme === 'light' ? 'text-gray-800 hover:text-[#fe8002]' : 'text-[#fe8002]'
                }`} />
                {getWishlistItemsCount() > 0 && (
                  <span className={`absolute -top-1 -right-1 bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-white text-xs font-extrabold w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center animate-pulse ${
                    theme === 'light' ? 'border-2 border-white' : 'border-2 border-black'
                  }`}>
                    {getWishlistItemsCount()}
                  </span>
                )}
              </a>
            </div>
            <div className="relative">
              <button onClick={toggleCart} className="relative inline-block">
                <FaShoppingCart className={`text-xl md:text-2xl cursor-pointer hover:scale-125 transition-transform ${
                  theme === 'light' ? 'text-gray-800 hover:text-[#fe8002]' : 'text-[#fe8002]'
                }`} />
                {getCartItemsCount() > 0 && (
                  <span className={`absolute -top-1 -right-1 bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-white text-xs font-extrabold w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center animate-pulse ${
                    theme === 'light' ? 'border-2 border-white' : 'border-2 border-black'
                  }`}>
                    {getCartItemsCount()}
                  </span>
                )}
              </button>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={toggleSidebar}
              className={`lg:hidden text-2xl cursor-pointer hover:scale-110 transition-transform ${
                theme === 'light' ? 'text-gray-800' : 'text-[#fe8002]'
              }`}
              aria-label="Toggle menu"
            >
              <FaBars />
            </button>
          </div>
        </div>
      </nav>

      {/* --- MOBILE SIDEBAR --- */}
      <div
        className={`fixed top-0 right-0 h-screen w-72 shadow-2xl transform transition-transform duration-300 ease-in-out z-[9999] border-l-4 border-[#fe8002] overflow-y-auto ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden ${
          theme === 'light' 
            ? 'bg-gradient-to-br from-white via-gray-50 to-white' 
            : 'bg-gradient-to-br from-[#181818] via-[#1a1a1a] to-[#0f0f0f]'
        }`}
      >
        <div className={`flex justify-between items-center p-5 border-b-2 border-[#fe8002] ${
          theme === 'light' ? 'bg-white' : 'bg-gradient-to-r from-[#1a1a1a] to-[#0f0f0f]'
        }`}>
          <h2 className="text-[#fe8002] font-extrabold text-xl bg-gradient-to-r from-[#fe8002] to-[#ff4500] bg-clip-text text-transparent">Menu</h2>
          <button
            onClick={toggleSidebar}
            className="text-[#fe8002] text-2xl hover:scale-110 hover:rotate-90 transition-all duration-300"
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="flex flex-col p-5 space-y-3">
          <a
            href="/"
            onClick={toggleSidebar}
            className={`font-bold transition-all py-3 px-5 rounded-xl hover:bg-gradient-to-r hover:from-[#fe8002] hover:to-[#ff4500] hover:text-white hover:shadow-lg hover:shadow-[#fe8002]/50 group ${
              theme === 'light' ? 'text-gray-800' : 'text-[#fe8002]'
            }`}
          >
            <span className="flex items-center gap-3">
              <span className="w-1 h-6 bg-gradient-to-b from-[#fe8002] to-[#ff4500] rounded-full group-hover:h-8 transition-all" />
              Accueil
            </span>
          </a>
          <a
            href="/pc-builder"
            onClick={toggleSidebar}
            className={`font-bold transition-all py-3 px-5 rounded-xl hover:bg-gradient-to-r hover:from-[#fe8002] hover:to-[#ff4500] hover:text-white hover:shadow-lg hover:shadow-[#fe8002]/50 group ${
              theme === 'light' ? 'text-gray-800' : 'text-[#fe8002]'
            }`}
          >
            <span className="flex items-center gap-3">
              <span className="w-1 h-6 bg-gradient-to-b from-[#fe8002] to-[#ff4500] rounded-full group-hover:h-8 transition-all" />
              PC Builder
            </span>
          </a>
          <a
            href="/espace-society"
            onClick={toggleSidebar}
            className={`font-bold transition-all py-3 px-5 rounded-xl hover:bg-gradient-to-r hover:from-[#fe8002] hover:to-[#ff4500] hover:text-white hover:shadow-lg hover:shadow-[#fe8002]/50 group ${
              theme === 'light' ? 'text-gray-800' : 'text-[#fe8002]'
            }`}
          >
            <span className="flex items-center gap-3">
              <span className="w-1 h-6 bg-gradient-to-b from-[#fe8002] to-[#ff4500] rounded-full group-hover:h-8 transition-all" />
              Espace Society
            </span>
          </a>
          <a
            href="/contact"
            onClick={toggleSidebar}
            className={`font-bold transition-all py-3 px-5 rounded-xl hover:bg-gradient-to-r hover:from-[#fe8002] hover:to-[#ff4500] hover:text-white hover:shadow-lg hover:shadow-[#fe8002]/50 group ${
              theme === 'light' ? 'text-gray-800' : 'text-[#fe8002]'
            }`}
          >
            <span className="flex items-center gap-3">
              <span className="w-1 h-6 bg-gradient-to-b from-[#fe8002] to-[#ff4500] rounded-full group-hover:h-8 transition-all" />
              Contact
            </span>
          </a>

          <div className="pt-5 border-t-2 border-[#fe8002]/30">
            <select 
              className={`border-2 border-[#fe8002]/40 rounded-xl px-4 py-3 shadow-lg focus:border-[#fe8002] focus:outline-none transition-all text-sm w-full font-semibold cursor-pointer ${
                theme === 'light'
                  ? 'bg-white text-gray-800 shadow-[#fe8002]/20'
                  : 'bg-gradient-to-r from-[#1a1a1a] to-[#0f0f0f] text-[#fe8002] shadow-[#fe8002]/20'
              }`}
              defaultValue=""
            >
              <option value="" disabled hidden className={theme === 'light' ? 'bg-white text-gray-800' : 'bg-[#1a1a1a] text-[#fe8002]'}>CATÉGORIES</option>
              {categories.map((category) => (
                <option 
                  key={category.id} 
                  value={category.id} 
                  className={theme === 'light' ? 'bg-white text-gray-800' : 'bg-[#1a1a1a] text-white'}
                >
                  {category.name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </nav>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998] md:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Cart Component */}
      <Cart isOpen={isCartOpen} onClose={toggleCart} />
      
      {/* Wishlist Component */}
      <Wishlist isOpen={isWishlistOpen} onClose={toggleWishlist} />
    </header>
  );
};

export default Navbar;
