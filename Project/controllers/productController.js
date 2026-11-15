const produkModel = require('../models/productModel');
const config = require('../config/config');
const { modeUntuk } = require('../config/gemini');
const { formatRupiah } = require('../utils/formatter');

const angkaValid = (v) =>
  v !== undefined && String(v).trim() !== '' && Number.isFinite(Number(v)) && Number(v) >= 0;

const renderDashboard = (req, res) => {
  // yang sudah login diarahkan ke dashboard sesuai perannya
  if (req.user) {
    return res.redirect(req.user.role === 'admin' ? '/admin/dashboard' : '/umkm/dashboard');
  }
  res.render('publik/dashboard', { appName: config.appName });
};

const renderKatalog = async (req, res, next) => {
  try {
    const q = req.query.q || '';
    const produk = await produkModel.searchPublic(q); 
    res.render('publik/katalog', { appName: config.appName, produk, q, formatRupiah });
  } catch (error) {
    next(error);
  }
};

const renderDetail = async (req, res, next) => {
  try {
    const produk = await produkModel.getById(req.params.id);
    if (!produk || produk.status !== 'ditampilkan') {
      return res.status(404).send('Produk tidak ditemukan');
    }
    res.render('publik/detail', { appName: config.appName, produk, formatRupiah });
  } catch (error) {
    next(error);
  }
};

const renderChatbot = (req, res) => {
  delete req.session.riwayatChat;
  res.render('publik/chatbot', { appName: config.appName, mode: modeUntuk(req.user) });
};

// ---------- API ----------
const getStatus = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server berjalan dengan baik',
    timestamp: new Date().toISOString(),
  });
};

// GET /api/produk
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

// GET /api/produk/:id
const getApiProductById = async (req, res, next) => {
  try {
    const produk = await produkModel.getById(req.params.id);
    if (!produk) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    res.status(200).json(produk);
  } catch (error) {
    next(error);
  }
};

// POST /api/produk
const createApiProduct = async (req, res, next) => {
  try {
    const data = req.body || {};
    if (!data.nama || !data.kategori || !angkaValid(data.harga)) {
      return res.status(400).json({ message: 'nama, kategori, dan harga wajib diisi dengan benar' });
    }
    if (data.stok !== undefined && !angkaValid(data.stok)) {
      return res.status(400).json({ message: 'stok harus berupa angka' });
    }
    const produk = await produkModel.create(data);
    res.status(201).json(produk);
  } catch (error) {
    next(error);
  }
};

// PUT /api/produk/:id
const updateApiProduct = async (req, res, next) => {
  try {
    const data = req.body || {};
    if (data.harga !== undefined && !angkaValid(data.harga)) {
      return res.status(400).json({ message: 'harga harus berupa angka' });
    }
    if (data.stok !== undefined && !angkaValid(data.stok)) {
      return res.status(400).json({ message: 'stok harus berupa angka' });
    }
    const produk = await produkModel.update(req.params.id, data);
    if (!produk) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    res.status(200).json(produk);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/produk/:id
const deleteApiProduct = async (req, res, next) => {
  try {
    const produk = await produkModel.remove(req.params.id);
    if (!produk) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    res.status(200).json({ message: 'Produk berhasil dihapus' });
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
  getApiProductById,
  createApiProduct,
  updateApiProduct,
  deleteApiProduct,
};