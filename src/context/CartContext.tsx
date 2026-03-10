import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartTyre {
  id: number;
  brand: string;
  size: string;
  price: number;
  image: string;
  stock: number;
  category: string;
}

export interface CartItem {
  tyre: CartTyre;
  qty: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (tyre: CartTyre) => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQty: () => {},
  clearCart: () => {},
  cartCount: 0,
  cartTotal: 0,
  isOpen: false,
  setIsOpen: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('at_cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [isOpen, setIsOpen] = useState(false);

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('at_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (tyre: CartTyre) => {
    setCart(prev => {
      const existing = prev.find(i => i.tyre.id === tyre.id);
      if (existing) {
        return prev.map(i => i.tyre.id === tyre.id
          ? { ...i, qty: Math.min(i.qty + 1, tyre.stock) }
          : i
        );
      }
      return [...prev, { tyre, qty: 1 }];
    });
    setIsOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(i => i.tyre.id !== id));
  };

  const updateQty = (id: number, delta: number) => {
    setCart(prev =>
      prev
        .map(i => i.tyre.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i)
        .filter(i => i.qty > 0)
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.tyre.price * i.qty, 0);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQty, clearCart,
      cartCount, cartTotal, isOpen, setIsOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}