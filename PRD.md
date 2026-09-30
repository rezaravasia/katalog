# Katalog WhatsApp

---

## 1. Ringkasan & Tujuan Aplikasi
*Bagian ini menjelaskan gambaran umum proyek agar dipahami bersama oleh pemilik ide/klien dan tim pengembang.*
- **Nama Aplikasi**: Katalog WhatsApp
- **Penjelasan Singkat**: Website katalog produk ringan bergaya mobile-first yang memudahkan penjual menampilkan produk dan pembeli memilih barang, lalu checkout otomatis menjadi format pesan pesanan rapi yang dikirim langsung ke WhatsApp penjual — tanpa perlu pembeli mengetik manual.
- **Masalah yang Diselesaikan**:
  - Penjual UMKM sering kewalahan menjawab chat "stok ada?", "harga berapa?", "ongkir berapa?" secara berulang karena tidak punya katalog terpusat.
  - Pembeli malas mengetik ulang detail produk saat order via WhatsApp, sehingga pesanan sering tidak lengkap (nama, ukuran, jumlah, alamat).
  - Toko online besar (Shopee/Tokopedia) terlalu berat dan berbiaya admin, sedangkan penjual kecil hanya butuh katalog ringan + chat WhatsApp yang sudah familiar.
  - Tidak ada rekapan pesanan yang rapi di sisi penjual, semua tercampur di chat WhatsApp tidak beraturan.
- **Pengguna Aplikasi**:
  - **Pembeli (Public Visitor)**: Membutuhkan pengalaman berbelanja cepat di HP, bisa lihat produk, atur jumlah, dan checkout ke WhatsApp penjual.
  - **Penjual / Admin**: Membutuhkan dashboard ringkas untuk mengelola produk, kategori, stok, foto, dan melihat rekapan pesanan yang masuk.
- **Target Keberhasilan**:
  - Pembeli dapat menyelesaikan alur "pilih produk → masukkan keranjang → checkout ke WhatsApp" dalam waktu kurang dari 60 detik di perangkat mobile.
  - Penjual dapat menambah/mengubah produk baru tanpa bantuan teknis dalam waktu kurang dari 3 menit.
  - Minimal 80% pesanan yang masuk ke WhatsApp penjual sudah lengkap (nama produk, jumlah, varian, data pembeli) tanpa perlu tanya balik.
  - Waktu loading halaman katalog utama di bawah 2 detik pada jaringan 4G rata-rata.

---

## 2. Batasan Pembuatan Sistem (Versi Awal MVP)
*Menegaskan fitur apa yang dikerjakan di versi awal dan apa yang sengaja ditunda agar aplikasi cepat selesai dan tidak membengkak (mencegah scope creep).*
### ✅ Yang Dikerjakan:
- Halaman katalog produk publik dengan pencarian, filter kategori, dan tampilan card produk mobile-first.
- Halaman detail produk lengkap dengan galeri foto, varian (ukuran/warna), dan tombol tambah ke keranjang.
- Keranjang belanja berbasis state lokal (localStorage) yang tersinkronisasi antarhalaman.
- Checkout otomatis yang meng-generate format pesan pesanan dan membuka link `wa.me` ke nomor WhatsApp penjual.
- Halaman form data pembeli (nama, no HP, alamat/catatan) sebelum checkout ke WhatsApp.
- Dashboard admin untuk CRUD produk, kategori, harga, stok, dan foto (upload gambar).
- Halaman pengaturan toko (nama toko, logo, nomor WhatsApp tujuan, alamat, jam operasional).
- Halaman rekapan pesanan yang di-log ke database ketika pembeli menekan tombol "Kirim ke WhatsApp" (sebagai arsip penjual).

### ⛔ Yang Tidak Dikerjakan di Versi Awal:
- Sistem pembayaran online (Payment Gateway) — pembayaran tetap manual via chat WhatsApp.
- Sistem akun/login pembeli (guest checkout saja).
- Pelacakan pengiriman (resi / tracking kurir).
- Multi-penjual (marketplace). Versi awal: satu toko per instalasi.
- Aplikasi mobile native (Android/iOS).
- Notifikasi push browser.
- Kupon/diskon otomatis dan loyalty point.

---

## 3. Daftar Halaman & Struktur Menu (Pages & Routing)
*Daftar lengkap halaman yang harus dibuat, dikelompokkan berdasarkan area atau peran pengguna (Role).*
### A. Public Area (Tanpa Login)
- `/` (Beranda / Katalog Utama): Hero singkat toko, kolom pencarian, chip kategori, grid produk card (mobile-first, 2 kolom di HP, 4 kolom di desktop).
- `/produk/:slug` (Detail Produk): Galeri foto, judul, harga, stok, pilihan varian, pemilih jumlah, tombol "Tambah ke Keranjang" + "Beli via WhatsApp" (langsung checkout 1 produk).
- `/kategori/:slug` (Kategori): Menampilkan produk yang tersaring berdasarkan kategori terpilih.
- `/keranjang` (Keranjang Belanja): Daftar produk di keranjang, edit jumlah, hapus item, subtotal, tombol "Lanjut Checkout".
- `/checkout` (Checkout): Form data pembeli (nama, no HP, alamat/catatan), ringkasan pesanan, tombol "Kirim Pesanan ke WhatsApp".
- `/tentang` (Tentang Toko): Deskripsi singkat toko, alamat, jam operasional, kontak.
- `/faq` (FAQ): Pertanyaan umum (cara order, ongkir, pembayaran, pengiriman).

