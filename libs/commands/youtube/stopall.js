//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const constants = require("../../util/constants")
const main = require("./base/main")

module.exports = class StopAll extends commando.Command {
  constructor(client) {
    super(client, {
      name: "stop-all",
      aliases: ["stop-all", "stopall", "all-stop", "allstop"],
      group: "youtube",
      memberName: "stop-all",
      description: "Stops and removes all songs in the queue.",
      examples: ["stop-all"],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      }
    })
  }

  hasPermission(msg) {
    return msg.member.hasPermission("MUTE_MEMBERS")
  }

  async run(msg) {
    if(!main.isCurrentlyPlaying(msg.guild)) {
      return msg.reply(constants.responses.YOUTUBE.NO_CURRENTLY_PLAYING[msg.language])
    }
    const voiceConnection = msg.guild.voiceConnection

    if(voiceConnection) {
      main.queue.set(msg.guild.id, [])
      main.dispatcher(msg.guild).end()

      return msg.reply(constants.responses.YOUTUBE.STOP_ALL[msg.language])
    }
  }
}
