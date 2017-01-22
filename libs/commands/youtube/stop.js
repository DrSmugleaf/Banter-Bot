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
      guildOnly: true
    })
  }

  hasPermission(msg) {
    return msg.member.hasPermission("MUTE_MEMBERS")
  }

  async run(msg) {
    if(!main.isCurrentlyPlaying(msg.guild)) {
      return msg.reply(constants.responses.YOUTUBE.NO_CURRENTLY_PLAYING["english"])
    }
    const voiceConnection = msg.guild.voiceConnection

    if(voiceConnection) {
      const queue = main.queue.get(msg.guild.id)
      queue.length = 0
      main.dispatcher(msg.guild).end()

      return msg.reply(constants.responses.YOUTUBE.STOP["english"])
    }
  }
}
