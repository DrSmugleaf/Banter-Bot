//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")

module.exports = class Resume extends commando.Command {
  constructor(client) {
    super(client, {
      name: "resume",
      aliases: ["resume"],
      group: "youtube",
      memberName: "resume",
      description: "Resume the currently playing video in this server",
      examples: ["resume"],
      guildOnly: true
    })
  }

  async run(msg) {
    if(msg.guild.voiceConnection) {
      msg.guild.voiceConnection.player.dispatcher.resume()
      msg.reply("Resumed the current video")
    }
  }
}
