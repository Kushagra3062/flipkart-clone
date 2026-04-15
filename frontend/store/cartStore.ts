import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';

export interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    mrp: number;
    discount_percent: number;
    rating: number;
    rating_count: number;
    image_url: string;
  };
}

interface CartState {
  items: CartItem[];
  subtotal: number;
  total_discount: number;
  total_amount: number;
  savings: number;
  delivery_fee: number;
  isLoading: boolean;
  
  // Actions
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      total_discount: 0,
      total_amount: 0,
      savings: 0,
      delivery_fee: 0,
      isLoading: false,

      fetchCart: async () => {
        if (typeof window !== 'undefined' && !localStorage.getItem('token')) return;
        set({ isLoading: true });
        try {
          const res = await api.get('/api/v1/cart');
          set({ ...res.data, isLoading: false });
        } catch (error) {
          console.error("Cart retrieval error:", error);
          set({ isLoading: false });
        }
      },

      addToCart: async (productId, quantity) => {
        if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
          alert('Please login to add items to cart!');
          return;
        }
        try {
          const res = await api.post('/api/v1/cart/items', { product_id: productId, quantity });
          set({ ...res.data });
        } catch (error) {
          console.error("Adding to cart failed:", error);
        }
      },

      updateQuantity: async (itemId, quantity) => {
        try {
          const res = await api.put(`/api/v1/cart/items/${itemId}`, { quantity });
          set({ ...res.data });
        } catch (error) {
          console.error("Cart update quantity error:", error);
        }
      },

      removeFromCart: async (itemId) => {
        try {
          const res = await api.delete(`/api/v1/cart/items/${itemId}`);
          set({ ...res.data });
        } catch (error) {
          console.error("Delete cart item error:", error);
        }
      },

      clearCart: async () => {
        try {
          const res = await api.delete('/api/v1/cart');
          set({ ...res.data, items: [] }); // Sync UI directly
        } catch (error) {
          console.error("Clear cart error:", error);
        }
      }
    }),
    {
      name: 'flipkart-cart-storage',
      partialize: (state) => ({ items: state.items }), // Partially persist layout 
    }
  )
);
