"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper function to get theme from localStorage
const getThemeFromStorage = (): Theme => {
  if (typeof window !== "undefined") {
    try {
      const savedTheme = localStorage.getItem("primeComputerTheme");
      if (savedTheme === "light" || savedTheme === "dark") {
        return savedTheme;
      }
    } catch (error) {
      console.error("Error loading theme from localStorage:", error);
    }
  }
  return "dark"; // Default to dark theme
};

// Helper function to save theme to localStorage
const saveThemeToStorage = (theme: Theme) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("primeComputerTheme", theme);
    } catch (error) {
      console.error("Error saving theme to localStorage:", error);
    }
  }
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("dark");
  const [isInitialized, setIsInitialized] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = getThemeFromStorage();
    setTheme(savedTheme);
    setIsInitialized(true);
    
    // Apply theme to document
    if (savedTheme === "light") {
      document.documentElement.classList.add("light-mode");
    } else {
      document.documentElement.classList.remove("light-mode");
    }
  }, []);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      saveThemeToStorage(theme);
      
      // Apply theme to document
      if (theme === "light") {
        document.documentElement.classList.add("light-mode");
      } else {
        document.documentElement.classList.remove("light-mode");
      }
    }
  }, [theme, isInitialized]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
