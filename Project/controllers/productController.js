const produkModel = require('../models/productModel');
const config = require('../config/config');
const { formatRupiah } = require('../utils/formatter');



const renderHomePage = (req, res) => {
  const produk = produkModel.getAll();
  res.render('index', { appName: config.appName, produk, formatRupiah });
};

const getStatus = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server berjalan dengan baik',
    timestamp: new Date().toISOString(),
  });
};

const getApiProducts = (req, res) => {
  res.status(200).json(Model.getAll());
};

module.exports = { renderHomePage, getStatus, getApiProducts };