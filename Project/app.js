require('dotenv').config();
const express = require('express');
const path = require('path');
const { Client } = require('pg');

const config = require('./config/config');
const sequelize = require('./config/database');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

// Routes per role
const routes = require('./routes/index');
const authRoutes = require('./routes/authRoutes');
const umkmRoutes = require('./routes/umkmRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

const session = require('express-session');
const { muatUser } = require('./middlewares/auth');

// View engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'rahasia-dev',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(muatUser);
app.use(express.static(path.join(__dirname, 'public'))); // folder public untuk CSS, JS, gambar, dll
app.use

// Routes
app.use('/', routes);          // Publik / buyer + API
app.use(authRoutes);           // Login & register
app.use(umkmRoutes);           // Pelaku UMKM
app.use(adminRoutes);          // Admin

// 404, lalu error handler (harus paling bawah)
app.use((req, res) => {
  res.status(404).json({ message: 'Route tidak ditemukan' });
});
app.use(errorHandler);

// Bikin database otomatis kalau belum ada (opsional)
async function ensureDatabaseExists() {
  const namaDb = process.env.DB_NAME || 'pasarinaja';
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    database: 'postgres',
  });

  try {
    await client.connect();
    await client.query(`CREATE DATABASE "${namaDb}";`);
    console.log(`Database "${namaDb}" berhasil dibuat`);
  } catch (err) {
    if (err.code !== '42P04') {
      console.log('Peringatan database:', err.message);
    }
  } finally {
    await client.end();
  }
}

// Jalankan server setelah database terhubung
async function startServer() {
  try {
    await ensureDatabaseExists();
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Database PostgreSQL terhubung!');

    app.listen(config.port, () => {
      console.log(`Server ${config.appName} berjalan di http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('Gagal terhubung ke database:', error.message);
  }
}

startServer();