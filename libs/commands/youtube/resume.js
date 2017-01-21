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
      guildOnly: true
    })
  }

  hasPermission(msg) {
    return msg.member.hasPermission("MUTE_MEMBERS")
  }

  async run(msg) {
    if(!main.isPaused(msg.guild)) {
      return msg.reply(constants.responses.YOUTUBE.NO_PAUSED["english"])
    }
    if(!main.isSameVoiceChannel(msg.member)) {
      return msg.reply(constants.responses.YOUTUBE.NOT_SAME_VOICE_CHANNEL["english"])
    }

    msg.guild.voiceConnection.player.dispatcher.resume()
    return msg.reply(constants.responses.YOUTUBE.RESUME["english"])
  }
}
