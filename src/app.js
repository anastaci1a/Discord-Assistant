// dependencies

import 'dotenv/config';
const port = process.env.PORT || 3000;

import startServices from './services.js';
// import startServer from './server.js';
// import { startNgrok } from './lib/ngrokManager.js';

import { StatusConsole } from './lib/logging.js';
const console = new StatusConsole('app.js');


// services

startServices();


// server

// const app = await setupApp();
// app.listen(port, () => {
//   console.log(`listening on port ${port}...`);
//   startNgrok(port);
// });
