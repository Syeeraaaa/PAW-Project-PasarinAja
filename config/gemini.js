// config/gemini.js
module.exports = {
  apiKey: process.env.GEMINI_API_KEY,
  model: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
  maxPesan: 500,
  timeoutMs: 20000,
  // Persona ditentukan dari akun yang login (server), bukan dari permintaan klien
  modeUntuk: (user) => (user && user.role === 'umkm' ? 'umkm' : 'publik'),
};