// dependencies

import 'dotenv/config';
const port = process.env.PORT || 3000;

import startServices from './services.js';
// import startServer from './server.js';
// import { startNgrok } from './lib/ngrokManager.js';


// services

startServices();


// server

// const app = await setupApp();
// app.listen(port, () => {
//   console.log(`listening on port ${port}...`);
//   startNgrok(port);
// });
