// dependencies

require('express-async-errors');
const express = require('express');
const app = express();
const { getModulesInDirectory } = require('@lib/file-manager');
const responder = require('@lib/responder');


// app setup

app.use(express.json());

const routers = getModulesInDirectory('./routes');
for (let router of routers) app.use(router.endpoint, router.router);

app.use((error, req, res, next) => {
  console.error(error.stack);
  responder(res, 500, { "stack": error.stack });
});


// exports

module.exports = app;
