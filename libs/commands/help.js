//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"
const CommandBase = require("./commandbase")
const constants = require("../util/constants")

class Help extends CommandBase {
  constructor() {
    super()
  }
}

Help.prototype.default = function(msg) {
  msg.channel.sendMessage(constants.help["english"])
}

module.exports = Help
