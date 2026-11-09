const config = require('../config/config');

exports.renderDashboard = (req, res) => {
    res.render('admin/dashboard', { appName: config.appName });
};

exports.renderDataUmkm = (req, res) => {
    res.render('admin/data-umkm', { appName: config.appName });
};

exports.renderDataProduk = (req, res) => {
    res.render('admin/data-produk', { appName: config.appName });
};

exports.renderAkunAdmin = (req, res) => {
    res.render('admin/akun', { appName: config.appName });
};