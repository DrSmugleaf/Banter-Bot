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
    this.players = new Discord.Collection() // map
    this.channel = args.channel
    this.guild = args.guild
    this.time = 5 * 1000
    this.started = false
    this.guild.client.on("message", (msg) => {
      this.onMessage(msg)
    })
  }

  addPlayer(member) {
    if(this.players.get(member.id)) return false
    this.players.set(member.id, new BlackjackPlayer({ member: member, game: this }))
    this.deck.deal(this.players.get(member.id), 2)
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
    if(!this.players.get(msg.member.id)) return
    if(this.players.get(msg.member.id).action) return
    if(!["hit", "stand", "double", "split", "surrender"].includes(msg.content)) return
    if(!this.started) {
      this.started = true
      this.timeout = setTimeout(() => {
        this.processTurn()
      }, this.time)
    }

    const player = this.players.get(msg.member.id)
    switch(msg.content) {
    case "hit":
      if(player.hand.score >= 21) {
        return msg.reply("You can't draw, score: " + player.hand.score)
      }
      this.players.get(msg.member.id).action = "hit"
      break
    case "stand":
      this.players.get(msg.member.id).action = "stand"
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
      }
    })

    if(this.players.every((player) => player.action === "stand")) {
      while (this.dealer.hand.score < 17) {
        this.deck.deal(this.dealer, 1)
      }

      this.players.forEach((player) => {
        if(this.dealer.hand.score > 21 || player.hand.score > this.dealer.hand.score) {
          this.channel.sendMessage(player.member.displayName + " wins")
        } else if(player.hand.score > 21 || player.hand.score < this.dealer.hand.score) {
          this.channel.sendMessage(this.dealer.member.displayName + " wins")
        } else {
          this.channel.sendMessage("tie")
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
    this.players.forEach((player) => {
      player.reset()
      this.deck.deal(player, 2)
    })
  }

  end() {
    this.channel.delete().catch(winston.error)
  }
}
