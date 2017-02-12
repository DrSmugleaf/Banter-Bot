//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const BlackjackDeck = require("./deck")
const BlackjackPlayer = require("./player")
const Discord = require("discord.js")
const winston = require("winston")

module.exports = class BlackjackGame {
  constructor(args) {
    this.deck = new BlackjackDeck()
    this.dealer = new BlackjackPlayer({ member: args.guild.member(args.guild.client.user), game: this })
    this.players = new Discord.Collection()
    this.channel = args.channel
    this.guild = args.guild
    this.time = 0.1 * 1000
    this.started = false
    this.guild.client.on("message", (msg) => {
      this.onMessage(msg)
    })
  }

  async addPlayer(member) {
    if(this.players.get(member.id)) return false
    const player = new BlackjackPlayer({ member: member, game: this })
    this.players.set(member.id, player)
    await this.deck.deal(this.players.get(member.id), 2)
    if(player.hand.score === 21) player.blackjack()
    return this.players.get(member.id)
  }

  removePlayer(member) {
    if(!this.players.get(member.id)) return false
    this.players.delete(member.id)
    return member
  }

  checkWinConditions() {
    this.players.forEach((player) => {
      if(player.score > 21) {

      }
    })
  }

  onMessage(msg) {
    if(!msg.member) return
    const player = this.players.get(msg.member.id)
    if(!player) return
    if(player.action) return
    if(!player.status === "playing") return
    if(!["hit", "stand", "double", "split", "surrender"].includes(msg.content)) return
    if(!this.started) {
      this.started = true
      this.timeout = setTimeout(() => {
        this.processTurn()
      }, this.time)
    }

    switch(msg.content) {
    case "hit":
      if(player.hand.score >= 21) {
        return msg.reply("You can't draw, score: " + player.hand.score)
      }
      player.action = "hit"
      break
    case "stand":
      player.action = "stand"
      break
    }

    if(this.players.every((player) => player.action)) {
      clearTimeout(this.timeout)
      this.processTurn()
    }
  }

  processTurn() {
    this.started = false

    this.players.forEach((player) => {
      switch(player.action) {
      case "stand":
        break
      case "hit":
        player.action = null
        this.deck.deal(player, 1)
        break
      default:
        this.removePlayer(player)
        this.channel.sendMessage(`Removed player ${player.name} for inactivity`)
      }
    })

    if(this.players.every((player) => player.action === "stand")) {
      while (this.dealer.hand.score < 17) {
        this.deck.deal(this.dealer, 1)
      }

      this.players.forEach((player) => {
        if(this.dealer.hand.score > 21) {
          return player.win()
        }
        if(player.hand.score > 21) {
          return player.lose()
        }

        if(player.hand.score > this.dealer.hand.score) {
          player.win()
        } else if(player.hand.score < this.dealer.hand.score) {
          player.lose()
        } else {
          player.tie()
        }
      })
    }
  }

  reset() {
    this.deck.reset()
    this.players.forEach((player) => {
      player.reset()
    })
  }

  async setup() {
    if(this.guild.member(this.guild.client.user).hasPermission("MANAGE_CHANNELS")) {
      await this.guild.createChannel("bb-blackjack", "text").then((channel) => {
        this.channel = channel
      }).catch(winston.error)
    }

    if(this.dealer.hand.score < 17) this.deck.deal(this.dealer, 1)
    this.next()
  }

  next() {
    this.players.forEach(async (player) => {
      player.reset()
      await player.deck.deal(player, 2)
      if(player.hand.score === 21) player.blackjack()
    })
  }

  end() {
    this.channel.delete().catch(winston.error)
  }
}
