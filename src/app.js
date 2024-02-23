// dependencies

import 'dotenv/config';

import setupApp from './server.js';
import { startLocaltunnel as startTunnel } from './lib/tunnel/localtunnel-manager.js';
// import { startNgrok as startTunnel } from './lib/tunnel/ngrok-manager.js';
const port = process.env.PORT || 3000;


// server

const app = await setupApp();
app.listen(port, startTunnel(port));
