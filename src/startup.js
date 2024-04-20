// dependencies

import 'dotenv/config';

import startServices from './services.js';
import startServer from './server.js';

import { dateTime } from './lib/utils.js';

import { StatusConsole } from './lib/logging.js';
const console = new StatusConsole('startup.js');


// system

async function startup() {
  console.logNoStatus("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
  console.logNoStatus("********************************************************************"        +
                      "\n\x1b[34m ____  _                   _    _____         _     _           _" +
                      "\n|    \\|_|___ ___ ___ ___ _| |  |  _  |___ ___|_|___| |_ ___ ___| |_"      +
                      "\n|  |  | |_ -|  _| . |  _| . |  |     |_ -|_ -| |_ -|  _| .'|   |  _|"      +
                      "\n|____\/|_|___|___|___|_| |___|  |__|__|___|___|_|___|_| |__,|_|_|_|"       +
                      "\n\n\x1b[0m********************************************************************");
  console.logNoStatus(`\x1b[33m\n[${dateTime(2)}]\n\n`);
  console.log("Starting...");

  // services
  startServices().catch(error => {
    console.error("startup", error);
  });

  // api
  startServer().catch(error => {
    console.error("startup", error);
  });
}


// export

export default startup;