### B. Admin Area (Setelah Login)
- `/admin/login` (Login Admin): Form login admin (email + password).
- `/admin` (Dasbor Admin): Ringkasan statistik (jumlah produk, kategori, pesanan hari ini, pesanan bulan ini) + tabel 5 pesanan terbaru.
- `/admin/produk` (Kelola Produk): Tabel daftar produk, tombol tambah/edit/hapus, filter kategori, pencarian, kolom status stok.
- `/admin/produk/baru` (Tambah Produk): Form input produk lengkap dengan upload foto (multi-image), pilih kategori, atur varian.
- `/admin/produk/:id/edit` (Edit Produk): Form edit produk.
- `/admin/kategori` (Kelola Kategori): CRUD kategori produk (nama, slug, ikon, urutan).
- `/admin/pesanan` (Rekapan Pesanan): Tabel pesanan yang tercatat dari checkout WhatsApp, filter tanggal/status, detail pesanan, tombol ubah status (Baru / Diproses / Selesai / Batal).
- `/admin/pengaturan` (Pengaturan Toko): Form pengaturan (nama toko, logo, nomor WhatsApp tujuan, alamat, jam operasional, template pesan WhatsApp).

---

## 4. Pedoman UI/UX & Design System
*Panduan visual konkret agar AI coding assistant tidak membuat UI yang kaku atau default.*
- **Skema Warna**:
  - Primary (Aksen): `#1A1A1A` (near-black untuk tombol & heading utama)
  - Accent (WhatsApp Green): `#25D366` — khusus tombol checkout WhatsApp
  - Background Gradient: `linear-gradient(180deg, #FAFAFA 0%, #F2F3F5 100%)` (gradasi grey tipis)
  - Surface / Card: `#FFFFFF`
  - Border: `#E5E7EB` (1px, sangat tipis) — menerapkan gaya **border tipis 1px konsisten**
  - Text Primary: `#111111`
  - Text Secondary: `#6B7280`
  - Danger: `#DC2626`
  - Success: `#16A34A`
- **Tipografi**:
  - Heading (h1–h4, judul produk, judul section): **Idealist Sans** — `font-heading`.
  - Body / Paragraf / Label / Tombol: **Manrope** — `font-body`, semua paragraf wajib menggunakan font ini.
  - Angka teknis, harga, SKU, kode pesanan, timestamp: **Ubuntu Mono** — `font-mono`.
  - **Aturan Text Shadow (WAJIB)**: Semua elemen body dan input memiliki `text-shadow: 0 0 1.8px` agar teks terasa halus & lembut di layar mobile.
- **Aturan Komponen**:
  - **Border**: semua card, input, dan tabel menggunakan `border: 1px solid #E5E7EB` (sangat tipis). Hindari border tebal.
  - **Radius**: `rounded-lg` (8px) untuk card & input; `rounded-md` (6px) untuk badge & chip.
  - **Shadow**: `shadow-none` di default; `shadow-sm` hanya saat hover card; tidak ada shadow besar/blur tebal.
  - **Spacing**: kelipatan 4px, padding card `p-4`, gap grid `gap-3` di mobile, `gap-5` di desktop.
  - **Input**: background `#FFFFFF`, border 1px `#E5E7EB`, focus ring `border-color: #1A1A1A` tipis (1px), teks dengan text-shadow `0 0 1.8px`.
  - **Tombol Primary**: hitam solid `#1A1A1A`, teks putih, radius `rounded-md`, `hover:opacity-90`.
  - **Tombol WhatsApp CTA**: hijau `#25D366`, ikon WhatsApp di kiri, teks putih, selalu full-width di mobile.
  - **Card Produk**: tanpa border tebal, hanya 1px tipis, gambar rasio 1:1 dengan `object-cover`, nama produk **Idealist Sans** 2 baris clamp, harga **Ubuntu Mono**.
  - **Badge**: kecil, `rounded-md`, background pastel tipis (contoh: "Stok Habis" background `#FEE2E2` teks `#991B1B`).
- **Nuansa & Vibe**:
  - **Mobile-first**: semua tata letak dioptimalkan untuk layar 360–430px terlebih dahulu, baru di-scale ke desktop.
  - **Clean & rapi**: banyak whitespace, tipografi tenang, tanpa ornamen berlebihan.
  - **Soft/lembut**: gradasi grey tipis, border super tipis, teks dengan text-shadow 1.8px menghasilkan kesan halus dan "mewah minimalis".
  - **Micro-animations**: transisi `duration-150` pada hover card & tombol; animasi halus pada badge keranjang saat item bertambah.
  - **Fokus pada kecepatan aksi**: tombol "+ Keranjang" dan "Checkout WhatsApp" harus selalu terlihat jelas dan mudah dijangkau jempol.

