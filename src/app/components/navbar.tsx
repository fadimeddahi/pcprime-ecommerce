"use client";

import { FaSearch, FaUser, FaRegHeart, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <header className="w-full z-50 bg-gradient-to-r from-black via-[#181818] to-black shadow-lg border-b-2 border-[#00d4ff]">
      {/* --- TOP NAVBAR --- */}
      <nav className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0 px-4 py-3 md:py-4">
        {/* Logo & Search */}
        <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-6 w-full md:w-auto">
          <img
            src="/logo.png"
            alt="Prime Computer Logo"
            className="w-14 h-14 md:w-24 md:h-24 drop-shadow-2xl rounded-full border-4 border-[#00d4ff] bg-[#232323] shadow-[#00d4ff]/50 shadow-lg"
          />

          <div className="flex items-center border-2 border-[#fe8002] rounded-full px-3 py-2 bg-[#232323] w-full md:w-72 shadow-md">
            <input
              type="text"
              placeholder="Rechercher un produit"
              className="outline-none bg-transparent text-[#fe8002] placeholder-[#fe8002] w-full text-sm md:text-base"
            />
            <FaSearch className="text-[#fe8002] ml-2 text-lg hover:scale-110 transition-transform cursor-pointer" />
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center justify-center space-x-5 md:space-x-6 mt-3 md:mt-0 w-full md:w-auto">
          <FaUser className="text-[#fe8002] text-xl md:text-2xl cursor-pointer hover:scale-110 transition-transform" />
          <FaRegHeart className="text-[#fe8002] text-xl md:text-2xl cursor-pointer hover:scale-110 transition-transform" />
          <FaShoppingCart className="text-[#fe8002] text-xl md:text-2xl cursor-pointer hover:scale-110 transition-transform" />
          
          {/* Mobile Menu Button */}
          <button 
            onClick={toggleSidebar}
            className="md:hidden text-[#fe8002] text-2xl cursor-pointer hover:scale-110 transition-transform"
            aria-label="Toggle menu"
          >
            <FaBars />
          </button>
        </div>
      </nav>

      {/* --- LINKS BAR (Desktop only) --- */}
      <div className="hidden md:block bg-[#181818] shadow-md">
        <div className="container mx-auto flex flex-wrap justify-center md:gap-6 text-sm md:text-base px-3 py-2">
          <a href="/" className="text-[#fe8002] font-semibold hover:text-white transition-colors">
            Accueil
          </a>
          <a href="/pc-builder" className="text-[#fe8002] font-semibold hover:text-white transition-colors">
            PC Builder
          </a>
          <a href="/espace-society" className="text-[#fe8002] font-semibold hover:text-white transition-colors">
            Espace Society
          </a>
          <a href="/zone-docassion" className="text-[#fe8002] font-semibold hover:text-white transition-colors">
            Zone d'occasion
          </a>
          <a href="/contact" className="text-[#fe8002] font-semibold hover:text-white transition-colors">
            Contact
          </a>
        </div>

        <div className="container mx-auto flex justify-center py-2 px-3">
          <select className="bg-[#232323] text-[#fe8002] border-2 border-[#fe8002] rounded-full px-3 py-2 shadow focus:bg-[#181818] focus:text-white transition-all text-sm md:text-base w-full sm:w-auto">
            <option value="">Catégorie de produit</option>
            <option value="pc-portable">PC Portable</option>
            <option value="pc-bureau">PC Bureau</option>
            <option value="composants">Composants</option>
            <option value="accessoires">Accessoires</option>
            <option value="ecrans">Écrans</option>
            <option value="imprimantes">Imprimantes</option>
            <option value="reseau">Réseau</option>
            <option value="logiciels">Logiciels</option>
          </select>
        </div>
      </div>

      {/* --- MOBILE SIDEBAR --- */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#181818] shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex justify-between items-center p-4 border-b-2 border-[#fe8002]">
          <h2 className="text-[#fe8002] font-bold text-xl">Menu</h2>
          <button
            onClick={toggleSidebar}
            className="text-[#fe8002] text-2xl hover:scale-110 transition-transform"
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="flex flex-col p-4 space-y-4">
          <a
            href="/"
            onClick={toggleSidebar}
            className="text-[#fe8002] font-semibold hover:text-white transition-colors py-2 px-4 rounded hover:bg-[#232323]"
          >
            Accueil
          </a>
          <a
            href="/pc-builder"
            onClick={toggleSidebar}
            className="text-[#fe8002] font-semibold hover:text-white transition-colors py-2 px-4 rounded hover:bg-[#232323]"
          >
            PC Builder
          </a>
          <a
            href="/espace-society"
            onClick={toggleSidebar}
            className="text-[#fe8002] font-semibold hover:text-white transition-colors py-2 px-4 rounded hover:bg-[#232323]"
          >
            Espace Society
          </a>
          <a
            href="/zone-docassion"
            onClick={toggleSidebar}
            className="text-[#fe8002] font-semibold hover:text-white transition-colors py-2 px-4 rounded hover:bg-[#232323]"
          >
            Zone d'occasion
          </a>
          <a
            href="/contact"
            onClick={toggleSidebar}
            className="text-[#fe8002] font-semibold hover:text-white transition-colors py-2 px-4 rounded hover:bg-[#232323]"
          >
            Contact
          </a>

          <div className="pt-4 border-t border-[#fe8002]">
            <select className="bg-[#232323] text-[#fe8002] border-2 border-[#fe8002] rounded-full px-3 py-2 shadow focus:bg-[#181818] focus:text-white transition-all text-sm w-full">
              <option value="">Catégories</option>
              <option value="pc-portable">PC Portable</option>
              <option value="pc-bureau">PC Bureau</option>
              <option value="composants">Composants</option>
              <option value="accessoires">Accessoires</option>
              <option value="ecrans">Écrans</option>
              <option value="imprimantes">Imprimantes</option>
              <option value="reseau">Réseau</option>
              <option value="logiciels">Logiciels</option>
            </select>
          </div>
        </nav>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </header>
  );
};

export default Navbar;
