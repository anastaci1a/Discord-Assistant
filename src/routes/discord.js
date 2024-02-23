// dependencies

import express from 'express';
const router = express.Router();
const endpoint = '/interactions';

import responder from '../lib/responder.js';
import {} from '../lib/discord/utils.js';
import * as discord from '../controllers/discordController.js';


// router management

router.get('/', (req, res) => {});


// exports

export { endpoint, router };
