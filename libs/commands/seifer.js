//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"
const fs = require("fs")
const winston = require("winston")

class Seifer {
  constructor() {}
}

Seifer.prototype.pepe = function(msg) {
  msg.channel.sendFile(fs.readFileSync("./images/pepe.png"))
    .catch(winston.error)
}

module.exports = Seifer
