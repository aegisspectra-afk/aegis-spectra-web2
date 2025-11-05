'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Cart item interface
export interface CartItem {
  id?: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  // Package-specific fields
  type?: 'product' | 'package';
  packageSlug?: string;
  packageOptions?: {
    cameras?: number;
    aiDetection?: 'basic' | 'advanced' | 'enterprise';
    storage?: string;
    addons?: string[];
    maintenance?: boolean;
  };
}

// Cart context interface
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'> | CartItem, quantity?: number) => void;
  removeFromCart: (sku: string) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Optional: react to cross-tab changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handler = (e: StorageEvent) => {
        if (e.key === 'cart' && e.newValue) {
          try { 
            setCart(JSON.parse(e.newValue)); 
          } catch {
            // Ignore parse errors
          }
        }
      };
      window.addEventListener('storage', handler);
      return () => window.removeEventListener('storage', handler);
    }
  }, []);

  // Persist cart
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (product: Omit<CartItem, 'quantity'> | CartItem, quantity: number = 1) => {
    setCart(prev => {
      // Check if product already exists in cart (by SKU)
      const existingItemIndex = prev.findIndex(item => item.sku === product.sku);
      
      if (existingItemIndex >= 0) {
        // Update quantity if exists
        const newCart = prev.map(item => 
          item.sku === product.sku 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        return newCart;
      } else {
        // Add new item to cart
        const newItem: CartItem = {
          id: product.id || `${product.sku}-${Date.now()}`,
          sku: product.sku,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.image
        };
        return [...prev, newItem];
      }
    });
  };

  const removeFromCart = (sku: string) => {
    setCart(prev => prev.filter(item => item.sku !== sku));
  };

  const updateQuantity = (sku: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(sku);
      return;
    }
    setCart(prev => prev.map(item => 
      item.sku === sku ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    isCartOpen,
    setIsCartOpen
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

