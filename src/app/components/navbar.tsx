"use client";

import { FaSearch, FaUser, FaRegHeart, FaShoppingCart, FaBars, FaTimes, FaMoon, FaSun, FaComments, FaFire } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useTheme } from "../context/ThemeContext";
import { useAllCategories } from "../hooks/useProducts";
import { authApi } from "../services/api";
import Cart from "./cart";
import Wishlist from "./wishlist";
import FeedbackModal from "./feedback-modal";
import LoginModal from "./login-modal";

const Navbar = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { getCartItemsCount, shouldOpenCart, setShouldOpenCart } = useCart();
  const { getWishlistItemsCount } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const { data: categories = [] } = useAllCategories();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Open cart when item is added
  useEffect(() => {
    if (shouldOpenCart) {
      setIsCartOpen(true);
      setShouldOpenCart(false);
    }
  }, [shouldOpenCart, setShouldOpenCart]);

  const handleProfileClick = () => {
    if (authApi.isAuthenticated()) {
      router.push('/profile');
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    router.push('/profile');
  };

  const handleContinueAsGuest = () => {
    setShowLoginModal(false);
  };

  // Refs to track touch/swipe on the page to prevent opening sidebar on swipes
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const toggleWishlist = () => {
    setIsWishlistOpen(!isWishlistOpen);
  };

  // Prevent sidebar from opening on page swipes (especially on mobile)
  useEffect(() => {
    // Disable overscroll behavior on mobile to prevent gesture navigation
    if (typeof window !== 'undefined') {
      document.body.style.overscrollBehavior = 'none';
      document.documentElement.style.overscrollBehavior = 'none';
      // Prevent zoom on mobile
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      // Don't track if touch is on sidebar, navbar buttons, or interactive elements
      if (target.closest('[data-sidebar]') || 
          target.closest('button') || 
          target.closest('a') ||
          target.closest('input') ||
          target.closest('select')) {
        return;
      }
      
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartX.current || !touchStartY.current) return;
      
      const target = e.target as HTMLElement;
      // Don't block if touch is on sidebar, navbar buttons, or interactive elements
      if (target.closest('[data-sidebar]') || 
          target.closest('button') || 
          target.closest('a') ||
          target.closest('input') ||
          target.closest('select')) {
        return;
      }
      
      const touchEndX = e.touches[0].clientX;
      const touchEndY = e.touches[0].clientY;
      const deltaX = touchEndX - touchStartX.current;
      const deltaY = touchEndY - touchStartY.current;

      // If it's a horizontal swipe (more than 30px), prevent it from opening sidebar
      // Block both left swipes and right-edge swipes
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
        if (!isSidebarOpen) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    const handleTouchEnd = () => {
      touchStartX.current = null;
      touchStartY.current = null;
    };

    // Only add listeners on mobile viewports
    if (window.innerWidth < 768) {
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isSidebarOpen]);

  return (
    <header className={`w-full z-50 shadow-2xl backdrop-blur-xl fixed top-0 left-0 transition-all duration-300 ${
      theme === 'light' 
        ? 'bg-gradient-to-r from-white via-gray-50 to-white border-b-2 border-[#fe8002]/40' 
        : 'bg-gradient-to-r from-black via-[#0f0f0f] to-black border-b-2 border-[#fe8002]/30'
    }`}>
      {/* --- UNIFIED NAVBAR --- */}
      <nav className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <a href="/">
            <img
              src={theme === 'light' ? '/logo_white.png' : '/logo.png'}
              alt="Prime Computer Logo"
              className={`w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg hover:scale-110 transition-all duration-300 cursor-pointer ${
                theme === 'light'
                  ? 'border-2 border-[#fe8002]/60 shadow-[#fe8002]/40 hover:border-[#fe8002]'
                  : 'border-2 border-[#fe8002]/50 shadow-[#fe8002]/30 hover:border-[#fe8002]'
              }`}
            />
          </a>

          {/* Desktop Links */}
          <div className="hidden xl:flex items-center gap-6">
            <a href="/" className={`relative font-bold transition-colors group ${
              theme === 'light' ? 'text-gray-800 hover:text-[#fe8002]' : 'text-[#fe8002] hover:text-white'
            }`}>
              Accueil
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#fe8002] to-[#ff4500] group-hover:w-full transition-all duration-300" />
            </a>
            <a href="/hot-sales" className={`relative font-bold transition-colors group flex items-center gap-2 ${
              theme === 'light' ? 'text-gray-800 hover:text-[#fe8002]' : 'text-[#fe8002] hover:text-white'
            }`}>
              <div className="relative w-5 h-5 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-[#ff4500] via-[#fe8002] to-[#ffa500] rounded-full blur-sm opacity-60 group-hover:opacity-100 transition-all" />
                <FaFire className="text-lg relative z-10 group-hover:scale-110 transition-transform" />
              </div>
              Hot Sales
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
              Espace Entreprise
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
              className={`min-h-[44px] min-w-[44px] flex items-center justify-center text-xl md:text-2xl cursor-pointer hover:scale-125 transition-transform rounded-lg ${
                theme === 'light' ? 'text-gray-800 hover:text-[#fe8002] hover:bg-gray-100' : 'text-[#fe8002] hover:text-white hover:bg-[#1a1a1a]'
              }`}
              aria-label="Toggle theme"
              title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}
            >
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </button>
            
            <div className="relative group">
              <button onClick={handleProfileClick} className={`min-h-[44px] min-w-[44px] flex items-center justify-center text-xl md:text-2xl cursor-pointer hover:scale-125 transition-transform rounded-lg inline-flex ${
                theme === 'light' ? 'text-gray-800 hover:text-[#fe8002] hover:bg-gray-100' : 'text-[#fe8002] hover:bg-[#1a1a1a]'
              }`} title="Mon profil">
                <FaUser />
              </button>
            </div>
            <div className="relative">
              <a href="/wishlist" className={`relative inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-xl md:text-2xl cursor-pointer hover:scale-125 transition-transform rounded-lg ${
                theme === 'light' ? 'text-gray-800 hover:text-[#fe8002] hover:bg-gray-100' : 'text-[#fe8002] hover:bg-[#1a1a1a]'
              }`} title="Ma liste de souhaits">
                <FaRegHeart />
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
              <button onClick={toggleCart} className={`relative inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-xl md:text-2xl cursor-pointer hover:scale-125 transition-transform rounded-lg ${
                theme === 'light' ? 'text-gray-800 hover:text-[#fe8002] hover:bg-gray-100' : 'text-[#fe8002] hover:bg-[#1a1a1a]'
              }`} title="Mon panier">
                <FaShoppingCart />
                {getCartItemsCount() > 0 && (
                  <span className={`absolute -top-1 -right-1 bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-white text-xs font-extrabold w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center animate-pulse ${
                    theme === 'light' ? 'border-2 border-white' : 'border-2 border-black'
                  }`}>
                    {getCartItemsCount()}
                  </span>
                )}
              </button>
            </div>
            
            {/* Feedback Button */}
            <button
              onClick={() => setIsFeedbackOpen(true)}
              className={`min-h-[44px] min-w-[44px] flex items-center justify-center text-xl md:text-2xl cursor-pointer hover:scale-125 transition-transform rounded-lg ${
                theme === 'light' ? 'text-[#fe8002] hover:bg-orange-100' : 'text-[#fe8002] hover:bg-[#1a1a1a]'
              }`}
              title="Envoyer un commentaire"
            >
              <FaComments />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleSidebar}
              className={`xl:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-2xl cursor-pointer hover:scale-110 transition-transform rounded-lg ${
                theme === 'light' ? 'text-gray-800 hover:bg-gray-100' : 'text-[#fe8002] hover:bg-[#1a1a1a]'
              }`}
              aria-label="Toggle menu"
            >
              <FaBars />
            </button>
          </div>
        </div>
      </nav>

      {/* --- MOBILE SIDEBAR --- */}
      {/* Only render on mobile and when needed */}
      <div
        data-sidebar="true"
        className={`fixed top-0 right-0 h-screen w-72 shadow-2xl transform transition-transform duration-300 ease-in-out z-[9999] border-l-4 border-[#fe8002] overflow-y-auto ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } xl:hidden ${
          theme === 'light' 
            ? 'bg-gradient-to-br from-white via-gray-50 to-white' 
            : 'bg-gradient-to-br from-[#181818] via-[#1a1a1a] to-[#0f0f0f]'
        }`}
        style={{
          // Ensure sidebar stays completely off-screen when closed
          visibility: isSidebarOpen ? 'visible' : 'hidden',
          pointerEvents: isSidebarOpen ? 'auto' : 'none',
          touchAction: 'pan-y', // Only allow vertical scrolling
        }}
        // Prevent touch events on sidebar from bubbling
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
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
            href="/hot-sales"
            onClick={toggleSidebar}
            className={`font-bold transition-all py-3 px-5 rounded-xl hover:bg-gradient-to-r hover:from-[#fe8002] hover:to-[#ff4500] hover:text-white hover:shadow-lg hover:shadow-[#fe8002]/50 group ${
              theme === 'light' ? 'text-gray-800' : 'text-[#fe8002]'
            }`}
          >
            <span className="flex items-center gap-3">
              <span className="w-1 h-6 bg-gradient-to-b from-[#fe8002] to-[#ff4500] rounded-full group-hover:h-8 transition-all" />
              <div className="relative w-5 h-5 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-[#ff4500] via-[#fe8002] to-[#ffa500] rounded-full blur-sm opacity-50" />
                <FaFire className="relative z-10" />
              </div>
              Hot Sales
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

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      {/* Cart Component */}
      <Cart isOpen={isCartOpen} onClose={toggleCart} />
      
      {/* Wishlist Component */}
      <Wishlist isOpen={isWishlistOpen} onClose={toggleWishlist} />

      {/* Login Modal - Rendered via Portal */}
      {mounted && createPortal(
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onContinueAsGuest={handleContinueAsGuest}
          onLoginSuccess={handleLoginSuccess}
        />,
        document.body
      )}
    </header>
  );
};

export default Navbar;
