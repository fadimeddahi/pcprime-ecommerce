"use client";

import { useState, useEffect } from "react";
import { FaBuilding, FaShoppingCart, FaFileInvoice, FaUsers, FaCog, FaPlus, FaArrowRight } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { companyApi, BulkOrder, type CompanyDashboard as CompanyDashboardType } from "../services/espaceSocietyApi";
import CompanyRegistrationModal from "./company-registration-modal";
import BulkOrderForm from "./bulk-order-form";
import FeedbackModal from "./feedback-modal";

interface CompanyDashboardProps {
  companyId?: string;
}

const CompanyDashboard = ({ companyId }: CompanyDashboardProps) => {
  const { theme } = useTheme();
  const [showRegistration, setShowRegistration] = useState(!companyId);
  const [dashboard, setDashboard] = useState<CompanyDashboardType | null>(null);
  const [isLoading, setIsLoading] = useState(!!companyId);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "invoices" | "team" | "settings">("overview");
  const [showBulkOrderForm, setShowBulkOrderForm] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  useEffect(() => {
    if (companyId) {
      loadDashboard();
    }
  }, [companyId]);

  const loadDashboard = async () => {
    if (!companyId) return;
    setIsLoading(true);
    try {
      const data = await companyApi.getDashboard(companyId);
      setDashboard(data);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement du tableau de bord");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationSuccess = (newCompanyId: string) => {
    setShowRegistration(false);
    // In a real app, would save company ID and reload
  };

  if (showRegistration) {
    return (
      <CompanyRegistrationModal
        isOpen={showRegistration}
        onClose={() => setShowRegistration(false)}
        onSuccess={handleRegistrationSuccess}
      />
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
            <h1 className="text-white font-extrabold text-3xl uppercase tracking-wider">
              Espace Entreprise
            </h1>
          </div>
          <p className="text-white/90">Portail B2B - Gestion d'entreprise et commandes en gros</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {error && (
          <div className={`mb-6 p-4 rounded-lg border ${
            theme === 'light'
              ? 'bg-red-50 border-red-200 text-red-600'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin">
              <FaShoppingCart className="text-4xl text-[#fe8002]" />
            </div>
          </div>
        ) : dashboard ? (
          <>
            {/* Tabs */}
            <div className={`flex gap-2 mb-8 border-b ${
              theme === 'light' ? 'border-gray-200' : 'border-[#2a2a2a]'
            }`}>
              {[
                { id: 'overview' as const, label: 'Aperçu', icon: FaBuilding },
                { id: 'orders' as const, label: 'Commandes', icon: FaShoppingCart },
                { id: 'invoices' as const, label: 'Factures', icon: FaFileInvoice },
                { id: 'team' as const, label: 'Équipe', icon: FaUsers },
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
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <StatCard
                    icon={FaShoppingCart}
                    label="Commandes"
                    value={dashboard.totalOrders}
                    color="#fe8002"
                    theme={theme}
                  />
                  <StatCard
                    icon={FaFileInvoice}
                    label="Factures en Attente"
                    value={dashboard.pendingInvoices}
                    color="#ff4500"
                    theme={theme}
                  />
                  <StatCard
                    icon={FaUsers}
                    label="Membres Équipe"
                    value={dashboard.teamMembers}
                    color="#6366f1"
                    theme={theme}
                  />
                  <StatCard
                    icon={FaBuilding}
                    label="Dépense Totale"
                    value={`${dashboard.totalSpent.toLocaleString()} DA`}
                    color="#10b981"
                    theme={theme}
                  />
                </div>

                {/* Recent Orders */}
                <div className={`rounded-lg border ${
                  theme === 'light'
                    ? 'bg-white border-gray-200'
                    : 'bg-[#1a1a1a] border-[#2a2a2a]'
                } p-6`}>
                  <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    <FaShoppingCart className="text-[#fe8002]" /> Commandes Récentes
                  </h2>
                  {dashboard.recentOrders.length > 0 ? (
                    <div className="space-y-3">
                      {dashboard.recentOrders.map((order) => (
                        <div
                          key={order.id}
                          className={`flex items-center justify-between p-4 rounded-lg border ${
                            theme === 'light'
                              ? 'bg-gray-50 border-gray-200'
                              : 'bg-[#0f0f0f] border-[#2a2a2a]'
                          }`}
                        >
                          <div>
                            <p className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                              {order.orderNumber}
                            </p>
                            <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                              {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold text-lg text-[#fe8002]`}>
                              {order.totalAmount.toLocaleString()} DA
                            </p>
                            <p className={`text-xs uppercase tracking-wide ${
                              order.status === 'delivered'
                                ? 'text-green-500'
                                : order.status === 'processing'
                                ? 'text-blue-500'
                                : 'text-yellow-500'
                            }`}>
                              {order.status}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={`text-center py-8 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      Aucune commande pour le moment
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <>
                {showBulkOrderForm ? (
                  <div>
                    <button
                      onClick={() => setShowBulkOrderForm(false)}
                      className={`mb-6 px-4 py-2 rounded-lg font-bold transition-colors ${
                        theme === 'light'
                          ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                          : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'
                      }`}
                    >
                      ← Retour
                    </button>
                    {companyId && (
                      <BulkOrderForm
                        companyId={companyId}
                        onSuccess={() => {
                          setShowBulkOrderForm(false);
                          loadDashboard();
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <div className={`rounded-lg border ${
                    theme === 'light'
                      ? 'bg-white border-gray-200'
                      : 'bg-[#1a1a1a] border-[#2a2a2a]'
                  } p-6`}>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        Commandes en Gros
                      </h2>
                      <button
                        onClick={() => setShowBulkOrderForm(true)}
                        className="bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-[#fe8002]/50"
                      >
                        <FaPlus /> Nouvelle Commande
                      </button>
                    </div>
                    <p className={`text-center py-8 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      Gérez vos commandes en gros, suivi des expéditions, et conditions spéciales
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Invoices Tab */}
            {activeTab === 'invoices' && (
              <div className={`rounded-lg border ${
                theme === 'light'
                  ? 'bg-white border-gray-200'
                  : 'bg-[#1a1a1a] border-[#2a2a2a]'
              } p-6`}>
                <h2 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  Factures
                </h2>
                <p className={`text-center py-8 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  Téléchargez, payez et gérez vos factures en un seul endroit
                </p>
              </div>
            )}

            {/* Team Tab */}
            {activeTab === 'team' && (
              <div className={`rounded-lg border ${
                theme === 'light'
                  ? 'bg-white border-gray-200'
                  : 'bg-[#1a1a1a] border-[#2a2a2a]'
              } p-6`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    Gestion de l'Équipe
                  </h2>
                  <button className="bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-[#fe8002]/50">
                    <FaPlus /> Inviter Membre
                  </button>
                </div>
                <p className={`text-center py-8 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  Ajoutez des membres d'équipe et gérez les permissions
                </p>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className={`rounded-lg border ${
                theme === 'light'
                  ? 'bg-white border-gray-200'
                  : 'bg-[#1a1a1a] border-[#2a2a2a]'
              } p-6 space-y-6`}>
                <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  Paramètres de l'Entreprise
                </h2>

                {/* Feedback Section */}
                <div className={`border rounded-lg p-6 ${
                  theme === 'light'
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-blue-900/20 border-blue-700'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">💬</span>
                    <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-blue-900' : 'text-blue-300'}`}>
                      Retour d'expérience
                    </h3>
                  </div>
                  <p className={`text-sm mb-4 ${theme === 'light' ? 'text-blue-700' : 'text-blue-400'}`}>
                    Partagez vos suggestions et votre expérience avec notre plateforme B2B
                  </p>
                  <button
                    onClick={() => setIsFeedbackOpen(true)}
                    className={`font-bold py-2 px-6 rounded-lg transition-all border ${
                      theme === 'light'
                        ? 'bg-blue-200 border-blue-400 text-blue-900 hover:bg-blue-300'
                        : 'bg-blue-700 border-blue-500 text-blue-100 hover:bg-blue-600'
                    }`}
                  >
                    Envoyer un avis
                  </button>
                </div>

                {/* Feedback Modal */}
                <FeedbackModal
                  isOpen={isFeedbackOpen}
                  onClose={() => setIsFeedbackOpen(false)}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              Pas de données disponibles
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color, theme }: any) => (
  <div className={`rounded-lg border p-6 ${
    theme === 'light'
      ? 'bg-white border-gray-200'
      : 'bg-[#1a1a1a] border-[#2a2a2a]'
  }`}>
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 rounded-lg" style={{ background: `${color}20` }}>
        <Icon style={{ color }} className="text-2xl" />
      </div>
    </div>
    <p className={`text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
      {label}
    </p>
    <p className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
      {value}
    </p>
  </div>
);

export default CompanyDashboard;
