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

  // async joinVoice(msg) {
  //   const voiceChannel = msg.member.voiceChannel
  //
  //   if(voiceChannel.connection === msg.client.voiceConnection) {
  //     winston.info(1)
  //     return msg.client.voiceConnection
  //   } else {
  //     voiceChannel.join().then(voiceConnection => {
  //       winston.info(2)
  //       return voiceConnection
  //     }).catch(winston.error)
  //   }
  // }

  async joinVoice(msg) {
    const voiceChannel = msg.member.voiceChannel

    return new Promise(function(resolve, reject) {
      if(voiceChannel.connection == msg.client.voiceConnection) {
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

    // var voiceConnection = this.joinVoice(msg)
    var stream = ytdl(url, {filter: "audioonly"})
    // winston.info(voiceConnection)
    // var dispatcher = voiceConnection.playStream(
    //   stream,
    //   constants.youtube.STREAMOPTIONS
    // )

    this.joinVoice(msg).then((voiceConnection) => {
      voiceConnection.playStream(
        stream,
        constants.youtube.STREAMOPTIONS
      ).on("end", () => {
        voiceConnection.disconnect()
      })
    }).catch(winston.error)

    // dispatcher.on("end", () => {
    //   voiceConnection.disconnect()
    // })
    stream.on("info", (info) => {
      console.log(info.title)
    })
    return msg.reply(`Now playing ${url}`)
  }
}
