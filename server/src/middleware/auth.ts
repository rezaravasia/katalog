import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
export function requireAdmin(req: Request, res: Response, next: NextFunction) { const token = req.cookies?.kw_admin ?? req.header("Authorization")?.replace(/^Bearer\s+/i, ""); if (!token) return res.status(401).json({ message: "Sesi admin diperlukan." }); try { req.admin = jwt.verify(token, process.env.JWT_SECRET ?? "development-only-secret-change-me") as Request["admin"]; next(); } catch { return res.status(401).json({ message: "Sesi admin tidak valid atau telah berakhir." }); } }
