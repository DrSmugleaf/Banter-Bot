//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const constants = require("../../util/constants")

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
    const voiceConnection = msg.guild.voiceConnection

    if(voiceConnection) {
      voiceConnection.player.dispatcher.pause()
      return msg.reply(constants.responses.YOUTUBE.PAUSE["english"])
    }
  }
}
