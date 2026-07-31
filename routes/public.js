const express = require('express');
const router = express.Router();
const upload = require('../config/upload');
const pc = require('../controllers/publicController');

router.get('/', pc.home);

// 1. Profile Desa
router.get('/profile/tentang-kami', pc.tentangKami);
router.get('/profile/visi-misi', pc.visiMisi);
router.get('/profile/sejarah', pc.sejarah);
router.get('/profile/geografis', pc.geografis);
router.get('/profile/demografi', pc.demografi);

// 2. Pemerintahan
router.get('/pemerintahan/struktur-organisasi', pc.struktur);
router.get('/pemerintahan/perangkat-desa', pc.perangkat);
router.get('/pemerintahan/lembaga-desa', pc.lembaga);

// 3. Layanan
router.get('/layanan', pc.layanan);
router.post('/layanan', upload.single('file_lampiran'), pc.layananSubmit);

// 4. Informasi
router.get('/informasi/berita', pc.beritaList);
router.get('/informasi/berita/:slug', pc.beritaDetail);
router.get('/informasi/pengumuman', pc.pengumumanList);
router.get('/informasi/agenda', pc.agendaList);
router.get('/informasi/galeri', pc.galeriList);
router.get('/informasi/apb-desa', pc.apbDesa);

// 5. Potensi Desa
router.get('/potensi-desa', pc.potensi);

// 6. Produk Hukum
router.get('/produk-hukum', pc.produkHukum);

// 7. Kontak
router.get('/kontak', pc.kontak);
router.post('/kontak', pc.kontakSubmit);

module.exports = router;
