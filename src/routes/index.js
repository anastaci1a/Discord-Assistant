// dependencies

import express from 'express';
const router = express.Router();
const endpoint = '/';

import responder from '../lib/responder.js';
import * as auth from '../lib/auth.js';

import { StatusConsole } from '../lib/logging.js';
const console = new StatusConsole('index.js');


// router management

// welcome message
router.get('/', (req, res) => {
  responder(res, 200, {}, "Request completed successfully. Welcome to the server!");
});
router.get('/api', auth.verifyKey, (req, res) => {
  responder(res, 200, {}, "Request completed successfully. Welcome to the server (api)!");
});


// exports

export { endpoint, router };
