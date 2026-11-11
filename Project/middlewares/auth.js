// middlewares/auth.js
const userModel = require('../models/userModel');
const umkmModel = require('../models/umkmModel');

// Dipasang global: muat user yang login ke req.user dan res.locals.user
const muatUser = async (req, res, next) => {
  try {
    req.user = null;
    if (req.session.userId) {
      req.user = await userModel.getById(req.session.userId);
      if (!req.user) delete req.session.userId; // akun sudah dihapus
    }
    res.locals.user = req.user;
    next();
  } catch (error) {
    next(error);
  }
};

// Hanya untuk role tertentu ('admin' atau 'umkm')
const wajibRole = (role) => (req, res, next) => {
  if (!req.user) return res.redirect('/login');
  if (req.user.role !== role) return res.status(403).send('Akses ditolak');
  next();
};

// Muat data UMKM milik akun ke req.umkm (null kalau belum mendaftar)
const muatUmkm = async (req, res, next) => {
  try {
    req.umkm = req.user.umkm_id ? await umkmModel.getById(req.user.umkm_id) : null;
    next();
  } catch (error) {
    next(error);
  }
};

// Fitur produk hanya untuk UMKM yang sudah disetujui admin
const wajibUmkmDisetujui = (req, res, next) => {
  if (req.umkm && req.umkm.status === 'disetujui') return next();
  res.redirect('/umkm/dashboard');
};

module.exports = { muatUser, wajibRole, muatUmkm, wajibUmkmDisetujui };