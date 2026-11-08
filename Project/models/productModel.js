// models/productModel.js
// Model: menyimpan dan mengelola data produk UMKM Desa Paseban Kawis.
// Data berupa array statis di memori (tanpa database), sesuai ketentuan tugas.
// Catatan: seluruh data di bawah adalah DATA CONTOH untuk keperluan tugas.

// Kategori mengikuti pilihan "Kategori Usaha" pada form pendaftaran UMKM (Week 2)
const KATEGORI = [
  'Makanan & Minuman',
  'Kerajinan',
  'Fashion',
  'Pertanian',
  'Lainnya',
];

// Data produk (harga dalam Rupiah)
let products = [
  {
    id: 1,
    nama: 'Keripik Singkong Original',
    kategori: 'Makanan & Minuman',
    harga: 15000,
    deskripsi: 'Keripik singkong renyah dengan bumbu gurih, dikemas 250 gram.',
    umkm: 'Keripik Singkong Bu Sari',
  },
  {
    id: 2,
    nama: 'Keripik Singkong Balado',
    kategori: 'Makanan & Minuman',
    harga: 17000,
    deskripsi: 'Keripik singkong dengan bumbu balado pedas manis, kemasan 250 gram.',
    umkm: 'Keripik Singkong Bu Sari',
  },
  {
    id: 3,
    nama: 'Kopi Robusta Bubuk',
    kategori: 'Makanan & Minuman',
    harga: 45000,
    deskripsi: 'Kopi robusta sangrai tingkat medium, digiling halus, kemasan 200 gram.',
    umkm: 'Kopi Desa Kawis',
  },
  {
    id: 4,
    nama: 'Tas Anyaman Pandan',
    kategori: 'Kerajinan',
    harga: 85000,
    deskripsi: 'Tas tangan dari anyaman pandan, ringan dan kuat, dibuat manual.',
    umkm: 'Anyaman Mawar',
  },
  {
    id: 5,
    nama: 'Tempat Tisu Bambu',
    kategori: 'Kerajinan',
    harga: 35000,
    deskripsi: 'Tempat tisu berbahan bambu dengan finishing halus untuk dekorasi rumah.',
    umkm: 'Bambu Kreasi',
  },
  {
    id: 6,
    nama: 'Batik Tulis Motif Daun',
    kategori: 'Fashion',
    harga: 150000,
    deskripsi: 'Kain batik tulis motif daun, ukuran 2 meter, pewarna aman.',
    umkm: 'Batik Kawis',
  },
  {
    id: 7,
    nama: 'Beras Organik',
    kategori: 'Pertanian',
    harga: 70000,
    deskripsi: 'Beras organik tanpa pestisida kimia, kemasan 5 kilogram.',
    umkm: 'Tani Makmur',
  },
  {
    id: 8,
    nama: 'Madu Hutan Murni',
    kategori: 'Lainnya',
    harga: 90000,
    deskripsi: 'Madu murni tanpa campuran gula, botol kaca 250 ml.',
    umkm: 'Madu Lestari',
  },
];

// Penanda ID berikutnya (naik terus agar ID tidak dipakai ulang setelah dihapus)
let nextId = Math.max(...products.map((p) => p.id)) + 1;

// Mengembalikan salinan agar data asli tidak berubah dari luar model
const salin = (produk) => ({ ...produk });

// Mengubah ID dari URL (string) menjadi angka
const keAngka = (id) => Number(id);

// ----------------------------------------------------------------
// READ
// ----------------------------------------------------------------

// Semua produk
function getAll() {
  return products.map(salin);
}

// Satu produk berdasarkan ID, atau null bila tidak ada
function getById(id) {
  const produk = products.find((p) => p.id === keAngka(id));
  return produk ? salin(produk) : null;
}

// Produk berdasarkan kategori (tidak membedakan huruf besar/kecil)
 function getByCategory(kategori) {
  const kunci = String(kategori).trim().toLowerCase();
  return products
    .filter((p) => p.kategori.toLowerCase() === kunci)
    .map(salin);
}

// Cari produk dari nama, deskripsi, atau nama UMKM
function search(keyword) {
  const kunci = String(keyword).trim().toLowerCase();
  if (kunci === '') return getAll();

  return products
    .filter(
      (p) =>
        p.nama.toLowerCase().includes(kunci) ||
        p.deskripsi.toLowerCase().includes(kunci) ||
        p.umkm.toLowerCase().includes(kunci)
    )
    .map(salin);
}

// Daftar kategori yang tersedia
function getCategories() {
  return [...KATEGORI];
}

// Jumlah seluruh produk
function count() {
  return products.length;
}

// ----------------------------------------------------------------
// CREATE, UPDATE, DELETE
// (validasi input dilakukan di controller; model hanya mengelola data)
// ----------------------------------------------------------------

// Tambah produk baru, mengembalikan produk yang tersimpan
function create({ nama, kategori, harga, deskripsi, umkm }) {
  const produkBaru = {
    id: nextId++,
    nama,
    kategori,
    harga: Number(harga),
    deskripsi,
    umkm,
  };
  products.push(produkBaru);
  return salin(produkBaru);
}

// Ubah sebagian atau seluruh data produk, mengembalikan produk terbaru atau null
function update(id, data) {
  const produk = products.find((p) => p.id === keAngka(id));
  if (!produk) return null;

  const bolehDiubah = ['nama', 'kategori', 'harga', 'deskripsi', 'umkm'];
  for (const kolom of bolehDiubah) {
    if (data[kolom] !== undefined) {
      produk[kolom] = kolom === 'harga' ? Number(data[kolom]) : data[kolom];
    }
  }
  return salin(produk);
}

// Hapus produk, mengembalikan produk yang dihapus atau null
function remove(id) {
  const index = products.findIndex((p) => p.id === keAngka(id));
  if (index === -1) return null;

  const [dihapus] = products.splice(index, 1);
  return salin(dihapus);
}

module.exports ={
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