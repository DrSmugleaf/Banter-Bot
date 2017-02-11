//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const BlackjackDeck = require("./deck")
const BlackjackPlayer = require("./player")

module.exports = class BlackjackGame {
  constructor(args) {
    this.deck = new BlackjackDeck()
    this.players = new Array()
    this.channel = args.channel
    this.guild = args.guild
    this.setup(args)
    this.guild.client.on("message", () => {
      this.onMessage(msg)
    })
  }

  onMessage(msg) {

  }

  setup(args) {
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
}