---

## 5. Pembagian Hak Akses Pengguna
*Tabel hak akses yang menentukan siapa saja yang boleh melihat, mengedit, atau mengelola data.*
| Menu / Halaman | Publik (Tanpa Login) | Admin (Login) |
| :--- | :---: | :---: |
| Beranda / Katalog (`/`) | ✅ | ✅ |
| Detail Produk (`/produk/:slug`) | ✅ | ✅ |
| Kategori (`/kategori/:slug`) | ✅ | ✅ |
| Keranjang (`/keranjang`) | ✅ | ✅ |
| Checkout (`/checkout`) | ✅ | ✅ |
| Tentang & FAQ | ✅ | ✅ |
| Dasbor Admin (`/admin`) | ❌ | ✅ |
| Kelola Produk (`/admin/produk`) | ❌ | ✅ |
| Kelola Kategori (`/admin/kategori`) | ❌ | ✅ |
| Rekapan Pesanan (`/admin/pesanan`) | ❌ | ✅ |
| Pengaturan Toko (`/admin/pengaturan`) | ❌ | ✅ |

---

## 6. Alur Kerja dan Fitur Utama
*Menjelaskan cara kerja setiap fitur utama dalam bahasa yang mudah dipahami serta aturan logikanya.*

### A. Katalog Produk (Publik)
1. **Cara Kerja**: Pembeli membuka beranda dan langsung melihat daftar produk dalam grid card. Ia dapat mengetik di kolom pencarian atau menekan chip kategori di bagian atas. Setiap card menampilkan foto, nama produk, harga, dan badge status stok. Menekan card akan membuka halaman detail produk.
2. **Aturan Sistem**:
   - Pencarian bersifat case-insensitive dan menggunakan debounce 300ms untuk mencegah request berlebih.
   - Filter kategori bersifat multi-pilih (chip aktif berwarna hitam solid, chip nonaktif border tipis).
   - Produk dengan stok 0 tetap tampil namun diberi badge "Stok Habis" dan tombol beli di-disable.
   - Pagination/load more: 24 produk per halaman.

### B. Detail Produk & Varian
1. **Cara Kerja**: Pembeli melihat galeri foto (swipe di mobile), nama produk, harga (font Ubuntu Mono), deskripsi singkat, dan memilih varian (misal: Ukuran S/M/L, Warna Merah/Hitam). Setelah memilih, ia mengatur jumlah lalu menekan "Tambah ke Keranjang" atau "Beli Sekarang via WhatsApp".
2. **Aturan Sistem**:
   - Varian wajib dipilih sebelum tombol keranjang/checkout aktif jika produk memiliki varian.
   - Jumlah minimal 1, maksimal dibatasi oleh stok tersedia.
   - Harga yang tampil mengikuti harga varian jika varian punya harga berbeda.
   - Tombol "Beli Sekarang via WhatsApp" akan langsung membuka checkout dengan 1 item tersebut (tanpa lewat keranjang).

### C. Keranjang Belanja (LocalStorage)
1. **Cara Kerja**: Item yang ditambahkan akan masuk ke keranjang dan tetap tersimpan meskipun browser ditutup (localStorage). Badge jumlah item muncul di ikon keranjang di navbar. Pembeli bisa mengubah jumlah atau menghapus item di halaman `/keranjang`.
2. **Aturan Sistem**:
   - Key localStorage: `kw_cart_v1`.
   - Struktur item keranjang: `{ productId, slug, name, image, price, variantId, variantLabel, qty }`.
   - Jika produk dengan varian sama sudah ada di keranjang, penambahan akan menambah `qty` (bukan duplikat).
   - Jika produk dihapus oleh penjual, item akan otomatis dihapus saat validasi backend dipanggil di checkout.
   - Subtotal dihitung ulang real-time.

### D. Checkout Otomatis ke WhatsApp
1. **Cara Kerja**: Di halaman `/checkout`, pembeli mengisi data (nama, no HP, alamat/catatan opsional). Sistem menampilkan ringkasan pesanan. Setelah menekan **"Kirim Pesanan ke WhatsApp"**, sistem:
   - Menyimpan order ke database (status default `baru`, source `whatsapp`).
   - Meng-generate format pesan WhatsApp yang rapi.
   - Membuka `https://wa.me/<NOMOR_PENJUAL>?text=<PESAN_URL_ENCODED>` di tab baru.
2. **Aturan Sistem**:
   - Semantic pesan mengikuti template dari pengaturan toko, default:
     ```
     Halo *{nama_toko}*, saya mau pesan:

     1. {nama_produk} {varian}
        Jumlah: {qty}
        Harga: Rp{harga}
        Subtotal: Rp{subtotal}
     2. ...

     Total: Rp{total}
     Nama: {nama_pembeli}
     No. HP: {no_hp}
     Alamat/Catatan: {catatan}

     Mohon dikonfirmasi ketersediaan & ongkirnya ya. Terima kasih 🙏
     ```
   - Nomor WhatsApp diambil dari pengaturan toko, dinormalisasi ke format internasional (62xxxx, tanpa `+` dan tanpa leading `0`).
   - Pesan di-encode menggunakan `encodeURIComponent` sebelum ditempel ke `wa.me`.
   - Jika `wa.me` gagal dibuka (pop-up blocked), sediakan fallback tombol salin pesan ke clipboard.

