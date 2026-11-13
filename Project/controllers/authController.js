// controllers/authController.js
const config = require('../config/config');
const userModel = require('../models/userModel');

const berandaUntuk = (user) => (user.role === 'admin' ? '/admin/dashboard' : '/umkm/dashboard');

exports.renderLogin = (req, res) => {
  if (req.user) return res.redirect(berandaUntuk(req.user));
  res.render('auth/login', {
    appName: config.appName,
    error: null,
    info: req.query.daftar === '1' ? 'Registrasi berhasil, silakan login.' : null,
    username: '',
  });
};

exports.renderRegister = (req, res) => {
  if (req.user) return res.redirect(berandaUntuk(req.user));
  res.render('auth/register', { appName: config.appName, errors: {}, username: '', email: '' });
};

exports.login = async (req, res, next) => {
  try {
    const username = (req.body.username || '').trim().toLowerCase();
    const password = req.body.password || '';

    const user = await userModel.getByUsername(username);
    const cocok = user ? await userModel.cekPassword(user, password) : false;

    if (!cocok) {
      // pesan sengaja sama untuk username salah maupun password salah
      return res.status(401).render('auth/login', {
        appName: config.appName,
        error: 'Username atau password salah',
        info: null,
        username,
      });
    }

    req.session.regenerate((err) => {
      if (err) return next(err);
      req.session.userId = user.id;
      req.session.save((err2) => (err2 ? next(err2) : res.redirect(berandaUntuk(user))));
    });
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  const username = (req.body.username || '').trim().toLowerCase();
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';
  const errors = {};

  const kembaliDenganError = () =>
    res.status(400).render('auth/register', { appName: config.appName, errors, username, email });

  try {
    if (!/^[a-z0-9_]{3,30}$/.test(username)) {
      errors.username = 'Username 3-30 karakter: huruf, angka, atau underscore';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Format email tidak valid';
    if (password.length < 8) errors.password = 'Password minimal 8 karakter';
    else if (password.length > 72) errors.password = 'Password maksimal 72 karakter';

    if (!errors.username && (await userModel.getByUsername(username))) errors.username = 'Username sudah dipakai';
    if (!errors.email && (await userModel.getByEmail(email))) errors.email = 'Email sudah terdaftar';

    if (Object.keys(errors).length) return kembaliDenganError();

    // role SELALU 'umkm', tidak pernah diambil dari form
    await userModel.create({ username, email, password, role: 'umkm' });
    res.redirect('/login?daftar=1');
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      errors.username = 'Username atau email sudah dipakai';
      return kembaliDenganError();
    }
    next(error);
  }
};

// Setelah logout, kembali ke dashboard publik
exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
};