"use client";

import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { useTheme } from "../context/ThemeContext";
import Image from "next/image";
import { FaShoppingCart, FaUser, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCheckCircle, FaTruck } from "react-icons/fa";
import { orderApi, authApi } from "../services/api";
import FeedbackModal from "./feedback-modal";

const CheckoutPage = () => {
  const router = useRouter();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { theme } = useTheme();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  
  useEffect(() => {
    setIsAuthenticated(authApi.isAuthenticated());
  }, []);
  
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    
    // Shipping Address
    commune: "",
    wilaya: "",
  });

  const wilayas = [
    "Alger", "Oran", "Constantine", "Annaba", "Blida", "Batna", "Sétif", 
    "Tizi Ouzou", "Béjaïa", "Tlemcen", "Biskra", "Ouargla", "Boumerdès",
    // Add more wilayas as needed
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Format cart items for backend
      const cart_items = cartItems.map(item => ({
        product_id: Number(item.id),
        quantity: item.quantity
      }));

      // Prepare order data
      const orderData = {
        phone_number: formData.phone,
        email: formData.email,
        willaya: formData.wilaya,
        commune: formData.commune,
        full_name: `${formData.firstName} ${formData.lastName}`.trim(),
        notes: "",  // Empty string as per backend requirements
        cart_items: cart_items
      };

      // Submit order to backend
      const response = await orderApi.createOrder(orderData);
      
      // Clear cart from localStorage
      clearCart();
      
      // Show success message
      setOrderPlaced(true);
      
      // Redirect after 5 seconds
      setTimeout(() => {
        router.push("/");
      }, 5000);
      
    } catch (err: any) {
      // Extract detailed error information
      let errorMessage = "Une erreur s'est produite lors de la commande.";
      
      if (err.data) {
        // Backend returned structured error data
        
        if (err.data.message) {
          errorMessage = err.data.message;
        } else if (err.data.error) {
          errorMessage = typeof err.data.error === 'string' 
            ? err.data.error 
            : JSON.stringify(err.data.error);
        } else if (err.data.details) {
          errorMessage = typeof err.data.details === 'string'
            ? err.data.details
            : JSON.stringify(err.data.details);
        } else {
          // Try to stringify entire data object
          try {
            errorMessage = JSON.stringify(err.data);
          } catch {
            errorMessage = "Erreur de format de réponse du serveur";
          }
        }
      } else if (err.message) {
        // Standard error message
        errorMessage = err.message;
      }
      
      // Add status code if available
      if (err.status) {
        errorMessage = `[Erreur ${err.status}] ${errorMessage}`;
      }
      
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-4 relative overflow-hidden transition-all duration-300 ${
        theme === 'light' ? 'bg-gradient-to-br from-gray-50 via-white to-gray-100' : 'bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a]'
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
        <div className={`p-12 md:p-16 rounded-3xl border-4 border-[#fe8002]/40 shadow-2xl backdrop-blur-xl max-w-2xl text-center ${
          theme === 'light' 
            ? 'bg-white shadow-[#fe8002]/30' 
            : 'bg-gradient-to-br from-[#1a1a1a] via-[#181818] to-[#0f0f0f] shadow-[#fe8002]/20'
        }`}>
          <FaShoppingCart className="text-7xl md:text-8xl text-[#fe8002] mb-6 mx-auto" />
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 bg-gradient-to-r from-[#fe8002] to-[#ff4500] bg-clip-text text-transparent">
            Votre panier est vide
          </h2>
          <p className={`text-lg md:text-xl mb-8 leading-relaxed ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Ajoutez des produits avant de passer commande
          </p>
          <button 
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-white font-extrabold py-4 px-10 text-lg rounded-2xl hover:scale-110 transition-all duration-300 shadow-2xl shadow-[#fe8002]/60 uppercase tracking-wide border-2 border-white/30"
          >
            Retour à la boutique
          </button>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-4 relative overflow-hidden transition-all duration-300 ${
        theme === 'light' ? 'bg-gradient-to-br from-gray-50 via-white to-gray-100' : 'bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a]'
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
        <div className={`p-12 md:p-16 rounded-3xl border-4 border-green-500/40 shadow-2xl backdrop-blur-xl max-w-2xl text-center ${
          theme === 'light' 
            ? 'bg-white shadow-green-500/30' 
            : 'bg-gradient-to-br from-[#1a1a1a] via-[#181818] to-[#0f0f0f] shadow-green-500/20'
        }`}>
          <FaCheckCircle className="text-7xl md:text-8xl text-green-500 mb-6 mx-auto animate-bounce" />
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            Commande confirmée !
          </h2>
          <p className={`text-lg md:text-xl mb-4 leading-relaxed ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Merci pour votre commande. Nous vous contacterons bientôt.
          </p>
          <p className={`text-sm mb-8 ${
            theme === 'light' ? 'text-gray-500' : 'text-gray-500'
          }`}>
            Redirection vers la boutique dans quelques secondes...
          </p>
          <button 
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-white font-extrabold py-4 px-10 text-lg rounded-2xl hover:scale-110 transition-all duration-300 shadow-2xl shadow-[#fe8002]/60 uppercase tracking-wide border-2 border-white/30"
          >
            Retour à la boutique
          </button>
          <button 
            onClick={() => setIsFeedbackOpen(true)}
            className={`mt-6 font-bold py-3 px-8 rounded-xl transition-all duration-300 border-2 ${
              theme === 'light'
                ? 'bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200'
                : 'bg-blue-900/30 border-blue-500 text-blue-300 hover:bg-blue-900/50'
            }`}
          >
            Partager votre avis
          </button>
        </div>

        {/* Feedback Modal */}
        <FeedbackModal
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-12 px-4 relative overflow-hidden transition-all duration-300 ${
      theme === 'light' ? 'bg-gradient-to-br from-gray-50 via-white to-gray-100' : 'bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a]'
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

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] bg-clip-text text-transparent tracking-tight mb-4">
            Finaliser la commande
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] mx-auto mb-4 shadow-lg shadow-[#fe8002]/50" />
          <p className={`text-lg font-bold ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>Complétez vos informations pour confirmer votre achat</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            {/* Global Error Display */}
            {error && (
              <div className={`mb-6 p-5 rounded-2xl border-2 border-red-500/50 backdrop-blur-xl animate-pulse ${
                theme === 'light' 
                  ? 'bg-red-50 shadow-lg shadow-red-500/20' 
                  : 'bg-red-950/30 shadow-lg shadow-red-500/10'
              }`}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl flex-shrink-0">⚠️</span>
                  <div className="flex-1">
                    <h3 className="text-red-600 dark:text-red-400 font-extrabold text-lg mb-2 uppercase tracking-wide">
                      Erreur de commande
                    </h3>
                    <p className={`text-sm leading-relaxed break-words ${
                      theme === 'light' ? 'text-red-700' : 'text-red-300'
                    }`}>
                      {error}
                    </p>
                    <button
                      type="button"
                      onClick={() => setError("")}
                      className="mt-3 text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className={`rounded-2xl p-6 md:p-8 border-2 border-[#fe8002]/30 shadow-2xl backdrop-blur-xl ${
                theme === 'light' ? 'bg-white shadow-[#fe8002]/20' : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] shadow-[#fe8002]/10'
              }`}>
                <div className="flex items-center gap-3 mb-6">
                  <FaUser className="text-[#fe8002] text-2xl" />
                  <h2 className="text-[#fe8002] font-bold text-xl uppercase tracking-wide">Informations personnelles</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`text-sm font-bold mb-2 block uppercase tracking-wide ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                      Prénom *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className={`w-full border-2 border-[#fe8002]/40 rounded-xl px-4 py-3 focus:border-[#fe8002] focus:outline-none transition-all ${
                        theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white'
                      }`}
                      placeholder="Votre prénom"
                    />
                  </div>
                  
                  <div>
                    <label className={`text-sm font-bold mb-2 block uppercase tracking-wide ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className={`w-full border-2 border-[#fe8002]/40 rounded-xl px-4 py-3 focus:border-[#fe8002] focus:outline-none transition-all ${
                        theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white'
                      }`}
                      placeholder="Votre nom"
                    />
                  </div>
                  
                  <div>
                    <label className={`text-sm font-bold mb-2 block uppercase tracking-wide ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full border-2 border-[#fe8002]/40 rounded-xl px-4 py-3 focus:border-[#fe8002] focus:outline-none transition-all ${
                        theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white'
                      }`}
                      placeholder="votre@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className={`text-sm font-bold mb-2 block uppercase tracking-wide ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className={`w-full border-2 border-[#fe8002]/40 rounded-xl px-4 py-3 focus:border-[#fe8002] focus:outline-none transition-all ${
                        theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white'
                      }`}
                      placeholder="0555 XX XX XX"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className={`rounded-2xl p-6 md:p-8 border-2 border-[#fe8002]/30 shadow-2xl backdrop-blur-xl ${
                theme === 'light' ? 'bg-white shadow-[#fe8002]/20' : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] shadow-[#fe8002]/10'
              }`}>
                <div className="flex items-center gap-3 mb-6">
                  <FaMapMarkerAlt className="text-[#fe8002] text-2xl" />
                  <h2 className="text-[#fe8002] font-bold text-xl uppercase tracking-wide">Adresse de livraison</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`text-sm font-bold mb-2 block uppercase tracking-wide ${
                        theme === 'light' ? 'text-gray-800' : 'text-white'
                      }`}>
                        Wilaya *
                      </label>
                      <select
                        name="wilaya"
                        value={formData.wilaya}
                        onChange={handleInputChange}
                        required
                        className={`w-full text-[#fe8002] border-2 border-[#fe8002]/40 rounded-xl px-4 py-3 focus:border-[#fe8002] focus:outline-none transition-all cursor-pointer font-bold ${
                          theme === 'light' ? 'bg-gray-50' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a]'
                        }`}
                      >
                        <option value="">Sélectionner...</option>
                        {wilayas.map((wilaya) => (
                          <option key={wilaya} value={wilaya}>{wilaya}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className={`text-sm font-bold mb-2 block uppercase tracking-wide ${
                        theme === 'light' ? 'text-gray-800' : 'text-white'
                      }`}>
                        Commune *
                      </label>
                      <input
                        type="text"
                        name="commune"
                        value={formData.commune}
                        onChange={handleInputChange}
                        required
                        className={`w-full border-2 border-[#fe8002]/40 rounded-xl px-4 py-3 focus:border-[#fe8002] focus:outline-none transition-all ${
                          theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white'
                        }`}
                        placeholder="Commune"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className={`rounded-2xl p-6 border-2 border-[#fe8002]/30 shadow-2xl backdrop-blur-xl sticky top-4 ${
              theme === 'light'
                ? 'bg-white shadow-[#fe8002]/20'
                : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] shadow-[#fe8002]/10'
            }`}>
              <h2 className="text-[#fe8002] font-bold text-xl uppercase tracking-wide mb-6">Récapitulatif</h2>
              
              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto scrollbar-hide">
                {cartItems.map((item) => (
                  <div key={item.id} className={`flex gap-3 p-3 rounded-xl border border-[#fe8002]/20 ${
                    theme === 'light'
                      ? 'bg-gray-50'
                      : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a]'
                  }`}>
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold text-sm line-clamp-1 ${
                        theme === 'light' ? 'text-gray-800' : 'text-white'
                      }`}>{item.name}</h3>
                      <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Qté: {item.quantity}</p>
                      <p className="text-[#fe8002] font-bold text-sm">
                        {(item.price * item.quantity).toLocaleString('fr-DZ', { minimumFractionDigits: 0 })} DZD
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t-2 border-[#fe8002]/20 pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className={`font-bold ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>Sous-total:</span>
                  <span className={`font-bold text-lg ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                    {getCartTotal().toLocaleString('fr-DZ', { minimumFractionDigits: 0 })} DZD
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FaTruck className={`text-sm ${isAuthenticated ? 'text-green-400' : 'text-[#fe8002]'}`} />
                    <span className={`font-bold ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>Livraison:</span>
                  </div>
                  {isAuthenticated ? (
                    <span className="text-green-400 font-bold">Gratuite (0 DZD)</span>
                  ) : (
                    <span className="text-[#fe8002] font-bold">500 DZD</span>
                  )}
                </div>
                
                {!isAuthenticated && (
                  <div className={`text-xs p-2 rounded-lg border border-[#fe8002]/30 ${
                    theme === 'light' ? 'bg-orange-50 text-orange-700' : 'bg-[#fe8002]/10 text-orange-300'
                  }`}>
                    💡 Connectez-vous pour bénéficier de la livraison gratuite !
                  </div>
                )}
                
                <div className="h-0.5 bg-gradient-to-r from-transparent via-[#fe8002] to-transparent my-3 rounded-full" />
                
                <div className="flex justify-between items-center">
                  <span className={`font-extrabold text-xl ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Total:</span>
                  <span className="text-2xl font-extrabold bg-gradient-to-r from-[#fe8002] to-[#ff4500] bg-clip-text text-transparent">
                    {(getCartTotal() + (isAuthenticated ? 0 : 500)).toLocaleString('fr-DZ', { minimumFractionDigits: 0 })} DZD
                  </span>
                </div>
              </div>
              
              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border-2 border-red-500/50 rounded-xl animate-pulse">
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 text-xl flex-shrink-0">⚠️</span>
                    <div className="flex-1">
                      <p className="text-red-500 font-bold text-sm mb-1">Erreur de commande</p>
                      <p className="text-red-400 text-xs break-words">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full mt-6 bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-black font-extrabold py-4 rounded-2xl hover:from-white hover:to-gray-200 transition-all duration-300 shadow-2xl shadow-[#fe8002]/60 hover:scale-105 uppercase tracking-wider border-2 border-white/30 relative overflow-hidden group ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative">{isSubmitting ? 'Traitement...' : 'Confirmer la commande'}</span>
              </button>
              
              <button
                onClick={() => router.push("/")}
                className={`w-full mt-3 font-bold py-3 rounded-xl border-2 border-[#fe8002]/40 hover:border-[#fe8002] transition-all duration-300 uppercase tracking-wide text-sm ${
                  theme === 'light'
                    ? 'bg-gray-100 text-[#fe8002] hover:bg-gray-200'
                    : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-[#fe8002]'
                }`}
              >
                ← Continuer mes achats
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
