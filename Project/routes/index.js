const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');


router.param('id', (req, res, next, id) => {
  if (/^\d+$/.test(id)) return next();
  if (req.path.startsWith('/api/')) return res.status(404).json({ message: 'ID tidak valid' });
  res.status(404).send('Produk tidak ditemukan');
});

// Halaman pengunjung (tanpa login)
router.get('/', productController.renderDashboard);
router.get('/katalog', productController.renderKatalog);
router.get('/produk/:id', productController.renderDetail);
router.get('/chatbot', productController.renderChatbot);

// Endpoint API
router.get('/api/status', productController.getStatus);
router.get('/api/produk', productController.getApiProducts);
router.get('/api/produk/:id', productController.getApiProductById);
router.post('/api/produk', productController.createApiProduct);
router.put('/api/produk/:id', productController.updateApiProduct);
router.delete('/api/produk/:id', productController.deleteApiProduct);

module.exports = router;