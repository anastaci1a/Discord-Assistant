// dependencies

import { Scheduler } from '../../lib/scheduler.js'
import { awaitValueChange } from '../../lib/utils.js'

import { StatusConsole } from '../../lib/logging.js';
const console = new StatusConsole('schedulerService.js');


// system

const schedulerDataPath = './data/scheduler/scheduler-data.json';
const scheduler = new Scheduler(schedulerDataPath, true);

let initialized = false;
const getInitialized = () => initialized;

async function initialize() {
  await scheduler.loadEvents();
  initialized = true;
  return true;
}

async function getScheduler() {
  await awaitValueChange(getInitialized, true);
  return scheduler;
}


// exports

export { initialize, getScheduler };
