import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const sourceDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(sourceDirectory, "../../.env"), override: true });

const rawDatabaseUrl = process.env.DATABASE_URL;

export const databaseUrl = rawDatabaseUrl ? withPublicSearchPath(rawDatabaseUrl) : undefined;

function withPublicSearchPath(value: string) {
  const url = new URL(value);
  const options = url.searchParams.get("options");
  url.searchParams.set("options", [options, "-c search_path=public"].filter(Boolean).join(" "));
  return url.toString();
}
