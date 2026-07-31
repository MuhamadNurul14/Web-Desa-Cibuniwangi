const GenericModel = require('../models/GenericModel');
const pool = require('../config/db');

const ProfileDesa = new GenericModel('profile_desa');
const KontakDesa = new GenericModel('kontak_desa');
const Berita = new GenericModel('berita');
const Pengumuman = new GenericModel('pengumuman');
const Agenda = new GenericModel('agenda_kegiatan');
const Galeri = new GenericModel('galeri');
const Perangkat = new GenericModel('perangkat_desa');
const Lembaga = new GenericModel('lembaga_desa');
const Struktur = new GenericModel('struktur_organisasi');
const Layanan = new GenericModel('layanan_publik');
const Pengajuan = new GenericModel('pengajuan_layanan');
const Apbdesa = new GenericModel('apb_desa');
const Potensi = new GenericModel('potensi_desa');
const ProdukHukum = new GenericModel('produk_hukum');
const Demografi = new GenericModel('demografi_desa');
const KontakPesan = new GenericModel('kontak_pesan');

// Helper: always inject profile + kontak for header/footer
async function baseData() {
  const [profileRows, kontakRows] = await Promise.all([ProfileDesa.all(), KontakDesa.all()]);
  return { profile: profileRows[0] || {}, kontakInfo: kontakRows[0] || {} };
}

exports.home = async (req, res) => {
  const base = await baseData();
  const [berita, pengumuman, agenda, galeri] = await Promise.all([
    Berita.all('created_at DESC').then(r => r.filter(b => b.status === 'published').slice(0, 6)),
    Pengumuman.all('created_at DESC').then(r => r.filter(p => p.is_active).slice(0, 5)),
    Agenda.all('tanggal_mulai ASC').then(r => r.slice(0, 5)),
    Galeri.all().then(r => r.slice(0, 8))
  ]);
  res.render('public/home', { title: 'Beranda', ...base, berita, pengumuman, agenda, galeri });
};

// ---- Profile Desa ----
exports.tentangKami = async (req, res) => res.render('public/profile/tentang', { title: 'Tentang Kami', ...(await baseData()) });
exports.visiMisi = async (req, res) => res.render('public/profile/visi-misi', { title: 'Visi & Misi', ...(await baseData()) });
exports.sejarah = async (req, res) => res.render('public/profile/sejarah', { title: 'Sejarah Desa', ...(await baseData()) });
exports.geografis = async (req, res) => res.render('public/profile/geografis', { title: 'Geografis Desa', ...(await baseData()) });
exports.demografi = async (req, res) => {
  const data = await Demografi.all('tahun DESC');
  res.render('public/profile/demografi', { title: 'Demografi Desa', ...(await baseData()), data });
};

// ---- Pemerintahan ----
exports.struktur = async (req, res) => {
  const rows = await Struktur.all();
  res.render('public/pemerintahan/struktur', { title: 'Struktur Organisasi', ...(await baseData()), struktur: rows[0] || null });
};
exports.perangkat = async (req, res) => {
  const data = await Perangkat.all('urutan ASC');
  res.render('public/pemerintahan/perangkat', { title: 'Perangkat Desa', ...(await baseData()), data });
};
exports.lembaga = async (req, res) => {
  const data = await Lembaga.all();
  res.render('public/pemerintahan/lembaga', { title: 'Lembaga Desa', ...(await baseData()), data });
};

// ---- Layanan ----
exports.layanan = async (req, res) => {
  const data = await Layanan.all();
  res.render('public/layanan/index', { title: 'Layanan Publik', ...(await baseData()), data: data.filter(l => l.is_active) });
};
exports.layananSubmit = async (req, res) => {
  try {
    const { layanan_id, nama_pemohon, nik, no_hp, email, alamat, keperluan } = req.body;
    const file_lampiran = req.file ? req.file.filename : null;
    await Pengajuan.create({ layanan_id, nama_pemohon, nik, no_hp, email, alamat, keperluan, file_lampiran });
    req.flash('success', 'Pengajuan Anda berhasil dikirim. Kami akan segera memprosesnya.');
    res.redirect('/layanan');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Gagal mengirim pengajuan.');
    res.redirect('/layanan');
  }
};

// ---- Informasi ----
exports.beritaList = async (req, res) => {
  const data = await Berita.all('created_at DESC').then(r => r.filter(b => b.status === 'published'));
  res.render('public/informasi/berita-list', { title: 'Berita', ...(await baseData()), data });
};
exports.beritaDetail = async (req, res) => {
  const item = await Berita.findBy('slug', req.params.slug);
  if (!item) return res.status(404).render('public/404', { title: 'Tidak Ditemukan', ...(await baseData()) });
  await pool.query('UPDATE berita SET dilihat = dilihat + 1 WHERE id = ?', [item.id]);
  res.render('public/informasi/berita-detail', { title: item.judul, ...(await baseData()), item });
};
exports.pengumumanList = async (req, res) => {
  const data = await Pengumuman.all('created_at DESC').then(r => r.filter(p => p.is_active));
  res.render('public/informasi/pengumuman', { title: 'Pengumuman', ...(await baseData()), data });
};
exports.agendaList = async (req, res) => {
  const data = await Agenda.all('tanggal_mulai ASC');
  res.render('public/informasi/agenda', { title: 'Agenda Kegiatan', ...(await baseData()), data });
};
exports.galeriList = async (req, res) => {
  const data = await Galeri.all();
  res.render('public/informasi/galeri', {
    title: 'Galeri',
    ...(await baseData()),
    foto: data.filter(g => g.tipe === 'foto'),
    video: data.filter(g => g.tipe === 'video')
  });
};
exports.apbDesa = async (req, res) => {
  const data = await Apbdesa.all('tahun_anggaran DESC');
  const tahunList = [...new Set(data.map(d => d.tahun_anggaran))];
  res.render('public/informasi/apbdesa', { title: 'APB Desa (Transparansi Anggaran)', ...(await baseData()), data, tahunList });
};

// ---- Potensi Desa ----
exports.potensi = async (req, res) => {
  const data = await Potensi.all();
  res.render('public/potensi/index', {
    title: 'Potensi Desa',
    ...(await baseData()),
    komoditas: data.filter(p => p.kategori === 'komoditas'),
    umkm: data.filter(p => p.kategori === 'umkm'),
    wisata: data.filter(p => p.kategori === 'wisata'),
    lainnya: data.filter(p => p.kategori === 'lainnya')
  });
};

// ---- Produk Hukum ----
exports.produkHukum = async (req, res) => {
  const data = await ProdukHukum.all('tahun DESC');
  res.render('public/produk-hukum/index', { title: 'Produk Hukum', ...(await baseData()), data });
};

// ---- Kontak ----
exports.kontak = async (req, res) => res.render('public/kontak/index', { title: 'Kontak Kami', ...(await baseData()) });
exports.kontakSubmit = async (req, res) => {
  try {
    const { nama, email, no_hp, subjek, pesan } = req.body;
    await KontakPesan.create({ nama, email, no_hp, subjek, pesan });
    req.flash('success', 'Pesan Anda berhasil terkirim. Terima kasih telah menghubungi kami.');
    res.redirect('/kontak');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Gagal mengirim pesan.');
    res.redirect('/kontak');
  }
};
