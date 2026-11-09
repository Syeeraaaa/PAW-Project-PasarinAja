// models/productModel.js
// Model: mengelola data produk UMKM Desa Paseban Kawis di database PostgreSQL.
// Semua query database ada di sini, controller hanya memanggil fungsinya.

const { DataTypes, Op, fn, col, where } = require('sequelize');
const sequelize = require('../config/database');

// Kategori mengikuti pilihan "Kategori Usaha" pada form pendaftaran UMKM
const KATEGORI = [
  'Makanan & Minuman',
  'Kerajinan',
  'Fashion',
  'Pertanian',
  'Lainnya',
];

// Definisi tabel "produk"
const Product = sequelize.define(
  'Product',
  {
    nama: { type: DataTypes.STRING, allowNull: false },
    kategori: { type: DataTypes.STRING, allowNull: false },
    harga: { type: DataTypes.INTEGER, allowNull: false },
    stok: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    deskripsi: { type: DataTypes.TEXT },
    gambar: { type: DataTypes.STRING },
    umkm: { type: DataTypes.STRING },
    no_whatsapp: { type: DataTypes.STRING },
    status: {
      type: DataTypes.ENUM('menunggu', 'ditampilkan', 'ditolak'),
      allowNull: false,
      defaultValue: 'ditampilkan',
    },
  },
  { tableName: 'produk' }
);

// Kolom yang boleh diubah lewat create/update
const KOLOM = [
  'nama',
  'kategori',
  'harga',
  'stok',
  'deskripsi',
  'gambar',
  'umkm',
  'no_whatsapp',
  'status',
];

// Ambil hanya kolom yang diizinkan dari data masukan
const ambilKolom = (data = {}) => {
  const hasil = {};
  for (const kolom of KOLOM) {
    if (data[kolom] !== undefined) hasil[kolom] = data[kolom];
  }
  if (hasil.harga !== undefined) hasil.harga = Number(hasil.harga);
  if (hasil.stok !== undefined) hasil.stok = Number(hasil.stok);
  return hasil;
};

// Ubah instance Sequelize jadi objek biasa
const keObjek = (produk) => (produk ? produk.get({ plain: true }) : null);

// ----------------------------------------------------------------
// READ
// ----------------------------------------------------------------

// Semua produk
async function getAll() {
  const daftar = await Product.findAll({ order: [['id', 'ASC']] });
  return daftar.map(keObjek);
}

// Satu produk berdasarkan ID, atau null bila tidak ada
async function getById(id) {
  return keObjek(await Product.findByPk(id));
}

// Produk berdasarkan kategori (tidak membedakan huruf besar/kecil)
async function getByCategory(kategori) {
  const kunci = String(kategori).trim().toLowerCase();
  const daftar = await Product.findAll({
    where: where(fn('lower', col('kategori')), kunci),
    order: [['id', 'ASC']],
  });
  return daftar.map(keObjek);
}

// Cari produk dari nama, deskripsi, atau nama UMKM
async function search(keyword) {
  const kunci = String(keyword).trim();
  if (kunci === '') return getAll();

  // escape karakter khusus LIKE supaya % dan _ dianggap huruf biasa
  const aman = kunci.replace(/[\\%_]/g, '\\$&');
  const pola = `%${aman}%`;

  const daftar = await Product.findAll({
    where: {
      [Op.or]: [
        { nama: { [Op.iLike]: pola } },
        { deskripsi: { [Op.iLike]: pola } },
        { umkm: { [Op.iLike]: pola } },
      ],
    },
    order: [['id', 'ASC']],
  });
  return daftar.map(keObjek);
}

// Daftar kategori yang tersedia
function getCategories() {
  return [...KATEGORI];
}

// Jumlah seluruh produk
async function count() {
  return Product.count();
}

// ----------------------------------------------------------------
// CREATE, UPDATE, DELETE
// (validasi input dilakukan di controller; model hanya mengelola data)
// ----------------------------------------------------------------

// Tambah produk baru, mengembalikan produk yang tersimpan
async function create(data) {
  const produkBaru = await Product.create(ambilKolom(data));
  return keObjek(produkBaru);
}

// Ubah sebagian atau seluruh data produk, mengembalikan produk terbaru atau null
async function update(id, data) {
  const produk = await Product.findByPk(id);
  if (!produk) return null;

  await produk.update(ambilKolom(data));
  return keObjek(produk);
}

// Hapus produk, mengembalikan produk yang dihapus atau null
async function remove(id) {
  const produk = await Product.findByPk(id);
  if (!produk) return null;

  const dihapus = keObjek(produk);
  await produk.destroy();
  return dihapus;
}

module.exports = {
  Product, // dipakai seeder
  getAll,
  getById,
  getByCategory,
  search,
  getCategories,
  count,
  create,
  update,
  remove,
};