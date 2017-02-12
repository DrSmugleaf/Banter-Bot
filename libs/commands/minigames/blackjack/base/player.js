//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const BlackjackHand = require("./hand")

module.exports = class BlackjackPlayer {
  constructor(args) {
    this.action = null
    this.member = args.member
    this.game = args.game
    this.hand = new BlackjackHand()
    this.status = "playing"
  }

  blackjack() {
    this.status = "blackjack"
    this.game.channel.sendMessage(this.member.displayName + " blackjack")
  }

  lose() {
    this.status = "lost"
    this.game.channel.sendMessage(this.member.displayName + " loses")
  }

  tie() {
    this.status = "tie"
    this.game.channel.sendMessage(this.member.displayName + " ties")
  }

  win() {
    this.status = "won"
    this.game.channel.sendMessage(this.member.displayName + " wins")
  }

  reset() {
    this.status = "playing"
    this.hand.reset()
  }
}
