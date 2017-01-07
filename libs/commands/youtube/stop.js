//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")

module.exports = class Stop extends commando.Command {
  constructor(client) {
    super(client, {
      name: "stop",
      aliases: ["stop"],
      group: "youtube",
      memberName: "stop",
      description: "Stops the currently playing video in this server",
      examples: ["stop"],
      guildOnly: true
    })
  }

  async run(msg) {
    if(msg.guild.voiceConnection) {
      msg.guild.voiceConnection.player.dispatcher.end()
      return msg.reply("Stopped the current video")
    }
  }
}
