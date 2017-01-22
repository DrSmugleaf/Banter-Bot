//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const constants = require("../../util/constants")
const main = require("./base/main")

module.exports = class Skip extends commando.Command {
  constructor(client) {
    super(client, {
      name: "skip",
      aliases: ["skip"],
      group: "youtube",
      memberName: "skip",
      description: "Skips the currently playing video in this server.",
      examples: ["skip"],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      }
    })

    this.votes = {}
  }

  async run(msg) {
    if(!main.isPlaying(msg.guild)) {
      return msg.reply(constants.responses.YOUTUBE.NO_CURRENTLY_PLAYING["english"])
    }
    if(!main.isSameVoiceChannel(msg.member)) {
      return msg.reply(constants.responses.YOUTUBE.NOT_SAME_VOICE_CHANNEL["english"])
    }

    const voiceConnection = msg.guild.voiceConnection
    const id = msg.guild.id

    if(voiceConnection) {
      this.votes[id] = this.votes[id] ? +1 : 1

      const votes = this.votes[id]
      const total = voiceConnection.channel.members.size - 1

      if(this.votes[id] > (voiceConnection.channel.members.size - 1) / 2) {
        main.dispatcher(msg.guild).end("skip")
        return msg.channel.send(constants.responses.YOUTUBE.SKIP.SUCCESS["english"](votes, total))
      } else {
        return msg.channel.send(constants.responses.YOUTUBE.SKIP.FAIL["english"](votes, total))
      }
    }
  }
}
