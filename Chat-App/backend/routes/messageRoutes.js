const express = require('express');
const { protect } = require('../middleware/authMiddleware.js');
const { sendMessage, allMessages } = require('../controllers/messageControllers.js');


const router = express.Router();


router.route('/').post(protect, sendMessage);
router.route('/:chatId').get(protect, allMessages);


module.exports = router;