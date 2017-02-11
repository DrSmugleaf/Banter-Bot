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
    this.players = new Array()
    this.channel = args.channel
    this.guild = args.guild
    this.setup(args)
    this.guild.client.on("message", (msg) => {
      this.onMessage(msg)
    })
  }

  onMessage(msg) {
    if(!msg.member) return
    if(this.players.some((player) => {
      return player.member.id === msg.member.id
    })) {
      
    }
  }

  async setup(args) {
    if(args.guild.member(args.guild.client.user).hasPermission("MANAGE_CHANNELS")) {
      await args.guild.createChannel("Blackjack", "text").then((channel) => {
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
