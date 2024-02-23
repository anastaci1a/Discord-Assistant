// dependencies

require('module-alias/register');
require('dotenv').config();

// server

const app = require('./server');
const { startNgrok } = require('@lib/ngrok-manager');
const port = process.env.PORT || 3000;

// ngrok
startNgrok(port).catch(console.error);

// listen on app
app.listen(port);
