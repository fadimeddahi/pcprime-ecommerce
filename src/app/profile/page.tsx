"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../context/ThemeContext";
import Image from "next/image";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaEdit, 
  FaSave, 
  FaTimes,
  FaShoppingBag,
  FaHeart,
  FaCog,
  FaSignOutAlt,
  FaCamera,
  FaLock
} from "react-icons/fa";

const ProfilePage = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "orders" | "settings">("info");
  
  const [profileData, setProfileData] = useState({
    name: "Ahmed Bensalah",
    email: "ahmed.bensalah@email.com",
    phone: "0555 12 34 56",
    address: "12 Rue Didouche Mourad",
    city: "Alger Centre",
    wilaya: "Alger",
    postalCode: "16000",
    avatar: "/hero.png", // Default avatar
  });

  const [editData, setEditData] = useState({ ...profileData });

  // Mock orders data
  const orders = [
    {
      id: "CMD-001",
      date: "2025-10-10",
      status: "Livré",
      total: 45000,
      items: 3,
    },
    {
      id: "CMD-002",
      date: "2025-10-05",
      status: "En cours",
      total: 125000,
      items: 2,
    },
    {
      id: "CMD-003",
      date: "2025-09-28",
      status: "Livré",
      total: 89000,
      items: 5,
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setProfileData({ ...editData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Livré":
        return "text-green-500 bg-green-500/10 border-green-500/30";
      case "En cours":
        return "text-[#fe8002] bg-[#fe8002]/10 border-[#fe8002]/30";
      case "Annulé":
        return "text-red-500 bg-red-500/10 border-red-500/30";
      default:
        return "text-gray-500 bg-gray-500/10 border-gray-500/30";
    }
  };

  return (
    <main className={`min-h-screen relative overflow-hidden transition-all duration-300 ${
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

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] bg-clip-text text-transparent mb-6 tracking-tight flex items-center justify-center gap-4">
              <FaUser className="text-[#fe8002]" />
              MON PROFIL
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[#fe8002] to-transparent mx-auto mb-6 shadow-lg shadow-[#fe8002]/50" />
            <p className="text-gray-400 text-xl max-w-2xl mx-auto font-semibold">
              Gérez vos informations personnelles et vos commandes
            </p>
          </div>

          {/* Profile Header Card */}
          <div className={`rounded-3xl p-8 mb-8 border-2 border-[#fe8002]/30 shadow-2xl ${
            theme === 'light' ? 'bg-white' : 'bg-gradient-to-br from-[#1a1a1a] via-[#181818] to-[#0f0f0f]'
          }`}>
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#fe8002] shadow-2xl shadow-[#fe8002]/50">
                  <Image
                    src={profileData.avatar}
                    alt={profileData.name}
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
                <button className="absolute bottom-0 right-0 bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-white p-3 rounded-full border-2 border-white shadow-xl hover:scale-110 transition-all">
                  <FaCamera />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className={`text-3xl font-extrabold mb-2 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {profileData.name}
                </h2>
                <p className="text-[#fe8002] font-bold text-lg mb-4">
                  {profileData.email}
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-[#fe8002]/20 ${
                    theme === 'light' ? 'bg-gray-100' : 'bg-[#0f0f0f]'
                  }`}>
                    <FaShoppingBag className="text-[#fe8002]" />
                    <span className={`font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>{orders.length} Commandes</span>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-[#fe8002]/20 ${
                    theme === 'light' ? 'bg-gray-100' : 'bg-[#0f0f0f]'
                  }`}>
                    <FaHeart className="text-[#fe8002]" />
                    <span className={`font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>12 Favoris</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-black font-bold px-6 py-3 rounded-xl hover:scale-105 transition-all shadow-lg shadow-[#fe8002]/50 border-2 border-white/30 flex items-center gap-2"
                >
                  <FaEdit />
                  {isEditing ? "Annuler" : "Modifier"}
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className={`flex gap-4 mb-8 p-2 rounded-2xl border-2 border-[#fe8002]/20 ${
            theme === 'light' ? 'bg-white' : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]'
          }`}>
            <button
              onClick={() => setActiveTab("info")}
              className={`flex-1 py-4 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === "info"
                  ? "bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-black shadow-lg"
                  : theme === 'light' ? "text-gray-700 hover:text-[#fe8002]" : "text-white hover:text-[#fe8002]"
              }`}
            >
              <FaUser />
              INFORMATIONS
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex-1 py-4 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === "orders"
                  ? "bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-black shadow-lg"
                  : theme === 'light' ? "text-gray-700 hover:text-[#fe8002]" : "text-white hover:text-[#fe8002]"
              }`}
            >
              <FaShoppingBag />
              MES COMMANDES
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex-1 py-4 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === "settings"
                  ? "bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-black shadow-lg"
                  : theme === 'light' ? "text-gray-700 hover:text-[#fe8002]" : "text-white hover:text-[#fe8002]"
              }`}
            >
              <FaCog />
              PARAMÈTRES
            </button>
          </div>

          {/* Tab Content */}
          <div className="relative z-10">
            {/* Personal Information Tab */}
            {activeTab === "info" && (
              <div className={`rounded-2xl p-8 border-2 border-[#fe8002]/30 shadow-2xl ${
                theme === 'light' ? 'bg-white' : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]'
              }`}>
                <div className="flex items-center gap-3 mb-6">
                  <FaUser className="text-[#fe8002] text-2xl" />
                  <h2 className="text-[#fe8002] font-bold text-2xl uppercase tracking-wide">
                    Informations Personnelles
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className={`text-sm font-bold mb-2 block uppercase tracking-wide flex items-center gap-2 ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                      <FaUser className="text-[#fe8002]" />
                      Nom complet
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={isEditing ? editData.name : profileData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full border-2 border-[#fe8002]/40 rounded-xl px-4 py-3 focus:border-[#fe8002] focus:outline-none transition-all ${
                        !isEditing && "opacity-70 cursor-not-allowed"
                      } ${
                        theme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white'
                      }`}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className={`text-sm font-bold mb-2 block uppercase tracking-wide flex items-center gap-2 ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                      <FaEnvelope className="text-[#fe8002]" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={isEditing ? editData.email : profileData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full border-2 border-[#fe8002]/40 rounded-xl px-4 py-3 focus:border-[#fe8002] focus:outline-none transition-all ${
                        !isEditing && "opacity-70 cursor-not-allowed"
                      } ${
                        theme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white'
                      }`}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className={`text-sm font-bold mb-2 block uppercase tracking-wide flex items-center gap-2 ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                      <FaPhone className="text-[#fe8002]" />
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={isEditing ? editData.phone : profileData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full border-2 border-[#fe8002]/40 rounded-xl px-4 py-3 focus:border-[#fe8002] focus:outline-none transition-all ${
                        !isEditing && "opacity-70 cursor-not-allowed"
                      } ${
                        theme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white'
                      }`}
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className={`text-sm font-bold mb-2 block uppercase tracking-wide flex items-center gap-2 ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                      <FaMapMarkerAlt className="text-[#fe8002]" />
                      Adresse
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={isEditing ? editData.address : profileData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full border-2 border-[#fe8002]/40 rounded-xl px-4 py-3 focus:border-[#fe8002] focus:outline-none transition-all ${
                        !isEditing && "opacity-70 cursor-not-allowed"
                      } ${
                        theme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white'
                      }`}
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className={`text-sm font-bold mb-2 block uppercase tracking-wide ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                      Commune
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={isEditing ? editData.city : profileData.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full border-2 border-[#fe8002]/40 rounded-xl px-4 py-3 focus:border-[#fe8002] focus:outline-none transition-all ${
                        !isEditing && "opacity-70 cursor-not-allowed"
                      } ${
                        theme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white'
                      }`}
                    />
                  </div>

                  {/* Wilaya */}
                  <div>
                    <label className={`text-sm font-bold mb-2 block uppercase tracking-wide ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                      Wilaya
                    </label>
                    <input
                      type="text"
                      name="wilaya"
                      value={isEditing ? editData.wilaya : profileData.wilaya}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full border-2 border-[#fe8002]/40 rounded-xl px-4 py-3 focus:border-[#fe8002] focus:outline-none transition-all ${
                        !isEditing && "opacity-70 cursor-not-allowed"
                      } ${
                        theme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white'
                      }`}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-black font-extrabold py-4 rounded-xl hover:scale-105 transition-all shadow-2xl shadow-[#fe8002]/60 border-2 border-white/30 flex items-center justify-center gap-2"
                    >
                      <FaSave />
                      ENREGISTRER LES MODIFICATIONS
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white font-extrabold py-4 rounded-xl hover:scale-105 transition-all shadow-lg shadow-red-500/60 border-2 border-white/30 flex items-center justify-center gap-2"
                    >
                      <FaTimes />
                      ANNULER
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="space-y-4">
                <div className={`rounded-2xl p-6 border-2 border-[#fe8002]/30 shadow-xl ${
                  theme === 'light' ? 'bg-white' : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]'
                }`}>
                  <div className="flex items-center gap-3 mb-6">
                    <FaShoppingBag className="text-[#fe8002] text-2xl" />
                    <h2 className="text-[#fe8002] font-bold text-2xl uppercase tracking-wide">
                      Historique des Commandes
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className={`p-6 rounded-xl border-2 border-[#fe8002]/20 hover:border-[#fe8002] transition-all ${
                          theme === 'light' ? 'bg-gray-50' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a]'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <span className="text-[#fe8002] font-extrabold text-xl">
                                {order.id}
                              </span>
                              <span className={`px-4 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm">
                              Date: <span className="text-white font-semibold">{order.date}</span>
                            </p>
                            <p className="text-gray-400 text-sm">
                              Articles: <span className="text-white font-semibold">{order.items}</span>
                            </p>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-gray-400 text-sm mb-1">Total</p>
                              <p className="text-2xl font-extrabold bg-gradient-to-r from-[#fe8002] to-[#ff4500] bg-clip-text text-transparent">
                                {order.total.toLocaleString('fr-DZ', { minimumFractionDigits: 0 })} DZD
                              </p>
                            </div>
                            <button className="bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-black font-bold px-6 py-3 rounded-xl hover:scale-105 transition-all shadow-lg border-2 border-white/20">
                              DÉTAILS
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                {/* Security */}
                <div className={`rounded-2xl p-8 border-2 border-[#fe8002]/30 shadow-2xl ${
                  theme === 'light' ? 'bg-white' : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]'
                }`}>
                  <div className="flex items-center gap-3 mb-6">
                    <FaLock className="text-[#fe8002] text-2xl" />
                    <h2 className="text-[#fe8002] font-bold text-2xl uppercase tracking-wide">
                      Sécurité
                    </h2>
                  </div>

                  <button className={`w-full font-bold py-4 px-6 rounded-xl border-2 border-[#fe8002]/40 hover:border-[#fe8002] transition-all flex items-center justify-between group ${
                    theme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white'
                  }`}>
                    <span className="flex items-center gap-3">
                      <FaLock className="text-[#fe8002]" />
                      Changer le mot de passe
                    </span>
                    <span className="text-[#fe8002] group-hover:translate-x-2 transition-transform">→</span>
                  </button>
                </div>

                {/* Logout */}
                <div className={`rounded-2xl p-8 border-2 border-red-500/30 shadow-2xl ${
                  theme === 'light' ? 'bg-white' : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]'
                }`}>
                  <button
                    onClick={() => router.push("/")}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-extrabold py-4 px-6 rounded-xl hover:scale-105 transition-all shadow-2xl shadow-red-500/60 border-2 border-white/30 flex items-center justify-center gap-3"
                  >
                    <FaSignOutAlt />
                    SE DÉCONNECTER
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProfilePage;
