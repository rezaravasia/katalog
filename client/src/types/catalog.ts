export type Category = { id: string; name: string; slug: string; icon: string; sortOrder: number };
export type Variant = { id: string; label: string; priceDelta: number; stock: number };
export type Product = { id: string; name: string; slug: string; description: string; price: number; stock: number; categoryId: string; images: string[]; status: "aktif" | "draft"; variants: Variant[]; sku: string };
export type OrderStatus = "baru" | "diproses" | "selesai" | "batal";
export type OrderItem = { productId: string; productName: string; variantLabel?: string; price: number; qty: number; subtotal: number };
export type Order = { id: string; code: string; buyerName: string; buyerPhone: string; buyerNote: string; total: number; status: OrderStatus; createdAt: string; items: OrderItem[] };
export type StoreSettings = { storeName: string; logoUrl: string; whatsappNumber: string; address: string; openHours: string; description: string; messageTemplate: string };
export type CartItem = { productId: string; slug: string; name: string; image: string; price: number; variantId?: string; variantLabel?: string; qty: number };
