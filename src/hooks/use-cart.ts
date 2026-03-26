import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string | null;
  tenantId: string;
  tenantName: string;
  slug: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getGroupedByTenant: () => Record<string, { tenantName: string; items: CartItem[] }>;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          // Don't add duplicates
          const exists = state.items.find((i) => i.productId === item.productId);
          if (exists) return state;
          return { items: [...state.items, item] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.price, 0);
      },

      getItemCount: () => get().items.length,

      getGroupedByTenant: () => {
        const groups: Record<string, { tenantName: string; items: CartItem[] }> = {};
        for (const item of get().items) {
          if (!groups[item.tenantId]) {
            groups[item.tenantId] = { tenantName: item.tenantName, items: [] };
          }
          groups[item.tenantId].items.push(item);
        }
        return groups;
      },
    }),
    {
      name: "multimart-cart",
    }
  )
);
