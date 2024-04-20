// dependencies

import { Client, Events, GatewayIntentBits } from 'discord.js';

import { StatusConsole } from './logging.js';
const console = new StatusConsole('discordUtils.js');


// exports

export async function parseMessage(message, botDiscordData) {
  const client = botDiscordData.client;

  // parsing parameters
  const parseParams = botDiscordData?.parseParams || {};
  const defaultParseParams = {
    readableChannelMentions: true,
    readableUserMentions: true
  };
  const selectedParseParams = { ...defaultParseParams, ...parseParams };

  // return data
  const r = {
    username: `${message.author.username}#${message.author.discriminator}`,
    content: message.content,
    channelId: message.channelId,
    channel: undefined
  };

  // parse channelId into accessable channel object
  r.channel = await client.channels.fetch(r.channelId).catch(error => console.errorThrow("parseMessage", error));
  // r.channelName = r.channel.name;

  // parse all instances of channel mentions into readable text
  if (selectedParseParams.readableChannelMentions) {
    const channelMatches = r.content.match(/<#(\d+)>/g);
    if (channelMatches) {
      for (const match of channelMatches) {
        const channelId = match.slice(2, -1);
        const channel = await client.channels.fetch(channelId).catch(error => console.errorThrow("parseMessage", error));
        if (channel) {
          r.content = r.content.replace(match, `#${channel.name}`);
        }
      }
    }
  }

  // parse all instances of user mentions into readable text
  if (selectedParseParams.readableUserMentions) {
    const userMatches = r.content.match(/<@!?(\d+)>/g);
    if (userMatches) {
      for (const match of userMatches) {
        const userId = match.replace(/[<@!>]/g, '');
        const user = await client.users.fetch(userId).catch(error => console.errorThrow("parseMessage", error));
        if (user) {
          r.content = r.content.replace(match, `@${user.username}`);
        }
      }
    }
  }

  return r;
}
