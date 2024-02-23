// dependencies

const express = require('express');
const router = express.Router();
const endpoint = '/';

const responder = require('@lib/responder');
const auth = require('@lib/auth');


// router management

// welcome message
router.get('/', (req, res) => {
  responder(res, 200, {}, "Request completed successfully. Welcome to the server!");
});
router.get('/api', auth.verifyKey, (req, res) => {
  responder(res, 200, {}, "Request completed successfully. Welcome to the server (api)!");
});


// exports

module.exports = { endpoint, router };
