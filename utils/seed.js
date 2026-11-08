
const sequelize = require('../config/database');
const Product = require('../models/productModel');

const data = [
  { nama: 'Keripik Singkong Original', kategori: 'Makanan & Minuman', harga: 15000, deskripsi: 'Keripik singkong renyah dengan bumbu gurih, dikemas 250 gram.', umkm: 'Keripik Singkong Bu Sari' },
  { nama: 'Kopi Bubuk Robusta', kategori: 'Makanan & Minuman', harga: 25000, deskripsi: 'Kopi robusta asli pilihan dari petani lokal.', umkm: 'Kopi Desa Paseban' },
  { nama: 'Madu Hutan Asli', kategori: 'Makanan & Minuman', harga: 75000, deskripsi: 'Madu murni dari hutan penangkaran lokal.', umkm: 'Madu Hutan Lestari' },
  { nama: 'Tas Tenun Tradisional', kategori: 'Kerajinan', harga: 120000, deskripsi: 'Tas tangan tenun tangan motif khas daerah.', umkm: 'Tenun Indah' },
  { nama: 'Gantungan Kunci Kayu', kategori: 'Kerajinan', harga: 10000, deskripsi: 'Gantungan kunci ukiran kayu unik.', umkm: 'Kriya Kayu Kreatif' },
  { nama: 'Peyek Kacang Renyah', kategori: 'Makanan & Minuman', harga: 12000, deskripsi: 'Peyek kacang gurih dan renyah cocok untuk teman makan.', umkm: 'Peyek Bu Minah' },
  { nama: 'Sambal Terasi Botol', kategori: 'Makanan & Minuman', harga: 20000, deskripsi: 'Sambal terasi rumahan pedas nikmat siap saji.', umkm: 'Sambal Sedap' },
  { nama: 'Peci Rajut Handmade', kategori: 'Fashion', harga: 30000, deskripsi: 'Peci rajut tangan yang adem dan nyaman dipakai.', umkm: 'Rajut Berkah' }
];

(async () => {
  try {
    await sequelize.sync({ force: true });
    await Product.bulkCreate(data);
    console.log('✅ Seed selesai! Data produk berhasil dimasukkan.');
    process.exit();
  } catch (error) {
    console.error('❌ Gagal melakukan seeding:', error);
    process.exit(1);
  }
})();
