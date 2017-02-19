//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const main = require("./base/main")
const responses = require("../../util/constants").responses

module.exports = class Pause extends commando.Command {
  constructor(client) {
    super(client, {
      name: "pause",
      aliases: ["pause"],
      group: "youtube",
      memberName: "pause",
      description: "Pause the currently playing video in this server.",
      examples: ["pause"],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
    })

    this.votes = {}
  }

  hasPermission(msg) {
    return msg.member.hasPermission("MUTE_MEMBERS")
  }

  async run(msg) {
    if(!main.isCurrentlyPlaying(msg.guild)) {
      return msg.reply(responses.NO_CURRENTLY_PLAYING[msg.language])
    }
    if(!main.isSameVoiceChannel(msg.member)) {
      return msg.reply(responses.NOT_SAME_VOICE_CHANNEL[msg.language])
    }

    main.dispatcher(msg.guild).pause()
    return msg.reply(responses.PAUSE[msg.language])
  }
}
