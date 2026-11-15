const gemini = require('../config/gemini');

const PESAN_TOLAK =
  'Maaf, aku tidak bisa memproses permintaan seperti itu. Aku hanya bisa membantu dengan informasi produk ' +
  'UMKM Desa Paseban Kawis. Coba tanyakan tentang produk, harga, atau cara menghubungi penjual ya!';


const POLA_INJEKSI = [
  /(abaikan|lupakan|hiraukan)\s+(semua\s+|seluruh\s+)?(instruksi|perintah|aturan|petunjuk)/i,
  /ignore\s+(all\s+)?(the\s+)?(previous|prior|above|earlier)\s+(instructions?|prompts?|rules?)/i,
  /disregard\s+.{0,30}(instructions?|rules?)/i,
  /(system|developer)\s*(prompt|instruction|message)/i,
  /instruksi\s+(sistem|awal)/i,
  /(tampilkan|bocorkan|sebutkan|ungkapkan|reveal|show|print|repeat)\s.{0,30}(prompt|instruksi|instruction)/i,
  /(kamu|anda|lu)\s+(sekarang|kini|mulai sekarang)\s+(adalah|jadi|menjadi)/i,
  /berpura-pura\s+(jadi|menjadi|sebagai)/i,
  /\b(you are now|act as|pretend (to be|you are)|jailbreak|DAN mode)\b/i,
];

const validateChatInput = (req, res, next) => {
  const pesan = req.body && req.body.message;

  if (typeof pesan !== 'string') {
    return res.status(400).json({ success: false, message: 'Pesan harus berupa teks' });
  }

  // buang karakter kontrol dan spasi berlebih
  const bersih = pesan.replace(/[\u0000-\u001F\u007F]+/g, ' ').replace(/\s+/g, ' ').trim();

  if (!bersih) {
    return res.status(400).json({ success: false, message: 'Pesan tidak boleh kosong' });
  }
  if (bersih.length > gemini.maxPesan) {
    return res.status(400).json({
      success: false,
      message: `Pesan terlalu panjang (maksimal ${gemini.maxPesan} karakter)`,
    });
  }
  if (POLA_INJEKSI.some((pola) => pola.test(bersih))) {
    // ditolak di backend, Gemini tidak dipanggil sama sekali
    return res.status(200).json({ success: true, data: { reply: PESAN_TOLAK } });
  }

  req.body.message = bersih;
  next();
};


const percobaan = new Map();
setInterval(() => percobaan.clear(), 10 * 60 * 1000).unref();

const batasiFrekuensi = (req, res, next) => {
  const sekarang = Date.now();
  const catatan = (percobaan.get(req.ip) || []).filter((t) => sekarang - t < 60 * 1000);

  if (catatan.length >= 10) {
    return res.status(429).json({
      success: false,
      message: 'Terlalu banyak pertanyaan. Tunggu sebentar lalu coba lagi.',
    });
  }
  catatan.push(sekarang);
  percobaan.set(req.ip, catatan);
  next();
};

module.exports = { validateChatInput, batasiFrekuensi };