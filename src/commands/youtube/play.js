//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const main = require("./base/main")
const responses = require("../../util/constants").responses.YOUTUBE
const Song = require("./base/song")

module.exports = class PlayCommand extends commando.Command {
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
          key: "video",
          prompt: "What video do you want to queue?",
          type: "video"
        }
      ]
    })
  }

  async run(msg, args) {
    const video = args.video
    if(!main.isMemberInVoiceChannel(msg.member)) {
      return msg.reply(responses.NOT_IN_VOICE_CHANNEL[msg.language])
    }

    if(msg.deletable) msg.delete()

    const voiceChannel = msg.member.voiceChannel
    if(!voiceChannel.joinable) {
      return msg.reply(responses.CANT_CONNECT[msg.language](voiceChannel.name))
    }
    if(!voiceChannel.speakable) {
      return msg.reply(responses.CANT_SPEAK[msg.language](voiceChannel.name))
    }

    const queue = main.queue.get(msg.guild.id) || []
    if(queue.filter((song) => {
      return song.member.id === msg.author.id
    }).length >= 2) {
      return msg.reply(responses.TOO_MANY_SONGS[msg.language])
    }

    const song = new Song(msg, args)
    main.addToQueue(msg.guild, song)
    return msg.reply(responses.PLAY[msg.language](video.snippet.title))
  }
}
