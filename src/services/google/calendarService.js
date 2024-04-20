// dependencies

import { getOAuthClient } from '../../lib/googleManager.js';
import { google } from 'googleapis';

import { StatusConsole } from '../../lib/logging.js';
const console = new StatusConsole('calendarService.js');


// system

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = 'src/data/google/google_calendar_token.json';
const SECRET_PATH = 'src/data/google/google_calendar_secret.json';

async function initialize() {
  await getClient();
  return true;
}

async function getClient() {
  return await getOAuthClient(SCOPES, TOKEN_PATH, SECRET_PATH);
}

async function getNextEvents(eventCount) {
  try {
    const authClient = await getClient();
    const calendar = google.calendar({ version: 'v3', auth: authClient });
    const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: eventCount,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = res.data.items;
    if (events.length) {
      // console.log('Upcoming events:');
      // events.map((event, i) => {
      //   const start = event.start.dateTime || event.start.date;
      //   console.log(`${start} - ${event.summary}`);
      // });
      return events; // Returns the events array
    } else {
      // console.log('No upcoming events found.');
      return []; // Return an empty array if no events found
    }
  } catch (error) {
    console.errorThrow("getNextEvents", 'Google API error:', error);
  }
}


// exports

export { initialize, getNextEvents };
