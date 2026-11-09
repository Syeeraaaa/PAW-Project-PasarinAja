// Dashboard UMKM
exports.renderDashboard = (req, res) => {
    res.render('umkm/dashboard');
};

// Halaman Kelola Produk (Read)
exports.renderKelolaProduk = (req, res) => {
    // Ambil data produk dari database di sini
    res.render('umkm/kelola-produk');
};

// Form Tambah / Pendaftaran Produk/UMKM (Create)
exports.renderFormPendaftaran = (req, res) => {
    res.render('umkm/form-pendaftaran');
};

exports.storePendaftaran = (req, res) => {
    const { nama, email, nama_usaha, kategori, keterangan } = req.body;
    // Simpan data pendaftaran ke database
    res.redirect('/umkm/dashboard');
};

// Halaman Akun UMKM
exports.renderAkun = (req, res) => {
    res.render('umkm/akun');
};