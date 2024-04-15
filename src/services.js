// imports

import { getModulesInDirectory } from './lib/fileManager.js';


// system

async function startServices() {
  const services = await getModulesInDirectory('./services');

  for (const service of services) {
    try {
      await service.initialize();
    } catch (error) {
      console.log("error during services initialization", error);
      break;
    }
  }
}


// export

export default startServices;
