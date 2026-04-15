import { create } from 'zustand';
import { api } from '@/lib/api';

interface WishlistItem {
  id: string;
}

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  fetchWishlist: () => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  loading: false,
  fetchWishlist: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/api/v1/profile/wishlist');
      set({ items: res.data });
    } catch (error) {
      console.error('Failed to fetch wishlist', error);
    } finally {
      set({ loading: false });
    }
  },
  toggleWishlist: async (productId: string) => {
    const { items } = get();
    const isExist = items.some(item => item.id === productId);
    
    try {
      if (isExist) {
        await api.delete(`/api/v1/profile/wishlist/${productId}`);
        set({ items: items.filter(item => item.id !== productId) });
      } else {
        await api.post(`/api/v1/profile/wishlist/${productId}`, {});
        set({ items: [...items, { id: productId } as any] });
      }
    } catch (error) {
      console.error('Failed to toggle wishlist', error);
    }
  },
  isInWishlist: (productId: string) => {
    return get().items.some(item => item.id === productId);
  }
}));
