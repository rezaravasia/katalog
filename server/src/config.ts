import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import type { SignOptions } from "jsonwebtoken";

const sourceDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(sourceDirectory, "../../.env"), override: true });

const rawDatabaseUrl = process.env.DATABASE_URL;

export const databaseUrl = rawDatabaseUrl ? withPublicSearchPath(rawDatabaseUrl) : undefined;
export const jwtExpiresIn = normalizeJwtExpiresIn(process.env.JWT_EXPIRES_IN);

function withPublicSearchPath(value: string) {
  const url = new URL(value);
  const options = url.searchParams.get("options");
  url.searchParams.set("options", [options, "-c search_path=public"].filter(Boolean).join(" "));
  return url.toString();
}

export function normalizeJwtExpiresIn(value: string | undefined): SignOptions["expiresIn"] {
  const defaultValue: SignOptions["expiresIn"] = "7d";
  if (!value?.trim()) return defaultValue;

  const withoutAssignment = value.trim().replace(/^JWT_EXPIRES_IN\s*=\s*/i, "").trim();
  const normalized = withoutAssignment.replace(/^(["'])(.*)\1$/, "$2").trim();

  if (/^[1-9]\d*$/.test(normalized)) return Number(normalized);
  if (/^[1-9]\d*(?:\.\d+)?\s*(?:ms|s|m|h|d|w|y|seconds?|minutes?|hours?|days?|weeks?|years?)$/i.test(normalized)) {
    return normalized as SignOptions["expiresIn"];
  }

  console.warn("JWT_EXPIRES_IN tidak valid; memakai nilai aman default 7d.");
  return defaultValue;
}
