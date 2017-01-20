//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const constants = require("../../util/constants")
const main = require("./base/main")
const oneLine = require("common-tags").oneLine

module.exports = class Skip extends commando.Command {
  constructor(client) {
    super(client, {
      name: "skip",
      aliases: ["skip"],
      group: "youtube",
      memberName: "skip",
      description: "Skips the currently playing video in this server.",
      examples: ["skip"],
      guildOnly: true
    })

    this.votes = {}
  }

  async run(msg) {
    if(!main.isCurrentlyPlaying(msg.guild)) {
      return msg.reply("There is no currently playing song.")
    }
    if(!main.isSameVoiceChannel(msg.member)) {
      return msg.reply("You arent in the voice channel")
    }

    const voiceConnection = msg.guild.voiceConnection
    const id = msg.guild.id

    if(voiceConnection) {
      this.votes[id] = this.votes[id] ? +1 : 1

      if(this.votes[id] > (voiceConnection.channel.members.size - 1) / 2) {
        main.dispatcher(msg.guild).end("skip")

        return msg.channel.send(oneLine`
          ${this.votes[id]} out of ${voiceConnection.channel.members.size - 1}
          members voted to skip, skipped the current video
        `)
      } else {
        return msg.reply(oneLine`
          ${this.votes[id]} out of ${voiceConnection.channel.members.size - 1}
          members want to skip the current video
        `)
      }
    }
  }
}
