// controllers/umkmController.js
const config = require('../config/config');
const umkmModel = require('../models/umkmModel');
const produkModel = require('../models/productModel');
const { formatRupiah } = require('../utils/formatter');

const angkaValid = (v) =>
  v !== undefined && String(v).trim() !== '' && Number.isFinite(Number(v)) && Number(v) >= 0;

// Foto hasil upload disimpan sebagai path yang bisa dibuka dari browser
const pathFoto = (file) => (file ? `/uploads/${file.filename}` : undefined);

// Produk hanya boleh diubah atau dihapus oleh UMKM pemiliknya
const ambilProdukMilik = async (id, umkmId) => {
  const produk = await produkModel.getById(id);
  return produk && produk.umkm_id === umkmId ? produk : null;
};

// ---------- DASHBOARD ----------
exports.renderDashboard = (req, res) => {
  res.render('umkm/dashboard', { appName: config.appName, umkm: req.umkm });
};

// ---------- KELOLA PRODUK (CRUD) ----------
exports.renderKelolaProduk = async (req, res, next) => {
  try {
    const produk = await produkModel.getByUmkm(req.umkm.id);
    res.render('umkm/kelola-produk', {
      appName: config.appName,
      umkm: req.umkm,
      produk,
      kategori: produkModel.getCategories(),
      formatRupiah,
    });
  } catch (error) {
    next(error);
  }
};

exports.tambahProduk = async (req, res, next) => {
  try {
    const { nama, kategori, harga, stok, deskripsi } = req.body;
    if (!nama || !kategori || !angkaValid(harga) || !angkaValid(stok)) {
      return res.status(400).send('Nama, kategori, harga, dan stok wajib diisi dengan benar');
    }
    await produkModel.create({
      nama, kategori, harga, stok, deskripsi,
      gambar: pathFoto(req.file),
      umkm: req.umkm.nama_usaha,
      umkm_id: req.umkm.id,
      no_whatsapp: req.umkm.no_whatsapp,
      status: 'menunggu', // menunggu verifikasi admin
    });
    res.redirect('/umkm/produk');
  } catch (error) {
    next(error);
  }
};

exports.ubahProduk = async (req, res, next) => {
  try {
    const produk = await ambilProdukMilik(req.params.id, req.umkm.id);
    if (!produk) return res.status(404).send('Produk tidak ditemukan');

    const { nama, kategori, harga, stok, deskripsi } = req.body;
    if (!nama || !kategori || !angkaValid(harga) || !angkaValid(stok)) {
      return res.status(400).send('Nama, kategori, harga, dan stok wajib diisi dengan benar');
    }
    await produkModel.update(req.params.id, {
      nama, kategori, harga, stok, deskripsi,
      ...(req.file && { gambar: pathFoto(req.file) }), // foto lama dipakai kalau tidak ganti
      // produk yang ditolak dan diperbaiki diajukan lagi ke admin
      status: produk.status === 'ditolak' ? 'menunggu' : produk.status,
    });
    res.redirect('/umkm/produk');
  } catch (error) {
    next(error);
  }
};

exports.hapusProduk = async (req, res, next) => {
  try {
    const produk = await ambilProdukMilik(req.params.id, req.umkm.id);
    if (!produk) return res.status(404).send('Produk tidak ditemukan');
    await produkModel.remove(req.params.id);
    res.redirect('/umkm/produk');
  } catch (error) {
    next(error);
  }
};

// ---------- FORM PENDAFTARAN ----------
exports.renderFormPendaftaran = (req, res) => {
  res.render('umkm/form-pendaftaran', {
    appName: config.appName,
    kategori: produkModel.getCategories(),
    berhasil: req.query.berhasil === '1',
  });
};

exports.storePendaftaran = async (req, res, next) => {
  try {
    const { nama_pemilik, email, nama_usaha, no_whatsapp, kategori, pesan } = req.body;
    if (!nama_pemilik || !nama_usaha || !kategori) {
      return res.status(400).send('Nama lengkap, nama usaha, dan kategori wajib diisi');
    }
    await umkmModel.create({
      nama_pemilik, email, nama_usaha, no_whatsapp, kategori, pesan,
      foto: pathFoto(req.file),
      status: 'menunggu', // menunggu verifikasi admin
    });
    res.redirect('/umkm/pendaftaran?berhasil=1');
  } catch (error) {
    next(error);
  }
};

// ---------- AKUN SAYA ----------
exports.renderAkun = (req, res) => {
  res.render('umkm/akunSaya', { appName: config.appName, umkm: req.umkm });
};

exports.ubahAkun = async (req, res, next) => {
  try {
    const { nama_pemilik, nama_usaha, email, no_whatsapp } = req.body;
    if (!nama_pemilik || !nama_usaha) {
      return res.status(400).send('Nama lengkap dan nama usaha wajib diisi');
    }
    await umkmModel.update(req.umkm.id, { nama_pemilik, nama_usaha, email, no_whatsapp });
    // nama usaha dan WhatsApp juga dipakai di produk, jadi disamakan
    await produkModel.syncUmkm(req.umkm.id, { umkm: nama_usaha, no_whatsapp });
    res.redirect('/umkm/akun');
  } catch (error) {
    next(error);
  }
};