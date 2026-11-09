// Menampilkan halaman Login
exports.renderLogin = (req, res) => {
    res.render('auth/login');
};

// Menampilkan halaman Register
exports.renderRegister = (req, res) => {
    res.render('auth/register');
};

// Logika Proses Login
exports.login = (req, res) => {
    const { username, password } = req.body;
    // Contoh sederhana: arahkan berdasarkan role atau dummy logic
    if (username === 'admin') {
        return res.redirect('/admin/dashboard');
    } else if (username === 'umkm') {
        return res.redirect('/umkm/dashboard');
    } else {
        res.redirect('/dashboard');
    }
};

// Logika Proses Register
exports.register = (req, res) => {
    const { username, email, password } = req.body;
    // Simpan data user ke database di sini menggunakan Sequelize model
    console.Register(`User baru terdaftar: ${username} (${email})`);
    res.redirect('/login');
};