// controllers/adminController.js
const config = require('../config/config');
const umkmModel = require('../models/umkmModel');
const produkModel = require('../models/productModel');
const { formatRupiah } = require('../utils/formatter');

const STATUS_UMKM = ['menunggu', 'disetujui', 'ditolak'];
const STATUS_PRODUK = ['menunggu', 'ditampilkan', 'ditolak'];

// Setelah sebuah aksi, kembali ke halaman asal (filter/pencarian tetap terjaga)
const kembali = (req, res, cadangan) => res.redirect(req.get('Referer') || cadangan);

const angkaValid = (v) =>
  v !== undefined && String(v).trim() !== '' && Number.isFinite(Number(v)) && Number(v) >= 0;

// ---------- DASHBOARD ----------
exports.renderDashboard = async (req, res, next) => {
  try {
    const [totalUmkm, menunggu, disetujui, totalProduk, terbaru] = await Promise.all([
      umkmModel.count(),
      umkmModel.count('menunggu'),
      umkmModel.count('disetujui'),
      produkModel.count(),
      umkmModel.getLatest(5),
    ]);
    res.render('admin/dashboard', {
      appName: config.appName,
      stats: { totalUmkm, totalProduk, menunggu, disetujui },
      terbaru,
    });
  } catch (error) {
    next(error);
  }
};

// ---------- DATA UMKM ----------
exports.renderDataUmkm = async (req, res, next) => {
  try {
    const status = STATUS_UMKM.includes(req.query.status) ? req.query.status : '';
    const q = (req.query.q || '').trim();
    const daftar = await umkmModel.list({ status, q });
    res.render('admin/data-umkm', {
      appName: config.appName,
      daftar,
      status,
      q,
      kategori: produkModel.getCategories(),
    });
  } catch (error) {
    next(error);
  }
};

exports.tambahUmkm = async (req, res, next) => {
  try {
    const { nama_pemilik, nama_usaha, kategori, email, no_whatsapp, pesan } = req.body;
    if (!nama_pemilik || !nama_usaha || !kategori) {
      return res.status(400).send('Nama pemilik, nama usaha, dan kategori wajib diisi');
    }
    // UMKM yang dibuat langsung oleh admin otomatis disetujui
    await umkmModel.create({
      nama_pemilik, nama_usaha, kategori, email, no_whatsapp, pesan,
      status: 'disetujui',
    });
    res.redirect('/admin/umkm');
  } catch (error) {
    next(error);
  }
};

exports.ubahUmkm = async (req, res, next) => {
  try {
    const { nama_pemilik, nama_usaha, kategori, email, no_whatsapp, pesan } = req.body;
    if (!nama_pemilik || !nama_usaha || !kategori) {
      return res.status(400).send('Nama pemilik, nama usaha, dan kategori wajib diisi');
    }
    const hasil = await umkmModel.update(req.params.id, {
      nama_pemilik, nama_usaha, kategori, email, no_whatsapp, pesan,
    });
    if (!hasil) return res.status(404).send('UMKM tidak ditemukan');
    kembali(req, res, '/admin/umkm');
  } catch (error) {
    next(error);
  }
};

const ubahStatusUmkm = (status) => async (req, res, next) => {
  try {
    const hasil = await umkmModel.update(req.params.id, { status });
    if (!hasil) return res.status(404).send('UMKM tidak ditemukan');
    kembali(req, res, '/admin/umkm');
  } catch (error) {
    next(error);
  }
};
exports.verifikasiUmkm = ubahStatusUmkm('disetujui');
exports.tolakUmkm = ubahStatusUmkm('ditolak');

exports.hapusUmkm = async (req, res, next) => {
  try {
    const hasil = await umkmModel.remove(req.params.id);
    if (!hasil) return res.status(404).send('UMKM tidak ditemukan');
    await produkModel.removeByUmkm(req.params.id); // produk milik UMKM ikut terhapus
    kembali(req, res, '/admin/umkm');
  } catch (error) {
    next(error);
  }
};

// ---------- DATA PRODUK ----------
exports.renderDataProduk = async (req, res, next) => {
  try {
    const status = STATUS_PRODUK.includes(req.query.status) ? req.query.status : '';
    const q = (req.query.q || '').trim();
    const semua = await produkModel.search(q);
    const daftar = status ? semua.filter((p) => p.status === status) : semua;
    res.render('admin/data-produk', {
      appName: config.appName,
      daftar,
      status,
      q,
      kategori: produkModel.getCategories(),
      formatRupiah,
    });
  } catch (error) {
    next(error);
  }
};

exports.ubahProduk = async (req, res, next) => {
  try {
    const { nama, kategori, harga, stok, deskripsi, umkm, no_whatsapp, gambar } = req.body;
    if (!nama || !kategori || !angkaValid(harga) || !angkaValid(stok)) {
      return res.status(400).send('Nama, kategori, harga, dan stok wajib diisi dengan benar');
    }
    const hasil = await produkModel.update(req.params.id, {
      nama, kategori, harga, stok, deskripsi, umkm, no_whatsapp, gambar,
    });
    if (!hasil) return res.status(404).send('Produk tidak ditemukan');
    kembali(req, res, '/admin/produk');
  } catch (error) {
    next(error);
  }
};

const ubahStatusProduk = (status) => async (req, res, next) => {
  try {
    const hasil = await produkModel.update(req.params.id, { status });
    if (!hasil) return res.status(404).send('Produk tidak ditemukan');
    kembali(req, res, '/admin/produk');
  } catch (error) {
    next(error);
  }
};
exports.verifikasiProduk = ubahStatusProduk('ditampilkan');
exports.tolakProduk = ubahStatusProduk('ditolak');

exports.hapusProduk = async (req, res, next) => {
  try {
    const hasil = await produkModel.remove(req.params.id);
    if (!hasil) return res.status(404).send('Produk tidak ditemukan');
    kembali(req, res, '/admin/produk');
  } catch (error) {
    next(error);
  }
};

// ---------- AKUN ----------
exports.renderAkunAdmin = (req, res) => {
  res.render('admin/akun', { appName: config.appName, admin: req.user });
};