//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const BlackjackDeck = require("./deck")
const BlackjackPlayer = require("./player")
const EventEmitter = require("events").EventEmitter
const responses = require("../../../util/constants").responses.BLACKJACK
const Discord = require("discord.js")
const winston = require("winston")

module.exports = class BlackjackGame extends EventEmitter {
  constructor(msg) {
    super()

    this.channel = msg.channel

    this.guild = msg.guild

    this.deck = new BlackjackDeck()

    this.dealer = new BlackjackPlayer({ member: this.guild.member(this.guild.client.user), game: this })

    this.players = new Discord.Collection()

    this.time = 0.1 * 5000

    this.started = false

    this.guild.client.on("message", (msg) => {
      if(!msg.member || msg.channel.id !== this.channel.id) return
      this.onMessage(msg)
    })

    this.setup()
  }

  async addPlayer(member) {
    const player = new BlackjackPlayer({ member: member, game: this })
    this.players.set(member.id, player)
    return this.players.get(member.id)
  }

  removePlayer(member) {
    this.players.delete(member.id)
    if(this.players.size < 1) this.end()
    return member
  }

  onMessage(msg) {
    const player = this.players.get(msg.member.id)
    if(!player || player.action || player.status !== "playing") return
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
        this.channel.sendMessage(responses.REMOVED_INACTIVE[this.guild.language](player.member.displayName))
      }
    })

    if(this.players.every((player) => player.action === "stand")) {
      while (this.dealer.hand.score < 17) {
        this.deck.deal(this.dealer, 1)
      }

      this.players.forEach((player) => {
        if(player.hand.score > 21) {
          return player.lose()
        }
        if(this.dealer.hand.score > 21) {
          return player.win()
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

    this.next()
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

    this.next()
  }

  next() {
    this.deck.deal(this.dealer, 1)

    this.players.forEach(async (player) => {
      player.reset()
      await this.deck.deal(player, 2)
      if(player.hand.score === 21) player.blackjack()
    })
  }

  end() {
    this.emit("end")
  }
}
