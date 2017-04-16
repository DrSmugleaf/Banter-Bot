//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const main = require("./base/main")
const responses = require("../../util/constants").responses.YOUTUBE

module.exports = class ResumeCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "resume",
      aliases: ["resume", "unpause"],
      group: "youtube",
      memberName: "resume",
      description: "Resume the currently playing video in this server.",
      examples: ["resume"],
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
    if(!main.isCurrentlyPaused(msg.guild)) {
      return msg.reply(responses.NO_PAUSED[msg.language])
    }
    if(!main.isSameVoiceChannel(msg.member)) {
      return msg.reply(responses.NOT_SAME_VOICE_CHANNEL[msg.language])
    }

    main.dispatcher(msg.guild).resume()
    return msg.reply(responses.RESUME[msg.language])
  }
}
