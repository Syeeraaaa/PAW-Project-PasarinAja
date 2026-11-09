const express = require('express');
const router = express.Router();
const admin = require('../controllers/adminController');

// ID di URL harus angka
router.param('id', (req, res, next, id) => {
  if (!/^\d+$/.test(id)) return res.status(404).send('ID tidak valid');
  next();
});

router.get('/admin/dashboard', admin.renderDashboard);

// UMKM
router.get('/admin/umkm', admin.renderDataUmkm);
router.post('/admin/umkm', admin.tambahUmkm);
router.post('/admin/umkm/:id/edit', admin.ubahUmkm);
router.post('/admin/umkm/:id/verifikasi', admin.verifikasiUmkm);
router.post('/admin/umkm/:id/tolak', admin.tolakUmkm);
router.post('/admin/umkm/:id/hapus', admin.hapusUmkm);

// Produk
router.get('/admin/produk', admin.renderDataProduk);
router.post('/admin/produk/:id/edit', admin.ubahProduk);
router.post('/admin/produk/:id/verifikasi', admin.verifikasiProduk);
router.post('/admin/produk/:id/tolak', admin.tolakProduk);
router.post('/admin/produk/:id/hapus', admin.hapusProduk);

// Akun
router.get('/admin/akun', admin.renderAkunAdmin);

module.exports = router;