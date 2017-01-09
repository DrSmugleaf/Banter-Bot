//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const constants = require("../../util/constants")
const request = require("request")
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
          validate: url => function() {
            if(validurl.isWebUri(url)) {
              request(url, function(e, res) {
                return !e && res.statusCode == 200
              })
            }
          }
        }
      ]
    })
  }

  async joinVoice(msg) {
    const voiceChannel = msg.member.voiceChannel
    const voiceConnection = msg.client.voiceConnection

    return new Promise(function(resolve, reject) {
      if(voiceConnection && voiceConnection == voiceChannel.connection) {
        resolve(msg.client.voiceConnection)
      } else {
        voiceChannel.join().then(voiceConnection => {
          resolve(voiceConnection)
        }).catch(reject)
      }
    })
  }

  async run(msg, args) {
    if(!msg.member.voiceChannel) {
      return msg.reply(constants.responses.NOT_A_VOICE_CHANNEL["english"])
    }

    const url = args.url
    const stream = ytdl(url, {filter: "audioonly"})

    this.joinVoice(msg).then(voiceConnection => {
      voiceConnection.playStream(
        stream,
        constants.youtube.STREAMOPTIONS
      ).on("end", () => {
        voiceConnection.disconnect()
      })
    }).catch(winston.error)

    stream.on("info", (info) => {
      return msg.reply(`Now playing ${info.title}`)
    })
  }
}
