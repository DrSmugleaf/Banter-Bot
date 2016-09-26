//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"
const CommandBase = require("./commandbase")
const constants = require("../util/constants")

class Magic8Ball extends CommandBase {
  constructor() {
    super()
  }
}

Magic8Ball.prototype.default = function(msg) {
  msg.channel.sendMessage(constants.responses.MAGIC8BALL["english"][Math.floor(Math.random() * constants.responses.MAGIC8BALL["english"].length)])
}

module.exports = Magic8Ball
