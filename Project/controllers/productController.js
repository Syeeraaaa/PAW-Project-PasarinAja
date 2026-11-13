const produkModel = require('../models/productModel');
const config = require('../config/config');
const { formatRupiah } = require('../utils/formatter');

// ----------------------------------------------------------------
// HALAMAN PUBLIK (RENDER EJS DENGAN SIDEBAR & PARTIAL)
// ----------------------------------------------------------------

// Menampilkan Halaman Dashboard Publik
const renderDashboard = (req, res) => {
  if (req.user) {
    return res.redirect(req.user.role === 'admin' ? '/admin/dashboard' : '/umkm/dashboard');
  }
  res.render('publik/dashboard', { appName: config.appName });
};

// Menampilkan Halaman Katalog Produk dengan Pencarian & Status Valid
const renderKatalog = async (req, res, next) => {
    try {
        const q = req.query.q || '';
        // Menggunakan pencarian khusus produk publik yang berstatus 'ditampilkan'
        const produk = await produkModel.searchPublic ? await produkModel.searchPublic(q) : await produkModel.search(q);
        
        res.render('publik/katalog', { 
            appName: config.appName, 
            produk, 
            q, 
            formatRupiah,
            aktif: 'katalog' // Indikator menu aktif di sidebar
        });
    } catch (error) {
        next(error);
    }
};

// Menampilkan Halaman Detail Produk & Tombol WhatsApp Penjual
const renderDetail = async (req, res, next) => {
    try {
        const produk = await produkModel.getById(req.params.id);
        
        // Validasi: Pastikan produk ada dan statusnya sudah ditampilkan
        if (!produk || (produk.status && produk.status !== 'ditampilkan')) {
            return res.status(404).send('Produk tidak ditemukan atau belum disetujui');
        }

        res.render('publik/detail', { 
            appName: config.appName, 
            produk, 
            formatRupiah,
            aktif: 'katalog' // Halaman detail tetap mengaktifkan menu katalog di sidebar
        });
    } catch (error) {
        next(error);
    }
};

// Menampilkan Halaman Chatbot Desa
const renderChatbot = (req, res) => {
    res.render('publik/chatbot', { 
        appName: config.appName, 
        aktif: 'chatbot' // Indikator menu aktif di sidebar
    });
};

// ----------------------------------------------------------------
// ENDPOINT API (FORMAT JSON)
// ----------------------------------------------------------------

// Cek Status Server
const getStatus = (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Server berjalan dengan baik',
        timestamp: new Date().toISOString(),
    });
};

// Ambil Data Produk via API
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