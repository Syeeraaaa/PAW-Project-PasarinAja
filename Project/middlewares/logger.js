// Middleware: mencatat setiap request yang masuk ke server ke terminal.
// Format: [waktu] METHOD URL STATUS - durasi

const logger = (req, res, next) => {
  const mulai = Date.now();

  const { formatTimestamp } = require('../utils/formatter');

  // 'finish' terjadi saat response selesai dikirim,
  // jadi status code dan durasi baru bisa dicatat di sini
  res.on('finish', () => {
    const durasi = Date.now() - mulai;
    const waktu = new Date().toLocaleString('id-ID', { hour12: false });
    console.log(
      `[${formatTimestamp()}] ${req.method} ${req.originalUrl} ${res.statusCode}`
    );
  });

  next();
};

module.exports = logger;