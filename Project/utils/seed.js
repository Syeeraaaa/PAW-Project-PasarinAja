const sequelize = require('../config/database');
const { Product } = require('../models/productModel');
const { Umkm } = require('../models/umkmModel');
const userModel = require('../models/userModel');

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

    // UMKM pertama (disetujui) jadi UMKM aktif sementara
    const daftarUmkm = await Umkm.bulkCreate([
      { nama_pemilik: 'Kelompok Dua', nama_usaha: 'Sambal Kemasan', kategori: 'Makanan & Minuman', email: 'kelompok2@email.com', no_whatsapp: WA, foto: '/images/sambal.jpg', pesan: 'Sambal kemasan khas desa.', status: 'disetujui' },
      { nama_pemilik: 'Sekar', nama_usaha: 'Keripik Singkong', kategori: 'Makanan & Minuman', email: 'sekar@email.com', no_whatsapp: WA, foto: '/images/singkong.jpg', pesan: 'Usaha keripik singkong rumahan.', status: 'menunggu' },
      { nama_pemilik: 'Shafa', nama_usaha: 'Kerupuk Seblak Campur', kategori: 'Makanan & Minuman', email: 'shafa@email.com', no_whatsapp: WA, foto: '/images/seblak.jpg', pesan: 'Kerupuk seblak siap seduh.', status: 'disetujui' },
    ]);
    const aktif = daftarUmkm[0];

    await Product.bulkCreate([
      ...data,
      { nama: 'Sambal Kemasan', kategori: 'Makanan & Minuman', harga: 35000, stok: 20, deskripsi: 'Sambal kemasan dalam tiga varian favorit.', umkm: aktif.nama_usaha, umkm_id: aktif.id, no_whatsapp: aktif.no_whatsapp, gambar: '/images/sambal.jpg', status: 'ditampilkan' },
      { nama: 'Kerupuk Seblak Campur', kategori: 'Makanan & Minuman', harga: 20000, stok: 20, deskripsi: 'Kerupuk seblak campur siap seduh.', umkm: aktif.nama_usaha, umkm_id: aktif.id, no_whatsapp: aktif.no_whatsapp, gambar: '/images/seblak.jpg', status: 'menunggu' },
    ]);
    await userModel.create({ username: 'admin', email: 'admin@pasarinaja.local', password: 'admin12345', role: 'admin' });
    await userModel.create({ username: 'umkm', email: 'umkm@pasarinaja.local', password: 'umkm12345', role: 'umkm', umkm_id: aktif.id });
    
    console.log('Seed selesai');
  } catch (err) {
    console.error('Seed gagal:', err.message);
  } finally {
    await sequelize.close();
  }
})();