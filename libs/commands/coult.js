"use strict"
const LOADDIR = "D:/Projects/Node.js/banterbot/sounds/"

class Coult {
  constructor() {}
}

Coult.prototype.trapCard = function(msg) {
  msg.member.voiceChannel.join()
    .then(voiceconnection => voiceconnection.playFile(LOADDIR + "trapcard.mp3", {volume: 0.25}))
    .catch(console.log)
}

module.exports = Coult
