const express = require('express');
const router = express.Router();
const chat = require('../controllers/chatController');
const { validateChatInput, batasiFrekuensi } = require('../middlewares/ValidateChatInput');

router.post('/api/chat', batasiFrekuensi, validateChatInput, chat.kirimPesan);

module.exports = router;