### E. Manajemen Produk (Admin)
1. **Cara Kerja**: Admin masuk ke `/admin/produk`, melihat tabel produk, lalu menekan "Tambah Produk" atau ikon edit pada baris. Form menampilkan field: nama, slug (auto dari nama), deskripsi, harga, stok, kategori, foto (multi-upload), varian, status aktif/draft.
2. **Aturan Sistem**:
   - Slug wajib unik; jika bentrok, sistem menambahkan suffix `-2`, `-3`, dst.
   - Foto minimal 1, maksimal 5, ukuran per file ≤ 2MB, format `jpg/jpeg/png/webp`.
   - Stok `0` tetap diizinkan namun produk akan tampil "Stok Habis" di publik.
   - Soft delete: produk yang dihapus hanya di-set `deletedAt`, tidak dihapus permanen, agar histori pesanan tidak rusak.

### F. Rekapan Pesanan (Admin)
1. **Cara Kerja**: Setiap kali pembeli menekan tombol checkout WhatsApp, order dicatat. Admin melihat di `/admin/pesanan` lengkap dengan filter tanggal, filter status, dan pencarian nama pembeli. Admin bisa membuka detail dan mengubah status.
2. **Aturan Sistem**:
   - Status: `baru` → `diproses` → `selesai`, serta `batal`.
   - Order menyimpan snapshot harga & nama produk pada saat transaksi (agar perubahan harga produk tidak mengubah histori).
   - Kode order otomatis: `KW-YYYYMMDD-XXXX` (contoh `KW-20250425-0007`). Format ini ditampilkan dengan font Ubuntu Mono.

### G. Pengaturan Toko
1. **Cara Kerja**: Admin mengisi nama toko, logo, nomor WhatsApp tujuan (wajib), alamat, jam operasional, dan template pesan WhatsApp. Perubahan berlaku real-time di seluruh halaman publik.
2. **Aturan Sistem**:
   - Nomor WhatsApp wajib format valid Indonesia (`62` + 8–12 digit).
   - Template pesan mendukung placeholder: `{nama_toko}`, `{nama_pembeli}`, `{no_hp}`, `{catatan}`, `{total}`, dan blok `{items}` untuk daftar item.
   - Hanya ada 1 dokumen pengaturan (singleton) dengan id tetap.

---

## 7. Alur Navigasi & Arsitektur Layout
*Peta navigasi alur halaman dan struktur tata letak (layout).*

### Arsitektur Layout (Persisten)
- **Public Layout**: Header sticky di atas (logo + kolom pencarian + ikon keranjang dengan badge) dan Footer ringkas di bawah. Body menggunakan background gradient grey tipis.
- **Admin Layout**: Sidebar kiri (fixed) berisi menu admin, topbar kecil berisi nama admin dan tombol logout. Sidebar berubah menjadi drawer di mobile.
- **Checkout Layout**: Layout khusus minimalis tanpa sidebar, header ditampilkan dengan tombol kembali, fokus penuh pada form & ringkasan pesanan.

### Bagan Alur (Flowchart)
```mermaid
flowchart TD
    A[Pengunjung Buka Beranda] --> B[Lihat Grid Produk]
    B --> C{Aksi Pengunjung}
    C -- Cari/Filter --> B
    C -- Klik Produk --> D[Detail Produk]
    D --> E{Pilih Varian?}
    E -- Ya --> F[Pilih Varian + Qty]
    E -- Tidak --> F
    F --> G{Aksi}
    G -- Tambah Keranjang --> H[Simpan ke localStorage]
    H --> B
    G -- Beli Sekarang --> I[Halaman Checkout]
    H --> J[Buka Keranjang]
    J --> I
    I --> K[Isi Data Pembeli]
    K --> L[Validasi Form]
    L -- Gagal --> K
    L -- Sukses --> M[Simpan Order ke DB]
    M --> N[Generate Pesan WhatsApp]
    N --> O[Buka wa.me ke Nomor Penjual]
    O --> P[Penjual Terima Pesanan di WhatsApp]
    P --> Q[Admin Update Status Order di /admin/pesanan]
```

---

## 8. Kebutuhan Non-Fungsional (SEO, Keamanan, & Performa)
*Syarat wajib agar website siap rilis ke publik (production-ready).*
- **SEO**:
  - Tag `<title>` dinamis per halaman (`{Nama Produk} - {Nama Toko}` di halaman detail).
  - Meta description dinamis dari deskripsi produk.
  - Open Graph (`og:title`, `og:description`, `og:image`, `og:type=product`) untuk preview WhatsApp/FB.
  - Sitemap & `robots.txt` di-generate otomatis.
  - Structured Data JSON-LD tipe `Product` di halaman detail.
