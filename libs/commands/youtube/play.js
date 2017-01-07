//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const constants = require("../../util/constants")
const commando = require("discord.js-commando")
const request = require("request")
const streamoptions = {seek: 0, volume: 0.25}
const validurl = require("valid-url")
const winston = require("winston")
const ytdl = require("ytdl-core")

module.exports = class Play extends commando.Command {
  constructor(client) {
    super(client, {
      name: "play",
      aliases: ["play"],
      group: "youtube",
      memberName: "play",
      description: "Play a video's sound from youtube to your voice channel",
      examples: ["play https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
      guildOnly: true,
      args: [
        {
          key: "url",
          prompt: "What video do you want to hear?",
          type: "string",
          validate: val => function() {
            if(validurl.isWebUri(val)) {
              request(val, function(e, res) {
                return !e && res.statusCode == 200
              })
            }
          }
        }
      ]
    })
  }

  async run(msg, args) {
    if(!msg.member.voiceChannel) {
      msg.reply(constants.responses.NOT_A_VOICE_CHANNEL["english"])
      return
    }

    const url = args.url
    msg.member.voiceChannel.join()
      .then(voiceconnection => {
        let stream = ytdl(url, {filter: "audioonly"})
        let dispatcher = voiceconnection.playStream(stream, streamoptions)
        dispatcher.on("end", () => {
          voiceconnection.disconnect()
        })
      })
      .catch(winston.error)
  }
}
