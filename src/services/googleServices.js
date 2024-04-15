// dependencies

import { getModulesInDirectory } from '../lib/fileManager.js';


// system

async function initialize() {
  const services = await getModulesInDirectory('./services/google');

  let successes = 0;
  for (const service of services) {
    try {
      const initialized = await service.initialize();
      if (initialized) successes++;
    } catch (error) {
      console.log("error during google services authentication", error);
      break;
    }
  }

  if (services.length == successes) {
    console.log("authenticated Google services...");
  } else {
    console.log("authentication of Google services could not be completed.");
  }
}


// exports

export { initialize };
