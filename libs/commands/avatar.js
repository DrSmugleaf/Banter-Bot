//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"
const CommandBase = require("./commandbase")
const request = require("request").defaults({encoding: null})
const winston = require("winston")

class Avatar extends CommandBase {
  constructor() {
    super()
  }
}

Avatar.prototype.default = function(msg) {
  request.get(msg.content.replace("!avatar ", ""), function(e, res, body) {
    if(!e && res.statusCode == 200) {
      msg.client.user.setAvatar(new Buffer(body))
        .catch(winston.error)
    }
  })
}

module.exports = Avatar
