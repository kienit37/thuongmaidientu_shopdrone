
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Product, CartItem } from './types';

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, delta: number) => void;
    clearCart: () => void;
    totalItems: number;
    toast: { show: boolean, product: Product | null };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};

export const CartProvider = ({ children }: { children?: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [toast, setToast] = useState<{ show: boolean, product: Product | null }>({ show: false, product: null });

    // Load from localStorage on init
    useEffect(() => {
        const saved = localStorage.getItem('kshop_cart');
        if (saved) {
            try {
                setCart(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load cart", e);
            }
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem('kshop_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            return [...prev, { ...product, quantity: 1 }];
        });
        setToast({ show: true, product });

        // Track Activity
        import('./utils/ActivityTracker').then(({ ActivityTracker }) => {
            ActivityTracker.track('add_to_cart', `Đã thêm ${product.name} vào giỏ`);
        });

        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    };

    const removeFromCart = (productId: string) => setCart(prev => prev.filter(item => item.id !== productId));

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
    };

    const clearCart = () => setCart([]);

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, toast }}>
            {children}
        </CartContext.Provider>
    );
};
