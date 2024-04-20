// dependencies

import axios from 'axios';
import * as fm from './fileManager.js';
import * as utils from './utils.js';

import { StatusConsole } from './logging.js';
const console = new StatusConsole('openai.js');


// system

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const Endpoints = Object.freeze({
  "CHAT": "https://api.openai.com/v1/chat/completions",
  "IMAGE": "https://api.openai.com/v1/images/generations"
});

const chatDefaults = {
  // CUSTOM fields - by me :)
  "full_response": false,

  // REQUIRED fields - by OpenAI

  "messages": [                      // [array]                    (a list comprised of the conversation so far)
    {
      "role": "assistant",
      "content": "You are a helpful assistant."
    }
  ],
  "model": "gpt-4-turbo-2024-04-09", // [string]                   (id of the model to use)

  // OPTIONAL fields - by OpenAI

  // "frequency_penalty": 0,         // [number -2 to 2 or null]   (positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim)
  // "logit_bias": null,             // [map]                      (modify the likelihood of specified tokens appearing in the completion)
  // "logprobs": false,              // [boolean or null]          (whether to return log probabilities of the output tokens or not)
  // "top_logprobs": 0,              // [number 0 to 5 or null]    (specifies the number of most likely tokens to return at each token position, each with an associated log probability.)
  "max_tokens": 4096,                // [integer or null]          (the maximum number of tokens that can be generated in the chat completion)
  // "n": 1,                         // [integer or null]          (number of chat completion choices)
  // "presence_penalty": 0,          // [number or null]           (positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics)
  // "response_format": "text",      // [string]                   (the format that the model must output, "text" or "json_object")
  // "seed": null,                   // [integer or null]          (requests with the same seed and parameters attempt return the same result)
  // "stop": null,                   // [array of strings or null] (stop sequences)
  // "temperature": 1,               // [number 0 to 2 or null]    (what sampling temperature to use; higher = more random, lower = more focused/deterministic)
  // "top_p": 1,                     // [number or null]           (an alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass)
  // "tools":                        // [array]                    (a list of tools the model may call)
  // [
  //   {
  //     "type": "function",
  //     "function": {
  //       "name": "get_current_weather",
  //       "description": "Get the current weather in a given location",
  //       "parameters": {
  //         "type": "object",
  //         "properties": {
  //           "location": {
  //             "type": "string",
  //             "description": "The city and state, e.g. San Francisco, CA",
  //           },
  //           "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
  //         },
  //         "required": ["location"],
  //       },
  //     }
  //   }
  // ],
  // "tool_choice": "auto",          // [string or object]         (controls which (if any) function is called by the model)
  // "user": "123456789"             // [string]                   (a unique identifier representing the end-user)
};

