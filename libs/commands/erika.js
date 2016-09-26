//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"
const CommandBase = require("./commandbase")

class Erika extends CommandBase {
  constructor() {
    super()
  }
}

Erika.prototype.default = function(msg) {
  msg.channel.sendMessage("I am dropping the bomb :bomb:")
    .then(sentmsg => setTimeout(function() {
      sentmsg.edit("I am dropping the bomb :boom:")
    }, 1500))
    .catch(this.winston.error)
}

module.exports = Erika
