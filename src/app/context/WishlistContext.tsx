"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  clearWishlist: () => void;
  getWishlistItemsCount: () => number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// Helper function to get wishlist from localStorage
const getWishlistFromStorage = (): WishlistItem[] => {
  if (typeof window !== "undefined") {
    try {
      const savedWishlist = localStorage.getItem("primeComputerWishlist");
      if (savedWishlist) {
        return JSON.parse(savedWishlist);
      }
    } catch (error) {
      console.error("Error loading wishlist from localStorage:", error);
    }
  }
  return [];
};

// Helper function to save wishlist to localStorage
const saveWishlistToStorage = (wishlist: WishlistItem[]) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("primeComputerWishlist", JSON.stringify(wishlist));
    } catch (error) {
      console.error("Error saving wishlist to localStorage:", error);
    }
  }
};

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = getWishlistFromStorage();
    setWishlistItems(savedWishlist);
    setIsInitialized(true);
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      saveWishlistToStorage(wishlistItems);
    }
  }, [wishlistItems, isInitialized]);

  const addToWishlist = (item: WishlistItem) => {
    setWishlistItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      
      if (existingItem) {
        return prevItems; // Already in wishlist
      }
      
      return [...prevItems, item];
    });
  };

  const removeFromWishlist = (id: number) => {
    setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const isInWishlist = (id: number) => {
    return wishlistItems.some((item) => item.id === id);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const getWishlistItemsCount = () => {
    return wishlistItems.length;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        getWishlistItemsCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
