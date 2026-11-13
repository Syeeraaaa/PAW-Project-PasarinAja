const express = require('express');
const router = express.Router();
const umkm = require('../controllers/umkmController');
const { wajibRole, muatUmkm, wajibUmkmDisetujui } = require('../middlewares/auth');
const { uploadFoto } = require('../middlewares/upload');

router.param('id', (req, res, next, id) => {
  if (!/^\d+$/.test(id)) return res.status(404).send('ID tidak valid');
  next();
});

// Semua halaman UMKM: harus login sebagai umkm, data UMKM-nya dimuat ke req.umkm
const hanyaUmkm = [wajibRole('umkm'), muatUmkm];
// Fitur produk: UMKM juga harus sudah disetujui admin
const umkmDisetujui = [...hanyaUmkm, wajibUmkmDisetujui];

router.get('/umkm/dashboard', hanyaUmkm, umkm.renderDashboard);

router.get('/umkm/pendaftaran', hanyaUmkm, umkm.renderFormPendaftaran);
router.post('/umkm/pendaftaran', hanyaUmkm, uploadFoto('foto'), umkm.storePendaftaran);

router.get('/umkm/produk', umkmDisetujui, umkm.renderKelolaProduk);
router.post('/umkm/produk', umkmDisetujui, uploadFoto('gambar'), umkm.tambahProduk);
router.post('/umkm/produk/:id/edit', umkmDisetujui, uploadFoto('gambar'), umkm.ubahProduk);
router.post('/umkm/produk/:id/hapus', umkmDisetujui, umkm.hapusProduk);

router.get('/umkm/akun', hanyaUmkm, umkm.renderAkun);
router.post('/umkm/akun', hanyaUmkm, umkm.ubahAkun);

module.exports = router;