"use client";

import { useState, useEffect } from "react";
import CompanyDashboard from "../components/company-dashboard";
import { useTheme } from "../context/ThemeContext";
import { authApi } from "../services/api";

export default function EspaceSocietyPage() {
  const { theme } = useTheme();
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated
        if (authApi.isAuthenticated()) {
          setIsAuthenticated(true);
          // In a real app, would fetch user's company ID from profile
          // const profile = await authApi.getProfile();
          // setCompanyId(profile.companyId);
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'light' ? 'bg-gray-50' : 'bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a]'
      }`}>
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-[#fe8002]/20 border-t-[#fe8002] rounded-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        theme === 'light' ? 'bg-gray-50' : 'bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a]'
      }`}>
        <div className={`text-center max-w-md ${
          theme === 'light'
            ? 'bg-white'
            : 'bg-[#1a1a1a] border border-[#2a2a2a]'
        } p-8 rounded-lg`}>
          <h1 className={`text-2xl font-bold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            Accès Requis
          </h1>
          <p className={`mb-6 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            Veuillez vous connecter pour accéder à Espace Société
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-[#fe8002] to-[#ff4500] text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg hover:shadow-[#fe8002]/50"
          >
            Retour à l'Accueil
          </button>
        </div>
      </div>
    );
  }

  return <CompanyDashboard companyId={companyId || undefined} />;
}
