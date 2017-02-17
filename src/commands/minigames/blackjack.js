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

    this.client.on("message", (msg) => this.onMessage(msg))

    this.games = new Object()
  }

  onMessage(msg) {
    const game = this.games[msg.guild.id]
    if(!game) return
    if(msg.channel.id !== game.channel.id) return
    if(!game.hasPlayer(msg.member.id)) return
    if(!["hit", "stand", "double", "split", "surrender"].includes(msg.content)) return
    if(game.getPlayer(msg.member.id).action) return

    game.getPlayer(msg.member.id).action = msg.content
  }

  async run(msg) {
    var game = this.games[msg.guild.id]

    if(!game) {
      game = new BlackjackGame({ dealerID: msg.client.user.id, deck: "french", decks: 1 })

      var channel
      if(msg.guild.member(msg.client.user).hasPermission("MANAGE_CHANNELS")) {
        await msg.guild.createChannel("bb-blackjack", "text").then((ch) => {
          channel = ch
        })
      } else {
        channel = msg.channel
      }

      this.games[msg.guild.id] = { game: game, channel: channel }
    }

    if(!game.hasPlayer(msg.member.id)) {
      game.addPlayer(msg.member.id)
      msg.reply(responses.ADDED_PLAYER[msg.language](channel.name))
    } else {
      game.removePlayer(msg.member.id)
      msg.reply(responses.REMOVED_PLAYED[msg.language])
    }
  }
}
