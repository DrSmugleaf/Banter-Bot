//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const BlackjackGame = require("./blackjack/game")
const commando = require("discord.js-commando")

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
      game = new BlackjackGame(msg)
      this.games[msg.guild.id] = game
    }

    if(!game.players.get(msg.member.id)) {
      game.addPlayer(msg)
    } else {
      game.removePlayer(msg)
    }

    if(game.players.size < 1) {
      delete this.games[msg.guild.id]
    }
  }
}
