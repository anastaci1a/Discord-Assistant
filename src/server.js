// dependencies

import 'express-async-errors';
import express from 'express';

import { getModulesInDirectory } from './lib/file-manager.js';
import responder from './lib/responder.js';


// export

export default async function setupApp() {
  const app = express();
  app.use(express.json());

  const routers = await getModulesInDirectory('./routes');
  for (let router of routers) {
    app.use(router.endpoint, router.router);
  }

  app.use((error, req, res, next) => {
    console.error(error.stack);
    responder(res, 500, { "stack": error.stack });
  });

  return app;
}
