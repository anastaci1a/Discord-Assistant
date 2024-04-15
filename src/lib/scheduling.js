// dependencies

import schedule from 'node-schedule';


// system

const ScheduleMode = Object.freeze({
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
});

/**
 * Normalize time string to 24-hour format.
 * @param {string} timeStr The time string in "HH:MM AM/PM" or "H:MM AM/PM" or "HH:MM" or "H:MM".
 * @returns An object containing hours and minutes.
 */
function normalizeTime(timeStr) {
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

/**
 * Schedules a function to run once at a future date and time.
 * @param scheduledFunction The function to schedule.
 * @param dateStr The date string in "MM-DD-YY" format.
 * @param timeStr (optional) The time string in "HH:MM AM/PM" format, default is "12:00 PM".
 */
function scheduleOnce(scheduledFunction, dateStr, timeStr = '12:00 PM') {
  const { hours, minutes } = normalizeTime(timeStr);
  const scheduledDate = new Date(`${dateStr} ${hours}:${minutes}:00`);

  schedule.scheduleJob(scheduledDate, scheduledFunction);
}

/**
 * Schedules a function to be run repeatedly based on the provided mode.
 * @param scheduledFunction The function to schedule.
 * @param mode The mode of reoccurrence (DAILY, WEEKLY, MONTHLY).
 * @param timeStr (optional) The time string, default is "12:00 PM".
 */
function scheduleReoccurring(scheduledFunction, mode, timeStr = '12:00 PM') {
  let rule = new schedule.RecurrenceRule();
  const { hours, minutes } = normalizeTime(timeStr);

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
      console.error('Invalid mode provided.');
      return;
  }

  schedule.scheduleJob(rule, scheduledFunction);
}


// exports

export { scheduleOnce, scheduleReoccurring };
