const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Halaman pengunjung (tanpa login)
router.get('/', productController.renderDashboard);
router.get('/katalog', productController.renderKatalog);
router.get('/produk/:id', productController.renderDetail);
router.get('/chatbot', productController.renderChatbot);

// Endpoint API
router.get('/api/status', productController.getStatus);
router.get('/api/produk', productController.getApiProducts);

module.exports = router;