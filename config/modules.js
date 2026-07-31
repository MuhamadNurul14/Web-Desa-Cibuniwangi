/**
 * Central registry of every content module manageable from the Admin Dashboard.
 * Each entry drives: menu, table listing, form fields, and file upload handling.
 *
 * field.type: text | textarea | richtext | number | date | datetime | select | file
 */
module.exports = {
  perangkat_desa: {
    label: 'Perangkat Desa',
    icon: 'bi-people',
    table: 'perangkat_desa',
    uploadField: 'foto',
    listColumns: ['id', 'nama', 'jabatan', 'periode'],
    fields: [
      { name: 'nama', label: 'Nama', type: 'text', required: true },
      { name: 'jabatan', label: 'Jabatan', type: 'text', required: true },
      { name: 'nip', label: 'NIP', type: 'text' },
      { name: 'periode', label: 'Periode Jabatan', type: 'text' },
      { name: 'urutan', label: 'Urutan Tampil', type: 'number' },
      { name: 'foto', label: 'Foto', type: 'file' }
    ]
  },
  lembaga_desa: {
    label: 'Lembaga Desa',
    icon: 'bi-diagram-3',
    table: 'lembaga_desa',
    uploadField: 'logo',
    listColumns: ['id', 'nama_lembaga', 'singkatan', 'ketua'],
    fields: [
      { name: 'nama_lembaga', label: 'Nama Lembaga', type: 'text', required: true },
      { name: 'singkatan', label: 'Singkatan', type: 'text' },
      { name: 'ketua', label: 'Ketua', type: 'text' },
      { name: 'deskripsi', label: 'Deskripsi', type: 'textarea' },
      { name: 'logo', label: 'Logo', type: 'file' }
    ]
  },
  struktur_organisasi: {
    label: 'Struktur Organisasi',
    icon: 'bi-diagram-2',
    table: 'struktur_organisasi',
    uploadField: 'file_bagan',
    listColumns: ['id', 'judul'],
    fields: [
      { name: 'judul', label: 'Judul', type: 'text', required: true },
      { name: 'keterangan', label: 'Keterangan', type: 'textarea' },
      { name: 'file_bagan', label: 'Bagan Struktur (Gambar)', type: 'file', required: true }
    ]
  },
  layanan_publik: {
    label: 'Layanan Publik',
    icon: 'bi-file-earmark-text',
    table: 'layanan_publik',
    listColumns: ['id', 'nama_layanan', 'kategori', 'biaya', 'is_active'],
    fields: [
      { name: 'nama_layanan', label: 'Nama Layanan', type: 'text', required: true },
      { name: 'kategori', label: 'Kategori', type: 'text' },
      { name: 'deskripsi', label: 'Deskripsi', type: 'textarea' },
      { name: 'syarat', label: 'Syarat', type: 'textarea' },
      { name: 'icon', label: 'Icon (bootstrap-icons class)', type: 'text' },
      { name: 'estimasi_waktu', label: 'Estimasi Waktu', type: 'text' },
      { name: 'biaya', label: 'Biaya', type: 'text' },
      { name: 'is_active', label: 'Aktif', type: 'select', options: [[1,'Aktif'],[0,'Nonaktif']] }
    ]
  },
  pengajuan_layanan: {
    label: 'Pengajuan Layanan (Masuk)',
    icon: 'bi-inbox',
    table: 'pengajuan_layanan',
    listColumns: ['id', 'nama_pemohon', 'nik', 'status', 'created_at'],
    readonly: ['nama_pemohon','nik','no_hp','email','alamat','keperluan','file_lampiran','layanan_id'],
    fields: [
      { name: 'nama_pemohon', label: 'Nama Pemohon', type: 'text', required: true },
      { name: 'nik', label: 'NIK', type: 'text' },
      { name: 'no_hp', label: 'No HP', type: 'text' },
      { name: 'email', label: 'Email', type: 'text' },
      { name: 'alamat', label: 'Alamat', type: 'textarea' },
      { name: 'keperluan', label: 'Keperluan', type: 'textarea' },
      { name: 'status', label: 'Status', type: 'select', options: [['diajukan','Diajukan'],['diproses','Diproses'],['selesai','Selesai'],['ditolak','Ditolak']] },
      { name: 'catatan_admin', label: 'Catatan Admin', type: 'textarea' }
    ]
  },
  kategori_berita: {
    label: 'Kategori Berita',
    icon: 'bi-tags',
    table: 'kategori_berita',
    listColumns: ['id', 'nama_kategori'],
    fields: [{ name: 'nama_kategori', label: 'Nama Kategori', type: 'text', required: true }]
  },
  berita: {
    label: 'Berita',
    icon: 'bi-newspaper',
    table: 'berita',
    uploadField: 'thumbnail',
    listColumns: ['id', 'judul', 'status', 'tanggal_publish', 'dilihat'],
    fields: [
      { name: 'judul', label: 'Judul', type: 'text', required: true },
      { name: 'kategori_id', label: 'Kategori ID', type: 'number' },
      { name: 'penulis', label: 'Penulis', type: 'text' },
      { name: 'konten', label: 'Konten', type: 'richtext', required: true },
      { name: 'tanggal_publish', label: 'Tanggal Publish', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', options: [['draft','Draft'],['published','Published']] },
      { name: 'thumbnail', label: 'Thumbnail', type: 'file' }
    ],
    hasSlug: true,
    slugSource: 'judul'
  },
  pengumuman: {
    label: 'Pengumuman',
    icon: 'bi-megaphone',
    table: 'pengumuman',
    uploadField: 'file_lampiran',
    listColumns: ['id', 'judul', 'tanggal_mulai', 'tanggal_selesai', 'is_active'],
    fields: [
      { name: 'judul', label: 'Judul', type: 'text', required: true },
      { name: 'isi', label: 'Isi', type: 'richtext' },
      { name: 'tanggal_mulai', label: 'Tanggal Mulai', type: 'date' },
      { name: 'tanggal_selesai', label: 'Tanggal Selesai', type: 'date' },
      { name: 'is_active', label: 'Aktif', type: 'select', options: [[1,'Aktif'],[0,'Nonaktif']] },
      { name: 'file_lampiran', label: 'Lampiran', type: 'file' }
    ]
  },
  agenda_kegiatan: {
    label: 'Agenda Kegiatan',
    icon: 'bi-calendar-event',
    table: 'agenda_kegiatan',
    uploadField: 'poster',
    listColumns: ['id', 'nama_kegiatan', 'lokasi', 'tanggal_mulai'],
    fields: [
      { name: 'nama_kegiatan', label: 'Nama Kegiatan', type: 'text', required: true },
      { name: 'deskripsi', label: 'Deskripsi', type: 'textarea' },
      { name: 'lokasi', label: 'Lokasi', type: 'text' },
      { name: 'tanggal_mulai', label: 'Tanggal Mulai', type: 'datetime' },
      { name: 'tanggal_selesai', label: 'Tanggal Selesai', type: 'datetime' },
      { name: 'penyelenggara', label: 'Penyelenggara', type: 'text' },
      { name: 'poster', label: 'Poster', type: 'file' }
    ]
  },
  galeri: {
    label: 'Galeri Foto & Video',
    icon: 'bi-images',
    table: 'galeri',
    uploadField: 'file_path',
    listColumns: ['id', 'judul', 'tipe'],
    fields: [
      { name: 'judul', label: 'Judul', type: 'text', required: true },
      { name: 'tipe', label: 'Tipe', type: 'select', options: [['foto','Foto'],['video','Video']] },
      { name: 'file_path', label: 'Upload Foto (jika tipe=Foto)', type: 'file' },
      { name: 'video_url', label: 'URL Video Youtube (jika tipe=Video)', type: 'text' },
      { name: 'keterangan', label: 'Keterangan', type: 'textarea' }
    ]
  },
  apb_desa: {
    label: 'APB Desa',
    icon: 'bi-cash-coin',
    table: 'apb_desa',
    uploadField: 'file_dokumen',
    listColumns: ['id', 'tahun_anggaran', 'jenis', 'uraian', 'jumlah_anggaran', 'jumlah_realisasi'],
    fields: [
      { name: 'tahun_anggaran', label: 'Tahun Anggaran', type: 'number', required: true },
      { name: 'jenis', label: 'Jenis', type: 'select', options: [['pendapatan','Pendapatan'],['belanja','Belanja'],['pembiayaan','Pembiayaan']] },
      { name: 'uraian', label: 'Uraian', type: 'text', required: true },
      { name: 'jumlah_anggaran', label: 'Jumlah Anggaran (Rp)', type: 'number' },
      { name: 'jumlah_realisasi', label: 'Jumlah Realisasi (Rp)', type: 'number' },
      { name: 'file_dokumen', label: 'Dokumen Pendukung (PDF)', type: 'file' }
    ]
  },
  potensi_desa: {
    label: 'Potensi Desa (UMKM/Wisata/Komoditas)',
    icon: 'bi-shop',
    table: 'potensi_desa',
    uploadField: 'foto',
    listColumns: ['id', 'nama', 'kategori', 'alamat'],
    fields: [
      { name: 'nama', label: 'Nama', type: 'text', required: true },
      { name: 'kategori', label: 'Kategori', type: 'select', options: [['komoditas','Komoditas'],['umkm','UMKM'],['wisata','Wisata'],['lainnya','Lainnya']] },
      { name: 'deskripsi', label: 'Deskripsi', type: 'textarea' },
      { name: 'alamat', label: 'Alamat', type: 'text' },
      { name: 'kontak', label: 'Kontak', type: 'text' },
      { name: 'harga_range', label: 'Kisaran Harga', type: 'text' },
      { name: 'jam_operasional', label: 'Jam Operasional', type: 'text' },
      { name: 'foto', label: 'Foto', type: 'file' }
    ]
  },
  produk_hukum: {
    label: 'Produk Hukum',
    icon: 'bi-file-earmark-lock',
    table: 'produk_hukum',
    uploadField: 'file_dokumen',
    listColumns: ['id', 'jenis', 'nomor', 'tentang', 'tahun'],
    fields: [
      { name: 'jenis', label: 'Jenis', type: 'select', options: [['Peraturan Desa','Peraturan Desa'],['SK Kepala Desa','SK Kepala Desa'],['Peraturan Bersama','Peraturan Bersama'],['Lainnya','Lainnya']] },
      { name: 'nomor', label: 'Nomor', type: 'text' },
      { name: 'tentang', label: 'Tentang', type: 'text', required: true },
      { name: 'tahun', label: 'Tahun', type: 'number' },
      { name: 'tanggal_ditetapkan', label: 'Tanggal Ditetapkan', type: 'date' },
      { name: 'file_dokumen', label: 'File Dokumen (PDF)', type: 'file', required: true }
    ]
  },
  demografi_desa: {
    label: 'Demografi Desa',
    icon: 'bi-bar-chart',
    table: 'demografi_desa',
    listColumns: ['id', 'tahun', 'jumlah_penduduk', 'jumlah_kk'],
    fields: [
      { name: 'tahun', label: 'Tahun', type: 'number', required: true },
      { name: 'jumlah_penduduk', label: 'Jumlah Penduduk', type: 'number' },
      { name: 'jumlah_kk', label: 'Jumlah KK', type: 'number' },
      { name: 'laki_laki', label: 'Laki-laki', type: 'number' },
      { name: 'perempuan', label: 'Perempuan', type: 'number' },
      { name: 'keterangan', label: 'Keterangan', type: 'textarea' }
    ]
  },
  kontak_pesan: {
    label: 'Pesan Masuk (Kontak)',
    icon: 'bi-envelope',
    table: 'kontak_pesan',
    listColumns: ['id', 'nama', 'email', 'subjek', 'status', 'created_at'],
    readonly: ['nama','email','no_hp','subjek','pesan'],
    fields: [
      { name: 'nama', label: 'Nama', type: 'text' },
      { name: 'email', label: 'Email', type: 'text' },
      { name: 'no_hp', label: 'No HP', type: 'text' },
      { name: 'subjek', label: 'Subjek', type: 'text' },
      { name: 'pesan', label: 'Pesan', type: 'textarea' },
      { name: 'status', label: 'Status', type: 'select', options: [['baru','Baru'],['dibaca','Dibaca'],['dibalas','Dibalas']] }
    ]
  }
};
