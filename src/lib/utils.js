// dependencies
import moment from 'moment-timezone';

// exports

export async function allAreTrue(functionsArray) {
  try {
    // Execute all functions and wait for their resolution
    const results = await Promise.all(functionsArray.map(func => func()));

    // Check if all results are true
    return results.every(result => result === true);
  } catch (error) {
    // Handle any errors that may occur during the execution of the functions
    console.error("An error occurred:", error);
    return false;
  }
}

export function dateTime(mode = 0/*, timeZone = "America/New_York"*/) {
  // simple
  if (mode == 0) return moment().format('MMDDYY');
  // verbose 1
  else if (mode == 1) return moment().format(`MMMM D, YYYY (h:mm A)`);
  // verbose 2
  else if (mode == 2) return moment().format(`h:mma - MMMM D, YYYY`);

  // moment object
  else if (mode == 3) return moment();
}

export function parseDateTime(dateTimeToParse, mode = 0/*, timeZone = "America/New_York"*/) {
  // simple
  if (mode == 0) return moment(dateTimeToParse, 'MMDDYY');
  // verbose
  else if (mode == 1) return moment(dateTimeToParse, `MMMM D, YYYY (h:mm A)`);
  // medium
  else if (mode == 2) return moment(dateTimeToParse, `h:mma - MMMM D, YYYY`);
}

export function dateTimeDifference(largerTime, lesserTime) {
  return largerTime.diff(lesserTime, 'minutes');
}

export function formatDateTimeDifference(minutes) {
  const days = Math.floor(minutes / (60 * 24));
  const hours = Math.floor((minutes % (60 * 24)) / 60);
  const mins = minutes % 60;

  let result = "";
  if (days > 0) result += `${days} day${days > 1 ? 's' : ''}, `;
  if (hours > 0 || days > 0) result += `${hours} hour${hours > 1 ? 's' : ''}, `;
  result += `${mins} minute${mins > 1 ? 's' : ''}`;

  return result;
}
