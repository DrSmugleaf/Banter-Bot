//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const BlackjackDeck = require("./deck")
const BlackjackPlayer = require("./player")
const winston = require("winston")

module.exports = class BlackjackGame {
  constructor(args) {
    this.deck = new BlackjackDeck()
    this.dealer = new BlackjackPlayer(args.guild.member(args.guild.client.user))
    this.players = new Object()
    this.channel = args.channel
    this.guild = args.guild
    this.timeout = 10
    this.setup(args)
    this.guild.client.on("message", (msg) => {
      this.onMessage(msg)
    })
  }

  addPlayer(member) {
    if(this.players[member.id]) return false
    this.players[member.id] = new BlackjackPlayer({ member: member, game: this })
    this.deck.deal(this.players[member.id], 2)
    return this.players[member.id]
  }

  removePlayer(member) {
    if(!this.players[member.id]) return false
    delete this.players[member.id]
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
    if(!this.players[msg.member.id]) return
    if(this.players[msg.member.id].action) return

    switch(msg.content) {
    case "draw":
      this.players[msg.member.id].action = "draw"
      break
    case "hit":
      this.players[msg.member.id].action = "hit"
      break
    }
  }

  processTurn() {
    this.players.forEach((player) => {
      switch(player.action) {
      case "draw":
        break
      case "hit":
        this.deck.deal(player, 1)
        break
      }
    })

    if(this.dealer.hand.score < 17) this.deck.deal(this.dealer, 1)
  }

  reset() {
    this.deck.reset()
    this.players.forEach((player) => {
      player.reset()
    })
  }

  async setup(args) {
    if(this.guild.member(this.guild.client.user).hasPermission("MANAGE_CHANNELS")) {
      await this.guild.createChannel("bb-blackjack", "text").then((channel) => {
        this._channel = this.channel
        this.channel = channel
      }).catch(winston.error)
    }
  }

  next() {
    this.players.reset()
    this.players.forEach((player) => {
      this.deck.deal(player, 2)
    })
  }

  end() {
    this.channel.delete().catch(winston.error)
  }
}
