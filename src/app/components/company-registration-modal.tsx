"use client";

import { useState } from "react";
import { FaTimes, FaBuilding, FaSpinner, FaCheck } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { companyApi, CompanyRegistrationRequest } from "../services/espaceSocietyApi";

interface CompanyRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (companyId: string) => void;
}

const CompanyRegistrationModal = ({ isOpen, onClose, onSuccess }: CompanyRegistrationModalProps) => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    // Company Info
    name: "",
    email: "",
    phone: "",
    website: "",
    
    // Legal Info
    taxId: "",
    registrationNumber: "",
    
    // Address Info
    address: "",
    city: "",
    postalCode: "",
    country: "Algeria",
    
    // Contact Person
    contactPerson: "",
    contactTitle: "",
    
    // Business Info
    industry: "",
    employeeCount: "",
    annualRevenue: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.email.includes("@") || !formData.phone.trim() || !formData.contactPerson.trim() || !formData.taxId.trim()) {
      setError("Les champs marqués * sont requis");
      return;
    }

    setIsLoading(true);
    try {
      const response = await companyApi.registerCompany(formData as CompanyRegistrationRequest);
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.(response.company?.id || "");
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Erreur d'enregistrement");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2">
      <div className={`absolute inset-0 backdrop-blur-lg ${theme === 'light' ? 'bg-black/60' : 'bg-black/90'}`} onClick={onClose} />

      <div className={`relative z-10 w-full max-w-xs rounded-xl border-3 border-[#fe8002] shadow-lg shadow-[#fe8002]/50 ${
        theme === 'light' ? 'bg-white' : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]'
      }`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-[#fe8002] to-[#ff4500] p-3">
          <div className="flex items-center gap-1.5 justify-center">
            <FaBuilding className="text-white text-lg" />
            <h1 className="text-white font-bold text-sm uppercase">Espace Entreprise</h1>
          </div>
        </div>

        <button onClick={onClose} className={`absolute top-2 right-2 z-10 text-sm ${theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'}`}>
          <FaTimes />
        </button>

        {/* Content */}
        <div className="p-3">
          {success ? (
            <div className="text-center py-4">
              <FaCheck className="text-2xl text-green-500 mx-auto mb-2" />
              <p className={`font-bold text-xs ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                ✅ Créée!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2 max-h-[70vh] overflow-y-auto scrollbar-hide">
              {/* Company Basic Info */}
              <div className="border-b border-[#fe8002]/20 pb-2 mb-2">
                <p className={`text-xs font-bold mb-1.5 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>📋 Informations Entreprise</p>
              </div>
              
              <div>
                <label className={`text-xs font-bold block mb-0.5 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Nom de l'Entreprise *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="PCPrime SARL"
                  className={`w-full px-2 py-1 border-2 rounded text-xs ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-900' : 'bg-[#0f0f0f] border-[#2a2a2a] text-white'} outline-none focus:border-[#fe8002]`}
                />
              </div>

              <div>
                <label className={`text-xs font-bold block mb-0.5 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="contact@entreprise.dz"
                  className={`w-full px-2 py-1 border-2 rounded text-xs ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-900' : 'bg-[#0f0f0f] border-[#2a2a2a] text-white'} outline-none focus:border-[#fe8002]`}
                />
              </div>

              <div>
                <label className={`text-xs font-bold block mb-0.5 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Téléphone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+213 21 123 456"
                  className={`w-full px-2 py-1 border-2 rounded text-xs ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-900' : 'bg-[#0f0f0f] border-[#2a2a2a] text-white'} outline-none focus:border-[#fe8002]`}
                />
              </div>

              <div>
                <label className={`text-xs font-bold block mb-0.5 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Site Web
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://exemple.dz"
                  className={`w-full px-2 py-1 border-2 rounded text-xs ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-900' : 'bg-[#0f0f0f] border-[#2a2a2a] text-white'} outline-none focus:border-[#fe8002]`}
                />
              </div>

              {/* Legal Info */}
              <div className="border-b border-[#fe8002]/20 pb-2 mb-2 mt-2">
                <p className={`text-xs font-bold mb-1.5 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>📜 Infos Légales</p>
              </div>

              <div>
                <label className={`text-xs font-bold block mb-0.5 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  NIF *
                </label>
                <input
                  type="text"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleInputChange}
                  placeholder="123456789012345"
                  className={`w-full px-2 py-1 border-2 rounded text-xs ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-900' : 'bg-[#0f0f0f] border-[#2a2a2a] text-white'} outline-none focus:border-[#fe8002]`}
                />
              </div>

              <div>
                <label className={`text-xs font-bold block mb-0.5 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Numéro d'Immatriculation
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  placeholder="987654321"
                  className={`w-full px-2 py-1 border-2 rounded text-xs ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-900' : 'bg-[#0f0f0f] border-[#2a2a2a] text-white'} outline-none focus:border-[#fe8002]`}
                />
              </div>

              {/* Address Info */}
              <div className="border-b border-[#fe8002]/20 pb-2 mb-2 mt-2">
                <p className={`text-xs font-bold mb-1.5 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>📍 Adresse</p>
              </div>

              <div>
                <label className={`text-xs font-bold block mb-0.5 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Adresse
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Rue de l'Industrie"
                  className={`w-full px-2 py-1 border-2 rounded text-xs ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-900' : 'bg-[#0f0f0f] border-[#2a2a2a] text-white'} outline-none focus:border-[#fe8002]`}
                />
              </div>

              <div className="grid grid-cols-2 gap-1">
                <div>
                  <label className={`text-xs font-bold block mb-0.5 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                    Ville
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Alger"
                    className={`w-full px-2 py-1 border-2 rounded text-xs ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-900' : 'bg-[#0f0f0f] border-[#2a2a2a] text-white'} outline-none focus:border-[#fe8002]`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-bold block mb-0.5 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                    Code Postal
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="16000"
                    className={`w-full px-2 py-1 border-2 rounded text-xs ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-900' : 'bg-[#0f0f0f] border-[#2a2a2a] text-white'} outline-none focus:border-[#fe8002]`}
                  />
                </div>
              </div>

              {/* Contact Person */}
              <div className="border-b border-[#fe8002]/20 pb-2 mb-2 mt-2">
                <p className={`text-xs font-bold mb-1.5 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>👤 Personne de Contact</p>
              </div>

              <div>
                <label className={`text-xs font-bold block mb-0.5 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Nom Complet *
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  placeholder="Jean Dupont"
                  className={`w-full px-2 py-1 border-2 rounded text-xs ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-900' : 'bg-[#0f0f0f] border-[#2a2a2a] text-white'} outline-none focus:border-[#fe8002]`}
                />
              </div>

              <div>
                <label className={`text-xs font-bold block mb-0.5 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Fonction
                </label>
                <input
                  type="text"
                  name="contactTitle"
                  value={formData.contactTitle}
                  onChange={handleInputChange}
                  placeholder="Directeur Général / Manager"
                  className={`w-full px-2 py-1 border-2 rounded text-xs ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-900' : 'bg-[#0f0f0f] border-[#2a2a2a] text-white'} outline-none focus:border-[#fe8002]`}
                />
              </div>

              {/* Business Info */}
              <div className="border-b border-[#fe8002]/20 pb-2 mb-2 mt-2">
                <p className={`text-xs font-bold mb-1.5 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>💼 Secteur d'Activité</p>
              </div>

              <div>
                <label className={`text-xs font-bold block mb-0.5 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Secteur
                </label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  placeholder="Informatique, Distribution, Services..."
                  className={`w-full px-2 py-1 border-2 rounded text-xs ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-900' : 'bg-[#0f0f0f] border-[#2a2a2a] text-white'} outline-none focus:border-[#fe8002]`}
                />
              </div>

              <div className="grid grid-cols-2 gap-1">
                <div>
                  <label className={`text-xs font-bold block mb-0.5 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                    Effectif
                  </label>
                  <select
                    name="employeeCount"
                    value={formData.employeeCount}
                    onChange={handleInputChange}
                    className={`w-full px-2 py-1 border-2 rounded text-xs ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-900' : 'bg-[#0f0f0f] border-[#2a2a2a] text-white'} outline-none focus:border-[#fe8002]`}
                  >
                    <option value="">--</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="200+">200+</option>
                  </select>
                </div>
                <div>
                  <label className={`text-xs font-bold block mb-0.5 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                    CA Annuel
                  </label>
                  <select
                    name="annualRevenue"
                    value={formData.annualRevenue}
                    onChange={handleInputChange}
                    className={`w-full px-2 py-1 border-2 rounded text-xs ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-900' : 'bg-[#0f0f0f] border-[#2a2a2a] text-white'} outline-none focus:border-[#fe8002]`}
                  >
                    <option value="">--</option>
                    <option value="<1M">&lt;1M DA</option>
                    <option value="1-5M">1-5M DA</option>
                    <option value="5-10M">5-10M DA</option>
                    <option value="10M+">10M+ DA</option>
                  </select>
                </div>
              </div>

              {error && <div className={`p-1.5 rounded text-xs ${theme === 'light' ? 'bg-red-100 text-red-600' : 'bg-red-500/10 text-red-400'}`}>{error}</div>}

              <div className="flex gap-1 pt-2 border-t border-[#fe8002]/10">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 py-1.5 rounded font-bold text-xs text-white transition-all ${isLoading ? 'bg-gray-400' : 'bg-gradient-to-r from-[#fe8002] to-[#ff4500] hover:shadow-lg hover:shadow-[#fe8002]/50'}`}
                >
                  {isLoading ? <div className="flex items-center justify-center gap-1"><FaSpinner className="animate-spin text-xs" /> ...</div> : "Créer"}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className={`flex-1 py-1.5 rounded font-bold text-xs border-2 transition-all ${theme === 'light' ? 'bg-white text-gray-700 border-gray-300' : 'bg-[#0f0f0f] text-white border-gray-600'}`}
                >
                  Annuler
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistrationModal;
