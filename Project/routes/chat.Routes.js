const express = require('express');
const router = express.Router();
const chat = require('../controllers/chat.controller');
const { validateChatInput, batasiFrekuensi } = require('../middlewares/validateChatInput');

router.post('/api/chat', batasiFrekuensi, validateChatInput, chat.kirimPesan);

module.exports = router;