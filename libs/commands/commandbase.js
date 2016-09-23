//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"

class CommandBase {
  constructor() {
    this.commandtext
    this.msg
  }
}

CommandBase.prototype.main = function(msg) {
  this.commandtext = msg.content.toLowerCase().split(" ")
  this.msg = msg
  if(this[this.commandtext[1]]) {
    return this[this.commandtext[1]](this.msg)
  } else {
    msg.reply("Ese comando no existe")
  }
}

module.exports = CommandBase
