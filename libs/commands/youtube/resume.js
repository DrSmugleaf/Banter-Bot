//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const constants = require("../../util/constants")
const main = require("./base/main")

module.exports = class Resume extends commando.Command {
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
      return msg.reply(constants.responses.YOUTUBE.NO_PAUSED[msg.language])
    }
    if(!main.isSameVoiceChannel(msg.member)) {
      return msg.reply(constants.responses.YOUTUBE.NOT_SAME_VOICE_CHANNEL[msg.language])
    }

    main.dispatcher(msg.guild).resume()
    return msg.reply(constants.responses.YOUTUBE.RESUME[msg.language])
  }
}
