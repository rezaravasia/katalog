import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "../types/catalog";
type CartState = { items: CartItem[]; addItem: (item: CartItem) => void; updateQty: (productId: string, variantId: string | undefined, qty: number) => void; removeItem: (productId: string, variantId?: string) => void; clear: () => void; totalItems: () => number; subtotal: () => number; };
export const useCartStore = create<CartState>()(persist((set, get) => ({
  items: [],
  addItem: (item) => set((state) => { const found = state.items.find((x) => x.productId === item.productId && x.variantId === item.variantId); return { items: found ? state.items.map((x) => x === found ? { ...x, qty: x.qty + item.qty } : x) : [...state.items, item] }; }),
  updateQty: (productId, variantId, qty) => set((state) => ({ items: qty < 1 ? state.items.filter((x) => !(x.productId === productId && x.variantId === variantId)) : state.items.map((x) => x.productId === productId && x.variantId === variantId ? { ...x, qty } : x) })),
  removeItem: (productId, variantId) => set((state) => ({ items: state.items.filter((x) => !(x.productId === productId && x.variantId === variantId)) })),
  clear: () => set({ items: [] }), totalItems: () => get().items.reduce((sum, item) => sum + item.qty, 0), subtotal: () => get().items.reduce((sum, item) => sum + item.price * item.qty, 0),
}), { name: "kw_cart_v1" }));
