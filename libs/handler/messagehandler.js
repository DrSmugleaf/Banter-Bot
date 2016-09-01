"use strict"
const CommandHandler = require("./commandhandler");
const commandhandler = new CommandHandler();
const TranslatorHandler = require("./translatorhandler");
const translatorhandler = new TranslatorHandler();

class MessageHandler {
  constructor() {
    this.muted = [];
  };
};

MessageHandler.prototype.handleMessage = function(discord, msg) {
  if(msg.author.bot || this.muted.indexOf(msg.author.username) > -1) { return; };
  switch(msg.content.charAt(0)) {
    case "!":
    case "+":
    case "-":
      commandhandler.getCommand(discord, msg);
      break;
    default:
      translatorhandler.translate(discord, msg, {"general": "Spanish", "serbia": "English"});
      break;
  };
};

module.exports = MessageHandler;
