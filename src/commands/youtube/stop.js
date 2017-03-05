//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const main = require("./base/main")
const responses = require("../../util/constants").responses.YOUTUBE

module.exports = class StopCommand extends commando.Command {
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
    return msg.member.hasPermission("MUTE_MEMBERS") ||
      (song && song.msg.member.id && msg.member.id === song.msg.member.id)
  }

  async run(msg) {
    if(!main.isCurrentlyPlaying(msg.guild)) {
      return msg.reply(responses.NO_CURRENTLY_PLAYING[msg.language])
    }
    const voiceConnection = msg.guild.voiceConnection

    if(voiceConnection) {
      main.dispatcher(msg.guild).end("skip")
      return msg.reply(responses.STOP[msg.language])
    }
  }
}
