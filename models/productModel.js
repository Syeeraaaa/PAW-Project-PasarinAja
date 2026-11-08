
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  nama: { type: DataTypes.STRING, allowNull: false },
  kategori: { type: DataTypes.STRING, allowNull: false },
  harga: { type: DataTypes.INTEGER, allowNull: false },
  deskripsi: { type: DataTypes.TEXT },
  umkm: { type: DataTypes.STRING },
}, {
  tableName: 'produk',
  timestamps: true,
});

module.exports = Product;