- **Keamanan**:
  - Sanitasi input di sisi server (Express) untuk mencegah XSS. Gunakan library `express-mongo-sanitize` / `helmet` untuk MongoDB, atau prepared statement untuk PostgreSQL.
  - Validasi skema input menggunakan `zod` di setiap endpoint.
  - Password admin di-hash dengan `bcrypt` (cost 12).
  - JWT httpOnly cookie untuk sesi admin + `SameSite=Lax` + Secure di production.
  - Rate limiting di endpoint publik (`/api/orders`, `/api/products`) menggunakan `express-rate-limit`.
  - Upload gambar divalidasi MIME + ukuran, disimpan server-side dengan nama acak (bukan user-provided), bukan langsung ke folder publik nama asli.
- **Performa**:
  - Gambar produk dikompresi ke WebP dengan `sharp` saat upload, thumbnail 400px dan full 1200px.
  - Lazy loading (`loading="lazy"`) pada gambar produk di grid.
  - Caching respons API produk publik dengan `Cache-Control: public, max-age=60`.
  - Vite code-splitting per rute (dynamic import) agar bundle awal < 250KB gzip.

---

## 9. Panduan Bahasa, Copywriting, & Data Dummy
*Panduan nada bicara (Tone of Voice) dan contoh data agar prototipe terasa nyata.*
- **Gaya Bahasa**: Profesional, ramah, membumi, menggunakan kata "Anda" untuk pembeli dan "kami" untuk toko. Ringkas dan tidak bertele-tele, karena pembeli ingin cepat.
- **Instruksi Data Dummy**: JANGAN PERNAH MENGGUNAKAN "Lorem Ipsum". Selalu gunakan data dummy berbahasa Indonesia yang relevan dengan konteks toko/katalog.

**Contoh Data Dummy — Produk**:
- Nama: "Kaos Oversize Cotton Combed 24s Hitam"
- Slug: `kaos-oversize-cotton-combed-24s-hitam`
- Deskripsi: "Kaos oversize bahan cotton combed 24s, adem, jahitan rapi double-stitch. Cocok untuk pria & wanita."
- Harga: `89000`
- Varian: Ukuran `S/M/L/XL`, Warna `Hitam/Putih/Navy`
- Stok: `42`

**Contoh Data Dummy — Produk Lain**:
- "Kemeja Flanel Lengan Panjang Motif Kotak-Kotak" — Rp 165.000
- "Tote Bag Kanvas Custom Sablon" — Rp 55.000
- "Sepatu Sneakers Putih Basic Unisex" — Rp 245.000
- "Topi Baseball Polos Bordir" — Rp 45.000
- "Tumbler Stainless 500ml Anti Bocor" — Rp 78.000

**Contoh Data Dummy — Kategori**:
- Fashion Pria
- Fashion Wanita
- Aksesoris
- Perlengkapan Rumah

**Contoh Data Dummy — Pesanan**:
- Kode: `KW-20250425-0007`
- Pembeli: "Rina Kusuma", HP: "081234567890"
- Alamat: "Jl. Melati No. 12, RT 03/RW 05, Bandung"
- Item: Kaos Oversize Hitam (L) × 2 @ Rp 89.000
- Status: `baru`
- Total: Rp 178.000

**Contoh Data Dummy — Pengaturan Toko**:
- Nama: "Toko Rapi Jaya"
- WhatsApp: `6281234567890`
- Alamat: "Jl. Kenanga No. 45, Bandung"
- Jam Operasional: "Senin–Sabtu, 09.00–20.00 WIB"

---

## 10. Fondasi Teknis (Untuk Tim Pengembang / Programmer & AI)
*Petunjuk arsitektur teknis spesifik.*
- **Frontend**: React 18 + Vite + TypeScript, React Router v6, TanStack Query (React Query) untuk fetch & cache data API, Zustand untuk state keranjang & UI.
- **Tampilan Antarmuka (UI)**: Tailwind CSS v3 + shadcn/ui (dikonfigurasi) + Lucide Icons + `tailwindcss-animate`.
- **Backend**: Node.js 20 + Express 4 + TypeScript, `zod` untuk validasi, `multer` + `sharp` untuk upload & kompres gambar, `jsonwebtoken` + `bcryptjs` untuk auth admin.
- **Autentikasi**: JWT admin (single-role). Token disimpan di httpOnly cookie, refresh sederhana dengan expiry 7 hari.
- **Basis Data (Database)**: **PostgreSQL** (via Neon / Supabase) dengan **Drizzle ORM** (Skema PostgreSQL disediakan di bawah). *(Alternatif MongoDB disediakan sebagai catatan opsional.)*
- **Deployment**: VPS (Docker Compose: Node + Postgres) atau Vercel (frontend) + Railway/Fly.io (backend + Postgres).
- **Storage Gambar**: Lokal (folder `uploads/` disajikan sebagai static) untuk MVP; mudah dimigrasi ke Cloudinary/S3 di kemudian hari.

