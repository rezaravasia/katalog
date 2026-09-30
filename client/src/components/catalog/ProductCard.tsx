import { Plus, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "../../types/catalog";
import { formatRupiah } from "../../lib/utils";
import { useCartStore } from "../../store/cartStore";
import { Badge } from "../ui/badge";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const soldOut = product.stock === 0;
  const needsVariant = product.variants.length > 0;
  const add = () => addItem({ productId: product.id, slug: product.slug, name: product.name, image: product.images[0], price: product.price, qty: 1 });
  return <article className="group overflow-hidden rounded-lg border border-border bg-white transition duration-150 hover:shadow-sm"><Link to={`/produk/${product.slug}`} className="block"><div className="relative aspect-square overflow-hidden bg-gray-100"><img src={product.images[0]} alt={product.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" loading="lazy" />{soldOut && <Badge variant="danger" className="absolute left-2 top-2">Stok Habis</Badge>}</div><div className="px-3 pt-3"><h3 className="line-clamp-2 min-h-10 text-sm font-bold leading-5">{product.name}</h3><p className="mt-2 font-mono text-sm font-bold">{formatRupiah(product.price)}</p></div></Link><div className="p-3"><div className="flex items-center gap-1 text-[11px] text-gray-500"><ShoppingBag size={12}/>{soldOut ? "Belum tersedia" : `${product.stock} stok tersedia`}</div>{needsVariant ? <Link to={`/produk/${product.slug}`} className="mt-3 flex h-9 w-full items-center justify-center rounded-md border border-border text-xs font-bold hover:bg-gray-50">Pilih varian</Link> : <button disabled={soldOut} onClick={add} className="mt-3 flex h-9 w-full items-center justify-center gap-1 rounded-md bg-primary text-xs font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"><Plus size={14}/>Tambah ke keranjang</button>}</div></article>;
}
