import { useQuery } from "@tanstack/react-query";
import { api } from "./api";
export const queryKeys = { products: (params = "") => ["products", params] as const, product: (slug: string) => ["products", slug] as const, categories: ["categories"] as const, settings: ["settings"] as const, me: ["auth", "me"] as const, adminProducts: (params = "") => ["admin", "products", params] as const, adminOrders: (params = "") => ["admin", "orders", params] as const, adminSettings: ["admin", "settings"] as const, stats: ["admin", "stats"] as const };
export const useProducts = (params = "") => useQuery({ queryKey: queryKeys.products(params), queryFn: () => api.products(params).then((x) => x.data) });
export const useProduct = (slug: string) => useQuery({ queryKey: queryKeys.product(slug), queryFn: () => api.product(slug).then((x) => x.data), enabled: !!slug });
export const useCategories = () => useQuery({ queryKey: queryKeys.categories, queryFn: () => api.categories().then((x) => x.data) });
export const useSettings = () => useQuery({ queryKey: queryKeys.settings, queryFn: () => api.settings().then((x) => x.data) });
