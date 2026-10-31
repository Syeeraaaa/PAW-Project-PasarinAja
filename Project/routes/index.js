const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Route Halaman Frontend (EJS)
router.get('/', productController.renderHomePage);

// Endpoint API
router.get('/api/status', productController.getStatus);
router.get('/api/produk', productController.getApiProducts);

module.exports = router;