const GenericModel = require('../models/GenericModel');

exports.index = async (req, res) => {
  const tables = {
    berita: 'Berita',
    pengumuman: 'Pengumuman',
    agenda_kegiatan: 'Agenda Kegiatan',
    galeri: 'Galeri',
    layanan_publik: 'Layanan Publik',
    pengajuan_layanan: 'Pengajuan Masuk',
    apb_desa: 'Item APB Desa',
    potensi_desa: 'Potensi Desa',
    produk_hukum: 'Produk Hukum',
    kontak_pesan: 'Pesan Masuk'
  };

  const stats = {};
  for (const [table, label] of Object.entries(tables)) {
    const model = new GenericModel(table);
    stats[table] = { label, total: await model.count() };
  }

  const beritaModel = new GenericModel('berita');
  const [recentBerita, pengajuanBaru, pesanBaru] = await Promise.all([
    beritaModel.all('created_at DESC').then(r => r.slice(0, 5)),
    new GenericModel('pengajuan_layanan').all('created_at DESC').then(r => r.filter(x => x.status === 'diajukan').slice(0, 5)),
    new GenericModel('kontak_pesan').all('created_at DESC').then(r => r.filter(x => x.status === 'baru').slice(0, 5))
  ]);

  res.render('admin/dashboard', {
    title: 'Dashboard',
    stats,
    recentBerita,
    pengajuanBaru,
    pesanBaru
  });
};
