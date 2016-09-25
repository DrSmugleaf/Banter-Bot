//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"
const CommandBase = require("./commandbase")
const LOADDIR = "./sounds/"
const winston = require("winston")

class Coult extends CommandBase {
  constructor() {
    super()
  }
}

Coult.prototype.default = function(msg) {
  if(!msg.member.voiceChannel) {
    msg.reply("No estás en un canal de voz")
    return
  }
  msg.member.voiceChannel.join()
    .then(voiceconnection => {
      let dispatcher = voiceconnection.playFile(LOADDIR + "trapcard.mp3", {volume: 0.25})
      dispatcher.on("end", () => {
        voiceconnection.disconnect()
      })
    })
    .catch(winston.error)
}

module.exports = Coult
