// middlewares/errorHandler.js
// Middleware: menangani error yang diteruskan lewat next(error) dari controller.

const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Terjadi kesalahan pada server' });
};

module.exports = errorHandler;