exports.renderDashboard = (req, res) => {
    res.render('admin/dashboard');
};

exports.renderDataUmkm = (req, res) => {
    res.render('admin/data-umkm');
};

exports.renderDataProduk = (req, res) => {
    res.render('admin/data-produk');
};

exports.renderAkunAdmin = (req, res) => {
    res.render('admin/akun');
};