### Struktur Skema Database Nyata (PostgreSQL + Drizzle ORM)
```typescript
// server/src/db/schema.ts
import { pgTable, uuid, varchar, text, integer, timestamp, boolean, jsonb, pgEnum, index } from "drizzle-orm/pg-core";

export const orderStatusEnum = pgEnum("order_status", ["baru", "diproses", "selesai", "batal"]);
export const productStatusEnum = pgEnum("product_status", ["draft", "aktif"]);

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 80 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  icon: varchar("icon", { length: 60 }),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 180 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  description: text("description"),
  price: integer("price").notNull(),          // dalam Rupiah (integer, tanpa desimal)
  stock: integer("stock").default(0).notNull(),
  categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
  images: jsonb("images").$type<string[]>().default([]).notNull(),
  status: productStatusEnum("status").default("aktif").notNull(),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  idxName: index("idx_products_name").on(t.name),
}));

export const productVariants = pgTable("product_variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  label: varchar("label", { length: 80 }).notNull(),     // contoh: "Ukuran L / Hitam"
  priceDelta: integer("price_delta").default(0).notNull(),
  stock: integer("stock").default(0).notNull(),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 32 }).notNull().unique(),  // KW-YYYYMMDD-XXXX
  buyerName: varchar("buyer_name", { length: 120 }).notNull(),
  buyerPhone: varchar("buyer_phone", { length: 25 }).notNull(),
  buyerNote: text("buyer_note"),
  total: integer("total").notNull(),
  status: orderStatusEnum("status").default("baru").notNull(),
  source: varchar("source", { length: 20 }).default("whatsapp").notNull(),
  rawWhatsappMessage: text("raw_whatsapp_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
  productName: varchar("product_name", { length: 180 }).notNull(), // snapshot
  variantLabel: varchar("variant_label", { length: 120 }),
  price: integer("price").notNull(),     // snapshot harga saat transaksi
  qty: integer("qty").notNull(),
  subtotal: integer("subtotal").notNull(),
});

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 120 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  passwordHash: varchar("password_hash", { length: 200 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const storeSettings = pgTable("store_settings", {
  id: varchar("id", { length: 20 }).primaryKey().default("singleton"),
  storeName: varchar("store_name", { length: 120 }).notNull(),
  logoUrl: text("logo_url"),
  whatsappNumber: varchar("whatsapp_number", { length: 20 }).notNull(),
  address: text("address"),
  openHours: varchar("open_hours", { length: 120 }),
  messageTemplate: text("message_template").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

### Variabel Lingkungan (`.env.example`)
```env
# ===== Backend (server) =====
NODE_ENV=development
PORT=4000
APP_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173

# Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/katalog_whatsapp?sslmode=require

# JWT Admin
JWT_SECRET=ganti_dengan_string_random_panjang_minimal_32_karakter
JWT_EXPIRES_IN=7d

# Upload
UPLOAD_DIR=./uploads
MAX_UPLOAD_MB=2

# Rate Limit
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=60

# ===== Frontend (client) =====
VITE_API_BASE_URL=http://localhost:4000/api
VITE_APP_NAME=Katalog WhatsApp
```

---

## 11. Tahapan Pengerjaan & Task Breakdown (Actionable Work Breakdown Structure)
*Daftar tugas terstruktur dan terurut (Atomic Tasks). Dirancang khusus agar pengguna dapat menginstruksikan AI Coding Assistant (Antigravity, Cursor, Claude Code, Roo Code, dll.) untuk mengeksekusi proyek langkah demi langkah per **Fase (Milestone)** — setiap fase diselesaikan tuntas dalam satu putaran, lalu AI berhenti dan menunggu konfirmasi user sebelum masuk fase berikutnya.*

### Fase 1: Fondasi Proyek, UI/UX, & Seluruh Halaman Frontend (Dummy Data)
*Tujuan: Membangun seluruh antarmuka visual 100% lengkap dan responsif menggunakan data dummy di sisi frontend (React + Vite) sebelum menyentuh backend & database.*
- [ ] **Task 1.1 (Inisialisasi Proyek & Design System)**: Setup proyek `client/` dengan Vite + React + TypeScript. Konfigurasi Tailwind dengan token warna (primary `#1A1A1A`, accent `#25D366`, gradient grey tipis, border `#E5E7EB`), font `Idealist Sans` (heading), `Manrope` (body), `Ubuntu Mono` (mono), serta utility class `text-shadow-custom` (`text-shadow: 0 0 1.8px`). Install `lucide-react`, `react-router-dom`, `zustand`, dan base UI components (Button, Card, Input, Badge, Dialog, Tabs, Table).
- [ ] **Task 1.2 (Layout Publik & Mock Data)**: Buat `PublicLayout` dengan Header sticky (logo, search bar, ikon keranjang dengan badge) + Footer. Siapkan file `client/src/mocks/products.ts`, `categories.ts`, `orders.ts`, `storeSettings.ts` berisi data dummy Bahasa Indonesia (lihat Bab 9). Buat `CartStore` (Zustand) + persist ke `localStorage` key `kw_cart_v1`.
- [ ] **Task 1.3 (Halaman Publik: Beranda, Kategori, Detail Produk)**: Buat halaman `/` (grid card produk mobile-first 2 kolom, chip kategori, pencarian debounce), `/kategori/:slug`, dan `/produk/:slug` (galeri foto, pilih varian, qty picker, tombol "Tambah ke Keranjang" & "Beli via WhatsApp"). Semua data dari mock.
- [ ] **Task 1.4 (Halaman Publik: Keranjang, Checkout, Tentang, FAQ)**: Buat `/keranjang` (edit qty, hapus, subtotal), `/checkout` (form nama/no HP/alamat + ringkasan + tombol hijau "Kirim Pesanan ke WhatsApp" yang meng-generate `wa.me` link dari template di Bab 6.D), `/tentang`, dan `/faq`. Gunakan mock nomor WA `6281234567890`.
- [ ] **Task 1.5 (Halaman Admin: Layout, Login, Dasbor, Produk, Kategori)**: Buat `AdminLayout` (sidebar fixed + drawer mobile). Buat `/admin/login` (form + redirect dummy), `/admin` (stat cards + tabel 5 pesanan terbaru), `/admin/produk` (tabel CRUD dummy + filter + search), `/admin/produk/baru`, `/admin/produk/:id/edit` (form + photo upload preview mock), `/admin/kategori` (tabel CRUD dummy).
- [ ] **Task 1.6 (Halaman Admin: Pesanan & Pengaturan)**: Buat `/admin/pesanan` (tabel dengan filter tanggal/status, modal detail, tombol ubah status), dan `/admin/pengaturan` (form pengaturan toko + template pesan WhatsApp dengan preview render real-time). Semua menggunakan mock data.
- [ ] **Task 1.7 (Penyempurnaan UI & Responsif)**: Audit seluruh halaman: pastikan border 1px konsisten, `text-shadow: 0 0 1.8px` diterapkan pada seluruh body & input, font heading/body/mono sesuai pedoman, gradient background grey tipis diterapkan, dan tampilan optimal di viewport 360px, 430px, 768px, dan 1280px.

