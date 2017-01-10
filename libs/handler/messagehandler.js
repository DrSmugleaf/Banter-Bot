//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const Sender = require("../bridge/sender")
const sender = new Sender()

class MessageHandler {
  constructor() {}

  handle(msg) {
    sender.send(msg)
  }
}

module.exports = MessageHandler
