// dependencies

import { Client, Events, GatewayIntentBits } from 'discord.js';

import bots from './bots/botConfig.js';

import { StatusConsole } from '../lib/logging.js';
const console = new StatusConsole('discordService.js');


// system

async function initialize() {
  for (const bot of bots) {
    const discordData = bot.discord;
    if (discordData !== undefined) { // if bot has a respective discord client
      const client = discordData.client;
      client.once(Events.ClientReady, readyClient => {
      	console.log(`Logged in as '${readyClient.user.tag}' ('${bot.uid}')...`);
        discordData.username = readyClient.user.tag;

        if (discordData.events !== undefined) {
          for (const event of discordData.events) {
            client.on(event.on, param => event.execute(bot, param));
          }
        }
      });

      client.login(discordData.token).catch(error => console.error(`Login failed for ${bot.chatName}:`, error));
    }
  }
}


// exports

export { initialize };
