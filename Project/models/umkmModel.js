// models/umkmModel.js
// Model: data pelaku UMKM yang mendaftar dan diverifikasi admin.

const { DataTypes, Op } = require('sequelize');
const sequelize = require('../config/database');

const Umkm = sequelize.define(
  'Umkm',
  {
    nama_pemilik: { type: DataTypes.STRING, allowNull: false },
    nama_usaha: { type: DataTypes.STRING, allowNull: false },
    kategori: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING },
    no_whatsapp: { type: DataTypes.STRING },
    foto: { type: DataTypes.STRING },
    pesan: { type: DataTypes.TEXT },
    status: {
      type: DataTypes.ENUM('menunggu', 'disetujui', 'ditolak'),
      allowNull: false,
      defaultValue: 'menunggu',
    },
  },
  { tableName: 'umkm' }
);

const KOLOM = [
  'nama_pemilik', 'nama_usaha', 'kategori', 'email',
  'no_whatsapp', 'foto', 'pesan', 'status',
];

const ambilKolom = (data = {}) => {
  const hasil = {};
  for (const kolom of KOLOM) {
    if (data[kolom] !== undefined) hasil[kolom] = data[kolom];
  }
  return hasil;
};

const keObjek = (u) => (u ? u.get({ plain: true }) : null);

// Daftar UMKM, bisa difilter status dan dicari dari nama/kategori
async function list({ status, q } = {}) {
  const where = {};
  if (status) where.status = status;
  if (q) {
    const pola = `%${String(q).replace(/[\\%_]/g, '\\$&')}%`;
    where[Op.or] = [
      { nama_usaha: { [Op.iLike]: pola } },
      { nama_pemilik: { [Op.iLike]: pola } },
      { kategori: { [Op.iLike]: pola } },
    ];
  }
  const daftar = await Umkm.findAll({ where, order: [['id', 'DESC']] });
  return daftar.map(keObjek);
}

// Pendaftar paling baru (untuk dashboard)
async function getLatest(limit = 5) {
  const daftar = await Umkm.findAll({ order: [['id', 'DESC']], limit });
  return daftar.map(keObjek);
}

// Jumlah UMKM, boleh difilter status
async function count(status) {
  return Umkm.count(status ? { where: { status } } : {});
}

async function create(data) {
  return keObjek(await Umkm.create(ambilKolom(data)));
}

// Mengembalikan data terbaru, atau null bila ID tidak ada
async function update(id, data) {
  const umkm = await Umkm.findByPk(id);
  if (!umkm) return null;
  await umkm.update(ambilKolom(data));
  return keObjek(umkm);
}

// Mengembalikan data yang dihapus, atau null bila ID tidak ada
async function remove(id) {
  const umkm = await Umkm.findByPk(id);
  if (!umkm) return null;
  const dihapus = keObjek(umkm);
  await umkm.destroy();
  return dihapus;
}

async function getById(id) {
  return keObjek(await Umkm.findByPk(id));
}

// SEMENTARA: UMKM aktif = UMKM pertama yang sudah disetujui
async function getAktif() {
  const umkm = await Umkm.findOne({ where: { status: 'disetujui' }, order: [['id', 'ASC']] });
  return keObjek(umkm);
}

module.exports = { Umkm, list, getById, getAktif, getLatest, count, create, update, remove };