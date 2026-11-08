
const express = require('express');
const path = require('path');
const { Sequelize } = require('sequelize');
const { Client } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Import Router dari folder routes
const routes = require('./routes');

// 1. Fungsi Otomatis Bikin Database jika belum ada
async function ensureDatabaseExists() {
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 5432,
    database: 'postgres',
  });

  try {
    await client.connect();
    await client.query('CREATE DATABASE "PasarinAja";');
    console.log('✅ Database "PasarinAja" berhasil dibuat!');
  } catch (err) {
    if (err.code === '42P04') {
      console.log('ℹ️ Database "PasarinAja" sudah ada, melanjutkan koneksi...');
    } else {
      console.log('⚠️ Warning Database:', err.message);
    }
  } finally {
    await client.end();
  }
}

// 2. Konfigurasi Sequelize Database
const sequelize = new Sequelize(
  process.env.DB_NAME || 'PasarinAja',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
    logging: false,
  }
);

// 3. Konfigurasi View Engine (EJS) & Middleware Express
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 4. Hubungkan Semua Rute Aplikasi dari folder routes
app.use('/', routes);

// 5. Jalankan Server & Koneksi Database
async function startServer() {
  await ensureDatabaseExists();

  try {
    await sequelize.authenticate();
    console.log('✅ Berhasil terhubung ke database PostgreSQL via Sequelize!');

    await sequelize.sync();
    console.log('✅ Database & Model berhasil disinkronkan!');

    app.listen(PORT, () => {
      console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Gagal konek database:', error.message);
  }
}

startServer();
