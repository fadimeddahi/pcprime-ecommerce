"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../context/ThemeContext";
import { authApi } from "../services/api";
import ChangePasswordModal from "../components/change-password-modal";
import FeedbackModal from "../components/feedback-modal";
import Image from "next/image";
import { 
  FaUser, 
  FaEnvelope, 
  FaEdit, 
  FaShoppingBag,
  FaHeart,
  FaCog,
  FaSignOutAlt,
  FaLock
} from "react-icons/fa";

interface UserProfile {
  id: number | string;
  username: string;
  email: string;
}

const ProfilePage = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "orders" | "settings">("info");
  const [isLoading, setIsLoading] = useState(true);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [editData, setEditData] = useState({
    username: "",
    email: "",
  });

  // Check authentication and load user data
  useEffect(() => {
    const loadUserProfile = () => {
      if (!authApi.isAuthenticated()) {
        router.push('/');
        return;
      }

      try {
        // Get user data from localStorage (stored during login)
        const token = authApi.getToken();
        const userData = localStorage.getItem('user_data');
        
        if (userData) {
          const user = JSON.parse(userData);
          setProfileData(user);
          setEditData({
            username: user.username || "",
            email: user.email || "",
          });
        } else {
          // No user data found, redirect to home
          console.warn('No user data found in localStorage');
          authApi.logout();
          router.push('/');
          return;
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        // Clear invalid data and redirect
        authApi.logout();
        localStorage.removeItem('user_data');
        router.push('/');
        return;
      }
      
      setIsLoading(false);
    };

    loadUserProfile();
  }, [router]);

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
    if (profileData) {
      const updatedProfile = { ...profileData, ...editData };
      setProfileData(updatedProfile);
      localStorage.setItem('user_data', JSON.stringify(updatedProfile));
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (profileData) {
      setEditData({
        username: profileData.username,
        email: profileData.email,
      });
    }
    setIsEditing(false);
  };

  const handleLogout = () => {
    authApi.logout();
    localStorage.removeItem('user_data');
    router.push('/');
  };

  if (isLoading) {
    return (
      <main className={`min-h-screen flex items-center justify-center ${
        theme === 'light' ? 'bg-gray-50' : 'bg-black'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#fe8002] mx-auto mb-4"></div>
          <p className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            Chargement...
          </p>
        </div>
      </main>
    );
  }

  if (!profileData) {
    return null;
  }

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
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#fe8002] shadow-2xl shadow-[#fe8002]/50 flex items-center justify-center bg-gradient-to-br from-[#fe8002] to-[#ff4500]">
                  <FaUser className="text-6xl text-white" />
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className={`text-3xl font-extrabold mb-2 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {profileData.username}
                </h2>
                <p className="text-[#fe8002] font-bold text-lg mb-2">
                  {profileData.email}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-all shadow-lg shadow-[#fe8002]/50 flex items-center gap-2"
                >
                  <FaEdit />
                  {isEditing ? "Annuler" : "Modifier"}
                </button>
                <button
                  onClick={handleLogout}
                  className={`border-2 border-red-500 text-red-500 font-bold px-6 py-3 rounded-xl hover:scale-105 hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 ${
                    theme === 'light' ? 'bg-white' : 'bg-[#0f0f0f]'
                  }`}
                >
                  <FaSignOutAlt />
                  Déconnexion
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
                  {/* Username */}
                  <div>
                    <label className={`text-sm font-bold mb-2 block uppercase tracking-wide flex items-center gap-2 ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                      <FaUser className="text-[#fe8002]" />
                      Nom d'utilisateur
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={isEditing ? editData.username : profileData.username}
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
                </div>

                {isEditing && (
                  <div className="flex gap-4 mt-8 justify-end">
                    <button
                      onClick={handleCancel}
                      className={`px-8 py-3 rounded-xl font-bold transition-all border-2 border-gray-500 hover:scale-105 ${
                        theme === 'light' ? 'bg-white text-gray-700 hover:bg-gray-100' : 'bg-[#0f0f0f] text-white hover:bg-[#1a1a1a]'
                      }`}
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-white hover:scale-105 transition-all shadow-lg shadow-[#fe8002]/50"
                    >
                      Enregistrer
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                {/* Feedback */}
                <div className={`rounded-2xl p-8 border-2 border-blue-500/30 shadow-2xl ${
                  theme === 'light' ? 'bg-white' : 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]'
                }`}>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">💬</span>
                    <h2 className="text-blue-500 font-bold text-2xl uppercase tracking-wide">
                      Retour d'expérience
                    </h2>
                  </div>

                  <button className={`w-full font-bold py-4 px-6 rounded-xl border-2 border-blue-500/40 hover:border-blue-500 transition-all flex items-center justify-between group ${
                    theme === 'light' ? 'bg-blue-50 text-blue-900' : 'bg-gradient-to-r from-blue-900/20 to-blue-800/20 text-blue-400'
                  }`}
                  onClick={() => setIsFeedbackOpen(true)}>
                    <span className="flex items-center gap-3">
                      <span>💬</span>
                      Partager votre avis
                    </span>
                    <span className="text-blue-500 group-hover:translate-x-2 transition-transform">→</span>
                  </button>
                </div>

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
                  }`}
                  onClick={() => setShowChangePasswordModal(true)}>
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
                    onClick={handleLogout}
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

      {/* Change Password Modal */}
      {profileData && (
        <>
          <ChangePasswordModal
            isOpen={showChangePasswordModal}
            onClose={() => setShowChangePasswordModal(false)}
            userId={profileData.id}
          />

          {/* Feedback Modal */}
          <FeedbackModal
            isOpen={isFeedbackOpen}
            onClose={() => setIsFeedbackOpen(false)}
            userId={profileData.id ? Number(profileData.id) : undefined}
            userEmail={profileData.email}
          />
        </>
      )}
    </main>
  );
};


export default ProfilePage;
