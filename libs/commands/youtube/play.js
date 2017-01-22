//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const constants = require("../../util/constants")
const main = require("./base/main")
const Song = require("./base/song")
const winston = require("winston")
const Youtube = require("simple-youtube-api")
const youtube = new Youtube(process.env.GOOGLE_KEY)

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
      throttling: {
        usages: 2,
        duration: 120
      },
      args: [
        {
          key: "url",
          prompt: "What video do you want to queue?",
          type: "string",
          validate: (url) => {
            return youtube.getVideo(url).then(() => {
              return true
            }).catch(() => {
              return false
            })
          }
        },
        {
          key: "repeat",
          prompt: "Repeat the video?",
          type: "boolean",
          default: false
        }
      ]
    })
  }

  async run(msg, args) {
    if(!main.isMemberInVoiceChannel(msg.member)) {
      return msg.reply(constants.responses.YOUTUBE.NOT_IN_VOICE_CHANNEL["english"])
    }

    if(msg.deletable) msg.delete()

    const url = args.url

    youtube.getVideo(url).then((video) => {
      const queue = main.queue.get(msg.guild.id) || []
      const song = new Song(msg, args, video)

      queue.push(song)
      main.queue.set(msg.guild.id, queue)

      if(queue.length <= 1) {
        main.playNext(msg.guild)
      } else {
        queue[0].repeat = false
      }

      return msg.reply(constants.responses.YOUTUBE.PLAY["english"](song.video.title))
    }).catch(e => {
      winston.error(e)
      return msg.reply(constants.responses.YOUTUBE.INVALID["english"])
    })
  }
}
