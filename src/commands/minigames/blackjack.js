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
    const blackjack = this.games[msg.guild.id]
    if(!blackjack) return
    if(msg.channel.id !== blackjack.channel.id) return
    if(!blackjack.game.hasPlayer(msg.member.id)) return

    blackjack.game.getPlayer(msg.member.id).action = msg.content
  }

  async setupGame(msg) {
    var channel
    if(msg.guild.member(msg.client.user).hasPermission("MANAGE_CHANNELS")) {
      await msg.guild.createChannel("bb-blackjack", "text").then((ch) => {
        channel = ch
      })
    } else {
      channel = msg.channel
    }

    const game = new BlackjackGame({ dealerID: msg.client.user.id, deck: "french", decks: 1 })
      .on("blackjack", (player) => channel.sendMessage(`${player.id} blackjack`))
      .on("deal", (player, card) => channel.sendMessage(`${player.id}, ${card.name}, ${player.hand.score}`))
      .on("end", () => channel.delete())
      .on("lose", (player) => channel.sendMessage(`${player.id} loses`))
      .on("removedInactive", (player) => channel.sendMessage(`${player.id} removed for inactivity`))
      .on("tie", (player) => channel.sendMessage(`${player.id} ties`))
      .on("win", (player) => channel.sendMessage(`${player.id} wins`))

    this.games[msg.guild.id] = { game: game, channel: channel }

    return this.games[msg.guild.id]
  }

  async run(msg) {
    var blackjack = this.games[msg.guild.id] || await this.setupGame(msg)

    if(!blackjack.game.hasPlayer(msg.member.id)) {
      blackjack.game.addPlayer(msg.member.id)
      msg.reply(responses.ADDED_PLAYER[msg.language](blackjack.channel.id))
    } else {
      blackjack.game.removePlayer(msg.member.id)
      msg.reply(responses.REMOVED_PLAYER[msg.language])
    }
  }
}
