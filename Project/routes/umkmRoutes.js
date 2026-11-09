const express = require('express');
const router = express.Router();
const umkm = require('../controllers/umkmController');
const umkmAktif = require('../middlewares/umkmAktif');
const { uploadFoto } = require('../middlewares/upload');

// ID di URL harus angka
router.param('id', (req, res, next, id) => {
  if (!/^\d+$/.test(id)) return res.status(404).send('ID tidak valid');
  next();
});

// Form pendaftaran (tidak butuh UMKM aktif)
router.get('/umkm/pendaftaran', umkm.renderFormPendaftaran);
router.post('/umkm/pendaftaran', uploadFoto('foto'), umkm.storePendaftaran);

// Halaman pemilik UMKM
router.get('/umkm/dashboard', umkmAktif, umkm.renderDashboard);

router.get('/umkm/produk', umkmAktif, umkm.renderKelolaProduk);
router.post('/umkm/produk', umkmAktif, uploadFoto('gambar'), umkm.tambahProduk);
router.post('/umkm/produk/:id/edit', umkmAktif, uploadFoto('gambar'), umkm.ubahProduk);
router.post('/umkm/produk/:id/hapus', umkmAktif, umkm.hapusProduk);

router.get('/umkm/akun', umkmAktif, umkm.renderAkun);
router.post('/umkm/akun', umkmAktif, umkm.ubahAkun);

module.exports = router;