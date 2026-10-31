const express = require('express');
const path = require('path');
const logger = require('./middlewares/logger');
const routes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

// Set View Engine ke EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Pasang Middleware Logger & Body Parser
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Panggil Routes
app.use('/', routes);

// Jalankan Server
app.listen(PORT, () => {
  console.log(`Server PasarinAja berjalan di http://localhost:${PORT}`);
});