// dependencies

import 'express-async-errors';
import express from 'express';

import { getModulesInDirectory } from './lib/fileManager.js';
import responder from './lib/responder.js';
import { startNgrok } from './lib/ngrokManager.js';

import { StatusConsole } from './lib/logging.js';
const console = new StatusConsole('server.js');


// system

const port = process.env.PORT || 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  const routers = await getModulesInDirectory('./routes');
  for (const router of routers) {
    app.use(router.endpoint, router.router);
  }

  app.use((error, req, res, next) => {
    console.errorThrow("startServer", error.stack);
    responder(res, 500, { "stack": error.stack });
  });

  app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
    startNgrok(port);
  });
}


// export

export default startServer;
