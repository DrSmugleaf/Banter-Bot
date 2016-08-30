"use strict"
const CommandHandler = require("./commandhandler");
const commandhandler = new CommandHandler();
const Discord = require("discord.js");
const discord = new Discord.Client();
const token = process.env.DISCORD_TOKEN;
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
      return commandhandler.getCommand(msg);
      break;
    default:
      if(msg.channel === "development") {
        return discord.sendMessage("serbia", translatorhandler.translate(msg, "Spanish", "English"));
      } else if(msg.channel === "serbia") {
        return discord.sendMessage("development", translatorhandler.translate(msg, "English", "Spanish"));
      }
      break;
  };
};

module.exports = MessageHandler;
