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
      description: "Play a game of Blackjack.",
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
      game = new BlackjackGame({ dealerID: msg.client.user.id, deck: "french", decks: 1 })
      this.games[msg.guild.id] = game

      var channel
      if(msg.guild.member(msg.client.user).hasPermission("MANAGE_CHANNELS")) {
        await msg.guild.createChannel("bb-blackjack", "text").then((ch) => {
          channel = ch
        })
      } else {
        channel = msg.channel
      }
    }

    if(!game.hasPlayer(msg.member.id)) {
      game.addPlayer(msg.member.id)
      msg.reply(responses.ADDED_PLAYER[msg.language])
    }
  }
}
