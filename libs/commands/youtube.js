//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"
const CommandBase = require("./commandbase")
const constants = require("../util/constants")
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
  if(!msg.guild || !msg.guild.available) {
    msg.channel.sendMessage(constants.responses.NOT_A_SERVER(msg.language))
    return
  }
  if(!msg.member.voiceChannel) {
    msg.reply(constants.responses.NOT_A_VOICE_CHANNEL[msg.language])
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
    msg.reply(constants.responses.YOUTUBE.INVALID[msg.language])
    return
  }
}

Youtube.prototype.pause = function() {
  this.video.pause()
}

module.exports = Youtube
