//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const BlackjackDeck = require("./deck")

module.exports = class BlackjackGame {
  constructor(args) {
    this.deck = new BlackjackDeck()
    this.guild = args.guild
    this.players = new Array()
    this.setup(args)
  }

  setup(args) {
    args.members.forEach((member) => {
      this.players.push(member)
    })
  }

  start() {
    this.players.forEach((player) => {
      this.deck.deal(player, 2)
    })
  }
}
