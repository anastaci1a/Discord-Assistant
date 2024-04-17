// dependencies

import * as fm from './fileManager.js';
import schedule from 'node-schedule';

import { StatusConsole } from './logging.js';
const console = new StatusConsole('scheduler.js');


// system

const functionsToSchedule = Object.freeze({
  sampleFunction: async () => { console.log("Scheduled function executed successfully..."); }
  // ...
});

const ScheduleMode = Object.freeze({
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
});

class Scheduler {
  constructor(savePath = "", autosave = false) {
    this.events = {
      reoccurring: [],
      oneTime: [],
      params: {
        savePath,
        autosave
      }
    };
  }

  async loadEvents(savePath = this.events.params.savePath) {
    if (savePath) {
      try {
        const file = await fm.loadJsonFromFile(savePath);
        // Reschedule tasks on load
        this.events.oneTime.forEach(event => {
          const { id, functionName, dateStr, timeStr } = event;
          this.scheduleOnce(functionName, dateStr, timeStr, id);
        });
        this.events.reoccurring.forEach(event => {
          const { id, functionName, mode, timeStr } = event;
          this.scheduleReoccurring(functionName, mode, timeStr, id);
        });
        this.events = file;


      } catch (error) {
        if (autosave) {
          console.log('Failed to load scheduled events. Attempting to save...');
          try {
            await this.saveEvents();
            console.log('Saved new events file...');
          } catch (error) {
            console.log('Failed to save new events file.'); //\n', err);
          }
        } else {
          console.error("Failed to load scheduled events.");
        }
      }
    } else {
      console.error("Failed to load scheduled events (no `savePath` provided).")
    }
  }

  async saveEvents(savePath = this.events.params.savePath) {
    try {
      await fm.saveJsonToFile(savePath, this.events);
    } catch (error) {
      throw error;
    }
  }

  #getId() {
    const timestamp = Date.now();
    const randomized = Math.floor(Math.random() * 10000);
    return `${timestamp}-${randomized}`;
  }

  #normalizeTime(timeStr) {
    // Convert to uppercase for AM/PM comparison
    const upperTimeStr = timeStr.toUpperCase();
    let [time, modifier] = upperTimeStr.split(' ');

    let [hours, minutes] = time.split(':').map(Number);

    // Adjust hours for 12-hour AM/PM format
    if (modifier === 'PM' && hours < 12) {
     hours += 12;
    } else if (modifier === 'AM' && hours === 12) {
     hours = 0;
    }

    return { hours, minutes };
  }

  async scheduleOnce(functionName, dateStr, timeStr = '12:00 PM', providedId = "") {
    const id = providedId || this.#getId();

    if (!providedId) {
      const event = { id, functionName, dateStr, timeStr, type: 'oneTime' };
      this.events.oneTime.push(event);

      if (this.events.params.autosave) {
        await this.saveEvents();
      }
    }

    const funcToExecute = functionsToSchedule[functionName];
    const scheduledExecution = async () => {
      if (funcToExecute) {
        await Promise.resolve(funcToExecute());
        this.events.oneTime = this.events.oneTime.filter(e => e.id !== id);
        if (this.events.params.autosave) this.saveEvents();
      }
    };

    const { hours, minutes } = this.#normalizeTime(timeStr);
    const scheduledDate = new Date(`${dateStr} ${hours}:${minutes}:00`);
    schedule.scheduleJob(scheduledDate, scheduledExecution.bind(this));
  }

  scheduleReoccurring(functionName, mode, timeStr = '12:00 PM', providedId = "") {
    const id = providedId || this.#getId();

    if (!providedId) {
      const event = { id, functionName, mode, timeStr, type: 'reoccurring' };
      this.events.reoccurring.push(event);

      if (this.events.params.autosave) {
        this.saveEvents();
      }
    }

    const funcToExecute = functionsToSchedule[functionName];
    const scheduledExecution = async () => {
      if (funcToExecute) {
        await Promise.resolve(funcToExecute());
      }
    };

    const rule = new schedule.RecurrenceRule();
    const { hours, minutes } = this.#normalizeTime(timeStr);

    // Apply the normalized time to the rule
    rule.hour = hours;
    rule.minute = minutes;

    switch (mode) {
      case ScheduleMode.DAILY:
        break; // Rule defined by hour and minute
      case ScheduleMode.WEEKLY:
        rule.dayOfWeek = new schedule.Range(0, 6);
        break;
      case ScheduleMode.MONTHLY:
        rule.date = 1;
        break;
      default:
        console.error('Invalid reoccurring mode provided.');
        return;
    }

    schedule.scheduleJob(rule, scheduledExecution);
  }
}


// export

export default Scheduler;
