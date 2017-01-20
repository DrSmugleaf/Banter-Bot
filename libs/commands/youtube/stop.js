//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
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
      guildOnly: true
    })
  }

  hasPermission(msg) {
    return msg.member.hasPermission("MUTE_MEMBERS")
  }

  async run(msg) {
    if(!main.isCurrentlyPlaying(msg.guild)) {
      return msg.reply("There is no currently playing song.")
    }
    const voiceConnection = msg.guild.voiceConnection

    if(voiceConnection) {
      const queue = main.queue.get(msg.guild.id)
      if(queue) queue[0].repeat = false

      return msg.reply("Stopped the current video")
    }
  }
}
