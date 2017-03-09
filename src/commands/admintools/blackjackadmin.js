//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const responses = require("../../util/constants").responses.BLACKJACK_ADMIN

module.exports = class BlackjackCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "blackjack-admin",
      aliases: ["blackjack-admin", "blackjack-manager", "blackjackadmin", "blackjackmanager"],
      group: "admintools",
      memberName: "blackjack",
      description: "Admin tools for games of Blackjack being played in this server.",
      examples: ["blackjack-admin kick @DrSmugleaf#9458"],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: "mode",
          prompt: "What do you want to do? (channel, end, kick)",
          type: "string",
          validate: (value) => {
            return ["channel", "end", "kick"].includes(value.toLowerCase())
          }
        },
        {
          key: "channel",
          prompt: "What channel do you want to move this game of Blackjack to?",
          type: "string",
          default: ""
        },
        {
          key: "member",
          prompt: "Who do you want to force kick from a game of Blackjack?",
          type: "string",
          default: ""
        }
      ]
    })

    this.client.on("ready", () => {
      this.blackjack = this.client.registry.resolveCommand("minigames:blackjack")
    })
  }

  hasPermission(msg) {
    return msg.member.hasPermission("ADMINISTRATOR")
  }

  async run(msg, args) {
    const blackjack = this.blackjack.games[msg.guild.id]
    if(!blackjack) return msg.reply(responses.NO_GAMES[msg.language])
    const mode = args.mode
    var channel = args.channel
    var member = args.member

    switch (mode) {
    case "channel":
      channel = await this.args[1].promptUser(msg, channel, this.client, "channel")
      if(!channel) return
      if(channel.type !== "text") return msg.reply(responses.NOT_TEXT_CHANNEL[msg.language](channel.name))
      blackjack.channel.sendMessage(responses.MOVED_CHANNEL[msg.language](channel.id, msg.member.id))
      blackjack.channel = channel
      return msg.reply(responses.MOVED_CHANNEL_REPLY[msg.language](channel.id))
    case "end":
      blackjack.end()
      return msg.reply(responses.ENDED_GAME[msg.language](blackjack.channel.name))
    case "kick":
      member = await this.args[2].promptUser(msg, channel, this.client, "member")
      if(!member) return
      if(!blackjack.hasPlayer(member.id)) return msg.reply(responses.NO_PLAYER[msg.language](member.displayName))
      blackjack.removePlayer(member.id)
      return msg.reply(responses.KICKED_PLAYER[msg.language](member.displayName))
    }
  }
}
