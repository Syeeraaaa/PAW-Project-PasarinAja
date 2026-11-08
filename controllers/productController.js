
const produkModel = require('../models/productModel');
const config = require('../config/config');
const { formatRupiah } = require('../utils/formatter');

const Product = require('../models/productModel');

const renderHomePage = async (req, res) => {
    try {
        const produk = await Product.findAll();
        res.render('index', { appName: 'PasarinAja', produk });
    } catch (error) {
        console.error(error);
        res.status(500).send("Gagal memuat data dari database");
    }
};

const getStatus = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server berjalan dengan baik',
    timestamp: new Date().toISOString(),
  });
};

const getApiProducts = (req, res) => {
  res.status(200).json(produkModel.getAll());
};

module.exports = { renderHomePage, getStatus, getApiProducts };
