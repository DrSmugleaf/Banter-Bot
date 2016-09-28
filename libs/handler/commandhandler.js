//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"
const constants = require("../util/constants")
const commands = require("../commands")

class CommandHandler {
  constructor() {
    this.admin = ["DrSmugleaf"]
    this.muted = []
    this.english = ["Coult909"]
  }
}

CommandHandler.prototype.getCommand = function(msg) {
  let command = msg.content.toLowerCase().split(" ")

  if(commands[command[0].substring(1)]) {
    commands[command[0].substring(1)].main(msg)
  } else {
    msg.reply(constants.errors.MISSING_COMMAND["english"](command.join(" ")))
  }
}

module.exports = CommandHandler
