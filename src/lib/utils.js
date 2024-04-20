// dependencies
import moment from 'moment-timezone';

// import { StatusConsole } from './logging.js';
// const console = new StatusConsole('botConfig.js');
// ^^^ broken for some reason?


// system

async function allAreTrue(functionsArray) {
  try {
    // Execute all functions and wait for their resolution
    const results = await Promise.all(functionsArray.map(func => func()));

    // Check if all results are true
    return results.every(result => result === true);
  } catch (error) {
    // Handle any errors that may occur during the execution of the functions
    console.errorThrow("allAreTrue", "An error occurred:", error);
    return false;
  }
}

/**
 * Excerpted from: https://momentjs.com/docs/?/displaying/format/#/parsing/string-format/
 *
 * > Year, month, and day tokens:
 * ------------------------------
 * `YYYY`/`YY`  : Year
 * `M`/`MM`     : Month number
 * `MMM`/`MMMM` : Month name (shortened/complete)
 * `D`/`DD`     : Day of month
 * `Do`         : Day of month (with ordinal)
 *
 * > Hour, minute, second, and millisecond tokens:
 * -----------------------------------------------
 * `h`/`hh`     : Hours (12 hour time; 1-12)
 * `H`/`HH`     : Hours (24 hour time; 0-23)
 * `k`/`kk`     : Hours (24 hour time; 1-24)
 * `a`/`A`      : Post or ante meridiem (no caps/caps)
 * `m`/`mm`     : Minutes
 * `s`/`ss`     : Seconds
 * `S`/`SS`/... : Fractional seconds
 *
 */


function dateTime(mode = 0/*, timeZone = "America/New_York"*/) {
  // simple 1
  if (mode == 0) return moment().format('MMDDYY');
  // verbose 1
  else if (mode == 1) return moment().format('dddd, MMMM D, YYYY (h:mm A)');
  // verbose 2
  else if (mode == 2) return moment().format('h:mma - dddd, MMMM D, YYYY');

  // moment object
  else if (mode == 3) return moment();

  // simple 2
  else if (mode == 4) return moment().format('h:mma M/D');
}

function parseDateTime(dateTimeToParse, mode = 0/*, timeZone = "America/New_York"*/) {
  // simple
  if (mode == 0) return moment(dateTimeToParse, 'MMDDYY');
  // verbose 1
  else if (mode == 1) return moment(dateTimeToParse, 'dddd, MMMM D, YYYY (h:mm A)');
  // verbose 2
  else if (mode == 2) return moment(dateTimeToParse, 'h:mma - dddd, MMMM D, YYYY');

  // simple 2
  else if (mode == 4) return moment(dateTimeToParse, 'h:mma M/D');
}

function dateTimeDifference(largerTime, lesserTime) {
  return largerTime.diff(lesserTime, 'minutes');
}

function formatDateTimeDifference(minutes) {
  const days = Math.floor(minutes / (60 * 24));
  const hours = Math.floor((minutes % (60 * 24)) / 60);
  const mins = minutes % 60;

  let result = "";
  if (days > 0) result += `${days} day${days > 1 ? 's' : ''}, `;
  if (hours > 0 || days > 0) result += `${hours} hour${hours > 1 ? 's' : ''}, `;
  result += `${mins} minute${mins > 1 ? 's' : ''}`;

  return result;
}

function awaitValueChange(valueAccessor, desiredValue, timeout = null, checkInterval = 100) {
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            const currentValue = valueAccessor();
            if (currentValue === desiredValue) {
                clearInterval(interval);
                clearTimeout(timeoutHandle);
                resolve(true);
            }
        }, checkInterval);

        let timeoutHandle;
        if (timeout !== null) {
            timeoutHandle = setTimeout(() => {
                clearInterval(interval);
                console.errorThrow("awaitValueChange", "Timeout reached without value change.");
                resolve(false);
            }, timeout);
        }
    });
}


// exports

export { allAreTrue, dateTime, parseDateTime, dateTimeDifference, formatDateTimeDifference, awaitValueChange };
