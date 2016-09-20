//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"
const LOADDIR = "./sounds/"
const winston = require("winston")

class Coult {
  constructor() {}
}

Coult.prototype.trapCard = function(msg) {
  if(!msg.member.voiceChannel) {
    msg.reply("No estás en un canal de voz")
    return
  }
  msg.member.voiceChannel.join()
    .then(voiceconnection => voiceconnection.playFile(LOADDIR + "trapcard.mp3", {volume: 0.25}))
    .catch(winston.error)
}

module.exports = Coult
