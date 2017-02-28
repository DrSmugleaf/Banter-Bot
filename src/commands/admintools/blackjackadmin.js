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
          prompt: "What do you want to do? (end, kick)",
          type: "string",
          validate: (value) => {
            return ["end", "kick"].includes(value.toLowerCase())
          }
        },
        {
          key: "member",
          prompt: "Who do you want to force kick from a game of Blackjack?",
          type: "member",
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
    var member = args.member

    switch (mode) {
    case "end":
      blackjack.end()
      return msg.reply(responses.ENDED_GAME[msg.language](blackjack.channel.name))
    case "kick":
      if(!member) member = await this.args[1].obtainSimple(msg)
      if(!member) return
      blackjack.removePlayer(member.id)
      return msg.reply(responses.KICKED_PLAYER[msg.language](member.displayName))
    }
  }
}
