"use client";

import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAllCategories } from "../hooks/useProducts";
import FeedbackModal from "./feedback-modal";

const Footer = () => {
  const { theme } = useTheme();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const { data: categories = [] } = useAllCategories();
  
  return (
    <footer className={`border-t-2 shadow-2xl transition-all duration-300 ${
      theme === 'light'
        ? 'bg-gradient-to-b from-gray-50 via-white to-gray-100 border-[#fe8002]/40'
        : 'bg-gradient-to-b from-[#0f0f0f] via-[#0a0a0a] to-black border-[#fe8002]/30'
    }`}>
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div>
            <div className="flex items-center mb-6">
              <img
                src={theme === 'light' ? '/logo_white.png' : '/logo.png'}
                alt="Prime Computer Logo"
                className="w-20 h-20 rounded-full border-2 border-[#fe8002]/50 shadow-lg shadow-[#fe8002]/30 hover:border-[#fe8002] hover:scale-110 transition-all duration-300"
              />
              <h3 className="ml-4 text-2xl font-extrabold bg-gradient-to-r from-[#fe8002] to-[#ff4500] bg-clip-text text-transparent">Prime Computer</h3>
            </div>
            <p className={`text-sm leading-relaxed ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              Votre destination pour des ordinateurs et composants de haute qualité. 
              Nous offrons les meilleures solutions informatiques pour tous vos besoins.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-[#fe8002] to-[#ff4500] rounded-full" />
              <h4 className="text-[#fe8002] font-bold text-lg">Liens Rapides</h4>
            </div>
            <ul className="space-y-3">
              <li>
                <a href="/" className={`hover:text-[#fe8002] transition-all text-sm flex items-center group ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  <span className="w-0 h-0.5 bg-[#fe8002] mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300" />
                  Accueil
                </a>
              </li>
              <li>
                <a href="/hot-sales" className={`hover:text-[#fe8002] transition-all text-sm flex items-center group ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  <span className="w-0 h-0.5 bg-[#fe8002] mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300" />
                  Promotions
                </a>
              </li>
              <li>
                <a href="/zone-docassion" className={`hover:text-[#fe8002] transition-all text-sm flex items-center group ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  <span className="w-0 h-0.5 bg-[#fe8002] mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300" />
                  Zone d'Occasion
                </a>
              </li>
              <li>
                <a href="/pc-builder" className={`hover:text-[#fe8002] transition-all text-sm flex items-center group ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  <span className="w-0 h-0.5 bg-[#fe8002] mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300" />
                  PC Builder
                </a>
              </li>
              <li>
                <a href="/espace-society" className={`hover:text-[#fe8002] transition-all text-sm flex items-center group ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  <span className="w-0 h-0.5 bg-[#fe8002] mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300" />
                  Espace Entreprise
                </a>
              </li>
              <li>
                <a href="/contact" className={`hover:text-[#fe8002] transition-all text-sm flex items-center group ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  <span className="w-0 h-0.5 bg-[#fe8002] mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300" />
                  Contact
                </a>
              </li>
              <li>
                <button 
                  onClick={() => setIsFeedbackOpen(true)}
                  className={`hover:text-[#fe8002] transition-all text-sm flex items-center group w-full text-left ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                  <span className="w-0 h-0.5 bg-[#fe8002] mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300" />
                  Feedback
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-[#fe8002] to-[#ff4500] rounded-full" />
              <h4 className="text-[#fe8002] font-bold text-lg">Catégories</h4>
            </div>
            <ul className="space-y-3">
              {categories.slice(0, 5).map((category) => (
                <li key={category.id}>
                  <a 
                    href="/#products" 
                    className={`hover:text-[#fe8002] transition-all text-sm flex items-center group ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}
                  >
                    <span className="w-0 h-0.5 bg-[#fe8002] mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300" />
                    {category.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-[#fe8002] to-[#ff4500] rounded-full" />
              <h4 className="text-[#fe8002] font-bold text-lg">Contactez-nous</h4>
            </div>
            <ul className="space-y-4">
              <li className={`flex items-start text-sm hover:text-[#fe8002] transition-colors group ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                <FaMapMarkerAlt className="text-[#fe8002] mt-1 mr-3 flex-shrink-0 group-hover:scale-125 transition-transform" />
                <span>123 Rue Didouche Mourad, Alger, Algérie</span>
              </li>
              <li className={`flex items-center text-sm hover:text-[#fe8002] transition-colors group ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                <FaPhone className="text-[#fe8002] mr-3 group-hover:scale-125 transition-transform" />
                <span>+213 21 123 456</span>
              </li>
              <li className={`flex items-center text-sm hover:text-[#fe8002] transition-colors group ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                <FaEnvelope className="text-[#fe8002] mr-3 group-hover:scale-125 transition-transform" />
                <span>contact@primecomputer.dz</span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="mt-8">
              <h5 className={`font-bold text-sm mb-4 ${
                theme === 'light' ? 'text-gray-800' : 'text-white'
              }`}>Suivez-nous</h5>
              <div className="flex space-x-4">
                <a href="#" className={`text-[#fe8002] hover:text-white transition-all p-2 rounded-lg hover:bg-gradient-to-r hover:from-[#fe8002] hover:to-[#ff4500] hover:scale-110 transform duration-300 shadow-lg ${
                  theme === 'light' ? 'bg-gray-100' : 'bg-[#1a1a1a]'
                }`}>
                  <FaFacebook size={20} />
                </a>
                <a href="#" className={`text-[#fe8002] hover:text-white transition-all p-2 rounded-lg hover:bg-gradient-to-r hover:from-[#fe8002] hover:to-[#ff4500] hover:scale-110 transform duration-300 shadow-lg ${
                  theme === 'light' ? 'bg-gray-100' : 'bg-[#1a1a1a]'
                }`}>
                  <FaInstagram size={20} />
                </a>
                <a href="#" className={`text-[#fe8002] hover:text-white transition-all p-2 rounded-lg hover:bg-gradient-to-r hover:from-[#fe8002] hover:to-[#ff4500] hover:scale-110 transform duration-300 shadow-lg ${
                  theme === 'light' ? 'bg-gray-100' : 'bg-[#1a1a1a]'
                }`}>
                  <FaLinkedin size={20} />
                </a>
                <a href="#" className={`text-[#fe8002] hover:text-white transition-all p-2 rounded-lg hover:bg-gradient-to-r hover:from-[#fe8002] hover:to-[#ff4500] hover:scale-110 transform duration-300 shadow-lg ${
                  theme === 'light' ? 'bg-gray-100' : 'bg-[#1a1a1a]'
                }`}>
                  <FaTwitter size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`border-t mt-12 pt-8 ${
          theme === 'light' ? 'border-gray-200' : 'border-[#fe8002]/20'
        }`}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className={`text-sm text-center md:text-left font-medium ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              © 2025 <span className="text-[#fe8002] font-bold">Prime Computer</span>. Tous droits réservés.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="/contact" className={`hover:text-[#fe8002] transition-colors text-sm font-medium relative group ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                Politique de confidentialité
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#fe8002] group-hover:w-full transition-all duration-300" />
              </a>
              <a href="/contact" className={`hover:text-[#fe8002] transition-colors text-sm font-medium relative group ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                Conditions d'utilisation
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#fe8002] group-hover:w-full transition-all duration-300" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </footer>
  );
};

export default Footer;
