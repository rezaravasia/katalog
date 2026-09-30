import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { databaseUrl } from "../config.js";
import * as schema from "./schema.js";
const connectionString = databaseUrl;
const hostname = connectionString ? new URL(connectionString).hostname : undefined;
if (!connectionString) console.warn("DATABASE_URL belum diatur; endpoint database tidak dapat digunakan.");
export const pool = new Pool({ connectionString, ssl: hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1" ? false : { rejectUnauthorized: false } });
export const db = drizzle(pool, { schema });
