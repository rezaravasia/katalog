import { eq, sql } from "drizzle-orm";
import { products } from "../db/schema.js";
export const normalizePhone = (value: string) => value.replace(/\D/g, "").replace(/^0/, "62").replace(/^\+/, "");
export const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
export async function uniqueSlug(db: any, requested: string, excludeId?: string) { const base = slugify(requested) || "produk"; let candidate = base; let sequence = 2; while (true) { const found = await db.query.products.findFirst({ where: (t: typeof products, { and, eq }: any) => and(eq(t.slug, candidate), excludeId ? sql`${t.id} <> ${excludeId}` : undefined) }); if (!found) return candidate; candidate = `${base}-${sequence++}`; } }
export const formatOrderCode = (date = new Date(), seq = 1) => { const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date); const pick = (type: string) => parts.find((p) => p.type === type)?.value; return `KW-${pick("year")}${pick("month")}${pick("day")}-${String(seq).padStart(4, "0")}`; };
