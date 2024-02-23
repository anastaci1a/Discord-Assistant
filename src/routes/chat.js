// dependencies

const express = require('express');
const router = express.Router();
const endpoint = '/api/chat';

const auth = require('@lib/auth');
const chat = require('@controllers/chatController');


// router management

router.use(auth.verifyKey);
router.use(chat.systemIsReady);

// [GET /api/chat]: get current chats
router.get('/', chat.getChatdata);

// [POST /api/chat]: add chat to a given conversation then prompt ai
// {
//   "chat": "xxx",    [REQUIRED]
//   "content": "xxx", [REQUIRED]
//   "role": "xxx",    [DEFAULT: "user"]
//   "name": "xxx"     [DEFAULT: "unknown"]
// }
router.post('/', chat.ask);

// [POST /api/chat/add]: add message to a given conversation without prompting ai
// {
//   "chat": "xxx",    [REQUIRED]
//   "content": "xxx", [REQUIRED]
//   "role": "xxx",    [DEFAULT: "user"]
//   "name": "xxx"     [DEFAULT: "unknown"]
// }
router.post('/add', chat.addMessage);

// [POST /api/chat/prompt]: prompt ai
// {
//   "chat": "xxx" [REQUIRED]
// }
router.post('/prompt', chat.prompt);


// exports

module.exports = { endpoint, router };
