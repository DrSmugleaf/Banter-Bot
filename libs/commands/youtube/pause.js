//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")

module.exports = class Pause extends commando.Command {
  constructor(client) {
    super(client, {
      name: "pause",
      aliases: ["pause"],
      group: "youtube",
      memberName: "pause",
      description: "Pause the currently playing video in this server",
      examples: ["pause"],
      guildOnly: true
    })
  }

  async run(msg) {
    if(msg.guild.voiceConnection) {
      msg.guild.voiceConnection.player.dispatcher.pause()
      msg.reply("Paused the current video")
    }
  }
}
