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
    this.language = "english"
  }
}

CommandBase.prototype.main = function(msg) {
  this.command = msg.content.toLowerCase().replace(/ {2,}/g, " ").split(" ").slice(0, 2)
  this.commandtext = msg.content.toLowerCase().replace(/ {2,}/g, " ").replace(/^([^ ]+ ){2}/g, "")
  //this.language = "english"

  if(this.commands[this.command.join(" ")]) {
    return this.commands[this.command.join(" ")](msg)
  } else if(this.commands[this.command[0]]) {
    return this.commands[this.command[0]](msg)
  } else if(typeof this.default === "function") {
    return this.default(msg)
  } else {
    msg.reply(constants.responses.MISSING_COMMAND[this.language](this.command.join(" ")))
  }
}

module.exports = CommandBase
