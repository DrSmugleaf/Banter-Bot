"use strict"
const CommandHandler = require("./commandhandler")
const commandhandler = new CommandHandler()
const TranslatorHandler = require("./translatorhandler")
const translatorhandler = new TranslatorHandler()

class MessageHandler {
  constructor() {}
}

MessageHandler.prototype.handleMessage = function(discord, msg) {
  switch(msg.content.charAt(0)) {
    case "!":
    case "+":
    case "-":
      commandhandler.getCommand(discord, msg)
      break
    default:
      translatorhandler.translate(discord, msg, {"general": "spanish", "serbia": "english"})
      break
  }
}

module.exports = MessageHandler
