const express = require('express');
const router = express.Router();
const umkmController = require('../controllers/umkmController');

router.get('/umkm/dashboard', umkmController.renderDashboard);
router.get('/umkm/produk', umkmController.renderKelolaProduk);
router.get('/umkm/pendaftaran', umkmController.renderFormPendaftaran);
router.post('/umkm/pendaftaran', umkmController.storePendaftaran);
router.get('/umkm/akun', umkmController.renderAkun);

module.exports = router;