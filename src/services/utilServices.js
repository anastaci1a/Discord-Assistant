// dependencies

import { getModulesInDirectory } from '../lib/fileManager.js';

import { StatusConsole } from '../lib/logging.js';
const console = new StatusConsole('utilServices.js');


// system

async function initialize() {
  const services = await getModulesInDirectory('./services/util');

  let successes = 0;
  for (const service of services) {
    try {
      const initialized = await service.initialize();
      if (initialized) successes++;
    } catch (error) {
      console.log("Error during util services startup.\n", error);
      break;
    }
  }

  if (services.length == successes) {
    console.log("Running...");
  } else {
    console.log("Startup could not be completed.");
  }
}


// exports

export { initialize };
