//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"
const constants = require("../util/constants")

class CommandBase {
  constructor() {
    this.command
    this.commands
    this.commandtext
    this.help
  }
}

CommandBase.prototype.main = function(msg) {
  this.command = msg.content.replace(/ {2,}/g, " ").split(" ").slice(0, 2)
  this.commandtext = msg.content.replace(/ {2,}/g, " ").replace(/^([^ ]+ ){2}/g, "") // Fix removing second word of single word command
  msg.language = "english"

  if(this.commands && this.commands[this.command.join(" ")]) {
    return this.commands[this.command.join(" ")](msg)
  } else if(this.commands && this.commands[this.command[0]]) {
    return this.commands[this.command[0]](msg)
  } else if(this.default) {
    return this.default(msg)
  } else {
    msg.reply(constants.responses.MISSING_COMMAND[msg.language](this.command.join(" ")))
  }
}

module.exports = CommandBase
