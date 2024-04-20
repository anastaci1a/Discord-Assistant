// dependencies

import * as fm from './fileManager.js';
import schedule from 'node-schedule';
import functionsToSchedule from './schedulerFunctions.js';

import { StatusConsole } from './logging.js';
const console = new StatusConsole('scheduler.js');


// system

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

        // Reschedule events on load
        file.oneTime.forEach(event => {
          const { id, functionName, dateStr, timeStr } = event;
          this.scheduleOnce(functionName, dateStr, timeStr, id);
        });
        file.reoccurring.forEach(event => {
          const { id, functionName, mode, timeStr } = event;
          this.scheduleReoccurring(functionName, mode, timeStr, id);
        });
        this.events = file;
      } catch (error) {
        if (this.events.params.autosave) {
          console.warn("Scheduler.loadEvents", "Failed to load events file. Attempting to save...");
          try {
            await this.saveEvents();
            console.resolve("Saved new events file...");
          } catch (error) {
            console.errorThrow("Scheduler.loadEvents", "Failed to save new events file.", error);
          }
        } else {
          console.errorThrow("Scheduler.loadEvents", "Failed to load events file.", error);
        }
      }
    } else {
      console.errorThrow("Scheduler.loadEvents", "Failed to load events file (no `savePath` provided).")
    }

    if (this.#removeOldEvents() && this.events.params.autosave) {
      try {
        this.saveEvents();
      } catch (error) {
        console.errorThrow("Scheduler.loadEvents", "Attempted and failed to save updated events file (removed old events).", error);
      }
    }
  }

  async saveEvents(savePath = this.events.params.savePath) {
    if (savePath) {
      try {
        this.#removeOldEvents();
        await fm.saveJsonToFile(savePath, this.events);
      } catch (error) {
        console.errorThrow("Scheduler.saveEvents", error);
      }
    } else {
      console.errorThrow("Scheduler.saveEvents", "Failed to save events file (no `savePath` provided).")
    }
  }

  #removeOldEvents() {
    const indicesToRemove = [];
    this.events.oneTime.forEach((event, i) => {
      const { id, functionName, dateStr, timeStr } = event;
      const scheduledDate = this.#parseDateTime(dateStr, timeStr);
      if (scheduledDate < new Date()) indicesToRemove.push(i);
    });

    indicesToRemove.reverse();
    for (const i of indicesToRemove) {
      this.events.oneTime.splice(i, 1);
    }

    return indicesToRemove.length > 0;
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

  #parseDateTime(dateStr, timeStr) {
    const { hours, minutes } = this.#normalizeTime(timeStr);
    return new Date(`${dateStr} ${hours}:${minutes}:00`);
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

    const scheduledDate = this.#parseDateTime(dateStr, timeStr);
    schedule.scheduleJob(scheduledDate, scheduledExecution.bind(this));
  }

  scheduleReoccurring(functionName, mode, timeStr = '12:00 PM', providedId = "") {
    const id = providedId || this.#getId();

    if (!providedId) {
      const event = { id, functionName, mode, timeStr, type: 'reoccurring' };

      // check if event already exists (do I actually need this? redundant?)
      // events.oneTime.forEach(_event => {
      //   const { id as _id, functionName as _functionName, mode as _mode, dateStr as _dateStr, timeStr as _timeStr } = eventToCheck;
      //   // ...
      // })

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
        console.errorThrow("Scheduler.scheduleReoccurring", "Invalid reoccurring mode provided.");
        return;
    }

    schedule.scheduleJob(rule, scheduledExecution);
  }
}

async function getScheduler() {
  const schedulerService = await import('../services/utils/schedulerService.js');
  return schedulerService.getScheduler();
}


// export

export { Scheduler, ScheduleMode, getScheduler };
