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
      aliases: ["play", "econnreset"],
      group: "youtube",
      memberName: "play",
      description: "Queue a video to be played.",
      examples: ["play https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 5
      },
      args: [
        {
          key: "url",
          prompt: "What video do you want to queue?",
          type: "string",
          validate: (url) => {
            return youtube.getVideo(url).then((video) => {
              if(video.durationSeconds <= 0) return false
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
      return msg.reply(constants.responses.YOUTUBE.NOT_IN_VOICE_CHANNEL[msg.language])
    }

    if(msg.deletable) msg.delete()

    if(!msg.member.voiceChannel.joinable) {
      return msg.reply(constants.responses.YOUTUBE.CANT_CONNECT[msg.language])
    }
    if(!msg.member.voiceChannel.speakable) {
      return msg.reply(constants.responses.YOUTUBE.CANT_SPEAK[msg.language])
    }

    const queue = main.queue.get(msg.guild.id) || []
    if(queue.filter((song) => {
      return song.member.id === msg.author.id
    }).length >= 2) {
      return msg.reply(constants.responses.YOUTUBE.TOO_MANY_SONGS[msg.language])
    }

    const url = args.url
    youtube.getVideo(url).then((video) => {
      const song = new Song(msg, args, video)
      main.addToQueue(msg.guild, song)
      return msg.reply(constants.responses.YOUTUBE.PLAY[msg.language](video.title))
    }).catch(e => {
      winston.error(e)
      return msg.reply(constants.responses.YOUTUBE.ERROR[msg.language])
    })
  }
}
