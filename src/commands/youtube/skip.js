//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const responses = require("../../util/constants").responses.YOUTUBE
const main = require("./base/main")

module.exports = class SkipCommand extends commando.Command {
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
    if(!main.isPlaying(msg.guild)) return msg.reply(responses.NO_CURRENTLY_PLAYING[msg.language])
    if(!main.isSameVoiceChannel(msg.member)) return msg.reply(responses.NOT_SAME_VOICE_CHANNEL[msg.language])
    if(!this.votes[msg.guild.id]) this.votes[msg.guild.id] = []
    if(this.votes[msg.guild.id].includes(msg.author.id)) return msg.reply(responses.SKIP.ALREADY_VOTED[msg.language])

    if(main.dispatcher(msg.guild)) {
      main.dispatcher(msg.guild).on("end", () => {
        this.votes[msg.guild.id] = []
      })
    }

    this.votes[msg.guild.id].push(msg.author.id)

    const votes = this.votes[msg.guild.id].length
    const total = msg.guild.voiceConnection.channel.members.filter((member) => {
      return !member.user.bot
    }).size

    if(this.votes[msg.guild.id].length >= total / 2) {
      this.votes[msg.guild.id] = []
      main.dispatcher(msg.guild).end("skip")
      return msg.channel.sendMessage(responses.SKIP.SUCCESS[msg.language](votes, total))
    } else {
      return msg.channel.sendMessage(responses.SKIP.FAIL[msg.language](votes, total))
    }
  }
}
