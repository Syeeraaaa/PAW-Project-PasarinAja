
const { Client } = require('pg');
require('dotenv').config();

// Koneksi awal ke database bawaan 'postgres'
const client = new Client({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  password: process.env.DB_PASSWORD || 'password_postgres_mu',
  port: process.env.DB_PORT || 5432,
  database: 'postgres',
});

async function createDatabase() {
  try {
    await client.connect();
    // Bikin database PasarinAja
    await client.query('CREATE DATABASE "PasarinAja";');
    console.log('SUCCESS: Database PasarinAja berhasil dibuat!');
  } catch (err) {
    if (err.code === '42P04') {
      console.log('INFO: Database PasarinAja ternyata sudah ada!');
    } else {
      console.error('ERROR:', err.message);
    }
  } finally {
    await client.end();
  }
}

createDatabase();
