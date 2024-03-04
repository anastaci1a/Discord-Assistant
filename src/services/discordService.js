// dependencies

import { Client, Events, GatewayIntentBits } from 'discord.js';

import bots from './botConfig.js';


// setup bots

for (const bot of bots) {
  const discordData = bot.discord;
  if (discordData !== undefined) { // if bot has a respective discord client
    const client = discordData.client;
    client.once(Events.ClientReady, readyClient => {
    	console.log(`logged in on discord as '${readyClient.user.tag}' ('${bot.chatName}')...`);
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
