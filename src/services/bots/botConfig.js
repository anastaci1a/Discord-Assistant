// dependencies

import { Client, Events, GatewayIntentBits } from 'discord.js';

import { Chathub } from '../../lib/openai.js';
import * as du from '../../lib/discordUtils.js';

import { StatusConsole } from '../../lib/logging.js';
const console = new StatusConsole('botConfig.js');


// init

const chathub = new Chathub();
const chatdataPath = './data/chats/chat-data.json';
chathub.params.savePath = chatdataPath;
chathub.loadChats();


// system

const bots = [
  // "Eve" config
  {
    // general access bot uid
    uid: "Eve",

    // discord config
    discord: {
      token: process.env.DISCORD_BOT_EVE_TOKEN,
      username: "",
      client: new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent
        ]
      }),
      events: [
        {
          on: Events.MessageCreate,
          execute: async (thisBot, message) => {
            const parsed = await du.parseMessage(message, thisBot.discord);
            if (parsed.username != thisBot.discord.username) {
              try {
                const inputMessage = {
                  content: parsed.content,
                  role: "user",
                  name: parsed.username,
                  origin: parsed.channel.name,
                  isFromDiscord: true
                };
                const response = await thisBot.utils.processMessage(thisBot, inputMessage);
                if (response.happened) {
                  await parsed.channel.send(response.message);
                }
              } catch (error) {
                console.error("An error occurred while processing a response:", error);
              }
            }
          }
        }
      ],
      parseParams: {
        readableChannelMentions: true,
        readableUserMentions: true
      }
    },

    // chat config
    chatName: "Eve", // name of chat in 'src/data/chats/chat-data.json'.chats[*].name
    autosave: true,
    utils: {
      processMessage: async (thisBot, inputMessage) => {
        const response = {
          happened: false,
          message: ""
        };

        // check if message ends with a "prompt ending" and execute accordingly
        let cont = true;
        for (const promptEnding of thisBot.promptEndings) {
          if (inputMessage.content.endsWith(promptEnding.str)) {
            if (promptEnding.strReplace) {
              inputMessage.content = inputMessage.content.slice(0, inputMessage.content.length - promptEnding.str.length);
              inputMessage.content += promptEnding.strReplace || "";
            }

            const execution = promptEnding.execute(thisBot, inputMessage);

            cont = execution?.cont ?? true;
            response.happened = execution?.responseHappened ?? false;
            response.message = execution?.responseMessage ?? "";
            break;
          }
        }

        // if no prompt ending or prompt ending specifies that the process can continue
        if (cont) {
          const chatResponse = await chathub.ask(thisBot.chatName, inputMessage);
          response.happened = true;
          response.message = chatResponse.content;
        }

        // autosave regardless of cont
        if (thisBot.autosave) chathub.saveChats();

        // return
        return response;
      }
    },
    promptEndings: [ // `.execute(...)` is always called with (thisBot, message, username, origin, isFromDiscord)
      // add message without prompting
      {
        "str": " ,",
        "strReplace": "",
        "execute": (thisBot, inputMessage) => {
          chathub.addMessage(thisBot.chatName, inputMessage);

          return { cont: false };
        }
      },
      {
        "str": "/schedule",
        "execute": (thisBot, inputMessage) => {
          // add system message after user message stating that the chat has been switched to the 'Scheduling Bot' chat
          // add Scheduling Bot message with the upcoming real calendar data (2 weeks or so)
          // add Scheduling Bot message with the current goals of the user
          // prompt (and ask user if the new schedule blocks are satisfactory)
          // if not approved (message from user):
          // prompt again (until adequate)
          // if approved:
          // parse response into readable json
          // add schedule blocks to google calendar (api)
        }
      },
      {
        "str": "/goals",
        "execute": (thisBot, inputMessage, origin, isFromDiscord) => {
          // pull up goals file
        }
      }
    ]
  },

  // "Scheduling Bot" config
  {
    // general access bot uid
    uid: "Scheduling Bot",

    // discord config
    discord: {
      token: process.env.DISCORD_BOT_SCHEDULING_TOKEN,
      username: "",
      client: new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent
        ]
      }),
      events: [
        // ...
      ]
    },

    // chat config
    chatName: "Scheduling Bot",
    autosave: true,
    utils: {
      // processMessage: async (thisBot, inputMessage) => {
      //   // ...
      // }
    },
    promptEndings: {
      // ...
    }
  }
];

function getBot(uid) {
  for (const bot of bots) {
    if (bot.uid == uid) return bot;
  }
  console.error(`Bot uid not found ('${uid}')`);
}


// exports

export default bots;
