"use client";

import { useTheme } from "../context/ThemeContext";
import { FaBuilding } from "react-icons/fa";
import Products from "../components/products";

export default function EspaceEntreprisePage() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${
      theme === 'light' ? 'bg-gray-50' : 'bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a]'
    }`}>
      {/* Enterprise Header Banner */}
      <div className="bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] py-6 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
              <FaBuilding className="text-white text-3xl" />
            </div>
            <div>
              <h1 className="text-white font-extrabold text-3xl uppercase tracking-wider">
                Espace Entreprise
              </h1>
              <p className="text-white/90 text-sm font-medium mt-1">
                Commandes en gros • Prix préférentiels • Livraison prioritaire
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className={`border-b-2 border-[#fe8002]/20 ${
        theme === 'light' ? 'bg-blue-50' : 'bg-blue-900/10'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <p className={`text-sm font-bold ${
            theme === 'light' ? 'text-blue-900' : 'text-blue-300'
          }`}>
            ℹ️ Lors de votre commande, vous fournirez vos informations d'entreprise (NIF, RC, etc.) pour bénéficier de nos tarifs professionnels
          </p>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto">
        <Products isEnterprise={true} />
      </div>
    </div>
  );
}
