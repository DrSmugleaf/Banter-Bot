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
    if(this.players[msg.member.id]) {

    }
  }

  reset() {
    this.deck.reset()
    this.players.forEach((player) => {
      player.reset()
    })
  }

  async setup(args) {
    if(args.guild.member(args.guild.client.user).hasPermission("MANAGE_CHANNELS")) {
      await args.guild.createChannel("bb-blackjack", "text").then((channel) => {
        this._channel = args.channel
        this.channel = channel
      }).catch(winston.error)
    }

    args.members.forEach((member) => {
      const player = new BlackjackPlayer({ member: member, game: this })
      this.players.push(player)
    })
  }

  start() {
    this.players.forEach((player) => {
      this.deck.deal(player, 2)
    })
  }

  end() {
    this.channel.delete().catch(winston.error)
  }
}
