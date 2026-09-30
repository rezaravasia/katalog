import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";
export const validate = (schema: ZodTypeAny, source: "body" | "query" | "params" = "body") => (req: Request, res: Response, next: NextFunction) => { const parsed = schema.safeParse(req[source]); if (!parsed.success) return res.status(400).json({ message: "Data tidak valid.", errors: parsed.error.flatten() }); (req as any)[source] = parsed.data; next(); };
