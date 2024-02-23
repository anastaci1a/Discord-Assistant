// dependencies

const express = require('express');

const fm = require('@lib/file-manager');
const openai = require('@lib/openai');
const responder = require('@lib/responder');

const { allAreTrue } = require('@lib/utils');


// system functions

let __systemIsReadyOverride = false;
async function __systemIsReady(req, res, next) {
  if (__systemIsReadyOverride) {
    next();
    return;
  }

  const systemChecks = [
    __chatdataIsAvailable
  ];

  try {
    const allSystemsGo = await allAreTrue(systemChecks);
    if (allSystemsGo) {
      __systemIsReadyOverride = true;
      next();
    } else {
      console.log(await __chatdataIsAvailable());
      console.log(chatdata);
      responder(res, 503, { "stack": "System is not ready, try again later." });
    }
  } catch (error) {
    console.error("System check error:", error);
    responder(res, 500, { "stack": "Error during system check." });
  }
}

let __chatdataIsAvailableOverride = false;
function __chatdataIsAvailable() {
  if (__chatdataIsAvailableOverride) return true;
  return new Promise((resolve, reject) => {
    const checkInterval = 100;
    const timeout = 5000;

    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      resolve(false);
    }, timeout);

    const intervalId = setInterval(() => {
      if (chatdata !== undefined) {
        clearTimeout(timeoutId);
        clearInterval(intervalId);
        __chatdataIsAvailableOverride = true;
        resolve(true);
      }
    }, checkInterval);
  });
}

const chats = new openai.ChatHub();
(async () => {
  try {
    await chats.load();
  } catch (error) {
    console.error("Error loading chat data:", error);

    try {
      await chats.save();
    } catch (saveError) {
      console.error("Error saving chat data:", saveError);
    }
  }
})();

async function __summarizePastMessages(chatName) {} // TODO


// export functions

async function systemIsReady(req, res, next) {
  return await __systemIsReady(req, res, next);
}

async function getChatdata(req, res) {
  responder(res, 200, chats.getJson());
}

async function ask(req, res) {
  const chat = chats.get(req.query.chat);
  const response = await chatter.ask(req.query);
  __saveChatdata(true);
  responder(res, 201, response);
}

async function addMessage(req, res) {
  const chat = chats.get(req.query.chat);
  chatter.addMessage(req.query);
  __saveChatdata(true);
  responder(res, 200);
}

async function prompt(req, res) {
  const chat = chats.get(req.query.chat);
  const response = await chatter.prompt();
  __saveChatdata(true);
  responder(res, 201, response);
}

async function addConversation(req, res) {
  __addConversation(req.query.chat);
  responder(res, 201);
}

async function deleteConversation(req, res) {}


// exports

module.exports = { systemIsReady, getChatdata, ask, addMessage, prompt, addConversation, deleteConversation };
