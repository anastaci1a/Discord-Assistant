// dependencies

import 'express-async-errors';
import express from 'express';

import { getModulesInDirectory } from './lib/fileManager.js';
import responder from './lib/responder.js';


// system

async function startServer() {
  const app = express();
  app.use(express.json());

  const routers = await getModulesInDirectory('./routes');
  for (const router of routers) {
    app.use(router.endpoint, router.router);
  }

  app.use((error, req, res, next) => {
    console.error(error.stack);
    responder(res, 500, { "stack": error.stack });
  });

  return app;
}


// export

export default setupServer;
