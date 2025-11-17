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
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Algeria",
    taxId: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.email.includes("@") || !formData.phone.trim()) {
      setError("Tous les champs sont requis");
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
            <h1 className="text-white font-bold text-sm uppercase">Espace Société</h1>
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
            <form onSubmit={handleSubmit} className="space-y-2">
              <div>
                <label className={`text-xs font-bold block mb-0.5 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Nom *
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
                    CP
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

              <div>
                <label className={`text-xs font-bold block mb-0.5 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  NIF
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

              {error && <div className={`p-1.5 rounded text-xs ${theme === 'light' ? 'bg-red-100 text-red-600' : 'bg-red-500/10 text-red-400'}`}>{error}</div>}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-1 rounded font-bold text-xs text-white transition-all ${isLoading ? 'bg-gray-400' : 'bg-gradient-to-r from-[#fe8002] to-[#ff4500] hover:shadow-lg hover:shadow-[#fe8002]/50'}`}
              >
                {isLoading ? <div className="flex items-center justify-center gap-1"><FaSpinner className="animate-spin text-xs" /> Création...</div> : "Créer"}
              </button>

              <button
                type="button"
                onClick={onClose}
                className={`w-full py-1 rounded font-bold text-xs border-2 transition-all ${theme === 'light' ? 'bg-white text-gray-700 border-gray-300' : 'bg-[#0f0f0f] text-white border-gray-600'}`}
              >
                Annuler
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistrationModal;
