"use strict"
const LOADDIR = "D:/Projects/Node.js/banterbot/libs/commands/"

class Coult {
  constructor() {}
}

Coult.prototype.test1 = function(discord, msg) {
  msg.author.voiceChannel.join()
}

Coult.prototype.trapCard = function(discord, msg) {
  var filePath = LOADDIR + "trapcard"
  discord.internal.voiceConnection.playFile(filePath, {seek: 5, volume: 1}, function(e, intent) {
    if(e) { throw e }
  })
  console.log(discord.internal.voiceConnection.playFile(filePath))
}

module.exports = Coult
