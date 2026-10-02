import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { jwtExpiresIn } from "../config.js";
import { db } from "../db/client.js";
import { adminUsers } from "../db/schema.js";
import { requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
export const authRouter = Router();
const cookie = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", maxAge: 7 * 24 * 60 * 60 * 1000, path: "/" };
authRouter.post("/login", validate(z.object({ email: z.string().email(), password: z.string().min(8).max(100) })), async (req, res, next) => { try { const user = await db.query.adminUsers.findFirst({ where: eq(adminUsers.email, req.body.email.toLowerCase()) }); if (!user || !user.isActive || !(await bcrypt.compare(req.body.password, user.passwordHash))) return res.status(401).json({ message: "Email atau kata sandi tidak tepat." }); const token = jwt.sign({ sub: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET ?? "development-only-secret-change-me", { expiresIn: jwtExpiresIn }); res.cookie("kw_admin", token, cookie).json({ user: { id: user.id, email: user.email, name: user.name } }); } catch (error) { next(error); } });
const passwordInput = z.object({
  currentPassword: z.string().min(8).max(100),
  newPassword: z.string().min(8, "Kata sandi baru minimal 8 karakter.").max(100),
}).refine(({ currentPassword, newPassword }) => currentPassword !== newPassword, { message: "Kata sandi baru harus berbeda dari kata sandi saat ini.", path: ["newPassword"] });
authRouter.post("/change-password", requireAdmin, validate(passwordInput), async (req, res, next) => {
  try {
    const user = await db.query.adminUsers.findFirst({ where: eq(adminUsers.id, req.admin!.sub) });
    if (!user || !user.isActive) return res.status(401).json({ message: "Sesi admin tidak valid." });
    if (!(await bcrypt.compare(req.body.currentPassword, user.passwordHash))) return res.status(400).json({ message: "Kata sandi saat ini tidak tepat." });
    await db.update(adminUsers).set({ passwordHash: await bcrypt.hash(req.body.newPassword, 12) }).where(eq(adminUsers.id, user.id));
    return res.clearCookie("kw_admin", cookie).status(204).end();
  } catch (error) {
    next(error);
  }
});
authRouter.post("/logout", (_req, res) => res.clearCookie("kw_admin", cookie).status(204).end());
authRouter.get("/me", requireAdmin, (req, res) => res.json({ user: req.admin }));
