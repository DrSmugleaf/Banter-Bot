//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"
const CommandBase = require("./commandbase")

class Josde extends CommandBase {
  constructor() {
    super()
  }
}

Josde.prototype.default = function(msg) {
  msg.channel.sendMessage("wew")
}

module.exports = Josde