### Fase 2: Backend, Database, Autentikasi, & Integrasi Data Dinamis
*Tujuan: Menghidupkan aplikasi dengan PostgreSQL + Express nyata, autentikasi admin, dan seluruh endpoint API.*
- [ ] **Task 2.1 (Setup Backend & Database Schema)**: Inisialisasi `server/` (Express + TypeScript). Konfigurasi Drizzle ORM + PostgreSQL (`DATABASE_URL`). Buat file `server/src/db/schema.ts` persis sesuai Bab 10 (tabel `categories`, `products`, `product_variants`, `orders`, `order_items`, `admin_users`, `store_settings`). Jalankan migrasi. Buat seed script berisi kategori, 6 produk contoh, dan 1 admin (`admin@katalogwa.id` / password di-hash).
- [ ] **Task 2.2 (Autentikasi Admin & Middleware)**: Buat endpoint `POST /api/auth/login` (bcrypt verify + JWT httpOnly cookie), `POST /api/auth/logout`, `GET /api/auth/me`. Buat middleware `requireAdmin` yang memvalidasi JWT di setiap rute `/api/admin/*`. Terapkan `helmet`, `cors` dengan origin dari env, `express-rate-limit` global.
- [ ] **Task 2.3 (API Publik: Produk, Kategori, Pengaturan)**: Buat endpoint `GET /api/products` (pagination, search `?q=`, filter `?category=`, hanya status `aktif` & `deletedAt null`), `GET /api/products/:slug`, `GET /api/categories`, `GET /api/settings`. Terapkan `Cache-Control: public, max-age=60` untuk produk & kategori.
- [ ] **Task 2.4 (API Publik: Orders & Upload)**: Buat `POST /api/orders` dengan validasi Zod (nama, phone `^62\d{8,13}$` setelah normalisasi, items non-empty, total dihitung ulang dari harga server untuk mencegah manipulasi). Generate kode `KW-YYYYMMDD-XXXX`. Endpoint `POST /api/uploads` (multer + sharp → WebP dual-size) dengan validasi MIME & ukuran.
- [ ] **Task 2.5 (API Admin: CRUD Produk & Kategori)**: Buat endpoint protected: `GET/POST/PUT/DELETE /api/admin/products`, `POST /api/admin/products/:id/variants`, `GET/POST/PUT/DELETE /api/admin/categories`. Auto-generate slug unik. Soft delete (`deletedAt`). Validasi Zod di semua endpoint.
- [ ] **Task 2.6 (API Admin: Orders, Settings, Statistik)**: Buat `GET /api/admin/orders` (filter tanggal/status/search), `PATCH /api/admin/orders/:id/status`, `GET/PUT /api/admin/settings` (singleton), dan `GET /api/admin/dashboard/stats` (jumlah produk, kategori, pesanan hari ini/bulan ini).
- [ ] **Task 2.7 (Frontend Data Binding & Mutations)**: Pasang TanStack Query di `client/`, buat API client di `client/src/lib/api.ts` (axios/fetch + interceptor cookie). Ganti seluruh mock di Fase 1 dengan panggilan API nyata (halaman publik, `/admin/login` dengan redirect, CRUD produk/kategori/pesanan/pengaturan, upload gambar). Simpan order ke DB di `/checkout` **sebelum** membuka `wa.me`. Tambahkan guard route untuk `/admin/*` (redirect ke `/admin/login` jika belum terautentikasi).

