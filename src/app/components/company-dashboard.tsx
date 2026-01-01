"use client";

import { useState } from "react";
import { FaBuilding, FaShoppingCart, FaCog, FaPlus } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { useCompany } from "../context/CompanyContext";
import BulkOrderForm from "./bulk-order-form";

interface CompanyDashboardProps {
  companyId: string;
}

const CompanyDashboard = ({ companyId }: CompanyDashboardProps) => {
  const { theme } = useTheme();
  const { company, loading, refreshCompany } = useCompany();
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "settings">("overview");
  const [showBulkOrderForm, setShowBulkOrderForm] = useState(false);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'light' ? 'bg-gray-50' : 'bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a]'
      }`}>
        <div className="animate-spin">
          <FaShoppingCart className="text-4xl text-[#fe8002]" />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${
      theme === 'light' ? 'bg-gray-50' : 'bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a]'
    }`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <FaBuilding className="text-white text-4xl" />
            <div>
              <h1 className="text-white font-extrabold text-3xl uppercase tracking-wider">
                {company?.name || "Espace Entreprise"}
              </h1>
              <p className="text-white/90">Portail B2B - Gestion d'entreprise et commandes en gros</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Tabs */}
        <div className={`flex gap-2 mb-8 border-b ${
          theme === 'light' ? 'border-gray-200' : 'border-[#2a2a2a]'
        }`}>
          {[
            { id: 'overview' as const, label: 'Aperçu', icon: FaBuilding },
            { id: 'orders' as const, label: 'Commandes', icon: FaShoppingCart },
            { id: 'settings' as const, label: 'Paramètres', icon: FaCog },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-6 py-3 font-bold transition-all border-b-4 ${
                activeTab === id
                  ? 'border-[#fe8002] text-[#fe8002]'
                  : theme === 'light'
                  ? 'border-transparent text-gray-600 hover:text-gray-900'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Icon /> {label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && company && (
          <div className="space-y-6">
            {/* Company Info Card */}
            <div className={`rounded-lg border p-6 ${
              theme === 'light'
                ? 'bg-white border-gray-200'
                : 'bg-[#1a1a1a] border-[#2a2a2a]'
            }`}>
              <h2 className={`text-xl font-bold mb-4 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                Informations de l'Entreprise
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField label="Nom" value={company.name} theme={theme} />
                <InfoField label="Email" value={company.email} theme={theme} />
                <InfoField label="Téléphone" value={company.phone} theme={theme} />
                <InfoField label="Tax ID" value={company.tax_id} theme={theme} />
                {company.address && <InfoField label="Adresse" value={company.address} theme={theme} />}
                {company.city && <InfoField label="Ville" value={company.city} theme={theme} />}
                {company.website && <InfoField label="Site Web" value={company.website} theme={theme} />}
                <InfoField label="Contact" value={company.contact_person} theme={theme} />
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {showBulkOrderForm ? (
              <>
                <button
                  onClick={() => setShowBulkOrderForm(false)}
                  className={`px-4 py-2 rounded font-bold ${
                    theme === 'light'
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'
                  }`}
                >
                  ← Retour
                </button>
                <BulkOrderForm
                  onSuccess={() => {
                    setShowBulkOrderForm(false);
                    alert("Commande créée avec succès! En attente de confirmation.");
                  }}
                  onError={(error) => {
                    alert(`Erreur: ${error}`);
                  }}
                />
              </>
            ) : (
              <div className={`rounded-lg border p-6 text-center ${
                theme === 'light'
                  ? 'bg-white border-gray-200'
                  : 'bg-[#1a1a1a] border-[#2a2a2a]'
              }`}>
                <FaShoppingCart className={`text-5xl mx-auto mb-4 ${
                  theme === 'light' ? 'text-gray-400' : 'text-gray-600'
                }`} />
                <h3 className={`text-xl font-bold mb-2 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  Gestion des Commandes
                </h3>
                <p className={`mb-6 ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  Créez une nouvelle commande en gros pour votre entreprise.
                </p>
                <button
                  onClick={() => setShowBulkOrderForm(true)}
                  className="bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-[#fe8002]/50 transition-all flex items-center gap-2 mx-auto"
                >
                  <FaPlus /> Nouvelle Commande
                </button>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && company && (
          <div className={`rounded-lg border p-6 ${
            theme === 'light'
              ? 'bg-white border-gray-200'
              : 'bg-[#1a1a1a] border-[#2a2a2a]'
          }`}>
            <h2 className={`text-xl font-bold mb-4 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Paramètres de l'Entreprise
            </h2>
            <p className={`${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              Les paramètres de mise à jour seront bientôt disponibles.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Component
const InfoField = ({ label, value, theme }: { label: string; value: string; theme: string }) => (
  <div>
    <p className={`text-sm font-bold mb-1 ${
      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
    }`}>
      {label}
    </p>
    <p className={`font-medium ${
      theme === 'light' ? 'text-gray-900' : 'text-white'
    }`}>
      {value}
    </p>
  </div>
);

export default CompanyDashboard;
