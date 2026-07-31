# Website Desa Cibuniwangi (Fullstack: Node.js + Express + MySQL + EJS)

Aplikasi Website Profil Desa lengkap dengan **Dashboard Admin CRUD** untuk mengelola seluruh konten secara dinamis.

## 🧱 Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MySQL (mysql2)
- **View Engine:** EJS + express-ejs-layouts
- **Auth:** express-session (session based) + bcryptjs
- **Upload File:** Multer (foto, dokumen PDF, dsb)
- **Frontend styling:** Bootstrap 5 + Bootstrap Icons (CDN, tanpa build step)

## 📁 Struktur Folder
```
cibuniwangi/
├── app.js                  # Entry point
├── schema.sql               # DDL lengkap + seed data
├── config/                  # db.js, upload.js, modules.js (registry semua modul CRUD)
├── controllers/              # authController, dashboardController, crudController (generic), publicController, dst
├── middleware/auth.js        # isAuthenticated, isSuperAdmin
├── models/GenericModel.js    # Model generic reusable untuk semua tabel
├── routes/admin.js           # Semua route /admin/* (dilindungi login)
├── routes/public.js          # Semua route publik sesuai struktur navigasi
├── views/admin/...           # Layout dashboard + CRUD generic (index & form)
├── views/public/...          # Halaman publik sesuai 7 menu navigasi
└── public/uploads/           # Folder hasil upload file
```

## ⚙️ Instalasi

1. **Clone / extract project**, lalu install dependency:
   ```bash
   cd cibuniwangi
   npm install
   ```

2. **Buat database** MySQL dan import schema:
   ```bash
   mysql -u root -p < schema.sql
   ```
   Script ini otomatis membuat database `cibuniwangi`, seluruh tabel, dan data awal
   (`profile_desa`, `kontak_desa`, dan 1 akun admin default).

3. **Konfigurasi environment**:
   ```bash
   cp .env.example .env
   # edit .env sesuai kredensial MySQL Anda
   ```

4. **Jalankan aplikasi**:
   ```bash
   npm run dev      # dengan nodemon (auto-reload)
   # atau
   npm start
   ```
   Buka:
   - Website publik: http://localhost:3000
   - Dashboard admin: http://localhost:3000/admin/login

## 🔐 Login Admin Default
```
Username : admin
Password : admin123
```
> ⚠️ **PENTING:** hash password pada `schema.sql` adalah contoh. Regenerasi hash yang valid untuk password pilihan Anda dengan:
> ```bash
> npm run hash-password -- admin123
> ```
> lalu update kolom `password` pada tabel `users` dengan hash yang dihasilkan (via phpMyAdmin/MySQL client), atau langsung lewat menu **Management User** setelah berhasil login pertama kali.

## 🗂️ Struktur Navigasi Publik (Frontend)
Sesuai spesifikasi:
1. **Profile Desa** — Tentang Kami, Visi Misi, Sejarah, Geografis, Demografi
2. **Pemerintahan** — Struktur Organisasi, Perangkat Desa, Lembaga Desa
3. **Layanan** — Layanan publik + form pengajuan surat/informasi
4. **Informasi** — Berita, Pengumuman, Agenda, Galeri, APB Desa
5. **Potensi Desa** — Komoditas, UMKM, Wisata, Potensi Lokal
6. **Produk Hukum** — Perpustakaan digital Perdes & SK Kades (download)
7. **Kontak** — Form hubungi kami + peta lokasi

## 🖥️ Dashboard Admin
- Login session-based (`express-session`), password di-hash `bcryptjs`.
- Role: `superadmin`, `admin`, `editor`. Menu **Management User** hanya untuk `superadmin`.
- Dashboard Overview menampilkan statistik jumlah Berita, Galeri, Layanan, APB Desa, Pengajuan Masuk, Pesan Masuk, dll.
- **CRUD generic**: seluruh modul (Berita, Pengumuman, Agenda, Galeri, Perangkat Desa, Lembaga Desa, Struktur Organisasi, Layanan Publik, Pengajuan Layanan, APB Desa, Potensi Desa, Produk Hukum, Demografi, Kontak Pesan) dikelola lewat satu controller/view generic yang terdaftar di `config/modules.js` — menambah modul baru cukup menambah 1 entri konfigurasi tanpa menulis controller/view baru.
- Upload file (foto, dokumen PDF, poster, bagan struktur) otomatis tersimpan ke `public/uploads` dan filenya lama otomatis dihapus saat diganti.
- **Profile Desa** & **Kontak Desa** dikelola sebagai data singleton (1 baris) lewat menu tersendiri.

## 🗄️ Struktur Database (`schema.sql`)
Tabel utama: `users`, `profile_desa`, `demografi_desa`, `struktur_organisasi`, `perangkat_desa`,
`lembaga_desa`, `layanan_publik`, `pengajuan_layanan`, `kategori_berita`, `berita`, `pengumuman`,
`agenda_kegiatan`, `galeri`, `apb_desa`, `potensi_desa`, `produk_hukum`, `kontak_desa`, `kontak_pesan`.

Semua relasi FK (`ON DELETE SET NULL`) & tipe data (ENUM, DECIMAL untuk anggaran, LONGTEXT untuk konten berita) sudah didefinisikan lengkap di `schema.sql`.

## 🔒 Keamanan
- Password di-hash dengan bcrypt (10 rounds).
- Session cookie 8 jam, `SESSION_SECRET` wajib diganti di production.
- Middleware `isAuthenticated` melindungi seluruh route `/admin/*` kecuali login.
- Middleware `isSuperAdmin` khusus melindungi Management User.
- Validasi tipe file upload (jpg/png/gif/webp/pdf/doc/docx/mp4) & limit ukuran 10MB via Multer.

## 📌 Catatan Pengembangan Lanjutan
- Untuk production, ganti session store default (MemoryStore) dengan `connect-redis` atau `express-mysql-session`.
- Tambahkan reCAPTCHA pada form Kontak & Pengajuan Layanan bila perlu.
- Untuk rich text editor konten Berita/Pengumuman, bisa integrasikan CKEditor/TinyMCE pada `views/admin/crud/form.ejs` (field bertipe `richtext`).