### Fase 3: Penyempurnaan, SEO, Keamanan, Pengujian, & Deployment
*Tujuan: Menyempurnakan detail, mengamankan, mengoptimalkan, menguji end-to-end, dan merilis ke production.*
- [ ] **Task 3.1 (SEO, Meta, & Structured Data)**: Pasang dynamic `<title>`, meta description, Open Graph, dan JSON-LD `Product` di `/produk/:slug` menggunakan `react-helmet-async`. Generate `sitemap.xml` & `robots.txt` dari endpoint `GET /api/products` (all slugs).
- [ ] **Task 3.2 (Keamanan Lanjutan & Hardening)**: Pastikan sanitasi input XSS di semua endpoint, validasi Zod di semua payload, proteksi CSRF tidak diperlukan karena JWT httpOnly + SameSite=Lax, rate-limit ketat di `POST /api/orders` (10 req/menit/IP), validasi path upload anti-traversal, CORS `credentials: true` dengan whitelist origin.
- [ ] **Task 3.3 (End-to-End Testing Manual & Bugfix)**: Uji alur: (1) pembeli memilih produk → keranjang → checkout → pesan WhatsApp terkirim rapi ke nomor toko; (2) order tercatat di `/admin/pesanan` dengan kode & status `baru`; (3) admin tambah produk baru + upload gambar → muncul di beranda; (4) pengaturan nomor WA diubah → link checkout mengikuti. Perbaiki bug UI mobile, hint `text-shadow`, layout overflow, dan timezone kode order (`Asia/Jakarta`).
- [ ] **Task 3.4 (Build & Deployment Production)**: Konfigurasi `.env.production` (backend & frontend), pastikan `npm run build` di `client/` dan `tsc` di `server/` lolos tanpa error. Deploy: `client/` ke Vercel/Netlify, `server/` + PostgreSQL ke VPS (Docker Compose) atau Railway/Fly.io. Set `NODE_ENV=production`, aktifkan Secure cookie, dan backup harian Postgres.

---

## 12. Master Starter Prompt (Siap Coding untuk AI Agent)
*Salin prompt di bawah ini ke AI Coding Assistant (Google Antigravity / Cursor / Claude Code / GitHub Copilot / Roo Code / dll.) untuk memulai pengerjaan:*

```markdown
Halo! Kamu berperan sebagai Senior Fullstack Architect dan Lead Developer.
Saya ingin membangun aplikasi "Katalog WhatsApp" berdasarkan dokumen PRD ini.

Silakan baca file @PRD.md secara menyeluruh.

TECH STACK WAJIB (JANGAN DIUBAH):
- Frontend: React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui + TanStack Query + Zustand + Lucide Icons + react-router-dom.
- Backend: Node.js 20 + Express 4 + TypeScript + Drizzle ORM + Zod + multer/sharp + JWT (bcryptjs).
- Database: PostgreSQL (Neon/Supabase).
- Design System: patuhi Bab 4 (border tipis 1px, gradasi grey tipis, font heading Idealist Sans, body Manrope, mono Ubuntu Mono, dan WAJIB text-shadow: 0 0 1.8px pada body & input).

ATURAN EKSEKUSI (WAJIB DIPATUHI — MODE "PHASE"):
1. JANGAN PERNAH membuat semua kode atau file sekaligus dalam satu waktu agar tidak terjadi error atau kehabisan token.
2. Kerjakan Bab 11 secara BERTAHAP PER FASE. Mulai dari **Fase 1** dan SELESAIKAN FASE 1 SECARA TUNTAS dalam satu putaran (seluruh Task 1.1 sampai Task 1.7) sebelum berhenti.
3. Setelah Fase 1 selesai, WAJIB berhenti, laporkan ringkasan apa yang telah dikerjakan (daftar file, halaman/halaman yang sudah dibuat, dan instruksi cara menjalankan `npm run dev`), lalu MENUNGGU izin eksplisit dari saya sebelum melanjutkan ke Fase 2.
4. Setelah saya beri izin, lanjutkan ke Fase 2 dan SELESAIKAN tuntas (Task 2.1 sampai 2.7), lalu berhenti lagi dan minta konfirmasi untuk lanjut ke Fase 3.
5. Fase 3 dikerjakan setelah izin eksplisit saya, lalu selesaikan tuntas (Task 3.1 sampai 3.4).
6. Selalu patuhi skema database di Bab 10, halaman & rute di Bab 3, pedoman UI/UX di Bab 4, dan data dummy Bahasa Indonesia di Bab 9. DILARANG membuat halaman "placeholder" atau "coming soon" — semua halaman harus dibuat penuh dengan data dummy di Fase 1.

Jika kamu sudah membaca dan memahami PRD ini, silakan berikan ringkasan singkat pemahamanmu (tech stack, daftar halaman, dan rencana Fase 1), lalu tanyakan kesiapan saya untuk mulai mengeksekusi Fase 1!
```