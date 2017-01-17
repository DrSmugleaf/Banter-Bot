//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const constants = require("../../util/constants")
const request = require("request")
const validurl = require("valid-url")
const winston = require("winston")
const ytdl = require("ytdl-core")

module.exports = class Repeat extends commando.Command {
  constructor(client) {
    super(client, {
      name: "repeat",
      aliases: ["repeat"],
      group: "youtube",
      memberName: "repeat",
      description: "Repeat a song",
      examples: ["repeat https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
      guildOnly: true,
      args: [
        {
          key: "url",
          prompt: "What video do you want to repeat?",
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

    this.repeatList = new Map()
  }

  async repeat(voiceConnection, url) {
    var stream = ytdl(url, { filter: "audioonly" })
    var dispatcher = voiceConnection.playStream(stream,
      constants.youtube.STREAMOPTIONS)
    var guild = voiceConnection.channel.guild

    this.repeatList.set(guild, dispatcher)
    dispatcher.on("end", () => {
      if(this.repeatList[guild]) {
        this.repeat(voiceConnection, url)
      }
    })
  }

  async run(msg, args) {
    if(!msg.member.voiceChannel) {
      return msg.reply(constants.responses.NOT_A_VOICE_CHANNEL["english"])
    }

    const url = args.url
    msg.member.voiceChannel.join().then(voiceConnection => {
      this.repeat(voiceConnection, url)
      return msg.reply(`Now repeating ${url}`)
    }).catch(winston.error)
  }
}
