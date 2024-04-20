// dependencies

import { getModulesInDirectory } from '../lib/fileManager.js';

import { StatusConsole } from '../lib/logging.js';
const console = new StatusConsole('utilServices.js');


// system

async function initialize() {
  const services = await getModulesInDirectory('./services/utils');

  let successes = 0;
  for (const service of services) {
    try {
      const initialized = await service.initialize();
      if (initialized) successes++;
    } catch (error) {
      console.errorThrow("initialize", "Error during util services initialization.", error);
      break;
    }
  }

  if (services.length == successes) {
    console.log("Initialized...");
  } else {
    console.errorThrow("initialize", "Initialization could not be completed.");
  }
}


// exports

export { initialize };