async function __fetchAPI(url, payload) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`
  };

  try {
    return await axios.post(url, payload, { headers: headers });
  } catch (error) {
    // if (error.response) {
    //   // The request was made and the server responded with a status code
    //   // that falls out of the range of 2xx
    //   console.error("Error data:", error.response.data);
    //   console.error("Error status:", error.response.status);
    //   console.error("Error headers:", error.response.headers);
    // } else if (error.request) {
    //   // The request was made but no response was received
    //   console.error("No response received:", error.request);
    // } else {
    //   // Something happened in setting up the request that triggered an Error
    //   console.error("Error:", error.message);
    // }
    // console.error("Config:", error.config);
    console.errorThrow("__fetchAPI", error);
  }
}

async function __chatCompletion(messages, params = {}) {
  let payload = { ...chatDefaults, ...params, messages: __parseMessages(messages) };
  let { full_response, ...rest } = payload;
  payload = rest;

  try {
    const response = await __fetchAPI(Endpoints.CHAT, payload);
    return full_response ? response.data : response.data.choices[0].message;
  } catch (error) {
    console.errorThrow("__chatCompletion", error);
  }
}

function __parseMessages(messages) {
  let parsed = [];
  for (let i = 0; i < messages.length; i++) {
    let m = messages[i];
    parsed.push({
      "content": m.content,
      "role": m.role,
      "name": m.name
    });
  }
  return parsed;
}


// exports

class Chathub {
  constructor(params) {
    this.chats = new Map();

    this.params = {
      "archive": true,
      "savePath": './data/chats/chat-data.json',
      "autoCreate": true
    }
    this.setParams(params);
  }


  // chat methods directly translated from `Chat` class

  async ask(chatName, content, role, name, origin, isFromDiscord) {
    return this.getChat(chatName).ask(content, role, name, origin, isFromDiscord);
  }

  async prompt(chatName) {
    return this.getChat(chatName).prompt();
  }

  async promptNoRecord(chatName) {
    return this.getChat(chatName).promptNoRecord();
  }

  addMessage(chatName, content, role, name, origin, isFromDiscord) {
    this.getChat(chatName).addMessage(content, role, name, origin, isFromDiscord);
  }


  // chat management methods

  getChat(name) {
    let chat = this.chats.get(name);
    if (chat === undefined) {
      if (this.params.autoCreate) {
        chat = this.createChat(name);
      } else console.errorThrow("ChatHub.getChat", "Attempted to access non-existent chat.");
    }
    return chat;
  }

  createChat(name, messages = [], params = {}) {
    this.chats.set(name, new Chat(messages, params));
    return this.chats.get(name);
  }

  deleteChat(name) {
    return this.chats.delete(name);
  }


  // file management methods

  async loadChats(pathToJson = this.params.savePath) {
    try {
      let chatdata = await fm.loadJsonFromFile(pathToJson);
      this.loadFromJson(chatdata);
    } catch (error) {
      console.errorThrow("ChatHub.loadChats", "Could not load/parse chat data from JSON file.");
    }
  }

  async saveChats(pathToJson = this.params.savePath, archive = this.params.archive) {
    try {
      let chatdata = this.getJson();
      if (archive) {
        const simpleTimestamp = utils.dateTime(0);
        const archivePath = pathToJson.replace(/(\/)([^\/]+)(\.json)$/, `$1archive/$2_${simpleTimestamp}$3`);
        await fm.saveJsonToFile(archivePath, chatdata);
      }
      await fm.saveJsonToFile(pathToJson, chatdata);
    } catch (error) {
      console.log(error);
      console.errorThrow("ChatHub.saveChats", "Could not save chats to JSON file.")
    }
  }

  loadFromJson(chatdata) {
    try {
      this.setParams(chatdata?.params);
      for (let i = 0; i < chatdata.chats.length; i++) {
        let chat = chatdata.chats[i];
        let name = chat.name;
        this.createChat(name, chat.messages, chat.params);
        this.getChat(name).setDefaults(chat.defaults);
      }
    } catch (error) {
      console.errorThrow("ChatHub.loadFromJson", "Could not load/parse chat data from JSON.");
    }
  }

  getJson() {
    try {
      let chatdata = {
        "chats": [],
        "params": this.params,
        "timestamp": utils.dateTime(1)
      };
      this.chats.forEach((chat, name) => {
        chatdata.chats.push({
          "name": name,
          "messages": chat.messages,
          "params": chat.params,
          "defaults": chat.defaults
        });
      });
      return chatdata;
    } catch (error) {
      console.errorThrow("ChatHub.getJson", "Could not convert chats to JSON.");
    }
  }


  // misc methods

  setParams(params = {}) {
    this.params =  { ...params, ...this.params };
  }
}

class Chat {
  constructor(messages = [], params = {}, defaults = {}) {
    this.messages = messages;

    this.params = params;

    this.defaults = {
      "role": "user",
      "name": "unknown",
      "assistantName": "unknown",

      "timestampStatus": false,
      "timestampStatusTimeout": 10, // minutes

      "originStatus": false,

      "errorRetryCount": 10
    };

    this.setDefaults(defaults);
  }

  async ask(content, role, name, origin, isFromDiscord) {
    // ask(content: string, [role: string], [name: string], [origin: string], [isFromDiscord: boolean])
    // ask(message: object)
    if (typeof content === 'string' || (typeof content === 'object' && content !== null && !Array.isArray(content))) {
      this.addMessage(content, role, name, origin, isFromDiscord);
      return await this.prompt();
    }

    // ask(messages: array<object>)
    // Note: This recursively calls 'ask' which (in this use-case) only will handle objects.
    else if (Array.isArray(content) && content.every(item => typeof item === 'object' && item !== null)) {
      for (let message of content) {
        await this.ask(message);
      }
    }

    // error handling
    else {
      console.errorThrow("Chatter.ask", "Arguments not recognized.");
    }
  }

  async prompt() {
    const response = await this.promptNoRecord();
    this.addMessage(response);
    return response;
  }

  async promptNoRecord() {
    const response = await chatCompletion(this.messages, this.params, this.defaults.errorRetryCount);
    const responseWithName = { name: this.defaults.assistantName, ...response };
    return responseWithName;
  }

  addMessage(content, role, name, origin, isFromDiscord) {
    // addMessage(content: string, [role: string], [name: string], [origin: string], [isFromDiscord: boolean])
    if (typeof content === 'string') {
      // use previous message's origin and isFromDiscord as defaults
      const lastMessage = this.lastMessage();
      const currOrigin = origin || lastMessage?.origin;
      const currIsFromDiscord = isFromDiscord || lastMessage?.isFromDiscord;

      // system message
      this.addStatusMessage(currOrigin, currIsFromDiscord);

      // actual message
      this.__addMessage({
        "content": content,
        "role": role,
        "name": name,
        "origin": currOrigin,
        "isFromDiscord": currIsFromDiscord
      });
    }

    // addMessage(message: object)
    else if (typeof content === 'object' && content !== null && !Array.isArray(content)) {
      this.addMessage(content.content, content.role, content.name, content.origin, content.isFromDiscord);
    }

    // error handling
    else {
      console.errorThrow("Chatter.addMessage", "Arguments not recognized.");
    }
  }

  __addMessage(message) {
    // parse name (if given)
    const name = message.name != "[NONE]" ? (message.name !== undefined ? message.name.replace(/[^a-zA-Z0-9]/g, '_') : this.defaults.name) : undefined;

    // defaults
    const messageToAdd = {
      "content": message.content || "",
      "role": message.role || this.defaults.role,
      "name": name,
      "origin": message.origin,
      "isFromDiscord": message.isFromDiscord,
      "timestamp": message.timestamp || utils.dateTime(2)
    }

    // push message to this.messages
    this.messages.push(messageToAdd);
  }

  addStatusMessage(origin, isFromDiscord, forceShow = false) {
    const lastMessage = this.lastMessage();
    const currOrigin = origin || lastMessage?.origin;
    const currIsFromDiscord = isFromDiscord || lastMessage?.isFromDiscord;

    const originStatus = this.getOriginStatus(currOrigin, currIsFromDiscord, forceShow);
    const timestamp = this.getTimestamp(forceShow);

    const systemMessage = (originStatus || "") + (originStatus && timestamp ? "\n" : "") + (timestamp || "");
    if (systemMessage !== "") {
      this.__addMessage({
        "content": systemMessage,
        "role": "system",
        "name": "[NONE]",
        "origin": currOrigin,
        "isFromDiscord": currIsFromDiscord
      });
    }
  }

  getOriginStatus(origin, isFromDiscord, forceShow = false) {
    if (this.defaults.originStatus || forceShow) {
      const lastMessage = this.lastMessage();
      const lastOrigin = lastMessage?.origin;
      const lastIsFromDiscord = lastMessage?.isFromDiscord;

      const isDifferent = origin !== lastOrigin || isFromDiscord !== lastIsFromDiscord;
      if (isDifferent || forceShow) {
        const announceSwitch = origin === undefined || isFromDiscord === undefined
        return this.__getOriginStatus(origin, isFromDiscord, announceSwitch);
      }
    }
  }

  __getOriginStatus(origin, isFromDiscord, announceSwitch = true) {
    let content = "";
    if (announceSwitch) {
      if (isFromDiscord) content += `[The chat has been switched to the channel #${origin}]`;
      else content += `[The chat has been switched to '${origin}', outside of Discord]`;
    } else {
      if (isFromDiscord) content += `[The chat is currently set to the channel #${origin}]`;
      else content += `[The chat is currently set to '${origin}', outside of Discord]`;
    }

    return content;
  }

  getTimestamp(forceShow = false) {
    if (this.defaults.timestampStatus || forceShow) {
      const currentTime = utils.dateTime(3);
      const timestampNow = utils.dateTime(2);
      const lastTimestamp = this.lastMessage()?.timestamp;

      if (lastTimestamp !== undefined) {
        const lastTime = utils.parseDateTime(lastTimestamp, 2);
        const timeDifference = utils.dateTimeDifference(currentTime, lastTime);

        if (timeDifference >= this.defaults.timestampStatusTimeout || forceShow) {
          const formattedTimeDifference = utils.formatDateTimeDifference(timeDifference);
          return this.__getTimestamp(timestampNow, formattedTimeDifference);
        }
      } else {
        return this.__getTimestamp(timestampNow);
      }
    }
  }

  __getTimestamp(timestampNow, timeDifference) {
    let content = `[It is currently ${timestampNow}`;
    if (timeDifference !== undefined) content += `; it has been ${timeDifference} since the last message]`;
    else content += "]";

    return content;
  }

  lastMessage() {
    return this.messages[this.messages.length - 1];
  }

  setParams(params) {
    this.params =  { ...params, ...this.params };
  }

  setDefaults(defaults) {
    this.defaults =  { ...this.defaults, ...defaults };
  }
}

async function chatCompletion(messages, params = {}, errorRetryCount = 0) {
  let response = undefined;
  for (let i = 0; i <= errorRetryCount; i++) {
    try {
      response = await __chatCompletion(messages, params);
      break;
    } catch (error) {
      if (i === errorRetryCount) console.errorThrow("chatCompletion", error);
    }
  }
  return response;
}


// exports

export { Chat, Chathub, chatCompletion };
