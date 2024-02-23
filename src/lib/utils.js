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

export function dateTime(simple, timeZone = "America/New_York") {
  if (simple) return moment().tz(timeZone).format('MMDDYY');
  else return moment().tz(timeZone).format(`MMMM D, YYYY (h:mm A ([${timeZone}]))`);
}
