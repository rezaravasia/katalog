# Katalog WhatsApp

Katalog produk berbasis React dan Express dengan checkout WhatsApp, area admin, PostgreSQL Supabase, dan Supabase Storage untuk foto produk.

## Struktur

- `client/` — React 18, Vite, TypeScript, Tailwind, TanStack Query, dan Zustand.
- `server/` — Express 4, TypeScript, Drizzle ORM, PostgreSQL, JWT, Multer, dan Sharp.
- `api/` — entrypoint Vercel Function untuk backend Express pada `/api`.

## Pengembangan lokal

Simpan rahasia hanya pada `.env` di root proyek; gunakan `.env.example` sebagai referensi.

```bash
cd server && npm run db:migrate
cd server && npm run dev
cd client && npm run dev
```

## Deployment

Vercel membangun frontend dari `client/dist` dan menjalankan Express sebagai Function di `/api`. Atur environment variables berikut di Vercel:

```text
NODE_ENV=production
DATABASE_URL=connection string Supabase PostgreSQL
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=service role key Supabase
SUPABASE_STORAGE_BUCKET=catalog-assets
JWT_SECRET=random secret minimal 32 karakter
JWT_EXPIRES_IN=7d
APP_URL=https://deployment-url.vercel.app
CORS_ORIGIN=https://deployment-url.vercel.app
MAX_UPLOAD_MB=2
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=60
```

Jangan pernah commit `.env` atau service-role key.
