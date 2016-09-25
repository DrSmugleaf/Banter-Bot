//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"
const constants = require("../util/constants")

class CommandBase {
  constructor(help) {
    this.commandtext
    this.help = help
    this.language = "english"
    this.msg
  }
}

CommandBase.prototype.main = function(msg) {
  let command = msg.content.toLowerCase().replace(/ {2,}/g, " ").split(" ")
  this.commandtext = msg.content.toLowerCase().replace(/ {2,}/g, " ").replace(/^([^ ]+ ){2}/g, "")
  //this.language = "english"
  this.msg = msg
  if(this[command[1]]) {
    return this[command[1]](this.msg)
  } else if(this.default) {
    return this.default(this.msg)
  } else {
    msg.reply(constants.responses.MISSING_COMMAND[this.language](command.join(" ")))
  }
}

module.exports = CommandBase
