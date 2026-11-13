// models/userModel.js
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const User = sequelize.define(
  'User',
  {
    username: { type: DataTypes.STRING(30), allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false }, // hash, bukan password asli
    role: { type: DataTypes.ENUM('admin', 'umkm'), allowNull: false, defaultValue: 'umkm' },
    umkm_id: { type: DataTypes.INTEGER }, // terisi setelah Form Pendaftaran dikirim
  },
  { tableName: 'users' }
);

const keObjek = (u) => (u ? u.get({ plain: true }) : null);
const tanpaPassword = { attributes: { exclude: ['password'] } };

async function getById(id) {
  return keObjek(await User.findByPk(id, tanpaPassword));
}

async function getByEmail(email) {
  return keObjek(await User.findOne({ where: { email }, ...tanpaPassword }));
}

// DENGAN hash password, khusus proses login
async function getByUsername(username) {
  return keObjek(await User.findOne({ where: { username } }));
}

async function create({ username, email, password, role = 'umkm', umkm_id }) {
  const hash = await bcrypt.hash(password, 10);
  await User.create({ username, email, password: hash, role, umkm_id });
}

async function cekPassword(user, password) {
  return bcrypt.compare(password, user.password);
}

// Hubungkan akun dengan data UMKM miliknya
async function setUmkm(id, umkmId) {
  await User.update({ umkm_id: umkmId }, { where: { id } });
}

module.exports = { User, getById, getByEmail, getByUsername, create, cekPassword, setUmkm };