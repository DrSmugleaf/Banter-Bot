//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const constants = require("../../util/constants")
const request = require("request")
const validurl = require("valid-url")
const main = require("./base/main")

module.exports = class Play extends commando.Command {
  constructor(client) {
    super(client, {
      name: "play",
      aliases: ["play"],
      group: "youtube",
      memberName: "play",
      description: "Queue a video to be played.",
      examples: ["play https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
      guildOnly: true,
      args: [
        {
          key: "url",
          prompt: "What video do you want to queue?",
          type: "string",
          validate: (url) => {
            if(validurl.isWebUri(url)) {
              return request(url, function(e, res) {
                return !e && res.statusCode === 200
              })
            }
          }
        },
        {
          key: "repeat",
          prompt: "Repeat the video?",
          type: "string",
          default: false,
          parse: (repeat) => {
            if(["yes", "true", true].includes(repeat)) return true
            return false
          }
        }
      ]
    })
  }

  async run(msg, args) {
    if(!main.isMemberInVoiceChannel(msg.member)) {
      return constants.responses.NOT_A_VOICE_CHANNEL["english"]
    }

    if(msg.deletable) msg.delete()

    const url = args.url
    const repeat = args.repeat
    const queue = main.queue.get(msg.guild.id) || []

    const song = {
      channel: msg.channel,
      guild: msg.guild,
      member: msg.member,
      url: url,
      repeat: repeat,
      repeated: false
    }

    queue.push(song)
    main.queue.set(msg.guild.id, queue)

    if(queue.length <= 1) {
      main.playNext(msg.guild)
    } else {
      queue[0].repeat = false
    }
  }
}
