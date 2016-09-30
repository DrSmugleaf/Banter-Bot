//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"
const CommandBase = require("./commandbase")
const constants = require("../util/constants")

class Erika extends CommandBase {
  constructor() {
    super()
  }
}

Erika.prototype.default = function(msg) {
  msg.channel.sendMessage(constants.responses.ERIKA.BEFORE[this.language])
    .then(sentmsg => setTimeout(function() {
      sentmsg.edit(constants.responses.ERIKA.AFTER[this.language])
    }, 1500))
    .catch(this.winston.error)
}

module.exports = Erika
