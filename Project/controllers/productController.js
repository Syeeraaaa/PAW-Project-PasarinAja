const produkModel = require('../models/productModel');
const config = require('../config/config');
const { formatRupiah } = require('../utils/formatter');

// ---------- HALAMAN (EJS) ----------
const renderDashboard = (req, res) => {
  res.render('publik/dashboard', { appName: config.appName });
};

const renderKatalog = async (req, res, next) => {
  try {
    const q = req.query.q || '';
    const produk = await produkModel.search(q);
    res.render('publik/katalog', { appName: config.appName, produk, q, formatRupiah });
  } catch (error) {
    next(error);
  }
};

const renderDetail = async (req, res, next) => {
  try {
    const produk = await produkModel.getById(req.params.id);
    if (!produk) return res.status(404).send('Produk tidak ditemukan');
    res.render('publik/detail', { appName: config.appName, produk, formatRupiah });
  } catch (error) {
    next(error);
  }
};

const renderChatbot = (req, res) => {
  res.render('publik/chatbot', { appName: config.appName });
};

// ---------- API ----------
const getStatus = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server berjalan dengan baik',
    timestamp: new Date().toISOString(),
  });
};

const getApiProducts = async (req, res, next) => {
  try {
    const produk = req.query.q
      ? await produkModel.search(req.query.q)
      : await produkModel.getAll();
    res.status(200).json(produk);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  renderDashboard,
  renderKatalog,
  renderDetail,
  renderChatbot,
  getStatus,
  getApiProducts,
};