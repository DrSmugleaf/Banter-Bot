//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
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
      return msg.reply("There is no currently paused song.")
    }
    if(!main.isSameVoiceChannel(msg.member)) {
      return msg.reply("You aren't in the same voice channel.")
    }

    msg.guild.voiceConnection.player.dispatcher.resume()
    return msg.reply("Resumed the current video.")
  }
}
