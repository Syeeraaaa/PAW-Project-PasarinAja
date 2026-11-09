const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/admin/dashboard', adminController.renderDashboard);
router.get('/admin/data-umkm', adminController.renderDataUmkm);
router.get('/admin/data-produk', adminController.renderDataProduk);
router.get('/admin/akun', adminController.renderAkunAdmin);

module.exports = router;