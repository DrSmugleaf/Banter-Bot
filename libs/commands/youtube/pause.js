//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const constants = require("../../util/constants")
const main = require("./base/main")

module.exports = class Pause extends commando.Command {
  constructor(client) {
    super(client, {
      name: "pause",
      aliases: ["pause"],
      group: "youtube",
      memberName: "pause",
      description: "Pause the currently playing video in this server.",
      examples: ["pause"],
      guildOnly: true
    })

    this.votes = {}
  }

  hasPermission(msg) {
    return msg.member.hasPermission("MUTE_MEMBERS")
  }

  async run(msg) {
    if(!main.isCurrentlyPlaying(msg.guild)) {
      return msg.reply("There is no currently playing song.")
    }
    if(!main.isSameVoiceChannel(msg.member)) {
      return msg.reply("You aren't in the same voice channel.")
    }

    msg.guild.voiceConnection.player.dispatcher.pause()
    return msg.reply(constants.responses.YOUTUBE.PAUSE["english"])
  }
}
