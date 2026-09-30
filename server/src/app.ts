import "./config.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { ZodError } from "zod";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "./db/client.js";
import { products } from "./db/schema.js";
import { authRouter } from "./routes/auth.js";
import { adminRouter } from "./routes/admin.js";
import { publicRouter } from "./routes/public.js";
import { uploadRouter } from "./routes/uploads.js";

export const app = express();
const origins = [...new Set([...(process.env.CORS_ORIGIN ?? "").split(",").map((value) => value.trim()).filter(Boolean), "http://localhost:5173", "http://localhost:5174"])];

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin(origin, callback) { if (!origin || origins.includes(origin)) return callback(null, true); callback(new Error("Origin tidak diizinkan oleh CORS.")); }, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(rateLimit({ windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000), limit: Number(process.env.RATE_LIMIT_MAX ?? 60), standardHeaders: "draft-7", legacyHeaders: false }));

const escapeXml = (value: string) => value.replace(/[<>&'"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", "\"": "&quot;" })[character] ?? character);
app.get("/robots.txt", (_req, res) => res.type("text/plain").send("User-agent: *\nAllow: /\nSitemap: /sitemap.xml\n"));
app.get("/sitemap.xml", async (_req, res, next) => { try { const appUrl = (process.env.APP_URL ?? "http://localhost:5173").replace(/\/$/, ""); const rows = await db.select({ slug: products.slug, updatedAt: products.updatedAt }).from(products).where(and(eq(products.status, "aktif"), isNull(products.deletedAt))); const urls = ["", ...rows.map((row) => `/produk/${row.slug}`)].map((route, index) => `<url><loc>${escapeXml(appUrl + route)}</loc>${index && rows[index - 1]?.updatedAt ? `<lastmod>${rows[index - 1].updatedAt.toISOString()}</lastmod>` : ""}</url>`); res.type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`); } catch (error) { next(error); } });
app.get(["/health", "/api/health"], (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRouter);
app.use("/api/orders", rateLimit({ windowMs: 60_000, limit: 10, standardHeaders: "draft-7", legacyHeaders: false, message: { message: "Terlalu banyak permintaan pesanan. Coba lagi dalam satu menit." } }));
app.use("/api", publicRouter);
app.use("/api/uploads", uploadRouter);
app.use("/api/admin", adminRouter);
app.use((req, res) => res.status(404).json({ message: `Rute ${req.method} ${req.path} tidak ditemukan.` }));
app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => { console.error(error); if (error instanceof ZodError) return res.status(400).json({ message: "Data tidak valid.", errors: error.flatten() }); const message = error instanceof Error ? error.message : "Terjadi kesalahan pada server."; const status = /stok|varian/i.test(message) ? 400 : 500; return res.status(status).json({ message }); });
