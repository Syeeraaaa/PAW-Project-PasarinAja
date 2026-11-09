// middlewares/upload.js
// Middleware: upload foto (JPG/PNG, maksimal 2 MB) ke folder public/uploads.

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const folder = path.join(__dirname, '..', 'public', 'uploads');
fs.mkdirSync(folder, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, folder),
  filename: (req, file, cb) => {
    const ext = file.mimetype === 'image/png' ? '.png' : '.jpg';
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = ['image/jpeg', 'image/png'].includes(file.mimetype);
    cb(ok ? null : new Error('FORMAT_FOTO'), ok);
  },
});

// Dibungkus supaya error upload jadi pesan yang jelas
const uploadFoto = (namaField) => (req, res, next) => {
  upload.single(namaField)(req, res, (err) => {
    if (!err) return next();
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).send('Ukuran foto maksimal 2 MB');
    if (err.message === 'FORMAT_FOTO') return res.status(400).send('Foto harus berformat JPG atau PNG');
    next(err);
  });
};

module.exports = { uploadFoto };