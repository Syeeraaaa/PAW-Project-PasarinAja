const sequelize = require('../config/database');
const { Product } = require('../models/productModel');

const WA = '6281234567890'; // ganti dengan nomor WhatsApp asli

const data = [
  { nama: 'Keripik Singkong Original', kategori: 'Makanan & Minuman', harga: 15000, stok: 20, deskripsi: 'Keripik singkong renyah dengan bumbu gurih, dikemas 250 gram.', umkm: 'Keripik Singkong Bu Sari', no_whatsapp: WA },
  { nama: 'Keripik Singkong Balado', kategori: 'Makanan & Minuman', harga: 17000, stok: 20, deskripsi: 'Keripik singkong dengan bumbu balado pedas manis, kemasan 250 gram.', umkm: 'Keripik Singkong Bu Sari', no_whatsapp: WA },
  { nama: 'Kopi Robusta Bubuk', kategori: 'Makanan & Minuman', harga: 45000, stok: 15, deskripsi: 'Kopi robusta sangrai tingkat medium, digiling halus, kemasan 200 gram.', umkm: 'Kopi Desa Kawis', no_whatsapp: WA },
  { nama: 'Tas Anyaman Pandan', kategori: 'Kerajinan', harga: 85000, stok: 10, deskripsi: 'Tas tangan dari anyaman pandan, ringan dan kuat, dibuat manual.', umkm: 'Anyaman Mawar', no_whatsapp: WA },
  { nama: 'Tempat Tisu Bambu', kategori: 'Kerajinan', harga: 35000, stok: 12, deskripsi: 'Tempat tisu berbahan bambu dengan finishing halus untuk dekorasi rumah.', umkm: 'Bambu Kreasi', no_whatsapp: WA },
  { nama: 'Batik Tulis Motif Daun', kategori: 'Fashion', harga: 150000, stok: 5, deskripsi: 'Kain batik tulis motif daun, ukuran 2 meter, pewarna aman.', umkm: 'Batik Kawis', no_whatsapp: WA },
  { nama: 'Beras Organik', kategori: 'Pertanian', harga: 70000, stok: 30, deskripsi: 'Beras organik tanpa pestisida kimia, kemasan 5 kilogram.', umkm: 'Tani Makmur', no_whatsapp: WA },
  { nama: 'Madu Hutan Murni', kategori: 'Lainnya', harga: 90000, stok: 8, deskripsi: 'Madu murni tanpa campuran gula, botol kaca 250 ml.', umkm: 'Madu Lestari', no_whatsapp: WA },
];

(async () => {
  try {
    await sequelize.sync({ force: true }); // hapus tabel lama lalu buat ulang
    await Product.bulkCreate(data);
    console.log('Seed selesai: 8 produk dimasukkan');
  } catch (err) {
    console.error('Seed gagal:', err.message);
  } finally {
    await sequelize.close();
  }
})();