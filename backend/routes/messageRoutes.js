const express = require('express');
const router  = express.Router();
const { getConversations, getMessages, sendMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/',                         getConversations);
router.get('/:other_user_id',           getMessages);
router.post('/',                        sendMessage);

module.exports = router;