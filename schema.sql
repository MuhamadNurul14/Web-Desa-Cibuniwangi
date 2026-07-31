-- =========================================================
-- DATABASE: cibuniwangi
-- Website Desa Cibuniwangi - Full Schema
-- =========================================================
CREATE DATABASE IF NOT EXISTS cibuniwangi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cibuniwangi;

-- ============================
-- 1. USERS / ADMIN
-- ============================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('superadmin','admin','editor') DEFAULT 'admin',
  photo VARCHAR(255),
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================
-- 2. PROFILE DESA
-- ============================
CREATE TABLE profile_desa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_desa VARCHAR(150) NOT NULL,
  logo VARCHAR(255),
  tentang_kami TEXT,
  visi TEXT,
  misi TEXT,
  sejarah TEXT,
  geografis TEXT,
  luas_wilayah VARCHAR(100),
  batas_utara VARCHAR(150),
  batas_selatan VARCHAR(150),
  batas_timur VARCHAR(150),
  batas_barat VARCHAR(150),
  peta_embed TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================
-- 3. DEMOGRAFI DESA
-- ============================
CREATE TABLE demografi_desa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tahun YEAR NOT NULL,
  jumlah_penduduk INT DEFAULT 0,
  jumlah_kk INT DEFAULT 0,
  laki_laki INT DEFAULT 0,
  perempuan INT DEFAULT 0,
  keterangan TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- 4. PEMERINTAHAN
