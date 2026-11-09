// middlewares/umkmAktif.js
// Menentukan UMKM yang sedang dipakai, lalu menyimpannya di req.umkm.
//
// SEMENTARA: UMKM aktif = UMKM pertama yang sudah disetujui.
// Setelah login sungguhan ada, ganti dengan UMKM milik user yang login, contoh:
//   const umkm = await umkmModel.getById(req.session.umkmId);

const umkmModel = require('../models/umkmModel');

const umkmAktif = async (req, res, next) => {
  try {
    const umkm = await umkmModel.getAktif();
    if (!umkm) {
      return res.status(403).send(
        '<p style="font-family:sans-serif;padding:2rem">Belum ada UMKM yang disetujui. ' +
        '<a href="/umkm/pendaftaran">Daftarkan UMKM</a> lalu minta admin memverifikasinya.</p>'
      );
    }
    req.umkm = umkm;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = umkmAktif;