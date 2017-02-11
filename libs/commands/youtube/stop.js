//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const constants = require("../../util/constants")
const main = require("./base/main")

module.exports = class Stop extends commando.Command {
  constructor(client) {
    super(client, {
      name: "stop",
      aliases: ["stop"],
      group: "youtube",
      memberName: "stop",
      description: "Stops the currently playing video in this server.",
      examples: ["stop"],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      }
    })
  }

  hasPermission(msg) {
    if(!msg.member) return
    var song = main.queue.get(msg.guild.id)
    if(song) song = song[0]
    return msg.member.hasPermission("MUTE_MEMBERS") || msg.member.id === song.member.id
  }

  async run(msg) {
    if(!main.isCurrentlyPlaying(msg.guild)) {
      return msg.reply(constants.responses.YOUTUBE.NO_CURRENTLY_PLAYING[msg.language])
    }
    const voiceConnection = msg.guild.voiceConnection

    if(voiceConnection) {
      main.dispatcher(msg.guild).end("skip")
      return msg.reply(constants.responses.YOUTUBE.STOP[msg.language])
    }
  }
}
