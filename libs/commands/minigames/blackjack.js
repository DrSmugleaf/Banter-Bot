//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const BlackjackGame = require("./blackjack/game")
const commando = require("discord.js-commando")
const responses = require("../../util/constants").responses.BLACKJACK

module.exports = class Blackjack extends commando.Command {
  constructor(client) {
    super(client, {
      name: "blackjack",
      aliases: ["blackjack"],
      group: "minigames",
      memberName: "blackjack",
      description: "Play a game of blackjack.",
      examples: ["blackjack"],
      guildOnly: true
    })

    this.client.once("ready", () => {
      this.client.guilds.forEach((guild) => {
        const channel = guild.channels.find((channel) => channel.name === "bb-blackjack")
        if(channel) channel.delete()
      })
    })

    this.games = new Object()
  }

  async run(msg) {
    var game = this.games[msg.guild.id]

    if(!game) {
      game = new BlackjackGame(msg).on("end", () => delete this.games[msg.guild.id])
      this.games[msg.guild.id] = game
    }

    if(!game.players.get(msg.member.id)) {
      game.addPlayer(msg.member)
      msg.reply(responses.ADDED_PLAYER[msg.language](game.channel.name))
    } else {
      game.removePlayer(msg.member)
      msg.reply(responses.REMOVED_PLAYER[msg.language])
    }
  }
}
