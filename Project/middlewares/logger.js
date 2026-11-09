// middlewares/logger.js
// Middleware: mencatat setiap request yang masuk ke terminal.
// Format: [waktu] METHOD URL STATUS - durasi ms

const { formatTimestamp } = require('../utils/formatter');

const logger = (req, res, next) => {
  const mulai = Date.now();

  // 'finish' terjadi saat response selesai dikirim,
  // jadi status code dan durasi baru bisa dicatat di sini
  res.on('finish', () => {
    const durasi = Date.now() - mulai;
    console.log(
      `[${formatTimestamp()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${durasi}ms`
    );
  });

  next();
};

module.exports = logger;