-- ============================
CREATE TABLE struktur_organisasi (
  id INT AUTO_INCREMENT PRIMARY KEY,
  judul VARCHAR(150) NOT NULL,
  file_bagan VARCHAR(255) NOT NULL, -- gambar bagan struktur
  keterangan TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE perangkat_desa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(150) NOT NULL,
  jabatan VARCHAR(100) NOT NULL,
  nip VARCHAR(50),
  foto VARCHAR(255),
  periode VARCHAR(50),
  urutan INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE lembaga_desa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_lembaga VARCHAR(150) NOT NULL,
  singkatan VARCHAR(50),
  deskripsi TEXT,
  ketua VARCHAR(150),
  logo VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================
-- 5. LAYANAN PUBLIK
-- ============================
CREATE TABLE layanan_publik (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_layanan VARCHAR(150) NOT NULL,
  kategori VARCHAR(100),
  deskripsi TEXT,
  syarat TEXT,
  icon VARCHAR(100),
  estimasi_waktu VARCHAR(100),
  biaya VARCHAR(100) DEFAULT 'Gratis',
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE pengajuan_layanan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  layanan_id INT,
  nama_pemohon VARCHAR(150) NOT NULL,
  nik VARCHAR(20),
  no_hp VARCHAR(20),
  email VARCHAR(100),
  alamat TEXT,
  keperluan TEXT,
  file_lampiran VARCHAR(255),
  status ENUM('diajukan','diproses','selesai','ditolak') DEFAULT 'diajukan',
  catatan_admin TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (layanan_id) REFERENCES layanan_publik(id) ON DELETE SET NULL
);

-- ============================
-- 6. INFORMASI: BERITA / PENGUMUMAN / AGENDA
-- ============================
CREATE TABLE kategori_berita (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_kategori VARCHAR(100) NOT NULL
);

CREATE TABLE berita (
  id INT AUTO_INCREMENT PRIMARY KEY,
  judul VARCHAR(200) NOT NULL,
  slug VARCHAR(220) UNIQUE NOT NULL,
  kategori_id INT,
  thumbnail VARCHAR(255),
  konten LONGTEXT,
  penulis VARCHAR(100),
  status ENUM('draft','published') DEFAULT 'draft',
  dilihat INT DEFAULT 0,
  tanggal_publish DATE,
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (kategori_id) REFERENCES kategori_berita(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE pengumuman (
  id INT AUTO_INCREMENT PRIMARY KEY,
  judul VARCHAR(200) NOT NULL,
  isi TEXT,
  file_lampiran VARCHAR(255),
  tanggal_mulai DATE,
  tanggal_selesai DATE,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE agenda_kegiatan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_kegiatan VARCHAR(200) NOT NULL,
  deskripsi TEXT,
  lokasi VARCHAR(200),
  tanggal_mulai DATETIME NOT NULL,
  tanggal_selesai DATETIME,
  penyelenggara VARCHAR(150),
  poster VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================
-- 7. GALERI (FOTO & VIDEO)
-- ============================
CREATE TABLE galeri (
  id INT AUTO_INCREMENT PRIMARY KEY,
  judul VARCHAR(200) NOT NULL,
  tipe ENUM('foto','video') DEFAULT 'foto',
  file_path VARCHAR(255), -- untuk foto (upload)
  video_url VARCHAR(255), -- untuk video (youtube embed link)
  keterangan TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- 8. APB DESA (TRANSPARANSI ANGGARAN)
-- ============================
CREATE TABLE apb_desa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tahun_anggaran YEAR NOT NULL,
  jenis ENUM('pendapatan','belanja','pembiayaan') NOT NULL,
  uraian VARCHAR(255) NOT NULL,
  jumlah_anggaran DECIMAL(18,2) DEFAULT 0,
  jumlah_realisasi DECIMAL(18,2) DEFAULT 0,
  file_dokumen VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================
-- 9. POTENSI DESA
-- ============================
CREATE TABLE potensi_desa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(200) NOT NULL,
  kategori ENUM('komoditas','umkm','wisata','lainnya') NOT NULL,
  deskripsi TEXT,
  alamat VARCHAR(255),
  kontak VARCHAR(100),
  foto VARCHAR(255),
  harga_range VARCHAR(100),
  jam_operasional VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================
-- 10. PRODUK HUKUM (PERPUSTAKAAN DIGITAL)
-- ============================
CREATE TABLE produk_hukum (
  id INT AUTO_INCREMENT PRIMARY KEY,
  jenis ENUM('Peraturan Desa','SK Kepala Desa','Peraturan Bersama','Lainnya') NOT NULL,
  nomor VARCHAR(100),
  tentang VARCHAR(255) NOT NULL,
  tahun YEAR,
  tanggal_ditetapkan DATE,
  file_dokumen VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================
-- 11. KONTAK
-- ============================
CREATE TABLE kontak_desa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  alamat_kantor TEXT,
  telepon VARCHAR(50),
  email VARCHAR(100),
  jam_operasional VARCHAR(150),
  latitude VARCHAR(50),
  longitude VARCHAR(50),
  facebook VARCHAR(255),
  instagram VARCHAR(255),
  youtube VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE kontak_pesan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(150) NOT NULL,
  email VARCHAR(100),
  no_hp VARCHAR(20),
  subjek VARCHAR(200),
  pesan TEXT NOT NULL,
  status ENUM('baru','dibaca','dibalas') DEFAULT 'baru',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- SEED DATA (default admin: admin / admin123)
-- ============================
INSERT INTO users (name, username, email, password, role) VALUES
('Super Admin', 'admin', 'admin@cibuniwangi.desa.id', '$2b$10$8K1p/a0dURXAM7BJs.dbe.YCPvL8oqZ0mFKvKvOZbAK0Jv1XN.EJC', 'superadmin');
-- password hash above corresponds to "admin123" (bcrypt, generated at setup - see README to regenerate)

INSERT INTO profile_desa (nama_desa, tentang_kami, visi, misi, sejarah, geografis, luas_wilayah)
VALUES ('Desa Cibuniwangi', 'Selamat datang di website resmi Desa Cibuniwangi.', 'Menjadi desa mandiri, maju, dan sejahtera.', 'Meningkatkan pelayanan publik dan transparansi anggaran.', 'Desa Cibuniwangi didirikan pada masa kolonial...', 'Terletak di dataran tinggi dengan potensi pertanian.', '450 Ha');

INSERT INTO kontak_desa (alamat_kantor, telepon, email, jam_operasional, latitude, longitude)
VALUES ('Jl. Raya Cibuniwangi No. 1, Kec. Contoh, Kab. Contoh', '(0263) 123456', 'kontak@cibuniwangi.desa.id', 'Senin-Jumat, 08:00-16:00 WIB', '-6.900000', '107.600000');
