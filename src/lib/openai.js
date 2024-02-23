// dependencies

const axios = require('axios');
const fm = require('@lib/file-manager')
const { dateTime } = require('@lib/utils')

// system vars

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const Endpoints = Object.freeze({
  "CHAT": "https://api.openai.com/v1/chat/completions",
  "IMAGE": "https://api.openai.com/v1/images/generations"
});

const chatDefaults = {
  // CUSTOM fields - by me :)
  "full_response": false,

  // REQUIRED fields - by OpenAI

  "messages": [                  // [array]                    (a list comprising the conversation so far)
    {
      "role": "assistant",
      "content": "You are a helpful assistant."
    }
  ],
  "model": "gpt-4-0125-preview", // [string]                   (id of the model to use)

  // OPTIONAL fields - by OpenAI

  // "frequency_penalty": 0,     // [number -2 to 2 or null]   (positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim)
  // "logit_bias": null,         // [map]                      (modify the likelihood of specified tokens appearing in the completion)
  // "logprobs": false,          // [boolean or null]          (whether to return log probabilities of the output tokens or not)
  // "top_logprobs": 0,          // [number 0 to 5 or null]    (specifies the number of most likely tokens to return at each token position, each with an associated log probability.)
  "max_tokens": 4096,            // [integer or null]          (the maximum number of tokens that can be generated in the chat completion)
  // "n": 1,                     // [integer or null]          (number of chat completion choices)
  // "presence_penalty": 0,      // [number or null]           (positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics)
  // "response_format": "text",  // [string]                   (the format that the model must output, "text" or "json_object")
  // "seed": null,               // [integer or null]          (requests with the same seed and parameters attempt return the same result)
  // "stop": null,               // [array of strings or null] (stop sequences)
  // "temperature": 1,           // [number 0 to 2 or null]    (what sampling temperature to use; higher = more random, lower = more focused/deterministic)
  // "top_p": 1,                 // [number or null]           (an alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass)
  // "tools":                    // [array]                    (a list of tools the model may call)
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
  // "tool_choice": "auto",      // [string or object]         (controls which (if any) function is called by the model)
  // "user": "123456789"         // [string]                   (a unique identifier representing the end-user)
};


// system functions

async function __chatCompletion(messages, params = {}) {
  let payload = { ...chatDefaults, ...params, messages: messages };
  let { full_response, ...rest } = payload;
  payload = rest;
  console.log(payload);

  try {
    const response = await __fetchAPI(Endpoints.CHAT, payload);
    console.log(response);
    return full_response ? response.data : response.data.choices[0].message;
  } catch (error) {
    throw error;
  }
}

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
    throw error;
  }
}


// export functions

class ChatHub {
  constructor() {
    this.chats = new Map();

    this.archive = true;
    this.savePath = './data/chat-data.json';
  }

  create(name, messages = [], params = {}) {
    this.chats.set(name, new Chat(messages, params));
    return this.chats.get(name);
  }

  get(name) {
    try {
      return this.chats.get(name);
    } catch (error) {
      throw new Error("The requested chat does not exist.");
    }
  }

  delete(name) {
    return this.chats.delete(name);
  }

  async save() {
    await this.saveToJsonFile(this.savePath, this.archive);
  }

  async load() {
    await this.loadFromJsonFile(this.savePath);
  }

  async loadFromJsonFile(pathToJson) {
    try {
      let chatdata = await fm.loadJsonFromFile(pathToJson);
      this.loadFromJson(chatdata);
    } catch (error) {
      throw new Error("Could not load/parse chat data from JSON file.")
    }
  }

  async saveToJsonFile(pathToJson, archive = true) {
    try {
      let chatdata = this.getJson();
      if (archive) {
        const simpleTimestamp = dateTime(true);
        const archivePath = pathToJson.replace(/(\/)([^\/]+)(\.json)$/, `$1archive/$2_${simpleTimestamp}$3`);
        await fm.saveJsonToFile(archivePath, chatdata);
      }
      await fm.saveJsonToFile(pathToJson, chatdata);
    } catch (error) {
      console.log(error);
      throw new Error("Could not save chats to JSON file.")
    }
  }

  loadFromJson(chatdata) {
    try {
      for (let i = 0; i < chatdata.chats.length; i++) {
        let chat = chatdata.chats[index];
        let name = chat.name;
        this.create(name, chat.messages, chat.params);
      }
    } catch (error) {
      throw new Error("Could not load/parse chat data from JSON.");
    }
  }

  getJson() {
    try {
      let chatdata = {
        "chats": [],
        "timestamp": dateTime()
      };
      this.chats.forEach((chat, name) => {
        let messages = chat.messages;
        let params = chat.params;
        chatdata.chats.push({
          "name": key,
          "messages": messages,
          "params": params
        });
      });
      return chatdata;
    } catch (error) {
      throw new Error("Could not convert chats to JSON.");
    }
  }
}

class Chat {
  constructor(messages = [], params = {}, errorRetryCount = 10) {
    this.messages = messages;
    this.errorRetryCount = errorRetryCount;
    this.params = {};
    this.defaults = {
      "role": "user",
      "name": "unknown"
    };
  }

  async ask(content, role = this.defaults.role, name = this.defaults.name) {
    // ask(content: string, [role: string], [name: string])
    // ask(message: object)
    if (typeof content === 'string' || (typeof content === 'object' && content !== null && !Array.isArray(content))) {
      this.addMessage(content, role, name);
      return await this.prompt();
    }

    // ask(messages: array<object>)
    else if (Array.isArray(content) && content.every(item => typeof item === 'object' && item !== null)) {
      for (let message of content) {
        await this.ask(message); // Note: This recursively calls 'ask' which handles objects.
      }
    }

    // error handling
    else {
      throw new Error("openai.Chatter.ask: arguments not recognized.");
    }
  }

  async prompt() {
    const response = await chatCompletion(this.messages, this.params, this.errorRetryCount);
    this.addMessage(response);
    return response;
  }

  async promptNoRecord() {
    return await chatCompletion(this.messages, this.params, this.errorRetryCount);
  }

  addMessage(content, role = this.defaults.role, name = this.defaults.name) {
    // addMessage(content: string, [role: string], [name: string])
    if (typeof content === 'string') {
      name = name.replace(/ /g, "_");
      this.messages.push({
        "content": content,
        "role": role || this.defaults.role,
        "name": name || this.defaults.name
      });
    }

    // addMessage(message: object)
    else if (typeof content === 'object' && content !== null && !Array.isArray(content)) {
      this.addMessage(content.content, content.role, content.name);
    }

    // error handling
    else {
      throw new Error("openai.Chatter.addMessage: arguments not recognized.");
    }
  }

  setParams(params) {
    this.params =  { ...params, ...this.params };
  }

  setParam(param, value) {
    this.params[param] = value;
  }

  setDefaults(defaults) {
    this.defaults =  { ...defaults, ...this.defaults };
  }

  setDefault(def, value) {
    this.defaults[def] = value;
  }
}

async function chatCompletion(messages, params = {}, errorRetryCount = 0) {
  let response = undefined;
  for (let i = 0; i <= errorRetryCount; i++) {
    try {
      response = await __chatCompletion(messages, params);
      break;
    } catch (error) {
      if (i === errorRetryCount) throw error;
    }
  }
  return response;
}


// exports

module.exports = { Chat, ChatHub, chatCompletion };
