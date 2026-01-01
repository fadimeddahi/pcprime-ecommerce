"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Company } from '../types/enterprise';
import { companyApi } from '../services/espaceSocietyApi';

interface CompanyContextType {
  company: Company | null;
  companyId: string | null;
  loading: boolean;
  error: string | null;
  setCompanyId: (id: string | null) => void;
  loadCompany: (id: string) => Promise<void>;
  refreshCompany: () => Promise<void>;
  clearCompany: () => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [companyId, setCompanyIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load company ID from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCompanyId = localStorage.getItem('company_id');
      if (savedCompanyId) {
        setCompanyIdState(savedCompanyId);
        loadCompany(savedCompanyId);
      }
    }
  }, []);

  const setCompanyId = (id: string | null) => {
    setCompanyIdState(id);
    if (typeof window !== 'undefined') {
      if (id) {
        localStorage.setItem('company_id', id);
      } else {
        localStorage.removeItem('company_id');
      }
    }
  };

  const loadCompany = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const companyData = await companyApi.getCompanyById(id);
      setCompany(companyData);
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to load company';
      setError(errorMsg);
      console.error('Error loading company:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshCompany = async () => {
    if (companyId) {
      await loadCompany(companyId);
    }
  };

  const clearCompany = () => {
    setCompany(null);
    setCompanyId(null);
    setError(null);
  };

  return (
    <CompanyContext.Provider
      value={{
        company,
        companyId,
        loading,
        error,
        setCompanyId,
        loadCompany,
        refreshCompany,
        clearCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
