"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  id: number | string;
  uuid?: string; // UUID for API requests
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
}

export interface CartToast {
  show: boolean;
  item: CartItem | null;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity: number) => void;
  removeFromCart: (id: number | string) => void;
  updateQuantity: (id: number | string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  isInCart: (id: number | string) => boolean;
  toast: CartToast;
  hideToast: () => void;
  shouldOpenCart: boolean;
  setShouldOpenCart: (value: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper function to get cart from localStorage
const getCartFromStorage = (): CartItem[] => {
  if (typeof window !== "undefined") {
    try {
      const savedCart = localStorage.getItem("primeComputerCart");
      if (savedCart) {
        return JSON.parse(savedCart);
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
    }
  }
  return [];
};

// Helper function to save cart to localStorage
const saveCartToStorage = (cart: CartItem[]) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("primeComputerCart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [toast, setToast] = useState<CartToast>({ show: false, item: null });
  const [shouldOpenCart, setShouldOpenCart] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = getCartFromStorage();
    setCartItems(savedCart);
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      saveCartToStorage(cartItems);
    }
  }, [cartItems, isInitialized]);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, item: null });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const hideToast = () => {
    setToast({ show: false, item: null });
  };

  // Helper to normalize ID for comparison (convert to string for consistent comparison)
  const normalizeId = (id: number | string): string => String(id);

  const addToCart = (item: Omit<CartItem, "quantity">, quantity: number) => {
    const normalizedItemId = normalizeId(item.id);
    const cartItem: CartItem = { ...item, quantity };
    
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => normalizeId(i.id) === normalizedItemId);
      
      if (existingItemIndex !== -1) {
        return prevItems.map((i, index) =>
          index === existingItemIndex ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      
      return [...prevItems, cartItem];
    });

    // Trigger cart to open
    setShouldOpenCart(true);
  };

  const removeFromCart = (id: number | string) => {
    const normalizedId = normalizeId(id);
    setCartItems((prevItems) => prevItems.filter((item) => normalizeId(item.id) !== normalizedId));
  };

  const updateQuantity = (id: number | string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    const normalizedId = normalizeId(id);
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        normalizeId(item.id) === normalizedId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const isInCart = (id: number | string) => {
    const normalizedId = normalizeId(id);
    return cartItems.some(item => normalizeId(item.id) === normalizedId);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
        isInCart,
        toast,
        hideToast,
        shouldOpenCart,
        setShouldOpenCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
