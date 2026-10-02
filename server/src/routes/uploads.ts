import { randomUUID } from "crypto";
import { Router } from "express";
import multer from "multer";
import sharp from "sharp";
import { requireAdmin } from "../middleware/auth.js";
export const uploadRouter = Router();
const maxUploadMb = Number(process.env.MAX_UPLOAD_MB?.trim() || 2);
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: maxUploadMb * 1024 * 1024, files: 5 }, fileFilter: (_req, file, cb) => cb(null, ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) });
const storageBucket = process.env.SUPABASE_STORAGE_BUCKET?.trim() || "catalog-assets";
const storageUrl = process.env.SUPABASE_URL?.trim().replace(/\/$/, "");
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

async function uploadObject(objectPath: string, contents: Buffer) {
  if (!storageUrl || !serviceRoleKey) throw new Error("Supabase Storage belum dikonfigurasi.");
  const response = await fetch(`${storageUrl}/storage/v1/object/${storageBucket}/${objectPath}`, { method: "POST", headers: { authorization: `Bearer ${serviceRoleKey}`, apikey: serviceRoleKey, "content-type": "image/webp", "x-upsert": "false" }, body: contents });
  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { message?: string; error?: string; code?: string } | null;
    const detail = payload?.message ?? payload?.error ?? payload?.code;
    throw new Error(`Upload gambar ke Supabase gagal (${response.status})${detail ? `: ${detail}` : "."}`);
  }
  return `${storageUrl}/storage/v1/object/public/${storageBucket}/${objectPath}`;
}

uploadRouter.post("/", requireAdmin, upload.array("images", 5), async (req, res, next) => { try { const files = req.files as Express.Multer.File[]; if (!files?.length) return res.status(400).json({ message: "Pilih minimal satu gambar JPG, PNG, atau WebP." }); const data = await Promise.all(files.map(async (file) => { const id = randomUUID(); const full = `products/${id}.webp`; const thumb = `products/${id}-thumb.webp`; const [fullBuffer, thumbBuffer] = await Promise.all([sharp(file.buffer).rotate().resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer(), sharp(file.buffer).rotate().resize({ width: 400, height: 400, fit: "cover" }).webp({ quality: 78 }).toBuffer()]); const [url, thumbnailUrl] = await Promise.all([uploadObject(full, fullBuffer), uploadObject(thumb, thumbBuffer)]); return { url, thumbnailUrl }; })); res.status(201).json({ data }); } catch (error) { next(error); } });
