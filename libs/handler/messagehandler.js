"use strict"
const CommandHandler = require("./commandhandler");
const commandhandler = new CommandHandler();
const Discord = require("discord.js");
const discord = new Discord.Client();
const TranslatorHandler = require("./translatorhandler");
const translatorhandler = new TranslatorHandler();

class MessageHandler {
  constructor() {
    this.muted = [];
  };
};

MessageHandler.prototype.handleMessage = function(msg) {
  if(msg.author.bot || this.muted.indexOf(msg.author.username) > -1) { return; };
  switch(msg.content.charAt(0)) {
    case "!":
    case "+":
    case "-":
      console.log("messagehandler.js 1")
      commandhandler.getCommand(msg);
      break;
    default:
      console.log("messagehandler.js 2")
      translatorhandler.translate(msg);
      break;
  };
};

module.exports = MessageHandler;
