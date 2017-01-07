//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const constants = require("../../util/constants")
const request = require("request")
const streamoptions = { seek: 0, volume: 0.25 } // TODO: Move to constants
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
    var dispatcher = voiceConnection.playStream(stream, streamoptions)

    this.repeatList.set(voiceConnection.channel.guild, dispatcher)
    dispatcher.on("end", () => {
      if(this.repeatList[voiceConnection.channel.guild]) {
        this.repeat(voiceConnection, url)
      }
    })
  }

  async run(msg, args) {
    if(!msg.member.voiceChannel) {
      msg.reply(constants.responses.NOT_A_VOICE_CHANNEL["english"])
      return
    } // TODO: Change all not a voice channel responses to return the msg.reply

    const url = args.url
    msg.member.voiceChannel.join() // TODO: Check if the bot is already in the channel
      .then(voiceConnection => {
        this.repeat(voiceConnection, url)
        return msg.reply(`Now repeating ${url}`)
      })
      .catch(winston.error)
  }
}
