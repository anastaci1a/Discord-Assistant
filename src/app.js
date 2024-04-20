// dependencies

import 'dotenv/config';

import startup from './startup.js';

import { StatusConsole } from './lib/logging.js';
const console = new StatusConsole('app.js');


// main

startup();
