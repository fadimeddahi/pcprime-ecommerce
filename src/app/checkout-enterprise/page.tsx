"use client";

import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { useTheme } from "../context/ThemeContext";
import Image from "next/image";
import { FaShoppingCart, FaBuilding, FaPhone, FaEnvelope, FaCheckCircle, FaIdCard, FaCity, FaUser } from "react-icons/fa";
import { companyOrderApi } from "../services/espaceSocietyApi";

const EnterpriseCheckoutPage = () => {
  const router = useRouter();
  const { cartItems, getCartTotal, clearCart, isEnterprise } = useCart();
  const { theme } = useTheme();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  // Redirect if not enterprise cart
  useEffect(() => {
    if (!isEnterprise && cartItems.length > 0) {
      router.push("/checkout");
    }
  }, [isEnterprise, cartItems.length, router]);
  
  const [formData, setFormData] = useState({
    // Company Info
    company_name: "",
    person_name: "",
    tax_id: "",
    nif: "",
    rc: "",
    art: "",
    nic: "",
    
    // Contact Info
    contact_person: "",
    contact_title: "",
    phone: "",
    email: "",
    
    // Address Info
    address: "",
    city: "",
    postal_code: "",
    country: "Algeria",
    
    // Additional Info
    website: "",
    registration_number: "",
    industry: "",
  });

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

    // Validation
    if (!formData.company_name.trim()) {
      setError("Le nom de l'entreprise est requis");
      setIsSubmitting(false);
      return;
    }
    if (!formData.person_name.trim()) {
      setError("Le nom de la personne est requis");
      setIsSubmitting(false);
      return;
    }
    if (!formData.tax_id.trim()) {
      setError("Le numéro fiscal est requis");
      setIsSubmitting(false);
      return;
    }
    if (!formData.nif.trim()) {
      setError("Le NIF est requis");
      setIsSubmitting(false);
      return;
    }
    if (!formData.contact_person.trim()) {
      setError("La personne de contact est requise");
      setIsSubmitting(false);
      return;
    }
    if (!formData.contact_title.trim()) {
      setError("Le titre du contact est requis");
      setIsSubmitting(false);
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Veuillez entrer une adresse email valide");
      setIsSubmitting(false);
      return;
    }
    if (!formData.phone.trim()) {
      setError("Le numéro de téléphone est requis");
      setIsSubmitting(false);
      return;
    }
    if (!formData.address.trim()) {
      setError("L'adresse est requise");
      setIsSubmitting(false);
      return;
    }
    if (!formData.city.trim()) {
      setError("La ville est requise");
      setIsSubmitting(false);
      return;
    }

    try {
      // Format cart items for backend
      const items = cartItems.map(item => ({
        product_id: String(item.uuid || item.id),
        quantity: item.quantity
      }));

      // Prepare order data according to backend API documentation
      const company_data: any = {
        company_name: formData.company_name,
        person_name: formData.person_name,
        tax_id: formData.tax_id,
        nif: formData.nif,
        contact_person: formData.contact_person,
        contact_title: formData.contact_title,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        postal_code: formData.postal_code || "",
        country: formData.country || "Algeria",
      };

      // Only add optional fields if they have values
      if (formData.rc) company_data.rc = formData.rc;
      if (formData.art) company_data.art = formData.art;
      if (formData.nic) company_data.nic = formData.nic;
      if (formData.postal_code) company_data.postal_code = formData.postal_code;
      if (formData.website) company_data.website = formData.website;
      if (formData.registration_number) company_data.registration_number = formData.registration_number;
      if (formData.industry) company_data.industry = formData.industry;

      const orderData = {
        company_data: company_data,
        cart_items: items
      };

      console.log('[Enterprise Order] Submitting order with data:', orderData);
      
      // Submit order to backend
      const response = await companyOrderApi.createOrder(orderData);
      
      console.log('[Enterprise Order] Order created:', response);
      
      // Clear cart from localStorage
      clearCart();
      
      // Show success message
      setOrderPlaced(true);
      
      // Redirect after 8 seconds
      setTimeout(() => {
        router.push("/");
      }, 8000);
      
    } catch (err: any) {
      // Extract detailed error information
      let errorMessage = "Une erreur s'est produite lors de la commande.";
      
      if (err.data) {
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
          try {
            errorMessage = JSON.stringify(err.data);
          } catch {
            errorMessage = "Erreur de format de réponse du serveur";
          }
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
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
            onClick={() => router.push("/espace-society")}
            className="bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-white font-extrabold py-4 px-10 text-lg rounded-2xl hover:scale-110 transition-all duration-300 shadow-2xl shadow-[#fe8002]/60 uppercase tracking-wide border-2 border-white/30"
          >
            Retour à l'espace entreprise
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
        <div className={`p-12 md:p-16 rounded-3xl border-4 shadow-2xl backdrop-blur-xl max-w-2xl text-center ${
          theme === 'light'
            ? 'border-green-500/40 bg-white shadow-green-500/30'
            : 'border-green-500/40 bg-gradient-to-br from-[#1a1a1a] via-[#181818] to-[#0f0f0f] shadow-green-500/20'
        }`}>
          <FaCheckCircle className="text-7xl md:text-8xl text-green-500 mb-6 mx-auto animate-bounce" />
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
            Commande Entreprise Envoyée !
          </h2>
          <p className={`text-lg md:text-xl mb-6 leading-relaxed ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Votre commande entreprise a été reçue avec succès.
          </p>
          <div className={`p-6 rounded-2xl border-2 border-green-500/30 mb-8 ${
            theme === 'light' ? 'bg-green-50' : 'bg-green-900/20'
          }`}>
            <p className={`text-base mb-2 font-semibold ${
              theme === 'light' ? 'text-gray-800' : 'text-white'
            }`}>
              📋 Prochaines étapes :
            </p>
            <p className={`text-sm leading-relaxed ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Notre équipe commerciale examinera votre commande et vous contactera sous peu pour confirmer les détails et finaliser la transaction.
            </p>
          </div>
          <p className={`text-sm mb-8 ${
            theme === 'light' ? 'text-gray-500' : 'text-gray-500'
          }`}>
            Redirection automatique dans quelques secondes...
          </p>
          <button 
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-white font-extrabold py-4 px-10 text-lg rounded-2xl hover:scale-110 transition-all duration-300 shadow-2xl shadow-[#fe8002]/60 uppercase tracking-wide border-2 border-white/30"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 px-4 relative overflow-hidden transition-all duration-300 ${
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
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] bg-clip-text text-transparent tracking-tight mb-4">
            Commande Entreprise
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] mx-auto mb-4 shadow-lg shadow-[#fe8002]/50" />
          <p className={`text-lg md:text-xl ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            Remplissez les informations de votre entreprise
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            {error && (
              <div className={`mb-6 p-5 rounded-2xl border-2 border-red-500/50 backdrop-blur-xl animate-pulse ${
                theme === 'light' 
                  ? 'bg-red-50 shadow-lg shadow-red-500/20' 
                  : 'bg-red-900/20 shadow-lg shadow-red-500/10'
              }`}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl flex-shrink-0">⚠️</span>
                  <div className="flex-1">
                    <p className="text-red-600 dark:text-red-400 font-bold text-lg mb-2">
                      Erreur de commande
                    </p>
                    <p className="text-red-500 dark:text-red-300 text-sm break-words leading-relaxed">
                      {error}
                    </p>
                    <div className="mt-3 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setError("")}
                        className="text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline"
                      >
                        Fermer
                      </button>
                      <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="text-xs font-bold px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-all"
                      >
                        Rafraîchir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Information */}
              <div className={`rounded-2xl p-6 md:p-8 border-2 border-[#fe8002]/30 shadow-2xl backdrop-blur-xl ${
                theme === 'light' ? 'bg-white shadow-[#fe8002]/20' : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] shadow-[#fe8002]/10'
              }`}>
                <div className="flex items-center gap-3 mb-6">
                  <FaBuilding className="text-[#fe8002] text-2xl" />
                  <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Informations de l'entreprise</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className={`text-sm font-bold mb-2 block uppercase tracking-wide ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                      Nom de l'entreprise *
                    </label>
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleInputChange}
                      required
                      className={`w-full border-2 border-[#fe8002]/40 rounded-xl px-4 py-3 focus:border-[#fe8002] focus:outline-none transition-all ${
                        theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white'
                      }`}
                      placeholder="Nom de votre entreprise"
                    />
                  </div>
                  
                  <div>
                    <label className={`text-sm font-bold mb-2 block uppercase tracking-wide ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                      Nom de la personne *
                    </label>
                    <input
                      type="text"
                      name="person_name"
                      value={formData.person_name}
                      onChange={handleInputChange}
                      required
                      className={`w-full border-2 border-[#fe8002]/40 rounded-xl px-4 py-3 focus:border-[#fe8002] focus:outline-none transition-all ${
                        theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white'
                      }`}
                      placeholder="Nom complet"
                    />
                  </div>
                  
                  <div>
                    <label className={`text-sm font-bold mb-2 block uppercase tracking-wide ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                      Numéro Fiscal *
                    </label>
                    <input
                      type="text"
                      name="tax_id"
                      value={formData.tax_id}
                      onChange={handleInputChange}
                      required
                      className={`w-full border-2 border-[#fe8002]/40 rounded-xl px-4 py-3 focus:border-[#fe8002] focus:outline-none transition-all ${
                        theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white'
                      }`}
                      placeholder="Numéro fiscal"
                    />
                  </div>
                  
                  <div>
                    <label className={`text-sm font-bold mb-2 block uppercase tracking-wide ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                      NIF *
                    </label>
                    <input
                      type="text"
                      name="nif"
                      value={formData.nif}
                      onChange={handleInputChange}
                      required
                      className={`w-full border-2 border-[#fe8002]/40 rounded-xl px-4 py-3 focus:border-[#fe8002] focus:outline-none transition-all ${
                        theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white'
                      }`}
                      placeholder="NIF"
                    />
                  </div>
                  
                  <div>
                    <label className={`text-sm font-bold mb-2 block uppercase tracking-wide ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                      RC
                    </label>
                    <input
                      type="text"
                      name="rc"
                      value={formData.rc}
                      onChange={handleInputChange}
                      className={`w-full border-2 border-[#fe8002]/40 rounded-xl px-4 py-3 focus:border-[#fe8002] focus:outline-none transition-all ${
                        theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white'
                      }`}
                      placeholder="RC (optionnel)"
                    />
                  </div>
                  
                  <div>
                    <label className={`text-sm font-bold mb-2 block uppercase tracking-wide ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                      ART
                    </label>
                    <input
                      type="text"
                      name="art"
                      value={formData.art}
                      onChange={handleInputChange}
                      className={`w-full border-2 border-[#fe8002]/40 rounded-xl px-4 py-3 focus:border-[#fe8002] focus:outline-none transition-all ${
                        theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white'
                      }`}
                      placeholder="ART (optionnel)"
                    />
                  </div>
                  
                  <div>
                    <label className={`text-sm font-bold mb-2 block uppercase tracking-wide ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                      NIC
                    </label>
                    <input
                      type="text"
                      name="nic"
                      value={formData.nic}
                      onChange={handleInputChange}
                      className={`w-full border-2 border-[#fe8002]/40 rounded-xl px-4 py-3 focus:border-[#fe8002] focus:outline-none transition-all ${
                        theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white'
                      }`}
                      placeholder="NIC (optionnel)"
                    />
                  </div>
                  
                  <div>
                    <label className={`text-sm font-bold mb-2 block uppercase tracking-wide ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                      Numéro d'enregistrement
                    </label>
                    <input
                      type="text"
                      name="registration_number"
                      value={formData.registration_number}
                      onChange={handleInputChange}
                      className={`w-full border-2 border-[#fe8002]/40 rounded-xl px-4 py-3 focus:border-[#fe8002] focus:outline-none transition-all ${
                        theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white'
                      }`}
                      placeholder="Numéro d'enregistrement (optionnel)"
                    />
                  </div>
                  
                  <div>
                    <label className={`text-sm font-bold mb-2 block uppercase tracking-wide ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                      Secteur d'activité
                    </label>
                    <input
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className={`w-full border-2 border-[#fe8002]/40 rounded-xl px-4 py-3 focus:border-[#fe8002] focus:outline-none transition-all ${
                        theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white'
                      }`}
                      placeholder="Secteur d'activité (optionnel)"
                    />
                  </div>
                  
                  <div>
                    <label className={`text-sm font-bold mb-2 block uppercase tracking-wide ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                      Site Web
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className={`w-full border-2 border-[#fe8002]/40 rounded-xl px-4 py-3 focus:border-[#fe8002] focus:outline-none transition-all ${
                        theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white'
                      }`}
                      placeholder="https://example.com (optionnel)"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className={`rounded-2xl p-6 md:p-8 border-2 border-[#fe8002]/30 shadow-2xl backdrop-blur-xl ${
                theme === 'light' ? 'bg-white shadow-[#fe8002]/20' : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] shadow-[#fe8002]/10'
              }`}>
                <div className="flex items-center gap-3 mb-6">
                  <FaUser className="text-[#fe8002] text-2xl" />
                  <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Informations de contact</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`text-sm font-bold mb-2 block uppercase tracking-wide ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                      Personne de contact *
                    </label>
                    <input
                      type="text"
                      name="contact_person"
                      value={formData.contact_person}
                      onChange={handleInputChange}
                      required
                      className={`w-full border-2 border-[#fe8002]/40 rounded-xl px-4 py-3 focus:border-[#fe8002] focus:outline-none transition-all ${
                        theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white'
                      }`}
                      placeholder="Nom du contact"
                    />
                  </div>
                  
                  <div>
                    <label className={`text-sm font-bold mb-2 block uppercase tracking-wide ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                      Titre du contact *
                    </label>
                    <input
                      type="text"
                      name="contact_title"
                      value={formData.contact_title}
                      onChange={handleInputChange}
                      required
                      className={`w-full border-2 border-[#fe8002]/40 rounded-xl px-4 py-3 focus:border-[#fe8002] focus:outline-none transition-all ${
                        theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white'
                      }`}
                      placeholder="Ex: Responsable achats"
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
                      placeholder="contact@entreprise.com"
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

              {/* Address Information */}
              <div className={`rounded-2xl p-6 md:p-8 border-2 border-[#fe8002]/30 shadow-2xl backdrop-blur-xl ${
                theme === 'light' ? 'bg-white shadow-[#fe8002]/20' : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] shadow-[#fe8002]/10'
              }`}>
                <div className="flex items-center gap-3 mb-6">
                  <FaCity className="text-[#fe8002] text-2xl" />
                  <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Adresse de l'entreprise</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className={`text-sm font-bold mb-2 block uppercase tracking-wide ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                      Adresse complète *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className={`w-full border-2 border-[#fe8002]/40 rounded-xl px-4 py-3 focus:border-[#fe8002] focus:outline-none transition-all ${
                        theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white'
                      }`}
                      placeholder="Adresse complète de l'entreprise"
                    />
                  </div>
                  
                  <div>
                    <label className={`text-sm font-bold mb-2 block uppercase tracking-wide ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                      Ville *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className={`w-full border-2 border-[#fe8002]/40 rounded-xl px-4 py-3 focus:border-[#fe8002] focus:outline-none transition-all ${
                        theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white'
                      }`}
                      placeholder="Ville"
                    />
                  </div>
                  
                  <div>
                    <label className={`text-sm font-bold mb-2 block uppercase tracking-wide ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                      Code postal
                    </label>
                    <input
                      type="text"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleInputChange}
                      className={`w-full border-2 border-[#fe8002]/40 rounded-xl px-4 py-3 focus:border-[#fe8002] focus:outline-none transition-all ${
                        theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white'
                      }`}
                      placeholder="Code postal (optionnel)"
                    />
                  </div>
                  
                  <div>
                    <label className={`text-sm font-bold mb-2 block uppercase tracking-wide ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                      Pays
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className={`w-full border-2 border-[#fe8002]/40 rounded-xl px-4 py-3 focus:border-[#fe8002] focus:outline-none transition-all ${
                        theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white'
                      }`}
                      placeholder="Algeria"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-2xl font-extrabold text-lg uppercase tracking-wide transition-all duration-300 shadow-2xl ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-white hover:scale-105 shadow-[#fe8002]/60 border-2 border-white/30'
                }`}
              >
                {isSubmitting ? 'Envoi en cours...' : 'Valider la commande'}
              </button>
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
                
                <div className={`text-xs p-3 rounded-lg border border-green-500/30 ${
                  theme === 'light' ? 'bg-green-50 text-green-700' : 'bg-green-900/20 text-green-300'
                }`}>
                  ✅ Livraison gratuite pour les commandes entreprise
                </div>
                
                <div className="h-0.5 bg-gradient-to-r from-transparent via-[#fe8002] to-transparent my-3 rounded-full" />
                
                <div className="flex justify-between items-center">
                  <span className={`font-extrabold text-xl ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Total:</span>
                  <span className="text-2xl font-extrabold bg-gradient-to-r from-[#fe8002] to-[#ff4500] bg-clip-text text-transparent">
                    {getCartTotal().toLocaleString('fr-DZ', { minimumFractionDigits: 0 })} DZD
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseCheckoutPage;
