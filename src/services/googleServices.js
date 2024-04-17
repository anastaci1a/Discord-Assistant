// dependencies

import { getModulesInDirectory } from '../lib/fileManager.js';

import { StatusConsole } from '../lib/logging.js';
const console = new StatusConsole('googleService.js');


// system

async function initialize() {
  const services = await getModulesInDirectory('./services/google');

  let successes = 0;
  for (const service of services) {
    try {
      const initialized = await service.initialize();
      if (initialized) successes++;
    } catch (error) {
      console.log("Error during google services authentication.\n", error);
      break;
    }
  }

  if (services.length == successes) {
    console.log("Authenticated...");
  } else {
    console.log("Authentication could not be completed.");
  }
}


// exports

export { initialize };
