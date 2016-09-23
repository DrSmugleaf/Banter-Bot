//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"
const CommandBase = require("./commandbase")
const https = require("https")
const streamoptions = {seek: 0, volume: 0.25}
const validurl = require("valid-url")
const winston = require("winston")
const ytdl = require("ytdl-core")

class Youtube extends CommandBase {
  constructor() {
    super()
  }
}

Youtube.prototype.play = function(msg) {
  if(!msg.member.voiceChannel) {
    msg.reply("No estás en un canal de voz")
    return
  }

  if(validurl.isUri(this.commandtext[2])) {
    https.get(this.commandtext[2], function(res) {
      if(res.statusCode == 200) {
        msg.member.voiceChannel.join()
          .then(voiceconnection => {
            let stream = ytdl(msg.content, {filter: "audioonly"})
            let dispatcher = voiceconnection.playStream(stream, streamoptions)
            dispatcher.on("end", () => {
              voiceconnection.disconnect()
            })
          })
          .catch(winston.error)
      }
    })
  } else {
    msg.reply("URL inválido, formato: !youtube play URL")
    return
  }
}

Youtube.prototype.pause = function() {
  this.video.pause()
}

module.exports = Youtube
