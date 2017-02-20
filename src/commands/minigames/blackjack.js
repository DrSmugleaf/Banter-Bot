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

  getMember(id) {
    return this.client.users.get(id)
  }

  onMessage(msg) {
    if(!msg.guild) return
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

    const game = new BlackjackGame({ dealerID: msg.client.user.id, deck: "french", decks: 1, player: msg.member.id })
      .on("blackjack", (player) => {
        const member = this.getMember(player.id)
        channel.sendMessage(`${member} blackjack`)
      })
      .on("deal", (player, card) => {
        const member = this.getMember(player.id)
        channel.sendMessage(`${member}, dealt you 1 ${card.name}, total score: ${player.hand.score}`)
      })
      .on("end", () => {
        game.removeAllListeners()
        delete this.games[msg.guild.id]
        channel.delete()
      })
      .on("lose", (player) => {
        const member = this.getMember(player.id)
        channel.sendMessage(`${member} loses`)
      })
      .on("nextTurn", (game) => {

      })
      .on("removedInactive", (player) => {
        const member = this.getMember(player.id)
        channel.sendMessage(`${member} removed for inactivity`)
        member.sendMessage(`I removed you from a Blackjack game in ${msg.guild}`)
      })
      .on("start", (game) => {
        var response = "Dealer's hand:\n"
        game.dealer.hand.cards.forEach((card) => {
          response = response.concat(`${card.suit.symbol}${card.name}`)
        })
        response = response.concat(`. Total: ${game.dealer.hand.score}\n`)

        game.players.forEach((player) => {
          if(player.status !== "playing") return
          const member = this.getMember(player.id)
          response = response.concat(`${member.username}'s hand:\n'`)
          player.hand.cards.forEach((card) => {
            response = response.concat(`${card.suit.symbol}${card.name}`)
          })
          response = response.concat(`. Total: ${player.hand.score}. Actions you can take: ${player.availableActions.join(", ")}\n`)
        })

        channel.sendMessage(response)
      })
      .on("tie", (player) => {
        const member = this.getMember(player.id)
        channel.sendMessage(`${member} ties`)
      })
      .on("win", (player) => {
        const member = this.getMember(player.id)
        channel.sendMessage(`${member} wins`)
      })

    this.games[msg.guild.id] = { game: game, channel: channel }

    game.start()
    return msg.reply(responses.ADDED_PLAYER[msg.language](channel.id))
  }

  async run(msg) {
    var blackjack = this.games[msg.guild.id]
    if(!blackjack) return this.setupGame(msg)

    if(!blackjack.game.hasPlayer(msg.member.id)) {
      blackjack.game.addPlayer(msg.member.id)
      msg.reply(responses.ADDED_PLAYER[msg.language](blackjack.channel.id))
    } else {
      blackjack.game.removePlayer(msg.member.id)
      msg.reply(responses.REMOVED_PLAYER[msg.language])
    }
  }
}
