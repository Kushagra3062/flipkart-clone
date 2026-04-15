import { create } from 'zustand';
import { api } from '@/lib/api';

interface Address {
  id: string;
  full_name: string;
  phone: string;
  address_type: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  is_default: boolean;
}

interface AddressState {
  addresses: Address[];
  selectedAddressId: string | null;
  loading: boolean;
  fetchAddresses: () => Promise<void>;
  setSelectedAddress: (id: string) => void;
  addAddress: (data: Omit<Address, 'id' | 'is_default'>) => Promise<void>;
  updateAddress: (id: string, data: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
}

export const useAddressStore = create<AddressState>((set, get) => ({
  addresses: [],
  selectedAddressId: null,
  loading: false,

  fetchAddresses: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/api/v1/profile/addresses');
      const addresses: Address[] = res.data;
      const defaultAddr = addresses.find(a => a.is_default);
      set({ 
        addresses, 
        selectedAddressId: get().selectedAddressId || defaultAddr?.id || (addresses.length > 0 ? addresses[0].id : null) 
      });
    } catch (error) {
      console.error('Failed to fetch addresses', error);
    } finally {
      set({ loading: false });
    }
  },

  setSelectedAddress: (id) => set({ selectedAddressId: id }),

  addAddress: async (data) => {
    try {
      await api.post('/api/v1/profile/addresses', data);
      await get().fetchAddresses();
    } catch (error) {
      console.error('Failed to add address', error);
      throw error;
    }
  },

  updateAddress: async (id, data) => {
    try {
      await api.put(`/api/v1/profile/addresses/${id}`, data);
      await get().fetchAddresses();
    } catch (error) {
      console.error('Failed to update address', error);
      throw error;
    }
  },

  deleteAddress: async (id) => {
    try {
      await api.delete(`/api/v1/profile/addresses/${id}`);
      await get().fetchAddresses();
    } catch (error) {
      console.error('Failed to delete address', error);
      throw error;
    }
  },

  setDefaultAddress: async (id) => {
    try {
      await api.patch(`/api/v1/profile/addresses/${id}/set-default`, {});
      await get().fetchAddresses();
    } catch (error) {
      console.error('Failed to set default address', error);
      throw error;
    }
  },
}));
