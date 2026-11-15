const geminiService = require('../services/gemini.service');

const MAKS_RIWAYAT = 12; 
exports.kirimPesan = async (req, res) => {
  try {

    const riwayat = req.session.riwayatChat || [];

    const reply = await geminiService.tanya({
      pesan: req.body.message,
      riwayat,
      user: req.user, 
    });

    req.session.riwayatChat = [
      ...riwayat,
      { role: 'user', text: req.body.message },
      { role: 'model', text: reply },
    ].slice(-MAKS_RIWAYAT);

    res.status(200).json({ success: true, data: { reply } });
  } catch (error) {
    if (!error.status) console.error(error); 
    res.status(error.status || 500).json({
      success: false,
      message: error.status ? error.message : 'Terjadi kesalahan pada server',
    });
  }
};