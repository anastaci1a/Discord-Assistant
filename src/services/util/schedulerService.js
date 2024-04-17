// dependencies

import Scheduler from '../../lib/scheduler.js'

import { StatusConsole } from '../../lib/logging.js';
const console = new StatusConsole('schedulerService.js');


// system

const schedulerDataPath = './data/scheduler/scheduler-data.json';
const scheduler = new Scheduler(schedulerDataPath, true);

async function initialize() {
  await scheduler.loadEvents();
  return true;
}


// exports

export { initialize, scheduler };
